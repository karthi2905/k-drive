import { createClient } from "@supabase/supabase-js";

// Check if Supabase credentials are configured
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Create a real client if credentials exist, otherwise create a mock
export const supabase = (supabaseUrl && supabaseAnonKey)
    ? createClient(supabaseUrl, supabaseAnonKey)
    : createMockSupabaseClient();

// Mock Supabase client for demo mode
function createMockSupabaseClient() {
    const mockAuth = {
        signUp: async () => ({ data: { user: null, session: null }, error: null }),
        signInWithPassword: async () => ({ data: { user: null, session: null }, error: null }),
        signOut: async () => ({ error: null }),
        getSession: async () => ({ data: { session: null }, error: null }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => { } } } }),
    };

    const mockFrom = () => ({
        select: () => ({
            eq: () => ({
                eq: () => ({
                    order: () => ({ data: [], error: null }),
                }),
                order: () => ({ data: [], error: null }),
            }),
            order: () => ({ data: [], error: null }),
        }),
        insert: () => ({ data: null, error: null }),
        update: () => ({
            eq: () => ({ data: null, error: null }),
        }),
    });

    const mockStorage = {
        from: () => ({
            upload: async () => ({ data: null, error: null }),
            getPublicUrl: () => ({ data: { publicUrl: "" } }),
        }),
    };

    return {
        auth: mockAuth,
        from: mockFrom,
        storage: mockStorage,
    } as any;
}

// Database types
export type FileItem = {
    id: string;
    name: string;
    size: number;
    type: string;
    url: string;
    folder_id: string | null;
    user_id: string;
    is_starred: boolean;
    is_trashed: boolean;
    created_at: string;
    updated_at: string;
};

export type FolderItem = {
    id: string;
    name: string;
    parent_id: string | null;
    user_id: string;
    is_starred: boolean;
    is_trashed: boolean;
    created_at: string;
    updated_at: string;
};

export type SharedItem = {
    id: string;
    file_id: string | null;
    folder_id: string | null;
    shared_by: string;
    shared_with: string;
    permission: "view" | "edit";
    created_at: string;
};

// Helper to check if Supabase is configured
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);
