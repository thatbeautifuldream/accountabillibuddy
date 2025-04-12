import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";

interface PostItemProps {
    text: string;
    userName: string;
    createdAt: number;
}

export function PostItem({ text, userName, createdAt }: PostItemProps) {
    return (
        <Card>
            <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                    <span className="font-semibold">{userName}</span>
                    <span className="text-sm text-muted-foreground">
                        {formatDistanceToNow(createdAt, { addSuffix: true })}
                    </span>
                </div>
            </CardHeader>
            <CardContent>
                <p className="whitespace-pre-wrap">{text}</p>
            </CardContent>
        </Card>
    );
} 