import { useEffect, useState } from "react";
import { getPortalBaseUrl } from "@/app/API/portalBaseUrl";
const FALLBACK_ALPHABET = "ABDFGHIJKLMNPRSTUVZ".split("");
export default function AlphabetFilter({ onFilter }) {
  const [letters, setLetters] = useState(FALLBACK_ALPHABET);
  const [activeLetter, setActiveLetter] = useState("ALL");

  useEffect(() => {
    async function fetchLetters() {
      try {
        const response = await fetch(
         `${getPortalBaseUrl()}/api/public/authors/letters`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch author letters");
        }
        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) {
          setLetters(data);
        }
      } catch (error) {
        console.error("Error fetching author letters:", error);
      }
    }
    fetchLetters();
  }, []);

  const handleFilter = (letter) => {
    onFilter(letter);
  };

  return (
    <div className="flex flex-wrap md:justify-between space-x-6 mb-6 text-lg font-light">
      <button
        onClick={() => handleFilter("ALL")}
        className={`${
          activeLetter === "ALL"
            ? "text-black font-medium font-barlow"
            : "text-[#8A8A8A] font-medium font-barlow"
        } hover:text-black`}
      >
        ALL
      </button>
      {letters.map((letter) => (
        <button
          key={letter}
          onClick={() => handleFilter(letter)}
          className={`${
            activeLetter === letter
              ? "text-black font-medium font-barlow"
              : "text-[#8A8A8A] font-medium font-barlow"
          } hover:text-black`}
        >
          {letter}
        </button>
      ))}
    </div>
  );
}
