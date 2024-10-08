<script lang="ts">
	import GeoMap from '$lib/GeoMap.svelte';
	import ResponsiveSVG from '$lib/ResponsiveSVG.svelte';

	let width = 1000;
	let height = 500;

	const geoJSONPath =
		'https://raw.githubusercontent.com/plotly/datasets/master/geojson-counties-fips.json';

</script>

<h1>Map Starter Project</h1>
<ResponsiveSVG bind:width bind:height>
	<GeoMap {geoJSONPath} {width} {height}/>
</ResponsiveSVG>

