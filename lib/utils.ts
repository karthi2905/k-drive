import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatBytes(bytes: number, decimals = 2) {
    if (bytes === 0) return "0 Bytes";

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

export function getFileIcon(fileName: string) {
    const extension = fileName.split(".").pop()?.toLowerCase();

    const iconMap: Record<string, string> = {
        // Images
        jpg: "🖼️",
        jpeg: "🖼️",
        png: "🖼️",
        gif: "🖼️",
        svg: "🖼️",
        webp: "🖼️",

        // Documents
        pdf: "📄",
        doc: "📝",
        docx: "📝",
        txt: "📝",

        // Spreadsheets
        xls: "📊",
        xlsx: "📊",
        csv: "📊",

        // Presentations
        ppt: "📊",
        pptx: "📊",

        // Archives
        zip: "🗜️",
        rar: "🗜️",
        "7z": "🗜️",

        // Code
        js: "💻",
        ts: "💻",
        jsx: "💻",
        tsx: "💻",
        html: "💻",
        css: "💻",
        json: "💻",

        // Video
        mp4: "🎥",
        avi: "🎥",
        mov: "🎥",
        mkv: "🎥",

        // Audio
        mp3: "🎵",
        wav: "🎵",
        flac: "🎵",
    };

    return iconMap[extension || ""] || "📄";
}

export function formatDate(date: string | Date) {
    const d = new Date(date);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    if (days < 7) return `${days} days ago`;

    return d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: d.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    });
}
