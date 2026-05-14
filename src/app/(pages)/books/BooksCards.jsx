import React from "react";
import Image from "next/image";
import { useCart } from "@/context/CartContext";

function BooksCards({
  title,
  bookPrice,
  format,
  language,
  authorName,
  coverImage,
  publishYear,
  imageContainerClass,
  isCart,
  bookId,
}) {
  const { addToCart } = useCart();
  const defaultImage =
    "https://via.placeholder.com/250x400.png?text=No+Image+Available";
  return (
    <div className="w-full min-h-[300px]">
      <div className="flex flex-col h-full">

        {/* Image container */}
        <div
          className={`relative w-full ${
            imageContainerClass || "h-[200px] lg:h-[300px]"
          }`}
        >
          <Image
            src={coverImage || defaultImage}
            alt={title || "Book cover"}
            fill
            sizes="(max-width:768px) 100vw, 250px"
            className="object-contain object-center"
          />
        </div>

        <div className="flex-1">
          {title && (
            <h6 className="pt-4 uppercase font-semibold font-barlow leading-5">
              {title}
            </h6>
          )}

          {authorName && (
            <h4 className="uppercase font-normal font-barlow pt-2 text-base leading-5 text-[#0d1928e8]">
              {Array.isArray(authorName)
                ? authorName.join(", ")
                : authorName}
            </h4>
          )}

          {bookPrice && format && language && (
            <h4 className="text-[#0d1928e8] pt-1 text-base font-normal font-barlow uppercase">
              {bookPrice}, {format}, {language}
            </h4>
          )}

          {publishYear && <p className="text-gray-500">{publishYear}</p>}

          {/* Add to Cart Button */}
          {isCart && (
            <div className="mt-3">
              <button
                className="bg-[#241B6D] text-white text-[12px] font-bold py-2 px-6 rounded-full hover:bg-[#FFDE7C] hover:text-[#241B6D] transition-colors uppercase tracking-wider w-full md:w-auto disabled:opacity-50"
                onClick={async (e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (!bookId) {
                    console.error("Cannot add to cart: bookId is missing");
                    return;
                  }
                  const btn = e.currentTarget;
                  const originalText = btn.innerText;
                  try {
                    btn.disabled = true;
                    btn.innerText = "Adding...";
                    await addToCart(bookId);
                    btn.innerText = "Added!";
                    btn.classList.add("bg-green-600");
                    setTimeout(() => {
                      btn.innerText = originalText;
                      btn.disabled = false;
                      btn.classList.remove("bg-green-600");
                    }, 2000);
                  } catch (error) {
                    console.error("Add to cart failed:", error);
                    btn.innerText = "Error!";
                    btn.classList.add("bg-red-600");
                    setTimeout(() => {
                      btn.innerText = originalText;
                      btn.disabled = false;
                      btn.classList.remove("bg-red-600");
                    }, 2000);
                  }
                }}
              >
                Add to Cart
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default BooksCards;