import type { LinkType, ResourceType } from "./resources";

export function resourceTypeLabel(type: ResourceType): string {
  const labels: Record<ResourceType, string> = {
    logo: "Logo",
    color: "Color",
    guideline: "Guideline",
    template: "Template",
    photoalbum: "Photo Album",
    aftermovie: "After Movie",
    animation: "Animation",
    other: "Resource",
  };
  return labels[type];
}

export function linkTypeLabel(linkType: LinkType): string {
  const labels: Record<LinkType, string> = {
    other: "Other",
    aiesec: "AIESEC",
    "google-drive": "Google Drive",
    canva: "Canva",
    github: "Github",
    web: "Web",
    facebook: "Facebook",
    flickr: "Flickr",
    instagram: "Instagram",
    linkedin: "Linkedin",
    x: "X",
    youtube: "Youtube",
  };
  return labels[linkType];
}
