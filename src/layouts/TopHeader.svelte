<script>
	import Button from '$components/common/Button.svelte';

	let { location = 'learners' } = $props();
</script>

<nav class="nav">
	<div class="left">
		<Button variant={location === 'learners' ? 'secondary' : 'text'} href="/">Learners</Button>
		<Button variant={location === 'teachers' ? 'secondary' : 'text'} href="/teacher/courses"
			>Teach</Button
		>
	</div>

	<div class="right">
		<a href="https://discord.gg/6VhDw5RXJ2" target="_blank">Join Discord Community</a>
	</div>
</nav>

<style lang="scss">
	.nav {
		padding: var(--padding-xs) var(--padding-xl);
		display: flex;
		justify-content: space-between;
		border-bottom: 1px solid var(--color-neutral-100);
		background-color: var(--color-neutral-0);

		.left {
			display: flex;
			gap: var(--gap-xs);
			align-items: center;
		}

		.right {
			display: flex;
			gap: var(--gap-lg);
			align-items: center;

			a {
				color: var(--color-neutral-400);
			}
			a:hover {
				color: var(--color-primary-400);
			}
		}
	}
</style>
