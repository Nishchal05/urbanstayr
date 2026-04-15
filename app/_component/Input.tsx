"use client";
import { Locate, Spotlight } from "lucide-react";
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

let scriptLoaded = false;
let scriptLoading = false;
const callbacks: (() => void)[] = [];

function loadGoogleMaps(apiKey: string, onLoad: () => void) {
  if (scriptLoaded) return onLoad();

  callbacks.push(onLoad);
  if (scriptLoading) return;
  scriptLoading = true;

  (window as any).__googleMapsCallback = () => {
    scriptLoaded = true;
    callbacks.forEach((cb) => cb());
    callbacks.length = 0;
  };

  const script = document.createElement("script");
  script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&loading=async&callback=__googleMapsCallback`;
  script.async = true;
  script.defer = true;
  document.head.appendChild(script);
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
  const [mapsReady, setMapsReady] = useState(false);
  const [loading, setLoading] = useState(false);

  const debounceRef = useRef<NodeJS.Timeout>();
  const serviceRef = useRef<any>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Load Google Maps
  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY!;
    loadGoogleMaps(apiKey, () => setMapsReady(true));
  }, []);

  // Init service
  useEffect(() => {
    if (mapsReady) {
      serviceRef.current = new (window as any).google.maps.places.AutocompleteService();
    }
  }, [mapsReady]);

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

  // Fetch suggestions
  const fetchSuggestions = useCallback(
    (input: string) => {
      if (!mapsReady || !serviceRef.current) return;

      if (input.length < 2) {
        setSuggestions([]);
        setLoading(false);
        return;
      }

      setLoading(true);

      serviceRef.current.getPlacePredictions(
        { input, componentRestrictions: { country: "IN" } },
        (predictions: any[], status: string) => {
          setLoading(false);

          if (
            status !== (window as any).google.maps.places.PlacesServiceStatus.OK ||
            !predictions
          ) {
            setSuggestions([]);
            return;
          }

          const formatted = predictions.map((p) => ({
            placeId: p.place_id,
            description: p.description,
          }));

          setSuggestions(formatted);
        }
      );
    },
    [mapsReady]
  );

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    onChange(val);

    clearTimeout(debounceRef.current);
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
        className="w-full outline-none text-sm bg-transparent text-[#1a2e0f] placeholder:text-[#a8c882]"
      />

      {/* Loader */}
      {loading && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 border-2 border-gray-200 border-t-[#639922] rounded-full animate-spin" />
      )}

      {/* Dropdown */}
      {showDropdown && (
        <div className="absolute z-50 left-0 right-0 mt-3 bg-white border border-[#d4e8b0] rounded-2xl shadow-lg overflow-hidden">
              <div
                onMouseDown={() => {
                  setShowDropdown(false);
                }}
                className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-[#f0f8e8] transition"
              >
                <span className="text-[#639922]"><Locate/></span>
                <div>
                  <p className="text-sm font-medium text-[#1a2e0f]">
                    Use Current Location
                  </p>
                  <p className="text-xs text-[#7a9460]">
                    Detect via GPS
                  </p>
                </div>
              </div>
              <div className="border-t border-[#d4e8b0]" />

          {/* Suggestions */}
          {loading && (
            <p className="px-4 py-3 text-sm text-[#7a9460]">
              Searching...
            </p>
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