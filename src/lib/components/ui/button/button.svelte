<script lang="ts" module>
	import { cn, type WithElementRef } from "$lib/utils.js";
	import type { HTMLAnchorAttributes, HTMLButtonAttributes } from "svelte/elements";
	import { type VariantProps, tv } from "tailwind-variants";

	export const buttonVariants = tv({
		base: "aria-invalid:border-destructive inline-flex text-sm shrink-0 items-center justify-center rounded gap-2 whitespace-nowrap font-medium outline-none transition-all disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0 hover:cursor-pointer disabled:cursor-not-allowed",
		variants: {
			variant: {
				default: "bg-primary text-black shadow-xs",
				destructive:
					"bg-destructive shadow-xs hover:bg-destructive/90 dark:bg-destructive/60 text-white",
				outline:
					"bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:hover:bg-input/50 border",
				secondary: "bg-secondary text-secondary-foreground shadow-xs border border-white/10 backdrop-blur-xl",
				ghost: "hover:bg-secondary hover:text-secondary-foreground dark:hover:bg-secondary/50 border-transparent hover:border hover:border-white/10",
				link: "text-primary underline-offset-4 hover:underline",
				icon: "bg-transparent",
			},
			size: {
				default: "px-6 py-2.5 has-[>svg]:px-3",
				sm: "gap-1.5 px-6 py-1.5 has-[>svg]:px-2.5",
				lg: "px-10 py-2.5 has-[>svg]:px-4",
				icon: "size-9",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "default",
		},
	});

	export type ButtonVariant = VariantProps<typeof buttonVariants>["variant"];
	export type ButtonSize = VariantProps<typeof buttonVariants>["size"];

	export type ButtonProps = WithElementRef<HTMLButtonAttributes> &
		WithElementRef<HTMLAnchorAttributes> & {
			variant?: ButtonVariant;
			size?: ButtonSize;
		};
</script>

<script lang="ts">
	let {
		class: className,
		variant = "default",
		size = "default",
		ref = $bindable(null),
		href = undefined,
		type = "button",
		disabled,
		children,
		...restProps
	}: ButtonProps = $props();
</script>

{#if href}
	<a
		bind:this={ref}
		data-slot="button"
		class={cn(buttonVariants({ variant, size }), className)}
		href={disabled ? undefined : href}
		aria-disabled={disabled}
		role={disabled ? "link" : undefined}
		tabindex={disabled ? -1 : undefined}
		{...restProps}
	>
		{@render children?.()}
	</a>
{:else}
	<button
		bind:this={ref}
		data-slot="button"
		class={cn(buttonVariants({ variant, size }), className)}
		{type}
		{disabled}
		{...restProps}
	>
		{@render children?.()}
	</button>
{/if}