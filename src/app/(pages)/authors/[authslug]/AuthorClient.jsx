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

const iqbalBooks = [
  {
    image: "https://bluone-ink.s3.us-east-1.amazonaws.com/books/thumbnails/the-nukes-the-jihad-the-hawalas-and-crystal-meth-a-tale-of-treachery_thumbnail_1.jpg",
    title: "The Nukes, the Jihad, the Hawalas, and Crystal Meth: A Tale of Treachery",
    description: "Iqbal Chand Malhotra",
    year: "2024"
  },
  {
    image: "/81LrqJ1o0wL._SY466_.jpg",
    title: "Red Fear: The China Threat",
    description: "Iqbal Chand Malhotra",
    year: "2020"
  },
  {
    image: "/71QPU8QHowL._SY342_.jpg",
    title: "Dark Secrets: Politics, Intrigue and Proxy Wars in Kashmir",
    description: "Iqbal Chand Malhotra",
    year: "2024"
  },
  {
    image: "/71gG1mfJ1XL._SY466_.jpg",
    title: "The Bomb, The Bank, The Mullah and The Poppies: A Tale of Deception",
    description: "Iqbal Chand Malhotra",
    year: "2023"
  },
  {
    image: "/81W6dQ3rnFL._SY466_.jpg",
    title: "Kashmir's Untold Story: Declassified",
    description: "Iqbal Chand Malhotra",
    year: "2021"
  }

];

export default function AuthorClient({ authorInfo, hasSpotlights }) {
  const isSpecialAuthor1 =
    authorInfo?.author_name?.trim() ===
    "Iqbal Chand Malhotra";

  const isSpecialAuthor2 =
    authorInfo?.author_name?.trim() ===
    "Subroto Chattopadhyay";
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
        {isSpecialAuthor1 && (
          <section id="related-titles" className="container mx-auto px-4 mt-10">

            {/* Heading */}
            <div className="flex items-center gap-2 justify-center pt-6">
              <Image src={inkdouble1} width={55} height={55} alt="inkdouble1" />
              <h3 className="font-medium text-base md:text-3xl text-center">
                Others Books By {authorInfo.author_name}
              </h3>
              <Image src={inkdouble2} width={55} height={55} alt="inkdouble2" />
            </div>

            {/* Cards Container */}
            <div className="flex flex-wrap justify-center mt-2">

              {iqbalBooks.map((book, i) => (
                <div
                  key={i}
                  className="p-4 mb-4 hover:shadow-md input-border border-[#ffffff00] hover:border-[#BABABA] rounded-md w-full sm:w-1/2 md:w-1/3 lg:w-1/4"
                >
                  <div className="w-full min-h-[300px] flex flex-col h-full">

                    {/* Image */}
                    <div className="relative w-full h-[200px] lg:h-[300px]">
                      <Image
                        src={book.image}
                        alt="event"
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <h6 className="pt-4 uppercase font-semibold font-barlow leading-5">
                        {book.title}
                      </h6>

                      <h4 className="uppercase font-normal font-barlow pt-2 text-base leading-5 text-[#0d1928e8]">
                        {book.description}
                      </h4>

                      <p className="text-gray-500">{book.year}</p>
                    </div>

                  </div>
                </div>
              ))}

            </div>
          </section>
        )}

        {isSpecialAuthor2 && (
          <section id="related-titles" className="container mx-auto px-4 mt-10">

            {/* Heading */}
            <div className="flex items-center gap-2 justify-center pt-6">
              <Image src={inkdouble1} width={55} height={55} alt="inkdouble1" />
              <h3 className="font-medium text-base md:text-3xl text-center">
                Others Books By {authorInfo.author_name}
              </h3>
              <Image src={inkdouble2} width={55} height={55} alt="inkdouble2" />
            </div>

            {/* Cards Container */}
            <div className="flex flex-wrap justify-center mt-2">

              {[1, 2, 3, 4].map((_, i) => (
                <div
                  key={i}
                  className="p-4 mb-4 hover:shadow-md input-border border-[#ffffff00] hover:border-[#BABABA] rounded-md w-full sm:w-1/2 md:w-1/3 lg:w-1/4"
                >
                  <div className="w-full min-h-[300px] flex flex-col h-full">

                    {/* Image */}
                    <div className="relative w-full h-[200px] lg:h-[300px]">
                      <img
                        src="/blogs.png"
                        alt="event"
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <h6 className="pt-4 uppercase font-semibold font-barlow leading-5">
                        Test
                      </h6>

                      <h4 className="uppercase font-normal font-barlow pt-2 text-base leading-5 text-[#0d1928e8]">
                        testing 123
                      </h4>

                      <p className="text-gray-500">2001</p>
                    </div>

                  </div>
                </div>
              ))}

            </div>
          </section>
        )}
        <div className="books-section w-full mt-10">
          <div className="flex items-center gap-2 justify-center pt-6">
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

          <div className="wrapper mt-2 flex flex-wrap justify-center">
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

