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
	import { genColor } from '../utils';
	import County from './County.svelte';

	export let geoJSONPath: string;
	export let width: number;
	export let height: number;
    export let hoveredColorID: string | undefined;

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
		colorId: string;
		type: 'Feature';
		geometry: Geometry;
		id?: string | number | undefined;
		properties: GeoJsonProperties;
		bbox?: BBox | undefined;
	}

	let counties: GeoPathStruct[] = [];
	// add path object to each county so we can draw this in DOM
	$: if (geojson)
		counties = geojson.features.map((feature) => {
			return {
				...feature,
				path: pathGenerator(feature),
				colorId: genColor()
			};
		});

	$: hoveredCounty = counties.find((county) => county.colorId === hoveredColorID);
    $: console.log('hoveredCounty in geomapcanvas',hoveredCounty)
    $: console.log('hoveredColorID',hoveredColorID)
    $: console.log('counties',counties)
    $: console.log('counties.find((county) => county.colorId === hoveredColorID)',counties.find((county) => county.colorId === hoveredColorID))
</script>

{#each counties as { id, path, colorId }}
	<!-- svelte-ignore a11y-mouse-events-have-key-events-->
	<County {path} fill={colorId} stroke="" opacity={hoveredCounty && hoveredCounty.id === id ? 1.0 : 0.5} />
	<!-- <path
		d={path}
		class:active={hoveredCountyId === id}
		on:mouseover={() => (hoveredCountyId = id)}
		role="img"
		aria-label="County"
	></path> -->
{/each}
