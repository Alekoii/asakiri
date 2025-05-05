<script lang="ts">
	import NavBarSecondary from '$layouts/NavBarSecondary.svelte';
	import Button from '$components/common/Button.svelte';
	import { ArrowLeft, Plus, Trash } from 'lucide-svelte';
	import type { PageData } from './$types';
	import { goto } from '$app/navigation';
	import { v4 as uuidv4 } from 'uuid';
	let activeTab = $state('original');
	let { data } = $props<{ data: PageData }>();
	let { readings, courseId, unitId } = data;

	let readingsData = readings.length > 0 ? readings : [];
	let sentencesList = $state(
		readingsData.length > 0
			? readingsData.map((r) => ({
					id: r.id,
					text: r.text,
					translation: r.translation,
					serial_number: r.serial_number,
					created_at: r.created_at,
					updated_at: r.updated_at
				}))
			: [
					{
						id: uuidv4(), // Add unique ID for new sentences
						text: '',
						translation: '',
						serial_number: 1,
						created_at: new Date().toISOString(),
						updated_at: new Date().toISOString()
					}
				]
	);
	function switchTab(tab: string) {
		activeTab = tab;
	}
	function handleAddSentence() {
		sentencesList = [
			...sentencesList,
			{
				id: uuidv4(), // Add unique ID for new sentences
				text: '',
				translation: '',
				serial_number: sentencesList.length + 1,
				created_at: new Date().toISOString(),
				updated_at: new Date().toISOString()
			}
		];
	}

	async function handleRemoveSentence(id: string) {
		const confirmDelete = confirm('Are you sure you want to delete this sentence?');
		if (!confirmDelete) {
			return;
		}
		try {
			const formData = new FormData();
			formData.append('id', id);
			const response = await fetch('?/deleteReading', {
				method: 'POST',
				body: formData
			});
			if (response.ok) {
				sentencesList = sentencesList.filter((sentence) => sentence.id !== id);
				sentencesList = sentencesList.map((sentence, index) => ({
					...sentence,
					serial_number: index + 1
				}));
				alert('Sentence deleted successfully.');
			} else {
				const errorData = await response.json();
				alert('Failed to delete sentence: ' + errorData.message);
			}
		} catch (error) {
			alert('Something went wrong: ' + error.message);
		}
	}

	function handleMoveSentenceUp(index: number) {
		if (index === 0) return;

		const updatedSentences = [...sentencesList];
		[updatedSentences[index - 1], updatedSentences[index]] = [
			updatedSentences[index],
			updatedSentences[index - 1]
		];

		sentencesList = updatedSentences.map((sentence, idx) => ({
			...sentence,
			serial_number: idx + 1,
			updated_at: new Date().toISOString()
		}));
	}

	function handleMoveSentenceDown(index: number) {
		if (index === sentencesList.length - 1) return;

		const updatedSentences = [...sentencesList];
		[updatedSentences[index], updatedSentences[index + 1]] = [
			updatedSentences[index + 1],
			updatedSentences[index]
		];

		sentencesList = updatedSentences.map((sentence, idx) => ({
			...sentence,
			serial_number: idx + 1,
			updated_at: new Date().toISOString()
		}));
	}

	async function handleSave() {
		try {
			sentencesList = sentencesList.map((sentence) => ({
				...sentence,
				updated_at: new Date().toISOString()
			}));

			const formData = new FormData();
			formData.append('sentences', JSON.stringify(sentencesList));

			const response = await fetch('?/saveReadingSection', {
				method: 'POST',
				body: formData
			});
			if (!response.ok) {
				throw new Error('Failed to save reading section');
			}
			alert('Reading section saved successfully!');
		} catch (error) {
			console.error('Error in handleSave:', error);
			alert('An error occurred while saving the reading section.');
		}
	}
</script>

<NavBarSecondary />

