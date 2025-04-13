import { Metadata } from "next";
import NotificationsClient from "./page-client";

export const metadata: Metadata = {
    title: "Notifications | Accountabillibuddy",
    description: "Your notifications",
};

export default function NotificationsPage() {
    return <NotificationsClient />;
} 