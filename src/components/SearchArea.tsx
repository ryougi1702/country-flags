import Fuse from "fuse.js";
import React, { useState } from "react";
import Map from "ol/Map";
import type { RegionProperties } from "../types/openDataSoft";

interface SearchAreaProps {
  placeholder?: string;
  searchItems: { code: string; name: string }[];
  zoomInOnCallback: (countryCode: string) => void;
}

const SearchArea: React.FC<SearchAreaProps> = ({
  placeholder = "Search...",
  searchItems,
  zoomInOnCallback,
}) => {
  const [query, setQuery] = useState("");
  const [displayResults, setDisplayResults] = useState(false);
  const [searchResults, setSearchResults] = useState<
    { code: string; name: string }[]
  >([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    setDisplayResults(newQuery.length > 0);

    let fuse = new Fuse(searchItems, {
      keys: ["name", "code"],
      threshold: 0.3, // lower = stricter match
    });
    const fuseResults = fuse.search(newQuery);
    setSearchResults(fuseResults.map((result) => result.item));
  };

  return (
    <div style={{ position: "relative", width: "100%" }}>
      <input
        id="search-bar"
        type="text"
        value={query}
        onSelect={() => setDisplayResults(true)}
        // this bugs out the clicking, will not be needed after transitioning to headless ui etc
        // onBlur={() => setDisplayResults(false)}
        onChange={handleChange}
        placeholder={placeholder}
        style={{
          padding: "8px 12px",
          borderRadius: "4px",
          border: "1px solid #ccc",
          width: "100%",
          fontSize: "16px",
        }}
        aria-label="Search"
        autoComplete="off"
      />
      {displayResults && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            background: "#fff",
            border: "1px solid #ccc",
            borderRadius: "4px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            zIndex: 100,
          }}
        >
          {searchResults.map((country, index) => (
            <div
              key={index}
              style={{
                padding: "8px 12px",
                color: "#333",
                cursor: "pointer",
                borderBottom:
                  index < searchResults.length - 1 ? "1px solid #eee" : "none",
              }}
              onClick={() => {
                setQuery(country.name);
                setDisplayResults(false);
                zoomInOnCallback(country.code);
              }}
            >
              {country.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchArea;
