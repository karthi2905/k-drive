"use client";

import { useState } from "react";
import { File, MoreVertical, Star, Trash2, Download, Share2, Eye, LucideIcon } from "lucide-react";
import { cn, formatDate, formatBytes, getFileIcon } from "@/lib/utils";
import { FileData } from "@/types";

interface CustomAction {
    icon: LucideIcon;
    label: string;
    onClick: () => void;
}

interface FileCardProps {
    file: FileData;
    viewMode: "grid" | "list";
    isSelected: boolean;
    onSelect: () => void;
    onPreview: () => void;
    onStar: () => void;
    onDelete: () => void;
    onDownload: () => void;
    onShare: () => void;
    customActions?: CustomAction[];
}

export function FileCard({
    file,
    viewMode,
    isSelected,
    onSelect,
    onPreview,
    onStar,
    onDelete,
    onDownload,
    onShare,
    customActions,
}: FileCardProps) {
    if (viewMode === "list") {
        return (
            <div
                className={cn(
                    "flex items-center gap-4 px-4 py-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer border-2",
                    isSelected
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                        : "border-transparent"
                )}
                onClick={onPreview}
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
                <span className="text-2xl">{getFileIcon(file.name)}</span>
                <span className="flex-1 text-sm font-medium truncate">{file.name}</span>
                <span className="text-xs text-gray-500 w-20">{formatBytes(file.size)}</span>
                <span className="text-xs text-gray-500 w-32">{formatDate(file.updatedAt)}</span>
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
                            file.isStarred ? "fill-yellow-400 text-yellow-400" : "text-gray-400"
                        )}
                    />
                </button>
                <MenuButton
                    onPreview={onPreview}
                    onDownload={onDownload}
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
            onClick={onPreview}
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
                        file.isStarred ? "fill-yellow-400 text-yellow-400" : "text-gray-400"
                    )}
                />
            </button>

            {/* File Preview */}
            <div className="flex items-center justify-center w-full h-32 mb-3 bg-slate-100 dark:bg-slate-800 rounded-xl overflow-hidden">
                {file.type.startsWith("image/") ? (
                    <img
                        src={file.url}
                        alt={file.name}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <span className="text-5xl">{getFileIcon(file.name)}</span>
                )}
            </div>

            {/* File Name */}
            <h3 className="text-sm font-semibold truncate mb-1">{file.name}</h3>

            {/* File Info */}
            <div className="flex items-center justify-between text-xs text-gray-500">
                <span>{formatBytes(file.size)}</span>
                <span>{formatDate(file.updatedAt)}</span>
            </div>

            {/* Menu */}
            <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <MenuButton
                    onPreview={onPreview}
                    onDownload={onDownload}
                    onShare={onShare}
                    onDelete={onDelete}
                    customActions={customActions}
                />
            </div>
        </div>
    );
}

function MenuButton({
    onPreview,
    onDownload,
    onShare,
    onDelete,
    customActions,
}: {
    onPreview: () => void;
    onDownload: () => void;
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
                                        onPreview();
                                        setIsOpen(false);
                                    }}
                                    className="w-full flex items-center gap-3 px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                                >
                                    <Eye className="w-4 h-4" />
                                    Preview
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onDownload();
                                        setIsOpen(false);
                                    }}
                                    className="w-full flex items-center gap-3 px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                                >
                                    <Download className="w-4 h-4" />
                                    Download
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
