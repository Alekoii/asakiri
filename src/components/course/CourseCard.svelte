<script lang="ts">
	import { Book } from 'lucide-svelte';
	import type { Course } from '$types/course.types';

	let { course } = $props<{ course: Course }>();
</script>

<a href="/course/{course.id}" class="course-card">
	<div class="thumbnail">
		{#if course.thumbnail}
			<img src={course.thumbnail} alt={course.title} />
		{:else}
			<div class="placeholder">
				<Book size={48} />
			</div>
		{/if}
	</div>
	<div class="content">
		<h3>{course.title}</h3>
		{#if course.short_description}
			<p>{course.short_description}</p>
		{/if}
	</div>
</a>

<style>
	.course-card {
		display: block;
		border-radius: var(--radius-sm);
		border: 1px solid var(--color-neutral-200);
		overflow: hidden;
		transition: transform 0.2s;
	}

	.course-card:hover {
		transform: translateY(-4px);
	}

	.thumbnail {
		height: 160px;
		background-color: var(--color-neutral-100);
	}

	.thumbnail img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.placeholder {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 100%;
		color: var(--color-neutral-400);
	}

	.content {
		padding: var(--padding-md);
	}

	h3 {
		margin: 0 0 var(--gap-xs);
		font-size: var(--text-lg);
		font-weight: var(--font-semibold);
	}

	p {
		margin: 0;
		color: var(--color-neutral-600);
		font-size: var(--text-sm);
	}
</style>
