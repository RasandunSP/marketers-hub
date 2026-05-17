export type ResourceAction = "copy" | "external" | "download";

export type ResourcePreview =
  | { type: "none" }
  | {
      type: "bluebook";
      title: string;
      subtitle?: string;
    };

export type Resource = {
  id: string;
  title: string;
  subtitle: string;
  url: string;
  category: string;
  primaryAction: ResourceAction;
  showDownload: boolean;
  preview: ResourcePreview;
};

export const CATEGORIES = [
  "LOGOS",
  "COLORS",
  "GUIDELINES",
  "TEMPLATES",
  "PHOTO ALBUMS",
] as const;

export const RESOURCES: Resource[] = [
  {
    id: "aiesec-logo",
    title: "AIESEC LOGO",
    subtitle: "AIESEC logo and its variations",
    url: "click.aiesec.lk/mc/nst25262-membership",
    category: "LOGOS",
    primaryAction: "copy",
    showDownload: true,
    preview: { type: "none" },
  },
  {
    id: "blue-book",
    title: "AIESEC Blue Book",
    subtitle: "Guideline Documents for AIESEC B...",
    url: "click.aiesec.lk/mc/nst25262-membership",
    category: "GUIDELINES",
    primaryAction: "external",
    showDownload: true,
    preview: {
      type: "bluebook",
      title: "THE BLUE BOOK",
      subtitle: "AIESEC IN SRI LANKA BRAND GUIDE | 2023",
    },
  },
];
