<!-- A Map component build in SVGs using paths. 
 1. Pass in a geojson file, and geoAlbersUsa() and geoPath() will split the file into SVG paths. 
 2. Then, iterate over this path array with a Svelte {#each} look to generate the paths for the map.-->

<script lang="ts">
	import {
		json,
		geoAlbersUsa,
		geoPath,
		type GeoProjection,
		type GeoPath,
		type GeoPermissibleObjects
	} from 'd3';
	import type { BBox, FeatureCollection, GeoJsonProperties, Geometry } from 'geojson';

	import { onMount } from 'svelte';
	import type { GeoPathStruct } from './constants';
	import ResponsiveSvg from '$lib/components/ResponsiveSVG/ResponsiveSVG.svelte';

	export let geoJSONPath: string;

	let width: number;
	let height: number;
	let geojson: FeatureCollection | undefined;

	// Get all the counties with actual coordinates and state, county name, id
	onMount(async () => {
		geojson = await json(geoJSONPath);
	});

	let projection: GeoProjection | undefined;
	let pathGenerator: GeoPath<any, GeoPermissibleObjects>;

	// Equivalent to scale-linear; attributes geojson size scaling to the map size
	$: projection = geoAlbersUsa().fitSize([width, height], geojson as FeatureCollection);

	// Generates the actual path objects
	$: pathGenerator = geoPath(projection);

	let counties: GeoPathStruct[] = [];
	// add path object to each county so we can draw this in DOM
	$: if (geojson)
		counties = geojson.features.map((feature) => {
			// console.log('feature',feature)
			return {
				...feature,
				path: pathGenerator(feature)
			};
		});

	let hoveredCountyId: number | string | undefined | null = null;

	$: console.log(width);
	// $: console.log(hoveredCountyId);
</script>

<ResponsiveSvg bind:height bind:width>
	{#each counties as { id, path }}
		<!-- svelte-ignore a11y-mouse-events-have-key-events-->
		<path
			d={path}
			class:active={hoveredCountyId === id}
			on:mouseover={() => (hoveredCountyId = id)}
			role="img"
			aria-label="County"
		></path>
	{/each}
</ResponsiveSvg>

<style>
	path {
		fill: purple;
		stroke: none;
		opacity: 0.5;
		transition: opacity 0.05s ease-out;
	}

	path.active {
		opacity: 1;
	}
</style>
