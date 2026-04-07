import Loader from "@/app/components/Loader";
import CategoryClient from "./CategoryClient";
import { getPortalBaseUrl } from "@/app/API/portalBaseUrl";

const ALLOWED_CATEGORIES = ["Fiction", "Non-Fiction", "Children"];

export default async function Page() {
  const res = await fetch(
    `${getPortalBaseUrl()}/api/v1/public/categories/latest-books`,
    { next: { revalidate: 60 } }
  );

  if (!res.ok) {
    return <Loader />;
  }

  const data = await res.json();

  const categories = [
    { id: "fiction", name: "Fiction", books: data?.fiction || [] },
    { id: "non-fiction", name: "Non-Fiction", books: data?.nonFiction || [] },
    { id: "children", name: "Children", books: data?.children || [] },
  ].filter((cat) => ALLOWED_CATEGORIES.includes(cat.name));

  return <CategoryClient categories={categories} />;
}
