<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import { X, Menu } from '@lucide/svelte';

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

<header class="sticky top-0 z-50 border-b border-border/70 bg-background/80 backdrop-blur-lg">
	<nav
		class="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8"
		aria-label="Main"
	>
		<div class="flex items-center">
			<a href="/" class="flex items-center gap-2.5" onclick={closeMenu}>
				<img src="/assets/logos/k9crypt-white.png" alt="K9Crypt logo" class="w-7" />
				<span class="text-sm font-semibold tracking-tight sm:text-base">K9Crypt Status</span>
			</a>
		</div>

		<div class="flex items-center gap-2">
			<time
				datetime=""
				class="hidden rounded-lg border border-border bg-muted/40 px-3 py-1.5 font-mono text-xs text-muted-foreground md:block"
			>
				{currentTime}
			</time>

			<div class="hidden items-center gap-1 md:flex">
				<Button
					href="https://github.com/K9Crypt/status"
					variant="ghost"
					size="icon"
					aria-label="K9Crypt status on GitHub"
				>
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-4"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
				</Button>
				<Button href="https://x.com/K9Crypt" variant="ghost" size="icon" aria-label="K9Crypt on X">
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-4"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
				</Button>
			</div>

			<button
				class="flex size-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground md:hidden"
				onclick={toggleMenu}
				aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
				aria-expanded={isMenuOpen}
			>
				{#if isMenuOpen}
					<X class="size-5" />
				{:else}
					<Menu class="size-5" />
				{/if}
			</button>
		</div>
	</nav>

	{#if isMenuOpen}
		<div class="border-t border-border/70 bg-background/95 p-4 backdrop-blur-lg md:hidden">
			<div class="flex flex-col gap-1">
				<Button
					href="https://github.com/K9Crypt/status"
					variant="ghost"
					class="h-10 w-full justify-start gap-2.5"
					onclick={closeMenu}
				>
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-4"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
					GitHub
				</Button>
				<Button
					href="https://x.com/K9Crypt"
					variant="ghost"
					class="h-10 w-full justify-start gap-2.5"
					onclick={closeMenu}
				>
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-4"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
					X (Twitter)
				</Button>
			</div>
		</div>
	{/if}
</header>
