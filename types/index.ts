export type ViewMode = "grid" | "list";

export type SortBy = "name" | "date" | "size" | "type";

export type SortOrder = "asc" | "desc";

export interface User {
    id: string;
    email: string;
    name?: string;
    avatar?: string;
}

export interface FileData {
    id: string;
    name: string;
    size: number;
    type: string;
    url: string;
    folderId: string | null;
    userId: string;
    isStarred: boolean;
    isTrashed: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface FolderData {
    id: string;
    name: string;
    parentId: string | null;
    userId: string;
    isStarred: boolean;
    isTrashed: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface BreadcrumbItem {
    id: string;
    name: string;
}
