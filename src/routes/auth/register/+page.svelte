<script lang="ts">
	import type { ActionData } from './$types';
	import Button from '$components/common/Button.svelte';
	import InputBox from '$components/common/InputBox.svelte';
	import NavBarSecondary from '$layouts/NavBarSecondary.svelte';

	interface ComponentProps {
		form: ActionData;
	}

	let { form }: ComponentProps = $props();
	let name = $state(form?.name || '');
	let email = $state(form?.email || '');
	let password = $state('');
	let passwordConfirmation = $state('');
</script>

<NavBarSecondary />

<div class="auth-container">
	<div class="auth-card">
		<h1 class="auth-title">Create Account</h1>
		<p class="auth-subtitle">Join our community of language learners today.</p>

		{#if form?.message}
			<div class="message-container {form.success ? 'success' : 'error'}">
				<p class="message">{form.message}</p>
			</div>
		{/if}

		<form class="auth-form" method="POST">
			<div class="form-field">
				<InputBox
					type="text"
					name="name"
					label="Full Name"
					placeholder="Enter your full name"
					value={name}
					required={true}
					error={form?.message?.includes('Name') ? form.message : ''}
				/>
			</div>

			<div class="form-field">
				<InputBox
					type="email"
					name="email"
					label="Email"
					placeholder="Enter your email"
					value={email}
					required={true}
					error={form?.message?.includes('email') ? form.message : ''}
				/>
			</div>

			<div class="form-field">
				<InputBox
					type="password"
					name="password"
					label="Password"
					placeholder="Create a password"
					value={password}
					required={true}
					hint="Password must be at least 8 characters with uppercase, lowercase, number, and special character"
					error={form?.message?.includes('Password') && !form.message.includes('confirm')
						? form.message
						: ''}
				/>
			</div>

			<div class="form-field">
				<InputBox
					type="password"
					name="passwordConfirmation"
					label="Confirm Password"
					placeholder="Confirm your password"
					value={passwordConfirmation}
					required={true}
					error={form?.message?.includes('confirm') ? form.message : ''}
				/>
			</div>

			<div class="form-actions">
				<Button type="submit" variant="primary" size="medium">Sign Up</Button>
			</div>
		</form>

		<div class="auth-footer">
			<p>Already have an account? <a href="/auth/login">Sign in</a></p>
		</div>
	</div>
</div>

<style lang="scss">
	.auth-container {
		display: flex;
		justify-content: center;
		align-items: center;
		min-height: calc(100vh - 200px);
		padding: var(--padding-lg);
		background-color: var(--color-neutral-50);
	}

	.auth-card {
		background-color: var(--color-neutral-0);
		border-radius: var(--radius-sm);
		padding: var(--padding-xl);
		width: 100%;
		max-width: 450px;
		border: 1px solid var(--color-neutral-100);
	}

	.auth-title {
		font-size: var(--text-3xl);
		color: var(--color-neutral-900);
		margin-bottom: var(--gap-xs);
		font-weight: var(--font-bold);
	}

	.auth-subtitle {
		color: var(--color-neutral-600);
		margin-bottom: var(--gap-lg);
	}

	.message-container {
		border-radius: var(--radius-xs);
		padding: var(--padding-sm);
		margin-bottom: var(--gap-md);

		&.success {
			background-color: rgba(0, 128, 0, 0.05);
		}

		&.error {
			background-color: rgba(255, 0, 0, 0.05);
		}
	}

	.message {
		margin: 0;
		font-size: var(--text-sm);

		.success & {
			color: var(--color-primary-600);
		}

		.error & {
			color: var(--color-primary-700);
		}
	}

	.auth-form {
		display: flex;
		flex-direction: column;
		gap: var(--gap-xxs);
	}

	.form-field {
		margin-bottom: var(--gap-md);
	}

	.form-actions {
		margin-top: var(--gap-md);
	}

	.auth-footer {
		margin-top: var(--gap-lg);
		text-align: center;
		color: var(--color-neutral-600);
		font-size: var(--text-sm);

		a {
			color: var(--color-primary-500);
			font-weight: var(--font-medium);
			text-decoration: none;

			&:hover {
				text-decoration: underline;
			}
		}
	}
</style>
