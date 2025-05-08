<script lang="ts">
	import type { Snippet } from 'svelte';

	interface LinkProps {
		children: Snippet;
		href: string;
		target?: '_blank' | '_self' | '_parent' | '_top';
		rel?: string;
		variant?: 'primary' | 'secondary' | 'text';
	}

	let {
		children,
		href,
		target,
		rel = target === '_blank' ? 'noopener noreferrer' : undefined,
		variant = 'primary',
		...props
	}: LinkProps = $props();
</script>

<a {href} {target} {rel} class={`link ${variant}`} {...props}>
	{@render children()}
</a>

<style lang="scss">
	.link {
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
		text-decoration: none;
		padding: 8px 16px;
		font-size: 0.875rem;

		&:focus {
			box-shadow: 0 0 0 3px var(--color-primary-100);
		}

		// Link variants
		&.primary {
			background-color: var(--color-primary-400);
			color: white;
			border: 1.5px solid var(--color-primary-400);

			&:hover {
				background-color: var(--color-primary-500);
			}

			&:active {
				background-color: var(--color-primary-700);
			}
		}

		&.secondary {
			background-color: var(--color-primary-50);
			color: var(--color-primary-600);
			border: 1.5px solid var(--color-primary-600);

			&:hover {
				background-color: var(--color-primary-200);
			}

			&:active {
				background-color: var(--color-neutral-300);
			}
		}

		&.text {
			background-color: transparent;
			color: var(--color-neutral-400);
			border: 1.5px solid transparent;

			&:hover {
				background-color: var(--color-neutral-100);
			}

			&:active {
				background-color: var(--color-neutral-100);
			}
		}
	}
</style>
