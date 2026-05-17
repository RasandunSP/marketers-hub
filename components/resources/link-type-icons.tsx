import Image from "next/image";
import type { LinkType } from "@/lib/resources";
import { LinkIcon } from "../icons";

const ash = "text-[#b0b0b0]";

export function LinkTypeIcon({
  linkType,
  className = "h-3.5 w-3.5",
}: {
  linkType: LinkType;
  className?: string;
}) {
  switch (linkType) {
    case "aiesec":
      return (
        <span
          className={`relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-md bg-[#b8bcc4] p-0.5 ${className}`}
        >
          <Image
            src="/Logos/White Logo.png"
            alt=""
            width={14}
            height={14}
            className="h-full w-full object-contain"
            aria-hidden
          />
          <span
            className="pointer-events-none absolute inset-0 rounded-md bg-[#6b7280]/35"
            aria-hidden
          />
        </span>
      );
    case "google-drive":
      return (
        <svg className={`${className} ${ash}`} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M8.4 2 2 13.2h4.8L12 4.8zm7.2 0L12 11.4l5.2 9H22L15.6 2zM2 15.6 7.6 24H12l-2.4-4.2-4.4-4.2z" />
        </svg>
      );
    case "canva":
      return (
        <svg className={`${className} ${ash}`} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <circle cx="12" cy="12" r="10" fillOpacity="0.15" />
          <text x="12" y="16" textAnchor="middle" fontSize="10" fontWeight="700" fill="currentColor">C</text>
        </svg>
      );
    case "github":
      return (
        <svg className={`${className} ${ash}`} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M12 2C6.48 2 2 6.58 2 12.26c0 4.52 2.87 8.35 6.84 9.71.5.1.68-.22.68-.48 0-.24-.01-.87-.01-1.7-2.78.62-3.37-1.36-3.37-1.36-.45-1.18-1.11-1.5-1.11-1.5-.91-.64.07-.63.07-.63 1 .07 1.53 1.05 1.53 1.05.9 1.56 2.36 1.11 2.94.85.09-.67.35-1.11.63-1.37-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.7 0 0 .84-.27 2.75 1.05A9.2 9.2 0 0 1 12 6.84c.85.004 1.71.12 2.51.35 1.91-1.32 2.75-1.05 2.75-1.05.55 1.4.2 2.44.1 2.7.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.8-4.57 5.06.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.8 0 .27.18.59.69.48A10.03 10.03 0 0 0 22 12.26C22 6.58 17.52 2 12 2z" />
        </svg>
      );
    case "web":
      return (
        <svg className={`${className} ${ash}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
          <circle cx="12" cy="12" r="10" />
          <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
      );
    case "facebook":
      return (
        <svg className={`${className} ${ash}`} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M24 12.07C24 5.41 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.68.24 2.68.24v2.97h-1.51c-1.49 0-1.95.93-1.95 1.89v2.27h3.32l-.53 3.49h-2.79V24C19.61 23.1 24 18.1 24 12.07z" />
        </svg>
      );
    case "flickr":
      return (
        <svg className={`${className} ${ash}`} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <circle cx="7" cy="12" r="5" />
          <circle cx="17" cy="12" r="5" />
        </svg>
      );
    case "instagram":
      return (
        <svg className={`${className} ${ash}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
          <rect width="20" height="20" x="2" y="2" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
        </svg>
      );
    case "linkedin":
      return (
        <svg className={`${className} ${ash}`} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zm1.78 13.02H3.55V9h3.57v11.45z" />
        </svg>
      );
    case "x":
      return (
        <svg className={`${className} ${ash}`} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M18.9 2H22l-6.8 7.77L23.2 22h-6.7l-5.2-6.8L5.8 22H2.7l7.3-8.36L1 2h6.9l4.7 6.2L18.9 2zm-1.2 18h1.7L7.1 3.9H5.2L17.7 20z" />
        </svg>
      );
    case "youtube":
      return (
        <svg className={`${className} ${ash}`} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31.3 31.3 0 0 0 0 12a31.3 31.3 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31.3 31.3 0 0 0 24 12a31.3 31.3 0 0 0-.5-5.8zM9.75 15.02V8.98L15.5 12l-5.75 3.02z" />
        </svg>
      );
    default:
      return <LinkIcon className={`${className} ${ash}`} />;
  }
}
