<script lang="ts">
	import { Rotate3D, ChevronLeft, ChevronRight, ThumbsUp, ThumbsDown } from 'lucide-svelte';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher<{ rate: { id: string; rating: number } }>();

	let {
		items = [],
		onComplete = (ratings: Record<string, number>) => {},
		showRating = true,
		startIndex = 0
	} = $props<{
		items: Array<{
			id: string;
			term: string;
			pronunciation?: string;
			definition: string;
			example?: string;
		}>;
		onComplete?: (ratings: Record<string, number>) => void;
		showRating?: boolean;
		startIndex?: number;
	}>();

	let currentIndex = $state(startIndex);
	let isFlipped = $state(false);
	let ratings = $state<Record<string, number>>({});

	const currentItem = $derived(items[currentIndex] || null);
	const isFirstCard = $derived(currentIndex === 0);
	const isLastCard = $derived(currentIndex === items.length - 1);
	const progress = $derived(Math.round((currentIndex / Math.max(1, items.length)) * 100));

	function flipCard() {
		isFlipped = !isFlipped;
	}

	function nextCard() {
		if (!isLastCard) {
			currentIndex++;
			isFlipped = false;
		} else if (Object.keys(ratings).length > 0) {
			onComplete(ratings);
		}
	}

	function prevCard() {
		if (!isFirstCard) {
			currentIndex--;
			isFlipped = false;
		}
	}

	function rateCard(rating: 1 | 2 | 3 | 4 | 5) {
		if (currentItem) {
			ratings[currentItem.id] = rating;
			dispatch('rate', { id: currentItem.id, rating });
			nextCard();
		}
	}
</script>

<div class="flashcard-review">
	<div class="progress-bar">
		<div class="progress" style="width: {progress}%"></div>
	</div>

	<div class="counter">
		Card {currentIndex + 1} of {items.length}
	</div>

	{#if currentItem}
		<div class="card-container">

			<div class="flashcard {isFlipped ? 'flipped' : ''}">
				<div class="card-inner">
					<div class="card-front">
						<div class="term">{currentItem.term}</div>
						{#if currentItem.pronunciation}
							<div class="pronunciation">{currentItem.pronunciation}</div>
						{/if}
					</div>
					<div class="card-back">
						<div class="definition">{currentItem.definition}</div>
						{#if currentItem.example}
							<div class="example">"{currentItem.example}"</div>
						{/if}
					</div>
				</div>
			</div>
			<button class="flip-btn" onclick={flipCard}>
				<Rotate3D size={24} />
			</button>
			{#if isFlipped && showRating}
				<div class="rating">
					<p>How well did you know this?</p>
					<div class="rating-buttons">
						<button onclick={() => rateCard(1)} class="rating-btn difficult">
							<ThumbsDown size={20} />
							<span>Difficult</span>
						</button>
						<button onclick={() => rateCard(3)} class="rating-btn medium">
							<span>Medium</span>
						</button>
						<button onclick={() => rateCard(5)} class="rating-btn easy">
							<ThumbsUp size={20} />
							<span>Easy</span>
						</button>
					</div>
				</div>
			{/if}
		</div>
	{/if}

	<div class="navigation">
		<button class="nav-btn" onclick={prevCard} disabled={isFirstCard}>
			<ChevronLeft size={24} />
		</button>
		<button
			class="nav-btn"
			onclick={nextCard}
			disabled={isLastCard && Object.keys(ratings).length === 0}
		>
			<ChevronRight size={24} />
		</button>
	</div>
</div>

<style>
	.flashcard-review {
		max-width: 600px;
		margin: 0 auto;
		padding: var(--padding-lg);
	}

	.progress-bar {
		height: 6px;
		background-color: var(--color-neutral-200);
		border-radius: 3px;
		margin-bottom: var(--gap-md);
	}

	.progress {
		height: 100%;
		background-color: var(--color-primary-400);
		border-radius: 3px;
		transition: width 0.3s;
	}

	.counter {
		text-align: center;
		color: var(--color-neutral-600);
		font-size: var(--text-sm);
		margin-bottom: var(--gap-lg);
	}

	.card-container {
		position: relative;
		margin-bottom: var(--gap-xl);
	}

	.flip-btn {
		position: absolute;
		top: 10px;
		right: 10px;
		z-index: 10;
		background: none;
		border: none;
		color: var(--color-neutral-600);
		cursor: pointer;
	}

	.flashcard {
		height: 300px;
		perspective: 1000px;
	}

	.card-inner {
		position: relative;
		width: 100%;
		height: 100%;
		transition: transform 0.6s;
		transform-style: preserve-3d;
	}

	.flipped .card-inner {
		transform: rotateY(180deg);
	}

	.card-front,
	.card-back {
		position: absolute;
		width: 100%;
		height: 100%;
		backface-visibility: hidden;
		border-radius: var(--radius-sm);
		padding: var(--padding-lg);
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		text-align: center;
	}

	.card-front {
		background-color: var(--color-neutral-100);
	}

	.card-back {
		background-color: var(--color-neutral-100);
		transform: rotateY(180deg);
	}

	.term {
		font-size: var(--text-4xl);
		font-weight: var(--font-regular);
		margin-bottom: var(--gap-md);
	}

	.pronunciation {
		font-size: var(--text-lg);
		color: var(--color-neutral-600);
	}

	.definition {
		font-size: var(--text-2xl);
		margin-bottom: var(--gap-md);
	}

	.example {
		font-style: italic;
		font-size: var(--text-lg);
		color: var(--color-neutral-600);
	}

	.rating {
		margin-top: var(--gap-lg);
		text-align: center;
	}

	.rating p {
		margin-bottom: var(--gap-md);
		color: var(--color-neutral-700);
	}

	.rating-buttons {
		display: flex;
		justify-content: center;
		gap: var(--gap-md);
	}

	.rating-btn {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--gap-xs);
		padding: var(--padding-sm) var(--padding-md);
		border: none;
		border-radius: var(--radius-sm);
		cursor: pointer;
	}

	.rating-btn.difficult {
		background-color: #ffebee;
		color: #d32f2f;
	}

	.rating-btn.medium {
		background-color: #fff8e1;
		color: #ffa000;
	}

	.rating-btn.easy {
		background-color: #e8f5e9;
		color: #388e3c;
	}

	.navigation {
		display: flex;
		justify-content: center;
		gap: var(--gap-lg);
		margin-top: 60px;
	}

	.nav-btn {
		width: 48px;
		height: 48px;
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: var(--color-neutral-50);
		border: 1px solid var(--color-neutral-200);
		border-radius: 50%;
		cursor: pointer;
	}

	.nav-btn:hover:not([disabled]) {
		background-color: var(--color-primary-50);
		color: var(--color-primary-500);
	}

	.nav-btn[disabled] {
		opacity: 0.5;
		cursor: not-allowed;
	}
</style>
