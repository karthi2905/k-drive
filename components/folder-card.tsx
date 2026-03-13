"use client";

import { useState } from "react";
import { Folder, MoreVertical, Star, Trash2, Edit, Share2, LucideIcon } from "lucide-react";
import { cn, formatDate } from "@/lib/utils";
import { FolderData } from "@/types";

interface CustomAction {
    icon: LucideIcon;
    label: string;
    onClick: () => void;
}

interface FolderCardProps {
    folder: FolderData;
    viewMode: "grid" | "list";
    isSelected: boolean;
    onSelect: () => void;
    onOpen: () => void;
    onStar: () => void;
    onDelete: () => void;
    onRename: () => void;
    onShare: () => void;
    customActions?: CustomAction[];
}

export function FolderCard({
    folder,
    viewMode,
    isSelected,
    onSelect,
    onOpen,
    onStar,
    onDelete,
    onRename,
    onShare,
    customActions,
}: FolderCardProps) {
    const [showMenu, setShowMenu] = useState(false);

    if (viewMode === "list") {
        return (
            <div
                className={cn(
                    "flex items-center gap-4 px-4 py-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer border-2",
                    isSelected
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                        : "border-transparent"
                )}
                onClick={onOpen}
            >
                <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={(e) => {
                        e.stopPropagation();
                        onSelect();
                    }}
                    className="w-4 h-4 rounded border-gray-300"
                />
                <Folder className="w-5 h-5 text-blue-500" />
                <span className="flex-1 text-sm font-medium truncate">{folder.name}</span>
                <span className="text-xs text-gray-500">{formatDate(folder.updatedAt)}</span>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onStar();
                    }}
                    className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
                >
                    <Star
                        className={cn(
                            "w-4 h-4",
                            folder.isStarred ? "fill-yellow-400 text-yellow-400" : "text-gray-400"
                        )}
                    />
                </button>
                <MenuButton
                    onRename={onRename}
                    onShare={onShare}
                    onDelete={onDelete}
                    customActions={customActions}
                />
            </div>
        );
    }

    return (
        <div
            className={cn(
                "group relative p-4 rounded-xl border-2 hover:shadow-lg transition-all cursor-pointer bg-white dark:bg-gray-900",
                isSelected
                    ? "border-blue-500 shadow-md"
                    : "border-gray-200 dark:border-gray-700 hover:border-blue-300"
            )}
            onClick={onOpen}
        >
            {/* Selection Checkbox */}
            <input
                type="checkbox"
                checked={isSelected}
                onChange={(e) => {
                    e.stopPropagation();
                    onSelect();
                }}
                className="absolute top-3 left-3 w-4 h-4 rounded border-gray-300 opacity-0 group-hover:opacity-100 transition-opacity"
            />

            {/* Star Button */}
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    onStar();
                }}
                className="absolute top-3 right-3 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 opacity-0 group-hover:opacity-100 transition-opacity"
            >
                <Star
                    className={cn(
                        "w-4 h-4",
                        folder.isStarred ? "fill-yellow-400 text-yellow-400" : "text-gray-400"
                    )}
                />
            </button>

            {/* Folder Icon */}
            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-3 bg-blue-100 dark:bg-blue-900/30 rounded-2xl">
                <Folder className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>

            {/* Folder Name */}
            <h3 className="text-sm font-semibold text-center truncate mb-1">
                {folder.name}
            </h3>

            {/* Date */}
            <p className="text-xs text-gray-500 text-center">
                {formatDate(folder.updatedAt)}
            </p>

            {/* Menu */}
            <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <MenuButton
                    onRename={onRename}
                    onShare={onShare}
                    onDelete={onDelete}
                    customActions={customActions}
                />
            </div>
        </div>
    );
}

function MenuButton({
    onRename,
    onShare,
    onDelete,
    customActions,
}: {
    onRename: () => void;
    onShare: () => void;
    onDelete: () => void;
    customActions?: CustomAction[];
}) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative">
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    setIsOpen(!isOpen);
                }}
                className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
            >
                <MoreVertical className="w-4 h-4" />
            </button>

            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 z-10"
                        onClick={() => setIsOpen(false)}
                    />
                    <div className="absolute right-0 mt-1 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 py-1 z-20">
                        {customActions && customActions.length > 0 ? (
                            customActions.map((action, index) => (
                                <button
                                    key={index}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        action.onClick();
                                        setIsOpen(false);
                                    }}
                                    className="w-full flex items-center gap-3 px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                                >
                                    <action.icon className="w-4 h-4" />
                                    {action.label}
                                </button>
                            ))
                        ) : (
                            <>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onRename();
                                        setIsOpen(false);
                                    }}
                                    className="w-full flex items-center gap-3 px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                                >
                                    <Edit className="w-4 h-4" />
                                    Rename
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onShare();
                                        setIsOpen(false);
                                    }}
                                    className="w-full flex items-center gap-3 px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                                >
                                    <Share2 className="w-4 h-4" />
                                    Share
                                </button>
                            </>
                        )}
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onDelete();
                                setIsOpen(false);
                            }}
                            className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                        >
                            <Trash2 className="w-4 h-4" />
                            {customActions && customActions.length > 0 ? "Delete Forever" : "Delete"}
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}
