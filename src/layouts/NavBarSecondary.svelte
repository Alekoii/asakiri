<script>
	import Button from '$components/common/Button.svelte';

	function goBack() {
		window.history.back();
	}
</script>

<nav>
	<div class="left">
		<Button onclick={goBack} variant="secondary" size="small"
			><svg
				xmlns="http://www.w3.org/2000/svg"
				width="16"
				height="16"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
			>
				<path d="M19 12H5"></path>
				<path d="M12 19l-7-7 7-7"></path>
			</svg>Go Back</Button
		>
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
