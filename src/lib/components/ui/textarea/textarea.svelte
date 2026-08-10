<script lang="ts">
	import { cn, type WithElementRef, type WithoutChildren } from '$lib/utils.js';
	import type { HTMLTextareaAttributes } from 'svelte/elements';

	type TextareaEventHandler = NonNullable<HTMLTextareaAttributes['oninput']>;
	type Props = WithoutChildren<WithElementRef<HTMLTextareaAttributes>> & {
		secureInput?: boolean;
	};

	const unsafeTextareaCharactersPattern =
		/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F\u202A-\u202E\u2066-\u2069]/g;

	function normalizeTextareaValue(rawValue: string): string {
		return rawValue.normalize('NFC').replace(unsafeTextareaCharactersPattern, '');
	}

	let {
		ref = $bindable(null),
		value = $bindable(),
		class: className,
		'data-slot': dataSlot = 'textarea',
		secureInput = true,
		oninput,
		...restProps
	}: Props = $props();

	function handleInput(event: Event) {
		if (secureInput) {
			const target = event.currentTarget;

			if (target instanceof HTMLTextAreaElement) {
				const normalizedValue = normalizeTextareaValue(target.value);

				if (target.value !== normalizedValue) {
					target.value = normalizedValue;
					value = normalizedValue;
				}
			}
		}

		(oninput as TextareaEventHandler | undefined)?.(event as Parameters<TextareaEventHandler>[0]);
	}
</script>

<textarea
	bind:this={ref}
	data-slot={dataSlot}
	class={cn(
		'border-input dark:bg-input/30 disabled:bg-input/50 dark:disabled:bg-input/80 rounded-lg border bg-card px-2.5 py-2 text-base transition-colors md:text-sm placeholder:text-muted-foreground flex field-sizing-content min-h-16 w-full outline-none disabled:cursor-not-allowed disabled:opacity-50',
		className
	)}
	bind:value
	{...restProps}
	oninput={handleInput}></textarea>
