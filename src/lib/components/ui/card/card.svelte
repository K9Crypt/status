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
		"bg-white/5 backdrop-blur-lg flex flex-col gap-6 rounded-xl border border-white/10 py-6 shadow-sm",
		className
	)}
	{...restProps}
>
	{@render children?.()}
</div>
