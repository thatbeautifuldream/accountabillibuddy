import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";
import { ThumbsUp, MoreVertical, Pen, Trash2, Loader2 } from "lucide-react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import Link from "next/link";
import { UpdateThread } from "./update-thread";
import { EditPostDialog } from "./edit-post-dialog";
import { useUser } from "@clerk/nextjs";
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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { toast } from "sonner";

interface Post {
    _id: Id<"posts">;
    text: string;
    userName: string;
    userId: string;
    createdAt: number;
}

interface PostItemProps {
    post: Post;
    currentUserId?: string | null;
}

export function PostItem({ post, currentUserId }: PostItemProps) {
    const deletePost = useMutation(api.posts.deletePost);
    const toggleUpvote = useMutation(api.upvotes.toggleUpvote);
    const { user } = useUser();
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    // Get the upvote count
    const upvoteCount = useQuery(api.upvotes.getUpvoteCount, {
        postId: post._id
    }) || 0;

    // Check if the current user has upvoted
    const hasUpvoted = useQuery(
        api.upvotes.hasUserUpvoted,
        currentUserId ? {
            postId: post._id,
            userId: currentUserId
        } : "skip"
    ) || false;

    // For optimistic UI updates
    const [optimisticUpvoted, setOptimisticUpvoted] = useState(false);
    const [optimisticUpvoteCount, setOptimisticUpvoteCount] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);

    // Use optimistic values if they've changed, otherwise use the real values
    const displayedUpvoted = optimisticUpvoted !== false ? optimisticUpvoted : hasUpvoted;
    const displayedUpvoteCount = optimisticUpvoteCount !== 0 ? optimisticUpvoteCount : upvoteCount;

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            await deletePost({
                postId: post._id,
                userId: currentUserId!
            });
            toast.success("Post deleted successfully");
            setIsDeleteDialogOpen(false);
        } catch (error) {
            console.error("Failed to delete post:", error);
            toast.error("Failed to delete post. Please try again.");
        } finally {
            setIsDeleting(false);
        }
    };

    const handleUpvote = async () => {
        if (!currentUserId) return;

        // Optimistic updates
        setOptimisticUpvoted(!displayedUpvoted);
        setOptimisticUpvoteCount(displayedUpvoted ? displayedUpvoteCount - 1 : displayedUpvoteCount + 1);

        try {
            await toggleUpvote({
                postId: post._id,
                userId: currentUserId
            });

            // Reset optimistic values after successful mutation
            setOptimisticUpvoted(false);
            setOptimisticUpvoteCount(0);
        } catch (error) {
            console.error("Failed to toggle upvote:", error);
            // Revert optimistic updates on error
            setOptimisticUpvoted(false);
            setOptimisticUpvoteCount(0);
            toast.error("Failed to update vote. Please try again.");
        }
    };

    const isAuthor = currentUserId === post.userId;

    return (
        <Card>
            <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                    <Link
                        href={`/u/${encodeURIComponent(post.userName)}`}
                        className="font-semibold hover:underline"
                    >
                        {post.userName}
                    </Link>
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">
                            {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                        </span>

                        {isAuthor && (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-muted-foreground hover:text-foreground"
                                    >
                                        <MoreVertical className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem
                                        onClick={() => setIsEditDialogOpen(true)}
                                        className="cursor-pointer flex items-center gap-2"
                                    >
                                        <Pen className="h-4 w-4" />
                                        <span>Edit Post</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onClick={() => setIsDeleteDialogOpen(true)}
                                        className="cursor-pointer text-destructive flex items-center gap-2"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                        <span>Delete Post</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        )}
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="relative">
                    <p className="whitespace-pre-wrap">{post.text}</p>
                </div>

                <div className="flex items-center mt-4">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className={`flex items-center space-x-1 ${displayedUpvoted ? 'text-primary' : 'text-muted-foreground'}`}
                                    onClick={handleUpvote}
                                    disabled={!currentUserId}
                                >
                                    <ThumbsUp className={`h-4 w-4 ${displayedUpvoted ? 'fill-primary' : ''}`} />
                                    <span>{displayedUpvoteCount}</span>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                {currentUserId
                                    ? (displayedUpvoted ? 'Remove Upvote' : 'Upvote')
                                    : 'Sign in to upvote'}
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>

                <div className="mt-4">
                    <UpdateThread
                        postId={post._id}
                        isAuthor={isAuthor}
                        userId={currentUserId || null}
                        userName={user?.fullName || null}
                    />
                </div>
            </CardContent>

            {/* Edit Dialog */}
            {isAuthor && currentUserId && (
                <EditPostDialog
                    post={post}
                    currentUserId={currentUserId}
                    isOpen={isEditDialogOpen}
                    onOpenChange={setIsEditDialogOpen}
                />
            )}

            {/* Delete Dialog */}
            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Post</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete this post? This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            disabled={isDeleting}
                            className="flex items-center gap-2"
                        >
                            {isDeleting && <Loader2 className="h-4 w-4 animate-spin" />}
                            {isDeleting ? "Deleting..." : "Delete"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </Card>
    );
} 