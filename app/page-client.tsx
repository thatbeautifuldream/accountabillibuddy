"use client";

import { PostFeed } from "@/components/post-feed";
import { PostForm } from "@/components/post-form";
import { SignInButton, useUser } from "@clerk/nextjs";

export default function HomeClient() {
  const { isSignedIn } = useUser();

  return (
    <main className="container max-w-2xl mx-auto px-6 py-6 space-y-8">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-center">
          Share Your Accountability Goals
        </h2>
        <p className="text-muted-foreground text-center">
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
    </main>
  );
}
