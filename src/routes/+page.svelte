<script lang="ts">
	import Navbar from '../components/Navbar.svelte';
	import Hero from '../components/Hero.svelte';
	import Footer from '../components/Footer.svelte';
</script>

<svelte:head>
	<title>K9Crypt Status</title>
	<meta
		name="description"
		content="Real-time service status and incident history for K9Crypt services. Check if our systems are operational."
	/>
</svelte:head>

<div class="flex min-h-svh flex-col">
	<Navbar />
	<main class="mx-auto w-full max-w-6xl flex-1 px-4 pb-16 sm:px-6 lg:px-8">
		<Hero />
	</main>
	<Footer />
</div>
