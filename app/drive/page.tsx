"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
    getSession,
    getFolders,
    getFiles,
    saveFile,
    saveFolder,
    updateFolder,
    updateFile,
    uploadFileToStorage,
} from "@/lib/supabaseService";
import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/header";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { FileCard } from "@/components/file-card";
import { FolderCard } from "@/components/folder-card";
import { UploadModal } from "@/components/upload-modal";
import { NewFolderModal } from "@/components/new-folder-modal";
import { useAppStore } from "@/store/useAppStore";
import { FolderPlus, Upload, Loader2 } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

export default function DrivePage() {
    const router = useRouter();
    const { viewMode, selectedItems, toggleItemSelection, clearSelection, setUser } = useAppStore();
    const [folders, setFolders] = useState<any[]>([]);
    const [files, setFiles] = useState<any[]>([]);
    const [breadcrumbs, setBreadcrumbs] = useState<Array<{ id: string; name: string }>>([]);
    const [uploadModalOpen, setUploadModalOpen] = useState(false);
    const [newFolderModalOpen, setNewFolderModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState<any>(null);

    useEffect(() => {
        const session = getSession();
        if (!session) {
            router.push("/login");
            return;
        }
        setCurrentUser(session);
        setUser({ id: session.userId, email: session.email, name: session.name });
        loadUserData(session.userId);
    }, [router, setUser]);

    const loadUserData = async (userId: string) => {
        try {
            const [userFolders, userFiles] = await Promise.all([
                getFolders(userId),
                getFiles(userId),
            ]);
            setFolders(userFolders);
            setFiles(userFiles);
        } catch (err) {
            toast.error("Failed to load files");
        } finally {
            setLoading(false);
        }
    };

    const handleUpload = async (uploadedFiles: File[]) => {
        if (!currentUser) return;

        for (const file of uploadedFiles) {
            const toastId = toast.loading(`Uploading ${file.name}...`);
            try {
                // Try Supabase Storage first; fall back to base64 if bucket not ready
                let url = "";
                try {
                    url = await uploadFileToStorage(file, currentUser.userId);
                } catch {
                    // Fallback to base64 for small files
                    url = await new Promise<string>((resolve, reject) => {
                        const reader = new FileReader();
                        reader.onloadend = () => resolve(reader.result as string);
                        reader.onerror = reject;
                        reader.readAsDataURL(file);
                    });
                }

                const newFile = {
                    id: `file_${Date.now()}_${Math.random().toString(36).slice(2)}`,
                    name: file.name,
                    size: file.size,
                    type: file.type,
                    url,
                    folderId: null,
                    userId: currentUser.userId,
                    isStarred: false,
                    isTrashed: false,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                };

                await saveFile(newFile);
                await loadUserData(currentUser.userId);
                toast.success(`Uploaded ${file.name}`, { id: toastId });
            } catch (error) {
                toast.error(`Failed to upload ${file.name}`, { id: toastId });
            }
        }
    };

    const handleCreateFolder = async (name: string) => {
        if (!currentUser) return;
        const newFolder = {
            id: `folder_${Date.now()}`,
            name,
            parentId: null,
            userId: currentUser.userId,
            isStarred: false,
            isTrashed: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        await saveFolder(newFolder);
        await loadUserData(currentUser.userId);
        toast.success(`Created folder "${name}"`);
    };

    const handleFolderOpen = (folderId: string) => {
        const folder = folders.find((f) => f.id === folderId);
        if (folder) setBreadcrumbs((prev) => [...prev, { id: folder.id, name: folder.name }]);
    };

    const handleBreadcrumbNavigate = (folderId: string | null) => {
        if (folderId === null) {
            setBreadcrumbs([]);
        } else {
            const index = breadcrumbs.findIndex((b) => b.id === folderId);
            setBreadcrumbs((prev) => prev.slice(0, index + 1));
        }
    };

    const handleStarFolder = async (folderId: string) => {
        const folder = folders.find((f) => f.id === folderId);
        if (!folder) return;
        await updateFolder(folderId, { isStarred: !folder.isStarred });
        await loadUserData(currentUser.userId);
        toast.success(folder.isStarred ? "Removed from starred" : "Added to starred");
    };

    const handleDeleteFolder = async (folderId: string) => {
        await updateFolder(folderId, { isTrashed: true });
        await loadUserData(currentUser.userId);
        toast.success("Moved to trash");
    };

    const handleStarFile = async (fileId: string) => {
        const file = files.find((f) => f.id === fileId);
        if (!file) return;
        await updateFile(fileId, { isStarred: !file.isStarred });
        await loadUserData(currentUser.userId);
        toast.success(file.isStarred ? "Removed from starred" : "Added to starred");
    };

    const handleDeleteFile = async (fileId: string) => {
        await updateFile(fileId, { isTrashed: true });
        await loadUserData(currentUser.userId);
        toast.success("Moved to trash");
    };

    const handleDownloadFile = (fileId: string) => {
        const file = files.find((f) => f.id === fileId);
        if (file) {
            const link = document.createElement("a");
            link.href = file.url;
            link.download = file.name;
            link.click();
            toast.success(`Downloading ${file.name}`);
        }
    };

    const handlePreviewFile = (fileId: string) => {
        const file = files.find((f) => f.id === fileId);
        if (file) window.open(file.url, "_blank");
    };

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
                    <p className="text-slate-600 dark:text-slate-400">Loading your drive...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-slate-50 dark:bg-slate-950">
            <Toaster position="top-right" />
            <Sidebar />

            <div className="flex-1 flex flex-col overflow-hidden">
                <Header
                    onUploadClick={() => setUploadModalOpen(true)}
                    onNewFolderClick={() => setNewFolderModalOpen(true)}
                />

                <main className="flex-1 overflow-y-auto p-8">
                    <Breadcrumbs items={breadcrumbs} onNavigate={handleBreadcrumbNavigate} />

                    {folders.length === 0 && files.length === 0 && (
                        <div className="flex flex-col items-center justify-center h-96 animate-in">
                            <div className="w-32 h-32 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mb-6">
                                <FolderPlus className="w-16 h-16 text-blue-600 dark:text-blue-400" />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                                Your drive is empty
                            </h2>
                            <p className="text-slate-600 dark:text-slate-400 mb-6">
                                Upload files or create folders to get started
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setNewFolderModalOpen(true)}
                                    className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 rounded-xl hover:border-blue-500 transition-colors"
                                >
                                    <FolderPlus className="w-5 h-5" />
                                    New Folder
                                </button>
                                <button
                                    onClick={() => setUploadModalOpen(true)}
                                    className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
                                >
                                    <Upload className="w-5 h-5" />
                                    Upload Files
                                </button>
                            </div>
                        </div>
                    )}

                    {folders.length > 0 && (
                        <div className="mb-8 animate-in">
                            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Folders</h2>
                            <div className={viewMode === "grid" ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4" : "space-y-1"}>
                                {folders.map((folder) => (
                                    <FolderCard
                                        key={folder.id}
                                        folder={folder}
                                        viewMode={viewMode}
                                        isSelected={selectedItems.includes(folder.id)}
                                        onSelect={() => toggleItemSelection(folder.id)}
                                        onOpen={() => handleFolderOpen(folder.id)}
                                        onStar={() => handleStarFolder(folder.id)}
                                        onDelete={() => handleDeleteFolder(folder.id)}
                                        onRename={() => toast.success("Rename coming soon!")}
                                        onShare={() => toast.success("Share coming soon!")}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {files.length > 0 && (
                        <div className="animate-in">
                            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Files</h2>
                            <div className={viewMode === "grid" ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4" : "space-y-1"}>
                                {files.map((file) => (
                                    <FileCard
                                        key={file.id}
                                        file={file}
                                        viewMode={viewMode}
                                        isSelected={selectedItems.includes(file.id)}
                                        onSelect={() => toggleItemSelection(file.id)}
                                        onPreview={() => handlePreviewFile(file.id)}
                                        onStar={() => handleStarFile(file.id)}
                                        onDelete={() => handleDeleteFile(file.id)}
                                        onDownload={() => handleDownloadFile(file.id)}
                                        onShare={() => toast.success("Share coming soon!")}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </main>
            </div>

            <UploadModal isOpen={uploadModalOpen} onClose={() => setUploadModalOpen(false)} onUpload={handleUpload} />
            <NewFolderModal isOpen={newFolderModalOpen} onClose={() => setNewFolderModalOpen(false)} onCreate={handleCreateFolder} />
        </div>
    );
}
