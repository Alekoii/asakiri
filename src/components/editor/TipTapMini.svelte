<script lang="ts">
	import { Editor } from '@tiptap/core';
	import StarterKit from '@tiptap/starter-kit';
	import Image from '@tiptap/extension-image';
	import YouTube from '@tiptap/extension-youtube';
	import Underline from '@tiptap/extension-underline';
	import { Bold, Heading2, Heading3, Italic, List, ListOrdered } from 'lucide-svelte';
	import { Underline as LucideUnderline } from 'lucide-svelte';

	let {
		content = '',
		onChange = (html: string, json: object) => {},
		height = '400px'
	} = $props<{
		content: string;
		onChange?: (html: string, json: object) => void;
		height?: string;
	}>();

	let editor = $state<Editor | null>(null);
	let editorElement = $state<HTMLElement | null>(null);

	function createEditor() {
		return new Editor({
			extensions: [
				StarterKit,
				Underline,
				Image,
				YouTube.configure({
					controls: true,
					nocookie: true
				})
			],
			element: editorElement,
			content,
			editorProps: {
				attributes: {
					class: 'tiptap-editor-content',
					style: `height: ${height}; overflow-y: auto; padding: var(--padding-sm);`
				}
			},
			onUpdate: ({ editor }) => {
				const html = editor.getHTML();
				const json = editor.getJSON();
				onChange(html, json);
			}
		});
	}

	// Initialize editor
	$effect(() => {
		if (editorElement) {
			editor = createEditor();

			// Clean up
			return () => {
				if (editor) {
					editor.destroy();
				}
			};
		}
	});

	$effect(() => {
		if (editor && content) {
			const currentContent = editor.getHTML();
			if (currentContent !== content) {
				editor.commands.setContent(content, false);
			}
		}
	});

	function toggleBold() {
		editor?.chain().focus().toggleBold().run();
	}

	function toggleItalic() {
		editor?.chain().focus().toggleItalic().run();
	}

	function toggleUnderline() {
		editor?.chain().focus().toggleUnderline().run();
	}

	function toggleHeading(level: 1 | 2 | 3 | 4 | 5 | 6) {
		editor?.chain().focus().toggleHeading({ level }).run();
	}

	function toggleBulletList() {
		editor?.chain().focus().toggleBulletList().run();
	}

	function toggleOrderedList() {
		editor?.chain().focus().toggleOrderedList().run();
	}

	export function getEditorContent() {
		return editor?.getHTML() ?? '';
	}

	export function getEditorJSON() {
		return editor?.getJSON() ?? {};
	}
</script>

<div class="tiptap-editor">
	<div class="toolbar">
		<button
			class="toolbar-button"
			class:active={editor?.isActive('bold')}
			onclick={toggleBold}
			title="Bold"
			aria-label="Text Bold"
			><Bold size={16} />
		</button>

		<button
			class="toolbar-button"
			class:active={editor?.isActive('italic')}
			onclick={toggleItalic}
			title="Italic"
			aria-label="Text Italic"
		>
			<Italic size={16} />
		</button>

		<button
			class="toolbar-button"
			class:active={editor?.isActive('underline')}
			onclick={toggleUnderline}
			title="Underline"
			aria-label="Text Underline"
		>
			<LucideUnderline size={16} />
		</button>

		<div class="toolbar-divider"></div>

		<button
			class="toolbar-button"
			class:active={editor?.isActive('heading', { level: 2 })}
			onclick={() => toggleHeading(2)}
			title="Heading 2"
			aria-label="Text Heading 2"
		>
			<Heading2 size={16} />
		</button>

		<button
			class="toolbar-button"
			class:active={editor?.isActive('heading', { level: 3 })}
			onclick={() => toggleHeading(3)}
			title="Heading 3"
			aria-label="Text Heading 3"
		>
			<Heading3 size={16} />
		</button>

		<div class="toolbar-divider"></div>

		<button
			class="toolbar-button"
			class:active={editor?.isActive('bulletList')}
			onclick={toggleBulletList}
			title="Bullet List"
			aria-label="Bullet List"
		>
			<List size={16} />
		</button>

		<button
			class="toolbar-button"
			class:active={editor?.isActive('orderedList')}
			onclick={toggleOrderedList}
			title="Ordered List"
			aria-label="Ordered List"
		>
			<ListOrdered size={16} />
		</button>
	</div>

	<div class="editor-content" bind:this={editorElement}></div>
</div>

<style>
	.tiptap-editor {
		border: 1px solid var(--color-neutral-300);
		border-radius: var(--radius-sm);
		overflow: hidden;
	}

	.toolbar {
		display: flex;
		flex-wrap: wrap;
		padding: var(--padding-xs);
		background-color: var(--color-neutral-100);
		border-bottom: 1px solid var(--color-neutral-200);
	}

	.toolbar-button {
		padding: 6px 8px;
		background: none;
		border: none;
		color: var(--color-neutral-600);
		border-radius: var(--radius-xs);
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.toolbar-button:hover {
		background-color: var(--color-neutral-200);
	}

	.toolbar-button.active {
		background-color: var(--color-primary-100);
		color: var(--color-primary-700);
	}

	.toolbar-divider {
		width: 1px;
		height: 24px;
		background-color: var(--color-neutral-300);
		margin: 0 var(--gap-xs);
	}

	.editor-content {
		background-color: var(--color-neutral-0);
	}

	:global(.tiptap-editor-content) {
		font-family: var(--font-primary), sans-serif;
		font-size: var(--text-base);
		line-height: 1.5;
		outline: none;
	}

	:global(.tiptap-editor-content p) {
		margin-top: 0.75em;
		margin-bottom: 0.75em;
		line-height: 1.75;
	}

	:global(.tiptap-editor-content h2) {
		font-size: var(--text-xl);
		font-weight: var(--font-medium);
		margin-top: 1em;
		margin-bottom: 0.5em;
	}

	:global(.tiptap-editor-content h3) {
		font-size: var(--text-lg);
		font-weight: var(--font-semibold);
		margin-top: 1em;
		margin-bottom: 0.5em;
	}

	:global(.tiptap-editor-content ul) {
		padding-left: 1.5em;
		margin: 0.75em 0;
	}

	:global(.tiptap-editor-content ol) {
		padding-left: 1.5em;
		margin: 0.75em 0;
	}

	:global(.tiptap-editor-content table) {
		border-collapse: collapse;
		margin: 1em 0;
		overflow: hidden;
		width: 100%;
	}

	:global(.tiptap-editor-content th) {
		background-color: var(--color-neutral-100);
		font-weight: var(--font-semibold);
		text-align: left;
	}

	:global(.tiptap-editor-content td, .tiptap-editor-content th) {
		border: 1px solid var(--color-neutral-300);
		padding: 0.5em;
		position: relative;
	}

	:global(.tiptap-editor-content img) {
		max-width: 100%;
		height: auto;
	}

	:global(.tiptap-editor-content iframe) {
		max-width: 100%;
		border: none;
		aspect-ratio: 16 / 9;
	}
</style>
