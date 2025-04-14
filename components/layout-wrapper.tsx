'use client';

import { ProfileCard } from "@/components/profile-card";
import { TagCloud } from "@/components/tag-cloud";
import { useUser } from "@clerk/nextjs";

interface LayoutWrapperProps {
    children: React.ReactNode;
}

export function LayoutWrapper({ children }: LayoutWrapperProps) {
    const { isSignedIn } = useUser();

    if (!isSignedIn) {
        // If not signed in, just show the content with no sidebars
        return <>{children}</>;
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {/* Left sidebar */}
            <div className="hidden md:block md:col-span-1 lg:col-span-1">
                <div className="sticky top-20 space-y-6">
                    <ProfileCard />
                </div>
            </div>

            {/* Main content */}
            <div className="md:col-span-3 lg:col-span-4">
                {children}
            </div>

            {/* Right sidebar */}
            <div className="hidden lg:block lg:col-span-1">
                <div className="sticky top-20 space-y-6">
                    <TagCloud />
                </div>
            </div>
        </div>
    );
} 