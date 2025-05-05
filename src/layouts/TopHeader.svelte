<script>
	import Button from '$components/common/Button.svelte';

	let { location = 'learners' } = $props();
</script>

<nav class="nav">
	<div class="left">
		<Button variant={location === 'learners' ? 'secondary' : 'text'} href="/">Learners</Button>
		<Button variant={location === 'teachers' ? 'secondary' : 'text'} href="/teacher/courses">Teach</Button>
	</div>

	<div class="right">
		<Button variant="text" href="/privacy">Privacy Policy</Button>
		<Button variant="text" href="/terms">Terms of Use</Button>
	</div>
</nav>

<style lang="scss">
	.nav {
		padding: var(--padding-xs) var(--padding-xl);
		display: flex;
		justify-content: space-between;
		border-bottom: 1px solid var(--color-neutral-100);
		background-color: var(--color-neutral-0);

		.left,
		.right {
			display: flex;
			gap: var(--gap-xs);
			align-items: center;
		}
	}
</style>
