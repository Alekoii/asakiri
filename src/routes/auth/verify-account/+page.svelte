<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import NavBarSecondary from '$layouts/NavBarSecondary.svelte';
	import Button from '$components/common/Button.svelte';
	import { supabase } from '$lib/supabase/supabaseClient';

	let timer = 30;
	let isDisabled = true;
	let interval: ReturnType<typeof setInterval>;
	let errorMessage = '';

	// start countdown
	onMount(() => {
		interval = setInterval(() => {
			if (timer > 0) {
				timer -= 1;
			} else {
				clearInterval(interval);
				isDisabled = false;
			}
		}, 1000);
	});

	onDestroy(() => {
		clearInterval(interval);
	});

	// resend the verification link
	async function handleResend() {
		isDisabled = true;
		timer = 30;
		errorMessage = '';
		interval = setInterval(() => {
			if (timer > 0) {
				timer -= 1;
			} else {
				clearInterval(interval);
				isDisabled = false;
			}
		}, 1000);
		const email = new URLSearchParams(window.location.search).get('email');
		const { error } = await supabase.auth.resend({
			type: 'signup',
			email: email || ''
		});

		if (error) {
			errorMessage = error.message;
		} else {
			alert('✅ Confirmation email resent!');
		}
	}
</script>

<NavBarSecondary href="/" />

<div class="auth-container">
	<div class="auth-card">
		<h1 class="auth-title">Verify Your Email</h1>
		<p class="auth-subtitle">
			Please verify your account by clicking on the link sent to your email.
		</p>

		{#if errorMessage}
			<div class="error-container">
				<p class="error-message">{errorMessage}</p>
			</div>
		{/if}

		<div class="form-actions">
			<Button onclick={handleResend} variant="primary" size="medium" disabled={isDisabled}>
				{#if isDisabled}
					Resend in {timer}s
				{:else}
					Resend Verification Email
				{/if}
			</Button>
		</div>
	</div>
</div>

<style lang="scss">
	/* — your existing theme’s styles — */

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

	.form-actions {
		margin-top: var(--gap-md);
		text-align: center;
	}
</style>
