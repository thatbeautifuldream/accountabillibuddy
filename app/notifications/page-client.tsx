'use client';

import { useUser } from "@clerk/nextjs";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState, useEffect } from "react";
import { formatDistanceToNow } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bell, Check, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Id } from "@/convex/_generated/dataModel";

export default function NotificationsClient() {
    const { user, isSignedIn, isLoaded } = useUser();
    const router = useRouter();
    const markAllAsRead = useMutation(api.notifications.markAllNotificationsAsRead);
    const markAsRead = useMutation(api.notifications.markNotificationAsRead);

    const [isMarkingAllAsRead, setIsMarkingAllAsRead] = useState(false);

    // Redirect if user is not signed in
    useEffect(() => {
        if (isLoaded && !isSignedIn) {
            router.push("/");
        }
    }, [isLoaded, isSignedIn, router]);

    const notifications = useQuery(
        api.notifications.getNotificationsForUser,
        isSignedIn && user?.id ? { userId: user.id } : "skip"
    );

    const handleMarkAllAsRead = async () => {
        if (!user?.id) return;

        setIsMarkingAllAsRead(true);
        try {
            await markAllAsRead({ userId: user.id });
            toast.success("All notifications marked as read");
        } catch (error) {
            console.error("Failed to mark all notifications as read:", error);
            toast.error("Failed to mark all notifications as read");
        } finally {
            setIsMarkingAllAsRead(false);
        }
    };

    const handleMarkAsRead = async (notificationId: string) => {
        try {
            await markAsRead({ notificationId: notificationId as Id<"notifications"> });
        } catch (error) {
            console.error("Failed to mark notification as read:", error);
        }
    };

    if (!isLoaded || !isSignedIn) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    return (
        <div className="container mx-auto py-8 px-4">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold flex items-center gap-2">
                    <Bell className="h-6 w-6" />
                    Notifications
                </h1>

                {notifications && notifications.length > 0 && (
                    <Button
                        variant="outline"
                        onClick={handleMarkAllAsRead}
                        disabled={isMarkingAllAsRead}
                    >
                        {isMarkingAllAsRead ? (
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                            <Check className="h-4 w-4 mr-2" />
                        )}
                        Mark all as read
                    </Button>
                )}
            </div>

            {!notifications ? (
                <div className="flex justify-center items-center min-h-[40vh]">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
            ) : notifications.length === 0 ? (
                <div className="text-center py-16">
                    <Bell className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <h2 className="text-xl font-semibold mb-2">No notifications yet</h2>
                    <p className="text-muted-foreground mb-4">
                        You&apos;ll see notifications here when people interact with your posts.
                    </p>
                    <Button onClick={() => router.push('/')}>Back to home</Button>
                </div>
            ) : (
                <div className="space-y-4 max-w-3xl mx-auto">
                    {notifications.map((notification) => (
                        <Card
                            key={notification._id}
                            className={`transition-colors ${!notification.isRead ? 'bg-muted/40 border-primary/20' : ''}`}
                            onClick={() => !notification.isRead && handleMarkAsRead(notification._id)}
                        >
                            <CardContent className="p-4">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1">
                                        <p className="mb-1">{notification.message}</p>
                                        <div className="flex justify-between items-center mt-2">
                                            <span className="text-sm text-muted-foreground">
                                                {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                                            </span>
                                            <Link
                                                href={`/post/${notification.postId}`}
                                                className="text-sm font-medium text-primary hover:underline"
                                            >
                                                View post
                                            </Link>
                                        </div>
                                    </div>
                                    {!notification.isRead && (
                                        <div className="h-2 w-2 rounded-full bg-primary mt-2" />
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
} 