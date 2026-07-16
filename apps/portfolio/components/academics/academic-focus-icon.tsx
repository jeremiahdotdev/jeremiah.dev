import Image from "next/image"

interface AcademicFocusIconProps {
    src: string
    alt: string
    unoptimized?: boolean
}

export default function AcademicFocusIcon({ src, alt, unoptimized }: AcademicFocusIconProps) {
    return (
        <Image
            src={src}
            alt={alt}
            width={48}
            height={48}
            className="h-12 w-12 dark:invert"
            unoptimized={unoptimized}
            loading="lazy"
        />
    )
}
