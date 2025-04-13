import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Plus, ChevronDown, ChevronUp } from "lucide-react";

interface UpdateThreadProps {
    postId: Id<"posts">;
    isAuthor: boolean;
    userId: string | null;
    userName: string | null;
}

export function UpdateThread({ postId, isAuthor, userId, userName }: UpdateThreadProps) {
    const updates = useQuery(api.updates.getUpdatesForPost, { postId });
    const createUpdate = useMutation(api.updates.createUpdate);
    const [text, setText] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmitUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userId || !text.trim() || !userName) return;

        setIsSubmitting(true);
        try {
            await createUpdate({
                postId,
                text: text.trim(),
                userId,
                userName,
            });
            setText("");
            toast.success("Update added successfully");
        } catch (error) {
            console.error("Failed to add update:", error);
            toast.error("Failed to add update. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const hasUpdates = updates && updates.length > 0;

    return (
        <div className="mt-4 border-t pt-4">
            <Collapsible open={isOpen} onOpenChange={setIsOpen}>
                <div className="flex items-center justify-between">
                    <CollapsibleTrigger asChild>
                        <Button variant="ghost" size="sm" className="flex items-center gap-1">
                            {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                            <span>{hasUpdates ? `Updates (${updates?.length || 0})` : "No updates yet"}</span>
                        </Button>
                    </CollapsibleTrigger>
                </div>

                <CollapsibleContent>
                    {isAuthor && (
                        <form onSubmit={handleSubmitUpdate} className="mb-4 mt-2">
                            <Textarea
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                placeholder="Share an update on your progress..."
                                className="resize-none mb-2"
                            />
                            <Button
                                type="submit"
                                disabled={!text.trim() || isSubmitting}
                                className="flex items-center gap-1 w-full"
                            >
                                <Plus className="h-4 w-4" />
                                Add Update
                            </Button>
                        </form>
                    )}

                    {updates === undefined ? (
                        <div className="py-2 text-center text-muted-foreground">Loading updates...</div>
                    ) : updates.length === 0 ? (
                        isAuthor ? (
                            <div className="py-2 text-center text-muted-foreground">
                                Add your first status update!
                            </div>
                        ) : (
                            <div className="py-2 text-center text-muted-foreground">
                                No updates posted yet.
                            </div>
                        )
                    ) : (
                        <div className="space-y-3 mt-2">
                            {updates.map((update) => (
                                <div key={update._id} className="border-l-2 pl-4 py-2">
                                    <div className="flex justify-between items-center">
                                        <span className="font-medium">{update.userName}</span>
                                        <span className="text-xs text-muted-foreground">
                                            {formatDistanceToNow(new Date(update.createdAt), { addSuffix: true })}
                                        </span>
                                    </div>
                                    <p className="mt-1 whitespace-pre-wrap">{update.text}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </CollapsibleContent>
            </Collapsible>
        </div>
    );
} 