"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
    Home,
    Users,
    Clock,
    Star,
    Trash2,
    HardDrive,
    Settings,
    LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getSession, clearSession, getFiles } from "@/lib/supabaseService";
import toast from "react-hot-toast";

const navigation = [
    { name: "My Drive", href: "/drive", icon: Home },
    { name: "Shared with me", href: "/shared", icon: Users },
    { name: "Recent", href: "/recent", icon: Clock },
    { name: "Starred", href: "/starred", icon: Star },
    { name: "Trash", href: "/trash", icon: Trash2 },
];

export function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const [storageInfo, setStorageInfo] = useState({ usedGB: 0, totalGB: 10, percentage: 0 });

    const handleLogout = () => {
        clearSession();
        toast.success("Logged out successfully");
        router.push("/login");
    };

    // Calculate real storage from Supabase on mount and pathname change
    useEffect(() => {
        const session = getSession();
        if (!session) return;

        getFiles(session.userId)
            .then((files) => {
                const usedBytes = files.reduce((acc: number, f: any) => acc + (f.size || 0), 0);
                const usedGB = parseFloat((usedBytes / (1024 ** 3)).toFixed(3));
                const totalGB = 1; // Supabase free tier: 1GB storage
                const percentage = parseFloat(((usedGB / totalGB) * 100).toFixed(1));
                setStorageInfo({ usedGB, totalGB, percentage });
            })
            .catch(() => { });
    }, [pathname]);

    return (
        <aside className="w-64 h-screen bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col">
            {/* Logo */}
            <div className="p-6 border-b border-slate-200 dark:border-slate-800">
                <Link href="/drive" className="flex items-center gap-3 group">
                    <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-md">
                        <HardDrive className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-2xl font-bold text-slate-900 dark:text-white">
                        K-Drive
                    </span>
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 py-4 space-y-1">
                {navigation.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                                isActive
                                    ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                                    : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                            )}
                        >
                            <item.icon className="w-5 h-5" />
                            {item.name}
                        </Link>
                    );
                })}
            </nav>

            {/* Storage Info */}
            <div className="p-4 m-3 bg-slate-100 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-2 mb-2">
                    <HardDrive className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                    <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                        Storage
                    </span>
                </div>
                <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden mb-2">
                    <div
                        className="h-full bg-blue-600 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min(storageInfo.percentage, 100)}%` }}
                    />
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                    {storageInfo.usedGB} GB of {storageInfo.totalGB} GB used
                </p>
            </div>

            {/* Settings & Logout */}
            <div className="p-3 border-t border-slate-200 dark:border-slate-800 space-y-1">
                <Link
                    href="/settings"
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                    <Settings className="w-5 h-5" />
                    Settings
                </Link>
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                >
                    <LogOut className="w-5 h-5" />
                    Logout
                </button>
            </div>
        </aside>
    );
}
