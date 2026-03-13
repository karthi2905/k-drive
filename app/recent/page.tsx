"use client";

import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/header";
import { FileCard } from "@/components/file-card";
import { useAppStore } from "@/store/useAppStore";
import { Clock, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import { getSession, getFiles, updateFile } from "@/lib/supabaseService";

export default function RecentPage() {
    const router = useRouter();
    const { viewMode, selectedItems, toggleItemSelection, setUser } = useAppStore();
    const [files, setFiles] = useState<any[]>([]);
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
        loadRecentFiles(session.userId);
    }, [router, setUser]);

    const loadRecentFiles = async (userId: string) => {
        try {
            const allFiles = await getFiles(userId);
            // Sort by updatedAt descending and take top 20
            const recent = allFiles
                .sort((a: any, b: any) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
                .slice(0, 20);
            setFiles(recent);
        } catch {
            toast.error("Failed to load recent files");
        } finally {
            setLoading(false);
        }
    };

    const handleStarFile = async (fileId: string) => {
        const file = files.find((f) => f.id === fileId);
        if (!file) return;
        await updateFile(fileId, { isStarred: !file.isStarred });
        if (currentUser) loadRecentFiles(currentUser.userId);
        toast.success(file.isStarred ? "Removed from starred" : "Added to starred");
    };

    const handleDeleteFile = async (fileId: string) => {
        await updateFile(fileId, { isTrashed: true });
        if (currentUser) loadRecentFiles(currentUser.userId);
        toast.success("Moved to trash");
    };

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
                <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-slate-50 dark:bg-slate-950">
            <Toaster position="top-right" />
            <Sidebar />

            <div className="flex-1 flex flex-col overflow-hidden">
                <Header onUploadClick={() => { }} onNewFolderClick={() => { }} />

                <main className="flex-1 overflow-y-auto p-8">
                    <h1 className="text-3xl font-bold mb-6 text-slate-900 dark:text-white">Recent</h1>

                    {files.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-96">
                            <Clock className="w-24 h-24 text-gray-300 dark:text-gray-700 mb-4" />
                            <h2 className="text-xl font-semibold text-gray-600 dark:text-gray-400">
                                No recent files
                            </h2>
                            <p className="text-gray-500 dark:text-gray-500 mt-2">
                                Files you upload will appear here
                            </p>
                        </div>
                    ) : (
                        <div className={viewMode === "grid" ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4" : "space-y-1"}>
                            {files.map((file) => (
                                <FileCard
                                    key={file.id}
                                    file={file}
                                    viewMode={viewMode}
                                    isSelected={selectedItems.includes(file.id)}
                                    onSelect={() => toggleItemSelection(file.id)}
                                    onPreview={() => window.open(file.url, "_blank")}
                                    onStar={() => handleStarFile(file.id)}
                                    onDelete={() => handleDeleteFile(file.id)}
                                    onDownload={() => {
                                        const a = document.createElement("a");
                                        a.href = file.url;
                                        a.download = file.name;
                                        a.click();
                                        toast.success(`Downloading ${file.name}`);
                                    }}
                                    onShare={() => toast.success("Share coming soon")}
                                />
                            ))}
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
