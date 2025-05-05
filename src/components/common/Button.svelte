<script lang="ts">
	import type { Snippet } from 'svelte';

	interface CommonProps {
		children: Snippet;
		variant?: 'primary' | 'secondary' | 'text';
		size?: 'small' | 'medium' | 'large';
		disabled?: boolean;
	}

	interface ButtonProps extends CommonProps {
		onclick?: (e: MouseEvent) => void;
		type?: 'button' | 'submit' | 'reset';
		href?: never;
	}

	interface LinkProps extends CommonProps {
		href: string;
		onclick?: never;
	}

	let {
		children,
		href,
		onclick,
		variant = 'primary',
		size = 'small',
		disabled = false,
		...props
	}: ButtonProps | LinkProps = $props();
</script>

{#if href}
	<a {href} class={`button ${variant} ${size} ${disabled ? 'disabled' : ''}`}>
		{@render children()}
	</a>
{:else}
	<button
		{...props}
		{onclick}
		class={`button ${variant} ${size} ${disabled ? 'disabled' : ''}`}
		{disabled}
	>
		{@render children()}
	</button>
{/if}

<style lang="scss">
	.button {
		font-family: sans-serif;
		font-weight: 500;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		line-height: 1;
		transition: all 0.2s ease-in-out;
		border: none;
		outline: none;
		gap: var(--gap-xs);
		border-radius: var(--radius-sm);

		&:focus {
			box-shadow: 0 0 0 3px var(--color-primary-100);
		}

		// Button types
		&.primary {
			background-color: var(--color-primary-400);
			color: white;
			border: 1.5px solid var(--color-primary-400);

			&:hover:not(.disabled) {
				background-color: var(--color-primary-500);
			}

			&:active:not(.disabled) {
				background-color: var(--color-primary-700);
			}
		}

		&.secondary {
			background-color: var(--color-primary-50);
			color: var(--color-primary-600);
			border: 1.5px solid var(--color-primary-600);

			&:hover:not(.disabled) {
				background-color: var(--color-primary-200);
			}

			&:active:not(.disabled) {
				background-color: var(--color-neutral-300);
			}
		}

		&.text {
			background-color: transparent;
			color: var(--color-neutral-400);
			border: 1.5px solid transparent;

			&:hover:not(.disabled) {
				background-color: var(--color-neutral-100);
			}

			&:active:not(.disabled) {
				background-color: var(--color-neutral-100);
			}
		}

		// Button sizes
		&.small {
			padding: 8px 16px;
			font-size: 0.875rem;
		}

		&.medium {
			padding: 10px 20px;
			font-size: 1rem;
		}

		&.large {
			padding: 12px 24px;
			font-size: 1.125rem;
		}

		// Disabled state
		&.disabled {
			cursor: not-allowed;
			opacity: 0.6;
			pointer-events: none;
		}
	}
</style>
