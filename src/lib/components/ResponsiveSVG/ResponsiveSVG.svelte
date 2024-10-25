<script lang="ts">
	export let width;
	export let height;
</script>

<main bind:clientWidth={width} bind:clientHeight={height}>
	<svg {width} {height}>
		<slot />
	</svg>
</main>

<style>
	main {
		width: 100vw;
		height: 100vh;
		overflow: hidden;
	}
</style>
