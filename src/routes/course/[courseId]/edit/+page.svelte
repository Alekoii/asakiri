<script lang="ts">
	import NavBarSecondary from '$layouts/NavBarSecondary.svelte';
	import InputBox from '$components/common/InputBox.svelte';
	import Button from '$components/common/Button.svelte';
	import { Trash, Plus, Edit, Camera, BookOpen } from 'lucide-svelte';
	import type { PageData } from './$types';
	import TiptapMiniEditor from '$components/editor/TipTapMini.svelte';
	import LanguageSearchPopup from '$components/common/LanguageSearchPopup.svelte';

	let { data } = $props<{ data: PageData }>();
	let { initialLanguages, languagesCount } = data;
	let course = $state(data.course);
	let units = $state([...course.chapters]);
	let tiptapMainEditorRef: any = null;
	let isSaving = $state(false);
	let thumbnailUrl = $state(course?.thumbnail || '');
	let thumbnailPreview = $state(thumbnailUrl);
	let thumbnailFile = $state<File | null>(null);
	let isUploading = $state(false);
	// Language selection states
	let isLanguageTaughtPopupOpen = $state(false);
	let isCourseLangPopupOpen = $state(false);
	let selectedLanguageTaught = $state(
		initialLanguages.find((lang) => lang.id === course.language_taught) || null
	);
	let selectedCourseLanguage = $state(
		initialLanguages.find((lang) => lang.id === course.course_language) || null
	);
	async function uploadThumbnail() {
		if (!thumbnailFile) return thumbnailUrl;

		isUploading = true;

		try {
			const formData = new FormData();
			formData.append('thumbnail', thumbnailFile);
			formData.append('course_id', course.id);

			const response = await fetch('?/uploadThumbnail', {
				method: 'POST',
				body: formData
			});

			if (!response.ok) throw new Error('Failed to upload thumbnail');

			const result = await response.json();
			return result.thumbnailUrl;
		} catch (error) {
			console.error('Error uploading thumbnail:', error);
			return thumbnailUrl;
		} finally {
			isUploading = false;
		}
	}
	async function handleSave() {
		try {
			const finalThumbnailUrl = thumbnailFile ? await uploadThumbnail() : thumbnailUrl;
			isSaving = true;
			const formData = new FormData();
			formData.append('course_id', course.id);
			formData.append('title', course.title);
			formData.append('is_federated', course.is_federated);
			formData.append('short_description', course.short_description || '');
			formData.append('language_taught', course.language_taught?.toString() || '');
			formData.append('course_language', course.course_language?.toString() || '');
			formData.append('thumbnail', finalThumbnailUrl);
			formData.append('description', tiptapMainEditorRef?.getEditorContent() ?? '');
			formData.append('units', JSON.stringify(units));
			const response = await fetch('?/saveCourse', {
				method: 'POST',
				body: formData
			});
			if (response.ok) {
				alert('Course saved successfully.');
			} else {
				alert('Failed to save course.');
			}
		} catch (error) {
			alert('An error occurred while saving the course: ' + error.message);
		} finally {
			isSaving = false;
		}
	}

	async function deleteUnit(unitId: string) {
		if (confirm('Are you sure you want to delete this unit?')) {
			const formData = new FormData();
			formData.append('chapter_id', unitId);
			const response = await fetch('?/deleteChapter', {
				method: 'POST',
				body: formData
			});
			if (response.ok) {
				location.reload();
			} else {
				alert('Failed to delete the unit.');
			}
		}
	}

	async function handleAddUnit() {
		const response = await fetch('?/addNewUnit', {
			method: 'POST',
			body: JSON.stringify({ course_id: course.id })
		});
		if (response.ok) {
			location.reload();
		} else {
			alert('Failed to add new unit.');
		}
	}

	function moveUnitUp(index: number) {
		if (index === 0) return;
		[units[index - 1], units[index]] = [units[index], units[index - 1]];
		units = units.map((unit, idx) => ({ ...unit, serial_number: idx + 1 }));
	}

	function moveUnitDown(index: number) {
		if (index === units.length - 1) return;
		[units[index], units[index + 1]] = [units[index + 1], units[index]];
		units = units.map((unit, idx) => ({ ...unit, serial_number: idx + 1 }));
	}

	async function togglePublish() {
		const newState = !course.is_published;
		const formData = new FormData();
		formData.append('is_published', newState.toString());
		try {
			const response = await fetch('?/togglePublish', {
				method: 'POST',
				body: formData
			});
			if (response.ok) {
				course.is_published = newState;
			} else {
				alert('Failed to update publish status.');
			}
		} catch (error) {
			alert('An error occurred while updating publish status: ' + error.message);
		}
	}
	function handleThumbnailChange(event: Event) {
		const input = event.target as HTMLInputElement;
		const file = input.files?.[0];

		if (file) {
			thumbnailFile = file;
			thumbnailPreview = URL.createObjectURL(file);
		}
	}
	function handleLanguageTaughtSelect(language) {
		selectedLanguageTaught = language;
		course.language_taught = language.id;
	}

	function handleCourseLanguageSelect(language) {
		selectedCourseLanguage = language;
		course.course_language = language.id;
	}
