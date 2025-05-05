<script lang="ts">
	import NavBarSecondary from '$layouts/NavBarSecondary.svelte';
	import InputBox from '$components/common/InputBox.svelte';
	import Button from '$components/common/Button.svelte';
	import TiptapEditor from '$components/editor/TiptapEditor.svelte';
	import { ArrowLeft, Plus, Trash } from 'lucide-svelte';
	import type { PageData } from './$types';
	import { goto } from '$app/navigation';

	let { data } = $props<{ data: PageData }>();
	let { sections, courseId } = data;

	let sectionData =
		sections.length > 0 ? sections[0] : { title: '', content_html: '', content_json: {} };
	let subsectionData = sections.length > 1 ? sections.slice(1) : [];

	let section = $state(sectionData);
	let subsections = $state(subsectionData.map((sub) => ({ ...sub, editorRef: null })));

	let tiptapMainEditorRef: any = null;

	function handleAddSubsection() {
		subsections = [
			...subsections,
			{
				title: '',
				explanation: '',
				content_html: '',
				content_json: {},
				editorRef: null
			}
		];
	}

	async function handleRemoveSubsection(id: string) {
		const confirmDelete = confirm('Are you sure you want to delete this subsection?');
		if (!confirmDelete) {
			return;
		}
		try {
			const formData = new FormData();
			formData.append('id', id);
			const response = await fetch('?/deleteGrammar', {
				method: 'POST',
				body: formData
			});
			if (response.ok) {
				subsections = subsections.filter((sub) => sub.id !== id);
				subsections = subsections.map((item, index) => ({
					...item,
					serial_number: index + 1
				}));
				alert('Subsection deleted successfully.');
			} else {
				const errorData = await response.json();
				alert('Failed to delete subsection: ' + errorData.message);
			}
		} catch (error) {
			alert('Something went wrong: ' + error.message);
		}
	}

	async function handleSave() {
		try {
			// Collect fresh content
			section.content_html = tiptapMainEditorRef?.getEditorContent() ?? '';
			section.content_json = tiptapMainEditorRef?.getEditorJSON() ?? {};

			subsections = subsections.map((sub) => {
				const editorRef = sub.editorRef;
				return {
					...sub,
					content_html: editorRef?.getEditorContent() ?? '',
					content_json: editorRef?.getEditorJSON() ?? {}
				};
			});

			const formData = new FormData();
			formData.append('section', JSON.stringify(section));
			formData.append('subsections', JSON.stringify(subsections));

			const response = await fetch('?/saveGrammarSection', {
				method: 'POST',
				body: formData
			});

			if (!response.ok) {
				throw new Error('Failed to save grammar section');
			}

			alert('Grammar section saved successfully!');
			// await goto(`/course/${courseId}/unit/${section.chapter_id}/edit`);
		} catch (error) {
			console.error(error);
			alert('An error occurred while saving the grammar section.');
		}
	}
</script>

<NavBarSecondary />

<div class="grammar-editor-container">
	<div class="editor-header">
		<h1>Grammar Editor</h1>
		<div class="section-actions">
			<Button onclick={handleAddSubsection} variant="secondary" size="small">
				<Plus size={16} />
				Add Section
			</Button>
			<Button onclick={handleSave} variant="primary" size="small">Save Grammar Section</Button>
		</div>
	</div>

	<div class="editor-content">
		<div class="section section-details">
			<div class="form-group">
				<InputBox
					type="text"
					label="Section Title"
					name="title"
					bind:value={section.title}
					required={true}
				/>
			</div>

			<div class="form-group">
				<label class="label">Grammar Explanation</label>
				<TiptapEditor
					bind:this={tiptapMainEditorRef}
					content={section.content_html}
					height="200px"
				/>
			</div>
		</div>

		<div class="section grammar-subsections">
			<div class="subsections-list">
				{#each subsections as subsection}
					<div class="subsection-item">
						<div class="subsection-header">
							<div class="form-group">
								<InputBox
									type="text"
									label="Section Title"
									name="title"
									bind:value={subsection.title}
									required={true}
								/>
							</div>
							<button class="remove-button" onclick={() => handleRemoveSubsection(subsection.id)}>
								<Trash size={16} />
								<span>Remove Section</span>
							</button>
						</div>

						<div class="subsection-content">
							<div class="form-group">
								<label class="label">Explanation</label>
								<TiptapEditor
									bind:this={subsection.editorRef}
									content={subsection.content_html}
									height="180px"
								/>
							</div>
						</div>
					</div>
				{/each}

				{#if subsections.length === 0}
					<div class="empty-state">
						<p>No grammar subsections yet. Add your first subsection to get started.</p>
					</div>
				{/if}
			</div>
		</div>

		<div class="section-actions">
			<Button onclick={handleAddSubsection} variant="secondary" size="small">
				<Plus size={16} />
				Add Section
			</Button>
			<Button onclick={handleSave} variant="primary" size="small">Save Grammar Section</Button>
		</div>
	</div>
</div>

<style lang="scss">
	.grammar-editor-container {
		max-width: 900px;
		margin: 0 auto;
		padding: var(--padding-lg);
	}

	.editor-header {
		display: flex;
		justify-content: space-between;

		h1 {
			font-size: var(--text-3xl);
			font-weight: var(--font-semibold);
			color: var(--color-neutral-800);
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

	.grammar-subsections {
		padding: 0;
		background-color: transparent;
		border: none;
	}

	.section-actions {
		display: flex;
		gap: var(--gap-md);
		justify-content: end;
		align-items: center;
		margin-bottom: var(--gap-lg);
	}

	h2 {
		font-size: var(--text-xl);
		font-weight: var(--font-semibold);
		margin: 0 0 var(--gap-lg);
	}

	.form-group {
		margin-bottom: var(--gap-lg);
	}

	.label {
		display: block;
		margin-bottom: var(--gap-xs);
		font-weight: var(--font-medium);
		color: var(--color-neutral-900);
	}

	.subsections-list {
		display: flex;
		flex-direction: column;
		gap: var(--gap-lg);
	}

	.subsection-item {
		border: 1px solid var(--color-neutral-200);
		border-radius: var(--radius-sm);
		background-color: var(--color-neutral-50);
		overflow: hidden;
	}

	.subsection-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-end;
		padding: var(--padding-md);
		background-color: var(--color-neutral-100);
		border-bottom: 1px solid var(--color-neutral-200);

		.form-group {
			margin-bottom: 0;
			flex: 1;
			margin-right: var(--gap-md);
		}
	}

	.remove-button {
		display: flex;
		align-items: center;
		gap: var(--gap-xs);
		padding: var(--padding-xs) var(--padding-sm);
		border-radius: var(--radius-sm);
		border: none;
		background-color: rgba(229, 57, 53, 0.1);
		color: #e53935;
		cursor: pointer;
		font-size: var(--text-sm);

		&:hover {
			background-color: rgba(229, 57, 53, 0.2);
		}
	}

	.subsection-content {
		padding: var(--padding-md);
		background-color: var(--color-neutral-0);
	}

	.empty-state {
		padding: var(--padding-lg);
		text-align: center;
		background-color: var(--color-neutral-50);
		border-radius: var(--radius-sm);
		color: var(--color-neutral-600);
	}
</style>
