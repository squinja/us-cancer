<script lang="ts">
	import { afterUpdate, getContext, onDestroy, onMount } from 'svelte';
	import { cubicOut } from 'svelte/easing';
	import { tweened, type Tweened } from 'svelte/motion';

	export let x: number;
	export let y: number;
	export let r: number;
	export let fill: string;
	export let contextName = 'canvas';

	interface Context {
		register: (fn: (ctx: CanvasRenderingContext2D) => void) => void;
		deregister: (fn: (ctx: CanvasRenderingContext2D) => void) => void;
		invalidate: () => void;
	}
	
	const { register, deregister, invalidate }: Context = getContext(contextName);

	const tweenParams = {
		duration: 1000,
		easing: cubicOut
	};
	const tX = tweened<number | undefined>(undefined, tweenParams);
	const tY = tweened<number | undefined>(undefined, tweenParams);
	const tR = tweened<number | undefined>(undefined, tweenParams);

	function draw(ctx: CanvasRenderingContext2D): void {
		ctx.translate($tX ?? 0, $tY ?? 0);
		ctx.globalAlpha = 0.8;
		ctx.fillStyle = fill;
		ctx.beginPath();
		ctx.arc(0, 0, $tR ?? 0, 0, 2 * Math.PI, false);
		ctx.fill();
	}

	onMount((): void => {
		register(draw);
		invalidate();
	});

	onDestroy((): void => {
		deregister(draw);
	});

	afterUpdate(invalidate);

	$: tX.set(x);
	$: tY.set(y);
	$: tR.set(r);
</script>
