<script lang="ts">
	import { BookText, GraduationCap, BookOpen } from 'lucide-svelte';
	import type { PageData } from './$types';
	import SectionBadge from '$components/common/SectionBadge.svelte';
	import Button from '$components/common/Button.svelte';
	import FlashcardReview from '$components/review/FlashcardReview.svelte';
	import NavBarSecondary from '$layouts/NavBarSecondary.svelte';

	let { data } = $props<{ data: PageData }>();
	let { isEnrolled, unit, sections = [], reading, vocabulary } = data;
	let activeTab = $state('grammar');

	let showVocabReview = $state(false);

	function toggleVocabReview() {
		showVocabReview = !showVocabReview;
	}
</script>

<NavBarSecondary href="/course/{unit.course_id}" />

<div class="unit-page">
	{#if isEnrolled}
		<div class="unit-header">
			<h1>Unit {unit.serial_number || ''}: {unit.title}</h1>

			{#if unit.description}
				<p class="description">{unit.description}</p>
			{/if}
		</div>
		<div class="unit-tabs">
			<button
				class={`tab ${activeTab === 'grammar' ? 'active' : ''}`}
				onclick={() => (activeTab = 'grammar')}
			>
				<GraduationCap size={18} />
				<span>Grammar</span>
			</button>
			<button
				class={`tab ${activeTab === 'vocabulary' ? 'active' : ''}`}
				onclick={() => (activeTab = 'vocabulary')}
			>
				<BookText size={18} />
				<span>Vocabulary</span>
			</button>
			<button
				class={`tab ${activeTab === 'reading' ? 'active' : ''}`}
				onclick={() => (activeTab = 'reading')}
			>
				<BookOpen size={18} />
				<span>Reading</span>
			</button>
		</div>
		{#if showVocabReview}
			<div class="review-container">
				<div class="review-header">
					<h2>Vocabulary Review</h2>
					<Button onclick={toggleVocabReview} variant="secondary" size="small">Exit Review</Button>
				</div>
				<FlashcardReview items={vocabulary} />
			</div>
		{:else}
			<div class="unit-content">
				{#if activeTab === 'grammar'}
					<div class="section-container">
						{#if sections.length > 0}
							{#each sections as section}
								<div class="content-section">
									<div class="content-section-header">
										<h3>{section.title}</h3>
									</div>

									<div class="content-body">
										{#if section.content_html}
											{@html section.content_html}
										{:else}
											<p class="empty-content">No content available for this grammar section.</p>
										{/if}
									</div>
								</div>
							{/each}
						{:else}
							<div class="empty-state">
								<p>No grammar lessons available in this unit.</p>
							</div>
						{/if}
					</div>
				{:else if activeTab === 'vocabulary'}
					<div class="section-container">
						{#if vocabulary.length === 0}
							<div class="empty-state">
								<p>No vocabulary terms in this unit.</p>
							</div>
						{:else}
							<div class="content-section">
								<div class="content-section-header">
									<div class="section-badge">
										<SectionBadge type="vocabulary" />
									</div>
								</div>
								<div class="terms-table-container">
									<table class="terms-table">
										<thead>
											<tr>
												<th>#</th>
												<th>Front Content</th>
												<th>Back Content</th>
												<th>Hint</th>
											</tr>
										</thead>
										<tbody>
											{#each vocabulary as item}
												<tr>
													<td class="serial-number">{item.serial_number}</td>
													<td>
														{item.front_content}
													</td>
													<td>
														{item.back_content}
													</td>
													<td>
														{item.hint}
													</td>
												</tr>
											{/each}
										</tbody>
									</table>
								</div>
							</div>
						{/if}
					</div>
				{:else if activeTab === 'reading'}
					<div class="section reading-preview">
						{#if reading.length > 0}
							<div class="preview-content">
								<div class="original-text">
									<h2>Reading Text</h2>
									{#each reading as sentence (sentence.id)}
										<p>{sentence.text}</p>
									{/each}
								</div>
							</div>
							<div class="preview-content">
								<div class="translation">
									<h2>With Transaltion</h2>
									{#each reading as sentence (sentence.id)}
										<div class="translations">
											<p>{sentence.text}</p>
											<p>{sentence.translation}</p>
										</div>
									{/each}
								</div>
							</div>
						{:else}
							<div class="empty-state">
								<p>No reading materials available in this unit.</p>
							</div>
						{/if}
					</div>
				{/if}
			</div>
		{/if}
	{:else}
		<div class="empty-state">
			<p>You must be enrolled in this course to view the unit.</p>
			<Button variant="primary" href={`/course/${data.courseId}`}>Go back to Course</Button>
		</div>
	{/if}
</div>

<style>
	.unit-page {
		max-width: 900px;
		margin: 0 auto;
		padding: var(--padding-lg);
	}

	.back-nav {
		margin-bottom: var(--gap-lg);
	}

	.back-link {
		display: inline-flex;
		align-items: center;
		gap: var(--gap-xs);
		color: var(--color-neutral-600);
	}

	.back-link:hover {
		color: var(--color-primary-500);
	}

	.unit-header {
		margin-bottom: var(--gap-xl);
	}

	h1 {
		font-size: var(--text-3xl);
		font-weight: var(--font-bold);
		margin: 0 0 var(--gap-sm);
	}

	.description {
		color: var(--color-neutral-700);
		line-height: 1.5;
	}

	.unit-tabs {
		display: flex;
		border-bottom: 1px solid var(--color-neutral-200);
		margin-bottom: var(--gap-xl);
	}

	.tab {
		display: flex;
		align-items: center;
		gap: var(--gap-xs);
		padding: var(--padding-sm) var(--padding-md);
		background: none;
		border: none;
		font-size: var(--text-base);
		color: var(--color-neutral-600);
		border-bottom: 2px solid transparent;
		cursor: pointer;
	}

	.tab:hover {
		color: var(--color-primary-400);
	}

	.tab.active {
		color: var(--color-primary-500);
		border-bottom-color: var(--color-primary-500);
		font-weight: var(--font-medium);
	}

	.section-container {
		animation: fadeIn 0.3s ease;
	}

	.section-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: var(--gap-lg);
	}

	h2 {
		font-size: var(--text-lg);
		font-weight: var(--font-medium);
		margin: 0 0 var(--gap-lg);
	}

	.content-section {
		margin-bottom: var(--gap-xl);
		background-color: var(--color-neutral-0);
		border-radius: var(--radius-sm);
		border: 1px solid var(--color-neutral-100);
		overflow: hidden;
	}

	.content-section-header {
		display: flex;
		align-items: center;
		padding: var(--padding-md);
		background-color: var(--color-neutral-100);
		border-bottom: 1px solid var(--color-neutral-200);
	}

	.section-badge {
		margin-right: var(--gap-md);
	}

	h3 {
		margin: 0;
		font-size: var(--text-lg);
		font-weight: var(--font-semibold);
	}

	.content-body {
		padding: var(--padding-lg);
	}

	.content-body :global(h2) {
		font-size: var(--text-xl);
		font-weight: var(--font-medium);
		color: var(--color-neutral-900);
		margin-top: 0;
	}

	.content-body :global(p) {
		font-size: var(--text-md);
		font-weight: var(--font-medium);
		color: var(--color-neutral-800);
	}

	.content-body :global(table) {
		border-collapse: collapse;
		margin: 1em 0;
		overflow: hidden;
		width: 100%;
	}

	.content-body :global(th) {
		background-color: var(--color-neutral-100);
		font-weight: var(--font-semibold);
		text-align: left;
	}

	.content-body :global(td) {
		border: 1px solid var(--color-neutral-300);
		padding: 0.5em;
		position: relative;
	}

	.content-body :global(th) {
		border: 1px solid var(--color-neutral-300);
		padding: 0.5em;
		position: relative;
	}

	.content-body :global(img) {
		max-width: 100%;
		height: auto;
		border-radius: var(--radius-xs);
	}

	.content-body :global(iframe) {
		max-width: 100%;
		border: none;
		aspect-ratio: 16 / 9;
	}

	/* Grammar styles */
	.explanation {
		line-height: 1.6;
	}

	.table-caption {
		font-size: var(--text-sm);
		color: var(--color-neutral-600);
		text-align: center;
		margin-top: var(--gap-sm);
		font-style: italic;
	}

	.terms-table-container {
		overflow-x: auto;
		margin-bottom: var(--gap-md);
	}

	.terms-table {
		width: 100%;
		border-collapse: collapse;
		font-size: var(--text-sm);

		th,
		td {
			padding: var(--padding-xs) var(--padding-sm);
			border: 1px solid var(--color-neutral-200);
		}

		th {
			text-align: left;
			background-color: var(--color-neutral-100);
			font-weight: var(--font-semibold);
		}

		tr:nth-child(even) {
			background-color: var(--color-neutral-50);
		}

		.serial-number {
			text-align: center;
			font-weight: var(--font-medium);
			width: 40px;
		}
	}

	.grammar-table {
		margin-bottom: var(--gap-xl);
		overflow-x: auto;
	}

	.translation {
		margin-top: var(--gap-xs);
		font-style: italic;
		color: var(--color-neutral-600);
	}

	.exercise {
		margin-bottom: var(--gap-lg);
	}

	.question {
		font-weight: var(--font-medium);
	}

	.options {
		display: flex;
		flex-direction: column;
		gap: var(--gap-sm);
		margin-top: var(--gap-sm);
	}

	.option {
		background-color: var(--color-neutral-0);
		border: 1px solid var(--color-neutral-300);
		border-radius: var(--radius-xs);
		padding: var(--padding-xs) var(--padding-sm);
		cursor: pointer;
		display: flex;
		align-items: center;
		gap: var(--gap-xs);
	}

	.option:hover {
		background-color: var(--color-neutral-100);
	}

	/* Vocabulary styles */
	.vocabulary-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
		gap: var(--gap-md);
	}

	.vocab-card {
		background-color: var(--color-neutral-0);
		border-radius: var(--radius-sm);
		padding: var(--padding-md);
		border: 1px solid var(--color-neutral-200);
	}

	.vocab-term {
		font-size: var(--text-lg);
		font-weight: var(--font-bold);
		margin-bottom: var(--gap-xs);
	}

	.vocab-pronunciation {
		color: var(--color-neutral-600);
		font-style: italic;
		margin-bottom: var(--gap-sm);
	}

	.vocab-definition {
		margin-bottom: var(--gap-sm);
	}

	.vocab-example {
		font-style: italic;
		color: var(--color-neutral-600);
	}

	/* Reading styles */
	.reading-text {
		line-height: 1.8;
		font-size: var(--text-lg);
		margin-bottom: var(--gap-lg);
	}

	.translations {
		margin-bottom: var(--gap-md);
	}

	.original-text {
		p {
			font-size: var(--text-md);
			margin: 0;
			color: var(--color-neutral-700);
		}
	}

	.reading-translation {
		background-color: var(--color-neutral-0);
		padding: var(--padding-md);
		border-radius: var(--radius-sm);
		margin-bottom: var(--gap-lg);
	}

	.reading-questions {
		margin-top: var(--gap-xl);
	}

	.question-item {
		margin-bottom: var(--gap-lg);
		padding: var(--padding-md);
		background-color: var(--color-neutral-0);
		border-radius: var(--radius-sm);
	}

	.reading-preview {
		background-color: var(--color-neutral-0);
		color: var(--color-neutral-800);
		border-radius: var(--radius-md);
		border: 1px solid var(--color-neutral-100);

		h2 {
			font-size: var(--text-xl);
		}

		p {
			font-size: var(--text-md);
			margin: 0;
		}
	}

	/* Shared styles */
	.empty-state {
		padding: var(--padding-lg);
		text-align: center;
		background-color: var(--color-neutral-50);
		border-radius: var(--radius-sm);
		color: var(--color-neutral-600);
	}

	.empty-content {
		color: var(--color-neutral-600);
		text-align: center;
		padding: var(--padding-md);
	}

	.review-container {
		background-color: var(--color-neutral-50);
		border-radius: var(--radius-sm);
		padding: var(--padding-lg);
		animation: fadeIn 0.3s ease;
	}

	.review-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: var(--gap-lg);
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}
	.reading-preview {
		.preview-content {
			padding: var(--padding-md);
		}

		.original-text p {
			margin-bottom: var(--gap-md);
			line-height: 1.6;
		}
	}
</style>
