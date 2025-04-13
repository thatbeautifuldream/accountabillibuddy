import { useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { toast } from "sonner"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export function PostForm() {
    const { user } = useUser();
    const createPost = useMutation(api.posts.createPost);
    const [text, setText] = useState("");
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !text.trim()) return;
        setIsDialogOpen(true);
    };

    const handleConfirm = async () => {
        try {
            await createPost({
                text: text.trim(),
                userId: user!.id,
                userName: user!.fullName || "Anonymous",
            });
            setText("");
            setIsDialogOpen(false);
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
            <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <AlertDialogTrigger asChild>
                    <Button type="submit" disabled={!user || !text.trim()} className="w-full">
                        Post Accountability
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Create Accountability Post</AlertDialogTitle>
                        <AlertDialogDescription>
                            By creating this accountability post, you&apos;re taking a meaningful step towards your goals. Your commitment will be visible to the community, helping to keep you motivated and accountable. Remember, accountability is a powerful tool for personal growth and achievement.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleConfirm}>Post</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </form>
    );
} 