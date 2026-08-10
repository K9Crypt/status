<script lang="ts">
	import { records } from '$lib/checker';
	import type { Entry } from '$lib/checker';
	import { derived } from 'svelte/store';

	export let site: string;

	// last N latencies, in time order
	const series = derived(records, ($records) => {
		const entries = $records[site] ?? [];
		return entries.slice(-20).map((e: Entry) => e.latency);
	});

	// build an SVG polyline path for the series
	const path = derived(series, ($series) => {
		const n = $series.length;
		if (n === 0) return '';
		const max = Math.max(...$series, 1);
		const w = 60;
		const h = 16;
		const step = w / (n - 1);

		return $series.map((lat, i) => {
			const x = i * step;
			const y = h - (lat / max) * h;
			return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`;
		}).join(' ');
	});

	function colorClass(latency: number): string {
		if (latency < 500) return 'text-emerald-400';
		if (latency < 1500) return 'text-amber-400';
		return 'text-red-400';
	}
</script>

{#if $series.length >= 2}
	<div class="flex items-center gap-2">
		<svg width="60" height="16" viewBox="0 0 60 16" class="shrink-0" aria-hidden="true">
			<path d={$path} fill="none" stroke="currentColor" stroke-width="1.5" class={colorClass($series[$series.length - 1])} />
		</svg>
		<span class="font-mono text-xs text-muted-foreground">{$series[$series.length - 1]}ms</span>
	</div>
{/if}
