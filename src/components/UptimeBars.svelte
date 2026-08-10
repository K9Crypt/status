<script lang="ts">
	import { dailyUptime, startOfToday } from '$lib/checker';
	import type { DayRecord } from '$lib/checker';
	import { derived } from 'svelte/store';

	export let site: string;

	const DAY_MS = 24 * 60 * 60 * 1000;

	// last 90 days (including today) as { date, dayUptime } list
	const days = derived([dailyUptime], ([$dailyUptime]) => {
		const records = $dailyUptime[site] ?? [];
		const today = startOfToday();
		const out: { date: string; pct: number | null }[] = [];

		for (let i = 89; i >= 0; i--) {
			const date = new Date(today - i * DAY_MS);
			const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(
				date.getDate()
			).padStart(2, '0')}`;
			const rec = records.find((r: DayRecord) => r.date === key);
			out.push({ date: key, pct: rec ? Math.round((rec.upSeconds / (rec.checks * 5)) * 100) : null });
		}

		return out;
	});

	function barClass(pct: number | null): string {
		if (pct === null) return 'bg-muted-foreground/20';
		if (pct >= 99) return 'bg-emerald-500';
		if (pct >= 90) return 'bg-amber-400';
		return 'bg-red-500';
	}
</script>

<div class="flex w-full min-w-0 items-center gap-[2px]" aria-label="90 day uptime for {site}">
	{#each $days as day}
		{#if day.pct !== null}
			<div class="h-3 min-w-0 flex-1 rounded-[1px] {barClass(day.pct)}" title="{day.date}: {day.pct}% uptime"></div>
		{:else}
			<div class="h-3 min-w-0 flex-1 rounded-[1px] bg-muted-foreground/20" title="{day.date}: no data"></div>
		{/if}
	{/each}
</div>
