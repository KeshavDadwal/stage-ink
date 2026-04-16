"use client";
import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { RiArrowLeftSLine, RiArrowRightSLine } from "react-icons/ri";
import inkdouble1 from "@/app/assests/image/inkdouble1.svg";
import inkdouble2 from "@/app/assests/image/inkdouble2.svg";
import CurveTop from "@/app/assests/image/aboutauthorbg.png";
import BooksCards from "../BooksCards";
import ScriptLoader from "@/app/ScriptLoader";
import ShareButtons from "@/app/components/ImagePreviewSection";
import Loader from "@/app/components/Loader";
import Spotlight from "@/app/components/Spotlight";
import Catalog from "../../../assests/image/ink_catalog_cover_2026.webp";
import {
  FaLinkedinIn,
  FaFacebookF,
  FaInstagram,
  FaYoutube,
  FaTwitter,
} from "react-icons/fa";
export default function BookPageClient({ bookInfo, relatedBooks, versions, slug }) {
  const [mounted, setMounted] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [isAuthExpanded, setIsAuthExpanded] = useState(false);
  const [activeAuthorDetails, setActiveAuthorDetails] = useState(
    bookInfo?.authors?.[0] || bookInfo?.author || null
  );
  const [selectedImage, setSelectedImage] = useState(null);
  const [showButtons, setShowButtons] = useState(false);
  const [mediaStartIndex, setMediaStartIndex] = useState(0);
  const [activeMediaModal, setActiveMediaModal] = useState(null);
  const [mediaModalNonce, setMediaModalNonce] = useState(0);
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll("section[id]");
      let currentSection = "";

      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        if (rect.top >= 0 && rect.top <= window.innerHeight / 2) {
          currentSection = section.getAttribute("id");
        }
      });

      setActiveSection(currentSection);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const authorimgurl = "/author-defaultimages.png";

  const processImageUrl = (url) => {
    if (!url) return "";
    return url.replace(/[\[\]"]/g, "").trim();
  };

  const thumbnails = useMemo(() => {
    const raw = bookInfo?.book_thumbnail;
    if (Array.isArray(raw)) return raw.map(processImageUrl);
    if (typeof raw === "string") return [processImageUrl(raw)];
    return [];
  }, [bookInfo?.book_thumbnail]);

  const clonedThumbnails = useMemo(
    () => [...thumbnails, ...thumbnails].filter(Boolean),
    [thumbnails]
  );

  const authorNames = useMemo(() => {
    if (Array.isArray(bookInfo?.authors) && bookInfo.authors.length > 0) {
      return bookInfo.authors.map((a) => a.author_name);
    }
    if (bookInfo?.author?.author_name) return [bookInfo.author.author_name];
    return ["Unknown Author"];
  }, [bookInfo]);

  const maxLength = 500;

  const toggleExpand = () => setIsExpanded((v) => !v);
  const isSpecialBook =
    bookInfo?.title?.trim() ===
    "Bangladesh: Humiliation, Carnage, Liberation, Chaos";
  const socialMediaItems = [
    {
      platform: "Instagram",
      image: "Image1.png",
      watchUrl:
        "https://www.instagram.com/reel/DSpjK7WgWv9/?utm_source=ig_web_copy_link",
      embedUrl: "https://www.instagram.com/reel/DSpjK7WgWv9/embed",
    },
    {
      platform: "Instagram",
      image: "Image2.png",
      watchUrl:
        "https://www.instagram.com/reel/DVbdYlmgaR7/?utm_source=ig_web_copy_link",
      embedUrl: "https://www.instagram.com/reel/DVbdYlmgaR7/embed",
    },
    {
      platform: "Instagram",
      image: "Image3.png",
      watchUrl:
        "https://www.instagram.com/reel/DWUGbT4gT2k/?utm_source=ig_web_copy_link",
      embedUrl: "https://www.instagram.com/reel/DWUGbT4gT2k/embed",
    },
    {
      platform: "Instagram",
      image: "Image1.png",
      watchUrl:
        "https://www.instagram.com/reel/DSFbINBgQPz/?utm_source=ig_web_copy_link",
      embedUrl: "https://www.instagram.com/reel/DSFbINBgQPz/embed",
    },
    {
      platform: "YouTube",
      watchUrl: "https://youtu.be/iv_wI-9Rn2I?si=tC7gwTHOrI8fDhFY",
      embedUrl: "https://www.youtube.com/embed/iv_wI-9Rn2I",
    },
  ];
  const visibleMediaItems = [socialMediaItems[mediaStartIndex]];
  const desktopMediaItems = socialMediaItems.slice(0, 5);

  const handlePrevMedia = () => {
    setMediaStartIndex((prev) =>
      prev === 0 ? socialMediaItems.length - 1 : prev - 1
    );
  };

  const handleNextMedia = () => {
    setMediaStartIndex((prev) => (prev + 1) % socialMediaItems.length);
  };

  const openMediaModal = (item) => {
    setActiveMediaModal(item);
    // Force iframe remount so autoplay is retriggered even for same video.
    setMediaModalNonce((prev) => prev + 1);
  };

  useEffect(() => {
    const autoSlideTimer = setInterval(() => {
      setMediaStartIndex((prev) => (prev + 1) % socialMediaItems.length);
    }, 3500);

    return () => clearInterval(autoSlideTimer);
  }, [socialMediaItems.length]);

  useEffect(() => {
    if (!activeMediaModal) return undefined;
    const onKey = (e) => {
      if (e.key === "Escape") setActiveMediaModal(null);
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [activeMediaModal]);

  const getMediaThumbnailUrl = (item) => {
    if (item?.thumbnailUrl) return item.thumbnailUrl;
    const staticName = item?.image != null ? String(item.image).trim() : "";
    if (staticName) {
      const path = staticName.startsWith("/") ? staticName : `/${staticName}`;
      return path;
    }
    if (item?.platform === "YouTube") {
      const match = item.embedUrl?.match(/embed\/([^?&]+)/);
      if (match) return `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg`;
    }
    return null;
  };

  const embedUrlWithAutoplay = (item) => {
    const embedUrl = item?.embedUrl;
    if (!embedUrl) return embedUrl;
    const sep = embedUrl.includes("?") ? "&" : "?";

    // YouTube autoplay is usually blocked unless muted.
    if (item?.platform === "YouTube") {
      return `${embedUrl}${sep}autoplay=1&mute=1&playsinline=1&rel=0`;
    }

    // Instagram embeds do not reliably support forced autoplay.
    return embedUrl;
  };

  return (
    <>
      <main id="top" suppressHydrationWarning>
        {!mounted ? (
          <div className="min-h-[60vh] flex items-center justify-center">
            <Loader />
          </div>
        ) : (
          <>
            <ScriptLoader />
            <section className="relative z-[111] bg-white">
              <div className="container bg-white p-6 mt-10 z-50">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8">
                  <div className="w-full md:w-[50%] lg:sticky lg:top-14 h-fit flex flex-wrap lg:flex-nowrap lg:flex gap-4">
                    <div className="md:hidden block">
                      <div className="flex gap-1 text-[#000]">
                        <p className="flex items-center text-[12px] font-semibold">
                          <Link href={`/books`}>Books</Link>
                        </p>
                        <p className="flex items-center pt-1 w-3">
                          <RiArrowRightSLine />
                        </p>
                        <p className="flex items-center text-[12px]">
                          <Link href={`/books?category=${bookInfo.category}`}>
                            {bookInfo.category}
                          </Link>
                        </p>
                      </div>
                      <h2 className="text-[28px] lg:text-4xl font-semibold">
                        {bookInfo.title}
                      </h2>
                      <div className="flex flex-wrap items-center gap-1">
                        {authorNames.map((author, index) => {
                          const authorObj = bookInfo.authors?.find(
                            (a) => a.author_name === author
                          );
                          const key = authorObj?.authslug ?? authorObj?.id ?? index;
                          return (
                            <i key={key}>
                              <div className="flex items-center pt-2">
                                <Link
                                  href={`/authors/${authorObj?.authslug || ""}`}
                                  className="text-[20px] text-[#007DD7]"
                                >
                                  {author}
                                </Link>
                                {index < authorNames.length - 1 && <span>,&nbsp;</span>}
                              </div>
                            </i>
                          );
                        })}
                      </div>
                      <p className="text-xl font-bold mt-2">₹{bookInfo.price}</p>
                    </div>

                    <div className="order-2 lg:order-1 flex lg:flex-col gap-4 overflow-x-auto">
                      <div
                        className="w-12 h-12 bg-gray-300 border lg:overflow-hidden cursor-pointer relative"
                        onClick={() =>
                          setSelectedImage(processImageUrl(bookInfo.book_image))
                        }
                      >
                        <Image
                          src={processImageUrl(bookInfo.book_image)}
                          alt="Default Thumbnail"
                          fill
                          sizes="48px"
                          className="object-cover"
                        />
                      </div>

                      {clonedThumbnails &&
                        clonedThumbnails.length > 0 &&
                        clonedThumbnails.slice(0, 5).map((thumbnail, i) => (
                          <div
                            key={`${thumbnail}-${i}`}
                            className="w-12 h-12 bg-gray-300 border overflow-hidden cursor-pointer relative"
                            onClick={() => setSelectedImage(thumbnail)}
                          >
                            <Image
                              src={thumbnail}
                              alt={`Thumbnail ${i + 1}`}
                              fill
                              sizes="48px"
                              className="object-cover"
                            />
                          </div>
                        ))}
                    </div>

                    <div className="order-1 lg:order-2 w-full h-[500px] bg-gray-200 border flex items-center justify-center overflow-hidden relative">
                      <Image
                        src={selectedImage || processImageUrl(bookInfo.book_image)}
                        alt={bookInfo.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-contain"
                      />
                    </div>
                  </div>

                  <div className="w-full md:w-[50%] space-y-4">
                    <div className="hidden md:block">
                      <div className="flex gap-1 text-[#000]">
                        <p className="flex items-center text-[12px] font-semibold">
                          <Link href={`/books`}>Books</Link>
                        </p>
                        <p className="flex items-center pt-1 w-3">
                          <RiArrowRightSLine />
                        </p>
                        <p className="flex items-center text-[12px]">
                          <Link href={`/books?category=${bookInfo.category?.split(",")[0]}`}>
                            {bookInfo.category?.split(",")[0]}
                          </Link>
                        </p>
                      </div>
                      <div className="flex gap-4 pt-2">
                        <h2 className="text-[28px] leading-8 font-semibold">{bookInfo.title}</h2>
                        {mounted ? <ShareButtons /> : null}
                      </div>

                      <div className="flex flex-wrap items-center gap-1">
                        {authorNames.map((author, index) => {
                          const authorObj = bookInfo.authors?.find(
                            (a) => a.author_name === author
                          );
                          const key = authorObj?.authslug ?? authorObj?.id ?? index;
                          return (
                            <i key={key}>
                              <div className="flex text-[16px] items-center pt-2">
                                <Link
                                  href={`/authors/${authorObj?.authslug || ""}`}
                                  className="text-[16px] text-[#007DD7]"
                                >
                                  {author}
                                </Link>
                                {index < authorNames.length - 1 && <span>,&nbsp;</span>}
                              </div>
                            </i>
                          );
                        })}
                      </div>
                      <p className="text-xl font-semibold font-barlow mt-2">₹{bookInfo.price}</p>
                    </div>

                    {/* Show Buy Now button only if NOT special book */}
                    {!isSpecialBook && (
                      <button
                        className="bg-[#007DD7] text-white rounded-full px-6 py-2 text-sm font-medium font-barlow mb-4"
                        onClick={() => setShowButtons(!showButtons)}
                      >
                        Buy Now
                      </button>
                    )}

                    {/* Show links:
    - Always for special book
    - Toggle-based for others */}
                    {(isSpecialBook || showButtons) && (
                      <div className="flex flex-wrap md:gap-4 gap-2 pt-3">
                        {bookInfo.amazonlink && (
                          <Link href={bookInfo.amazonlink} target="_blank">
                            <button>
                              <Image src="/amazon_in.png" width={118} height={118} alt="Amazon India" />
                            </button>
                          </Link>
                        )}

                        {bookInfo.amazon_comlink && (
                          <Link href={bookInfo.amazon_comlink} target="_blank">
                            <button>
                              <Image src="/amazon_com.png" width={135} height={135} alt="Amazon.com" />
                            </button>
                          </Link>
                        )}

                        {bookInfo.flipkartlink && (
                          <Link href={bookInfo.flipkartlink} target="_blank">
                            <button>
                              <Image src="/flipkart.png" width={122} height={122} alt="Flipkart" />
                            </button>
                          </Link>
                        )}

                        {bookInfo.bookswagonLink && (
                          <Link href={bookInfo.bookswagonLink} target="_blank">
                            <button>
                              <Image src="/bookswagon.png" width={122} height={122} alt="Bookswagon" />
                            </button>
                          </Link>
                        )}

                        {bookInfo.sapnaBooksLink && (
                          <Link href={bookInfo.sapnaBooksLink} target="_blank">
                            <button>
                              <Image src="/sapna_btn.png" width={100} height={122} alt="Sapna" />
                            </button>
                          </Link>
                        )}
                      </div>
                    )}

                    {bookInfo.aiSheetUrl && (
                      <a
                        href={bookInfo.aiSheetUrl}
                        className="text-blue-600 underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Download AI Sheet
                      </a>
                    )}

                    <div>
                      <h3 className="text-[20px] lg:text-1xl font-semibold mt-4">Specification</h3>
                      <ul className="text-sm text-[#000] mt-1 space-y-0">
                        <li>
                          {Array.isArray(versions) && versions.length > 1 ? (
                            <>
                              <label htmlFor="language-select" className="mr-2">
                                Language:
                              </label>
                              <select
                                id="language-select"
                                className="border border-gray-300 rounded-lg px-2 py-1 text-sm"
                                onChange={(e) => {
                                  const selectedSlug = e.target.value;
                                  if (selectedSlug && selectedSlug !== bookInfo.slug) {
                                    window.location.href = `/books/${selectedSlug}`;
                                  }
                                }}
                                value={bookInfo.slug}
                              >
                                {versions.map((v) => (
                                  <option key={`${v.language}-${v.slug}`} value={v.slug}>
                                    {v.language}
                                  </option>
                                ))}
                              </select>
                            </>
                          ) : versions?.length === 1 ? (
                            <>
                              <span className="mr-2">Language:</span>
                              <span>{versions[0].language}</span>
                            </>
                          ) : null}
                        </li>
                        <li>Format: {bookInfo?.book_format}</li>
                        <li>Pages: {bookInfo.pages} pages</li>
                        <li>ISBN-13: {bookInfo.isbn13}</li>
                        <li>Item Weight: {bookInfo.weight}</li>
                        <li>Dimensions: {bookInfo.dimension}</li>
                        <li>Genre: {bookInfo?.genre}</li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-[20px] lg:text-1xl font-semibold mt-6">Description</h3>
                      <p className="text-[16px] leading-1 text-start font-normal book-info-html pt-2">
                        <span
                          className="text-[26px] font-ibm"
                          dangerouslySetInnerHTML={{
                            __html: (isExpanded
                              ? bookInfo.about_book
                              : `${bookInfo.about_book?.substring(0, maxLength)} `)
                              ?.replace(/&lt;/g, "<")
                              .replace(/&gt;/g, ">")
                              .replace(/&quot;/g, '"')
                              .replace(/&amp;/g, "&")
                              .replace(/\\"/g, '"')
                              .replace(/\\\\/g, "\\")
                              .replace(/&nbsp;/g, " "),
                          }}
                        />
                        {bookInfo.about_book && bookInfo.about_book.length > maxLength && (
                          <button
                            onClick={toggleExpand}
                            className="text-[#0D1928] underline font-medium inline"
                          >
                            {isExpanded ? "Read Less" : "Read More"}
                          </button>
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* About the Book Author */}
            {activeAuthorDetails &&
              activeAuthorDetails.author_name !== "Bluone Ink" &&
              Array.isArray(bookInfo.authors) &&
              bookInfo.authors.length > 0 && (
                <section
                  id="about-author"
                  className="container mx-auto text-center py-10 mt-20 pt-0 p-0 lg:w-[70%] lg:mx-auto"
                >
                  <div className="about-author author-details-container mx-auto p-10 pt-5 rounded-2xl w-full lg:w-[85%] bg-[#FF81001A]">
                    <div className="curve_img">
                      <Image src={CurveTop} alt="Curve Top" />
                    </div>

                    <div className="flex justify-center space-x-2 lg:space-x-4 mb-2">
                      {bookInfo.authors.map((author, index) => (
                        <div
                          key={author?.id ?? author?.authslug ?? index}
                          className={`cursor-pointer z-[10] ${activeAuthorDetails?.id === author.id
                            ? "border-[#FF8100] border-4 rounded-full"
                            : "opacity-80 grayscale"
                            }`}
                          onClick={() => {
                            setActiveAuthorDetails(author);
                            setIsAuthExpanded(false);
                          }}
                        >
                          <Image
                            src={author.image || authorimgurl}
                            alt={author.author_name}
                            width={150}
                            height={150}
                            className="rounded-full w-[100px] h-[100px] lg:w-[150px] lg:h-[150px] object-cover transition duration-200"
                          />
                        </div>
                      ))}
                    </div>

                    <div className="lg:p-8 pt-10 mx-auto">
                      <div className="relative z-[10]">
                        <h3 className="font-medium text-3xl mb-4">
                          {activeAuthorDetails?.author_name}
                        </h3>

                        <p className="text-gray-700 text-start mb-4 text-lg leading-relaxed">
                          {isAuthExpanded
                            ? activeAuthorDetails?.authorDescription ||
                            "Description not available."
                            : `${activeAuthorDetails?.authorDescription?.substring(0, 600) || ""}`}
                          {activeAuthorDetails?.authorDescription &&
                            activeAuthorDetails.authorDescription.length > 600 && (
                              <button
                                onClick={() => setIsAuthExpanded(!isAuthExpanded)}
                                className="text-[#0D1928] underline font-medium ml-2"
                              >
                                {isAuthExpanded ? "Read Less" : "Read More"}
                              </button>
                            )}
                        </p>

                        {activeAuthorDetails?.authorSocial &&
                          Object.keys(activeAuthorDetails.authorSocial).length > 0 && (
                            <ul className="flex flex-wrap justify-center gap-4 pb-6">
                              {Object.values(activeAuthorDetails.authorSocial).map((social, index) => {
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
                                  <li key={index}>
                                    <a
                                      href={s}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="w-10 h-10 flex items-center justify-center rounded-full border border-[#0D1928] text-[#0D1928] hover:bg-[#0D1928] hover:text-white transition-all duration-300"
                                    >
                                      <Icon size={18} />
                                    </a>
                                  </li>
                                );
                              })}
                            </ul>
                          )}

                        <div className="w-full">
                          <h6 className="text-[#007DD7] text-md">
                            {activeAuthorDetails?.authslug && (
                              <Link
                                href={`/authors/${activeAuthorDetails.authslug}`}
                                className="text-blue-500 underline"
                              >
                                Visit the Author Page
                              </Link>
                            )}
                          </h6>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              )}
          </>
        )}
        <section id="spotlight">
          <Spotlight bookSlug={bookInfo.slug?.replace(/-\d{13}$/, '') || bookInfo.slug} />
        </section>
        {isSpecialBook && (
          <>
            <div className='bg-[#ECEFFE] px-4 z-[11]'>
              <div className='container pt-[45px] pb-[60px] '>
                <div className="flex flex-col lg:flex-row w-full lg:w-[80%] mx-auto">

                  {/* LEFT COLUMN */}
                  <div className="w-full lg:w-[65%] p-4">
                    <div className="w-full lg:w-[90%]">
                      <i>
                        <p className="text-3xl pb-[45px] md:text-5xl font-medium text-left">
                          Ink in your Inbox
                        </p>
                      </i>

                      <iframe
                        data-tally-src="https://tally.so/embed/3XMW9z?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1"
                        loading="lazy"
                        width="100%"
                        height="200"
                        title="Ink in your Inbox"
                      />
                    </div>
                  </div>

                  {/* RIGHT COLUMN */}
                  <div className="w-full lg:w-[35%] p-4 text-center">

                    <div className="relative w-full h-64 sm:h-80 lg:h-96">
                      <Image
                        src="https://bluone-ink.s3.us-east-1.amazonaws.com/books/thumbnails/7480d688-fd8c-4220-b501-83627f53a8eb.jpg"
                        alt="Catalog"
                        fill
                        className="mb-3 mx-auto object-contain"
                      />
                    </div>

                    <a
                      href="/bangladesh-sample-chapter.pdf"
                      download
                      className="inline-block mt-3 px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition"
                    >
                      Download Sample Chapter (PDF)
                    </a>

                  </div>
                </div>
              </div>
            </div>

            <section id="related-titles" className="container mx-auto px-4 mt-8">

              {/* Heading */}
              <div className="mx-auto flex w-fit items-center justify-center gap-3 py-6 md:gap-4">
                <Image
                  src={inkdouble1}
                  width={55}
                  height={55}
                  alt="inkdouble1"
                  className="h-10 w-10 shrink-0 md:h-[55px] md:w-[55px]"
                />
                <h3 className="text-center text-xl font-semibold tracking-wide text-[#111] md:text-2xl">
                  Upcoming Events
                </h3>
                <Image
                  src={inkdouble2}
                  width={55}
                  height={55}
                  alt="inkdouble2"
                  className="h-10 w-10 shrink-0 md:h-[55px] md:w-[55px]"
                />
              </div>

              <div className="flex flex-col items-center gap-6">

                {/* Cards Row */}
                <div className="w-full md:w-1/2 mx-auto">

                  {/* Card */}
                  <div className="flex flex-col sm:flex-row bg-[#e9ddcf] rounded-lg overflow-hidden shadow-sm">

                    {/* Image */}
                    <div className="w-full sm:w-[60%] h-48 sm:h-auto">
                      <Image
                        src="https://bluone-ink.s3.us-east-1.amazonaws.com/events/banners/2e002f21-0598-4df7-846d-1d5be83bf4d1.jpeg"
                        alt="event"
                        width={800}
                        height={500}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Content */}
                    <div className="w-full sm:w-[40%] p-4 flex flex-col justify-center">
                      <h3 className="font-bold text-sm tracking-wide uppercase">
                        Bangladesh: Humiliation, Carnage, Liberation, Chaos
                      </h3>

                      <p className="text-xs mt-3">
                        25 April 2026<br />
                        1700 HOURS
                      </p>

                      <p className="text-xs mt-2">
                        Sushant Lok Phase I, Sector 43, Gurugram, Haryana
                      </p>
                    </div>
                  </div>

                </div>

                {/* View All Link */}
                <div className="flex items-center justify-center pb-6">
                  <a
                    href="/resources/events"
                    className="text-[#007DD7] italic text-sm hover:underline"
                  >
                    View All Upcoming Events
                  </a>
                </div>

              </div>
            </section>

            {bookInfo.pressCoverage && (<section className="container mx-auto px-4 mt-8">
              <div className="mx-auto flex w-fit items-center justify-center gap-3 py-6 md:gap-4">
                <Image src={inkdouble1} width={55} height={55} alt="inkdouble1" />
                <h3 className="text-center text-xl font-semibold tracking-wide text-[#111] md:text-2xl">
                  Press Coverage
                </h3>
                <Image src={inkdouble2} width={55} height={55} alt="inkdouble2" />
              </div>

              <div
                className="max-w-3xl mx-auto text-[14px] sm:text-[16px] text-[#0D1928] [&_a]:block [&_a]:mt-8 [&_a]:text-blue-600 [&_a]:underline"
                dangerouslySetInnerHTML={{ __html: bookInfo.pressCoverage }}
              />
            </section>
            )}

            <section className="container mx-auto px-4 pb-12 mt-10">
              <div className="flex items-center gap-2 justify-center pb-6 pt-0">
                <Image src={inkdouble1} width={55} height={55} alt="inkdouble1" />
                <h3 className="font-medium text-2xl text-center">
                  Watch on Instagram & YouTube
                </h3>
                <Image src={inkdouble2} width={55} height={55} alt="inkdouble2" />
              </div>

              <div className="md:hidden flex items-center gap-2 sm:gap-3">
                <button
                  type="button"
                  onClick={handlePrevMedia}
                  className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#007DD7] bg-white text-xl text-[#007DD7] shadow-sm transition hover:bg-[#007DD7] hover:text-white hover:shadow active:scale-[0.97]"
                  aria-label="Show previous media"
                >
                  <RiArrowLeftSLine className="h-6 w-6" aria-hidden />
                </button>

                <div className="min-w-0 flex-1 grid grid-cols-1 gap-4">
                  {visibleMediaItems.map((item, index) => {
                    const thumb = getMediaThumbnailUrl(item);
                    return (
                      <div
                        key={`${item.platform}-${item.embedUrl}-${index}`}
                        className="bg-white rounded-xl shadow-md p-3"
                      >
                        <button
                          type="button"
                          onClick={() => openMediaModal(item)}
                          className="group relative w-full aspect-[9/16] rounded-lg overflow-hidden border border-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#007DD7] focus-visible:ring-offset-2"
                          aria-label={`Play ${item.title}`}
                        >
                          {thumb ? (
                            <img
                              src={thumb}
                              alt=""
                              className="absolute inset-0 h-full w-full object-cover"
                            />
                          ) : (
                            <div
                              className={`absolute inset-0 flex items-center justify-center ${item.platform === "YouTube"
                                ? "bg-gradient-to-br from-red-100 to-gray-100"
                                : "bg-gradient-to-br from-purple-100 via-pink-50 to-amber-50"
                                }`}
                            >
                              {item.platform === "YouTube" ? (
                                <FaYoutube className="text-6xl text-red-600" aria-hidden />
                              ) : (
                                <FaInstagram className="text-6xl text-pink-600" aria-hidden />
                              )}
                            </div>
                          )}
                          <span className="absolute inset-0 flex items-center justify-center bg-black/25 transition group-hover:bg-black/40">
                            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/95 text-[#007DD7] shadow-md text-xl">
                              ▶
                            </span>
                          </span>
                        </button>
                      </div>
                    );
                  })}
                </div>

                <button
                  type="button"
                  onClick={handleNextMedia}
                  className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#007DD7] bg-white text-xl text-[#007DD7] shadow-sm transition hover:bg-[#007DD7] hover:text-white hover:shadow active:scale-[0.97]"
                  aria-label="Show next media"
                >
                  <RiArrowRightSLine className="h-6 w-6" aria-hidden />
                </button>
              </div>

              <div className="hidden md:grid md:grid-cols-5 gap-4">
                {desktopMediaItems.map((item, index) => {
                  const thumb = getMediaThumbnailUrl(item);
                  return (
                    <div
                      key={`${item.platform}-${item.embedUrl}-${index}`}
                      className="bg-white rounded-xl shadow-md p-3"
                    >
                      <button
                        type="button"
                        onClick={() => openMediaModal(item)}
                        className="group relative w-full aspect-[9/16] rounded-lg overflow-hidden border border-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#007DD7] focus-visible:ring-offset-2"
                        aria-label={`Play ${item.title}`}
                      >
                        {thumb ? (
                          <img
                            src={thumb}
                            alt=""
                            className="absolute inset-0 h-full w-full object-cover"
                          />
                        ) : (
                          <div
                            className={`absolute inset-0 flex items-center justify-center ${item.platform === "YouTube"
                              ? "bg-gradient-to-br from-red-100 to-gray-100"
                              : "bg-gradient-to-br from-purple-100 via-pink-50 to-amber-50"
                              }`}
                          >
                            {item.platform === "YouTube" ? (
                              <FaYoutube className="text-6xl text-red-600" aria-hidden />
                            ) : (
                              <FaInstagram className="text-6xl text-pink-600" aria-hidden />
                            )}
                          </div>
                        )}
                        <span className="absolute inset-0 flex items-center justify-center bg-black/25 transition group-hover:bg-black/40">
                          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/95 text-[#007DD7] shadow-md text-xl">
                            ▶
                          </span>
                        </span>
                      </button>
                    </div>
                  );
                })}
              </div>

              {activeMediaModal && (
                <div
                  className="fixed inset-0 z-[300] flex items-center justify-center bg-black/75 p-4"
                  role="dialog"
                  aria-modal="true"
                  aria-labelledby="media-modal-title"
                  onClick={() => setActiveMediaModal(null)}
                >
                  <div
                    className="flex w-full max-w-md flex-col overflow-hidden rounded-xl bg-black shadow-2xl"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center gap-2 border-b border-white/10 px-3 py-2">
                      <p
                        id="media-modal-title"
                        className="min-w-0 flex-1 truncate text-sm font-medium text-white"
                      >
                        {activeMediaModal.title}
                      </p>
                      <button
                        type="button"
                        onClick={() => setActiveMediaModal(null)}
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white text-2xl leading-none hover:bg-white/15"
                        aria-label="Close video"
                      >
                        ×
                      </button>
                    </div>
                    <div className="aspect-[9/16] w-full max-h-[min(85vh,720px)]">
                      <iframe
                        key={`${activeMediaModal.embedUrl}-${mediaModalNonce}`}
                        src={embedUrlWithAutoplay(activeMediaModal)}
                        title={activeMediaModal.title}
                        className="h-full w-full"
                        allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                        allowFullScreen
                      />
                    </div>
                  </div>
                </div>
              )}
            </section>
          </>
        )}



        {/* <section id="related-titles" className="container mx-auto px-4">          
          <div className="flex items-center gap-2 justify-center pb-6 pt-6">
            <Image src={inkdouble1} width={55} height={55} alt="inkdouble1" />
            <h3 className="font-medium text-base md:text-3xl text-center">
              Related Titles
            </h3>
            <Image src={inkdouble2} width={55} height={55} alt="inkdouble2" />
          </div>
        
          
          <div className="flex flex-wrap justify-center mt-10">
        
            {[1, 2, 3, 4, 5, 6].map((_, index) => (
              <div
                key={index}
                className="related_title_sec_card p-4 hover:shadow-md input-border border-[#ffffff00] hover:border-[#BABABA] rounded-md w-full sm:max-w-[200px]"
              >
                <div className="w-full min-h-[300px] flex flex-col h-full">
        
                  
                  <div className="relative w-full h-[200px] lg:h-[300px]">
                    <img
                      src="/blogs.png"
                      alt="event"
                      className="w-full h-full object-cover"
                    />
                  </div>
        
                  
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
        </section> */}


        {mounted && relatedBooks?.length > 0 && (
          <section id="related-titles" className="container">

            <div className="flex items-center gap-2 justify-center pb-6 pt-6">
              <Image src={inkdouble1} width={55} height={55} alt="inkdouble1" />
              <h3 className="font-medium text-2xl text-center">
                Related Titles
              </h3>
              <Image src={inkdouble2} width={55} height={55} alt="inkdouble2" />
            </div>

            <div className="flex items-center justify-center pb-6">
              <Link href="/books">
                <h4 className="text-[#007DD7] text-base underline font-medium">
                  View All Titles
                </h4>
              </Link>
            </div>

            <div className="related_title_sec flex flex-wrap justify-center pb-10">
              {relatedBooks.map((relatedBook) => (
                <div
                  key={relatedBook.id ?? relatedBook.slug ?? relatedBook.title}
                  className="related_title_sec_card p-4 hover:shadow-md input-border border-[#ffffff00] hover:border-[#BABABA] rounded-md"
                  style={{ maxWidth: "200px" }}
                >
                  <Link href={`/books/${relatedBook.slug}`}>
                    <BooksCards
                      title={relatedBook.title}
                      coverImage={relatedBook.thumbnailUrl}
                      authorName={relatedBook.author?.name ?? ""}
                      imageContainerClass="h-[200px] lg:h-[250px] border_card"
                    />
                  </Link>
                </div>
              ))}
            </div>

          </section>
        )}

        {mounted && (
          <div className="hidden lg:block aside_fixed">
            <ul className="flex flex-col">
              <li>
                <a
                  href="#top"
                  className={`pb-2 ${activeSection === "top"
                    ? "text-[#007BD7] font-medium"
                    : "text-[#0D1928] font-light"
                    }`}
                >
                  Go to Top
                </a>
              </li>
              <li>&nbsp;</li>
              {activeAuthorDetails &&
                activeAuthorDetails.author_name !== "Bluone Ink" &&
                Array.isArray(bookInfo.authors) &&
                bookInfo.authors.length > 0 && (
                  <li>
                    <a
                      href="#about-author"
                      className={`pb-2 ${activeSection === "about-author"
                        ? "text-[#007BD7] font-medium"
                        : "text-[#0D1928] font-light"
                        }`}
                    >
                      About the Author
                    </a>
                  </li>
                )}
              <li>
                <a
                  href="#related-titles"
                  className={`pb-2 ${activeSection === "related-titles"
                    ? "text-[#007BD7] font-medium"
                    : "text-[#0D1928] font-light"
                    }`}
                >
                  Related Titles
                </a>
              </li>
            </ul>
          </div>
        )}
      </main>
    </>
  );
}

