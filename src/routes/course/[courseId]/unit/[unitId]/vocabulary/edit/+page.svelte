<script lang="ts">
	import NavBarSecondary from '$layouts/NavBarSecondary.svelte';
	import Button from '$components/common/Button.svelte';
	import { Plus, Trash } from 'lucide-svelte';
	import type { PageData } from './$types';

	let { data } = $props<{ data: PageData }>();
	let { terms, courseId, unitId } = data;

	let vocabularyItems = $state(
		terms.map((term, index) => ({
			id: term.id,
			front_content: term.front_content,
			back_content: term.back_content,
			hint: term.hint || '',
			difficulty_level: term.difficulty_level || 1,
			serial_number: term.serial_number || index + 1
		}))
	);

	function handleAddTerm() {
		const newSerialNumber = vocabularyItems.length + 1;

		vocabularyItems = [
			...vocabularyItems,
			{
				front_content: '',
				back_content: '',
				hint: '',
				difficulty_level: 1,
				serial_number: newSerialNumber
			}
		];
	}

	async function handleRemoveTerm(id: string) {
		const confirmDelete = confirm('Are you sure you want to delete this term?');
		if (!confirmDelete) {
			return;
		}
		try {
			const formData = new FormData();
			formData.append('id', id);
			const response = await fetch('?/deleteTerm', {
				method: 'POST',
				body: formData
			});
			if (response.ok) {
				vocabularyItems = vocabularyItems.filter((item) => item.id !== id);
				vocabularyItems = vocabularyItems.map((item, index) => ({
					...item,
					serial_number: index + 1
				}));
				alert('Term deleted successfully.');
			} else {
				const errorData = await response.json();
				alert('Failed to delete term: ' + errorData.message);
			}
		} catch (error) {
			alert('Something went wrong: ' + error.message);
		}
	}

	async function handleSave() {
		try {
			const formData = new FormData();
			const formattedTerms = vocabularyItems.map((item) => ({
				id: item.id,
				front_content: item.front_content,
				back_content: item.back_content,
				hint: item.hint,
				difficulty_level: item.difficulty_level,
				serial_number: item.serial_number
			}));

			formData.append('terms', JSON.stringify(formattedTerms));

			const response = await fetch('?/saveVocabularySection', {
				method: 'POST',
				body: formData
			});

			if (response.ok) {
				alert('Vocabulary section saved successfully!');
				// await goto(`/course/${courseId}/unit/${unitId}/edit`);
			} else {
				const errorData = await response.json();
				alert('Failed to save vocabulary section: ' + errorData.message);
			}
		} catch (error) {
			alert('Something went wrong: ' + error.message);
		}
	}
</script>

<NavBarSecondary />

<div class="vocabulary-editor-container">
	<div class="editor-header">
		<h1>Vocabulary Section Editor</h1>
	</div>

	<div class="editor-content">
		<div class="section vocabulary-terms">
			<div class="section-header">
				<h2>Vocabulary Terms</h2>
				<div class="table-actions">
					<Button onclick={handleAddTerm} variant="secondary" size="small">
						<Plus size={16} />
						Add Term
					</Button>
					<Button onclick={handleSave} variant="primary" size="small">Save Vocabulary</Button>
				</div>
			</div>

			<div class="terms-table-container">
				<table class="terms-table">
					<thead>
						<tr>
							<th>#</th>
							<th>Front Content</th>
							<th>Back Content</th>
							<th>Hint (Optional)</th>
							<th>Actions</th>
						</tr>
					</thead>
					<tbody>
						{#each vocabularyItems as item}
							<tr>
								<td class="serial-number">{item.serial_number}</td>
								<td>
									<input
										type="text"
										class="table-input"
										bind:value={item.front_content}
										placeholder="Enter front content"
									/>
								</td>
								<td>
									<input
										type="text"
										class="table-input"
										bind:value={item.back_content}
										placeholder="Enter back content"
									/>
								</td>
								<td>
									<input
										type="text"
										class="table-input"
										bind:value={item.hint}
										placeholder="Enter hint (optional)"
									/>
								</td>
								<td>
									<button
										class="action-button remove"
										onclick={() => handleRemoveTerm(item.id)}
										title="Remove"
									>
										<Trash size={16} />
									</button>
								</td>
							</tr>
						{/each}

						{#if vocabularyItems.length === 0}
							<tr>
								<td colspan="6" class="empty-message">
									No vocabulary terms yet. Add your first term to get started.
								</td>
							</tr>
						{/if}
					</tbody>
				</table>
			</div>

			{#if vocabularyItems.length > 0}
				<div class="table-actions">
					<Button onclick={handleAddTerm} variant="secondary" size="small">
						<Plus size={16} />
						Add Term
					</Button>
					<Button onclick={handleSave} variant="primary" size="small">Save Vocabulary</Button>
				</div>
			{/if}
		</div>
	</div>
</div>

<style lang="scss">
	.vocabulary-editor-container {
		max-width: 1100px;
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
		margin-bottom: var(--gap-lg);

		h1 {
			font-size: var(--text-3xl);
			font-weight: var(--font-semibold);
			color: var(--color-primary-800);
			margin: 0;
		}
	}

	.editor-content {
		display: flex;
		flex-direction: column;
		gap: var(--gap-xl);
	}

	.section {
		background-color: var(--color-neutral-0);
		border-radius: var(--radius-sm);
		border: 1px solid var(--color-neutral-100);
		padding: var(--padding-lg);
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

	.table-input {
		width: 87%;
		border: none;
		font-size: var(--text-sm);
		background-color: transparent;
	}

	.table-input:focus {
		outline: none;
		border-color: var(--color-primary-300);
	}

	.action-button {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 28px;
		height: 28px;
		border-radius: 4px;
		border: none;
		background: none;
		cursor: pointer;

		&.remove {
			color: #e53935;

			&:hover {
				background-color: rgba(229, 57, 53, 0.1);
			}
		}
	}

	.table-actions {
		display: flex;
		justify-content: flex-end;
		gap: var(--gap-md);
	}

	.empty-message {
		text-align: center;
		padding: var(--padding-md);
		color: var(--color-neutral-600);
	}

	.actions-bar {
		display: flex;
		justify-content: flex-end;
		padding: var(--padding-md) 0;
	}
</style>
