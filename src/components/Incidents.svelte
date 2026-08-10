<script lang="ts">
	import { incidents } from '$lib/checker';
	import type { Incident } from '$lib/checker';
	import { format } from '$lib/utils';
	import { CalendarDays, Clock, Check } from '@lucide/svelte';

	function formatDate(ts: number): string {
		const d = new Date(ts);
		const day = String(d.getDate()).padStart(2, '0');
		const month = String(d.getMonth() + 1).padStart(2, '0');
		const year = d.getFullYear();
		return `${day}.${month}.${year}`;
	}

	function formatTime(ts: number): string {
		const d = new Date(ts);
		const hours = String(d.getHours()).padStart(2, '0');
		const minutes = String(d.getMinutes()).padStart(2, '0');
		return `${hours}:${minutes}`;
	}
</script>

<div class="overflow-hidden rounded-xl border bg-card">
	<div class="flex items-center gap-2 border-b px-5 py-3">
		<CalendarDays class="size-4 text-muted-foreground" />
		<h3 class="text-sm font-semibold">Incident History</h3>
	</div>

	{#if $incidents.length === 0}
		<div class="flex flex-col items-center justify-center gap-2 px-6 py-12 text-center">
			<Clock class="size-6 text-muted-foreground" />
			<p class="text-sm text-muted-foreground">No incidents recorded in the current session.</p>
		</div>
	{:else}
		<ol class="divide-y divide-border">
			{#each $incidents as incident}
				<li class="flex items-start gap-3 px-5 py-4">
					<div
						class="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full {incident.resolvedAt === null
							? 'bg-red-500/15 text-red-400'
							: 'bg-emerald-500/15 text-emerald-400'}"
					>
						{#if incident.resolvedAt === null}
							<Clock class="size-3.5" />
						{:else}
							<Check class="size-3.5" />
						{/if}
					</div>
					<div class="min-w-0">
						<p class="text-sm font-medium">
							{incident.site}
							<span class="text-muted-foreground">- {formatDate(incident.startedAt)} at {formatTime(incident.startedAt)}</span>
						</p>
						<p class="mt-0.5 text-xs text-muted-foreground">
							{#if incident.resolvedAt === null}
								Ongoing for {format(incident.duration)}
							{:else}
								Resolved after {format(incident.duration)}
							{/if}
						</p>
					</div>
				</li>
			{/each}
		</ol>
	{/if}
</div>
