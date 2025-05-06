<script lang="ts">
	import { ArrowLeft, CheckCircle } from 'lucide-svelte';
	import type { PageData } from './$types';
	import Button from '$components/common/Button.svelte';
	import FlashcardReview from '$components/review/FlashcardReview.svelte';
	import NavBarSecondary from '$layouts/NavBarSecondary.svelte';

	let { data } = $props<{ data: PageData }>();
	let { course, reviewItems, stats } = data;

	let reviewActive = $state(false);
	let reviewCompleted = $state(false);
	let reviewStats = $state<{ total: number; completed: number; correct: number }>({
		total: reviewItems.length,
		completed: 0,
		correct: 0
	});

	let reviewRatings: Record<string, number> = {};

	function updateRating(event: CustomEvent<{ id: string; rating: number }>) {
		const { id, rating } = event.detail;
		reviewRatings[id] = rating;
	}

	function prepareReviewItems() {
		return reviewItems.map((item) => ({
			id: item.flashcard.id,
			term: item.flashcard.front_content,
			definition: item.flashcard.back_content,
			pronunciation: item.flashcard.hint || null,
			example: null
		}));
	}

	function startReview() {
		reviewActive = true;
		reviewCompleted = false;
		reviewStats = {
			total: reviewItems.length,
			completed: 0,
			correct: 0
		};
		reviewRatings = {};
	}

	async function exitReview() {
		if (Object.keys(reviewRatings).length > 0) {
			await handleReviewComplete(reviewRatings);
			reviewRatings = {};
		}
		reviewActive = false;
		reviewCompleted = false;
		location.reload();
	}

	async function handleReviewComplete(ratings: Record<string, number>) {
		for (const [flashcardId, rating] of Object.entries(ratings)) {
			const formData = new FormData();
			formData.append('flashcardId', flashcardId);
			formData.append('rating', rating.toString());

			try {
				await fetch('?/updateProgress', {
					method: 'POST',
					body: formData
				});

				// Update stats
				reviewStats.completed++;
				if (rating >= 3) {
					reviewStats.correct++;
				}
			} catch (err) {
				console.error('Failed to update progress for card:', flashcardId, err);
			}
		}

		reviewCompleted = true;
	}

	function formatSuccessRate(correct: number, total: number): string {
		if (total === 0) return '0%';
		return `${Math.round((correct / total) * 100)}%`;
	}
</script>

<NavBarSecondary />

