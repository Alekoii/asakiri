<script lang="ts">
	import Link from '$components/common/Link.svelte';
	import { ArrowLeft } from 'lucide-svelte';

	let { href, text = 'Back' } = $props<{
		href: string;
		text?: string;
	}>();
</script>

<nav>
	<div class="left">
		<Link {href} variant="secondary" target="_self">
			<ArrowLeft size={16} />
			<span>{text}</span>
		</Link>
	</div>
</nav>

<style lang="scss">
	nav {
		display: flex;
		justify-content: space-between;
		padding: var(--padding-xs) var(--padding-lg);
		position: relative;
		border-bottom: 1px solid var(--color-neutral-200);
		background-color: var(--color-neutral-0);

		.left {
			display: flex;
			align-items: center;
			gap: var(--gap-md);
		}
	}
</style>
