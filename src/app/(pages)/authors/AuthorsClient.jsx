"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import AuthorsCards from "./authorsCards";
import { FiSearch, FiXCircle } from "react-icons/fi";
import AlphabetFilter from "@/app/components/AlphabetFilter";
import Loader from "@/app/components/Loader";
import { getPortalBaseUrl } from "@/app/API/portalBaseUrl";
import { MdOutlineArrowLeft, MdOutlineArrowRight } from "react-icons/md";
import { HelmetProvider } from "react-helmet-async";
import { Helmet } from "react-helmet";

const AUTHORS_API = `${getPortalBaseUrl()}/api/v1/public/authors/list`;
const AUTHORS_PER_PAGE = 18;

export default function AuthorsClient({
  initialAuthors = [],
  initialTotal = 0,
  initialTotalPages = 1,
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [alphabetFilter, setAlphabetFilter] = useState("ALL");
  const [authorsList, setAuthorsList] = useState(initialAuthors);
  const [total, setTotal] = useState(initialTotal);
  const [totalPages, setTotalPages] = useState(Math.max(1, initialTotalPages));
  const [loading, setLoading] = useState(false);
  const skippedInitialFetch = useRef(false);

  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery.trim());
    }, 400);
    return () => clearTimeout(t);
  }, [searchQuery]);

  useEffect(() => {
    // First page payload is server-rendered; skip duplicate client fetch on mount.
    if (!skippedInitialFetch.current) {
      skippedInitialFetch.current = true;
      return;
    }

    const fetchAuthors = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          page: String(currentPage),
          limit: String(AUTHORS_PER_PAGE),
        });
        if (debouncedSearchQuery) params.set("search", debouncedSearchQuery);
        if (alphabetFilter !== "ALL") params.set("letter", alphabetFilter);

        const response = await fetch(`${AUTHORS_API}?${params.toString()}`, { cache: "no-store" });
        const data = await response.json();

        if (!response.ok) {
          setAuthorsList([]);
          setTotal(0);
          setTotalPages(1);
          return;
        }

        // setAuthorsList(data.authors || []);
        const filteredAuthors = (data.authors || []).filter(
          (author) => author.name !== "Testing Author"
        );
        
        setAuthorsList(filteredAuthors);
        setTotal(data.total ?? 0);
        setTotalPages(Math.max(1, data.totalPages ?? 1));
      } catch (error) {
        console.error("Error fetching authors:", error);
        setAuthorsList([]);
        setTotal(0);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    };

    fetchAuthors();
  }, [currentPage, debouncedSearchQuery, alphabetFilter]);

  useEffect(() => {
    if (currentPage > totalPages && totalPages >= 1) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  const indexOfFirstAuthor = (currentPage - 1) * AUTHORS_PER_PAGE;
  const indexOfLastAuthor = Math.min(currentPage * AUTHORS_PER_PAGE, total);
  const currentAuthors = authorsList;

  return (
    <main className="flex flex-col h-full pb-20 mx-auto top_bg_gradient">
      <HelmetProvider>
        <Helmet>
          <title>All Authors | BluOne Ink Publishing</title>
          <meta
            name="description"
            content="Meet the 75+ Indian and International Authors who trusted BluOne Ink with the publication of their creative and influential manuscripts."
          />
          <link rel="canonical" href="https://www.bluone.ink/authors" />
        </Helmet>
      </HelmetProvider>
      <div className="container px-4 mx-auto">
        <div className="w-full flex justify-center">
          <h1 className="text-[42px] font-medium pt-20 pb-14">All Authors</h1>
        </div>

        <div className="w-full flex justify-between items-center pt-6 pb-2">
          <div className="w-full">
            <div className="relative">
              <FiSearch className="absolute left-4 top-3 w-6 h-6 text-[#8A8A8A]" />
              {searchQuery && (
                <FiXCircle
                  className="absolute right-4 top-3.5 w-6 h-6 text-[#8A8A8A] cursor-pointer"
                  onClick={() => setSearchQuery("")}
                />
              )}
              <input
                type="text"
                placeholder="Which Author interests you today?"
                className="p-3 bg-transparent input-border shadow-sm rounded-3xl w-full mb-4 text-black pl-12 placeholder:italic"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
          </div>
        </div>

        <div className="w-full pt-2">
          <AlphabetFilter
            value={alphabetFilter}
            onFilter={(selectedAlphabet) => {
              setAlphabetFilter(selectedAlphabet);
              setCurrentPage(1);
            }}
          />
        </div>

        {loading ? (
          <div className="pt-6">
            <Loader />
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 pt-6">
            {currentAuthors.length > 0 ? (
              currentAuthors.map((author) => (
                <div
                  key={author.id}
                  className="p-4 hover:shadow-md input-border border-[#ffffff00] hover:border-[#BABABA] rounded-md"
                >
                  <Link href={`/authors/${author.slug}`}>
                    <AuthorsCards
                      coverImage={author.imageUrl}
                      authorName={author.name || "Unknown Author"}
                    />
                  </Link>
                </div>
              ))
            ) : (
              <p className="text-center col-span-full mt-4">No results found</p>
            )}
          </div>
        )}

        <div className="w-full flex-wrap  md:flex justify-center md:justify-between mt-10">
          {!loading && currentAuthors.length > 0 && (
            <div className="flex justify-center pb-5 md:justify-between">
              <i>
                <p>
                  Showing {indexOfFirstAuthor + 1}-{indexOfLastAuthor} of {total}{" "}
                  Authors
                </p>
              </i>
            </div>
          )}

          {!loading && currentAuthors.length > 0 && totalPages > 1 && (
            <div className="flex justify-center gap-2 items-center">
              {currentPage > 1 && (
                <button
                  onClick={() => {
                    setCurrentPage((prev) => prev - 1);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="p-2 mx-2 flex items-center text-[#241b6d] hover:rounded-md hover:text-[#241b6d]"
                >
                  <MdOutlineArrowLeft className="w-6 h-6" />
                </button>
              )}

              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setCurrentPage(i + 1);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className={`p-1 px-2.5 py-0 text-lg font-medium font-barlow text-[#8A8A8A] rounded-full  ${
                    currentPage === i + 1
                      ? "bg-[#8A8A8A66] text-black"
                      : "bg-white hover:bg-[#241b6d] hover:text-white"
                  }`}
                >
                  {i + 1}
                </button>
              ))}

              {currentPage < totalPages && (
                <button
                  onClick={() => {
                    setCurrentPage((prev) => prev + 1);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="p-2 mx-2 flex items-center text-[#241b6d] hover:rounded-md hover:text-[#241b6d]"
                >
                  <MdOutlineArrowRight className="text-[#241b6d] w-6 h-6" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

