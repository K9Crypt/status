<script lang="ts">
	const year = new Date().getFullYear();
</script>

<footer class="mt-auto border-t border-border/70">
	<div
		class="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-3 px-4 py-6 text-xs text-muted-foreground sm:flex-row sm:px-6 lg:px-8"
	>
		<div class="flex items-center gap-2">
			<img src="/assets/logos/k9crypt-white.png" alt="K9Crypt logo" class="w-5" />
			<span>&copy; {year} K9Crypt. All rights reserved.</span>
		</div>
		<p>Live status page. Checks refresh every few seconds.</p>
	</div>
</footer>
