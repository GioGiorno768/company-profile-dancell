import React from 'react';

/**
 * DynamicIcon safely renders an inline SVG string if provided by user,
 * or falls back to a default Lucide Icon component.
 */
export default function DynamicIcon({ svgString, fallback: FallbackIcon, className = "w-5 h-5" }) {
    if (svgString && typeof svgString === 'string' && svgString.trim().startsWith('<svg')) {
        return (
            <span
                className={`inline-flex items-center justify-center ${className}`}
                dangerouslySetInnerHTML={{ __html: svgString }}
            />
        );
    }

    if (FallbackIcon) {
        return <FallbackIcon className={className} />;
    }

    return null;
}
