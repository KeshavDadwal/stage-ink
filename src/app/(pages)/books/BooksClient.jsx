"use client";

import { useEffect, useRef, useState, Suspense, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FiSearch, FiXCircle } from "react-icons/fi";
import { Helmet, HelmetProvider } from "react-helmet-async";
import Loader from "@/app/components/Loader";
import BooksGrid from "./BooksGrid";
import BooksFilters from "./BooksFilters";

const PAGE_SIZE = 15;

const removeDuplicateByLanguagePriority = (books = []) => books;

export default function BooksClient({
  initialV1 = null,
  initialCategory = null,
  initialPage = 1,
  initialLimit = 15,
}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [currentPage, setCurrentPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);
  const [categoryFilter, setCategoryFilter] = useState(
    initialCategory ? [initialCategory] : []
  );

  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("q") || ""
  );
  const [searchTerm, setSearchTerm] = useState(searchParams.get("q") || "");
  const [sortOption, setSortOption] = useState(searchParams.get("sort") || "");
  const [genreFilter, setGenreFilter] = useState([]);
  const [languageFilter, setLanguageFilter] = useState(
    searchParams.getAll("language") || []
  );
  const [formatFilter, setFormatFilter] = useState(
    searchParams.getAll("format") || []
  );
  const [priceRange, setPriceRange] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  const [books, setBooks] = useState([]);
  const [allBooks, setAllBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const [useV1Api, setUseV1Api] = useState(!!initialCategory);
  const [v1LanguageCounts, setV1LanguageCounts] = useState(
    initialV1?.languageCounts || {}
  );
  const [v1FormatCounts, setV1FormatCounts] = useState(
    initialV1?.formatCounts || {}
  );
  const [v1Genres, setV1Genres] = useState(initialV1?.genres || []);
  const [selectedV1Genres, setSelectedV1Genres] = useState(
    searchParams.getAll("genre") || []
  );

  const filterRef = useRef(null);

  // Debounce raw input into a stable search term (min 2 chars)
  useEffect(() => {
    const trimmed = searchQuery.trim();
    const timeoutId = setTimeout(() => {
      if (trimmed.length >= 2) setSearchTerm(trimmed);
      else setSearchTerm("");
    }, 400);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  // Keep local state in sync when URL changes (server navigation).
  useEffect(() => {
    const page = searchParams.get("page");
    const category = searchParams.get("category");
    const limitParam = searchParams.get("limit");
    const q = searchParams.get("q") || "";
    const sort = searchParams.get("sort") || "";

    if (page) setCurrentPage(parseInt(page, 10));
    else setCurrentPage(1);

    if (category) setCategoryFilter([category]);
    else {
      setCategoryFilter([]);
      setGenreFilter([]);
      setLanguageFilter([]);
      setFormatFilter([]);
      setPriceRange([]);
      setSortOption("");
      setSelectedV1Genres([]);
      setSearchQuery("");
      setSearchTerm("");
    }

    if (limitParam) setLimit(parseInt(limitParam, 10));
    else setLimit(15);

    setSearchQuery(q);
    setSearchTerm(q);
    setSortOption(sort);

    setLanguageFilter(searchParams.getAll("language") || []);
    setFormatFilter(searchParams.getAll("format") || []);
    setSelectedV1Genres(searchParams.getAll("genre") || []);
  }, [searchParams]);

  // Apply server-provided v1 data whenever it changes.
  useEffect(() => {
    const categorySelected = categoryFilter.length > 0;
    setUseV1Api(categorySelected);

    if (!categorySelected) return;

    setLoading(false);
    setError(null);

    if (!initialV1 || !Array.isArray(initialV1.books)) {
      setBooks([]);
      setTotalPages(1);
      setTotalCount(0);
      setV1LanguageCounts({});
      setV1FormatCounts({});
      setV1Genres([]);
      return;
    }

    setBooks(initialV1.books);
    setTotalPages(initialV1.totalPages || 1);
    setTotalCount(initialV1.total || initialV1.books.length);
    setV1LanguageCounts(initialV1.languageCounts || {});
    setV1FormatCounts(initialV1.formatCounts || {});
    setV1Genres(initialV1.genres || []);
  }, [initialV1, categoryFilter]);

  // When v1 is not active, keep existing client-side list behavior (if any).
  useEffect(() => {
    if (useV1Api) return;

    const uniqueBooks = removeDuplicateByLanguagePriority(filteredBooks);
    setFilteredBooks(uniqueBooks);

    const sortedBooks = [...uniqueBooks].sort((a, b) => {
      if (sortOption === "Title: A to Z") return a.title.localeCompare(b.title);
      if (sortOption === "Title: Z to A") return b.title.localeCompare(a.title);
      if (sortOption === "Price: Lowest First") return a.price - b.price;
      if (sortOption === "Price: Highest First") return b.price - a.price;
      const yearCompare = (b.publish_year || 0) - (a.publish_year || 0);
      if (yearCompare !== 0) return yearCompare;
      return (b.publish_month || 0) - (a.publish_month || 0);
    });

    const startIndex = (currentPage - 1) * limit;
    const endIndex = startIndex + limit;
    setBooks(sortedBooks.slice(startIndex, endIndex));
    setTotalPages(Math.ceil(sortedBooks.length / limit) || 1);
    setTotalCount(uniqueBooks.length);
    setLoading(false);
  }, [
    useV1Api,
    currentPage,
    limit,
    categoryFilter,
    genreFilter,
    languageFilter,
    formatFilter,
    priceRange,
    sortOption,
    filteredBooks,
  ]);

  // Update URL so the server re-fetches v1 results.
  useEffect(() => {
    const params = new URLSearchParams();

    if (currentPage > 1) params.set("page", String(currentPage));
    if (limit !== 15) params.set("limit", String(limit));
    if (categoryFilter.length > 0) params.set("category", categoryFilter[0]);

    if (sortOption) params.set("sort", sortOption);
    if (searchTerm) params.set("q", searchTerm);

    (languageFilter || []).forEach((v) => v && params.append("language", v));
    (formatFilter || []).forEach((v) => v && params.append("format", v));
    (selectedV1Genres || []).forEach((v) => v && params.append("genre", v));

    const currentParams = new URLSearchParams(window.location.search);
    if (currentParams.toString() === params.toString()) return;

    setLoading(true);
    startTransition(() => {
      router.replace(`/books${params.toString() ? `?${params.toString()}` : ""}`, {
        scroll: false,
      });
    });
  }, [
    currentPage,
    limit,
    categoryFilter,
    sortOption,
    searchTerm,
    languageFilter.join(","),
    formatFilter.join(","),
    selectedV1Genres.join(","),
    router,
    startTransition,
  ]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setShowFilters(false);
      }
    };

    if (showFilters) document.addEventListener("mousedown", handleClickOutside);
    else document.removeEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showFilters]);

  const getDisplayRange = () => {
    const total = useV1Api ? totalCount : filteredBooks.length;
    const pageSize = useV1Api ? PAGE_SIZE : limit;
    const start = (currentPage - 1) * pageSize + 1;
    const end = Math.min(currentPage * pageSize, total);
    return { start, end, total };
  };

  const category = [...new Set(allBooks.filter((b) => b.category).map((b) => b.category))];
  const scopedBooks = allBooks.filter((book) => {
    const specialCategories = ["bestsellers", "new-releases", "coming-soon"];
    const isSpecialCategory =
      categoryFilter.length > 0 && specialCategories.includes(categoryFilter[0]);
    const categoryCondition =
      categoryFilter.length === 0 ||
      isSpecialCategory ||
      categoryFilter.includes(book.category);

    const genreCondition =
      genreFilter.length === 0 ||
      genreFilter.some((genre) => {
        const [cat, subgenre] = genre.split(": ");
        return book.category === cat && book.genre?.includes(subgenre);
      });

    return categoryCondition && genreCondition;
  });

  const language = useV1Api
    ? Object.keys(v1LanguageCounts || {})
    : [...new Set(scopedBooks.map((book) => book.language).filter(Boolean))];

  const format = useV1Api
    ? Object.keys(v1FormatCounts || {})
    : [...new Set(scopedBooks.map((book) => book.book_format).filter(Boolean))];

  const handlePageChange = (newPage) => setCurrentPage(newPage);

  if (error) {
    return (
      <div className="container mx-auto py-10 px-4 text-center">
        <h2 className="text-2xl font-bold mb-4">Error</h2>
        <p>{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <Suspense fallback={<div>Loading filters...</div>}>
      <main className="flex flex-col h-full pb-20 mx-auto top_bg_gradient">
        <HelmetProvider>
          <Helmet>
            <title>All Books | BluOne Ink Publishing</title>
            <meta
              name="description"
              content="Fiction, Non-fiction, and Children books published in HARDCOVER, PAPERBACK, and eBook formats, in English, Hindi, Rajasthani, Bengali, Marathi and Telugu."
            />
            <link rel="canonical" href="https://www.bluone.ink/books" />
          </Helmet>
        </HelmetProvider>

        <div className="container px-8  mx-auto">
          <div className="w-full lg:flex flex-wrap items-center">
            <div className="w-full lg:w-[25%]">
              <h1 className="text-[36px] font-medium pt-12 pb-10 lg:pb-20">
                {categoryFilter.length > 0
                  ? categoryFilter[0] === "bestsellers"
                    ? "Best Seller"
                    : categoryFilter[0] === "new-releases"
                      ? "New Releases"
                      : categoryFilter[0] === "coming-soon"
                        ? "Coming Soon"
                        : categoryFilter[0]
                  : "All Books"}
              </h1>
            </div>

            <div className="w-full lg:w-[75%] flex-wrap md:flex gap-4 relative">
              <div className="w-full flex-1">
                <div className="relative flex h-[52px]">
                  <FiSearch className="absolute searchicon left-4 w-6 h-6 text-[#8A8A8A]" />
                  {searchQuery && (
                    <FiXCircle
                      className="absolute right-4 top-3.5 w-6 h-6 text-gray-500 cursor-pointer"
                      onClick={() => setSearchQuery("")}
                    />
                  )}
                  <input
                    type="text"
                    placeholder="Which Book or Author interests you today?"
                    className="p-3 h-[52px] bg-transparent input-border shadow-sm rounded-3xl w-full mb-4 text-black pl-12 placeholder:italic"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              <BooksFilters
                showFilters={showFilters}
                setShowFilters={setShowFilters}
                filterRef={filterRef}
                sortOption={sortOption}
                setSortOption={setSortOption}
                useV1Api={useV1Api}
                v1Genres={v1Genres}
                selectedV1Genres={selectedV1Genres}
                setSelectedV1Genres={setSelectedV1Genres}
                category={category}
                categoryFilter={categoryFilter}
                setCategoryFilter={setCategoryFilter}
                allBooks={allBooks}
                genreFilter={genreFilter}
                setGenreFilter={setGenreFilter}
                language={language}
                languageFilter={languageFilter}
                setLanguageFilter={setLanguageFilter}
                format={format}
                formatFilter={formatFilter}
                setFormatFilter={setFormatFilter}
                v1LanguageCounts={v1LanguageCounts}
                v1FormatCounts={v1FormatCounts}
              />
            </div>
          </div>

          {loading || isPending ? <Loader /> : <BooksGrid books={books} />}

          {books.length > 0 && (
            <div className="w-full flex-wrap md:flex justify-center md:justify-between pt-4">
              <div className="flex justify-center md:justify-between">
                <i>
                  <p>
                    Showing {getDisplayRange().start}-{getDisplayRange().end} of{" "}
                    {getDisplayRange().total} Books
                  </p>
                </i>
              </div>
              <div className="flex justify-center gap-2 items-center">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (pageNum) => (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`p-1 px-2.5 py-0 text-lg font-medium font-barlow text-[#8A8A8A] rounded-full ${
                        pageNum === currentPage
                          ? "bg-[#8A8A8A66] text-black"
                          : "bg-white hover:bg-[#241b6d] hover:text-white"
                      }`}
                      disabled={pageNum === currentPage}
                    >
                      {pageNum}
                    </button>
                  )
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </Suspense>
  );
}

