<script lang="ts">
	import { browser } from '$app/environment';
	import { onMount, setContext } from 'svelte';
	import { cubicInOut } from 'svelte/easing';
	import { tweened } from 'svelte/motion';

	export let width: number;
	export let height: number;
	export let hide = false;
	export let contextName = 'canvas';
	export let hoveredColorID: string | undefined;
	export let transform;

	const drawFunctions: ((ctx: CanvasRenderingContext2D | null) => void)[] = [];
	const tTransform = tweened(transform, { duration: 400, easing: cubicInOut });

	let canvas: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D | null;
	let pendingInvalidation = false;
	let frameId: number;

	function scaleCanvas(
		canvas: HTMLCanvasElement,
		ctx: CanvasRenderingContext2D,
		width: number,
		height: number
	): void {
		const devicePixelRatio = window.devicePixelRatio || 1;

		canvas.width = width * devicePixelRatio;
		canvas.height = height * devicePixelRatio;
		canvas.style.width = width + 'px';
		canvas.style.height = height + 'px';

		ctx.scale(devicePixelRatio, devicePixelRatio);
	}

	function update(): void {
		if (!ctx) return;

		ctx.clearRect(0, 0, width, height);

		drawFunctions.forEach((fn) => {
			ctx?.save();
			ctx.translate($tTransform.x, $tTransform.y);
			ctx.scale($tTransform.k, $tTransform.k);
			fn(ctx);
			ctx.restore();
		});

		pendingInvalidation = false;
	}

	const handleMouseMove = (e: MouseEvent) => {
		const { layerX: x, layerY: y } = e;
		const { data } = ctx.getImageData(x * devicePixelRatio, y * devicePixelRatio, 1, 1);
		const [r, g, b] = data;
		if (r + g + b === 0) {
			hoveredColorID = undefined;
		} else {
			hoveredColorID = `rgb(${r},${g},${b})`;
		}
	};

	onMount(() => {
		ctx = canvas.getContext('2d');
	});

	function invalidate() {
		if (!browser || pendingInvalidation) return;
		pendingInvalidation = true;
		frameId = requestAnimationFrame(update);
	}

	$: setContext(contextName, {
		register(fn: (ctx: CanvasRenderingContext2D | null) => void): void {
			drawFunctions.push(fn);
		},
		deregister(fn: (ctx: CanvasRenderingContext2D | null) => void): void {
			drawFunctions.splice(drawFunctions.indexOf(fn), 1);
		},
		invalidate
	});

	$: if (canvas && ctx) scaleCanvas(canvas, ctx, width, height);
	$: tTransform.set(transform);
	$: if ($tTransform) invalidate();
</script>

<canvas class:hide bind:this={canvas} on:mousemove={handleMouseMove}><slot /></canvas>

<style>
	canvas {
		position: var(--position, relative);
		top: 0;
		left: 0;
	}

	canvas.hide {
		opacity: 0;
	}
</style>
