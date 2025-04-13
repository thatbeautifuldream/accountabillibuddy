import { Metadata } from "next";
import PostClient from "./page-client";
import { Id } from "@/convex/_generated/dataModel";

type Props = {
    params: Promise<{ id: Id<"posts"> }>;
};

export const metadata: Metadata = {
    title: "Post | Accountabillibuddy",
    description: "View a post",
};

export default async function PostPage({ params }: Props) {
    const { id } = await params;
    return <PostClient postId={id} />;
} 