<script lang="ts">
	import Canvas from '$lib/Canvas.svelte';
	import GeoMap from '$lib/GeoMap.svelte';
	import GeoMapCanvas from '$lib/GeoMapCanvas.svelte';
	import ResponsiveSVG from '$lib/ResponsiveSVG.svelte';

	let width = 1000;
	let height = 500;

	const geoJSONPath =
		'https://raw.githubusercontent.com/plotly/datasets/master/geojson-counties-fips.json';
</script>

<h1>Where is Cancer in the US?</h1>
<main bind:clientWidth={width} bind:clientHeight={height}>
	<Canvas {width} {height}>
		<GeoMapCanvas {geoJSONPath} {width} {height} />
	</Canvas>
</main>

<style>
	main {
		width: 100vw;
		height: 100vh;
		overflow: hidden;
	}
</style>
