import { getPortalBaseUrl } from "@/app/API/portalBaseUrl";

function toCommaParam(value) {
  if (Array.isArray(value)) return value.filter(Boolean).join(",");
  return value || "";
}

export async function GET(request) {
  const url = new URL(request.url);

  const categorySlug = url.searchParams.get("categorySlug");
  const query = url.searchParams.get("query");
  const sort = url.searchParams.get("sort") || "publish_newest";
  const page = url.searchParams.get("page") || "1";
  const limit = url.searchParams.get("limit") || "15";

  if (!categorySlug || !query) {
    return Response.json(
      { error: "Missing required query params: categorySlug, query" },
      { status: 400 }
    );
  }

  const language = toCommaParam(url.searchParams.getAll("language"));
  const format = toCommaParam(url.searchParams.getAll("format"));

  const upstreamParams = new URLSearchParams({
    category: categorySlug,
    q: query,
    sort,
    page: String(page),
    limit: String(limit),
  });

  if (language) upstreamParams.set("language", language);
  if (format) upstreamParams.set("format", format);

  const portalBaseUrl = getPortalBaseUrl();
  const upstreamUrl = `${portalBaseUrl}/api/v1/public/books/search?${upstreamParams.toString()}`;

  const upstreamResponse = await fetch(upstreamUrl, {
    next: { revalidate: 60 },
  });

  const upstreamContentType = upstreamResponse.headers.get("content-type") || "";
  const responseHeaders = new Headers();
  if (upstreamContentType) responseHeaders.set("content-type", upstreamContentType);

  if (!upstreamResponse.ok) {
    const errorText = await upstreamResponse.text().catch(() => "");
    return new Response(errorText || "Upstream request failed", {
      status: upstreamResponse.status,
      headers: responseHeaders,
    });
  }

  const body = await upstreamResponse.text();
  return new Response(body, { status: 200, headers: responseHeaders });
}

