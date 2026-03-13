import { create } from "zustand";
import { User, ViewMode, SortBy, SortOrder } from "@/types";

interface AppState {
    user: User | null;
    viewMode: ViewMode;
    sortBy: SortBy;
    sortOrder: SortOrder;
    currentFolderId: string | null;
    selectedItems: string[];
    searchQuery: string;

    setUser: (user: User | null) => void;
    setViewMode: (mode: ViewMode) => void;
    setSortBy: (sortBy: SortBy) => void;
    setSortOrder: (order: SortOrder) => void;
    setCurrentFolderId: (id: string | null) => void;
    setSelectedItems: (items: string[]) => void;
    toggleItemSelection: (id: string) => void;
    clearSelection: () => void;
    setSearchQuery: (query: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
    user: null,
    viewMode: "grid",
    sortBy: "name",
    sortOrder: "asc",
    currentFolderId: null,
    selectedItems: [],
    searchQuery: "",

    setUser: (user) => set({ user }),
    setViewMode: (viewMode) => set({ viewMode }),
    setSortBy: (sortBy) => set({ sortBy }),
    setSortOrder: (sortOrder) => set({ sortOrder }),
    setCurrentFolderId: (currentFolderId) => set({ currentFolderId }),
    setSelectedItems: (selectedItems) => set({ selectedItems }),
    toggleItemSelection: (id) =>
        set((state) => ({
            selectedItems: state.selectedItems.includes(id)
                ? state.selectedItems.filter((item) => item !== id)
                : [...state.selectedItems, id],
        })),
    clearSelection: () => set({ selectedItems: [] }),
    setSearchQuery: (searchQuery) => set({ searchQuery }),
}));
