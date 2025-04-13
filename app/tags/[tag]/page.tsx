"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { PostItem } from "@/components/post-item";
import { Skeleton } from "@/components/ui/skeleton";
import { use } from "react";
import { useUser } from "@clerk/nextjs";
import { Card, CardContent } from "@/components/ui/card";
import { Tag } from "lucide-react";

export default function TagPostsPage({
    params,
}: {
    params: Promise<{ tag: string }>;
}) {
    const { tag } = use(params);
    const { user } = useUser();
    const decodedTag = decodeURIComponent(tag);

    const posts = useQuery(api.posts.getPostsByTag, {
        tag: decodedTag,
        currentUserId: user?.id,
    });

    if (posts === undefined) {
        return (
            <div className="container max-w-4xl mx-auto p-6 space-y-8">
                <div className="space-y-6">
                    <div className="flex items-center space-x-4">
                        <Skeleton className="h-16 w-16 rounded-md" />
                        <div className="space-y-2">
                            <Skeleton className="h-8 w-[200px]" />
                            <Skeleton className="h-4 w-[150px]" />
                        </div>
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

    return (
        <div className="container max-w-4xl mx-auto p-6 space-y-8">
            <div className="space-y-6">
                {/* Tag Header */}
                <div className="flex items-center space-x-4">
                    <Card className="w-16 h-16 flex items-center justify-center">
                        <CardContent className="p-0 flex items-center justify-center w-full h-full">
                            <Tag className="h-8 w-8" />
                        </CardContent>
                    </Card>
                    <div className="space-y-1">
                        <h1 className="text-2xl font-bold">#{decodedTag}</h1>
                        <p className="text-muted-foreground">
                            Posts tagged with #{decodedTag}
                        </p>
                    </div>
                </div>

                {/* Posts */}
                <div className="space-y-4">
                    <h2 className="text-xl font-semibold">Posts</h2>
                    {!posts || posts.length === 0 ? (
                        <div className="text-center p-6 bg-muted rounded-lg">
                            <p className="text-muted-foreground">No posts with this tag yet</p>
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