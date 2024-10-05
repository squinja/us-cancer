<script lang="ts">
	import { onMount, setContext } from 'svelte';

	export let width: number;
	export let height: number;
	export let contextName = 'canvas';

	const drawFunctions: ((ctx: CanvasRenderingContext2D| null) => void)[] = [];

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
			fn(ctx);
			ctx?.restore();
		});

		pendingInvalidation = false;
	}

	onMount(() => {
		ctx = canvas.getContext('2d');
	});

	$: setContext(contextName, {
		register(fn: (ctx: CanvasRenderingContext2D | null) => void): void {
			drawFunctions.push(fn);
		},
		deregister(fn: (ctx: CanvasRenderingContext2D | null) => void): void {
			drawFunctions.splice(drawFunctions.indexOf(fn), 1);
		},
		invalidate(): void {
			if (pendingInvalidation) return;
			pendingInvalidation = true;
			frameId = requestAnimationFrame(update);
		}
	});

	$: if (canvas && ctx) scaleCanvas(canvas, ctx, width, height);
</script>

<canvas bind:this={canvas}><slot /></canvas>
