"use client";

import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs";
import { PostForm } from "@/components/post-form";
import { PostFeed } from "@/components/post-feed";

export default function Home() {
  const { isSignedIn } = useUser();

  return (
    <>
      <header className="sticky top-0 z-10 bg-background p-4 border-b border-border flex justify-between items-center">
        <h1 className="text-xl font-bold">Accountabillibuddy</h1>
        {isSignedIn ? (
          <UserButton afterSignOutUrl="/" />
        ) : (
          <div className="flex gap-2">
            <SignInButton mode="modal">
              <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm">
                Sign in
              </button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm">
                Sign up
              </button>
            </SignUpButton>
          </div>
        )}
      </header>

      <main className="container max-w-2xl mx-auto p-6 space-y-8">
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
    </>
  );
}
