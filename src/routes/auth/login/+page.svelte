<script lang="ts">
	import type { ActionData } from './$types';
	import Button from '$components/common/Button.svelte';
	import InputBox from '$components/common/InputBox.svelte';
	import Footer from '$layouts/Footer.svelte';
	import NavBarSecondary from '$layouts/NavBarSecondary.svelte';

	interface ComponentProps {
		form: ActionData;
	}

	let { form }: ComponentProps = $props();
	let email = $state(form?.email || '');
	let password = $state('');
</script>

<NavBarSecondary href="/"/>

<div class="auth-container">
	<div class="auth-card">
		<h1 class="auth-title">Sign In</h1>
		<p class="auth-subtitle">Welcome back! Please enter your details to continue.</p>

		{#if form?.errors && form.errors.length > 0}
			<div class="error-container">
				{#each form.errors as error}
					<p class="error-message">{error}</p>
				{/each}
			</div>
		{/if}

		<form class="auth-form" method="POST" action={'/auth/login/?/signInWithEmail'}>
			<div class="form-field">
				<InputBox
					type="email"
					name="email"
					label="Email"
					placeholder="Enter your email"
					value={email}
					required={true}
					error={form?.errors?.find((e) => e.includes('email')) || ''}
				/>
			</div>

			<div class="form-field">
				<InputBox
					type="password"
					name="password"
					label="Password"
					placeholder="Enter your password"
					value={password}
					required={true}
					error={form?.errors?.find((e) => e.includes('password')) || ''}
				/>
			</div>

			<div class="forgot-password">
				<a href="/auth/forgot-password">Forgot password?</a>
			</div>

			<div class="form-actions">
				<Button type="submit" variant="primary" size="medium">Sign In</Button>
			</div>
		</form>

		<div class="divider">
			<span>or</span>
		</div>

		<form method="POST" action={'/auth/login/?/googleSignIn'}>
			<Button type="submit" variant="secondary" size="medium">Continue with Google</Button>
		</form>

		<div class="auth-footer">
			<p>Don't have an account? <a href="/auth/register">Sign up</a></p>
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

	.auth-form {
		display: flex;
		flex-direction: column;
		gap: var(--gap-xxs);
	}

	.form-field {
		margin-bottom: var(--gap-md);
	}

	.error-container {
		background-color: rgba(255, 0, 0, 0.05);
		border-radius: var(--radius-xs);
		padding: var(--padding-sm);
		margin-bottom: var(--gap-md);
	}

	.error-message {
		color: var(--color-primary-700);
		font-size: var(--text-sm);
		margin: 0;
	}

	.forgot-password {
		text-align: right;
		margin-bottom: var(--gap-md);

		a {
			color: var(--color-primary-500);
			font-size: var(--text-sm);
			text-decoration: none;

			&:hover {
				text-decoration: underline;
			}
		}
	}

	.form-actions {
		margin-top: var(--gap-md);
	}

	.divider {
		position: relative;
		text-align: center;
		margin: var(--gap-lg) 0;

		&::before {
			content: '';
			position: absolute;
			top: 50%;
			left: 0;
			right: 0;
			height: 1px;
			background-color: var(--color-neutral-200);
		}

		span {
			position: relative;
			padding: 0 var(--padding-xs);
			background-color: var(--color-neutral-0);
			color: var(--color-neutral-500);
			font-size: var(--text-sm);
		}
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
