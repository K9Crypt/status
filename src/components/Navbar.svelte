<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import Button from '$lib/components/ui/button/button.svelte';
    import { Menu, X } from '@lucide/svelte';

    let currentTime = '';
    let interval: ReturnType<typeof setInterval> | null = null;
    let isMenuOpen = false;

    function updateTime() {
        const now = new Date();
        const day = String(now.getDate()).padStart(2, '0');
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const year = now.getFullYear();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        
        currentTime = `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
    }

    function toggleMenu() {
        isMenuOpen = !isMenuOpen;
    }

    function closeMenu() {
        isMenuOpen = false;
    }

    onMount(() => {
        updateTime();
        interval = setInterval(updateTime, 1000);
    });

    onDestroy(() => {
        if (interval) clearInterval(interval);
    });
</script>

<nav class="w-full h-14 flex items-center justify-between px-4 sm:px-6 md:px-10 relative z-50">
    <div class="flex items-center relative z-10">
        <a href="/" class="flex justify-center items-center space-x-2 relative" onclick={closeMenu}>
            <img src="/assets/logos/k9crypt-white.png" alt="k9crypt Logo" class="w-7">
            <h1 class="text-base sm:text-lg font-bold">K9Crypt Status</h1>
        </a>
    </div>
    
    <!-- Desktop Clock -->
    <div class="hidden md:block absolute left-1/2 transform -translate-x-1/2 text-sm sm:text-base opacity-50 py-2 px-4 bg-white/5 backdrop-blur-lg rounded-lg border border-white/10">
        {currentTime}
    </div>

    <!-- Desktop Social Links -->
    <ul class="hidden md:flex ml-auto space-x-2">
        <li>
            <Button href="https://github.com/K9Crypt/status" variant="secondary" class="opacity-50 hover:opacity-100">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5c.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34c-.46-1.16-1.11-1.47-1.11-1.47c-.91-.62.07-.6.07-.6c1 .07 1.53 1.03 1.53 1.03c.87 1.52 2.34 1.07 2.91.83c.09-.65.35-1.09.63-1.34c-2.22-.25-4.55-1.11-4.55-4.92c0-1.11.38-2 1.03-2.71c-.1-.25-.45-1.29.1-2.64c0 0 .84-.27 2.75 1.02c.79-.22 1.65-.33 2.5-.33s1.71.11 2.5.33c1.91-1.29 2.75-1.02 2.75-1.02c.55 1.35.2 2.39.1 2.64c.65.71 1.03 1.6 1.03 2.71c0 3.82-2.34 4.66-4.57 4.91c.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2"/></svg>
            </Button>
        </li>

        <li>
            <Button href="https://x.com/K9Crypt" variant="secondary" class="opacity-50 hover:opacity-100">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" d="m17.687 3.063l-4.996 5.711l-4.32-5.711H2.112l7.477 9.776l-7.086 8.099h3.034l5.469-6.25l4.78 6.25h6.102l-7.794-10.304l6.625-7.571zm-1.064 16.06L5.654 4.782h1.803l10.846 14.34z"/></svg>
            </Button>
        </li>
    </ul>

    <!-- Mobile Menu -->
    <div class="md:hidden ml-auto">
        <button onclick={toggleMenu} class="p-2">
            {#if isMenuOpen}
                <X size={24} />
            {:else}
                <Menu size={24} />
            {/if}
        </button>
    </div>
</nav>

{#if isMenuOpen}
    <button class="fixed inset-0 bg-black/80 z-[60] md:hidden" onclick={closeMenu} aria-label="Close menu"></button>
{/if}

<div class="fixed bottom-0 left-0 right-0 bg-white/5 backdrop-blur-lg border-t border-white/10 transform transition-transform duration-300 z-[70] md:hidden {isMenuOpen ? 'translate-y-0' : 'translate-y-full'} rounded-t-xl">
    <div class="p-6 space-y-6">
        <!-- Mobile Clock -->
        <div class="text-center">
            <div class="inline-block text-base font-mono opacity-60 py-2 px-4 bg-white/5 backdrop-blur-lg rounded-lg border border-white/10">
                {currentTime}
            </div>
        </div>

        <!-- Mobile Links -->
        <div class="space-y-3">
            <Button href="https://github.com/K9Crypt/status" variant="secondary" class="w-full justify-start gap-3 h-12" onclick={closeMenu}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5c.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34c-.46-1.16-1.11-1.47-1.11-1.47c-.91-.62.07-.6.07-.6c1 .07 1.53 1.03 1.53 1.03c.87 1.52 2.34 1.07 2.91.83c.09-.65.35-1.09.63-1.34c-2.22-.25-4.55-1.11-4.55-4.92c0-1.11.38-2 1.03-2.71c-.1-.25-.45-1.29.1-2.64c0 0 .84-.27 2.75 1.02c.79-.22 1.65-.33 2.5-.33s1.71.11 2.5.33c1.91-1.29 2.75-1.02 2.75-1.02c.55 1.35.2 2.39.1 2.64c.65.71 1.03 1.6 1.03 2.71c0 3.82-2.34 4.66-4.57 4.91c.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2"/></svg>
                GitHub
            </Button>

            <Button href="https://x.com/K9Crypt" variant="secondary" class="w-full justify-start gap-3 h-12" onclick={closeMenu}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" d="m17.687 3.063l-4.996 5.711l-4.32-5.711H2.112l7.477 9.776l-7.086 8.099h3.034l5.469-6.25l4.78 6.25h6.102l-7.794-10.304l6.625-7.571zm-1.064 16.06L5.654 4.782h1.803l10.846 14.34z"/></svg>
                X (Twitter)
            </Button>
        </div>
    </div>
</div>