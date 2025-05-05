<script>
	import '../styles/global.scss';
	import { invalidate } from '$app/navigation';
	import { setUserState } from '$lib/state/user-state.svelte';

	let { data, children } = $props();
	let { session, supabase, user } = $derived(data);

	let userState = setUserState({ session, supabase, user, profile: null });

	async function fetchProfile(userId) {
		const { data: profile, error } = await supabase
			.from('profiles')
			.select('*')
			.eq('id', userId)
			.single();

		if (error) {
			console.error('Error fetching profile:', error.message);
			return null;
		}

		return profile;
	}

	$effect(() => {
		userState.updateState({ session, supabase, user });

		// Also fetch profile if session is valid
		if (user?.id) {
			fetchProfile(user.id).then(profile => {
				if (profile) {
					userState.updateState({ profile });
				}
			});
		}
	});

	$effect(() => {
		const { data } = supabase.auth.onAuthStateChange(async (_, newSession) => {
			if (newSession?.expires_at !== session?.expires_at) {
				invalidate('supabase:auth');
			}

			const newUser = newSession?.user;
			if (newUser?.id) {
				const profile = await fetchProfile(newUser.id);
				userState.updateState({
					session: newSession,
					user: newUser,
					profile
				});
			}
		});

		return () => data.subscription.unsubscribe();
	});
</script>

{@render children()}
