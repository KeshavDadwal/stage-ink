const DEFAULT_PORTAL_BASE_URL = "https://dashboard.bluone.ink";

export function getPortalBaseUrl() {
  const base =
    process.env.PORTAL_BASE_URL ||
    process.env.NEXT_PUBLIC_PORTAL_BASE_URL ||
    DEFAULT_PORTAL_BASE_URL;

  return String(base).replace(/\/+$/, "");
}

