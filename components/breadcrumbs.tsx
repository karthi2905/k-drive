"use client";

import { ChevronRight, Home } from "lucide-react";
import { BreadcrumbItem } from "@/types";

interface BreadcrumbsProps {
    items: BreadcrumbItem[];
    onNavigate: (id: string | null) => void;
}

export function Breadcrumbs({ items, onNavigate }: BreadcrumbsProps) {
    return (
        <div className="flex items-center gap-2 text-sm mb-6">
            <button
                onClick={() => onNavigate(null)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
                <Home className="w-4 h-4" />
                <span className="font-medium">My Drive</span>
            </button>

            {items.map((item, index) => (
                <div key={item.id} className="flex items-center gap-2">
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                    <button
                        onClick={() => onNavigate(item.id)}
                        className={`px-3 py-1.5 rounded-lg transition-colors ${index === items.length - 1
                                ? "font-semibold text-blue-600 dark:text-blue-400"
                                : "hover:bg-gray-100 dark:hover:bg-gray-800"
                            }`}
                    >
                        {item.name}
                    </button>
                </div>
            ))}
        </div>
    );
}
