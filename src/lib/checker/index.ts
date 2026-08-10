import { writable, get } from 'svelte/store';
import { sites } from '$lib/config/sites';
import { storageGet, storageSet } from '$lib/storage';

const ENTRIES_LIMIT = 100;
const CHECK_INTERVAL = 5000;
const FETCH_TIMEOUT = 10000;
const UPTIME_DAYS = 90;
const DAY_MS = 24 * 60 * 60 * 1000;
const UPTIME_STORAGE_KEY = 'k9crypt.uptime.v1';

export interface Entry {
	time: number;
	up: boolean;
	latency: number;
}

interface Groups {
	[group: string]: { [site: string]: boolean | null };
}

interface Records {
	[site: string]: Entry[];
}

export interface Outages {
	[site: string]: {
		period: number | null;
		started: number | null;
	};
}

export interface Incident {
	site: string;
	startedAt: number;
	resolvedAt: number | null;
	duration: number; // ms, updated live for ongoing incidents
}

export interface DayRecord {
	date: string; // YYYY-MM-DD
	upSeconds: number;
	checks: number;
}

type DailyUptime = Record<string, DayRecord[]>;

export const states = writable<Groups>({});
export const records = writable<Records>({});
export const outages = writable<Outages>({});
export const incidents = writable<Incident[]>([]);
export const dailyUptime = writable<DailyUptime>({});

function dayKey(time: number): string {
	const d = new Date(time);
	const month = String(d.getMonth() + 1).padStart(2, '0');
	const day = String(d.getDate()).padStart(2, '0');
	return `${d.getFullYear()}-${month}-${day}`;
}

// load persisted uptime history; IndexedDB degrades to in-memory on failure
async function loadDailyUptime(): Promise<DailyUptime> {
	const data = await storageGet<DailyUptime>(UPTIME_STORAGE_KEY);
	return data ?? {};
}

async function persistDailyUptime(data: DailyUptime): Promise<void> {
	await storageSet(UPTIME_STORAGE_KEY, data);
}

function trimTo90Days(data: DailyUptime): DailyUptime {
	const cutoff = dayKey(Date.now() - (UPTIME_DAYS - 1) * DAY_MS);
	for (const site of Object.keys(data)) {
		data[site] = data[site].filter((d) => d.date >= cutoff);
		if (data[site].length === 0) delete data[site];
	}
	return data;
}

function startOfToday(): number {
	const now = new Date();
	now.setHours(0, 0, 0, 0);
	return now.getTime();
}

class Monitor {
	private timer: ReturnType<typeof setInterval> | null = null;
	private initializing = false;

