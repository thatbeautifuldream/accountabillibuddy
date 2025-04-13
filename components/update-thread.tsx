import { Button } from "@/components/ui/button";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { formatDistanceToNow } from "date-fns";
import { ChevronDown, ChevronUp, Loader2, MoreVertical, Pen, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { DeleteUpdateDialog } from "./delete-update-dialog";
import { EditUpdateDialog } from "./edit-update-dialog";

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
    const [updateToEdit, setUpdateToEdit] = useState<Id<"updates"> | null>(null);
    const [updateToDelete, setUpdateToDelete] = useState<Id<"updates"> | null>(null);

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

    const handleKeyDown = (e: React.KeyboardEvent) => {
        // Submit on Ctrl+Enter or Cmd+Enter
        if ((e.ctrlKey || e.metaKey) && e.key === "Enter" && text.trim() && !isSubmitting) {
            e.preventDefault();
            handleSubmitUpdate(e as unknown as React.FormEvent);
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
                                className="w-full mb-2"
                                onKeyDown={handleKeyDown}
                            />
                            <Button
                                type="submit"
                                disabled={!text.trim() || isSubmitting}
                                className="flex items-center gap-1 w-full"
                            >
                                {isSubmitting ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <Plus className="h-4 w-4" />
                                )}
                                {isSubmitting ? "Adding..." : "Add Update"}
                            </Button>
                        </form>
                    )}

                    {updates === undefined ? (
                        <div className="py-2 text-center text-muted-foreground flex justify-center">
                            <Loader2 className="h-4 w-4 animate-spin mr-2" /> Loading updates...
                        </div>
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
                                        <div className="flex items-center">
                                            <span className="text-xs text-muted-foreground mr-2">
                                                {formatDistanceToNow(new Date(update.createdAt), { addSuffix: true })}
                                            </span>
                                            {userId && userId === update.userId && (
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-foreground">
                                                            <MoreVertical className="h-3.5 w-3.5" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem
                                                            onClick={() => setUpdateToEdit(update._id)}
                                                            className="cursor-pointer flex items-center gap-2"
                                                        >
                                                            <Pen className="h-3.5 w-3.5" />
                                                            <span>Edit</span>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            onClick={() => setUpdateToDelete(update._id)}
                                                            className="cursor-pointer text-destructive flex items-center gap-2"
                                                        >
                                                            <Trash2 className="h-3.5 w-3.5" />
                                                            <span>Delete</span>
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            )}
                                        </div>
                                    </div>
                                    <p className="mt-1 whitespace-pre-wrap">{update.text}</p>

                                    {/* Edit Dialog */}
                                    {updateToEdit === update._id && (
                                        <EditUpdateDialog
                                            update={update}
                                            currentUserId={userId || ''}
                                            isOpen={true}
                                            onOpenChange={(open) => {
                                                if (!open) setUpdateToEdit(null);
                                            }}
                                        />
                                    )}

                                    {/* Delete Dialog */}
                                    {updateToDelete === update._id && (
                                        <DeleteUpdateDialog
                                            updateId={update._id}
                                            userId={userId || ''}
                                            isOpen={true}
                                            onOpenChange={(open) => {
                                                if (!open) setUpdateToDelete(null);
                                            }}
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </CollapsibleContent>
            </Collapsible>
        </div>
    );
} 