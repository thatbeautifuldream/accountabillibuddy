/* eslint-disable @next/next/no-img-element */
'use client'

import { cn } from '@/lib/utils';
import { SignInButton, SignUpButton, UserButton, useUser } from '@clerk/nextjs';
import Link from 'next/link';
import { NotificationBell } from './notification-bell';
import { ThemeToggle } from './theme-toggle';

export function Header() {
    const { isSignedIn } = useUser();


    return (
        <header className={cn(
            "sticky top-0 z-50 bg-background border-b border-border transition-all duration-200 py-2",
        )}>
            <div className="container mx-auto px-4 @container">
                <div className="flex flex-row justify-between items-center h-full">
                    <Link href="/" className="text-xl font-bold shrink-0">
                        <span className="hidden sm:inline">Accountabillibuddy</span>
                        <img src="/favicon.png" alt="Accountabillibuddy" width={32} height={32} className="inline sm:hidden" />
                    </Link>

                    <div className="flex items-center gap-3 sm:gap-4">
                        <ThemeToggle />
                        {isSignedIn && <NotificationBell />}
                        {isSignedIn ? (
                            <UserButton afterSignOutUrl="/" />
                        ) : (
                            <div className="flex gap-2">
                                <SignInButton mode="modal">
                                    <button className="bg-primary text-primary-foreground px-3 py-1.5 sm:px-4 sm:py-2 rounded-md text-sm whitespace-nowrap">
                                        Sign in
                                    </button>
                                </SignInButton>
                                <SignUpButton mode="modal">
                                    <button className="bg-primary text-primary-foreground px-3 py-1.5 sm:px-4 sm:py-2 rounded-md text-sm whitespace-nowrap">
                                        Sign up
                                    </button>
                                </SignUpButton>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    )
}
