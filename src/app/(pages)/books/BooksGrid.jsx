import { useMemo } from "react";
import Link from "next/link";
import BooksCards from "./BooksCards";

export default function BooksGrid({ books }) {
  const normalizedBooks = useMemo(
    () =>
      (books || []).map((book) => {
        const displayLanguage =
          Array.isArray(book.languages) && book.languages.length
            ? book.languages.join(", ")
            : book.language;

        return {
          ...book,
          displayLanguage,
        };
      }),
    [books]
  );

  if (!normalizedBooks.length) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 pb-6">
        <p className="text-center col-span-full mt-4">No results found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 pb-6">
      {normalizedBooks.map((book) => (
        <div
          key={book.id}
          className="p-4 mb-4 hover:shadow-md input-border border-[#ffffff00] hover:border-[#BABABA] rounded-md"
        >
          <Link
            href={`/books/${encodeURIComponent(book.slug)}`}
            style={{ textDecoration: "none" }}
          >
            <BooksCards
              title={book.title}
              coverImage={book.book_image}
              bookPrice={`₹${book.price}`}
              authorName={book.authorNames}
              imageContainerClass="h-[200px] lg:h-[320px]"
              slug={book.slug}
              language={book.displayLanguage}
              format={
                book.format === "PAPERBACK"
                  ? "PB"
                  : book.format === "HARDBACK"
                  ? "HB"
                  : book.format
              }
            />
          </Link>
        </div>
      ))}
    </div>
  );
}

