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

	export let geoJSONPath: string;
	export let width: number;
	export let height: number;

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

	interface GeoPathStruct {
		path: string | null;
		type: 'Feature';
		geometry: Geometry;
		id?: number | string | null;
		properties: GeoJsonProperties;
		bbox?: BBox | undefined;
	}

	let counties: GeoPathStruct[] = [];
	// add path object to each county so we can draw this in DOM
	$: if (geojson)
		counties = geojson.features.map((feature) => {
			return {
				...feature,
				path: pathGenerator(feature)
			};
		});

	let hoveredCountyId: number | string | undefined | null = null;
	$: console.log(hoveredCountyId);
</script>

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
