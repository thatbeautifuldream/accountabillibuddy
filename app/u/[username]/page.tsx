/* eslint-disable @next/next/no-img-element */
"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { PostItem } from "@/components/post-item";
import { Skeleton } from "@/components/ui/skeleton";
import { use } from "react";
import { useUser } from "@clerk/nextjs";
import { formatDistanceToNow } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function UserProfilePage({
    params,
}: {
    params: Promise<{ username: string }>;
}) {
    const { username } = use(params);
    const { user } = useUser();
    const decodedUsername = decodeURIComponent(username);
    const posts = useQuery(api.posts.getUserPostsByUsername, {
        username: decodedUsername,
        currentUserId: user?.id,
    });

    if (posts === undefined) {
        return (
            <div className="container max-w-4xl mx-auto p-6 space-y-8">
                <div className="space-y-6">
                    <div className="flex items-center space-x-4">
                        <Skeleton className="h-24 w-24 rounded-full" />
                        <div className="space-y-2">
                            <Skeleton className="h-8 w-[200px]" />
                            <Skeleton className="h-4 w-[150px]" />
                        </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                        <Skeleton className="h-20" />
                        <Skeleton className="h-20" />
                        <Skeleton className="h-20" />
                    </div>
                    <div className="space-y-4">
                        {[...Array(3)].map((_, i) => (
                            <Skeleton key={i} className="h-32 w-full" />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    const profileUser = user?.username === decodedUsername ? user : null;
    const joinedDate = profileUser?.createdAt ? new Date(profileUser.createdAt) : null;

    return (
        <div className="container max-w-4xl mx-auto p-6 space-y-8">
            <div className="space-y-6">
                {/* Profile Header */}
                <div className="flex items-start space-x-6">
                    {profileUser?.imageUrl ? (
                        <img
                            src={profileUser.imageUrl}
                            alt={`${decodedUsername}'s profile`}
                            className="h-24 w-24 rounded-full object-cover"
                        />
                    ) : (
                        <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center">
                            <span className="text-xl font-bold text-muted-foreground">
                                {decodedUsername[0].toUpperCase()}
                            </span>
                        </div>
                    )}
                    <div className="space-y-2 mt-3">
                        <h1 className="text-2xl font-bold">
                            {profileUser?.firstName ? `${profileUser.firstName} ${profileUser.lastName || ''}` : decodedUsername}
                        </h1>
                        <p className="text-muted-foreground">@{decodedUsername}</p>
                        {joinedDate && (
                            <p className="text-sm text-muted-foreground">
                                Joined {formatDistanceToNow(joinedDate, { addSuffix: true })}
                            </p>
                        )}
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4">
                    <Card className="relative h-28">
                        <CardContent className="absolute inset-0 flex flex-col items-center justify-center p-4">
                            <div className="text-xl font-semibold">{posts.length}</div>
                            <p className="text-sm text-muted-foreground absolute bottom-3">Posts</p>
                        </CardContent>
                    </Card>
                    <Card className="relative h-28">
                        <CardContent className="absolute inset-0 flex flex-col items-center justify-center p-4">
                            <div className="text-xl font-semibold">
                                {posts.filter(post => new Date(post.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length}
                            </div>
                            <p className="text-sm text-muted-foreground absolute bottom-3">Posts this week</p>
                        </CardContent>
                    </Card>
                    <Card className="relative h-28">
                        <CardContent className="absolute inset-0 flex flex-col items-center justify-center p-4">
                            <div className="text-xl font-semibold">
                                {posts.length > 0 ? formatDistanceToNow(new Date(Math.max(...posts.map(p => p.createdAt))), { addSuffix: true }) : 'Never'}
                            </div>
                            <p className="text-sm text-muted-foreground absolute bottom-3">Last post</p>
                        </CardContent>
                    </Card>
                </div>

                <Separator />

                {/* Posts */}
                <div className="space-y-4">
                    <h2 className="text-xl font-semibold">Accountability Posts</h2>
                    {posts.length === 0 ? (
                        <div className="text-center p-6 bg-muted rounded-lg">
                            <p className="text-muted-foreground">No posts yet</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {posts.map((post) => (
                                <PostItem
                                    key={post._id}
                                    post={post}
                                    currentUserId={user?.id ?? null}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
} 