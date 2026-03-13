"use client";

import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/header";
import { FileCard } from "@/components/file-card";
import { FolderCard } from "@/components/folder-card";
import { useAppStore } from "@/store/useAppStore";
import { Star, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import {
    getSession,
    getStarredFiles,
    getStarredFolders,
    updateFile,
    updateFolder,
} from "@/lib/supabaseService";

export default function StarredPage() {
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
        loadStarred(session.userId);
    }, [router, setUser]);

    const loadStarred = async (userId: string) => {
        try {
            const [starredFiles, starredFolders] = await Promise.all([
                getStarredFiles(userId),
                getStarredFolders(userId),
            ]);
            setFiles(starredFiles);
            setFolders(starredFolders);
        } catch {
            toast.error("Failed to load starred items");
        } finally {
            setLoading(false);
        }
    };

    const handleUnstarFile = async (fileId: string) => {
        await updateFile(fileId, { isStarred: false });
        if (currentUser) loadStarred(currentUser.userId);
        toast.success("Removed from starred");
    };

    const handleUnstarFolder = async (folderId: string) => {
        await updateFolder(folderId, { isStarred: false });
        if (currentUser) loadStarred(currentUser.userId);
        toast.success("Removed from starred");
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
                    <h1 className="text-3xl font-bold mb-6 text-slate-900 dark:text-white">Starred</h1>

                    {totalItems === 0 ? (
                        <div className="flex flex-col items-center justify-center h-96">
                            <Star className="w-24 h-24 text-gray-300 dark:text-gray-700 mb-4" />
                            <h2 className="text-xl font-semibold text-gray-600 dark:text-gray-400">
                                No starred items yet
                            </h2>
                            <p className="text-gray-500 dark:text-gray-500 mt-2">
                                Star important files and folders for quick access
                            </p>
                        </div>
                    ) : (
                        <>
                            {folders.length > 0 && (
                                <div className="mb-8">
                                    <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Folders</h2>
                                    <div className={viewMode === "grid" ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4" : "space-y-1"}>
                                        {folders.map((folder) => (
                                            <FolderCard
                                                key={folder.id}
                                                folder={folder}
                                                viewMode={viewMode}
                                                isSelected={selectedItems.includes(folder.id)}
                                                onSelect={() => toggleItemSelection(folder.id)}
                                                onOpen={() => router.push("/drive")}
                                                onStar={() => handleUnstarFolder(folder.id)}
                                                onDelete={() => toast.success("Go to Drive to delete")}
                                                onRename={() => { }}
                                                onShare={() => { }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {files.length > 0 && (
                                <div>
                                    <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Files</h2>
                                    <div className={viewMode === "grid" ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4" : "space-y-1"}>
                                        {files.map((file) => (
                                            <FileCard
                                                key={file.id}
                                                file={file}
                                                viewMode={viewMode}
                                                isSelected={selectedItems.includes(file.id)}
                                                onSelect={() => toggleItemSelection(file.id)}
                                                onPreview={() => window.open(file.url, "_blank")}
                                                onStar={() => handleUnstarFile(file.id)}
                                                onDelete={() => toast.success("Go to Drive to delete")}
                                                onDownload={() => {
                                                    const a = document.createElement("a");
                                                    a.href = file.url;
                                                    a.download = file.name;
                                                    a.click();
                                                }}
                                                onShare={() => toast.success("Share coming soon")}
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
