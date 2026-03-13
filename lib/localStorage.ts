// Local Storage Service - No external dependencies needed!

interface User {
    id: string;
    email: string;
    name: string;
    password: string;
}

interface FileData {
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
}

interface FolderData {
    id: string;
    name: string;
    parentId: string | null;
    userId: string;
    isStarred: boolean;
    isTrashed: boolean;
    createdAt: string;
    updatedAt: string;
}

class LocalStorageService {
    private USERS_KEY = "kdrive_users";
    private FILES_KEY = "kdrive_files";
    private FOLDERS_KEY = "kdrive_folders";
    private SESSION_KEY = "kdrive_session";

    // User Management
    getUsers(): User[] {
        if (typeof window === "undefined") return [];
        const users = localStorage.getItem(this.USERS_KEY);
        return users ? JSON.parse(users) : [];
    }

    saveUser(user: User) {
        const users = this.getUsers();
        users.push(user);
        localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
    }

    findUserByEmail(email: string): User | null {
        const users = this.getUsers();
        return users.find((u) => u.email === email) || null;
    }

    // Session Management
    setSession(userId: string, email: string, name: string) {
        const session = { userId, email, name, timestamp: Date.now() };
        localStorage.setItem(this.SESSION_KEY, JSON.stringify(session));
    }

    getSession() {
        if (typeof window === "undefined") return null;
        const session = localStorage.getItem(this.SESSION_KEY);
        return session ? JSON.parse(session) : null;
    }

    clearSession() {
        localStorage.removeItem(this.SESSION_KEY);
    }

    // Files Management
    getFiles(userId: string): FileData[] {
        if (typeof window === "undefined") return [];
        const files = localStorage.getItem(this.FILES_KEY);
        const allFiles: FileData[] = files ? JSON.parse(files) : [];
        return allFiles.filter((f) => f.userId === userId && !f.isTrashed);
    }

    saveFile(file: FileData) {
        const files = this.getAllFiles();
        files.push(file);
        localStorage.setItem(this.FILES_KEY, JSON.stringify(files));
    }

    updateFile(fileId: string, updates: Partial<FileData>) {
        const files = this.getAllFiles();
        const index = files.findIndex((f) => f.id === fileId);
        if (index !== -1) {
            files[index] = { ...files[index], ...updates, updatedAt: new Date().toISOString() };
            localStorage.setItem(this.FILES_KEY, JSON.stringify(files));
        }
    }

    private getAllFiles(): FileData[] {
        if (typeof window === "undefined") return [];
        const files = localStorage.getItem(this.FILES_KEY);
        return files ? JSON.parse(files) : [];
    }

    // Folders Management
    getFolders(userId: string): FolderData[] {
        if (typeof window === "undefined") return [];
        const folders = localStorage.getItem(this.FOLDERS_KEY);
        const allFolders: FolderData[] = folders ? JSON.parse(folders) : [];
        return allFolders.filter((f) => f.userId === userId && !f.isTrashed);
    }

    saveFolder(folder: FolderData) {
        const folders = this.getAllFolders();
        folders.push(folder);
        localStorage.setItem(this.FOLDERS_KEY, JSON.stringify(folders));
    }

    updateFolder(folderId: string, updates: Partial<FolderData>) {
        const folders = this.getAllFolders();
        const index = folders.findIndex((f) => f.id === folderId);
        if (index !== -1) {
            folders[index] = { ...folders[index], ...updates, updatedAt: new Date().toISOString() };
            localStorage.setItem(this.FOLDERS_KEY, JSON.stringify(folders));
        }
    }

    private getAllFolders(): FolderData[] {
        if (typeof window === "undefined") return [];
        const folders = localStorage.getItem(this.FOLDERS_KEY);
        return folders ? JSON.parse(folders) : [];
    }

    // Trash Management
    getTrashedFiles(userId: string): FileData[] {
        if (typeof window === "undefined") return [];
        const files = localStorage.getItem(this.FILES_KEY);
        const allFiles: FileData[] = files ? JSON.parse(files) : [];
        return allFiles.filter((f) => f.userId === userId && f.isTrashed);
    }

    getTrashedFolders(userId: string): FolderData[] {
        if (typeof window === "undefined") return [];
        const folders = localStorage.getItem(this.FOLDERS_KEY);
        const allFolders: FolderData[] = folders ? JSON.parse(folders) : [];
        return allFolders.filter((f) => f.userId === userId && f.isTrashed);
    }

    restoreFile(fileId: string) {
        this.updateFile(fileId, { isTrashed: false });
    }

    restoreFolder(folderId: string) {
        this.updateFolder(folderId, { isTrashed: false });
    }

    permanentlyDeleteFile(fileId: string) {
        const files = this.getAllFiles();
        const filtered = files.filter((f) => f.id !== fileId);
        localStorage.setItem(this.FILES_KEY, JSON.stringify(filtered));
    }

    permanentlyDeleteFolder(folderId: string) {
        const folders = this.getAllFolders();
        const filtered = folders.filter((f) => f.id !== folderId);
        localStorage.setItem(this.FOLDERS_KEY, JSON.stringify(filtered));
    }

    emptyTrash(userId: string) {
        // Remove all trashed files for this user
        const files = this.getAllFiles();
        const filteredFiles = files.filter((f) => !(f.userId === userId && f.isTrashed));
        localStorage.setItem(this.FILES_KEY, JSON.stringify(filteredFiles));

        // Remove all trashed folders for this user
        const folders = this.getAllFolders();
        const filteredFolders = folders.filter((f) => !(f.userId === userId && f.isTrashed));
        localStorage.setItem(this.FOLDERS_KEY, JSON.stringify(filteredFolders));
    }

    // Auto-cleanup trash items older than 30 days
    cleanupOldTrash() {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        // Clean files
        const files = this.getAllFiles();
        const filteredFiles = files.filter((f) => {
            if (!f.isTrashed) return true;
            const trashedDate = new Date(f.updatedAt);
            return trashedDate > thirtyDaysAgo;
        });
        localStorage.setItem(this.FILES_KEY, JSON.stringify(filteredFiles));

        // Clean folders
        const folders = this.getAllFolders();
        const filteredFolders = folders.filter((f) => {
            if (!f.isTrashed) return true;
            const trashedDate = new Date(f.updatedAt);
            return trashedDate > thirtyDaysAgo;
        });
        localStorage.setItem(this.FOLDERS_KEY, JSON.stringify(filteredFolders));
    }

    // Storage Calculation
    calculateStorageUsed(userId: string): { usedBytes: number; usedGB: number; totalGB: number; percentage: number } {
        const files = this.getAllFiles().filter((f) => f.userId === userId);

        let totalBytes = 0;
        files.forEach((file) => {
            totalBytes += file.size;
        });

        const usedGB = totalBytes / (1024 * 1024 * 1024); // Convert to GB
        const totalGB = 10; // 10 GB limit
        const percentage = (usedGB / totalGB) * 100;

        return {
            usedBytes: totalBytes,
            usedGB: parseFloat(usedGB.toFixed(2)),
            totalGB,
            percentage: parseFloat(percentage.toFixed(1)),
        };
    }
}

export const localStorageService = new LocalStorageService();
