"use client";

import { Search, Grid3x3, List, Upload, FolderPlus, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAppStore } from "@/store/useAppStore";
import { useState } from "react";

interface HeaderProps {
    onUploadClick: () => void;
    onNewFolderClick: () => void;
}

export function Header({ onUploadClick, onNewFolderClick }: HeaderProps) {
    const { viewMode, setViewMode, searchQuery, setSearchQuery } = useAppStore();
    const [localSearch, setLocalSearch] = useState(searchQuery);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setSearchQuery(localSearch);
    };

    return (
        <header className="h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 flex items-center justify-between sticky top-0 z-40">
            {/* Search */}
            <form onSubmit={handleSearch} className="flex-1 max-w-2xl">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                        type="text"
                        placeholder="Search in K-Drive..."
                        value={localSearch}
                        onChange={(e) => setLocalSearch(e.target.value)}
                        className="pl-10 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                    />
                </div>
            </form>

            {/* Actions */}
            <div className="flex items-center gap-3 ml-6">
                {/* View Toggle */}
                <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                    <button
                        onClick={() => setViewMode("grid")}
                        className={cn(
                            "p-2 rounded-md transition-all",
                            viewMode === "grid"
                                ? "bg-white dark:bg-gray-700 shadow-sm"
                                : "hover:bg-gray-200 dark:hover:bg-gray-700"
                        )}
                    >
                        <Grid3x3 className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => setViewMode("list")}
                        className={cn(
                            "p-2 rounded-md transition-all",
                            viewMode === "list"
                                ? "bg-white dark:bg-gray-700 shadow-sm"
                                : "hover:bg-gray-200 dark:hover:bg-gray-700"
                        )}
                    >
                        <List className="w-4 h-4" />
                    </button>
                </div>

                {/* New Folder */}
                <Button variant="outline" size="default" onClick={onNewFolderClick}>
                    <FolderPlus className="w-4 h-4" />
                    New Folder
                </Button>

                {/* Upload */}
                <Button variant="default" size="default" onClick={onUploadClick}>
                    <Upload className="w-4 h-4" />
                    Upload
                </Button>

                {/* User Profile */}
                <button className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold shadow-md hover:bg-blue-700 transition-colors">
                    <User className="w-5 h-5" />
                </button>
            </div>
        </header>
    );
}

function cn(...classes: (string | boolean | undefined)[]) {
    return classes.filter(Boolean).join(" ");
}
