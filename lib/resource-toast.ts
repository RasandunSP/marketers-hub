import { toast } from "sonner";

const DURATION_MS = 2800;

function show(message: string, emoji: string) {
  toast(message, {
    icon: emoji,
    duration: DURATION_MS,
  });
}

export const resourceToast = {
  copyLink: () => show("Link copied to clipboard", "📋"),
  copyColor: () => show("Color code copied", "🎨"),
  copyFailed: () => show("Could not copy to clipboard", "⚠️"),
  openTab: () => show("Opening in a new tab", "🔗"),
  download: () => show("Download started", "⬇️"),
};
