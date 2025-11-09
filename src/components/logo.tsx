import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <svg
      className={cn("h-8 w-auto text-primary", className)}
      viewBox="0 0 200 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Dulus Business Hub Logo"
    >
      <g clipPath="url(#clip0_105_2)">
        <path
          d="M20 0C8.9543 0 0 8.9543 0 20C0 31.0457 8.9543 40 20 40C31.0457 40 40 31.0457 40 20C40 8.9543 31.0457 0 20 0ZM20 32C13.3726 32 8 26.6274 8 20C8 13.3726 13.3726 8 20 8C26.6274 8 32 13.3726 32 20C32 26.6274 26.6274 32 20 32Z"
          fill="currentColor"
        />
        <text
          x="48"
          y="29"
          fontFamily="Inter, sans-serif"
          fontSize="24"
          fontWeight="bold"
          fill="hsl(var(--foreground))"
          className="fill-foreground"
        >
          Dulus
        </text>
      </g>
      <defs>
        <clipPath id="clip0_105_2">
          <rect width="200" height="40" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}
