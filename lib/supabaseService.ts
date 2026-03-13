// Supabase Service - Cloud Storage Backend
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ─── Session (stored in localStorage, data in Supabase) ───────────────────────

const SESSION_KEY = "kdrive_session";

export function setSession(userId: string, email: string, name: string) {
    const session = { userId, email, name, timestamp: Date.now() };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function getSession(): { userId: string; email: string; name: string } | null {
    if (typeof window === "undefined") return null;
    const s = localStorage.getItem(SESSION_KEY);
    return s ? JSON.parse(s) : null;
}

export function clearSession() {
    localStorage.removeItem(SESSION_KEY);
}

// ─── Users ────────────────────────────────────────────────────────────────────

export async function findUserByEmail(email: string) {
    const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("email", email)
        .single();
    if (error) return null;
    return data;
}

export async function saveUser(user: {
    id: string;
    email: string;
    name: string;
    password: string;
}) {
    const { error } = await supabase.from("users").insert(user);
    if (error) throw new Error(error.message);
}

// ─── Folders ──────────────────────────────────────────────────────────────────

export async function getFolders(userId: string) {
    const { data, error } = await supabase
        .from("folders")
        .select("*")
        .eq("user_id", userId)
        .eq("is_trashed", false)
        .order("created_at", { ascending: true });
    if (error) throw new Error(error.message);
    // Normalise snake_case → camelCase to match existing component props
    return (data ?? []).map(normalizeFolder);
}

export async function saveFolder(folder: {
    id: string;
    name: string;
    parentId: string | null;
    userId: string;
    isStarred: boolean;
    isTrashed: boolean;
    createdAt: string;
    updatedAt: string;
}) {
    const { error } = await supabase.from("folders").insert({
        id: folder.id,
        name: folder.name,
        parent_id: folder.parentId,
        user_id: folder.userId,
        is_starred: folder.isStarred,
        is_trashed: folder.isTrashed,
        created_at: folder.createdAt,
        updated_at: folder.updatedAt,
    });
    if (error) throw new Error(error.message);
}

export async function updateFolder(folderId: string, updates: Record<string, any>) {
    const dbUpdates: Record<string, any> = { updated_at: new Date().toISOString() };
    if ("isStarred" in updates) dbUpdates.is_starred = updates.isStarred;
    if ("isTrashed" in updates) dbUpdates.is_trashed = updates.isTrashed;
    if ("name" in updates) dbUpdates.name = updates.name;

    const { error } = await supabase
        .from("folders")
        .update(dbUpdates)
        .eq("id", folderId);
    if (error) throw new Error(error.message);
}

export async function permanentlyDeleteFolder(folderId: string) {
    const { error } = await supabase.from("folders").delete().eq("id", folderId);
    if (error) throw new Error(error.message);
}

export async function getTrashedFolders(userId: string) {
    const { data, error } = await supabase
        .from("folders")
        .select("*")
        .eq("user_id", userId)
        .eq("is_trashed", true)
        .order("updated_at", { ascending: false });
    if (error) throw new Error(error.message);
    return (data ?? []).map(normalizeFolder);
}

// ─── Files ────────────────────────────────────────────────────────────────────

export async function getFiles(userId: string) {
    const { data, error } = await supabase
        .from("files")
        .select("*")
        .eq("user_id", userId)
        .eq("is_trashed", false)
        .order("created_at", { ascending: true });
    if (error) throw new Error(error.message);
    return (data ?? []).map(normalizeFile);
}

export async function saveFile(file: {
    id: string;
    name: string;
    size: number;
    type: string;
    url: string;
    folderId: string | null;
    userId: string;
    isStarred: boolean;
    isTrashed: boolean;
    createdAt: string;
    updatedAt: string;
}) {
    const { error } = await supabase.from("files").insert({
        id: file.id,
        name: file.name,
        size: file.size,
        type: file.type,
        url: file.url,
        folder_id: file.folderId,
        user_id: file.userId,
        is_starred: file.isStarred,
        is_trashed: file.isTrashed,
        created_at: file.createdAt,
        updated_at: file.updatedAt,
    });
    if (error) throw new Error(error.message);
}

export async function updateFile(fileId: string, updates: Record<string, any>) {
    const dbUpdates: Record<string, any> = { updated_at: new Date().toISOString() };
    if ("isStarred" in updates) dbUpdates.is_starred = updates.isStarred;
    if ("isTrashed" in updates) dbUpdates.is_trashed = updates.isTrashed;
    if ("name" in updates) dbUpdates.name = updates.name;

    const { error } = await supabase
        .from("files")
        .update(dbUpdates)
        .eq("id", fileId);
    if (error) throw new Error(error.message);
}

export async function permanentlyDeleteFile(fileId: string) {
    const { error } = await supabase.from("files").delete().eq("id", fileId);
    if (error) throw new Error(error.message);
}

export async function getTrashedFiles(userId: string) {
    const { data, error } = await supabase
        .from("files")
        .select("*")
        .eq("user_id", userId)
        .eq("is_trashed", true)
        .order("updated_at", { ascending: false });
    if (error) throw new Error(error.message);
    return (data ?? []).map(normalizeFile);
}

export async function getStarredFiles(userId: string) {
    const { data, error } = await supabase
        .from("files")
        .select("*")
        .eq("user_id", userId)
        .eq("is_starred", true)
        .eq("is_trashed", false)
        .order("updated_at", { ascending: false });
    if (error) throw new Error(error.message);
    return (data ?? []).map(normalizeFile);
}

export async function getStarredFolders(userId: string) {
    const { data, error } = await supabase
        .from("folders")
        .select("*")
        .eq("user_id", userId)
        .eq("is_starred", true)
        .eq("is_trashed", false)
        .order("updated_at", { ascending: false });
    if (error) throw new Error(error.message);
    return (data ?? []).map(normalizeFolder);
}

export async function emptyTrash(userId: string) {
    await supabase.from("files").delete().eq("user_id", userId).eq("is_trashed", true);
    await supabase.from("folders").delete().eq("user_id", userId).eq("is_trashed", true);
}

// ─── Storage (real file uploads) ──────────────────────────────────────────────

export async function uploadFileToStorage(file: File, userId: string): Promise<string> {
    const ext = file.name.split(".").pop();
    const path = `${userId}/${Date.now()}_${file.name}`;
    const { data, error } = await supabase.storage
        .from("drive-files")
        .upload(path, file, { upsert: false });
    if (error) throw new Error(error.message);

    // Return a signed URL valid for 1 year
    const { data: urlData } = await supabase.storage
        .from("drive-files")
        .createSignedUrl(data.path, 60 * 60 * 24 * 365);
    return urlData?.signedUrl ?? "";
}

// ─── Normalizers ──────────────────────────────────────────────────────────────

function normalizeFolder(row: any) {
    return {
        id: row.id,
        name: row.name,
        parentId: row.parent_id,
        userId: row.user_id,
        isStarred: row.is_starred,
        isTrashed: row.is_trashed,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
    };
}

function normalizeFile(row: any) {
    return {
        id: row.id,
        name: row.name,
        size: row.size,
        type: row.type,
        url: row.url,
        folderId: row.folder_id,
        userId: row.user_id,
        isStarred: row.is_starred,
        isTrashed: row.is_trashed,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
    };
}
