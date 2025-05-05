<script lang="ts">
	import { Layers } from 'lucide-svelte';
	import type { Unit } from '$types/unit.types';
	import type { Section } from '$types/section.types';
	import SectionBadge from '$components/common/SectionBadge.svelte';

	let { unit, sections } = $props<{
		unit: Unit;
		sections: Section[];
	}>();
</script>

<a href="/course/{unit.course_id}/unit/{unit.id}" class="unit-card">
	<div class="header">
		<div class="icon">
			<Layers size={20} />
		</div>
		<h3>Unit {unit.serial_number}: {unit.title}</h3>
	</div>

	{#if unit.description}
		<p class="description">{unit.description}</p>
	{/if}

	<div class="sections">
		{#each sections as section}
			<SectionBadge type={section.section_type} />
		{/each}
	</div>
</a>

<style>
	.unit-card {
		display: block;
		padding: var(--padding-md);
		border-radius: var(--radius-sm);
		border: 1px solid var(--color-neutral-200);
		background-color: var(--color-neutral-50);
		transition: transform 0.2s;
	}

	.unit-card:hover {
		transform: translateY(-2px);
	}

	.header {
		display: flex;
		align-items: center;
		gap: var(--gap-sm);
		color: var(--color-neutral-700);
	}

	.icon {
		color: var(--color-primary-500);
	}

	h3 {
		margin: 0;
		font-size: var(--text-lg);
		font-weight: var(--font-semibold);
	}

	.description {
		margin: 0;
		color: var(--color-neutral-600);
		font-size: var(--text-sm);
	}

	.sections {
		display: flex;
		flex-wrap: wrap;
		gap: var(--gap-xs);
	}
</style>
