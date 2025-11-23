<script lang="ts" module>
	import { type VariantProps, tv } from "tailwind-variants";

	export const badgeVariants = tv({
		base: "aria-invalid:border-destructive inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-hidden whitespace-nowrap border px-2 py-0.5 text-xs font-medium transition-[color,box-shadow] [&>svg]:pointer-events-none [&>svg]:size-3 rounded-full",
		variants: {
			variant: {
				default:
					"bg-primary/20 border-primary text-primary",
				secondary:
					"bg-white/5 backdrop-blur-lg border-white/10",
				destructive:
					"bg-red-500/20 border-red-500 text-red-500",
				outline: "text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
			},
			size: {
				default: "px-2 py-0.5 text-xs",
				sm: "px-1.5 py-0.5 text-[10px]",
				lg: "px-3 py-1 text-sm",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "default",
		},
	});

	export type BadgeVariant = VariantProps<typeof badgeVariants>["variant"];
	export type BadgeSize = VariantProps<typeof badgeVariants>["size"];
</script>

<script lang="ts">
	import type { HTMLAnchorAttributes } from "svelte/elements";
	import { cn, type WithElementRef } from "$lib/utils.js";

	let {
		ref = $bindable(null),
		href,
		class: className,
		variant = "default",
		size = "default",
		children,
		...restProps
	}: WithElementRef<HTMLAnchorAttributes> & {
		variant?: BadgeVariant;
		size?: BadgeSize;
	} = $props();
</script>

<svelte:element
	this={href ? "a" : "span"}
	bind:this={ref}
	data-slot="badge"
	{href}
	class={cn(badgeVariants({ variant, size }), className)}
	{...restProps}
>
	{@render children?.()}
</svelte:element>
