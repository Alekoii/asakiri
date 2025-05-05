<script lang="ts">
	let { src, title = 'Audio' } = $props<{
		src: string;
		title?: string;
	}>();

	let audio = $state<HTMLAudioElement | null>(null);
	let isPlaying = $state(false);
	let progress = $state(0);
	let duration = $state(0);
	let currentTime = $state(0);

	$effect(() => {
		if (audio) {
			const handlePlay = () => (isPlaying = true);
			const handlePause = () => (isPlaying = false);

			audio.addEventListener('play', handlePlay);
			audio.addEventListener('pause', handlePause);
			audio.addEventListener('timeupdate', updateProgress);
			audio.addEventListener('loadedmetadata', () => {
				duration = audio.duration;
			});

			return () => {
				audio.removeEventListener('play', handlePlay);
				audio.removeEventListener('pause', handlePause);
				audio.removeEventListener('timeupdate', updateProgress);
				audio.removeEventListener('loadedmetadata', () => {
					duration = audio.duration;
				});
			};
		}
	});

	function updateProgress() {
		if (audio) {
			currentTime = audio.currentTime;
			progress = (audio.currentTime / audio.duration) * 100;
		}
	}

	function togglePlay() {
		if (audio) {
			if (isPlaying) {
				audio.pause();
			} else {
				audio.play();
			}
		}
	}

	function formatTime(seconds: number): string {
		const mins = Math.floor(seconds / 60);
		const secs = Math.floor(seconds % 60);
		return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
	}

	function seek(e: Event) {
		if (audio && e.target instanceof HTMLInputElement) {
			const seekTo = (Number(e.target.value) / 100) * audio.duration;
			audio.currentTime = seekTo;
		}
	}
</script>

<div class="audio-player">
	<audio {src} bind:this={audio}></audio>

	<div class="audio-player-controls">
		<button class="play-button" onclick={togglePlay} aria-label={isPlaying ? 'Pause' : 'Play'}>
			{#if isPlaying}
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<rect x="6" y="4" width="4" height="16"></rect>
					<rect x="14" y="4" width="4" height="16"></rect>
				</svg>
			{:else}
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<polygon points="5 3 19 12 5 21 5 3"></polygon>
				</svg>
			{/if}
		</button>

		<div class="audio-info">
			<div class="title">{title}</div>
			<div class="time-display">
				<span>{formatTime(currentTime)}</span>
				<span>/</span>
				<span>{formatTime(duration)}</span>
			</div>
		</div>

		<div class="progress-container">
			<input type="range" min="0" max="100" value={progress} oninput={seek} class="progress-bar" />
		</div>
	</div>
</div>

<style>
	.audio-player {
		width: 100%;
		border: 1px solid var(--color-neutral-200);
		border-radius: var(--radius-sm);
		background-color: var(--color-neutral-50);
		padding: var(--padding-sm);
	}

	.audio-player-controls {
		display: flex;
		align-items: center;
		gap: var(--gap-sm);
	}

	.play-button {
		background: none;
		border: none;
		color: var(--color-primary-500);
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 36px;
		height: 36px;
		border-radius: 50%;
	}

	.play-button:hover {
		background-color: var(--color-neutral-100);
	}

	.audio-info {
		flex: 0 0 auto;
		margin-right: var(--gap-md);
	}

	.title {
		font-weight: var(--font-medium);
		font-size: var(--text-sm);
	}

	.time-display {
		font-size: var(--text-xs);
		color: var(--color-neutral-600);
	}

	.progress-container {
		flex: 1;
		display: flex;
		align-items: center;
	}

	.progress-bar {
		width: 100%;
		height: 4px;
		appearance: none;
		background-color: var(--color-neutral-300);
		outline: none;
		border-radius: 2px;
	}

	.progress-bar::-webkit-slider-thumb {
		appearance: none;
		width: 12px;
		height: 12px;
		border-radius: 50%;
		background-color: var(--color-primary-500);
		cursor: pointer;
	}

	.progress-bar::-moz-range-thumb {
		width: 12px;
		height: 12px;
		border-radius: 50%;
		background-color: var(--color-primary-500);
		cursor: pointer;
		border: none;
	}
</style>
