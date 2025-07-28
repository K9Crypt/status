<script lang="ts">
	import type { HTMLAttributes } from "svelte/elements";
	import { cn, type WithElementRef } from "$lib/utils.js";

	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLDivElement>> = $props();
</script>

<div
	bind:this={ref}
	data-slot="card"
	class={cn(
		"bg-white/5 border rounded border-white/10 flex flex-col gap-6 py-6 backdrop-blur-xl shadow-xs",
		className
	)}
	{...restProps}
>
	{@render children?.()}
</div>