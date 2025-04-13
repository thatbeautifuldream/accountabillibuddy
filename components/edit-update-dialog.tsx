import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface Update {
    _id: Id<"updates">;
    text: string;
    userId: string;
}

interface EditUpdateDialogProps {
    update: Update;
    currentUserId: string;
    isOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    triggerButton?: React.ReactNode;
}

export function EditUpdateDialog({
    update,
    currentUserId,
    isOpen: controlledIsOpen,
    onOpenChange: controlledOnOpenChange,
    triggerButton
}: EditUpdateDialogProps) {
    const [text, setText] = useState(update.text);
    const [isLocalOpen, setIsLocalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const editUpdate = useMutation(api.updates.editUpdate);

    // Use controlled or uncontrolled open state
    const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : isLocalOpen;
    const onOpenChange = controlledOnOpenChange || setIsLocalOpen;

    // Reset text when dialog opens
    useEffect(() => {
        if (isOpen) {
            setText(update.text);
        }
    }, [isOpen, update.text]);

    // Only update author can edit
    if (update.userId !== currentUserId) {
        return null;
    }

    const handleEdit = async () => {
        if (!text.trim() || text.trim() === update.text) {
            onOpenChange(false);
            return;
        }

        setIsLoading(true);

        try {
            await editUpdate({
                updateId: update._id,
                userId: currentUserId,
                text: text.trim(),
            });
            toast.success("Update edited successfully");
            onOpenChange(false);
        } catch (error) {
            console.error("Failed to edit update:", error);
            toast.error("Failed to edit update. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        // Submit on Ctrl+Enter or Cmd+Enter
        if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
            e.preventDefault();
            handleEdit();
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            {triggerButton && (
                <DialogTrigger asChild>
                    {triggerButton}
                </DialogTrigger>
            )}
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Edit Update</DialogTitle>
                </DialogHeader>
                <div className="py-4">
                    <Textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Share an update on your progress..."
                        className="w-full min-h-[100px]"
                        onKeyDown={handleKeyDown}
                        autoFocus
                    />
                </div>
                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={isLoading}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleEdit}
                        disabled={isLoading || !text.trim() || text.trim() === update.text}
                        className="gap-2"
                    >
                        {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                        {isLoading ? "Saving..." : "Save Changes"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
} 