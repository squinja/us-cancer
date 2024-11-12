<script lang="ts">
	import { getContext, onMount, onDestroy, afterUpdate } from 'svelte';
	import { tweened } from 'svelte/motion';

	export let path: string | Path2D | undefined;
	export let opacity = 1.0;
	export let stroke: string | undefined = undefined;
	export let strokeWidth = 1;
	export let fill: string | CanvasGradient | CanvasPattern | undefined = undefined;
	export let contextName = 'canvas';

    interface Context {
		register: (fn: (ctx: CanvasRenderingContext2D) => void) => void;
		deregister: (fn: (ctx: CanvasRenderingContext2D) => void) => void;
		invalidate: () => void;
	}

	const { register, deregister, invalidate }: Context = getContext(contextName);
	const tOpacity = tweened(opacity, { duration: 200, delay: 0 });

	function draw(ctx: CanvasRenderingContext2D) {
		const p = new Path2D(path);
		ctx.globalAlpha = $tOpacity;
		ctx.fillStyle = fill as string | CanvasGradient | CanvasPattern;
		ctx.fill(p);
		if (stroke) {
			ctx.strokeStyle = stroke;
			ctx.lineWidth = strokeWidth;
			ctx.stroke(p);
		} 
	}

	onMount(() => {
		register(draw);
		invalidate();
	});

	onDestroy(() => {
		deregister(draw);
	});

	afterUpdate(invalidate);

	$: tOpacity.set(opacity, { duration: 100, });
</script>