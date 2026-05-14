// const DEFAULT_PORTAL_BASE_URL = "https://dashboard.bluone.ink";
const DEFAULT_PORTAL_BASE_URL = "http://204.236.201.166:3000/";

export function getPortalBaseUrl() {
  const base =
    process.env.PORTAL_BASE_URL ||
    process.env.NEXT_PUBLIC_PORTAL_BASE_URL ||
    DEFAULT_PORTAL_BASE_URL;

  return String(base).replace(/\/+$/, "");
}

