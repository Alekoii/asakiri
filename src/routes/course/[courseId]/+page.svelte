<script lang="ts">
	import { ArrowLeft, BookOpen, Users, Calendar, Globe, MessageSquare } from 'lucide-svelte';
	import type { PageData } from './$types';
	import Footer from '$layouts/Footer.svelte';
	import Button from '$components/common/Button.svelte';
	import UnitCard from '$components/unit/UnitCard.svelte';
	import SectionBadge from '$components/common/SectionBadge.svelte';
	import NavBarSecondary from '$layouts/NavBarSecondary.svelte';

	let { data } = $props<{ data: PageData }>();
	let { course, units, sections, courseTaughtLanguage, courseInLanguage, isEnrolled } = data;

	let teacher = $state({
		name: course.author_name || 'Unknown Teacher',
		avatar: course.author_avatar_url || null,
		subtitle: course.author_subtitle || 'Language Instructor',
		bio: course.author_bio || ''
	});

	// Group sections by unit
	let sectionsByUnit = $derived(() => {
		const grouped: Record<string, any[]> = {};

		for (const section of sections) {
			if (section.unit_id) {
				if (!grouped[section.unit_id]) {
					grouped[section.unit_id] = [];
				}
				grouped[section.unit_id].push(section);
			}
		}

		return grouped;
	});

	// Get standalone alphabet sections
	let alphabetSections = $derived(
		sections.filter((s) => s.is_standalone && s.section_type === 'alphabet')
	);

	// Format date - assuming created_at is in ISO format
	function formatDate(dateString: string): string {
		const date = new Date(dateString);
		return new Intl.DateTimeFormat('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		}).format(date);
	}
</script>

<svelte:head>
	<title>{course.title} | Asakiri</title>
	<meta
		name="description"
		content={course.short_description ||
			`Learn ${courseTaughtLanguage?.name_en || 'a language'} with our expert instructors`}
	/>
	<meta name="author" content={teacher.name} />
	<meta name="robots" content="index, follow" />
	<meta property="og:title" content="{course.title} | Asakiri" />
	<meta property="og:description" content={course.short_description} />
	<meta property="og:image" content={course.thumbnail} />
	<meta property="og:url" content="https://asakiri.com/course/{course.id}" />
	<meta property="og:type" content="website" />
	<meta name="twitter:card" content={course.thumbnail} />
	<meta name="twitter:title" content="{course.title} | Asakiri" />
	<meta name="twitter:description" content={course.short_description} />
	<meta name="twitter:image" content={course.thumbnail} />
</svelte:head>

<NavBarSecondary href="/" />

<main class="course-page">
	<div class="course-header">
		<div class="header-content">
			<div class="course-info">
				<h1>{course.title}</h1>

				{#if course.short_description}
					<p class="description">{course.short_description}</p>
				{/if}

				<div class="course-stats">
					<div class="stat">
						<Globe size={18} />
						<span>Language: <strong>{courseTaughtLanguage?.name_en || 'Unknown'}</strong></span>
					</div>
					<div class="stat">
						<MessageSquare size={18} />
						<span>Taught in: <strong>{courseInLanguage?.name_en || 'Unknown'}</strong></span>
					</div>
					<div class="stat">
						<Users size={18} />
						<span><strong>{course.enrolled_students || 0}</strong> students enrolled</span>
					</div>
					<div class="stat">
						<Calendar size={18} />
						<span>Last Updated: <strong>{formatDate(course.updated_at)}</strong></span>
					</div>
				</div>
				<div class="action-bar">
					{#if isEnrolled}
						<Button href="/course/{course.id}/unit/{units[0]?.id}" variant="primary" size="medium"
							>Continue Learning</Button
						>
						<Button href="/course/{course.id}/review" variant="secondary" size="medium"
							>Practice Vocabulary</Button
						>
					{:else}
						<form method="POST" action="?/enroll">
							<Button type="submit" variant="primary" size="medium">Enroll in Course</Button>
						</form>
					{/if}
				</div>
			</div>

			<div class="thumbnail">
				{#if course.thumbnail}
					<img src={course.thumbnail} alt={course.title} />
				{:else}
					<div class="placeholder">
						<BookOpen size={64} />
					</div>
				{/if}
			</div>
		</div>
	</div>

	<div class="course-content">
		<div class="teacher-section">
			<h2>Meet Your Instructor</h2>

			<div class="teacher-card">
				<div class="teacher-avatar">
					{#if teacher.avatar}
						<img src={teacher.avatar} alt={teacher.name} />
					{:else}
						<div class="avatar-placeholder">
							{teacher.name.charAt(0)}
						</div>
					{/if}
				</div>

				<div class="teacher-info">
					<h3>{teacher.name}</h3>
					<p class="teacher-subtitle">{teacher.subtitle}</p>
					<p class="teacher-bio">{teacher.bio}</p>
				</div>
			</div>
		</div>

		{#if course.description}
			<div class="description-section">
				<h2>About This Course</h2>
				<div class="course-description">
					{@html course.description}
				</div>
			</div>
		{/if}

		{#if alphabetSections.length > 0}
			<div class="alphabet-section">
				<h2>Characters & Alphabets</h2>

				<div class="alphabet-grid">
					{#each alphabetSections as section}
						<a href="/course/{course.id}/alphabets/{section.id}" class="alphabet-card">
							<SectionBadge type={section.section_type} />
							<h3>{section.title}</h3>
							{#if section.description}
								<p>{section.description}</p>
							{/if}
						</a>
					{/each}
				</div>
			</div>
		{/if}

		<div class="curriculum-section">
			<h2>Course Curriculum</h2>

			{#if units.length === 0}
				<div class="empty-state">
					<p>This course doesn't have any units yet.</p>
				</div>
			{:else}
				<div class="units-grid">
					{#each units as unit}
						<UnitCard {unit} sections={sectionsByUnit[unit.id] || []} />
					{/each}
				</div>
			{/if}
		</div>
	</div>
</main>

<style lang="scss">
	.course-page {
		max-width: 1200px;
		margin: 0 auto;
		padding: var(--padding-lg);
	}

	.course-header {
		margin-bottom: var(--gap-xl);

		.header-content {
			display: flex;
			gap: var(--gap-xl);
			margin-bottom: var(--gap-lg);

			@media (max-width: 768px) {
				flex-direction: column-reverse;
			}
		}
	}

	.course-info {
		flex: 1;

		h1 {
			font-size: var(--text-4xl);
			font-weight: var(--font-bold);
			margin: 0 0 var(--gap-md);
			color: var(--color-neutral-900);
			line-height: 1.2;
		}

		.description {
			font-size: var(--text-lg);
			color: var(--color-neutral-700);
			margin-bottom: var(--gap-lg);
		}
	}

	.course-stats {
		display: flex;
		flex-wrap: wrap;
		gap: var(--gap-md) var(--gap-xl);
		margin-top: var(--gap-lg);

		.stat {
			display: flex;
			align-items: center;
			gap: var(--gap-xs);
			color: var(--color-neutral-600);
			font-size: var(--text-sm);
		}
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

	.action-bar {
		display: flex;
		gap: var(--gap-md);
		padding: var(--padding-md) 0;
	}

	.course-content {
		display: flex;
		flex-direction: column;
		gap: var(--gap-xl);
	}

	.teacher-section,
	.description-section,
	.alphabet-section,
	.curriculum-section {
		padding: var(--padding-lg);
		background-color: var(--color-neutral-0);
		border-radius: var(--radius-md);
		border: 1px solid var(--color-neutral-100);

		h2 {
			font-size: var(--text-2xl);
			font-weight: var(--font-semibold);
			margin: 0 0 var(--gap-lg);
			color: var(--color-neutral-900);
		}
	}

	.teacher-card {
		display: flex;
		gap: var(--gap-lg);

		@media (max-width: 640px) {
			flex-direction: column;
		}

		.teacher-avatar {
			flex-shrink: 0;
			width: 120px;
			height: 120px;
			border-radius: 50%;
			overflow: hidden;
			border: 1px solid var(--color-neutral-100);

			@media (max-width: 640px) {
				width: 80px;
				height: 80px;
			}

			img {
				width: 100%;
				height: 100%;
				object-fit: cover;
			}

			.avatar-placeholder {
				width: 100%;
				height: 100%;
				display: flex;
				align-items: center;
				justify-content: center;
				background-color: var(--color-primary-300);
				color: var(--color-neutral-0);
				font-size: var(--text-3xl);
				font-weight: var(--font-bold);
			}
		}

		.teacher-info {
			flex: 1;

			h3 {
				font-size: var(--text-xl);
				font-weight: var(--font-semibold);
				margin: 0 0 var(--gap-xs);
				color: var(--color-neutral-900);
			}

			.teacher-subtitle {
				font-size: var(--text-base);
				color: var(--color-primary-600);
				margin: 0 0 var(--gap-md);
			}

			.teacher-bio {
				color: var(--color-neutral-700);
				line-height: 1.6;
				margin: 0;
			}
		}
	}

	.course-description {
		color: var(--color-neutral-700);
		line-height: 1.6;
	}

	.alphabet-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
		gap: var(--gap-md);
	}

	.alphabet-card {
		padding: var(--padding-md);
		background-color: var(--color-neutral-50);
		border-radius: var(--radius-sm);
		transition:
			transform 0.2s,
			background-color 0.2s;

		&:hover {
			transform: translateY(-2px);
			background-color: var(--color-neutral-100);
		}

		h3 {
			margin: var(--gap-sm) 0 var(--gap-xs);
			font-size: var(--text-lg);
			font-weight: var(--font-semibold);
		}

		p {
			margin: 0;
			color: var(--color-neutral-600);
			font-size: var(--text-sm);
		}
	}

	.units-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
		gap: var(--gap-lg);

		@media (max-width: 640px) {
			grid-template-columns: 1fr;
		}
	}

	.empty-state {
		padding: var(--padding-lg);
		text-align: center;
		background-color: var(--color-neutral-50);
		border-radius: var(--radius-sm);
		color: var(--color-neutral-600);
	}
</style>
