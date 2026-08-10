<script lang="ts">
	import { onMount } from 'svelte';
	import { states, outages, records, monitor } from '$lib/checker';
	import { sites } from '$lib/config/sites';
	import { derived } from 'svelte/store';
	import { format } from '$lib/utils';

	import { CheckCircle2, Clock, TriangleAlert, XCircle, ExternalLink } from '@lucide/svelte';
	import * as Card from '$lib/components/ui/card';
	import { Badge } from '$lib/components/ui/badge';
	import * as Tooltip from '$lib/components/ui/tooltip';

	import Statistics from './Statistics.svelte';
	import Incidents from './Incidents.svelte';
	import UptimeBars from './UptimeBars.svelte';
	import LatencySparkline from './LatencySparkline.svelte';

	onMount(() => {
		monitor.start();
		return () => monitor.stop();
	});

	type Overall = 'up' | 'down' | 'partial' | 'loading';

	const overall = derived(states, ($states) => {
		let total = 0;
		let up = 0;
		let down = 0;
		let unknown = 0;

		for (const group of Object.values($states)) {
			for (const status of Object.values(group)) {
				total++;
				if (status === true) up++;
				else if (status === false) down++;
				else unknown++;
			}
		}

		if (total === 0) {
			return { status: 'loading' as Overall, total, up, down, unknown };
		}

		const status: Overall = down > 0 ? 'down' : up > 0 && unknown > 0 ? 'partial' : 'up';
		return { status, total, up, down, unknown };
	});

	const siteMeta = (name: string) => sites.find((s) => s.name === name);
	const lastEntry = (name: string) => {
		const list = $records[name];
		return list?.length ? list[list.length - 1] : null;
	};
</script>

