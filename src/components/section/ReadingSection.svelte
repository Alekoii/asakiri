<script lang="ts">
	import { BookOpen } from 'lucide-svelte';
	import type { Section } from '$types/section.types';

	let { section = {} } = $props<{ section: Section }>();

	// Reading content would be stored in section.content_json
	let content = $derived(section.content_json || {});
</script>

<div class="reading-section">
	<div class="section-header">
		<BookOpen size={24} />
		<h2>{section.title || 'Reading'}</h2>
	</div>

	<div class="reading-content">
		{#if content.text}
			<div class="text">
				{@html content.text}
			</div>

			{#if content.translation}
				<div class="translation">
					<h3>Translation</h3>
					{@html content.translation}
				</div>
			{/if}
		{:else}
			<div class="empty-state">
				<p>No reading content available for this section.</p>
			</div>
		{/if}

		{#if content.questions && content.questions.length > 0}
			<div class="questions">
				<h3>Comprehension Questions</h3>

				{#each content.questions as question, index}
					<div class="question-item">
						<p class="question">{index + 1}. {question.question}</p>

						{#if question.options}
							<div class="options">
								{#each question.options as option}
									<label class="option">
										<input type="radio" name={`question-${index}`} value={option} />
										<span>{option}</span>
									</label>
								{/each}
							</div>
						{/if}
					</div>
				{/each}

				<button class="check-answers-btn">Check Answers</button>
			</div>
		{/if}
	</div>
</div>

<style>
	.reading-section {
		max-width: 800px;
		margin: 0 auto;
	}

	.section-header {
		display: flex;
		align-items: center;
		gap: var(--gap-sm);
		margin-bottom: var(--gap-lg);
		color: var(--color-primary-500);
	}

	h2 {
		margin: 0;
		font-size: var(--text-2xl);
		font-weight: var(--font-bold);
	}

	h3 {
		margin: var(--gap-lg) 0 var(--gap-md);
		font-size: var(--text-xl);
		font-weight: var(--font-semibold);
		color: var(--color-neutral-800);
	}

	.text {
		line-height: 1.8;
		font-size: var(--text-lg);
	}

	.translation {
		margin-top: var(--gap-lg);
		padding: var(--padding-md);
		background-color: var(--color-neutral-50);
		border-radius: var(--radius-sm);
	}

	.questions {
		margin-top: var(--gap-xl);
	}

	.question-item {
		margin-bottom: var(--gap-lg);
	}

	.question {
		font-weight: var(--font-medium);
		margin-bottom: var(--gap-sm);
	}

	.options {
		display: flex;
		flex-direction: column;
		gap: var(--gap-sm);
		margin-left: var(--gap-md);
	}

	.option {
		display: flex;
		align-items: center;
		gap: var(--gap-sm);
		cursor: pointer;
	}

	.check-answers-btn {
		margin-top: var(--gap-lg);
		padding: var(--padding-sm) var(--padding-md);
		background-color: var(--color-primary-400);
		color: white;
		border: none;
		border-radius: var(--radius-sm);
		font-weight: var(--font-medium);
		cursor: pointer;
	}

	.check-answers-btn:hover {
		background-color: var(--color-primary-500);
	}

	.empty-state {
		padding: var(--padding-lg);
		text-align: center;
		background-color: var(--color-neutral-50);
		border-radius: var(--radius-sm);
		color: var(--color-neutral-600);
		margin-top: var(--gap-lg);
	}
</style>
