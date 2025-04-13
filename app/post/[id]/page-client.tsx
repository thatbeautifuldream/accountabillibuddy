'use client';

import { useUser } from "@clerk/nextjs";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { PostItem } from "@/components/post-item";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useEffect } from "react";

interface PostClientProps {
    postId: Id<"posts">;
}

export default function PostClient({ postId }: PostClientProps) {
    const { user, isSignedIn } = useUser();
    const router = useRouter();

    // Get the post
    const post = useQuery(api.posts.getPostById, { postId });

    // Get notifications and mark them as read
    const userNotifications = useQuery(
        api.notifications.getNotificationsForUser,
        isSignedIn && user?.id ? { userId: user.id } : "skip"
    );
    const markNotificationAsRead = useMutation(api.notifications.markNotificationAsRead);

    // Mark notification as read when post is viewed
    useEffect(() => {
        if (user?.id && post && userNotifications) {
            // Find notifications related to this post and mark them as read
            const markRelatedNotifications = async () => {
                // Find notifications related to this post
                const relatedNotifications = userNotifications.filter(
                    (n) => n.postId === postId && !n.isRead
                );

                // Mark them as read
                for (const notification of relatedNotifications) {
                    try {
                        await markNotificationAsRead({ notificationId: notification._id });
                    } catch (error) {
                        console.error("Error marking notification as read:", error);
                    }
                }
            };

            markRelatedNotifications();
        }
    }, [user?.id, postId, post, userNotifications, markNotificationAsRead]);

    return (
        <div className="container mx-auto py-8 px-4">
            <Button
                variant="ghost"
                onClick={() => router.back()}
                className="mb-6"
            >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
            </Button>

            {!post ? (
                <div className="flex justify-center items-center min-h-[40vh]">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
            ) : (
                <div className="max-w-3xl mx-auto">
                    <PostItem post={post} currentUserId={isSignedIn ? user?.id : null} />
                </div>
            )}
        </div>
    );
} 