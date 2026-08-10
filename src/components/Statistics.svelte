<script lang="ts">
	import { states, records } from '$lib/checker';
	import * as Card from '$lib/components/ui/card';
	import { derived } from 'svelte/store';
	import { Activity, CircleCheck, CircleX, Gauge } from '@lucide/svelte';

	const stats = derived([states, records], ([$states, $records]) => {
		let totalSites = 0;
		let activeSites = 0;
		let downSites = 0;
		let checked = 0;
		let latencySum = 0;
		let latencyCount = 0;

		for (const group of Object.values($states)) {
			for (const status of Object.values(group)) {
				totalSites++;
				if (status === true) activeSites++;
				else if (status === false) downSites++;
			}
		}

		for (const entries of Object.values($records)) {
			const last = entries[entries.length - 1];
			if (last) {
				checked++;
				if (last.latency > 0) {
					latencySum += last.latency;
					latencyCount++;
				}
			}
		}

		const avgLatency = latencyCount > 0 ? Math.round(latencySum / latencyCount) : 0;
		const uptime = checked > 0 ? Math.round((activeSites / checked) * 100) : 100;

		return { totalSites, activeSites, downSites, avgLatency, uptime };
	});
</script>

<div class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
	<Card.Root>
		<Card.Header class="flex flex-row items-center gap-2">
			<Activity class="size-4 text-muted-foreground" />
			<Card.Title class="text-xs font-medium uppercase tracking-wider text-muted-foreground">
				Uptime
			</Card.Title>
		</Card.Header>
		<Card.Content>
			<div class="font-mono text-3xl font-semibold tracking-tight">{$stats.uptime}%</div>
			<p class="mt-1 text-xs text-muted-foreground">Across {$stats.totalSites} services</p>
		</Card.Content>
	</Card.Root>

	<Card.Root>
		<Card.Header class="flex flex-row items-center gap-2">
			<CircleCheck class="size-4 text-emerald-400" />
			<Card.Title class="text-xs font-medium uppercase tracking-wider text-muted-foreground">
				Operational
			</Card.Title>
		</Card.Header>
		<Card.Content>
			<div class="font-mono text-3xl font-semibold tracking-tight text-emerald-400">
				{$stats.activeSites}
			</div>
			<p class="mt-1 text-xs text-muted-foreground">of {$stats.totalSites} services running</p>
		</Card.Content>
	</Card.Root>

	<Card.Root>
		<Card.Header class="flex flex-row items-center gap-2">
			<CircleX class="size-4 text-red-400" />
			<Card.Title class="text-xs font-medium uppercase tracking-wider text-muted-foreground">
				Down
			</Card.Title>
		</Card.Header>
		<Card.Content>
			<div class="font-mono text-3xl font-semibold tracking-tight text-red-400">
				{$stats.downSites}
			</div>
			<p class="mt-1 text-xs text-muted-foreground">{$stats.downSites === 0 ? 'all services healthy' : 'services offline'}</p>
		</Card.Content>
	</Card.Root>

	<Card.Root>
		<Card.Header class="flex flex-row items-center gap-2">
			<Gauge class="size-4 text-muted-foreground" />
			<Card.Title class="text-xs font-medium uppercase tracking-wider text-muted-foreground">
				Avg Latency
			</Card.Title>
		</Card.Header>
		<Card.Content>
			<div class="font-mono text-3xl font-semibold tracking-tight">{$stats.avgLatency} ms</div>
			<p class="mt-1 text-xs text-muted-foreground">across all services</p>
		</Card.Content>
	</Card.Root>
</div>
