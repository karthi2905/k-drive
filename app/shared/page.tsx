"use client";

import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/header";
import { useAppStore } from "@/store/useAppStore";
import { Users } from "lucide-react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getSession } from "@/lib/supabaseService";

export default function SharedPage() {
    const router = useRouter();
    const { setUser } = useAppStore();

    useEffect(() => {
        const session = getSession();
        if (!session) {
            router.push("/login");
            return;
        }
        setUser({ id: session.userId, email: session.email, name: session.name });
    }, [router, setUser]);

    return (
        <div className="flex h-screen bg-slate-50 dark:bg-slate-950">
            <Sidebar />

            <div className="flex-1 flex flex-col overflow-hidden">
                <Header onUploadClick={() => { }} onNewFolderClick={() => { }} />

                <main className="flex-1 overflow-y-auto p-8">
                    <h1 className="text-3xl font-bold mb-6 text-slate-900 dark:text-white">Shared with me</h1>

                    <div className="flex flex-col items-center justify-center h-96">
                        <Users className="w-24 h-24 text-gray-300 dark:text-gray-700 mb-4" />
                        <h2 className="text-xl font-semibold text-gray-600 dark:text-gray-400">
                            No shared files yet
                        </h2>
                        <p className="text-gray-500 dark:text-gray-500 mt-2">
                            Files shared with you will appear here
                        </p>
                    </div>
                </main>
            </div>
        </div>
    );
}
