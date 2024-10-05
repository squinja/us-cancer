<script lang="ts">
	import Canvas from '$lib/Canvas.svelte';
	import Circle from '$lib/Circle.svelte';
	import { scaleLinear } from 'd3';

	interface Circle {
		a: number;
		b: number;
		r: number;
		fill: string;
	}

	let data: Circle[] = [];
	setInterval(() => {
		data = Array.from({ length: 1000 }).map(() => {
			return {
				a: Math.random(),
				b: Math.random(),
				r: Math.random(),
				fill: `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255})`
			};
		});
	}, 5000);

	let width = 1000;
	let height = 500;

	$: xScale = scaleLinear().domain([0, 1]).range([0, width]);

	$: yScale = scaleLinear().domain([0, 1]).range([height, 0]);

	$: rScale = scaleLinear()
		.domain([0, 1])
		.range([5, width / 100]);

	const geojsonPath =
		'https://raw.githubusercontent.com/plotly/datasets/master/geojson-counties-fips.json';
</script>

<h1>Welcome to SvelteKit</h1>
<main bind:clientWidth={width} bind:clientHeight={height}>
	<Canvas {width} {height}>
		{#each data as { a, b, r, fill }}
			<Circle x={xScale(a)} y={yScale(b)} r={rScale(r)} {fill} />
		{/each}
	</Canvas>
</main>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>

<style>
	main {
		width: 100vw;
		height: 100vh;
	}
</style>
