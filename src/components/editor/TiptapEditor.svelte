<script lang="ts">
	import { Editor } from '@tiptap/core';
	import StarterKit from '@tiptap/starter-kit';
	import Table from '@tiptap/extension-table';
	import TableRow from '@tiptap/extension-table-row';
	import TableCell from '@tiptap/extension-table-cell';
	import TableHeader from '@tiptap/extension-table-header';
	import Image from '@tiptap/extension-image';
	import YouTube from '@tiptap/extension-youtube';
	import Underline from '@tiptap/extension-underline';
	import { Bold, Heading2, Heading3, Italic, List, ListOrdered } from 'lucide-svelte';
	import { Underline as LucideUnderline } from 'lucide-svelte';

	let {
		content = '',
		onChange = (html: string, json: object) => {},
		height = '300px'
	} = $props<{
		content: string;
		onChange?: (html: string, json: object) => void;
		height?: string;
	}>();

	let editor = $state<Editor | null>(null);
	let editorElement = $state<HTMLElement | null>(null);
	let isTableSelected = $state(false); // New state to track table selection

	function createEditor() {
		return new Editor({
			extensions: [
				StarterKit,
				Underline,
				Table.configure({
					resizable: true
				}),
				TableRow,
				TableCell,
				TableHeader,
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
			},
			onSelectionUpdate: ({ editor }) => {
				isTableSelected = editor.isActive('table');
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

	// Let's also update the isTableSelected state when the editor changes
	$effect(() => {
		if (editor) {
			isTableSelected = editor.isActive('table');
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

	function insertTable() {
		editor?.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
	}

	function addYoutubeVideo() {
		const url = prompt('Enter YouTube URL');
		if (url) {
			editor?.chain().focus().setYoutubeVideo({ src: url }).run();
		}
	}

	function uploadFile() {
		const input = document.createElement('input');
		input.type = 'file';
		input.accept = 'image/*,audio/*';
		input.multiple = false;
		input.onchange = () => {
			if (input.files?.length) {
				const file = input.files[0];
				if (file.type.startsWith('image/')) {
					// Create a URL for the image
					const url = URL.createObjectURL(file);
					editor?.chain().focus().setImage({ src: url }).run();
				} else if (file.type.startsWith('audio/')) {
					// Create a URL for the audio
					const url = URL.createObjectURL(file);
					editor
						?.chain()
						.focus()
						.insertContent({
							type: 'audio',
							attrs: {
								src: url,
								title: file.name
							}
						})
						.run();
				}
			}
		};
		input.click();
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

		<div class="toolbar-divider"></div>

		<button
			class="toolbar-button"
			onclick={insertTable}
			title="Insert Table"
			aria-label="Insert Table"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="18"
				height="18"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
			>
				<rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
				<line x1="3" y1="9" x2="21" y2="9"></line>
				<line x1="3" y1="15" x2="21" y2="15"></line>
				<line x1="9" y1="3" x2="9" y2="21"></line>
				<line x1="15" y1="3" x2="15" y2="21"></line>
			</svg>
		</button>

		<button
			class="toolbar-button"
			onclick={addYoutubeVideo}
			title="Insert YouTube Video"
			aria-label="Add Youtube Video"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="18"
				height="18"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
			>
				<path
					d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"
				></path>
				<polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
			</svg>
		</button>

		{#if isTableSelected}
			<div class="toolbar-divider"></div>
			<button
				class="toolbar-button"
				onclick={() => editor.chain().focus().deleteTable().run()}
				title="Delete Table"
				aria-label="Delete Table"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="18"
					height="18"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<path d="M3 6h18"></path>
					<path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path>
					<path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
					<line x1="10" y1="11" x2="10" y2="17"></line>
					<line x1="14" y1="11" x2="14" y2="17"></line>
				</svg>
			</button>
			<button
				class="toolbar-button"
				onclick={() => editor.chain().focus().addColumnBefore().run()}
				title="Add Column Before"
				aria-label="Add Column Before"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="18"
					height="18"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<path d="M8 3v18"></path>
					<path d="M16 3v18"></path>
					<path d="M3 8h18"></path>
					<path d="M3 16h18"></path>
					<path d="M3 12h5"></path>
					<path d="M10 12h1"></path>
				</svg>
			</button>
			<button
				class="toolbar-button"
				onclick={() => editor.chain().focus().addColumnAfter().run()}
				title="Add Column After"
				aria-label="Add Column After"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="18"
					height="18"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<path d="M8 3v18"></path>
					<path d="M16 3v18"></path>
					<path d="M3 8h18"></path>
					<path d="M3 16h18"></path>
					<path d="M16 12h5"></path>
					<path d="M13 12h1"></path>
				</svg>
			</button>
			<button
				class="toolbar-button"
				onclick={() => editor.chain().focus().addRowBefore().run()}
				title="Add Row Before"
				aria-label="Add Row Before"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="18"
					height="18"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<path d="M8 3v18"></path>
					<path d="M16 3v18"></path>
					<path d="M3 8h18"></path>
					<path d="M3 16h18"></path>
					<path d="M12 3v5"></path>
					<path d="M12 10v1"></path>
				</svg>
			</button>
			<button
				class="toolbar-button"
				onclick={() => editor.chain().focus().addRowAfter().run()}
				title="Add Row After"
				aria-label="Add Row After"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="18"
					height="18"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<path d="M8 3v18"></path>
					<path d="M16 3v18"></path>
					<path d="M3 8h18"></path>
					<path d="M3 16h18"></path>
					<path d="M12 16v5"></path>
					<path d="M12 13v1"></path>
				</svg>
			</button>
			<button
				class="toolbar-button"
				onclick={() => editor.chain().focus().deleteColumn().run()}
				title="Delete Column"
				aria-label="Delete Column"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="18"
					height="18"
					viewBox="0 0 24 24"
					fill="none"
					stroke="#e53935"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<path d="M8 3v18"></path>
					<path d="M16 3v18"></path>
					<path d="M3 8h18"></path>
					<path d="M3 16h18"></path>
					<path d="M10 3v18"></path>
					<path d="M14 3v18"></path>
				</svg>
			</button>
			<button
				class="toolbar-button"
				onclick={() => editor.chain().focus().deleteRow().run()}
				title="Delete Row"
				aria-label="Delete Row"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="18"
					height="18"
					viewBox="0 0 24 24"
					fill="none"
					stroke="#e53935"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<path d="M8 3v18"></path>
					<path d="M16 3v18"></path>
					<path d="M3 8h18"></path>
					<path d="M3 16h18"></path>
					<path d="M3 10h18"></path>
					<path d="M3 14h18"></path>
				</svg>
			</button>
		{/if}
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
	}

	:global(.tiptap-editor-content h2) {
		font-size: var(--text-2xl);
		font-weight: var(--font-bold);
		margin-top: 1em;
		margin-bottom: 0.5em;
	}

	:global(.tiptap-editor-content h3) {
		font-size: var(--text-xl);
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
