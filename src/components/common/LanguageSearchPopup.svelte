<script lang="ts">
	import { clickOutside } from '$lib/actions/clickOutside';
	import { Search, X, ChevronLeft, ChevronRight } from 'lucide-svelte';

	interface Language {
		id: number;
		code: string;
		name_en: string;
		name_native?: string | null;
		name_jpn?: string | null;
	}

	let {
		isOpen = $bindable(false),
		languages = $bindable<Language[]>([]),
		selectedLanguage = $bindable<Language | null>(null),
		title = 'Select Language',
		totalCount = $bindable(0),
		onSelect = (language: Language) => {}
	} = $props();

	let searchQuery = $state('');
	let currentPage = $state(0);
	let pageSize = 20;
	let isLoading = $state(false);
	let totalPages = $derived(Math.ceil(totalCount / pageSize));

	async function fetchLanguages() {
		isLoading = true;
		try {
			const response = await fetch(
				`/api/languages?page=${currentPage}&limit=${pageSize}&search=${encodeURIComponent(searchQuery)}`
			);
			if (!response.ok) throw new Error('Failed to fetch languages');

			const data = await response.json();
			languages = data.languages;
			totalCount = data.total;
		} catch (error) {
			console.error('Error fetching languages:', error);
		} finally {
			isLoading = false;
		}
	}

	function handleLanguageSelect(language: Language) {
		selectedLanguage = language;
		onSelect(language);
		isOpen = false;
		resetSearch();
	}

	function closePopup() {
		isOpen = false;
		resetSearch();
	}

	function resetSearch() {
		searchQuery = '';
		currentPage = 0;
	}

	function nextPage() {
		if (currentPage < totalPages - 1) {
			currentPage++;
			fetchLanguages();
		}
	}

	function prevPage() {
		if (currentPage > 0) {
			currentPage--;
			fetchLanguages();
		}
	}

	$effect(() => {
		if (isOpen) {
			fetchLanguages();
		}
	});

	$effect(() => {
		// Debounce search input
		const timer = setTimeout(() => {
			if (isOpen && searchQuery !== undefined) {
				currentPage = 0;
				fetchLanguages();
			}
		}, 300);

		return () => clearTimeout(timer);
	});
</script>

{#if isOpen}
	<div class="language-search-overlay">
		<div class="language-search-popup" use:clickOutside={closePopup}>
			<div class="popup-header">
				<h3>{title}</h3>
				<button class="close-button" onclick={closePopup}>
					<X size={20} />
				</button>
			</div>

			<div class="search-container">
				<Search size={18} />
				<input type="text" placeholder="Search languages..." bind:value={searchQuery} autofocus />
			</div>

			<div class="languages-list">
				{#if isLoading}
					<div class="loading-state">Loading languages...</div>
				{:else if languages.length === 0}
					<div class="empty-results">No languages found</div>
				{:else}
					{#each languages as language}
						<button
							class="language-item {selectedLanguage?.id === language.id ? 'selected' : ''}"
							onclick={() => handleLanguageSelect(language)}
						>
							<div class="language-code">{language.code.toUpperCase()}</div>
							<div class="language-info">
								<div class="language-name">{language.name_en}</div>
								{#if language.name_native && language.name_native !== language.name_en}
									<div class="language-native">{language.name_native}</div>
								{/if}
							</div>
						</button>
					{/each}

					<div class="pagination">
						<button
							class="pagination-button"
							onclick={prevPage}
							disabled={currentPage === 0 || isLoading}
						>
							<ChevronLeft size={16} />
						</button>
						<span class="page-info">
							{currentPage + 1} / {totalPages || 1}
						</span>
						<button
							class="pagination-button"
							onclick={nextPage}
							disabled={currentPage === totalPages - 1 || totalPages === 0 || isLoading}
						>
							<ChevronRight size={16} />
						</button>
					</div>
				{/if}
			</div>
		</div>
	</div>
{/if}

<style>
	.language-search-overlay {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: rgba(0, 0, 0, 0.5);
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 1000;
	}

	.language-search-popup {
		background-color: var(--color-neutral-0);
		border-radius: var(--radius-md);
		width: 90%;
		max-width: 450px;
		max-height: 80vh;
		display: flex;
		flex-direction: column;
		animation: popup 0.2s ease-out;
	}

	@keyframes popup {
		from {
			transform: scale(0.95);
			opacity: 0;
		}
		to {
			transform: scale(1);
			opacity: 1;
		}
	}

	.popup-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: var(--padding-md);
		border-bottom: 1px solid var(--color-neutral-200);
	}

	.popup-header h3 {
		margin: 0;
		font-size: var(--text-lg);
		font-weight: var(--font-semibold);
		color: var(--color-neutral-900);
	}

	.close-button {
		background: none;
		border: none;
		color: var(--color-neutral-600);
		cursor: pointer;
		padding: 4px;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.close-button:hover {
		background-color: var(--color-neutral-100);
		color: var(--color-neutral-900);
	}

	.search-container {
		padding: var(--padding-md);
		display: flex;
		align-items: center;
		border-bottom: 1px solid var(--color-neutral-200);
		gap: var(--gap-sm);
		color: var(--color-neutral-600);
	}

	input {
		flex: 1;
		border: none;
		outline: none;
		font-size: var(--text-base);
		padding: 0;
	}

	.languages-list {
		overflow-y: auto;
		max-height: 50vh;
		padding: var(--padding-sm);
		display: flex;
		flex-direction: column;
	}

	.language-item {
		display: flex;
		align-items: center;
		width: 100%;
		padding: var(--padding-md);
		border: none;
		background: none;
		cursor: pointer;
		text-align: left;
		gap: var(--gap-md);
		border-radius: var(--radius-sm);
	}

	.language-item:hover {
		background-color: var(--color-neutral-100);
	}

	.language-item.selected {
		background-color: var(--color-primary-50);
		color: var(--color-primary-700);
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

	.selected .language-code {
		background-color: var(--color-primary-100);
	}

	.language-info {
		flex: 1;
	}

	.language-name {
		font-weight: var(--font-medium);
	}

	.language-native {
		font-size: var(--text-sm);
		color: var(--color-neutral-600);
	}

	.empty-results,
	.loading-state {
		padding: var(--padding-lg);
		text-align: center;
		color: var(--color-neutral-600);
		font-size: var(--text-sm);
	}

	.pagination {
		display: flex;
		justify-content: center;
		align-items: center;
		margin-top: var(--gap-md);
		padding-top: var(--gap-md);
		border-top: 1px solid var(--color-neutral-200);
	}

	.pagination-button {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 32px;
		height: 32px;
		background: none;
		border: 1px solid var(--color-neutral-200);
		border-radius: var(--radius-sm);
		color: var(--color-neutral-700);
		cursor: pointer;
	}

	.pagination-button:hover:not(:disabled) {
		background-color: var(--color-neutral-100);
	}

	.pagination-button:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.page-info {
		margin: 0 var(--gap-md);
		font-size: var(--text-sm);
		color: var(--color-neutral-600);
	}
</style>
