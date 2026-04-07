import AuthorsClient from "./AuthorsClient";
import { getPortalBaseUrl } from "@/app/API/portalBaseUrl";

const AUTHORS_API = `${getPortalBaseUrl()}/api/v1/public/authors/list`;
const AUTHORS_PER_PAGE = 18;

export default async function Page() {
  const params = new URLSearchParams({
    page: "1",
    limit: String(AUTHORS_PER_PAGE),
  });

  const res = await fetch(`${AUTHORS_API}?${params.toString()}`, {
    next: { revalidate: 60 },
  });

  let initialAuthors = [];
  let initialTotal = 0;
  let initialTotalPages = 1;

  if (res.ok) {
    const data = await res.json();
    initialAuthors = data.authors || [];
    initialTotal = data.total ?? 0;
    initialTotalPages = Math.max(1, data.totalPages ?? 1);
  }

  return (
    <AuthorsClient
      initialAuthors={initialAuthors}
      initialTotal={initialTotal}
      initialTotalPages={initialTotalPages}
    />
  );
}
