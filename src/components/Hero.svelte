<script lang="ts">
    import { onMount } from 'svelte';
    import { states, outages, monitor } from '$lib/checker';
    import { sites } from '$lib/config/sites';
    import * as Card from '$lib/components/ui/card';
    import { derived } from 'svelte/store';
    import { format } from '$lib/utils';

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
                h1Text: "All Systems Active",
                pText: "You can check the status of the sites below. Statuses are updated every 10 seconds."
            };
        } else {
            const offlineMessage = `${offlineSites.join(', ')} site(s) are not active`;
            return {
                h1Text: "Some Systems Are Not Active",
                pText: offlineMessage
            };
        }
    });
</script>

<div class="container mx-auto px-4 py-20 md:py-8">
    <div class="mb-6 space-y-2 text-center">
        <h1 class="text-3xl font-semibold">{$overallStatus.h1Text}</h1>
        <p class="opacity-90">{$overallStatus.pText}</p>
    </div>

    {#each Object.entries($states) as [groupName, groupSites]}
        <h2 class="text-lg font-semibold mt-6 mb-4">{groupName}</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            {#each Object.entries(groupSites) as [siteName, status]}
                {@const site = sites.find(s => s.name === siteName)}
                <Card.Root>
                    <Card.Header>
                        <Card.Title>{siteName}</Card.Title>
                        {#if site && site.description}
                            <Card.Description>{site.description}</Card.Description>
                        {/if}
                    </Card.Header>
                    <Card.Content>
                        {#if status === true}
                            <span class="text-green-500 bg-green-500/10 px-6 py-2 rounded border border-green-500/20">Active</span>
                        {:else if status === false}
                            <span class="text-red-500 bg-red-500/10 px-6 py-2 rounded border border-red-500/20">Not Active</span>
                            {#if $outages[siteName] && $outages[siteName].period !== null}
                                <p class="text-sm opacity-50 mt-4">
                                    (Not active for {format($outages[siteName].period)})
                                </p>
                            {/if}
                        {:else}
                            <span>Loading...</span>
                        {/if}
                    </Card.Content>
                </Card.Root>
            {/each}
        </div>
    {/each}
</div>