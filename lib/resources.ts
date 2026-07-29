export type ResourceAction = "copy" | "external" | "download";

export type LinkType =
  | "other"
  | "aiesec"
  | "google-drive"
  | "canva"
  | "github"
  | "web"
  | "facebook"
  | "flickr"
  | "instagram"
  | "linkedin"
  | "x"
  | "youtube";

export type ResourceType =
  | "logo"
  | "color"
  | "guideline"
  | "template"
  | "photoalbum"
  | "aftermovie"
  | "animation"
  | "other";

export type CardSize = "compact" | "large" | "color";

export type Resource = {
  id: string;
  resourceType: ResourceType;
  cardSize: CardSize;
  title: string;
  subtitle: string;
  url: string;
  category: string;
  linkType: LinkType;
  copyable: boolean;
  redirectable: boolean;
  downloadable: boolean;
  featured: boolean;
  iconUrl?: string;
  iconBackgroundColor?: string;
  bannerUrl?: string;
  /** Hex value for color resources */
  hexColor?: string;
  /** Original link text from the sheet (for display when different from url) */
  linkLabel?: string;
};

export const CATEGORIES = [
  "LOGOS",
  "COLORS",
  "GUIDELINES",
  "TEMPLATES",
  "PHOTO ALBUMS",
  "AFTER MOVIES",
  "ANIMATIONS",
] as const;

export const FALLBACK_RESOURCES: Resource[] = [
  {
    id: "aiesec-logo",
    resourceType: "logo",
    cardSize: "compact",
    title: "AIESEC LOGO",
    subtitle: "AIESEC logo and its variations",
    url: "https://click.aiesec.lk/mc/nst25262-membership",
    category: "LOGOS",
    linkType: "other",
    copyable: true,
    redirectable: true,
    downloadable: true,
    featured: false,
    iconUrl: "/Logos/AIESEC-Human-Blue.png",
  },
];
