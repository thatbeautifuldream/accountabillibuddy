import React, { useState, KeyboardEvent } from "react";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

interface TagInputProps {
    value: string[];
    onChange: (tags: string[]) => void;
    placeholder?: string;
    maxTags?: number;
}

export function TagInput({
    value = [],
    onChange,
    placeholder = "Add tags (comma separated)",
    maxTags = 5,
}: TagInputProps) {
    const [inputValue, setInputValue] = useState("");

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        // Add tag on comma or Enter
        if (e.key === "," || e.key === "Enter") {
            e.preventDefault();
            addTag();
        }
    };

    const addTag = () => {
        if (!inputValue.trim()) return;

        // Split input by commas and trim whitespace
        const newTags = inputValue
            .split(",")
            .map(tag => tag.trim().toLowerCase())
            .filter(Boolean)
            // Filter out duplicates and existing tags
            .filter(tag => !value.includes(tag));

        if (newTags.length > 0) {
            // Check maximum tags limit
            const combinedTags = [...value, ...newTags];
            const finalTags = combinedTags.slice(0, maxTags);

            onChange(finalTags);
            setInputValue("");
        }
    };

    const removeTag = (tagToRemove: string) => {
        const newTags = value.filter(tag => tag !== tagToRemove);
        onChange(newTags);
    };

    return (
        <div className="space-y-2">
            <div className="flex flex-wrap gap-2 mb-2">
                {value.map(tag => (
                    <Badge
                        key={tag}
                        variant="secondary"
                        className="flex items-center gap-1"
                    >
                        #{tag}
                        <X
                            className="h-3 w-3 cursor-pointer"
                            onClick={() => removeTag(tag)}
                        />
                    </Badge>
                ))}
            </div>
            <Input
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                onBlur={addTag}
                placeholder={placeholder}
                className="w-full"
            />
            {value.length >= maxTags && (
                <p className="text-xs text-muted-foreground mt-1">
                    Maximum of {maxTags} tags allowed
                </p>
            )}
        </div>
    );
} 