"use client";

import React from "react";
import { PostFeed } from "@/components/post-feed";
import { PostForm } from "@/components/post-form";
import { SignInButton, useUser } from "@clerk/nextjs";
import { LayoutWrapper } from "@/components/layout-wrapper";

export default function HomeClient() {
  const { isSignedIn } = useUser();

  const content = (
    <div className="space-y-8">
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
  );

  return (
    <div className="py-6">
      <LayoutWrapper>
        {content}
      </LayoutWrapper>
    </div>
  );
}
