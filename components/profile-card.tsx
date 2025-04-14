/* eslint-disable @next/next/no-img-element */
'use client';

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useUser } from "@clerk/nextjs";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Skeleton } from "./ui/skeleton";

export function ProfileCard() {
    const { user, isSignedIn } = useUser();
    const posts = useQuery(
        api.posts.getUserPostsByUsername,
        user ? { username: user.username || "", currentUserId: user.id } : "skip"
    );

    if (!isSignedIn) {
        return null;
    }

    if (!user || posts === undefined) {
        return (
            <Card>
                <CardHeader className="pb-3">
                    <Skeleton className="h-24 w-24 rounded-full mx-auto" />
                </CardHeader>
                <CardContent className="space-y-3 text-center">
                    <Skeleton className="h-5 w-3/4 mx-auto" />
                    <Skeleton className="h-4 w-1/2 mx-auto" />
                </CardContent>
            </Card>
        );
    }

    const username = user.username || "";
    const joinedDate = user.createdAt ? new Date(user.createdAt) : null;

    return (
        <Card>
            <CardHeader className="pb-3 text-center">
                <Link href={`/u/${encodeURIComponent(username)}`}>
                    {user.imageUrl ? (
                        <img
                            src={user.imageUrl}
                            alt={`${username}'s profile`}
                            className="h-24 w-24 rounded-full object-cover mx-auto"
                        />
                    ) : (
                        <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center mx-auto">
                            <span className="text-xl font-bold text-muted-foreground">
                                {username[0]?.toUpperCase() || "U"}
                            </span>
                        </div>
                    )}
                </Link>
            </CardHeader>
            <CardContent className="space-y-3 text-center">
                <Link href={`/u/${encodeURIComponent(username)}`} className="block hover:underline">
                    <h2 className="font-semibold text-lg">
                        {user.firstName ? `${user.firstName} ${user.lastName || ''}` : username}
                    </h2>
                </Link>
                <p className="text-muted-foreground text-sm">@{username}</p>
                {joinedDate && (
                    <p className="text-xs text-muted-foreground">
                        Joined {formatDistanceToNow(joinedDate, { addSuffix: true })}
                    </p>
                )}

                <div className="pt-2 text-sm">
                    <div className="flex justify-center space-x-4">
                        <div className="text-center">
                            <div className="font-semibold">{posts?.length || 0}</div>
                            <p className="text-xs text-muted-foreground">Posts</p>
                        </div>
                        <div className="text-center">
                            <div className="font-semibold">
                                {posts?.filter(post => new Date(post.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length || 0}
                            </div>
                            <p className="text-xs text-muted-foreground">This week</p>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
} 