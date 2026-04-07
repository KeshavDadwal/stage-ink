"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import BooksCards from "../books/BooksCards";
import { Helmet, HelmetProvider } from "react-helmet-async";
import {
  MdOutlineKeyboardArrowLeft,
  MdOutlineKeyboardArrowRight,
} from "react-icons/md";

const ScrollButtons = ({ onScrollLeft, onScrollRight }) => (
  <>
    <button
      onClick={onScrollLeft}
      className="absolute text-[20px] left-0 top-1/2 transform -translate-y-1/2 z-10 bg-[#f5f5f5] shadow p-2 rounded-full"
    >
      <MdOutlineKeyboardArrowLeft />
    </button>
    <button
      onClick={onScrollRight}
      className="absolute text-[20px] right-0 top-1/2 transform -translate-y-1/2 z-10 bg-[#f5f5f5] shadow p-2 rounded-full"
    >
      <MdOutlineKeyboardArrowRight />
    </button>
  </>
);

const BookCarousel = ({ category }) => {
  const scrollRef = useRef();
  const [sortOrder] = useState("desc");

  const books = [...(category.books || [])]
    .sort((a, b) => (sortOrder === "desc" ? b.id - a.id : a.id - b.id))
    .slice(0, 10);

  const scrollLeft = () => {
    scrollRef.current.scrollBy({ left: -300, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
  };

  return books.length >= 1 ? (
    <div className="mb-12">
      <div className="mt-10 flex justify-between items-center">
        <h2 className="text-2xl font-semibold mb-4 px-2">{category.name}</h2>
        {category.name !== "Top-Sellers" && (
          <Link
            href={{ pathname: "/books", query: { category: category.name } }}
            className="text-[#241b6d] underline inline-block"
          >
            More Books
          </Link>
        )}
      </div>

      <div className="relative">
        <ScrollButtons onScrollLeft={scrollLeft} onScrollRight={scrollRight} />
        <div
          ref={scrollRef}
          className="flex gap-3 overflow-x-auto scroll-smooth no-scrollbar"
        >
          {books.map((book) => (
            <div
              key={book.id}
              className="p-4 min-w-[240px] max-w-[240px] shrink-0 hover:shadow-md input-border border-[#ffffff00] hover:border-[#BABABA] rounded-md"
            >
              <Link href={`/books/${book.slug}`} style={{ textDecoration: "none" }}>
                <BooksCards
                  title={book.title}
                  coverImage={book.thumbnailUrl}
                  bookPrice={book.price ? `₹${book.price}` : ""}
                  authorName={
                    book.author?.author_name ||
                    book.author?.name ||
                    (Array.isArray(book.author) ? book.author.join(", ") : book.author)
                  }
                  imageContainerClass="h-[280px] lg:h-[320px]"
                  slug={book.slug}
                  language={
                    Array.isArray(book.languages)
                      ? book.languages.join(", ")
                      : book.languages || ""
                  }
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
      </div>
    </div>
  ) : null;
};

export default function CategoryClient({ categories = [] }) {
  return (
    <HelmetProvider>
      <Helmet>
        <title>All Books | BluOne Ink Publishing</title>
        <meta
          name="description"
          content="Fiction, Non-fiction, and Children books published in HARDCOVER, PAPERBACK, and eBook formats."
        />
        <link rel="canonical" href="https://www.bluone.ink/books" />
      </Helmet>

      <main className="top_bg_gradient">
        <div className="container mx-auto px-4 py-2">
          {categories.map((category) => (
            <BookCarousel key={category.id} category={category} />
          ))}
        </div>
      </main>
    </HelmetProvider>
  );
}

