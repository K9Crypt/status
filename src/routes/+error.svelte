<script lang="ts">
    import { page } from '$app/stores';
    import Navbar from "../components/Navbar.svelte";
    import Button from '$lib/components/ui/button/button.svelte';
</script>

<Navbar />

<div class="min-h-screen flex items-center justify-center px-4 py-20 md:py-8">
    <div class="mb-6 space-y-2 text-center">
        <h1 class="text-3xl font-semibold">{$page.status}: {$page.error?.message}</h1>
        <p class="opacity-90">Sorry, an error occurred. Please try again later or return to the homepage.</p>
        <Button href="/" variant="secondary" class="mt-4">Return to Homepage</Button>
    </div>
</div>