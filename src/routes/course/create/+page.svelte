<script lang="ts">
	import Button from '$components/common/Button.svelte';
	import InputBox from '$components/common/InputBox.svelte';
	import NavBarSecondary from '$layouts/NavBarSecondary.svelte';
	import type { PageData } from './$types';

	let { data } = $props<{ data: PageData }>();
	let form = $derived(data.form);

	let courseName = $state('');
	let isSubmitting = $state(false);
	let remainingChars = $derived(150 - courseName.length);

	function handleNameInput(e: Event) {
		const target = e.target as HTMLInputElement;
		courseName = target.value;
	}
</script>

<NavBarSecondary />
<main>
	<div class="create-course-container">
		<div class="create-course-form-container">
			<h1>Create New Course</h1>
			<p class="subtitle">Enter a name for your new course</p>

			{#if form?.error}
				<div class="error-message">
					<p>{form.error}</p>
				</div>
			{/if}

			<form class="create-course-form" method="POST">
				<div class="form-group">
					<InputBox
						type="text"
						name="courseName"
						label="Course Name"
						placeholder="Enter Course Name"
						value={courseName}
						required={true}
						oninput={handleNameInput}
						error={form?.error?.includes('name') ? form.error : ''}
					/>
					<div class="character-counter">
						Keep it under 150 characters ({remainingChars} remaining)
					</div>
				</div>

				<div class="form-actions">
					<Button
						type="submit"
						variant="primary"
						size="medium"
						disabled={isSubmitting || !courseName.trim()}
					>
						{isSubmitting ? 'Creating...' : 'Create Course'}
					</Button>
				</div>
			</form>
		</div>
	</div>
</main>

<style lang="scss">
    main {
        background-color: var(--color-neutral-50);
        height:93vh;
        align-content: center;
    }
	.create-course-container {
		max-width: 600px;
		margin: 0 auto;
		padding: var(--padding-xl) 96px;
	}

	.create-course-header {
		margin-bottom: var(--gap-lg);
	}

	.create-course-form-container {
		background-color: var(--color-neutral-0);
		border-radius: var(--radius-sm);
		padding: var(--padding-xl);

		h1 {
			font-size: var(--text-2xl);
			margin: 0 0 var(--gap-xs);
			text-align: start;
			color: var(--color-neutral-900);
		}

		.subtitle {
			text-align: start;
			color: var(--color-neutral-600);
			margin-bottom: var(--gap-xl);
		}
	}

	.create-course-form {
		display: flex;
		flex-direction: column;
		gap: var(--gap-lg);
	}

	.form-group {
		display: flex;
		flex-direction: column;
		gap: var(--gap-xs);
	}

	.character-counter {
		font-size: var(--text-sm);
		color: var(--color-neutral-600);
		margin-top: 4px;
	}

	.form-actions {
		display: flex;
		justify-content: start;
		margin-top: var(--gap-md);
	}

	.error-message {
		background-color: rgba(255, 0, 0, 0.05);
		border-radius: var(--radius-xs);
		padding: var(--padding-sm);
		margin-bottom: var(--gap-md);

		p {
			color: var(--color-primary-700);
			margin: 0;
		}
	}
</style>
