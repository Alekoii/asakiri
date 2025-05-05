<script lang="ts">
	import NavBarSecondary from '$layouts/NavBarSecondary.svelte';
	import InputBox from '$components/common/InputBox.svelte';
	import Button from '$components/common/Button.svelte';
	import { ArrowLeft, Plus, Edit2, Trash } from 'lucide-svelte';

	// Dummy course data
	let course = $state({
		id: 'course-123',
		title: 'Japanese for Beginners'
	});

	// Dummy data for character categories
	let categories = $state([
		{
			id: 'cat-1',
			name: 'Hiragana',
			description: 'Basic Japanese phonetic syllabary',
			display_order: 1,
			course_id: 'course-123',
			sets: [
				{
					id: 'set-1',
					title: 'Basic Hiragana (あ行 - あ to お)',
					description: 'First row of hiragana characters',
					display_order: 1,
					category_id: 'cat-1',
					characters: [
						{
							id: 'char-1',
							character: 'あ',
							pronunciation: 'a',
							meaning: null,
							difficulty_level: 1,
							display_order: 1,
							notes: 'Written with three strokes',
							stroke_order_image: '/images/stroke_order/hiragana_a.svg'
						},
						{
							id: 'char-2',
							character: 'い',
							pronunciation: 'i',
							meaning: null,
							difficulty_level: 1,
							display_order: 2,
							notes: 'Written with two strokes',
							stroke_order_image: '/images/stroke_order/hiragana_i.svg'
						},
						{
							id: 'char-3',
							character: 'う',
							pronunciation: 'u',
							meaning: null,
							difficulty_level: 1,
							display_order: 3,
							notes: 'Written with two strokes',
							stroke_order_image: '/images/stroke_order/hiragana_u.svg'
						}
					]
				},
				{
					id: 'set-2',
					title: 'Hiragana (か行 - か to こ)',
					description: 'Second row of hiragana characters',
					display_order: 2,
					category_id: 'cat-1',
					characters: [
						{
							id: 'char-4',
							character: 'か',
							pronunciation: 'ka',
							meaning: null,
							difficulty_level: 1,
							display_order: 1,
							notes: 'Written with three strokes',
							stroke_order_image: '/images/stroke_order/hiragana_ka.svg'
						},
						{
							id: 'char-5',
							character: 'き',
							pronunciation: 'ki',
							meaning: null,
							difficulty_level: 2,
							display_order: 2,
							notes: 'Written with four strokes',
							stroke_order_image: '/images/stroke_order/hiragana_ki.svg'
						}
					]
				}
			]
		},
		{
			id: 'cat-2',
			name: 'Katakana',
			description: 'Japanese syllabary used primarily for foreign words',
			display_order: 2,
			course_id: 'course-123',
			sets: [
				{
					id: 'set-3',
					title: 'Basic Katakana (ア行 - ア to オ)',
					description: 'First row of katakana characters',
					display_order: 1,
					category_id: 'cat-2',
					characters: [
						{
							id: 'char-6',
							character: 'ア',
							pronunciation: 'a',
							meaning: null,
							difficulty_level: 1,
							display_order: 1,
							notes: 'Written with two strokes',
							stroke_order_image: '/images/stroke_order/katakana_a.svg'
						}
					]
				}
			]
		},
		{
			id: 'cat-3',
			name: 'Kanji',
			description: 'Chinese characters adopted in Japanese writing system',
			display_order: 3,
			course_id: 'course-123',
			sets: [
				{
					id: 'set-4',
					title: 'Basic Kanji (Numbers)',
					description: 'Kanji characters for numbers 1-10',
					display_order: 1,
					category_id: 'cat-3',
					characters: [
						{
							id: 'char-7',
							character: '一',
							pronunciation: 'ichi',
							meaning: 'one',
							difficulty_level: 1,
							display_order: 1,
							notes: 'Written with one horizontal stroke',
							stroke_order_image: '/images/stroke_order/kanji_one.svg'
						}
					]
				}
			]
		}
	]);

	// UI state variables
	let currentEditingCategory = $state<string | null>(null);
	let newCategoryName = $state('');
	let newCategoryDescription = $state('');

	// Difficulty levels
	let difficultyLevels = $state([
		{ value: 1, label: 'Easy' },
		{ value: 2, label: 'Medium' },
		{ value: 3, label: 'Hard' }
	]);

	// Start editing category
	function startEditingCategory(categoryId: string) {
		currentEditingCategory = categoryId;
		const category = categories.find((c) => c.id === categoryId);
		if (category) {
			newCategoryName = category.name;
			newCategoryDescription = category.description;
		}
	}

	// Save category
	function saveCategory() {
		if (currentEditingCategory) {
			categories = categories.map((category) =>
				category.id === currentEditingCategory
					? {
							...category,
							name: newCategoryName,
							description: newCategoryDescription
						}
					: category
			);

			currentEditingCategory = null;
			newCategoryName = '';
			newCategoryDescription = '';
		}
	}

	// Add new category
	function addCategory() {
		const newCategoryId = `cat-${Date.now()}`;
		const newDisplayOrder = categories.length + 1;

		categories = [
			...categories,
			{
				id: newCategoryId,
				name: 'New Category',
				description: '',
				display_order: newDisplayOrder,
				course_id: course.id,
				sets: []
			}
		];

		// Start editing the new category
		startEditingCategory(newCategoryId);
	}

	// Delete category
	function deleteCategory(categoryId: string) {
		if (confirm('Are you sure you want to delete this category and all its sets and characters?')) {
			categories = categories.filter((category) => category.id !== categoryId);
		}
	}

	// Add new set to category
	function addSet(categoryId: string) {
		const newSetId = `set-${Date.now()}`;
		const category = categories.find((c) => c.id === categoryId);

		if (category) {
			const newDisplayOrder = category.sets.length + 1;

			categories = categories.map((c) =>
				c.id === categoryId
					? {
							...c,
							sets: [
								...c.sets,
								{
									id: newSetId,
									title: 'New Character Set',
									description: '',
									display_order: newDisplayOrder,
									category_id: categoryId,
									characters: []
								}
							]
						}
					: c
			);
		}
	}

	// Delete set
	function deleteSet(categoryId: string, setId: string) {
		if (confirm('Are you sure you want to delete this set and all its characters?')) {
			categories = categories.map((category) =>
				category.id === categoryId
					? {
							...category,
							sets: category.sets.filter((set) => set.id !== setId)
						}
					: category
			);
		}
	}

	// Add new character
	function addCharacter(categoryId: string, setId: string) {
		const newCharacterId = `char-${Date.now()}`;

		categories = categories.map((category) =>
			category.id === categoryId
				? {
						...category,
						sets: category.sets.map((set) =>
							set.id === setId
								? {
										...set,
										characters: [
											...set.characters,
											{
												id: newCharacterId,
												character: '',
												pronunciation: '',
												meaning: '',
												difficulty_level: 1,
												display_order: set.characters.length + 1,
												notes: '',
												stroke_order_image: null
											}
										]
									}
								: set
						)
					}
				: category
		);
	}

	// Delete character
	function deleteCharacter(categoryId: string, setId: string, characterId: string) {
		if (confirm('Are you sure you want to delete this character?')) {
			categories = categories.map((category) =>
				category.id === categoryId
					? {
							...category,
							sets: category.sets.map((set) =>
								set.id === setId
									? {
											...set,
											characters: set.characters.filter((c) => c.id !== characterId)
										}
									: set
							)
						}
					: category
			);
		}
	}

	// Save all changes
	function handleSave() {
		// Just a placeholder for saving functionality
		alert('Character categories and sets saved!');
	}
