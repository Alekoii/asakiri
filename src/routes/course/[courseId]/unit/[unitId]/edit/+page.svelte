<script lang="ts">
	import NavBarSecondary from '$layouts/NavBarSecondary.svelte';
	import InputBox from '$components/common/InputBox.svelte';
	import Button from '$components/common/Button.svelte';
	import { Plus, Edit } from 'lucide-svelte';
	import type { PageData } from './$types';
	import { goto } from '$app/navigation';

	let { data } = $props<{ data: PageData }>();
	let { unit, sectionsCount, vocabularyCount, readingCount } = data;

	let hasVocabularySection = $state(vocabularyCount);
	let hasGrammarSection = $state(sectionsCount);
	let hasReadingSection = $state(readingCount);

	function navigateToSection(sectionType: string) {
		if (sectionType === 'grammar') {
			goto(`/course/${unit.course_id}/unit/${unit.id}/grammar/edit`);
		} else if (sectionType === 'reading') {
			goto(`/course/${unit.course_id}/unit/${unit.id}/reading/edit`);
		} else {
			goto(`/course/${unit.course_id}/unit/${unit.id}/vocabulary/edit`);
		}
	}
</script>

<NavBarSecondary />
<svelte:head>
	<title>{unit.title || 'Edit Unit'}</title>
</svelte:head>
<div class="unit-editor-container">
	<form method="POST" action="?/saveUnit">
		<div class="editor-header">
			<h1>Edit Unit</h1>
			<Button type="submit" variant="primary" size="medium">Save Unit</Button>
		</div>
		<input type="hidden" name="course_id" value={unit.course_id} />
		<div class="editor-content">
			<div class="section unit-details">
				<h2>Unit Details</h2>

				<div class="form-group">
					<InputBox
						type="text"
						label="Unit Title"
						name="title"
						value={unit.title}
						required={true}
					/>
				</div>

				<div class="form-group">
					<label class="label" for="description">Unit Description</label>
					<textarea
						class="textarea"
						id="description"
						value={unit.description}
						name="description"
						rows="4"
					></textarea>
				</div>
			</div>

			<div class="section unit-sections">
				<h2>Unit Content</h2>

				<div class="sections-list">
					<div class="section-item">
						<div class="section-info">
							<div class="section-details">
								<h3>Vocabulary Section</h3>
								<p>Create flashcards for key terms and phrases.</p>
							</div>
						</div>
						<div class="section-actions">
							<Button
								type="button"
								onclick={() => navigateToSection('vocabulary')}
								variant={hasVocabularySection ? 'secondary' : 'primary'}
								size="small"
							>
								{#if hasVocabularySection}
									<Edit size={16} />
									Edit Section
								{:else}
									<Plus size={16} />
									Create Section
								{/if}
							</Button>
						</div>
					</div>

					<div class="section-item">
						<div class="section-info">
							<div class="section-details">
								<h3>Grammar Section</h3>
								<p>Explain grammar rules and provide examples.</p>
							</div>
						</div>
						<div class="section-actions">
							<Button
								type="button"
								onclick={() => navigateToSection('grammar')}
								variant={hasGrammarSection ? 'secondary' : 'primary'}
								size="small"
							>
								{#if hasGrammarSection}
									<Edit size={16} />
									Edit Section
								{:else}
									<Plus size={16} />
									Create Section
								{/if}
							</Button>
						</div>
					</div>

					<div class="section-item">
						<div class="section-info">
							<div class="section-details">
								<h3>Reading Section</h3>
								<p>Add reading passages with comprehension questions.</p>
							</div>
						</div>
						<div class="section-actions">
							<Button
								type="button"
								onclick={() => navigateToSection('reading')}
								variant={hasReadingSection ? 'secondary' : 'primary'}
								size="small"
							>
								{#if hasReadingSection}
									<Edit size={16} />
									Edit Section
								{:else}
									<Plus size={16} />
									Create Section
								{/if}
							</Button>
						</div>
					</div>
				</div>
			</div>
		</div>
	</form>
</div>

<style lang="scss">
  .unit-editor-container {
    max-width: 900px;
    margin: 0 auto;
    padding: var(--padding-lg);
  }

  .editor-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--gap-lg);

    h1 {
      font-size: var(--text-3xl);
      font-weight: var(--font-semibold);
      margin: 0;
      color: var(--color-neutral-800);
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

  .textarea {
    width: 96%;
    padding: var(--padding-sm);
    border: 1px solid var(--color-neutral-300);
    border-radius: var(--radius-sm);
    font-family: var(--font-primary), sans-serif;
    font-size: var(--text-base);
    resize: vertical;
  }

  .textarea:focus {
    border-color: var(--color-primary-300);
    outline: none;
  }

  .sections-list {
    display: flex;
    flex-direction: column;
    gap: var(--gap-md);
  }

  .section-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--padding-md);
    border: 1px solid var(--color-neutral-200);
    border-radius: var(--radius-sm);
    background-color: var(--color-neutral-50);
  }

  .section-info {
    display: flex;
    gap: var(--gap-md);
    align-items: center;
    flex: 1;
  }

  .section-details {
    h3 {
      font-size: var(--text-lg);
      font-weight: var(--font-semibold);
      margin: 0 0 var(--gap-xs);
    }

    p {
      color: var(--color-neutral-600);
      margin: 0;
      font-size: var(--text-sm);
    }
  }
</style>
