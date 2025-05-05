<script lang="ts">
	import { GraduationCap } from 'lucide-svelte';
	import type { Section } from '$types/section.types';

	let { section = {} } = $props<{ section: Section }>();

	// Grammar content would be stored in section.content_json
	let content = $derived(section.content_json || {});
</script>

<div class="grammar-section">
	<div class="section-header">
		<GraduationCap size={24} />
		<h2>{section.title || 'Grammar'}</h2>
	</div>

	<div class="grammar-content">
		{#if content.explanation}
			<div class="explanation">
				<h3>Explanation</h3>
				<div class="content-html">
					{@html content.explanation}
				</div>
			</div>
		{/if}

		{#if content.examples && content.examples.length > 0}
			<div class="examples">
				<h3>Examples</h3>
				<ul>
					{#each content.examples as example}
						<li>
							<div class="example">{example.text}</div>
							{#if example.translation}
								<div class="translation">{example.translation}</div>
							{/if}
						</li>
					{/each}
				</ul>
			</div>
		{:else if content.examples && content.examples.length === 0}
			<div class="examples">
				<h3>Examples</h3>
				<p class="empty-message">No examples available.</p>
			</div>
		{/if}

		{#if content.practice && content.practice.length > 0}
			<div class="practice">
				<h3>Practice</h3>
				{#each content.practice as exercise}
					<div class="exercise">
						<p class="question">{exercise.question}</p>
						{#if exercise.options}
							<div class="options">
								{#each exercise.options as option}
									<button class="option">{option}</button>
								{/each}
							</div>
						{/if}
					</div>
				{/each}
			</div>
		{/if}

		{#if !content.explanation && (!content.examples || content.examples.length === 0) && (!content.practice || content.practice.length === 0)}
			<div class="empty-state">
				<p>No grammar content available for this section.</p>
			</div>
		{/if}
	</div>
</div>

<style>
	.grammar-section {
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

	.examples ul {
		list-style: none;
		padding: 0;
		margin: 0;
	}

	.examples li {
		margin-bottom: var(--gap-md);
		padding: var(--padding-md);
		background-color: var(--color-neutral-50);
		border-radius: var(--radius-sm);
	}

	.translation {
		margin-top: var(--gap-xs);
		font-style: italic;
		color: var(--color-neutral-600);
	}

	.exercise {
		margin-bottom: var(--gap-lg);
		padding: var(--padding-md);
		background-color: var(--color-neutral-50);
		border-radius: var(--radius-sm);
	}

	.options {
		display: flex;
		flex-wrap: wrap;
		gap: var(--gap-sm);
		margin-top: var(--gap-md);
	}

	.option {
		padding: var(--padding-xs) var(--padding-sm);
		background-color: var(--color-neutral-0);
		border: 1px solid var(--color-neutral-300);
		border-radius: var(--radius-xs);
		cursor: pointer;
	}

	.option:hover {
		background-color: var(--color-primary-50);
		border-color: var(--color-primary-300);
	}

	.empty-state {
		padding: var(--padding-lg);
		text-align: center;
		background-color: var(--color-neutral-50);
		border-radius: var(--radius-sm);
		color: var(--color-neutral-600);
		margin-top: var(--gap-lg);
	}

	.empty-message {
		color: var(--color-neutral-500);
		font-style: italic;
	}
</style>
