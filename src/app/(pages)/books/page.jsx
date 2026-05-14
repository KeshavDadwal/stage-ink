import Loader from "@/app/components/Loader";
import { Suspense } from "react";
import BooksClient from "./BooksClient";
import { getPortalBaseUrl } from "@/app/API/portalBaseUrl";
const PAGE_SIZE = 15;

const CATEGORY_TO_SLUG = {
  bestsellers: "bestsellers",
  "new-releases": "new-releases",
  "coming-soon": "coming-soon",
  Fiction: "fiction",
  "Non-Fiction": "non-fiction",
  Children: "children",
};

const SORT_TO_V1 = {
  "Title: A to Z": "title_asc",
  "Title: Z to A": "title_desc",
  "Publish Year: Newest First": "publish_newest",
  "Publish Year: Oldest First": "publish_oldest",
};

function asStringArray(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value.filter(Boolean).map(String);
  return [String(value)];
}

async function fetchV1BooksOnServer({
  categorySlug,
  query,
  sort,
  page,
  limit,
  language,
  format,
  genre,
}) {
  const portalBaseUrl = getPortalBaseUrl();
  const isSearch = !!query;
  const endpoint = isSearch
    ? `${portalBaseUrl}/api/v1/public/books/search`
    : `${portalBaseUrl}/api/v1/public/books/related`;

  const params = new URLSearchParams({
    category: categorySlug,
    sort: sort || "publish_newest",
    page: String(page || 1),
    limit: String(limit || PAGE_SIZE),
  });

  if (isSearch) params.set("q", query);

  if (language?.length) params.set("language", language.join(","));
  if (format?.length) params.set("format", format.join(","));
  if (!isSearch && genre?.length) params.set("genre", genre.join(","));

  const res = await fetch(`${endpoint}?${params.toString()}`, {
    cache: "no-store",
  });
  if (!res.ok) return null;
  return res.json();
}

export default async function Page({ searchParams }) {
  const page = parseInt(searchParams?.page || "1", 10) || 1;
  const limit = parseInt(searchParams?.limit || "15", 10) || 15;
  const category = searchParams?.category ? String(searchParams.category) : null;

  const sortOption = searchParams?.sort ? String(searchParams.sort) : "";
  const sortParam = SORT_TO_V1[sortOption] || "publish_newest";
  const q = searchParams?.q ? String(searchParams.q) : "";

  const language = asStringArray(searchParams?.language);
  const format = asStringArray(searchParams?.format);
  const genre = asStringArray(searchParams?.genre);

  let initialV1 = null;
  if (category) {
    const slug =
      CATEGORY_TO_SLUG[category] ||
      category.toLowerCase().replace(/\s+/g, "-");

    const data = await fetchV1BooksOnServer({
      categorySlug: slug,
      query: q || "",
      sort: sortParam,
      page,
      limit: PAGE_SIZE,
      language,
      format,
      genre,
    });

    if (data && Array.isArray(data.books)) {
      initialV1 = {
        books: data.books.map((b) => ({
          id: b.id,
          title: b.title,
          slug: b.slug,
          price: b.price,
          format: b.format,
          languages: b.languages,
          book_image: b.thumbnailUrl,
          thumbnailUrl: b.thumbnailUrl,
          author: b.author ? { author_name: b.author.name, name: b.author.name } : null,
          authorNames: b.author?.name ?? "",
          isCart: b.isCart,
        })),
        totalPages:
          data.totalPages ?? (Math.ceil((data.total || 0) / PAGE_SIZE) || 1),
        total: data.total ?? data.books.length,
        languageCounts: data.languageCounts || {},
        formatCounts: data.formatCounts || {},
        genres: data.genres || [],
      };
    } else {
      initialV1 = {
        books: [],
        totalPages: 1,
        total: 0,
        languageCounts: {},
        formatCounts: {},
        genres: [],
      };
    }
  }

  return (
    <Suspense fallback={<Loader />}>
      <BooksClient
        initialV1={initialV1}
        initialCategory={category}
        initialPage={page}
        initialLimit={limit}
      />
    </Suspense>
  );
}
