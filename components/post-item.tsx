import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";
import { Trash2, ThumbsUp } from "lucide-react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import Link from "next/link";
import { UpdateThread } from "./update-thread";
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
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useState } from "react";

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

    // Use optimistic values if they've changed, otherwise use the real values
    const displayedUpvoted = optimisticUpvoted !== false ? optimisticUpvoted : hasUpvoted;
    const displayedUpvoteCount = optimisticUpvoteCount !== 0 ? optimisticUpvoteCount : upvoteCount;

    const handleDelete = async () => {
        try {
            await deletePost({
                postId: post._id,
                userId: currentUserId!
            });
        } catch (error) {
            console.error("Failed to delete post:", error);
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
                    <span className="text-sm text-muted-foreground">
                        {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                    </span>
                </div>
            </CardHeader>
            <CardContent>
                <div className="relative">
                    <p className="whitespace-pre-wrap">{post.text}</p>
                </div>

                <div className="flex items-center mt-4 justify-between">
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

                    {isAuthor && (
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-muted-foreground"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Delete Post</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Are you sure you want to delete this post? This action cannot be undone.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    )}
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
        </Card>
    );
} 