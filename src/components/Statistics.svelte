<script lang="ts">
    import { states } from '$lib/checker';
    import * as Card from '$lib/components/ui/card';
    import { derived } from 'svelte/store';

    const statistics = derived(states, ($states) => {
        let totalSites = 0;
        let activeSites = 0;
        let downSites = 0;

        for (const groupKey in $states) {
            const group = $states[groupKey];
            for (const siteName in group) {
                totalSites++;
                if (group[siteName] === true) {
                    activeSites++;
                } else if (group[siteName] === false) {
                    downSites++;
                }
            }
        }

        return { totalSites, activeSites, downSites };
    });
</script>

<div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
    <!-- Total Sites Card -->
    <Card.Root>
        <Card.Header>
            <Card.Title class="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" d="M19.5 9V1.5h-3V9h-3V1.5h-3V9h-3V1.5H4.65V9H3v1.5h18V9zm0 4.5h-3V21h-3v-7.5h-3V21h-3v-7.5H4.65V21H3v1.5h18V21h-1.5z"/></svg>
                Total Sites
            </Card.Title>
        </Card.Header>
        <Card.Content>
            <div class="text-4xl font-bold">{$statistics.totalSites}</div>
            <p class="text-sm opacity-60 mt-2">Monitored services</p>
        </Card.Content>
    </Card.Root>

    <!-- Active Sites Card -->
    <Card.Root>
        <Card.Header>
            <Card.Title class="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" class="text-green-500"><path fill="currentColor" d="m10.6 16.6l7.05-7.05l-1.4-1.4l-5.65 5.65l-2.85-2.85l-1.4 1.4zM12 22q-2.075 0-3.9-.788t-3.175-2.137T2.788 15.9T2 12t.788-3.9t2.137-3.175T8.1 2.788T12 2t3.9.788t3.175 2.137T21.213 8.1T22 12t-.788 3.9t-2.137 3.175t-3.175 2.138T12 22"/></svg>
                Active
            </Card.Title>
        </Card.Header>
        <Card.Content>
            <div class="text-4xl font-bold text-green-500">{$statistics.activeSites}</div>
            <p class="text-sm opacity-60 mt-2">Services running</p>
        </Card.Content>
    </Card.Root>

    <!-- Down Sites Card -->
    <Card.Root>
        <Card.Header>
            <Card.Title class="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" class="text-red-500"><path fill="currentColor" d="M19.1 4.9C15.2 1 8.8 1 4.9 4.9S1 15.2 4.9 19.1s10.2 3.9 14.1 0s4-10.3.1-14.2m-4.3 11.3L12 13.4l-2.8 2.8l-1.4-1.4l2.8-2.8l-2.8-2.8l1.4-1.4l2.8 2.8l2.8-2.8l1.4 1.4l-2.8 2.8l2.8 2.8z"/></svg>
                Down
            </Card.Title>
        </Card.Header>
        <Card.Content>
            <div class="text-4xl font-bold text-red-500">{$statistics.downSites}</div>
            <p class="text-sm opacity-60 mt-2">Services offline</p>
        </Card.Content>
    </Card.Root>
</div>
