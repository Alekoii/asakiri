<script lang="ts">
	import type { Section } from '$types/section.types';
	import SectionTypeIcon from '$components/common/SectionTypeIcon.svelte';

	let {
		sections = [],
		activeId = '',
		courseId = '',
		unitId = ''
	} = $props<{
		sections: Section[];
		activeId: string;
		courseId: string;
		unitId: string;
	}>();

	// Sort sections by serial number
	let sortedSections = $derived([...sections].sort((a, b) => a.serial_number - b.serial_number));
</script>

{#if sections.length > 0}
	<div class="section-nav">
		{#each sortedSections as section}
			<a
				href="/course/{courseId}/unit/{unitId}/{section.section_type}/{section.id}"
				class="nav-item {section.id === activeId ? 'active' : ''}"
			>
				<SectionTypeIcon type={section.section_type} />
				<span>{section.title}</span>
			</a>
		{/each}
	</div>
{/if}

<style>
	.section-nav {
		display: flex;
		border-bottom: 1px solid var(--color-neutral-200);
		margin-bottom: var(--gap-lg);
	}

	.nav-item {
		display: flex;
		align-items: center;
		gap: var(--gap-xs);
		padding: var(--padding-sm) var(--padding-md);
		color: var(--color-neutral-600);
		border-bottom: 2px solid transparent;
		transition: all 0.2s;
	}

	.nav-item:hover {
		color: var(--color-primary-500);
	}

	.nav-item.active {
		color: var(--color-primary-500);
		border-bottom-color: var(--color-primary-500);
		font-weight: var(--font-medium);
	}
</style>
