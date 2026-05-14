import AuthorClient from "./AuthorClient";
import { getPortalBaseUrl } from "@/app/API/portalBaseUrl";

async function fetchAuthorBySlug(authslug) {
  const res = await fetch(
    `${getPortalBaseUrl()}/api/public/authors/${authslug}`,
    { cache: "no-store" }
  );

  if (!res.ok) return null;

  const data = await res.json();
  if (!data || !data.name) return null;

  return data;
}
// async function fetchSpotlightsByAuthor(slug) {
//   try {
//     const res = await fetch(
//       `${getPortalBaseUrl()}/api/public/spotlights?authorSlug=${slug}&isActive=true`,
//       { cache: "no-store" }
//     );

//     if (!res.ok) return [];
//     return await res.json();
//   } catch {
//     return [];
//   }
// }

function parseSocialMedia(socialMedia) {
  if (!socialMedia) return [];

  let parsed = socialMedia;
  if (typeof socialMedia === "string") {
    try {
      parsed = JSON.parse(socialMedia);
    } catch {
      return [];
    }
  }

  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    return [];
  }

  return Object.values(parsed).map((v) => String(v || "").trim());
}

export async function generateMetadata({ params }) {
  const { authslug } = params;
  const data = await fetchAuthorBySlug(authslug);
  if (!data) return {};

  const fallbackTitle = `${data.name} | BluOne Ink Author`;
  return {
    title: data.metaTitle || fallbackTitle,
    description: data.metaDescription,
    keywords: data.metaKeywords || undefined,
    alternates: {
      canonical: `https://www.bluone.ink/authors/${authslug}`,
    },
  };
}

export default async function Page({ params }) {
  const { authslug } = params;
  const data = await fetchAuthorBySlug(authslug);
  if (!data) {
    return <div>Author not found.</div>;
  }
  // const spotlights = await fetchSpotlightsByAuthor(authslug);

  const authorInfo = {
    id: data.id,
    author_name: data.name,
    authslug: data.slug,
    image: data.imageUrl,
    authorDescription: data.description || "",
    authorSocial: parseSocialMedia(data.socialMedia),
    metaTitle: data.metaTitle,
    metaDescription: data.metaDescription,
    metaKeywords: data.metaKeywords,
    books: Array.isArray(data.books) ? data.books : [],
  };

  return <AuthorClient 
  authorInfo={authorInfo}
  // hasSpotlights={spotlights.length > 0} 
  />;
}
