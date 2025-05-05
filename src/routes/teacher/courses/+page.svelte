<script lang="ts">
	import TopHeader from '$layouts/TopHeader.svelte';
	import CourseCard from '$components/common/CourseCard.svelte';
	import Button from '$components/common/Button.svelte';
	import type { PageData } from './$types';

	let { data } = $props<{ data: PageData }>();
	let activeTab = $state('published');

	let publishedCourses = $derived(
		data.courses.filter((course: { is_published: any }) => course.is_published)
	);

	let draftCourses = $derived(
		data.courses.filter((course: { is_published: any }) => !course.is_published)
	);

	let displayedCourses = $derived(activeTab === 'published' ? publishedCourses : draftCourses);
</script>

<TopHeader location="teachers" />

<div class="container">
	<div class="header-container">
		<div>
			<h1>Courses</h1>
			<p class="subheading">Your courses. Write proper copy.</p>
		</div>
		<Button href="/course/create" variant="primary" size="medium">Create New Course</Button>
	</div>

	<div class="tabs">
		<button
			class={activeTab === 'published' ? 'tab active' : 'tab'}
			onclick={() => (activeTab = 'published')}
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="20"
				height="20"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
				><path
					d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"
				></path><path d="M18 14h-8"></path><path d="M15 18h-5"></path><path d="M10 6h8v4h-8V6Z"
				></path></svg
			>
			Published
		</button>
		<button
			class={activeTab === 'drafts' ? 'tab active' : 'tab'}
			onclick={() => (activeTab = 'drafts')}
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="20"
				height="20"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
				><path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3Z"></path></svg
			>
			Drafts
		</button>
	</div>

	<div class="course-grid">
		{#if displayedCourses.length === 0}
			<div class="empty-state">
				<p>No {activeTab} courses yet.</p>
				<Button href="/course/create" variant="secondary">Create your first course</Button>
			</div>
		{:else}
			{#each displayedCourses as course (course.id)}
				<CourseCard
					id={course.id}
					title={course.title}
					short_description={course.short_description || ''}
					thumbnail={course.thumbnail || ''}
					language_taught={course.language_taught || 'Unknown'}
					course_language={course.course_language || 'English'}
					author_name={course.author_name}
					author_avatar_url={course.author_avatar_url}
					author_subtitle={course.author_subtitle}
					enrolled_students={course.enrolled_students}
					isPublished={course.is_published}
					link={`/course/${course.id}/edit`}
					showTotalEnrolled={true}
					showAuthor={false}
				/>
			{/each}
		{/if}
	</div>
</div>

<style lang="scss">
	.container {
		max-width: 1200px;
		margin: 0 auto;
		padding: var(--padding-lg);
	}

	.header-container {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: var(--gap-lg);

		h1 {
			font-size: var(--text-3xl);
			font-weight: var(--font-bold);
			margin: 0;
		}

		.subheading {
			color: var(--color-neutral-600);
			margin: var(--gap-xs) 0 0;
		}
	}

	.tabs {
		display: flex;
		border-bottom: 1px solid var(--color-neutral-200);
		margin-bottom: var(--gap-xl);
	}

	.tab {
		background: none;
		border: none;
		padding: var(--padding-sm) var(--padding-md);
		font-size: var(--text-base);
		cursor: pointer;
		color: var(--color-neutral-600);
		border-bottom: 2px solid transparent;
		margin-right: var(--gap-md);
		display: flex;
		align-items: center;
		gap: var(--gap-xs);

		&:hover {
			color: var(--color-primary-400);
		}

		&.active {
			color: var(--color-primary-400);
			border-bottom: 2px solid var(--color-primary-400);
		}
	}

	.course-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: var(--gap-lg);

		@media (max-width: 1200px) {
			grid-template-columns: repeat(2, 1fr);
		}

		@media (max-width: 768px) {
			grid-template-columns: 1fr;
		}
	}

	.empty-state {
		grid-column: 1 / -1;
		text-align: center;
		padding: var(--padding-xl);
		background-color: var(--color-neutral-50);
		border-radius: var(--radius-sm);

		p {
			margin-bottom: var(--gap-md);
			color: var(--color-neutral-600);
		}
	}
</style>
