<script lang="ts">
	import { Tooltip as TooltipPrimitive } from "bits-ui";
	import { cn } from "$lib/utils.js";

	let {
		ref = $bindable(null),
		class: className,
		sideOffset = 0,
		side = "bottom",
		position,
		children,
		arrowClasses,
		...restProps
	}: TooltipPrimitive.ContentProps & {
		arrowClasses?: string;
		position?: "top" | "bottom" | "left" | "right";
	} = $props();

	side = position || side;
</script>

<TooltipPrimitive.Portal>
	<TooltipPrimitive.Content
		bind:ref
		data-slot="tooltip-content"
		{sideOffset}
		{side}
		class={cn(
			"bg-white/5 backdrop-blur-lg animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--bits-tooltip-content-transform-origin) z-50 w-fit text-balance rounded-lg px-3 py-1.5 text-xs border border-white/10",
			className
		)}
		{...restProps}
	>
		{@render children?.()}
	</TooltipPrimitive.Content>
</TooltipPrimitive.Portal>
