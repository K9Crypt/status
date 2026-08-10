<script lang="ts">
	import { page } from '$app/stores';
	import Navbar from '../components/Navbar.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import { TriangleAlert } from '@lucide/svelte';
</script>

<svelte:head>
	<title>Error - K9Crypt Status</title>
</svelte:head>

<div class="flex min-h-svh flex-col">
	<Navbar />
	<main class="mx-auto flex w-full max-w-6xl flex-1 items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
		<div class="flex max-w-md flex-col items-center gap-4 text-center">
			<div
				class="flex size-12 items-center justify-center rounded-full border border-amber-500/25 bg-amber-500/10 text-amber-400"
			>
				<TriangleAlert class="size-6" />
			</div>
			<h1 class="text-2xl font-semibold tracking-tight">
				{$page.status}: {$page.error?.message}
			</h1>
			<p class="text-sm text-muted-foreground">
				Sorry, an error occurred. Please try again later or return to the homepage.
			</p>
			<Button href="/" variant="secondary" class="mt-2">Return to Homepage</Button>
		</div>
	</main>
</div>
