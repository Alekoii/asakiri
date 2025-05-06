<script lang="ts">
	import { getUserState } from '$lib/state/user-state.svelte';
	import Button from '$components/common/Button.svelte';
	import InputBox from '$components/common/InputBox.svelte';
	import { Camera, Check } from 'lucide-svelte';
	import type { PageData } from './$types';
	import NavBarSecondary from '$layouts/NavBarSecondary.svelte';

	let { data } = $props<{ data: PageData }>();
	let { profile, courses } = data;

	let userContext = getUserState();
	let user = $derived(userContext.user);

	let name = $state(profile?.name || '');
	let email = $state(profile?.email || user?.email || '');
	let bio = $state(profile?.bio || '');
	let subtitle = $state(profile?.subtitle || '');

	let avatarUrl = $state(profile?.avatar_url || '');
	let avatarFile = $state<File | null>(null);
	let avatarPreview = $state(avatarUrl);
	let isUploading = $state(false);
	let isSaving = $state(false);
	let saveSuccess = $state(false);

	function handleAvatarChange(event: Event) {
		const input = event.target as HTMLInputElement;
		const file = input.files?.[0];

		if (file) {
			avatarFile = file;
			avatarPreview = URL.createObjectURL(file);
		}
	}

	async function uploadAvatar() {
		if (!avatarFile) return avatarUrl;

		isUploading = true;

		try {
			const formData = new FormData();
			formData.append('avatar', avatarFile);

			const response = await fetch('?/uploadAvatar', {
				method: 'POST',
				body: formData
			});

			if (!response.ok) throw new Error('Failed to upload avatar');

			const result = await response.json();
			return result.avatarUrl;
		} catch (error) {
			console.error('Error uploading avatar:', error);
			return avatarUrl;
		} finally {
			isUploading = false;
		}
	}

	async function handleSubmit(e: Event) {
		e.preventDefault();
		isSaving = true;

		try {
			// Upload avatar if changed
			const finalAvatarUrl = avatarFile ? await uploadAvatar() : avatarUrl;

			const formData = new FormData();
			formData.append('name', name);
			formData.append('email', email);
			formData.append('bio', bio);
			formData.append('subtitle', subtitle);
			formData.append('avatarUrl', finalAvatarUrl);

			const response = await fetch('?/updateProfile', {
				method: 'POST',
				body: formData
			});

			if (!response.ok) throw new Error('Failed to update profile');

			saveSuccess = true;
			setTimeout(() => {
				saveSuccess = false;
			}, 3000);

			// Update avatar URL after successful upload
			avatarUrl = finalAvatarUrl;
		} catch (error) {
			console.error('Error saving profile:', error);
		} finally {
			isSaving = false;
		}
	}
</script>

<svelte:head>
	<title>My Profile | Asakiri</title>
</svelte:head>

<NavBarSecondary />

