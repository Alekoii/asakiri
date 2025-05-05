<script lang="ts">
	import { BookText, Volume2, Rotate3D } from 'lucide-svelte';
	import type { Section } from '$types/section.types';
	import type { VocabularyItem } from '$types/vocabulary.types';

	let { section = {}, vocabularyItems = [] } = $props<{
		section: Section;
		vocabularyItems: VocabularyItem[];
	}>();

	let showingDefinition = $state<Record<string, boolean>>({});

	function toggleCard(id: string) {
		showingDefinition[id] = !showingDefinition[id];
	}
</script>

<div class="vocabulary-section">
	<div class="section-header">
		<BookText size={24} />
		<h2>{section.title || 'Vocabulary'}</h2>
	</div>

	{#if vocabularyItems.length > 0}
		<p class="instruction">Click on cards to flip between term and definition</p>

		<div class="vocabulary-cards">
			{#each vocabularyItems as item}
				<div
					class="vocab-card {showingDefinition[item.id] ? 'flipped' : ''}"
					onclick={() => toggleCard(item.id)}
				>
					<div class="card-inner">
						<div class="card-front">
							<div class="term">{item.term}</div>
							{#if item.pronunciation}
								<div class="pronunciation">
									<span>{item.pronunciation}</span>
									{#if item.audio_url}
										<button class="audio-btn">
											<Volume2 size={16} />
										</button>
									{/if}
								</div>
							{/if}
						</div>
						<div class="card-back">
							<div class="definition">{item.definition}</div>
							{#if item.example}
								<div class="example">"{item.example}"</div>
							{/if}
						</div>
					</div>
					<button class="flip-btn" title="Flip card">
						<Rotate3D size={16} />
					</button>
				</div>
			{/each}
		</div>
	{:else}
		<div class="empty-state">
			<p>No vocabulary items found for this section.</p>
		</div>
	{/if}
</div>

<!-- Existing style remains the same -->
<style>
	/* Add this to your existing styles */
	.empty-state {
		padding: var(--padding-lg);
		text-align: center;
		background-color: var(--color-neutral-50);
		border-radius: var(--radius-sm);
		color: var(--color-neutral-600);
		margin-top: var(--gap-lg);
	}
</style>
