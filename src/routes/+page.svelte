<script lang="ts">
	import Canvas from '$lib/Canvas.svelte';

	import { json, zoomIdentity, geoAlbersUsa, geoPath } from 'd3';
	// import { BBox } from 'd3';
	import type { FeatureCollection, GeoJsonProperties, Geometry } from 'geojson';
	import { onMount } from 'svelte';
	import { genColor } from '../utils';
	import County from '$lib/County.svelte';

	interface GeoPathStruct {
		path: string | null;
		colorId: string;
		type: 'Feature';
		geometry: Geometry;
		id?: string | number | undefined;
		properties: GeoJsonProperties;
		bbox?: BBox | undefined;
	}

	let width: number, height: number;
	let hoveredColorID: string | undefined;
	let clickedCounty: GeoPathStruct | undefined;
	let transform = zoomIdentity;

	const geojsonPath =
		'https://raw.githubusercontent.com/plotly/datasets/master/geojson-counties-fips.json';
	let geojson: FeatureCollection | undefined;
	onMount(async () => {
		geojson = await json(geojsonPath);
	});

	$: projection = geoAlbersUsa().fitSize([width, height], geojson);
	$: pathGenerator = geoPath(projection);

	let counties: GeoPathStruct[] = [];
	$: if (geojson)
		counties = geojson.features.map((feature) => {
			return {
				...feature,
				path: pathGenerator(feature),
				colorId: genColor(),
				bounds: pathGenerator.bounds(feature)
			};
		});

	// zoom in
	$: if (clickedCounty) {
		const [[x0, y0], [x1, y1]] = clickedCounty.bounds;
		transform = zoomIdentity
			.translate(width / 2, height / 2)
			.scale(Math.min(8, 0.9 / Math.max((x1 - x0) / width, (y1 - y0) / height)))
			.translate(-(x0 + x1) / 2, -(y0 + y1) / 2);
	// zoom out
	} else {
		transform = zoomIdentity;
	}

	$: hoveredCounty = counties.find((c) => c.colorId === hoveredColorID);
</script>

<svelte:window on:keydown={(e) => e.key === "Escape" && (clickedCounty = undefined)}></svelte:window>

<h1>Where is Cancer in the US?</h1>
<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<main
	bind:clientWidth={width}
	bind:clientHeight={height}
	on:click={() => (clickedCounty = hoveredCounty)}
>
	<Canvas {width} {height} {transform} bind:hoveredColorID>
		{#each counties as { id, path }}
			<County {path} fill="purple" opacity={hoveredCounty && hoveredCounty.id === id ? 1.0 : 0.5} />
		{/each}
	</Canvas>
	<Canvas {width} {height} {transform} bind:hoveredColorID hide --position="absolute">
		{#each counties as { id, path, colorId }}
			<County {path} fill={colorId} stroke="#FFFFFF" opacity={1} />
		{/each}
	</Canvas>
</main>

<style>
	main {
		width: 100vw;
		height: 100vh;
		overflow: hidden;
	}
</style>