<div class="pt-10 md:pt-14">
	<!-- Status banner -->
	<div
		class="relative overflow-hidden rounded-2xl border px-5 py-6 sm:px-8 sm:py-8 {$overall.status === 'up'
			? 'border-emerald-500/30 bg-emerald-500/[0.06]'
			: $overall.status === 'down'
				? 'border-red-500/30 bg-red-500/[0.06]'
				: $overall.status === 'partial'
					? 'border-amber-500/30 bg-amber-500/[0.06]'
					: 'border-border bg-card'}"
	>
		<div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
			<div class="flex items-start gap-4">
				<div
					class="mt-0.5 flex size-11 shrink-0 items-center justify-center rounded-full {$overall.status === 'up'
						? 'bg-emerald-500/15 text-emerald-400'
						: $overall.status === 'down'
							? 'bg-red-500/15 text-red-400'
							: $overall.status === 'partial'
								? 'bg-amber-500/15 text-amber-400'
								: 'bg-muted text-muted-foreground'}"
				>
					{#if $overall.status === 'up'}
						<CheckCircle2 class="size-6" />
					{:else if $overall.status === 'down'}
						<XCircle class="size-6" />
					{:else if $overall.status === 'partial'}
						<TriangleAlert class="size-6" />
					{:else}
						<Clock class="size-6 animate-spin [animation-duration:2s]" />
					{/if}
				</div>
				<div class="min-w-0">
					<h1 class="text-xl font-semibold tracking-tight sm:text-2xl">
						{#if $overall.status === 'up'}
							All Systems Operational
						{:else if $overall.status === 'down'}
							Some Systems Not Operational
						{:else if $overall.status === 'partial'}
							Systems Partially Available
						{:else}
							Checking Systems
						{/if}
					</h1>
					<p class="mt-1 text-sm text-muted-foreground">
						{#if $overall.status === 'loading'}
							Running initial checks against all monitored services.
						{:else if $overall.status === 'up'}
							All {$overall.total} services are operational. Statuses refresh automatically.
						{:else if $overall.status === 'down'}
							{$overall.down} of {$overall.total} services are currently unavailable.
						{:else}
							{$overall.down} of {$overall.total} services are unavailable.
						{/if}
					</p>
				</div>
			</div>

			<div
				class="inline-flex w-fit items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium {$overall.status === 'up'
					? 'border-emerald-500/25 bg-emerald-500/10 text-emerald-400'
					: $overall.status === 'down'
						? 'border-red-500/25 bg-red-500/10 text-red-400'
						: $overall.status === 'partial'
							? 'border-amber-500/25 bg-amber-500/10 text-amber-400'
							: 'border-border bg-muted text-muted-foreground'}"
			>
				<span class="relative flex size-2">
					<span
						class="absolute inline-flex size-full animate-ping rounded-full opacity-60 {$overall.status === 'up'
							? 'bg-emerald-400'
							: $overall.status === 'down'
								? 'bg-red-400'
								: $overall.status === 'partial'
									? 'bg-amber-400'
									: 'bg-muted-foreground'}"
					></span>
					<span
						class="relative inline-flex size-2 rounded-full {$overall.status === 'up'
							? 'bg-emerald-400'
							: $overall.status === 'down'
								? 'bg-red-400'
								: $overall.status === 'partial'
									? 'bg-amber-400'
									: 'bg-muted-foreground'}"
					></span>
				</span>
				{#if $overall.status === 'up'}
					Operational
				{:else if $overall.status === 'down'}
					Outage
				{:else if $overall.status === 'partial'}
					Degraded
				{:else}
					Checking
				{/if}
			</div>
		</div>
	</div>

	<!-- Uptime statistics -->
	<div class="mt-6">
		<Statistics />
	</div>

	<!-- Service groups -->
	{#each Object.entries($states) as [groupName, groupSites]}
		<section class="mt-10" aria-labelledby="group-{groupName}">
			<div class="mb-3 flex items-center gap-3">
				<h2 id="group-{groupName}" class="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
					{groupName}
				</h2>
				<div class="h-px flex-1 bg-border"></div>
			</div>

			<div class="overflow-hidden rounded-xl border bg-card">
				{#each Object.entries(groupSites) as [siteName, status]}
					{@const meta = siteMeta(siteName)}
					{@const entry = lastEntry(siteName)}
					<div
						class="border-b px-4 py-3.5 transition-colors last:border-b-0 hover:bg-muted/30 sm:px-5"
					>
						<div class="flex items-center justify-between gap-4">
							<div class="flex min-w-0 items-center gap-3">
								<div
									class="size-2 shrink-0 rounded-full {status === true
										? 'bg-emerald-500'
										: status === false
											? 'bg-red-500'
											: 'bg-muted-foreground/50'}"
								></div>
								<div class="min-w-0">
									<p class="truncate text-sm font-medium">{siteName}</p>
									{#if meta?.description}
										<p class="truncate text-xs text-muted-foreground">{meta.description}</p>
									{/if}
								</div>
							</div>

							<div class="flex shrink-0 items-center gap-4 sm:gap-6">
								<div class="hidden text-right sm:block">
									{#if status === true}
										<p class="font-mono text-xs text-emerald-400">{entry?.latency ?? '--'} ms</p>
									{:else if status === false}
										<p class="font-mono text-xs text-red-400">-- ms</p>
									{:else}
										<p class="font-mono text-xs text-muted-foreground">-- ms</p>
									{/if}
									{#if status === false && $outages[siteName]?.period !== null}
										<p class="font-mono text-[11px] text-muted-foreground">
											down {format($outages[siteName]?.period ?? 0)}
										</p>
									{/if}
									{#if status === true}
										<LatencySparkline site={siteName} />
									{/if}
								</div>

								{#if status === true}
									<Badge variant="outline" class="border-emerald-500/25 bg-emerald-500/10 text-emerald-400">
										<span class="size-1.5 rounded-full bg-emerald-400"></span>
										Operational
									</Badge>
								{:else if status === false}
									<Badge variant="destructive" class="border-red-500/25 bg-red-500/10 text-red-400">
										<span class="size-1.5 rounded-full bg-red-400"></span>
										Outage
									</Badge>
								{:else}
									<Badge variant="outline" class="border-border bg-muted text-muted-foreground">
										<span class="size-1.5 rounded-full bg-muted-foreground/60"></span>
										Checking
									</Badge>
								{/if}

								{#if meta?.url && meta?.group !== 'Backends' && meta?.group !== 'APIs'}
									{#if entry?.latency}
										<Tooltip.Root>
											<Tooltip.Trigger>
												<a
													href={meta.url}
													target="_blank"
													rel="noopener noreferrer"
													class="flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
													aria-label="Open {siteName}"
												>
													<ExternalLink class="size-4" />
												</a>
											</Tooltip.Trigger>
											<Tooltip.Content>{siteName} link</Tooltip.Content>
										</Tooltip.Root>
									{:else}
										<a
											href={meta.url}
											target="_blank"
											rel="noopener noreferrer"
											class="flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
											aria-label="Open {siteName}"
										>
											<ExternalLink class="size-4" />
										</a>
									{/if}
								{/if}
							</div>
						</div>

						<div class="mt-3 flex items-center gap-3">
							<UptimeBars site={siteName} />
							<span class="text-[11px] text-muted-foreground">90 day uptime</span>
						</div>
					</div>
				{/each}
			</div>
		</section>
	{/each}

	<!-- Incident history -->
	{#if Object.keys($states).length > 0}
		<section class="mt-10" aria-label="Incident history">
			<Incidents />
		</section>
	{/if}

	<!-- Empty state -->
	{#if Object.keys($states).length === 0}
		<Card.Root class="mt-8">
			<Card.Content class="flex flex-col items-center justify-center gap-3 px-6 py-16 text-center">
				<div class="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
					<Clock class="size-6" />
				</div>
				<h2 class="text-base font-medium">No services configured</h2>
				<p class="max-w-sm text-sm text-muted-foreground">
					Add sites to the <code class="rounded bg-muted px-1 py-0.5 font-mono text-xs">sites.ts</code> config to
					start monitoring.
				</p>
			</Card.Content>
		</Card.Root>
	{/if}
</div>
