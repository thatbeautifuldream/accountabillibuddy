export function Footer() {
    return (
        <footer className="border-t border-border bg-background">
            <div className="container mx-auto p-4 @container">
                <div className="flex flex-col @md:flex-row justify-between items-center gap-4">
                    <div className="text-sm text-muted-foreground text-center @md:text-left">
                        © {new Date().getFullYear()} Accountabillibuddy. All rights reserved.
                    </div>
                    <div className="flex gap-4">
                        <a href="/privacy" className="text-sm text-muted-foreground hover:text-foreground">
                            Privacy Policy
                        </a>
                        <a href="/terms" className="text-sm text-muted-foreground hover:text-foreground">
                            Terms of Service
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    )
} 