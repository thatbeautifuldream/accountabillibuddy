"use client";

import { PostFeed } from "@/components/post-feed";
import { PostForm } from "@/components/post-form";
import { SignInButton, useUser } from "@clerk/nextjs";
import { TagCloud } from "@/components/tag-cloud";

export default function HomeClient() {
  const { isSignedIn } = useUser();

  return (
    <div className="container mx-auto px-6 py-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-3 space-y-8">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-center md:text-left">
              Share Your Accountability Goals
            </h2>
            <p className="text-muted-foreground text-center md:text-left">
              Post what you want to be accountable for and inspire others to join you on
              your journey.
            </p>
          </div>

          {isSignedIn ? (
            <PostForm />
          ) : (
            <div className="text-center p-6 bg-muted rounded-lg">
              <p className="mb-4">Sign in to share your accountability goals</p>
              <SignInButton mode="modal">
                <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm">
                  Get Started
                </button>
              </SignInButton>
            </div>
          )}

          <PostFeed />
        </div>

        <div className="space-y-6">
          <TagCloud />
        </div>
      </div>
    </div>
  );
}
