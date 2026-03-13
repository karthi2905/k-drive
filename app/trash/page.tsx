"use client";

import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/header";
import { FileCard } from "@/components/file-card";
import { FolderCard } from "@/components/folder-card";
import { useAppStore } from "@/store/useAppStore";
import { Trash2, RotateCcw, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import {
    getSession,
    getTrashedFiles,
    getTrashedFolders,
    updateFile,
    updateFolder,
    permanentlyDeleteFile,
    permanentlyDeleteFolder,
    emptyTrash,
} from "@/lib/supabaseService";

export default function TrashPage() {
    const router = useRouter();
    const { viewMode, selectedItems, toggleItemSelection, setUser } = useAppStore();
    const [files, setFiles] = useState<any[]>([]);
    const [folders, setFolders] = useState<any[]>([]);
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
        loadTrashedItems(session.userId);
    }, [router, setUser]);

    const loadTrashedItems = async (userId: string) => {
        try {
            const [trashedFiles, trashedFolders] = await Promise.all([
                getTrashedFiles(userId),
                getTrashedFolders(userId),
            ]);
            setFiles(trashedFiles);
            setFolders(trashedFolders);
        } catch {
            toast.error("Failed to load trash");
        } finally {
            setLoading(false);
        }
    };

    const handleRestoreFile = async (fileId: string) => {
        await updateFile(fileId, { isTrashed: false });
        if (currentUser) loadTrashedItems(currentUser.userId);
        toast.success("File restored");
    };

    const handleRestoreFolder = async (folderId: string) => {
        await updateFolder(folderId, { isTrashed: false });
        if (currentUser) loadTrashedItems(currentUser.userId);
        toast.success("Folder restored");
    };

    const handlePermanentDeleteFile = async (fileId: string) => {
        if (confirm("Are you sure? This action cannot be undone.")) {
            await permanentlyDeleteFile(fileId);
            if (currentUser) loadTrashedItems(currentUser.userId);
            toast.success("File permanently deleted");
        }
    };

    const handlePermanentDeleteFolder = async (folderId: string) => {
        if (confirm("Are you sure? This action cannot be undone.")) {
            await permanentlyDeleteFolder(folderId);
            if (currentUser) loadTrashedItems(currentUser.userId);
            toast.success("Folder permanently deleted");
        }
    };

    const handleEmptyTrash = async () => {
        if (confirm("Empty trash? All items will be permanently deleted. This cannot be undone.")) {
            if (currentUser) {
                await emptyTrash(currentUser.userId);
                loadTrashedItems(currentUser.userId);
                toast.success("Trash emptied");
            }
        }
    };

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
                <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
            </div>
        );
    }

    const totalItems = files.length + folders.length;

    return (
        <div className="flex h-screen bg-slate-50 dark:bg-slate-950">
            <Toaster position="top-right" />
            <Sidebar />

            <div className="flex-1 flex flex-col overflow-hidden">
                <Header onUploadClick={() => { }} onNewFolderClick={() => { }} />

                <main className="flex-1 overflow-y-auto p-8">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Trash</h1>
                            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                                Items in trash will be automatically deleted after 30 days
                            </p>
                        </div>
                        {totalItems > 0 && (
                            <Button variant="destructive" onClick={handleEmptyTrash}>
                                <Trash2 className="w-4 h-4 mr-2" />
                                Empty Trash
                            </Button>
                        )}
                    </div>

                    {totalItems === 0 ? (
                        <div className="flex flex-col items-center justify-center h-96">
                            <Trash2 className="w-24 h-24 text-gray-300 dark:text-gray-700 mb-4" />
                            <h2 className="text-xl font-semibold text-gray-600 dark:text-gray-400">
                                Trash is empty
                            </h2>
                            <p className="text-gray-500 dark:text-gray-500 mt-2">
                                Items you delete will appear here
                            </p>
                        </div>
                    ) : (
                        <>
                            {folders.length > 0 && (
                                <div className="mb-8">
                                    <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                                        Folders ({folders.length})
                                    </h2>
                                    <div className={viewMode === "grid" ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4" : "space-y-1"}>
                                        {folders.map((folder) => (
                                            <FolderCard
                                                key={folder.id}
                                                folder={folder}
                                                viewMode={viewMode}
                                                isSelected={selectedItems.includes(folder.id)}
                                                onSelect={() => toggleItemSelection(folder.id)}
                                                onOpen={() => { }}
                                                onStar={() => { }}
                                                onDelete={() => handlePermanentDeleteFolder(folder.id)}
                                                onRename={() => { }}
                                                onShare={() => { }}
                                                customActions={[
                                                    {
                                                        icon: RotateCcw,
                                                        label: "Restore",
                                                        onClick: () => handleRestoreFolder(folder.id),
                                                    },
                                                ]}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {files.length > 0 && (
                                <div>
                                    <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                                        Files ({files.length})
                                    </h2>
                                    <div className={viewMode === "grid" ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4" : "space-y-1"}>
                                        {files.map((file) => (
                                            <FileCard
                                                key={file.id}
                                                file={file}
                                                viewMode={viewMode}
                                                isSelected={selectedItems.includes(file.id)}
                                                onSelect={() => toggleItemSelection(file.id)}
                                                onPreview={() => { }}
                                                onStar={() => { }}
                                                onDelete={() => handlePermanentDeleteFile(file.id)}
                                                onDownload={() => handleRestoreFile(file.id)}
                                                onShare={() => { }}
                                                customActions={[
                                                    {
                                                        icon: RotateCcw,
                                                        label: "Restore",
                                                        onClick: () => handleRestoreFile(file.id),
                                                    },
                                                ]}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </main>
            </div>
        </div>
    );
}
