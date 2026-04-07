import { IoMdArrowDropdown, IoMdArrowDropup } from "react-icons/io";

export default function BooksFilters({
  showFilters,
  setShowFilters,
  filterRef,
  sortOption,
  setSortOption,
  useV1Api,
  v1Genres,
  selectedV1Genres,
  setSelectedV1Genres,
  category,
  categoryFilter,
  setCategoryFilter,
  allBooks,
  genreFilter,
  setGenreFilter,
  language,
  languageFilter,
  setLanguageFilter,
  format,
  formatFilter,
  setFormatFilter,
  v1LanguageCounts,
  v1FormatCounts,
}) {
  const handleFilterChange = (current, setFilter, value) => {
    setFilter((prev) =>
      prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
    );

    const mainCategories = ["Fiction", "Non-Fiction", "Children"];
    if (setFilter === setCategoryFilter) {
      if (mainCategories.includes(value)) {
        setCategoryFilter([value]);
      } else {
        setCategoryFilter((prev) => prev.filter((cat) => cat !== value));
      }
    }
  };

  return (
    <div className="w-[50%] mt-4 lg:mt-0 md:px-4 md:w-[22%]">
      <button
        className="input-border flex justify-center rounded-3xl text-[#8A8A8A] p-3 mb-4 w-full"
        onClick={() => setShowFilters(!showFilters)}
      >
        <i>
          <span className="flex gap-6 font-ibm items-center">
            Sort & Filter
            {showFilters ? (
              <IoMdArrowDropup className="w-5 h-5" />
            ) : (
              <IoMdArrowDropdown className="w-5 h-5" />
            )}
          </span>
        </i>
      </button>

      {showFilters && (
        <div
          className="w-full absolute right-0 gap-4 mb-4 z-[111]"
          ref={filterRef}
        >
          <div className="border-[#8A8A8A] p-6 rounded-2xl shadow-xl bg-white hover:shadow-2xl sm:p-6 md:p-8 book_filter">
            <div className="flex flex-col md:flex-row">
              {/* Sort Section */}
              <div className="w-full md:w-1/3 mb-6 md:mb-0">
                <i>
                  <h4 className="font-semibold mb-2 text-[#007DD7] text-2xl">
                    Sort
                  </h4>
                </i>
                <div className="flex flex-col">
                  {[
                    "Title: A to Z",
                    "Title: Z to A",
                    "Publish Year: Newest First",
                    "Publish Year: Oldest First",
                  ].map((option) => (
                    <label
                      key={option}
                      className={`text-md text-[#0D1928] font-normal pt-1 flex items-center cursor-pointer ${
                        sortOption === option ? "text-[#0D1928] font-semibold" : "font-normal"
                      }`}
                    >
                      <input
                        type="radio"
                        name="sort"
                        value={option}
                        onChange={(e) => setSortOption(e.target.value)}
                        className="hidden"
                      />
                      <span className="font-ibm">{option}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Divider */}
              <div className="hidden md:block border-l border-gray-300 mx-4"></div>

              {/* Genre & Category Section */}
              <div className="w-full md:w-1/3 mb-6 md:mb-0">
                <i>
                  <h4 className="font-semibold mb-3 text-[#007DD7] text-2xl">
                    Genre &amp; Category
                  </h4>
                </i>

                {/* v1 genres */}
                {useV1Api && v1Genres.length > 0 && (
                  <div className="mb-4">
                    {v1Genres.map((g) => {
                      const checked = selectedV1Genres.includes(g.slug);
                      return (
                        <label
                          key={g.slug}
                          className={`text-md pt-1 block text-[#0D1928] font-normal cursor-pointer ${
                            checked ? "font-semibold" : "font-normal"
                          }`}
                        >
                          <input
                            type="checkbox"
                            value={g.slug}
                            checked={checked}
                            onChange={() => {
                              setSelectedV1Genres((prev) => {
                                const exists = prev.includes(g.slug);
                                return exists
                                  ? prev.filter((s) => s !== g.slug)
                                  : [...prev, g.slug];
                              });
                            }}
                            className="mr-2"
                          />
                          <span className="font-ibm">{g.name}</span>
                        </label>
                      );
                    })}
                  </div>
                )}

                {/* Legacy categories + subcategories */}
                {!useV1Api && (() => {
                  const mainCategories = ["Fiction", "Non-Fiction", "Children"];
                  const selectedMainCategory = categoryFilter.find((cat) =>
                    mainCategories.includes(cat)
                  );

                  return category.map((g) => {
                    if (
                      mainCategories.includes(g) &&
                      selectedMainCategory &&
                      selectedMainCategory !== g
                    )
                      return null;

                    return (
                      <div className="category_filter" key={g}>
                        <label
                          className={`text-md pt-2 flex place-items-center text-[#0D1928] cat_label font-normal ${
                            categoryFilter.includes(g) ? "font-semibold" : "font-normal"
                          }`}
                        >
                          <input
                            type="checkbox"
                            value={g}
                            checked={categoryFilter.includes(g)}
                            onChange={() =>
                              handleFilterChange(categoryFilter, setCategoryFilter, g)
                            }
                          />
                          <span className="ml-2 cat_span font-ibm">
                            {g} (
                              {allBooks.filter((book) => book.category === g).length}
                            )
                          </span>
                        </label>

                        {["Fiction", "Non-Fiction", "Children"].includes(g) &&
                          categoryFilter.includes(g) && (
                            <div
                              className="sub_cat_label"
                              style={{ marginLeft: "30px" }}
                            >
                              {(g === "Fiction"
                                ? [
                                    "Religion & Spirituality",
                                    "Action & Adventure",
                                    "Poetry",
                                    "Indian Languages",
                                    "Short Stories & Anthologies",
                                    "Society & Social Sciences",
                                    "Fantasy & Science Fiction",
                                    "Crime, Thriller & Mystery",
                                    "Arts, Film & Photography",
                                    "Crime Fiction",
                                    "Thriller and Suspense",
                                    "Mystery",
                                  ]
                                : g === "Non-Fiction"
                                ? [
                                    "Religion & Spirituality",
                                    "Biography, Autobiography, & True Accounts",
                                    "Economics, Finance, Business & Management",
                                    "Politics & Governance",
                                    "Military & Defence",
                                    "Health & Wellness",
                                    "Science & Technology",
                                    "Society & Social Sciences",
                                    "Indian Languages",
                                    "Self-Help & Development",
                                    "Law & Public Policy",
                                    "Essays & Anthologies",
                                    "Educational Books & References",
                                  ]
                                : [
                                    "Action & Adventure",
                                    "Self-Help & Development",
                                    "Classics",
                                    "Life Skills and Development",
                                  ]
                              ).map((subcategory) => (
                                <label
                                  key={`${g}: ${subcategory}`}
                                  className="text-md pt-1 block text-[#0D1928] font-normal font-ibm subcat_label"
                                >
                                  <input
                                    type="checkbox"
                                    value={`${g}: ${subcategory}`}
                                    checked={genreFilter.includes(`${g}: ${subcategory}`)}
                                    onChange={() =>
                                      handleFilterChange(
                                        genreFilter,
                                        setGenreFilter,
                                        `${g}: ${subcategory}`
                                      )
                                    }
                                  />
                                  <span className="ml-2 flex-1 subcat_span font-ibm">
                                    {subcategory}
                                  </span>
                                </label>
                              ))}
                            </div>
                          )}
                      </div>
                    );
                  });
                })()}
              </div>

              {/* Divider */}
              <div className="hidden md:block border-l border-gray-300 mx-4"></div>

              {/* Language & Format Section */}
              <div className="w-full md:w-1/3 mb-6 md:mb-0">
                <i>
                  <h4 className="font-semibold mb-3 text-[#007DD7] text-2xl">
                    Language
                  </h4>
                </i>
                {language.map((lang) => (
                  <div className="w-full" key={lang}>
                    <label
                      className={`text-md pt-1 flex place-items-center text-[#0D1928] font-normal ${
                        languageFilter.includes(lang) ? "font-semibold" : "font-normal"
                      }`}
                    >
                      <input
                        type="checkbox"
                        value={lang}
                        checked={languageFilter.includes(lang)}
                        onChange={() =>
                          handleFilterChange(languageFilter, setLanguageFilter, lang)
                        }
                      />
                      <span className="ml-2 font-ibm">
                        {lang} (
                          {useV1Api
                            ? v1LanguageCounts[lang] ?? 0
                            : languageFilter.length || genreFilter.length
                            ? 0
                            : 0}
                        )
                      </span>
                    </label>
                  </div>
                ))}

                <div className="border-b border-gray-300 mx-2 pb-3 pt-3"></div>

                <i>
                  <h4 className="font-semibold pt-3 mb-3 text-[#007DD7] text-2xl">
                    Format
                  </h4>
                </i>
                {format.map((fmt) => (
                  <div className="w-full" key={fmt}>
                    <label
                      className={`text-md pt-1 flex place-items-center text-[#0D1928] font-normal ${
                        formatFilter.includes(fmt) ? "font-semibold" : "font-normal"
                      }`}
                    >
                      <input
                        type="checkbox"
                        value={fmt}
                        checked={formatFilter.includes(fmt)}
                        onChange={() =>
                          handleFilterChange(formatFilter, setFormatFilter, fmt)
                        }
                      />
                      <span className="ml-2 font-ibm">
                        {fmt} (
                          {useV1Api
                            ? v1FormatCounts[fmt] ?? 0
                            : formatFilter.length || genreFilter.length
                            ? 0
                            : 0}
                        )
                      </span>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

