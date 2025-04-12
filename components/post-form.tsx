import { useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { toast } from "sonner"



export function PostForm() {
    const { user } = useUser();
    const createPost = useMutation(api.posts.createPost);
    const [text, setText] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !text.trim()) return;

        try {
            await createPost({
                text: text.trim(),
                userId: user.id,
                userName: user.fullName || "Anonymous",
            });
            setText("");
            toast.success("Your accountability post has been created.");
        } catch (error) {
            console.error(error);
            toast.error("Failed to create post. Please try again.");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <Textarea
                placeholder="What do you want to be accountable for?"
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="min-h-[100px]"
            />
            <Button type="submit" disabled={!user || !text.trim()}>
                Post
            </Button>
        </form>
    );
} 