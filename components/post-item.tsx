import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import Link from "next/link";
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
                    {currentUserId && currentUserId === post.userId && (
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="absolute bottom-0 right-0 text-muted-foreground"
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
            </CardContent>
        </Card>
    );
} 