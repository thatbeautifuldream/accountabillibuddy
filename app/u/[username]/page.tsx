"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { PostItem } from "@/components/post-item";
import { Skeleton } from "@/components/ui/skeleton";

export default function UserProfilePage({
    params,
}: {
    params: { username: string };
}) {
    const posts = useQuery(api.posts.getUserPostsByUsername, {
        username: params.username,
    });

    if (posts === undefined) {
        return (
            <div className="container max-w-2xl mx-auto p-6 space-y-8">
                <div className="space-y-4">
                    <Skeleton className="h-8 w-[200px] mx-auto" />
                    <div className="space-y-4">
                        {[...Array(3)].map((_, i) => (
                            <Skeleton key={i} className="h-32 w-full" />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container max-w-2xl mx-auto p-6 space-y-8">
            <div className="space-y-4">
                <h1 className="text-2xl font-bold text-center">
                    {params.username}&apos;s Accountability Posts
                </h1>
                {posts.length === 0 ? (
                    <div className="text-center p-6 bg-muted rounded-lg">
                        <p className="text-muted-foreground">No posts yet</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {posts.map((post) => (
                            <PostItem key={post._id} post={post} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
} 