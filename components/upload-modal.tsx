"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, X, File } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { formatBytes } from "@/lib/utils";
import toast from "react-hot-toast";

interface UploadModalProps {
    isOpen: boolean;
    onClose: () => void;
    onUpload: (files: File[]) => Promise<void>;
}

export function UploadModal({ isOpen, onClose, onUpload }: UploadModalProps) {
    const [files, setFiles] = useState<File[]>([]);
    const [uploading, setUploading] = useState(false);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        setFiles((prev) => [...prev, ...acceptedFiles]);
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        multiple: true,
    });

    const removeFile = (index: number) => {
        setFiles((prev) => prev.filter((_, i) => i !== index));
    };

    const handleUpload = async () => {
        if (files.length === 0) {
            toast.error("Please select files to upload");
            return;
        }

        setUploading(true);
        try {
            await onUpload(files);
            toast.success(`${files.length} file(s) uploaded successfully`);
            setFiles([]);
            onClose();
        } catch (_error) {
            toast.error("Failed to upload files");
        } finally {
            setUploading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Upload Files">
            <div className="space-y-4">
                {/* Dropzone */}
                <div
                    {...getRootProps()}
                    className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${isDragActive
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                        : "border-gray-300 dark:border-gray-600 hover:border-blue-400"
                        }`}
                >
                    <input {...getInputProps()} />
                    <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    {isDragActive ? (
                        <p className="text-blue-600 dark:text-blue-400 font-medium">
                            Drop files here...
                        </p>
                    ) : (
                        <>
                            <p className="text-gray-700 dark:text-gray-300 font-medium mb-1">
                                Drag & drop files here
                            </p>
                            <p className="text-sm text-gray-500">or click to browse</p>
                        </>
                    )}
                </div>

                {/* File List */}
                {files.length > 0 && (
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                            Selected Files ({files.length})
                        </h3>
                        {files.map((file, index) => (
                            <div
                                key={index}
                                className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                            >
                                <File className="w-5 h-5 text-gray-400" />
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium truncate">{file.name}</p>
                                    <p className="text-xs text-gray-500">{formatBytes(file.size)}</p>
                                </div>
                                <button
                                    onClick={() => removeFile(index)}
                                    className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {/* Actions */}
                <div className="flex gap-3 pt-4">
                    <Button
                        variant="outline"
                        className="flex-1"
                        onClick={onClose}
                        disabled={uploading}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="default"
                        className="flex-1"
                        onClick={handleUpload}
                        disabled={uploading || files.length === 0}
                    >
                        {uploading ? "Uploading..." : `Upload ${files.length} file(s)`}
                    </Button>
                </div>
            </div>
        </Modal>
    );
}
