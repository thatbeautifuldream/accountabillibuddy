'use client'

import { SignInButton, SignUpButton, UserButton, useUser } from '@clerk/nextjs'
import Link from 'next/link';

export function Header() {
    const { isSignedIn } = useUser();
    return (
        <header className="sticky top-0 z-10 bg-background border-b border-border">
            <div className="container mx-auto p-4 @container">
                <div className="flex flex-col @md:flex-row justify-between items-center gap-4">
                    <Link href="/" className="text-xl font-bold">Accountabillibuddy</Link>
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
                </div>
            </div>
        </header>
    )
}
