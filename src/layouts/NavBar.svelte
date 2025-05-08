<script lang="ts">
	import { User, LogOut } from 'lucide-svelte';
	import { getUserState } from '$lib/state/user-state.svelte';
	import { clickOutside } from '$lib/actions/clickOutside';

	let userContext = getUserState();
	let user = $derived(userContext.profile);
	let logout = () => {
		userContext.logout();
		window.location.reload();
	};
	let userMenuOpen = $state(false);
</script>

<nav class="navbar">
	<div class="nav-left">
		<div class="logo">
			<a href="/">
				<img src="images/asakiri-logo.svg" alt="Asakiri Logo" width="40px" />
				<span>Asakiri</span>
			</a>
		</div>
		<div class="nav-links">
			<a href="/" class="nav-link">Home</a>
			<a href="/about" class="nav-link mobile-hide">About</a>
		</div>
	</div>

	<div class="nav-auth">
		{#if user}
			<div class="user-menu {userMenuOpen ? 'open' : ''}">
				<a
					href={null}
					class="user-info"
					onclick={() => (userMenuOpen = !userMenuOpen)}
					use:clickOutside={() => (userMenuOpen = false)}
				>
					<User size={18} />
					<span>{user.name ?? user.email}</span>
				</a>
				<div class="dropdown">
					<a href="/profile" class="dropdown-item">Profile</a>
					<button type="button" onclick={logout} class="dropdown-item logout">
						<LogOut size={16} />
						<span>Logout</span>
					</button>
				</div>
			</div>
		{:else}
			<a href="/auth/login" class="login-button">Login</a>
			<a href="/auth/register" class="register-button">Register</a>
		{/if}
	</div>
</nav>

<style>
	.navbar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 8px var(--padding-xl);
		border-bottom: 1px solid var(--color-neutral-100);
		background-color: var(--color-neutral-0);
	}

	.logo a {
		display: flex;
		align-items: center;
		gap: var(--gap-xs);
		color: var(--color-primary-400);
		font-weight: var(--font-medium);
		font-size: var(--text-xl);
	}

	.nav-left {
		display: flex;
		gap: var(--gap-lg);
		align-items: center;
	}

	.nav-links {
		display: flex;
		gap: var(--gap-lg);
		color: var(--color-neutral-400);

		a {
			color: var(--color-neutral-400);
		}
	}

	.nav-link {
		color: var(--color-neutral-400);
		font-weight: var(--font-medium);
	}

	.nav-link:hover {
		color: var(--color-primary-400);
	}

	.nav-auth {
		display: flex;
		align-items: center;
		gap: var(--gap-md);
	}

	.login-button {
		color: var(--color-primary-400);
		font-weight: var(--font-medium);
		padding: 8px 16px;
	}

	.register-button {
		padding: 8px 16px;
		background-color: var(--color-primary-400);
		color: white;
		border-radius: var(--radius-sm);
		font-weight: var(--font-medium);
	}

	.user-menu {
		position: relative;
	}
	.user-info {
		display: flex;
		align-items: center;
		gap: var(--gap-xs);
		padding: var(--padding-xs) var(--padding-sm);
		border-radius: var(--radius-sm);
		cursor: pointer;
	}

	.user-info:hover {
		background-color: var(--color-neutral-100);
	}

	.dropdown {
		position: absolute;
		top: 100%;
		right: 0;
		margin-top: var(--gap-xs);
		background-color: white;
		border: 1px solid var(--color-neutral-200);
		border-radius: var(--radius-sm);
		min-width: 180px;
		display: none;
		z-index: 10;
	}

	.dropdown-item {
		display: flex;
		align-items: center;
		gap: var(--gap-sm);
		padding: var(--padding-sm);
		color: var(--color-neutral-700);
	}

	.dropdown-item:hover {
		background-color: var(--color-neutral-50);
	}

	.logout {
		color: #e53935;
		border: none;
		background: none;
		width: 100%;
		text-align: left;
		cursor: pointer;
		font-size: inherit;
	}
	.user-menu .dropdown {
		display: none;
	}

	.user-menu.open .dropdown {
		display: block;
	}

	@media screen and (max-width: 580px) {
		.mobile-hide {
			display: none;
		}
	}
</style>