</script>

<NavBarSecondary href="/teacher/courses"/>
<svelte:head>
	<title>{course.title || 'Course Editor'}</title>
</svelte:head>
<div class="course-editor-container">
	<div class="editor-header">
		<h1>Edit Course</h1>
		<div class="form-row" style="align-items: center;">
			<div class="status-badge {course.is_published ? 'published' : 'draft'}">
				{course.is_published ? 'Published' : 'Draft'}
			</div>
			<Button onclick={togglePublish} type="button" variant="secondary" size="small">
				{course.is_published ? 'Unpublish' : 'Publish'}
			</Button>
			<Button type="button" onclick={handleSave} variant="primary" size="small" disabled={isSaving || isUploading}>{isSaving || isUploading ? 'Saving...' : 'Save Course'}</Button>
		</div>
	</div>
	<div class="editor-content">
		<div class="section course-details">
			<h2>Course Details</h2>
			<div class="thumbnail-container">
				<div class="thumbnail">
					{#if course.thumbnail}
						<img src={course.thumbnail} alt={course.title} />
					{:else if thumbnailPreview}
						<img src={thumbnailPreview} alt={course.title || 'Course'} />
					{:else }
						<div class="placeholder">
							<BookOpen size={64} />
						</div>
					{/if}
				</div>

				<div class="thumbnail-upload">
					<label for="thumbnail-input" class="upload-button">
						<Camera size={16} />
						<span>Change Thumbnail</span>
					</label>
					<input
						type="file"
						id="thumbnail-input"
						accept="image/*"
						oninput={handleThumbnailChange}
						hidden
					/>
				</div>
			</div>
			<div class="form-group">
				<InputBox
					type="text"
					label="Course Title"
					name="title"
					bind:value={course.title}
					required={true}
				/>
			</div>

			<div class="form-group">
				<label class="label" for="description">Course Description</label>
				<TiptapMiniEditor
					bind:this={tiptapMainEditorRef}
					content={course.description}
					height="200px"
				/>
			</div>

			<div class="form-group">
				<InputBox
					type="text"
					label="Short Description"
					name="short_description"
					bind:value={course.short_description}
					hint="A brief summary shown in course listings (max 150 characters)"
				/>
			</div>

			<div class="form-row">
				<div class="form-group half">
					<label class="label" for="language_taught">Language Taught</label>
					<div class="language-select-wrapper">
						<button
							class="language-selector-button"
							onclick={() => (isLanguageTaughtPopupOpen = true)}
						>
							{#if selectedLanguageTaught}
								<div class="language-code">{selectedLanguageTaught.code.toUpperCase()}</div>
								<span>{selectedLanguageTaught.name_en}</span>
							{:else}
								<span>Select language</span>
							{/if}
						</button>
					</div>
					<LanguageSearchPopup
						bind:isOpen={isLanguageTaughtPopupOpen}
						bind:selectedLanguage={selectedLanguageTaught}
						title="Select Language Taught"
						onSelect={handleLanguageTaughtSelect}
						totalCount={languagesCount}
					/>
				</div>

				<div class="form-group half">
					<label class="label" for="course_language">Course Language</label>
					<div class="language-select-wrapper">
						<button class="language-selector-button" onclick={() => (isCourseLangPopupOpen = true)}>
							{#if selectedCourseLanguage}
								<div class="language-code">{selectedCourseLanguage.code.toUpperCase()}</div>
								<span>{selectedCourseLanguage.name_en}</span>
							{:else}
								<span>Select language</span>
							{/if}
						</button>
					</div>
					<LanguageSearchPopup
						bind:isOpen={isCourseLangPopupOpen}
						bind:selectedLanguage={selectedCourseLanguage}
						title="Select Course Language"
						onSelect={handleCourseLanguageSelect}
						totalCount={languagesCount}
					/>
				</div>
			</div>

			<div class="form-group">
				<label class="label" for="is_federated">
					Do you want to allow your courses to be shown on other websites?
				</label>
				<input
					type="checkbox"
					id="is_federated"
					bind:checked={course.is_federated}
				/>
			</div>
		</div>

		<div class="section course-structure">
			<div class="section-header">
				<h2>Course Structure</h2>
				<div class="action-buttons">
					<Button onclick={handleAddUnit} variant="secondary" size="small" type="button">
						<Plus size={16} />
						Add Unit
					</Button>
					<Button type="button" onclick={handleSave} variant="primary" size="small"
									disabled={isSaving || isUploading}>{isSaving || isUploading ? 'Saving...' : 'Save Course'}</Button>
				</div>
			</div>

			<div class="units-list">
				{#each units as unit, index (index)}
					<div class="unit-item">
						<div class="sentence-number">{index + 1}</div>
						<div class="sentence-actions">
							<button
								type="button"
								class="action-button"
								onclick={() => moveUnitUp(index)}
								disabled={index === 0}
								title="Move up"
							>
								↑
							</button>
							<button
								type="button"
								class="action-button"
								onclick={() => moveUnitDown(index)}
								disabled={index === units.length - 1}
								title="Move down"
							>
								↓
							</button>
						</div>
						<div class="unit-info">
							<h3>Unit {index + 1}: {unit.title}</h3>
							<p>{unit.description || 'No description'}</p>
						</div>
						<div class="unit-actions">
							<a href={`/course/${course.id}/unit/${unit.id}/edit`} class="action-button edit">
								<Edit size={16} />
								<span>Edit</span>
							</a>
							<button
								class="action-button delete"
								type="button"
								onclick={() => {
									deleteUnit(unit.id);
								}}
							>
								<Trash size={16} />
								<span>Delete</span>
							</button>
						</div>
					</div>
				{/each}
				<div class="actions-bar">
					<Button onclick={handleAddUnit} variant="secondary" size="small" type="button">
						<Plus size={16} />
						Add Unit
					</Button>
					<Button type="button" onclick={handleSave} variant="primary" size="small"
						disabled={isSaving || isUploading}>{isSaving || isUploading ? 'Saving...' : 'Save Course'}</Button>
				</div>

				{#if units.length === 0}
					<div class="empty-state">
						<p>No units yet. Add your first unit to start building your course.</p>
					</div>
				{/if}
			</div>
		</div>
	</div>
</div>

<style lang="scss">
	.course-editor-container {
		max-width: 900px;
		margin: 0 auto;
		padding: var(--padding-lg);
	}

	.back-nav {
		margin-bottom: var(--gap-lg);
	}

	.action-buttons {
		display: flex;
		gap: var(--gap-md);
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
		display: flex;
		align-items: center;
		justify-content: space-between;
		color: var(--color-neutral-800);

		h1 {
			font-size: var(--text-3xl);
			font-weight: var(--font-semibold);
			margin: 0;
		}
	}

	.status-badge {
		padding: 4px 8px;
		border-radius: 4px;
		font-size: var(--text-xs);
		font-weight: var(--font-medium);
		text-transform: uppercase;

		&.published {
			background-color: var(--color-primary-200);
			color: var(--color-primary-700);
		}

		&.draft {
			background-color: var(--color-neutral-200);
			color: var(--color-neutral-700);
		}

		button {
			margin-left: var(--gap-sm);
			padding: var(--padding-xs) var(--padding-sm);
			border: none;
			border-radius: var(--radius-sm);
			background-color: var(--color-primary-500);
			color: var(--color-neutral-0);
			font-size: var(--text-xs);
			cursor: pointer;

			&:hover {
				background-color: var(--color-primary-600);
			}
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

	.form-group {
		margin-bottom: var(--gap-lg);
	}

	.form-group.half {
		width: calc(50% - var(--gap-md));
	}

	.form-row {
		display: flex;
		gap: var(--gap-lg);
		margin-bottom: var(--gap-lg);
	}

	.label {
		display: block;
		margin-bottom: var(--gap-xs);
		font-weight: var(--font-medium);
		color: var(--color-neutral-900);
	}

	.textarea {
		width: 100%;
		padding: var(--padding-sm);
		border: 1px solid var(--color-neutral-300);
		border-radius: var(--radius-sm);
		font-family: var(--font-primary), sans-serif;
		font-size: var(--text-base);
		resize: vertical;
	}

	.textarea:focus {
		border-color: var(--color-primary-200);
		outline: none;
	}

	.language-select-wrapper {
		width: 100%;
	}

	.language-selector-button {
		width: 100%;
		padding: var(--padding-sm);
		border: 1px solid var(--color-neutral-300);
		border-radius: var(--radius-sm);
		font-family: var(--font-primary), sans-serif;
		font-size: var(--text-base);
		background-color: var(--color-neutral-0);
		cursor: pointer;
		display: flex;
		align-items: center;
		gap: var(--gap-sm);
		text-align: left;
	}

	.language-selector-button:hover {
		border-color: var(--color-primary-300);
	}

	.language-selector-button:focus {
		border-color: var(--color-primary-400);
		outline: none;
	}

	.language-code {
		background-color: var(--color-neutral-100);
		color: var(--color-neutral-700);
		padding: var(--padding-xs) var(--padding-sm);
		border-radius: var(--radius-sm);
		font-size: var(--text-sm);
		font-weight: var(--font-semibold);
		min-width: 2.5rem;
		text-align: center;
	}

	.units-list {
		display: flex;
		flex-direction: column;
		gap: var(--gap-md);
	}

	.unit-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: var(--padding-md);
		border: 1px solid var(--color-neutral-200);
		border-radius: var(--radius-sm);
		background-color: var(--color-neutral-50);
	}

	.unit-info {
		flex: 1;
		margin-right: var(--gap-md);

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

	.unit-actions {
		display: flex;
		gap: var(--gap-sm);
	}

	.action-button {
		display: flex;
		align-items: center;
		gap: var(--gap-xs);
		padding: var(--padding-xs) var(--padding-sm);
		border-radius: var(--radius-sm);
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
		cursor: pointer;
		border: none;
		background: none;
	}

	.action-button.edit {
		color: var(--color-primary-500);

		&:hover {
			background-color: var(--color-primary-50);
		}
	}

	.action-button.delete {
		color: #e53935;

		&:hover {
			background-color: rgba(229, 57, 53, 0.1);
		}
	}

	.action-button:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.empty-state {
		padding: var(--padding-lg);
		text-align: center;
		background-color: var(--color-neutral-50);
		border-radius: var(--radius-sm);
		color: var(--color-neutral-600);
	}

	.actions-bar {
		display: flex;
		justify-content: flex-end;
		gap: var(--gap-md);
		margin-top: var(--gap-lg);
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
		margin-right: var(--gap-xs);
	}

	.sentence-actions {
		display: flex;
		flex-direction: column;
		gap: 2px;
		margin-right: var(--gap-md);
	}
  .thumbnail {
    width: 360px;
    height: 240px;
    border-radius: var(--radius-md);
    overflow: hidden;

    @media (max-width: 768px) {
      width: 100%;
      height: 200px;
    }

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .placeholder {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: var(--color-neutral-100);
      color: var(--color-neutral-400);
    }
  }
  .upload-button {
    display: flex;
    align-items: center;
    gap: var(--gap-xs);
    padding: var(--padding-xs) var(--padding-sm);
    border-radius: var(--radius-sm);
    background-color: var(--color-neutral-100);
    color: var(--color-neutral-700);
    cursor: pointer;
    transition: background-color 0.2s;

    &:hover {
      background-color: var(--color-neutral-200);
    }
  }
  .thumbnail-container {
		margin-top: 40px;
		margin-bottom: 40px;
    display: flex;
    align-items: center;
		gap: 10px;
    flex-direction: row;
    width: 100%;
    height: 180px;
  }
</style>
