"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Folder } from "lucide-react";
import toast from "react-hot-toast";

interface NewFolderModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCreate: (name: string) => Promise<void>;
}

export function NewFolderModal({ isOpen, onClose, onCreate }: NewFolderModalProps) {
    const [folderName, setFolderName] = useState("");
    const [creating, setCreating] = useState(false);

    const handleCreate = async () => {
        if (!folderName.trim()) {
            toast.error("Please enter a folder name");
            return;
        }

        setCreating(true);
        try {
            await onCreate(folderName.trim());
            toast.success("Folder created successfully");
            setFolderName("");
            onClose();
        } catch (error) {
            toast.error("Failed to create folder");
        } finally {
            setCreating(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            handleCreate();
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Create New Folder">
            <div className="space-y-6">
                {/* Folder Icon */}
                <div className="flex items-center justify-center w-20 h-20 mx-auto bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 rounded-2xl">
                    <Folder className="w-10 h-10 text-blue-600 dark:text-blue-400" />
                </div>

                {/* Input */}
                <div>
                    <label className="block text-sm font-medium mb-2">Folder Name</label>
                    <Input
                        type="text"
                        placeholder="Enter folder name..."
                        value={folderName}
                        onChange={(e) => setFolderName(e.target.value)}
                        onKeyPress={handleKeyPress}
                        autoFocus
                    />
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                    <Button
                        variant="outline"
                        className="flex-1"
                        onClick={onClose}
                        disabled={creating}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="default"
                        className="flex-1"
                        onClick={handleCreate}
                        disabled={creating || !folderName.trim()}
                    >
                        {creating ? "Creating..." : "Create"}
                    </Button>
                </div>
            </div>
        </Modal>
    );
}
