<script lang="ts">
	import SectionTypeIcon from './SectionTypeIcon.svelte';

	let { type } = $props<{
		type: 'grammar' | 'vocabulary' | 'reading' | 'alphabet';
	}>();

	const getLabel = (type: string): string => {
		switch (type) {
			case 'grammar':
				return 'Grammar';
			case 'vocabulary':
				return 'Vocabulary';
			case 'reading':
				return 'Reading';
			case 'alphabet':
				return 'Alphabet';
			default:
				return 'Section';
		}
	};

	const getColor = (type: string): string => {
		switch (type) {
			case 'grammar':
				return 'bg-blue-100 text-blue-800';
			case 'vocabulary':
				return 'bg-green-100 text-green-800';
			case 'reading':
				return 'bg-purple-100 text-purple-800';
			case 'alphabet':
				return 'bg-orange-100 text-orange-800';
			default:
				return 'bg-gray-100 text-gray-800';
		}
	};
</script>

<div class="badge {getColor(type)}">
	<SectionTypeIcon {type} size={16} />
	<span>{getLabel(type)}</span>
</div>

<style>
	.badge {
		display: inline-flex;
		align-items: center;
		gap: 4px;
		padding: 4px 8px;
		border-radius: var(--radius-xs);
		font-size: var(--text-xs);
		font-weight: var(--font-medium);
	}
</style>