<div class="profile-page">
	<div class="container">
		<div class="page-header">
			<h1>My Profile</h1>
		</div>

		<div class="profile-content">
			<div class="profile-sidebar">
				<div class="avatar-container">
					<div class="avatar">
						{#if avatarPreview}
							<img src={avatarPreview} alt={name || 'Profile'} />
						{:else}
							<div class="avatar-placeholder">
								{name ? name.charAt(0).toUpperCase() : 'U'}
							</div>
						{/if}
					</div>

					<div class="avatar-upload">
						<label for="avatar-input" class="upload-button">
							<Camera size={16} />
							<span>Change Photo</span>
						</label>
						<input
							type="file"
							id="avatar-input"
							accept="image/*"
							oninput={handleAvatarChange}
							hidden
						/>
					</div>
				</div>

				<div class="user-stats">
					<div class="stat-item">
						<span class="stat-label">Teaching</span>
						<span class="stat-value">{courses.teaching.length} courses</span>
					</div>
					<div class="stat-item">
						<span class="stat-label">Learning</span>
						<span class="stat-value">{courses.learning.length} courses</span>
					</div>
				</div>
			</div>

			<div class="profile-main">
				<form onsubmit={handleSubmit}>
					<div class="form-section">
						<h2>Personal Information</h2>

						<div class="form-row">
							<InputBox
								type="text"
								label="Full Name"
								placeholder="Enter your name"
								bind:value={name}
								required={true}
							/>
						</div>

						<div class="form-row">
							<InputBox
								type="email"
								label="Email Address"
								placeholder="Enter your email"
								bind:value={email}
								required={true}
								disabled={true}
							/>
						</div>
					</div>

					<div class="form-section">
						<h2>Profile Details</h2>

						<div class="form-row">
							<InputBox
								type="text"
								label="Short Bio"
								placeholder="e.g. Language Teacher, Student"
								bind:value={subtitle}
								hint="A short description that appears under your name (Under 150 Characters)"
							/>
						</div>

						<div class="form-row">
							<label class="label" for="bio">About Me</label>
							<textarea
								id="bio"
								placeholder="Tell others about yourself..."
								rows="5"
								bind:value={bio}
							></textarea>
							<div class="hint">Share your language learning journey or teaching experience</div>
						</div>
					</div>

					<div class="form-actions">
						<Button
							type="submit"
							variant="primary"
							size="medium"
							disabled={isSaving || isUploading}
						>
							{isSaving ? 'Saving...' : 'Save Changes'}
						</Button>

						{#if saveSuccess}
							<div class="success-message">
								<Check size={16} />
								<span>Profile updated successfully</span>
							</div>
						{/if}
					</div>
				</form>
			</div>
		</div>
	</div>
</div>

<style lang="scss">
	.profile-page {
		background-color: var(--color-neutral-50);
		min-height: calc(100vh - 60px);
		padding: var(--padding-lg) 0;
	}

	.container {
		max-width: 1000px;
		margin: 0 auto;
		padding: 0 var(--padding-lg);
	}

	.page-header {
		margin-bottom: var(--gap-xl);

		h1 {
			font-size: var(--text-3xl);
			font-weight: var(--font-bold);
			color: var(--color-neutral-900);
			margin: 0;
		}
	}

	.profile-content {
		display: grid;
		grid-template-columns: 250px 1fr;
		gap: var(--gap-xl);

		@media (max-width: 768px) {
			grid-template-columns: 1fr;
		}
	}

	.profile-sidebar {
		display: flex;
		flex-direction: column;
		gap: var(--gap-lg);
	}

	.avatar-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--gap-md);
		background-color: var(--color-neutral-0);
		padding: var(--padding-lg);
		border-radius: var(--radius-sm);
		border: 1px solid var(--color-neutral-200);
	}

	.avatar {
		width: 150px;
		height: 150px;
		border-radius: 50%;
		overflow: hidden;

		img {
			width: 100%;
			height: 100%;
			object-fit: cover;
		}
	}

	.avatar-placeholder {
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: var(--text-4xl);
		font-weight: var(--font-bold);
		background-color: var(--color-primary-100);
		color: var(--color-primary-600);
	}

	.upload-button {
		display: flex;
		align-items: center;
		gap: var(--gap-xs);
		padding: var(--padding-xs) var(--padding-sm);
		border-radius: var(--radius-sm);
		background-color: var(--color-neutral-100);
		color: var(--color-neutral-700);
		cursor: pointer;
		transition: background-color 0.2s;

		&:hover {
			background-color: var(--color-neutral-200);
		}
	}

	.user-stats {
		background-color: var(--color-neutral-0);
		padding: var(--padding-lg);
		border-radius: var(--radius-sm);
		border: 1px solid var(--color-neutral-200);
	}

	.stat-item {
		display: flex;
		justify-content: space-between;
		padding: var(--padding-xs) 0;
		border-bottom: 1px solid var(--color-neutral-100);

		&:last-child {
			border-bottom: none;
		}
	}

	.stat-label {
		color: var(--color-neutral-600);
	}

	.stat-value {
		font-weight: var(--font-medium);
	}

	.profile-main {
		background-color: var(--color-neutral-0);
		padding: var(--padding-xl);
		border-radius: var(--radius-sm);
		border: 1px solid var(--color-neutral-200);
	}

	.form-section {
		margin-bottom: var(--gap-xl);

		h2 {
			font-size: var(--text-xl);
			font-weight: var(--font-semibold);
			color: var(--color-neutral-900);
			margin: 0 0 var(--gap-lg);
			padding-bottom: var(--gap-xs);
			border-bottom: 1px solid var(--color-neutral-200);
		}
	}

	.form-row {
		margin-bottom: var(--gap-lg);
	}

	.label {
		display: block;
		margin-bottom: var(--gap-xs);
		font-weight: var(--font-medium);
		color: var(--color-neutral-900);
	}

	textarea {
		width: 94%;
		padding: var(--padding-md);
		border: 1px solid var(--color-neutral-300);
		border-radius: var(--radius-sm);
		font-family: var(--font-primary), sans-serif;
		font-size: var(--text-base);
		resize: vertical;
		min-height: 120px;

		&:focus {
			outline: none;
			border-color: var(--color-primary-300);
		}
	}

	.hint {
		margin-top: var(--gap-xs);
		font-size: var(--text-sm);
		color: var(--color-neutral-600);
	}

	.form-actions {
		display: flex;
		align-items: center;
		gap: var(--gap-lg);
	}

	.success-message {
		display: flex;
		align-items: center;
		gap: var(--gap-xs);
		color: var(--color-primary-600);
		font-size: var(--text-sm);
		animation: fadeIn 0.3s ease;
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}
</style>