<div class="reading-editor-container">
	<div class="editor-header">
		<h1>Reading Editor</h1>
		<div class="actions-bar">
			<Button type="button" onclick={handleAddSentence} variant="secondary" size="small">
				<Plus size={16} />
				Add Sentence
			</Button>
			<Button type="button" onclick={handleSave} variant="primary" size="small">Save</Button>
		</div>
	</div>

	<div class="editor-content">
		<div class="section reading-content">
			<div class="sentences-list">
				{#each sentencesList as sentence, index (sentence.id)}
					<div class="sentence-item">
						<div class="sentence-controls">
							<div class="sentence-number">{index + 1}</div>
							<div class="sentence-actions">
								<button
									type="button"
									class="action-button"
									onclick={() => handleMoveSentenceUp(index)}
									disabled={index === 0}
									title="Move up"
								>
									↑
								</button>
								<button
									type="button"
									class="action-button"
									onclick={() => handleMoveSentenceDown(index)}
									disabled={index === sentencesList.length - 1}
									title="Move down"
								>
									↓
								</button>
								<button
									type="button"
									class="action-button remove"
									onclick={() => handleRemoveSentence(sentence.id)}
									title="Remove"
								>
									<Trash size={14} />
								</button>
							</div>
						</div>

						<div class="sentence-content">
							<div class="form-group">
								<label class="label">Text</label>
								<textarea
									class="textarea"
									bind:value={sentence.text}
									rows="2"
									placeholder="Enter the original text..."
									required
								></textarea>
							</div>

							<div class="form-group">
								<label class="label">Translation</label>
								<textarea
									class="textarea"
									bind:value={sentence.translation}
									rows="2"
									placeholder="Enter the translation..."
									required
								></textarea>
							</div>
						</div>
					</div>
				{/each}

				{#if sentencesList.length === 0}
					<div class="empty-state">
						<p>No sentences yet. Add sentences to create your reading passage.</p>
					</div>
				{/if}
				<div class="actions-bar">
					<Button type="button" onclick={handleAddSentence} variant="secondary" size="small">
						<Plus size={16} />
						Add Sentence
					</Button>
					<Button type="button" onclick={handleSave} variant="primary" size="small">Save</Button>
				</div>
			</div>
		</div>

		<div class="section reading-preview">
			<h2>Reading Preview</h2>

			{#if sentencesList.length > 0}
				<div class="preview-tabs">
					<button
						type="button"
						class="preview-tab {activeTab === 'original' ? 'active' : ''}"
						onclick={() => switchTab('original')}
					>
						Original Text
					</button>
					<button
						type="button"
						class="preview-tab {activeTab === 'translation' ? 'active' : ''}"
						onclick={() => switchTab('translation')}
					>
						With Translation
					</button>
				</div>

				<div class="preview-content">
					{#if activeTab === 'original'}
						<div class="original-text">
							{#each sentencesList as sentence (sentence.id)}
								<p>{sentence.text}</p>
							{/each}
						</div>
					{:else if activeTab === 'translation'}
						<div class="with-translation">
							{#each sentencesList as sentence (sentence.id)}
								<p>
									{sentence.text}<br />
									<i>{sentence.translation}</i>
								</p>
							{/each}
						</div>
					{/if}
				</div>
			{:else}
				<div class="empty-preview">
					<p>Add sentences to see a preview</p>
				</div>
			{/if}
		</div>
	</div>
</div>
`

<style lang="scss">
	.reading-editor-container {
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

	.editor-header {
		margin-bottom: var(--gap-xxs);
		display: flex;
		justify-content: space-between;
		align-items: center;

		h1 {
			font-size: var(--text-3xl);
			font-weight: var(--font-bold);
			margin: 0;
			color: var(--color-neutral-700);
		}
	}

	.editor-content {
		display: flex;
		flex-direction: column;
		gap: var(--gap-xl);
	}

	.section-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: var(--gap-lg);

		h2 {
			margin: 0;
		}
	}

	h2 {
		font-size: var(--text-xl);
		font-weight: var(--font-semibold);
		margin: 0 0 var(--gap-lg);
	}

	.form-group {
		margin-bottom: var(--gap-xs);

		&:last-child {
			margin-bottom: 0;
		}
	}

	.label {
		display: block;
		margin-bottom: var(--gap-xs);
		font-weight: var(--font-medium);
		color: var(--color-neutral-900);
	}

	.textarea {
		width: 95%;
		padding: var(--padding-sm);
		border: 1px solid var(--color-neutral-200);
		border-radius: var(--radius-sm);
		font-family: var(--font-primary), sans-serif;
		font-size: var(--text-base);
		resize: vertical;
		background-color: var(--color-neutral-0);
		color: var(--color-neutral-700);
	}

	.textarea:focus {
		border: 1px solid var(--color-primary-300);
		outline: none;
	}

	.sentences-list {
		display: flex;
		flex-direction: column;
		gap: var(--gap-md);
	}

	.sentence-item {
		display: flex;
		gap: var(--gap-md);
		padding: var(--padding-md);
		background-color: var(--color-neutral-0);
		border: 1px solid var(--color-neutral-100);
		border-radius: var(--radius-sm);
	}

	.sentence-controls {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--gap-sm);
	}

	.sentence-number {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 30px;
		height: 30px;
		border-radius: 50%;
		background-color: var(--color-neutral-200);
		color: var(--color-neutral-700);
		font-weight: var(--font-medium);
	}

	.sentence-actions {
		display: flex;
		flex-direction: column;
		gap: 2px;
	}

	.action-button {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 24px;
		height: 24px;
		border-radius: 4px;
		border: 1px solid var(--color-neutral-300);
		background-color: var(--color-neutral-0);
		color: var(--color-primary-400);
		cursor: pointer;

		&:hover:not(:disabled) {
			background-color: var(--color-neutral-100);
		}

		&:disabled {
			opacity: 0.5;
			cursor: not-allowed;
		}

		&.remove {
			color: #e53935;

			&:hover {
				background-color: rgba(229, 57, 53, 0.1);
			}
		}
	}

	.sentence-content {
		flex: 1;
	}

	.empty-state {
		padding: var(--padding-lg);
		text-align: center;
		background-color: var(--color-neutral-50);
		border-radius: var(--radius-sm);
		color: var(--color-neutral-600);
	}

	.reading-preview {
		padding: var(--padding-lg);
		border: 1px solid var(--color-neutral-100);
		border-radius: var(--radius-sm);
		background-color: var(--color-neutral-0);

		h2 {
			color: var(--color-neutral-700);
			margin: 0;
		}

		.preview-tabs {
			display: flex;
			border-bottom: 1px solid var(--color-neutral-200);
			margin-bottom: var(--gap-md);
			gap: var(--gap-md);
		}

		.preview-tab {
			padding: var(--padding-sm) 0;
			border: none;
			background: none;
			cursor: pointer;
			color: var(--color-neutral-500);
			font-size: var(--text-regular);

			&.active {
				color: var(--color-primary-400);
				border-bottom: 2px solid var(--color-primary-400);
				font-weight: var(--font-medium);
			}
		}

		.preview-content {
			padding: none;
		}

		.original-text p {
			margin-bottom: var(--gap-md);
			line-height: 1.6;
			font-size: var(--text-regular);
			color: var(--color-neutral-600);
		}

		.with-translation p {
			margin-bottom: var(--gap-md);
			line-height: 1.6;
			font-size: var(--text-regular);
			color: var(--color-neutral-600);
		}

		.empty-preview {
			padding: var(--padding-lg);
			text-align: center;
			color: var(--color-neutral-600);
		}
	}

	.actions-bar {
		display: flex;
		justify-content: flex-end;
		padding: var(--padding-md) 0;
		gap: var(--gap-md);
	}
</style>
