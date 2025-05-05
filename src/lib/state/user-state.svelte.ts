import type { Database } from "$types/database.types";
import type { Session, SupabaseClient, User } from "@supabase/supabase-js";
import type { Tables } from "$types/database.types"; // Ensure this has `profiles`

import { getContext, setContext } from "svelte";

interface UserStateProps {
    session: Session | null;
    supabase: SupabaseClient | null;
    user: User | null;
    profile?: Tables<'profiles'> | null; // Add profile type
}

export class UserState {
    session = $state<Session | null>(null);
    supabase = $state<SupabaseClient<Database> | null>(null);
    user = $state<User | null>(null);
    profile = $state<Tables<'profiles'> | null>(null); // <-- new

    constructor(data: UserStateProps) {
        this.updateState(data);
    }

    updateState(data: Partial<UserStateProps>) {
        if ('session' in data) this.session = data.session ?? null;
        if ('supabase' in data) this.supabase = data.supabase ?? null;
        if ('user' in data) this.user = data.user ?? null;
        if ('profile' in data) this.profile = data.profile ?? null;
    }

    async logout() {
        await this.supabase?.auth.signOut();
    }
}

const USER_STATE_KEY = Symbol("USER_STATE");

export function setUserState(data: UserStateProps) {
    const state = new UserState(data);
    setContext(USER_STATE_KEY, state);
    return state;
}

export function getUserState() {
    return getContext<UserState>(USER_STATE_KEY);
}
