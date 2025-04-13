import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface DeleteUpdateDialogProps {
    updateId: Id<"updates">;
    userId: string;
    isOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    triggerButton?: React.ReactNode;
}

export function DeleteUpdateDialog({
    updateId,
    userId,
    isOpen: controlledIsOpen,
    onOpenChange: controlledOnOpenChange,
    triggerButton
}: DeleteUpdateDialogProps) {
    const [isLocalOpen, setIsLocalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const deleteUpdate = useMutation(api.updates.deleteUpdate);

    // Use controlled or uncontrolled open state
    const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : isLocalOpen;
    const onOpenChange = controlledOnOpenChange || setIsLocalOpen;

    const handleDelete = async () => {
        setIsLoading(true);
        try {
            await deleteUpdate({
                updateId,
                userId,
            });
            toast.success("Update deleted successfully");
            onOpenChange(false);
        } catch (error) {
            console.error("Failed to delete update:", error);
            toast.error("Failed to delete update. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
            {triggerButton && (
                <AlertDialogTrigger asChild>
                    {triggerButton}
                </AlertDialogTrigger>
            )}
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete Update</AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to delete this update? This action cannot be undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleDelete}
                        disabled={isLoading}
                        className="flex items-center gap-2"
                    >
                        {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                        {isLoading ? "Deleting..." : "Delete"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
} 