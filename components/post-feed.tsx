import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { PostItem } from "./post-item";
import { Skeleton } from "@/components/ui/skeleton";
import { useUser } from "@clerk/nextjs";

export function PostFeed() {
    const posts = useQuery(api.posts.listPosts);
    const { user } = useUser();

    if (posts === undefined) {
        return (
            <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                    <Skeleton key={i} className="h-[150px] w-full" />
                ))}
            </div>
        );
    }

    if (posts.length === 0) {
        return (
            <div className="text-center text-muted-foreground py-10">
                No accountability posts yet. Be the first to post!
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {posts.map((post) => (
                <PostItem
                    key={post._id}
                    text={post.text}
                    userName={post.userName}
                    createdAt={post.createdAt}
                    postId={post._id}
                    userId={post.userId}
                    currentUserId={user?.id ?? null}
                />
            ))}
        </div>
    );
} 