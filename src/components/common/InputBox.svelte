<script lang="ts">
	interface InputProps {
		type?: string;
		value?: string;
		placeholder?: string;
		label?: string;
		hint?: string;
		error?: string;
		disabled?: boolean;
		required?: boolean;
		name?: string;
		onchange?: (e: Event) => void;
		oninput?: (e: Event) => void;
	}

	let {
		type = 'text',
		value = $bindable(''),
		placeholder = '',
		label,
		hint,
		error,
		name,
		disabled = false,
		required = false,
		onchange,
		oninput,
		...props
	}: InputProps = $props();

	const id = `input-${label?.toLowerCase().replace(/\s+/g, '-') || crypto.randomUUID().slice(0, 8)}`;
</script>

{#if label}
	<label class="label" for={id}>
		{label}{required ? ' *' : ''}
	</label>
{/if}

<div class="input-wrapper {error ? 'error' : ''} {disabled ? 'disabled' : ''}">
	<input
		{id}
		{type}
		bind:value
		{placeholder}
		{disabled}
		{required}
		{onchange}
		{oninput}
		{name}
		{...props}
	/>
</div>

{#if error}
	<div class="message error">{error}</div>
{:else if hint}
	<div class="message hint">{hint}</div>
{/if}

<style lang="scss">
	.label {
		display: block;
		margin-bottom: 4px;
		font-weight: var(--font-medium);
		color: var(--color-neutral-900);
		font-size: var(--text-base);
	}

	.input-wrapper {
		width: 100%;
		position: relative;

		input {
			width: 100%;
			box-sizing: border-box;
			font-family: var(--font-primary), sans-serif;
			border: 1px solid var(--color-neutral-300);
			background-color: var(--color-neutral-0);
			color: var(--color-neutral-900);
			padding: 16px;
			font-size: var(--text-base);
			border-radius: var(--radius-sm);
			transition: border-color 0.2s;
			outline: none;

			&:focus {
				border-color: var(--color-primary-300);
			}

			&::placeholder {
				color: var(--color-neutral-500);
			}
		}

		&.error input {
			border-color: var(--color-primary-700);
		}

		&.disabled input {
			background-color: var(--color-neutral-100);
			color: var(--color-neutral-500);
			cursor: not-allowed;
		}
	}

	.message {
		font-size: var(--text-sm);
		margin-top: 4px;

		&.error {
			color: var(--color-primary-700);
		}

		&.hint {
			color: var(--color-neutral-600);
		}
	}
</style>
