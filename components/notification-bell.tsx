'use client';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { formatDistanceToNow } from "date-fns";
import { Bell, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "./ui/button";
import { Id } from "@/convex/_generated/dataModel";

export function NotificationBell() {
    const { user, isSignedIn } = useUser();
    const router = useRouter();
    const [isHovered, setIsHovered] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const markAsRead = useMutation(api.notifications.markNotificationAsRead);

    const unreadCount = useQuery(
        api.notifications.getUnreadNotificationCount,
        isSignedIn && user?.id ? { userId: user.id } : "skip"
    ) || 0;

    // Get recent notifications (limit to 5)
    const recentNotifications = useQuery(
        api.notifications.getNotificationsForUser,
        isSignedIn && user?.id ? { userId: user.id, limit: 5 } : "skip"
    );

    const handleMarkAsRead = async (notificationId: string) => {
        try {
            await markAsRead({ notificationId: notificationId as Id<"notifications"> });
        } catch (error) {
            console.error("Failed to mark notification as read:", error);
        }
    };

    const handleViewPost = (notificationId: string, postId: string) => {
        // Mark as read when clicking to view post
        if (notificationId) {
            handleMarkAsRead(notificationId);
        }
        setIsOpen(false);
        router.push(`/post/${postId}`);
    };

    if (!isSignedIn) {
        return null;
    }

    return (
        <div className="relative">
            <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="relative h-9 w-9 rounded-full"
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                    >
                        <Bell className={`h-5 w-5 ${isHovered ? 'text-primary' : ''}`} />
                        {unreadCount > 0 && (
                            <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                {unreadCount > 9 ? '9+' : unreadCount}
                            </span>
                        )}
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80 max-h-[400px] overflow-auto">
                    <div className="p-2">
                        <h4 className="text-sm font-medium mb-1">Notifications</h4>
                    </div>
                    <DropdownMenuSeparator />

                    {!recentNotifications ? (
                        <div className="flex justify-center items-center py-4">
                            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                        </div>
                    ) : recentNotifications.length === 0 ? (
                        <div className="px-4 py-6 text-center">
                            <p className="text-sm text-muted-foreground">No notifications yet</p>
                        </div>
                    ) : (
                        <>
                            {recentNotifications.map((notification) => (
                                <div key={notification._id}>
                                    <DropdownMenuItem
                                        className={`px-4 py-3 cursor-pointer flex flex-col items-start gap-1 ${!notification.isRead ? 'bg-muted/50' : ''}`}
                                        onClick={() => handleViewPost(notification._id, notification.postId)}
                                    >
                                        <div className="flex justify-between w-full">
                                            <p className="text-sm font-medium">{notification.message}</p>
                                            {!notification.isRead && (
                                                <div className="h-2 w-2 rounded-full bg-primary" />
                                            )}
                                        </div>
                                        <p className="text-xs text-muted-foreground">
                                            {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                                        </p>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                </div>
                            ))}
                        </>
                    )}

                    <div className="p-2">
                        <Button
                            variant="outline"
                            className="w-full justify-center"
                            size="sm"
                            onClick={() => {
                                setIsOpen(false);
                                router.push('/notifications');
                            }}
                        >
                            View all notifications
                        </Button>
                    </div>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
} 