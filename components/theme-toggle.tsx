"use client"

import { MoonIcon, SunIcon } from "lucide-react"
import { useEffect, useState } from "react"

import { Toggle } from "@/components/ui/toggle"
import { useTheme } from "next-themes"

export function ThemeToggle() {
    const { theme, setTheme } = useTheme()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return <div className="size-9" />
    }

    return (
        <div>
            <Toggle
                variant="default"
                className="group size-9 hover:bg-muted bg-transparent"
                pressed={theme === "dark"}
                onPressedChange={() =>
                    setTheme((prev) => (prev === "dark" ? "light" : "dark"))
                }
                aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            >
                <MoonIcon
                    size={16}
                    className="shrink-0 scale-0 opacity-0 transition-all dark:scale-100 dark:opacity-100"
                    aria-hidden="true"
                />
                <SunIcon
                    size={16}
                    className="absolute shrink-0 scale-100 opacity-100 transition-all dark:scale-0 dark:opacity-0"
                    aria-hidden="true"
                />
            </Toggle>
        </div>
    )
}