	// perform http check with timeout protection
	private async probe(target: string): Promise<{ up: boolean; latency: number }> {
		const start = performance.now();

		try {
			const controller = new AbortController();
			const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT);

			const response = await fetch(`/api/check`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ id: target }),
				signal: controller.signal
			});

			clearTimeout(timeout);

			// only HTTP 200 means the site is up
			const up = response.status === 200;
			return { up, latency: Math.round(performance.now() - start) };
		} catch {
			return { up: false, latency: Math.round(performance.now() - start) };
		}
	}

	// update status map with new site state
	private setStatus(groups: Groups, group: string, site: string, up: boolean): void {
		groups[group] ??= {};
		groups[group][site] = up;
	}

	// maintain rolling history with size limit
	private addEntry(current: Records, updated: Records, site: string, entry: Entry): void {
		const existing = current[site] ?? [];
		const entries = [...existing, entry];

		updated[site] = entries.length > ENTRIES_LIMIT ? entries.slice(-ENTRIES_LIMIT) : entries;
	}

	// calculate current outage duration if site is down
	private trackOutage(entries: Entry[], now: number): Outages[string] {
		if (!entries.length) return { period: null, started: null };

		const recent = entries[entries.length - 1];
		if (recent.up) return { period: null, started: null };

		// find last time site was up
		const lastUpIndex = entries.findLastIndex((entry) => entry.up);

		if (lastUpIndex === -1) {
			// site has never been up in recorded history
			const firstEntry = entries[0];
			return {
				period: now - firstEntry.time,
				started: firstEntry.time
			};
		}

		const lastUpTime = entries[lastUpIndex].time;
		return { period: now - lastUpTime, started: null };
	}

	// detect resolved and ongoing incidents from entry transitions
	private computeIncidents(updated: Records, now: number): Incident[] {
		const list: Incident[] = [];
		const ongoing = new Map<string, { startedAt: number }>();

		Object.entries(updated).forEach(([site, entries]) => {
			let lastUp: Entry | null = null;

			for (const entry of entries) {
				if (entry.up) {
					if (lastUp !== null && !lastUp.up) {
						// down -> up transition resolves an incident
						list.push({
							site,
							startedAt: lastUp.time,
							resolvedAt: entry.time,
							duration: entry.time - lastUp.time
						});
					}
					lastUp = entry;
				} else {
					if (lastUp === null || lastUp.up) {
						// start of a new down window (or leading edge)
						if (!ongoing.has(site)) {
							ongoing.set(site, { startedAt: entry.time });
						}
						lastUp = entry;
					}
				}
			}

			// still down at the end of history -> unresolved
			const tail = entries[entries.length - 1];
			if (tail && !tail.up && ongoing.has(site)) {
				const start = ongoing.get(site)!.startedAt;
				list.push({
					site,
					startedAt: start,
					resolvedAt: null,
					duration: now - start
				});
			}
		});

		return list.sort((a, b) => b.startedAt - a.startedAt);
	}

	// cached table avoids an IndexedDB read on every 5s scan
	private uptimeCache: DailyUptime | null = null;

	// merge each sample into the persisted 90-day uptime table
	private async recordUptime(updated: Records, now: number): Promise<void> {
		if (!this.uptimeCache) {
			this.uptimeCache = trimTo90Days(await loadDailyUptime());
		}
		const table = this.uptimeCache;
		const today = dayKey(now);
		const sampleMs = CHECK_INTERVAL;

		Object.entries(updated).forEach(([site, entries]) => {
			const last = entries[entries.length - 1];
			if (!last) return;

			const days = (table[site] ??= []);
			let day = days[days.length - 1];
			if (!day || day.date !== today) {
				day = { date: today, upSeconds: 0, checks: 0 };
				days.push(day);
			}

			day.checks++;
			if (last.up) day.upSeconds += sampleMs / 1000;

			// estimate earlier days from in-memory entries when history is fresh
			const cutoff = now - UPTIME_DAYS * DAY_MS;
			for (const entry of entries) {
				if (entry.time < cutoff) continue;
				const key = dayKey(entry.time);
				if (key === today) continue;
				let d = days.find((x) => x.date === key);
				if (!d) {
					d = { date: key, upSeconds: 0, checks: 0 };
					days.push(d);
				}
				d.checks++;
				if (entry.up) d.upSeconds += sampleMs / 1000;
			}

			days.sort((a, b) => a.date.localeCompare(b.date));
		});

		await persistDailyUptime(table);
		dailyUptime.set(table);
	}

	// main monitoring cycle
	public async scan(): Promise<void> {
		const current = get(records);
		const groups: Groups = {};
		const updated: Records = {};

		const checks = sites.map(async (config) => {
			const { id, name, group } = config;
			const result = await this.probe(id);
			const time = Date.now();

			return { name, group, ...result, time };
		});

		const results = await Promise.all(checks);
		const now = Date.now();

		for (const { name, group, up, latency, time } of results) {
			this.setStatus(groups, group, name, up);
			this.addEntry(current, updated, name, { time, up, latency });
		}

		states.set(groups);
		records.set(updated);
		this.updateOutages();
		incidents.set(this.computeIncidents(updated, now));
		await this.recordUptime(updated, now);
	}

	// calculate outage statistics for all monitored sites
	private updateOutages(): void {
		const current = get(records);
		const tracked: Outages = {};
		const now = Date.now();

		Object.entries(current).forEach(([site, entries]) => {
			tracked[site] = this.trackOutage(entries, now);
		});

		outages.set(tracked);
	}

	// begin monitoring with initial scan
	public async start(): Promise<void> {
		if (this.timer || this.initializing) return;
		this.initializing = true;

		try {
			// hydrate the in-memory cache and store before the first scan
			this.uptimeCache = trimTo90Days(await loadDailyUptime());
			dailyUptime.set(this.uptimeCache);

			await this.scan();
			this.timer = setInterval(() => this.scan(), CHECK_INTERVAL);
		} finally {
			this.initializing = false;
		}
	}

	// stop monitoring and cleanup
	public stop(): void {
		if (!this.timer) return;

		clearInterval(this.timer);
		this.timer = null;
	}
}

export const monitor = new Monitor();

export { startOfToday };
