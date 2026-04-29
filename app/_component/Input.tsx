"use client";

import { Locate } from "lucide-react";
import { useState, useEffect, useRef, useCallback } from "react";

interface Suggestion {
  placeId: string;
  description: string;
}

interface PlacesInputProps {
  value: string;
  onChange: (val: string) => void;
  hasError?: boolean;
  placeholder?: string;
  onUseCurrentLocation?: () => void;
}

export default function PlacesInput({
  value,
  onChange,
  hasError,
  placeholder,
  onUseCurrentLocation,
}: PlacesInputProps) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Cleanup timeout
  useEffect(() => {
    return () => {
      if (debounceRef.current !== null) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!wrapperRef.current?.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // 🔥 NEW GOOGLE AUTOCOMPLETE API (REST)
  const fetchSuggestions = useCallback(async (input: string) => {
    if (input.length < 2) {
      setSuggestions([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        "https://places.googleapis.com/v1/places:autocomplete",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Goog-Api-Key": process.env.NEXT_PUBLIC_GOOGLE_API_KEY!,
          },
          body: JSON.stringify({
            input,
            includedRegionCodes: ["IN"],
          }),
        }
      );

      const data = await res.json();

      const formatted: Suggestion[] =
        data.suggestions?.map((s: any) => ({
          placeId: s.placePrediction?.placeId,
          latitude: s.placePrediction?.location?.latitude,
          longitude: s.placePrediction?.location?.longitude,
          description: s.placePrediction?.text?.text,
        })) || [];

      setSuggestions(formatted);
    } catch (err) {
      console.error("Autocomplete error:", err);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Handle input change with debounce
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    onChange(val);

    if (debounceRef.current !== null) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      fetchSuggestions(val);
    }, 300);
  };

  const handleSelect = (s: Suggestion) => {
    onChange(s.description);
    setShowDropdown(false);
    setSuggestions([]);
  };

  return (
    <div ref={wrapperRef} className="relative w-full">
      {/* Input */}
      <input
        type="text"
        value={value}
        onChange={handleChange}
        onFocus={() => setShowDropdown(true)}
        placeholder={placeholder ?? "Search cities, areas..."}
        className={`w-full outline-none text-sm bg-transparent text-[#1a2e0f] placeholder:text-[#a8c882] ${
          hasError ? "border-red-400" : ""
        }`}
      />

      {/* Loader */}
      {loading && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 border-2 border-gray-200 border-t-[#639922] rounded-full animate-spin" />
      )}

      {/* Dropdown */}
      {showDropdown && (
        <div className="absolute z-50 left-0 right-0 mt-3 bg-white border border-[#d4e8b0] rounded-2xl shadow-lg overflow-hidden">
          {/* Current Location */}
          <div
            onMouseDown={() => {
              setShowDropdown(false);
              onUseCurrentLocation?.();
            }}
            className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-[#f0f8e8] transition"
          >
            <span className="text-[#639922]">
              <Locate />
            </span>
            <div>
              <p className="text-sm font-medium text-[#1a2e0f]">
                Use Current Location
              </p>
              <p className="text-xs text-[#7a9460]">Detect via GPS</p>
            </div>
          </div>

          <div className="border-t border-[#d4e8b0]" />

          {/* Suggestions */}
          {loading && (
            <p className="px-4 py-3 text-sm text-[#7a9460]">Searching...</p>
          )}

          {!loading && suggestions.length === 0 && value.length >= 2 && (
            <p className="px-4 py-3 text-sm text-[#7a9460]">
              No results found
            </p>
          )}

          {!loading &&
            suggestions.map((s) => (
              <div
                key={s.placeId}
                onMouseDown={() => handleSelect(s)}
                className="flex items-start gap-3 px-4 py-3 cursor-pointer hover:bg-[#f0f8e8] transition border-t border-[#f0f8e8] first:border-0"
              >
                <span className="text-[#97c459] mt-0.5">📍</span>
                <p className="text-sm text-[#1a2e0f] leading-snug">
                  {s.description}
                </p>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}