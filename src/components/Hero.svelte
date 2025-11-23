<script lang="ts">
    import { onMount } from 'svelte';
    import { states, outages, monitor } from '$lib/checker';
    import { sites } from '$lib/config/sites';
    import * as Card from '$lib/components/ui/card';
    import { derived } from 'svelte/store';
    import { format } from '$lib/utils';

    import Statistics from './Statistics.svelte';

    onMount(() => {
        monitor.start();
        return () => monitor.stop();
    });

    const overallStatus = derived(states, ($states) => {
        let allSitesOnline = true;
        let totalSites = 0;
        const offlineSites: string[] = [];

        for (const groupKey in $states) {
            const group = $states[groupKey];
            for (const siteName in group) {
                totalSites++;
                if (group[siteName] === false) {
                    allSitesOnline = false;
                    offlineSites.push(siteName);
                }
            }
        }

        if (totalSites === 0) {
            return {
                h1Text: "Loading...",
                pText: "Checking the status of the systems..."
            };
        } else if (allSitesOnline) {
            return {
                h1Text: "All Systems Operational",
                pText: "You can check the status of the sites below. Statuses are updated every 10 seconds."
            };
        } else {
            const offlineMessage = `${offlineSites.join(', ')} site(s) are not active`;
            return {
                h1Text: "Some Systems Are Not Operational",
                pText: offlineMessage
            };
        }
    });
</script>

<div class="container mx-auto px-4 py-20 md:py-8">
    <!-- Header Section -->
    <div class="mb-8 space-y-2 text-center">
        <h1 class="text-3xl font-semibold">{$overallStatus.h1Text}</h1>
        <p class="opacity-90">{$overallStatus.pText}</p>
    </div>

    <!-- Statistics Overview -->
    <Statistics />

    <!-- Site Status Cards -->
    {#each Object.entries($states) as [groupName, groupSites]}
        <div class="mb-8">
            <h2 class="text-xl font-semibold mb-4 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" d="M4 20q-.825 0-1.412-.587T2 18V6q0-.825.588-1.412T4 4h6l2 2h8q.825 0 1.413.588T22 8v10q0 .825-.587 1.413T20 20z"/></svg>
                {groupName}
            </h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                {#each Object.entries(groupSites) as [siteName, status]}
                    {@const site = sites.find(s => s.name === siteName)}
                    <Card.Root>
                        <Card.Header>
                            <Card.Title class="flex items-center justify-between">
                                <span>{siteName}</span>
                                {#if status === true}
                                    <i class="ri-checkbox-circle-fill text-green-500 text-xl"></i>
                                {:else if status === false}
                                    <i class="ri-close-circle-fill text-red-500 text-xl"></i>
                                {:else}
                                    <i class="ri-loader-4-line text-gray-500 text-xl animate-spin"></i>
                                {/if}
                            </Card.Title>
                            {#if site && site.description}
                                <Card.Description>{site.description}</Card.Description>
                            {/if}
                        </Card.Header>
                        <Card.Content>
                            <div class="flex items-center justify-between">
                                <div>
                                    {#if status === true}
                                        <span class="text-green-500 bg-green-500/10 px-4 py-2 rounded-lg border border-green-500/20 text-sm font-medium">
                                            Active
                                        </span>
                                    {:else if status === false}
                                        <span class="text-red-500 bg-red-500/10 px-4 py-2 rounded-lg border border-red-500/20 text-sm font-medium">
                                            Not Active
                                        </span>
                                    {:else}
                                        <span class="text-gray-500 bg-gray-500/10 px-4 py-2 rounded-lg border border-gray-500/20 text-sm font-medium">
                                            Loading...
                                        </span>
                                    {/if}
                                </div>
                                {#if site && site.url && site.group !== "Backends"}
                                    <a 
                                        href={site.url} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        class="text-sm opacity-60 hover:opacity-100 transition-opacity flex items-center gap-1"
                                    >
                                        Visit
                                        <i class="ri-external-link-line"></i>
                                    </a>
                                {/if}
                            </div>
                            {#if status === false && $outages[siteName] && $outages[siteName].period !== null}
                                <p class="text-sm opacity-50 mt-3 flex items-center gap-1">
                                    <i class="ri-time-line"></i>
                                    Down for {format($outages[siteName].period)}
                                </p>
                            {/if}
                        </Card.Content>
                    </Card.Root>
                {/each}
            </div>
        </div>
    {/each}
</div>