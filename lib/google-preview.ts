import { normalizeUrl } from "./link-types";

export type GoogleWorkspaceKind = "document" | "presentation" | "spreadsheets";

export type GoogleWorkspaceRef = {
  kind: GoogleWorkspaceKind;
  id: string;
};

/** Drive file links (not folders). */
export function parseGoogleDriveFileId(url: string): string | null {
  try {
    const parsed = new URL(normalizeUrl(url));
    if (!parsed.hostname.replace(/^www\./, "").includes("drive.google.com")) {
      return null;
    }

    const filePath = parsed.pathname.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (filePath) return filePath[1];

    const ucId = parsed.searchParams.get("id");
    if (ucId && parsed.pathname.includes("/uc")) return ucId;

    const openId = parsed.searchParams.get("id");
    if (openId && parsed.pathname.includes("/open")) return openId;
  } catch {
    return null;
  }
  return null;
}

export function parseGoogleWorkspaceUrl(url: string): GoogleWorkspaceRef | null {
  try {
    const parsed = new URL(normalizeUrl(url));
    const host = parsed.hostname.replace(/^www\./, "");

    if (host === "slides.google.com") {
      const id = parsed.pathname.match(/\/presentation\/d\/([a-zA-Z0-9_-]+)/)?.[1];
      return id ? { kind: "presentation", id } : null;
    }

    if (host !== "docs.google.com" && host !== "sheets.google.com") {
      return null;
    }

    const document = parsed.pathname.match(/\/document\/d\/([a-zA-Z0-9_-]+)/);
    if (document) return { kind: "document", id: document[1] };

    const presentation = parsed.pathname.match(/\/presentation\/d\/([a-zA-Z0-9_-]+)/);
    if (presentation) return { kind: "presentation", id: presentation[1] };

    const spreadsheet = parsed.pathname.match(/\/spreadsheets\/d\/([a-zA-Z0-9_-]+)/);
    if (spreadsheet) return { kind: "spreadsheets", id: spreadsheet[1] };
  } catch {
    return null;
  }
  return null;
}

/** Public Drive thumbnail endpoint (works for many shared files). */
export function getGoogleDriveThumbnailUrl(fileId: string, width = 1200): string {
  return `https://drive.google.com/thumbnail?id=${fileId}&sz=w${width}`;
}

export function getGoogleWorkspacePreviewPageUrl(ref: GoogleWorkspaceRef): string {
  const path =
    ref.kind === "spreadsheets"
      ? "spreadsheets"
      : ref.kind === "presentation"
        ? "presentation"
        : "document";
  return `https://docs.google.com/${path}/d/${ref.id}/preview`;
}
