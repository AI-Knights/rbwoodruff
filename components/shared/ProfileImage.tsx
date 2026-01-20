"use client";

import { cn } from "@/lib/utils";
import { User } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface ProfileImageProps {
    src?: string | null;
    alt: string;
    className?: string;
    size?: number; // Optional size in pixels for Next/Image optimization
}

export function ProfileImage({ src, alt, className, size = 40 }: ProfileImageProps) {
    const [imageError, setImageError] = useState(false);

    // If we have a valid source and it hasn't errored, try to show the image
    if (src && !imageError) {
        return (
            <div className={cn("relative overflow-hidden rounded-full bg-gray-100", className)}>
                {/* Using standard img tag for simplicity with external URLs unless configured for Next/Image, 
            but implementation plan suggested keeping it simple. 
            However, we can use a standard img tag with object-cover. 
            Let's use a standard img to avoid domain configuration issues for now, 
            or we can use Next/Image if we are sure about domains.
            Given the context, standard img is safer for external user content without knowing next.config.js.
        */}
                <img
                    src={src}
                    alt={alt}
                    className="h-full w-full object-cover"
                    onError={() => setImageError(true)}
                />
            </div>
        );
    }

    // Fallback: Facebook-style placeholder
    return (
        <div
            className={cn(
                "flex items-center justify-center bg-gray-200 text-gray-500 rounded-full",
                className
            )}
        >
            <User className="h-[60%] w-[60%]" />
        </div>
    );
}
