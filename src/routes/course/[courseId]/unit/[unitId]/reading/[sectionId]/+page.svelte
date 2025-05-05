<script lang="ts">
	import { ArrowLeft } from 'lucide-svelte';
	import type { PageData } from './$types';
	import NavBar from '$layouts/NavBar.svelte';
	import Footer from '$layouts/Footer.svelte';
	import SectionNavigation from '$components/section/SectionNavigation.svelte';
	import ReadingSection from '$components/section/ReadingSection.svelte';

	let { data } = $props<{ data: PageData }>();
	let { course, unit, section, unitSections = [] } = data;

	// Guard against undefined data
	if (!course) course = { id: '', title: '' } as any;
	if (!unit) unit = { id: '' } as any;
	if (!section) section = { id: '' } as any; // Add 'as any' back to match type expected by ReadingSection
</script>

<NavBar />

<div class="section-page">
	<div class="back-nav">
		<a href="/course/{course.id}/unit/{unit.id}" class="back-link">
			<ArrowLeft size={16} />
			<span>Back to Unit</span>
		</a>
	</div>

	{#if section && unit && unitSections.length > 0}
		<SectionNavigation
			sections={unitSections}
			activeId={section.id}
			courseId={course.id}
			unitId={unit.id}
		/>

		<ReadingSection {section} />
	{:else}
		<div class="error-message">
			<p>Unable to load section content.</p>
			<a href="/course/{course.id}/unit/{unit.id}">Return to unit</a>
		</div>
	{/if}
</div>

<Footer />

<style>
	.section-page {
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

	.error-message {
		padding: var(--padding-lg);
		text-align: center;
		background-color: var(--color-neutral-100);
		border-radius: var(--radius-sm);
	}
</style>
