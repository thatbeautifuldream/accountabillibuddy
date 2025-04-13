import { useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { toast } from "sonner";
import { Loader2, Lock } from "lucide-react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Switch } from "@/components/ui/switch";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Label } from "@/components/ui/label";

export function PostForm() {
    const { user } = useUser();
    const createPost = useMutation(api.posts.createPost);
    const [text, setText] = useState("");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isPrivate, setIsPrivate] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !text.trim()) return;
        setIsDialogOpen(true);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        // Submit on Ctrl+Enter or Cmd+Enter
        if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
            e.preventDefault();
            handleSubmit(e as unknown as React.FormEvent);
        }
    };

    const handleConfirm = async () => {
        try {
            setIsSubmitting(true);
            await createPost({
                text: text.trim(),
                userId: user!.id,
                userName: user!.fullName || "Anonymous",
                isPrivate: isPrivate,
            });
            setText("");
            setIsDialogOpen(false);
            toast.success("Your accountability post has been created.");
        } catch (error) {
            console.error(error);
            toast.error("Failed to create post. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <Textarea
                    placeholder="Share what you want to be accountable for..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    rows={4}
                    className="w-full resize-none"
                />
            </div>
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <Switch
                        id="private-toggle"
                        checked={isPrivate}
                        onCheckedChange={setIsPrivate}
                    />
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <div className="flex items-center">
                                    <Label htmlFor="private-toggle" className="cursor-pointer">
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
                <Button type="submit" disabled={!text.trim()}>
                    Post
                </Button>
            </div>

            <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Confirm Post</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you ready to share this accountability post?
                            {isPrivate && (
                                <div className="mt-2 flex items-center text-sm text-amber-600 dark:text-amber-400">
                                    <Lock className="mr-1 h-4 w-4" />
                                    This post will be private and only visible to you.
                                </div>
                            )}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isSubmitting}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleConfirm}
                            disabled={isSubmitting}
                            className="flex items-center gap-2"
                        >
                            {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                            {isSubmitting ? "Posting..." : "Post"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </form>
    );
} 