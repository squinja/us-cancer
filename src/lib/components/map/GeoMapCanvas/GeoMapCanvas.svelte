<!-- A Map component build in SVGs using Canvas draw functions which features zoom-in on click functionality. 
 1. Pass in a geojson file, and geoAlbersUsa() and geoPath() will split the file into GeoPath objects. 
 2. Then, iterate over this path array with a Svelte {#each} using the <County> component to render the paths using a Path2D instance to render the path to the HTML Canvas.
 3. The absolutely positioned Canvas has an opacity of 0 and acts as a ID mapper and is placed over the visible canvas. It has distinctly colored features (counties in this case) which allows the user to pass hoveredColorID to clickedCounty when clicked. The other Canvas layer is for visual purposes and user interaction feedback, such as hover states.
 4. Zoom in click events are handled by tracking a clickedCounty variable, which updates the transform and scale to create a zoom effect.
 -->

<script lang="ts">
	import {
		json,
		geoAlbersUsa,
		geoPath,
		zoomIdentity,
		type GeoProjection,
		type GeoPath,
		type GeoPermissibleObjects
	} from 'd3';
	import type { BBox, FeatureCollection, GeoJsonProperties, Geometry } from 'geojson';

	import { onMount } from 'svelte';
	import { genColor } from '../../../../utils';
	import County from '../County/County.svelte';
	import Canvas from '$lib/components/Canvas/Canvas.svelte';
	import type { GeoPathStruct } from './constants';

	export let data: string;

	let geojson: FeatureCollection | undefined;
	let width: number = 400;
	let height: number = 400;

	let hoveredColorID = '';
	let clickedCounty = '';
	let transform = zoomIdentity;

	// Get all the counties with actual coordinates and state, county name, id
	onMount(async () => {
		geojson = await json(data);
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

	$: hoveredCounty = counties.find((county) => county.colorId === hoveredColorID);
</script>

<svelte:window on:keydown={(e) => e.key === 'Escape' && (clickedCounty = undefined)} />

<main
	bind:clientWidth={width}
	bind:clientHeight={height}
	on:click={() => (clickedCounty = hoveredCounty)}
>
	<Canvas {width} {height} {transform} bind:hoveredColorID
		>{#each counties as { id, path }}
			<County {path} fill="purple" opacity={hoveredCounty && hoveredCounty.id === id ? 1.0 : 0.5} />
		{/each}
	</Canvas>
	<Canvas {width} {height} {transform} bind:hoveredColorID hide --position="absolute">
		{#each counties as { id, path, colorId }}
			<!-- svelte-ignore a11y-mouse-events-have-key-events-->
			<County {path} fill={colorId} stroke="#FFFFFF" opacity={1.0} />
		{/each}
	</Canvas>
</main>

<style>
	main {
		width: 100vw;
		height: 100vh;
		cursor: pointer;
		overflow: hidden;
	}
</style>
