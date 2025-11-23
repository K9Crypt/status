import { writable, get } from "svelte/store";
import { sites } from "$lib/config/sites";

const ENTRIES_LIMIT = 100;
const CHECK_INTERVAL = 5000;
const FETCH_TIMEOUT = 10000;

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

export const states = writable<Groups>({});
export const records = writable<Records>({});
export const outages = writable<Outages>({});

class Monitor {
    private timer: ReturnType<typeof setInterval> | null = null;

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
        const lastUpIndex = entries.findLastIndex(entry => entry.up);
        
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
        
        for (const { name, group, up, latency, time } of results) {
            this.setStatus(groups, group, name, up);
            this.addEntry(current, updated, name, { time, up, latency });
        }
        
        states.set(groups);
        records.set(updated);
        this.updateOutages();
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
    public start(): void {
        if (this.timer) return;
        
        this.scan();
        this.timer = setInterval(() => this.scan(), CHECK_INTERVAL);
    }

    // stop monitoring and cleanup
    public stop(): void {
        if (!this.timer) return;
        
        clearInterval(this.timer);
        this.timer = null;
    }
}

export const monitor = new Monitor();