import { getPortalBaseUrl } from "@/app/API/portalBaseUrl";

async function fetchJson(url) {
  const res = await fetch(url, { next: { revalidate: 60 } });
  if (!res.ok) return null;
  return res.json();
}

function toCommaParam(value) {
  if (Array.isArray(value)) {
    return value.filter(Boolean).join(",");
  }
  return value || "";
}

export async function fetchRelatedBooksV1({
  categorySlug,
  sort = "title_asc",
  page = 1,
  limit = 15,
  language, // string or string[]
  format,   // string or string[]
  genre,    // string or string[]
}) {
  if (!categorySlug) return null;
  const base = getPortalBaseUrl();
  const params = new URLSearchParams({
    category: categorySlug,
    sort: sort,
    page: String(page),
    limit: String(limit),
  });
  const languageParam = toCommaParam(language);
  const formatParam = toCommaParam(format);
  const genreParam = toCommaParam(genre);
  if (languageParam) params.set("language", languageParam);
  if (formatParam) params.set("format", formatParam);
  if (genreParam) params.set("genre", genreParam);
  const url = `${base}/api/v1/public/books/related?${params.toString()}`;
  return fetchJson(url);
}

export async function searchBooksV1({
  categorySlug,
  query,
  sort = "publish_newest",
  page = 1,
  limit = 15,
  language, // string or string[]
  format,   // string or string[]
}) {
  if (!categorySlug || !query) return null;
  const base = getPortalBaseUrl();
  const params = new URLSearchParams({
    category: categorySlug,
    q: query,
    sort: sort,
    page: String(page),
    limit: String(limit),
  });
  const languageParam = toCommaParam(language);
  const formatParam = toCommaParam(format);
  if (languageParam) params.set("language", languageParam);
  if (formatParam) params.set("format", formatParam);
  const url = `${base}/api/v1/public/books/search?${params.toString()}`;
  return fetchJson(url);
}

export async function fetchBookVersionsV1({ title }) {
  if (!title) return null;
  const base = getPortalBaseUrl();
  const url = `${base}/api/v1/public/books/versions?title=${encodeURIComponent(
    title
  )}`;
  return fetchJson(url);
}

