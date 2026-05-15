// const DEFAULT_PORTAL_BASE_URL = "https://dashboard.bluone.ink";
const DEFAULT_PORTAL_BASE_URL = "https://stage-ink.vercel.app/";

export function getPortalBaseUrl() {
  const base =
    process.env.PORTAL_BASE_URL ||
    process.env.NEXT_PUBLIC_PORTAL_BASE_URL ||
    DEFAULT_PORTAL_BASE_URL;

  return String(base).replace(/\/+$/, "");
}

