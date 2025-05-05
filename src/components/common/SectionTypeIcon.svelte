<script lang="ts">
	import { BookOpen, GraduationCap, BookText, Languages } from 'lucide-svelte';

	let { type, size = 20 } = $props<{
		type: 'grammar' | 'vocabulary' | 'reading' | 'alphabet';
		size?: number;
	}>();
</script>

{#if type === 'grammar'}
	<GraduationCap {size} />
{:else if type === 'vocabulary'}
	<BookText {size} />
{:else if type === 'reading'}
	<BookOpen {size} />
{:else if type === 'alphabet'}
	<Languages {size} />
{/if}
