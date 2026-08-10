<script lang="ts">
	import '../app.css';
</script>

<slot></slot>

<style>
	@import url('https://fonts.cdnfonts.com/css/sf-pro-display');

	:global(body) {
		font-family: 'SF Pro Display', ui-sans-serif, system-ui, sans-serif;
		margin: 0;
		padding: 0;
		scroll-behavior: smooth;
	}
</style>
