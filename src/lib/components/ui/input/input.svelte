<script lang="ts">
	import type { HTMLInputAttributes, HTMLInputTypeAttribute } from 'svelte/elements';
	import { cn, type WithElementRef } from '$lib/utils.js';

	type InputType = Exclude<HTMLInputTypeAttribute, 'file'>;
	type InputEventHandler = NonNullable<HTMLInputAttributes['oninput']>;

	type Props = WithElementRef<
		Omit<HTMLInputAttributes, 'type'> &
			({ type: 'file'; files?: FileList } | { type?: InputType; files?: undefined })
	> & {
		secureInput?: boolean;
	};

	const textInputTypes = new Set<InputType | undefined>([
		undefined,
		'email',
		'search',
		'tel',
		'text',
		'url'
	]);
	const unsafeInputCharactersPattern =
		/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F\u202A-\u202E\u2066-\u2069]/g;

	function normalizeInputValue(rawValue: string): string {
		return rawValue.normalize('NFC').replace(unsafeInputCharactersPattern, '');
	}

	let {
		ref = $bindable(null),
		value = $bindable(),
		type,
		files = $bindable(),
		class: className,
		'data-slot': dataSlot = 'input',
		secureInput = true,
		oninput,
		...restProps
	}: Props = $props();

	function handleInput(event: Event) {
		if (secureInput && textInputTypes.has(type)) {
			const target = event.currentTarget;

			if (target instanceof HTMLInputElement) {
				const normalizedValue = normalizeInputValue(target.value);

				if (target.value !== normalizedValue) {
					target.value = normalizedValue;
					value = normalizedValue;
				}
			}
		}

		(oninput as InputEventHandler | undefined)?.(event as Parameters<InputEventHandler>[0]);
	}
</script>

{#if type === 'file'}
	<input
		bind:this={ref}
		data-slot={dataSlot}
		class={cn(
			'dark:bg-input/30 border-input disabled:bg-input/50 dark:disabled:bg-input/80 h-8 rounded-lg border bg-card px-2.5 py-1 text-base transition-colors file:h-6 file:text-sm file:font-medium md:text-sm file:text-foreground placeholder:text-muted-foreground w-full min-w-0 outline-none file:inline-flex file:border-0 file:bg-transparent disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
			className
		)}
		type="file"
		bind:files
		bind:value
		{...restProps}
	/>
{:else}
	<input
		bind:this={ref}
		data-slot={dataSlot}
		class={cn(
			'dark:bg-input/30 border-input disabled:bg-input/50 dark:disabled:bg-input/80 h-8 rounded-lg border bg-card px-2.5 py-1 text-base transition-colors file:h-6 file:text-sm file:font-medium md:text-sm file:text-foreground placeholder:text-muted-foreground w-full min-w-0 outline-none file:inline-flex file:border-0 file:bg-transparent disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
			className
		)}
		{type}
		bind:value
		{...restProps}
		oninput={handleInput}
	/>
{/if}