</script>

<NavBarSecondary />

<div class="character-editor-container">
	<div class="back-nav">
		<a href="/course/{course.id}/edit" class="back-link">
			<ArrowLeft size={16} />
			<span>Back to Course Editor</span>
		</a>
	</div>

	<div class="editor-header">
		<h1>Character Sets Editor</h1>
		<Button onclick={handleSave} variant="primary" size="small">Save Changes</Button>
	</div>

	<div class="editor-content">
		<div class="section section-header">
			<div class="course-info">
				<h2>{course.title}</h2>
				<p>Manage character sets and individual characters for this course.</p>
			</div>
			<Button onclick={addCategory} variant="primary" size="small">
				<Plus size={16} />
				Add Category
			</Button>
		</div>

		<div class="categories-list">
			{#each categories as category}
				<div class="category-section">
					<div class="category-header">
						{#if currentEditingCategory === category.id}
							<div class="edit-form">
								<div class="form-row">
									<InputBox
										type="text"
										label="Category Name"
										value={newCategoryName}
										required={true}
									/>
								</div>
								<div class="form-row">
									<InputBox type="text" label="Description" value={newCategoryDescription} />
								</div>
								<div class="form-actions">
									<Button onclick={saveCategory} variant="primary" size="small">Save</Button>
									<Button
										onclick={() => (currentEditingCategory = null)}
										variant="secondary"
										size="small">Cancel</Button
									>
								</div>
							</div>
						{:else}
							<div class="category-info">
								<h3 class="category-title">{category.name}</h3>
								{#if category.description}
									<p class="category-description">{category.description}</p>
								{/if}
							</div>

							<div class="category-actions">
								<button class="action-button" onclick={() => startEditingCategory(category.id)}>
									<Edit2 size={16} />
								</button>
								<button class="action-button" onclick={() => deleteCategory(category.id)}>
									<Trash size={16} />
								</button>
								<Button onclick={() => addSet(category.id)} variant="secondary" size="small">
									<Plus size={14} />
									Add Set
								</Button>
							</div>
						{/if}
					</div>

					{#if category.sets.length === 0}
						<div class="empty-state">
							<p>No character sets yet in this category. Add your first set to get started.</p>
						</div>
					{:else}
						<div class="sets-list">
							{#each category.sets as set}
								<div class="set-item">
									<div class="set-header">
										<div class="set-info">
											<h4 class="set-title">{set.title}</h4>
											{#if set.description}
												<p class="set-description">{set.description}</p>
											{/if}
											<div class="set-stats">
												{set.characters.length} characters
											</div>
										</div>

										<div class="set-actions">
											<Button
												onclick={() => addCharacter(category.id, set.id)}
												variant="secondary"
												size="small"
											>
												<Plus size={14} />
												Add Character
											</Button>
											<button
												class="action-button delete"
												onclick={() => deleteSet(category.id, set.id)}
											>
												<Trash size={14} />
											</button>
										</div>
									</div>

									<div class="set-content">
										{#if set.characters.length === 0}
											<div class="empty-characters">
												<p>No characters in this set yet.</p>
											</div>
										{:else}
											<div class="characters-table-container">
												<table class="characters-table">
													<thead>
														<tr>
															<th>Character</th>
															<th>Pronunciation</th>
															<th>Meaning</th>
															<th>Difficulty</th>
															<th>Actions</th>
														</tr>
													</thead>
													<tbody>
														{#each set.characters as character}
															<tr>
																<td>
																	<input
																		type="text"
																		class="table-input character-input"
																		value={character.character}
																	/>
																</td>
																<td>
																	<input
																		type="text"
																		class="table-input"
																		value={character.pronunciation}
																	/>
																</td>
																<td>
																	<input
																		type="text"
																		class="table-input"
																		value={character.meaning}
																	/>
																</td>
																<td>
																	<select class="table-select" value={character.difficulty_level}>
																		{#each difficultyLevels as level}
																			<option value={level.value}>{level.label}</option>
																		{/each}
																	</select>
																</td>
																<td>
																	<button
																		class="action-button delete"
																		onclick={() =>
																			deleteCharacter(category.id, set.id, character.id)}
																	>
																		<Trash size={14} />
																	</button>
																</td>
															</tr>
														{/each}
													</tbody>
												</table>
											</div>
										{/if}
									</div>
								</div>
							{/each}
						</div>
					{/if}
				</div>
			{/each}

			{#if categories.length === 0}
				<div class="empty-state">
					<p>No character categories yet. Add your first category to organize characters.</p>
				</div>
			{/if}
		</div>

		<div class="actions-bar">
			<Button onclick={handleSave} variant="primary" size="medium">Save All Changes</Button>
		</div>
	</div>
</div>

<style lang="scss">
	.character-editor-container {
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
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: var(--gap-lg);

		h1 {
			font-size: var(--text-3xl);
			font-weight: var(--font-bold);
			margin: 0;
		}
	}

	.editor-content {
		display: flex;
		flex-direction: column;
		gap: var(--gap-lg);
	}

	.section {
		background-color: var(--color-neutral-0);
		border-radius: var(--radius-sm);
		border: 1px solid var(--color-neutral-200);
		padding: var(--padding-lg);
	}

	.section-header {
		display: flex;
		justify-content: space-between;
		align-items: center;

		.course-info {
			h2 {
				font-size: var(--text-2xl);
				font-weight: var(--font-bold);
				margin: 0 0 var(--gap-xs);
			}

			p {
				color: var(--color-neutral-600);
				margin: 0;
			}
		}
	}

	.categories-list {
		display: flex;
		flex-direction: column;
		gap: var(--gap-xl);
	}

	.category-section {
		background-color: var(--color-neutral-0);
		border-radius: var(--radius-sm);
		border: 1px solid var(--color-neutral-200);
		overflow: hidden;
	}

	.category-header {
		display: flex;
		padding: var(--padding-md);
		background-color: var(--color-neutral-100);
		border-bottom: 1px solid var(--color-neutral-200);
		align-items: center;
	}

	.category-info {
		flex: 1;
	}

	.category-title {
		font-size: var(--text-xl);
		font-weight: var(--font-semibold);
		margin: 0 0 var(--gap-xs);
		color: var(--color-primary-600);
	}

	.category-description {
		color: var(--color-neutral-600);
		margin: 0;
		font-size: var(--text-sm);
	}

	.category-actions {
		display: flex;
		gap: var(--gap-sm);
	}

	.action-button {
		display: flex;
		align-items: center;
		justify-content: center;
		border: none;
		background: none;
		cursor: pointer;
		color: var(--color-neutral-600);
		padding: var(--padding-xs);
		border-radius: var(--radius-xs);

		&:hover {
			background-color: var(--color-neutral-100);
		}

		&.edit {
			color: var(--color-primary-500);
			display: flex;
			align-items: center;
			gap: var(--gap-xs);

			span {
				font-size: var(--text-sm);
			}

			&:hover {
				background-color: var(--color-primary-50);
			}
		}

		&.delete {
			color: #e53935;

			&:hover {
				background-color: rgba(229, 57, 53, 0.1);
			}
		}
	}

	.edit-form {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: var(--gap-md);

		.form-row {
			margin-bottom: 0;
		}

		.form-actions {
			display: flex;
			gap: var(--gap-sm);
			margin-top: var(--gap-sm);
		}
	}

	.sets-list {
		display: flex;
		flex-direction: column;
		gap: var(--gap-md);
		padding: var(--padding-md);
	}

	.empty-state {
		padding: var(--padding-lg);
		text-align: center;
		background-color: var(--color-neutral-50);
		border-radius: var(--radius-sm);
		color: var(--color-neutral-600);
		margin: var(--gap-md);
	}

	.set-item {
		border: 1px solid var(--color-neutral-200);
		border-radius: var(--radius-sm);
		background-color: var(--color-neutral-50);
		margin-bottom: var(--gap-lg);
		overflow: hidden;
	}

	.set-header {
		display: flex;
		padding: var(--padding-sm);
		background-color: var(--color-neutral-200);
		border-bottom: 1px solid var(--color-neutral-300);
		justify-content: space-between;
		align-items: center;
	}

	.set-info {
		flex: 1;
	}

	.set-title {
		font-size: var(--text-lg);
		font-weight: var(--font-semibold);
		margin: 0 0 var(--gap-xs);
	}

	.set-description {
		color: var(--color-neutral-600);
		margin: 0 0 var(--gap-xs);
		font-size: var(--text-sm);
	}

	.set-stats {
		font-size: var(--text-xs);
		color: var(--color-neutral-500);
	}

	.set-actions {
		display: flex;
		gap: var(--gap-sm);
		align-items: center;
	}

	.set-content {
		padding: var(--padding-sm);
	}

	.empty-characters {
		padding: var(--padding-md);
		text-align: center;
		color: var(--color-neutral-600);
		font-size: var(--text-sm);
		background-color: var(--color-neutral-0);
		border-radius: var(--radius-xs);
	}

	.characters-table-container {
		overflow-x: auto;
	}

	.characters-table {
		width: 100%;
		border-collapse: collapse;
		font-size: var(--text-sm);

		th,
		td {
			padding: var(--padding-xs) var(--padding-sm);
			border: 1px solid var(--color-neutral-200);

			input {
				:focus-visible {
					outline: none;
					border: none;
				}
			}
		}

		th {
			text-align: left;
			background-color: var(--color-neutral-100);
			font-weight: var(--font-semibold);
		}

		tr:nth-child(even) {
			background-color: var(--color-neutral-50);
		}
	}

	.table-input {
		width: 87%;
		border: none;
		background-color: transparent;
		font-size: var(--text-sm);

		:focus {
			outline: none;
		}
		
		:focus-visible {
			border: none;
			outline: none;
		}

		&.character-input {
			font-weight: var(--font-bold);
		}
	}

	.table-select {
		width: 100%;
		padding: var(--padding-xs);
		border: 1px solid var(--color-neutral-300);
		border-radius: var(--radius-xs);
		font-size: var(--text-sm);
	}

	.actions-bar {
		display: flex;
		justify-content: flex-end;
		padding: var(--padding-md) 0;
	}
</style>