<div class="review-page">
	<div class="back-nav">
		<a href="/course/{course.id}" class="back-link">
			<ArrowLeft size={16} />
			<span>Back to Course</span>
		</a>
	</div>

	{#if reviewActive}
		<!-- Active flashcard review UI -->
		<div class="review-container">
			<div class="review-header">
				<Button onclick={exitReview} variant="secondary" size="small">
					<ArrowLeft size={16} />
					Exit Review
				</Button>
				<h1>{course.title} Review</h1>
			</div>

			{#if reviewCompleted}
				<!-- Review completion summary -->
				<div class="review-complete">
					<div class="complete-header">
						<CheckCircle size={48} color="var(--color-primary-500)" />
						<h2>Review Complete!</h2>
					</div>

					<div class="stats-container">
						<div class="stat-box">
							<span class="stat-label">Total Cards</span>
							<span class="stat-value">{reviewStats.total}</span>
						</div>
						<div class="stat-box">
							<span class="stat-label">Completed</span>
							<span class="stat-value">{reviewStats.completed}</span>
						</div>
						<div class="stat-box">
							<span class="stat-label">Success Rate</span>
							<span class="stat-value"
								>{formatSuccessRate(reviewStats.correct, reviewStats.completed)}</span
							>
						</div>
					</div>

					<div class="complete-actions">
						<Button onclick={exitReview} variant="primary" size="medium">Return to Course</Button>
					</div>
				</div>
			{:else}
				<!-- Active flashcard review -->
				<FlashcardReview
					items={prepareReviewItems()}
					onComplete={handleReviewComplete}
					on:rate={updateRating}
					showRating={true}
				/>
			{/if}
		</div>
	{:else}
		<!-- Course review intro screen -->
		<div class="course-header">
			<h1>{course.title}</h1>
			<p class="subtitle">Spaced Repetition Review</p>
		</div>

		<div class="review-info-container">
			<div class="review-card">
				<h2>Ready to Review?</h2>
				<p>
					You have {reviewItems.length} item{reviewItems.length === 1 ? '' : 's'} due for review.
				</p>

				<div class="review-stats">
					<div class="stat-item">
						<span class="stat-label">Success rate:</span>
						<span class="stat-value">{stats.successRate}%</span>
					</div>
					<div class="stat-item">
						<span class="stat-label">Last practiced:</span>
						<span class="stat-value">{stats.lastPracticed}</span>
					</div>
					<div class="stat-item">
						<span class="stat-label">Total reviews:</span>
						<span class="stat-value">{stats.totalReviews}</span>
					</div>
				</div>

				{#if reviewItems.length > 0}
					<div class="review-actions">
						<Button onclick={startReview} variant="primary" size="medium">Start Review</Button>
					</div>
				{:else}
					<div class="no-reviews">
						<p>You don't have any cards due for review right now.</p>
						<p class="hint">Check back later or create new flashcards for this course.</p>
					</div>
				{/if}
			</div>

			<div class="review-info">
				<h3>About Spaced Repetition</h3>
				<p>
					Spaced repetition is a proven learning technique that helps you remember information by
					reviewing it at increasing intervals based on how well you know it.
				</p>
				<ul>
					<li><strong>New cards</strong> will be shown more frequently</li>
					<li><strong>Known cards</strong> will appear less often</li>
					<li><strong>Difficult cards</strong> will be repeated sooner</li>
				</ul>
				<p>
					Rate each card based on how well you remembered it to optimize your learning experience.
				</p>
			</div>
		</div>
	{/if}
</div>

<style>
	.review-page {
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

	.course-header {
		text-align: center;
		margin-bottom: var(--gap-xl);
	}

	.course-header h1 {
		font-size: var(--text-3xl);
		font-weight: var(--font-bold);
		margin-bottom: var(--gap-xs);
	}

	.subtitle {
		color: var(--color-neutral-600);
		font-size: var(--text-lg);
	}

	.review-info-container {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: var(--gap-xl);
	}

	@media (max-width: 768px) {
		.review-info-container {
			grid-template-columns: 1fr;
		}
	}

	.review-card {
		background-color: var(--color-neutral-50);
		border-radius: var(--radius-sm);
		padding: var(--padding-xl);
	}

	.review-card h2 {
		font-size: var(--text-2xl);
		font-weight: var(--font-semibold);
		margin-bottom: var(--gap-md);
	}

	.review-stats {
		margin: var(--gap-lg) 0;
		display: flex;
		flex-direction: column;
		gap: var(--gap-md);
	}

	.stat-item {
		display: flex;
		justify-content: space-between;
		padding-bottom: var(--gap-sm);
		border-bottom: 1px solid var(--color-neutral-200);
	}

	.stat-label {
		color: var(--color-neutral-600);
	}

	.stat-value {
		font-weight: var(--font-semibold);
	}

	.review-actions {
		margin-top: var(--gap-xl);
		text-align: center;
	}

	.no-reviews {
		margin-top: var(--gap-xl);
		text-align: center;
		color: var(--color-neutral-600);
	}

	.no-reviews .hint {
		font-size: var(--text-sm);
		margin-top: var(--gap-sm);
		color: var(--color-neutral-500);
	}

	.review-info {
		background-color: var(--color-primary-50);
		border-radius: var(--radius-sm);
		padding: var(--padding-xl);
	}

	.review-info h3 {
		font-size: var(--text-xl);
		font-weight: var(--font-semibold);
		margin-bottom: var(--gap-lg);
		color: var(--color-primary-600);
	}

	.review-info p {
		margin-bottom: var(--gap-md);
		line-height: 1.6;
	}

	.review-info ul {
		margin-bottom: var(--gap-lg);
		padding-left: var(--gap-lg);
	}

	.review-info li {
		margin-bottom: var(--gap-sm);
	}

	/* Review active section styles */
	.review-container {
		animation: fadeIn 0.3s ease;
	}

	.review-header {
		display: flex;
		align-items: center;
		gap: var(--gap-md);
		margin-bottom: var(--gap-xl);
	}

	.review-header h1 {
		margin: 0;
		font-size: var(--text-2xl);
		font-weight: var(--font-semibold);
	}

	.review-complete {
		background-color: var(--color-neutral-50);
		border-radius: var(--radius-md);
		padding: var(--padding-xl);
		text-align: center;
	}

	.complete-header {
		margin-bottom: var(--gap-xl);
	}

	.complete-header h2 {
		font-size: var(--text-2xl);
		margin-top: var(--gap-md);
		color: var(--color-primary-600);
	}

	.stats-container {
		display: flex;
		justify-content: center;
		gap: var(--gap-xl);
		margin-bottom: var(--gap-xl);
	}

	.stat-box {
		display: flex;
		flex-direction: column;
		min-width: 100px;
	}

	.stat-label {
		font-size: var(--text-sm);
		color: var(--color-neutral-600);
		margin-bottom: var(--gap-xs);
	}

	.stat-value {
		font-size: var(--text-2xl);
		font-weight: var(--font-bold);
		color: var(--color-neutral-900);
	}

	.complete-actions {
		margin-top: var(--gap-xl);
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}
</style>
