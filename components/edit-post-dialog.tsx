import { useState, useEffect } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Loader2, Lock } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface EditPostDialogProps {
    post: {
        _id: Id<"posts">;
        text: string;
        userId: string;
        isPrivate?: boolean;
    };
    currentUserId: string;
    isOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    triggerButton?: React.ReactNode;
}

export function EditPostDialog({
    post,
    currentUserId,
    isOpen: controlledIsOpen,
    onOpenChange: controlledOnOpenChange,
    triggerButton
}: EditPostDialogProps) {
    const [text, setText] = useState(post.text);
    const [isPrivate, setIsPrivate] = useState(post.isPrivate ?? false);
    const [isLocalOpen, setIsLocalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const editPost = useMutation(api.posts.editPost);

    // Use controlled or uncontrolled open state
    const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : isLocalOpen;
    const onOpenChange = controlledOnOpenChange || setIsLocalOpen;

    // Reset text when dialog opens
    useEffect(() => {
        if (isOpen) {
            setText(post.text);
            setIsPrivate(post.isPrivate ?? false);
        }
    }, [isOpen, post.text, post.isPrivate]);

    // Only post author can edit
    if (post.userId !== currentUserId) {
        return null;
    }

    const handleEdit = async () => {
        if (!text.trim()) {
            toast.error("Post cannot be empty");
            return;
        }

        const hasNoChanges = text.trim() === post.text && isPrivate === (post.isPrivate ?? false);
        if (hasNoChanges) {
            onOpenChange(false);
            return;
        }

        setIsLoading(true);

        try {
            await editPost({
                postId: post._id,
                userId: currentUserId,
                text: text.trim(),
                isPrivate: isPrivate,
            });
            toast.success("Post updated successfully");
            onOpenChange(false);
        } catch (error) {
            console.error("Failed to update post:", error);
            toast.error("Failed to update post. Please try again.");
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
                    <DialogTitle>Edit Post</DialogTitle>
                </DialogHeader>
                <div className="py-4 space-y-4">
                    <Textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="What do you want to be accountable for?"
                        className="w-full min-h-[150px]"
                        onKeyDown={handleKeyDown}
                        autoFocus
                    />
                    <div className="flex items-center space-x-2">
                        <Switch
                            id="edit-private-toggle"
                            checked={isPrivate}
                            onCheckedChange={setIsPrivate}
                        />
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <div className="flex items-center">
                                        <Label htmlFor="edit-private-toggle" className="cursor-pointer">
                                            Private Post
                                        </Label>
                                        {isPrivate && <Lock className="ml-1 h-3 w-3" />}
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent className="max-w-xs">
                                    <p>When enabled, this post will only be visible to you.</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
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
                        disabled={isLoading || !text.trim() || (text.trim() === post.text && isPrivate === (post.isPrivate ?? false))}
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