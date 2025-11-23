<script lang="ts">
	import '../app.css';
	import "$lib/fonts/hellix/stylesheet.css";
</script>

<slot></slot>

<svelte:head>
	<link rel="stylesheet" href="https://fonts.cdnfonts.com/css/cutta" integrity="sha384-XENQ8/4Vlc/Ckgk5NQLQoiuYhrBpr+Mn9ByQ27a3EtrQEavMBAfW/YJ+zRpXQo6R" crossorigin="anonymous">
</svelte:head>

<style>
    :global(body) {
        justify-content: center;
        margin: 0;
        padding: 0;
        font-family: 'Hellix', sans-serif;
        color: white;
		background-color: #0c0c0c;
		background-image:
			linear-gradient(
				0deg,
				transparent 23%,
				var(--color) 25%,
				var(--color) 27%,
				transparent 29%,
				transparent 71%,
				var(--color) 73%,
				var(--color) 75%,
				transparent 77%,
				transparent
			),
			linear-gradient(
				90deg,
				transparent 23%,
				var(--color) 25%,
				var(--color) 27%,
				transparent 29%,
				transparent 71%,
				var(--color) 73%,
				var(--color) 75%,
				transparent 77%,
				transparent
			);
		background-size: 40px 40px;
    }

	:global(h1) {
		font-family: 'Cutta', sans-serif;
	}
</style>