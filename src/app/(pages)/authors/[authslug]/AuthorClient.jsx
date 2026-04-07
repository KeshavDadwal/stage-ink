"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import inkdouble1 from "@/app/assests/image/inkdouble1.svg";
import inkdouble2 from "@/app/assests/image/inkdouble2.svg";
import bgauthor from "@/app/assests/image/authors-back.svg";
import AuthorBooksCards from "../authorBooksCards";
import Spotlight from "@/app/components/Spotlight";
import {
  FaLinkedinIn,
  FaFacebookF,
  FaInstagram,
  FaYoutube,
  FaTwitter,
} from "react-icons/fa";

const defaultImage = "/author-defaultimages.png";

export default function AuthorClient({ authorInfo,hasSpotlights }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const descriptionText = authorInfo.authorDescription || "";
  const { shortDescription, fullDescription, hasMore } = useMemo(() => {
    const words = descriptionText.split(/\s+/).filter(Boolean);
    return {
      shortDescription:
        words.slice(0, 80).join(" ") + (words.length > 80 ? "" : ""),
      fullDescription: descriptionText,
      hasMore: words.length > 80,
    };
  }, [descriptionText]);

  const socials = Array.isArray(authorInfo.authorSocial)
    ? authorInfo.authorSocial
    : [];

  return (
    <main className="wrapper pt-0 pb-10">
      <div className="container pt-20">
        <div className="relative pb-20">
          <div className="absolute top-0 left-0 right-0 pb-20 z-[10]">
            <img
              className="m-auto p-1 aspect-square object-cover border-2 border-dashed border-[#241B6D] rounded-full"
              src={authorInfo.image || defaultImage}
              alt="Author"
              width={300}
              height={250}
            />
          </div>
        </div>

        <div
          className="author-details-container mx-auto p-10 rounded-2xl w-full lg:w-[65%] bg-cover bg-center mt-20"
          style={{ position: "relative" }}
        >
          <Image
            src={bgauthor}
            alt="Background"
            fill
            style={{ objectFit: "cover", objectPosition: "top" }}
          />
          <div className="text-center" style={{ position: "relative", zIndex: 1 }}>
            <h4 className="mt-20 pt-10 text-[28px] lg:text-4xl mb-5">
              {authorInfo.author_name}
            </h4>

            <p className="text-start pt-4 pb-4 ">
              {isExpanded ? fullDescription : shortDescription}
              &nbsp;
              {hasMore && (
                <button
                  onClick={() => setIsExpanded((v) => !v)}
                  className="text-[#0D1928] underline font-medium focus:outline-none"
                >
                  {isExpanded ? "Read Less" : "Read More"}
                </button>
              )}
            </p>

            <ul className="flex flex-wrap justify-center gap-6 pb-6">
              {socials.map((social, index) => {
                const s = String(social || "").trim();
                if (!s) return null;

                let Icon = null;
                const lower = s.toLowerCase();
                if (lower.includes("linkedin")) Icon = FaLinkedinIn;
                else if (lower.includes("facebook")) Icon = FaFacebookF;
                else if (lower.includes("instagram")) Icon = FaInstagram;
                else if (lower.includes("youtube")) Icon = FaYoutube;
                else if (lower.includes("twitter") || lower.includes("x.com"))
                  Icon = FaTwitter;

                if (!Icon) return null;

                return (
                  <li key={index} className="list-none">
                    <a
                      href={s}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 flex items-center justify-center rounded-full border border-[#0D1928] text-[#0D1928]
                                hover:bg-[#0D1928] hover:text-white transition-all duration-300"
                    >
                      <Icon size={18} />
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        <div className="books-section w-full pt-20">
          <div className="flex items-center gap-2 justify-center pb-6 pt-6">
            <Image src={inkdouble1} width={55} height={55} alt="inkdouble1" />
            <i>
              <h3 className="font-semibold text-base md:text-3xl text-center">
                {authorInfo.books.length >= 2
                  ? `${authorInfo.author_name}'s books published by BluOne Ink`
                  : `${authorInfo.author_name}'s book published by BluOne Ink`}
              </h3>
            </i>
            <Image src={inkdouble2} width={55} height={55} alt="inkdouble2" />
          </div>

          <div className="wrapper mt-12 flex flex-wrap justify-center">
            {authorInfo.books.length > 0 ? (
              authorInfo.books.map((book, i) => (
                <div
                  key={book.id || i}
                  className="p-4 mb-4 hover:shadow-md input-border border-[#ffffff00] hover:border-[#BABABA] rounded-md md:w-1/2 lg:w-1/4"
                >
                  <Link
                    href={`/books/${book.slug}`}
                    style={{ textDecoration: "none" }}
                    prefetch={false}
                  >
                    <AuthorBooksCards
                      title={book.title}
                      thumbnailUrl={book.thumbnailUrl}
                      publishYear={
                        book.publishYear ||
                        (book.publishDate
                          ? new Date(book.publishDate).getFullYear()
                          : "")
                      }
                      authorName={authorInfo.author_name}
                      imageContainerClass="h-[400px] lg:h-[450px]"
                    />
                  </Link>
                </div>
              ))
            ) : (
              
              <p>No related books found for this author.</p>
            )}
          </div>
        </div>
      </div>

      <Spotlight hasSpotlights={hasSpotlights} />
    </main>
  );
}

