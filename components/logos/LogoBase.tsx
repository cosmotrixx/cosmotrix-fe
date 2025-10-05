import { SVGProps } from "react"

export interface LogoProps extends SVGProps<SVGSVGElement> {
  title?: string
}

// Small placeholder so the layout holds while you paste real SVGs.
export function PlaceholderLogo({ title = "Logo", className, ...props }: LogoProps) {
  return (
    <svg
      viewBox="0 0 256 64"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={title}
      className={className}
      {...props}
    >
      <rect x="0" y="0" width="256" height="64" rx="8" fill="none" stroke="currentColor" opacity="0.35" />
      <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fontSize="20" fill="currentColor" opacity="0.7">
        {title}
      </text>
    </svg>
  )
}

export default PlaceholderLogo
