import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";

export function TagCloud() {
    const router = useRouter();
    const posts = useQuery(api.posts.listPosts, {});

    // Extract all tags from posts and count their occurrences
    const tagCounts = posts?.reduce<Record<string, number>>((acc, post) => {
        if (post.tags && post.tags.length > 0) {
            post.tags.forEach(tag => {
                acc[tag] = (acc[tag] || 0) + 1;
            });
        }
        return acc;
    }, {}) || {};

    // Convert to array and sort by count
    const sortedTags = Object.entries(tagCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10); // Take top 10 tags

    const handleTagClick = (tag: string) => {
        router.push(`/tags/${encodeURIComponent(tag)}`);
    };

    if (posts === undefined) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Popular Tags</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                    <div className="flex flex-wrap gap-2">
                        {[...Array(5)].map((_, i) => (
                            <Skeleton key={i} className="h-6 w-16" />
                        ))}
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (sortedTags.length === 0) {
        return null; // Don't show the card if there are no tags
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Popular Tags</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
                <div className="flex flex-wrap gap-2">
                    {sortedTags.map(([tag, count]) => (
                        <Badge
                            key={tag}
                            variant="secondary"
                            className="cursor-pointer hover:bg-accent flex items-center gap-1"
                            onClick={() => handleTagClick(tag)}
                        >
                            #{tag}
                            <span className="text-xs opacity-70">({count})</span>
                        </Badge>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
} 