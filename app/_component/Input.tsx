"use client";

import { Locate, MapPin, Search, X, ChevronDown } from "lucide-react";
import { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";

interface SelectedPlace {
  name: string;
  latitude: number;
  longitude: number;
  placeId?: string;
}

interface Suggestion {
  placeId: string;
  description: string;
}

interface PlacesInputProps {
  value: string;
  onChange: (val: string) => void;
  onPlaceSelect?: (place: SelectedPlace) => void;
  hasError?: boolean;
  placeholder?: string;
  onUseCurrentLocation?: () => void;
}

const POPULAR_CITIES: SelectedPlace[] = [
  { name: "Bengaluru", latitude: 12.9716, longitude: 77.5946 },
  { name: "Hyderabad", latitude: 17.385, longitude: 78.4867 },
  { name: "Pune", latitude: 18.5204, longitude: 73.8567 },
  { name: "Chennai", latitude: 13.0827, longitude: 80.2707 },
  { name: "Gurugram", latitude: 28.4595, longitude: 77.0266 },
  { name: "Noida", latitude: 28.5355, longitude: 77.391 },
  { name: "Chandigarh", latitude: 30.7333, longitude: 76.7794 },
];

export default function PlacesInput({
  value,
  onChange,
  onPlaceSelect,
  hasError,
  placeholder,
  onUseCurrentLocation,
}: PlacesInputProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputVal, setInputVal] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setVisible(true));
      });
      setTimeout(() => inputRef.current?.focus(), 200);
    } else {
      setVisible(false);
      const t = setTimeout(() => {
        document.body.style.overflow = "";
        setInputVal("");
        setSuggestions([]);
      }, 300);
      return () => clearTimeout(t);
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  useEffect(() => {
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, []);

  const fetchSuggestions = useCallback(async (input: string) => {
    if (input.length < 2) { setSuggestions([]); setLoading(false); return; }
    setLoading(true);
    try {
      const res = await fetch("https://places.googleapis.com/v1/places:autocomplete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": process.env.NEXT_PUBLIC_GOOGLE_API_KEY!,
        },
        body: JSON.stringify({ input, includedRegionCodes: ["IN"] }),
      });
      const data = await res.json();
      const formatted: Suggestion[] =
        data.suggestions?.map((s: any) => ({
          placeId: s.placePrediction?.placeId,
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputVal(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchSuggestions(val), 300);
  };

  const handleSelectCity = (city: SelectedPlace) => {
    onChange(city.name);
    onPlaceSelect?.(city);
    setIsOpen(false);
  };

  const handleSelectSuggestion = async (s: Suggestion) => {
    onChange(s.description);
    let lat = 0, lng = 0;
    try {
      const res = await fetch(`https://places.googleapis.com/v1/places/${s.placeId}`, {
        headers: {
          "X-Goog-Api-Key": process.env.NEXT_PUBLIC_GOOGLE_API_KEY!,
          "X-Goog-FieldMask": "location",
        },
      });
      const data = await res.json();
      lat = data.location?.latitude ?? 0;
      lng = data.location?.longitude ?? 0;
    } catch (err) {
      console.error("Place details error:", err);
    }
    onPlaceSelect?.({ name: s.description, latitude: lat, longitude: lng, placeId: s.placeId });
    setIsOpen(false);
  };

  const showPopularCities = inputVal.length < 2;

  return (
    <>
      {/* ── Trigger ── */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="w-full flex items-center gap-2.5 text-left bg-transparent border-none p-0 cursor-pointer"
      >
        <span
          className={`flex-1 text-sm truncate ${
            value ? "text-[#173404]" : "text-[#97C459]"
          }`}
        >
          {value || (placeholder ?? "Search cities, areas…")}
        </span>
        <ChevronDown size={14} className="text-[#97C459] shrink-0" />
      </button>

      {/* ── Portal ── */}
      {mounted && createPortal(
        <>
          {/* Backdrop */}
          <div
            onClick={() => setIsOpen(false)}
            className={`fixed inset-0 z-[998] transition-opacity duration-300 ${
              isOpen ? "pointer-events-auto" : "pointer-events-none"
            } ${visible ? "opacity-100" : "opacity-0"}`}
            style={{ background: "rgba(23,52,4,0.45)" }}
          />

          {/* Bottom sheet */}
          <div
            className={`fixed left-0 right-0 bottom-0 z-[999] bg-white flex flex-col
              rounded-t-[24px] transition-transform duration-300
              ${visible ? "translate-y-0" : "translate-y-full"}`}
            style={{
              height: "82vh",
              transitionTimingFunction: "cubic-bezier(0.32,0.72,0,1)",
              willChange: "transform",
            }}
          >
            {/* Drag handle */}
            <div className="flex justify-center pt-3.5">
              <div className="w-9 h-1 rounded-full bg-[#C0DD97]" />
            </div>

            {/* Title row */}
            <div className="flex items-center justify-between px-5 pt-3.5">
              <p className="m-0 text-base font-medium text-[#173404]">
                Select location
              </p>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full
                  bg-[#EAF3DE] border-none cursor-pointer text-[#3B6D11]
                  hover:bg-[#C0DD97] transition-colors"
              >
                <X size={15} />
              </button>
            </div>

            {/* Search bar */}
            <div className="px-4 pt-3.5 pb-2.5">
              <div className="flex items-center gap-2.5 bg-[#F7FDF0] border-[1.5px]
                border-[#3B6D11] rounded-[14px] px-3.5 py-[11px]">
                <Search size={15} className="text-[#3B6D11] shrink-0" />
                <input
                  ref={inputRef}
                  type="text"
                  value={inputVal}
                  onChange={handleInputChange}
                  placeholder="Search cities, areas…"
                  className="flex-1 border-none outline-none bg-transparent
                    text-sm text-[#173404] placeholder:text-[#97C459]"
                />
                {loading && (
                  <div
                    className="w-4 h-4 rounded-full border-2 border-[#C0DD97]
                      border-t-[#3B6D11] shrink-0 animate-spin"
                  />
                )}
                {inputVal.length > 0 && !loading && (
                  <button
                    onClick={() => {
                      setInputVal("");
                      setSuggestions([]);
                      inputRef.current?.focus();
                    }}
                    className="w-5 h-5 flex items-center justify-center rounded-full
                      bg-[#EAF3DE] border-none cursor-pointer text-[#3B6D11]
                      hover:bg-[#C0DD97] transition-colors shrink-0"
                  >
                    <X size={11} />
                  </button>
                )}
              </div>
            </div>

            {/* Scrollable body */}
            <div className="flex-1 overflow-y-auto px-4 pb-8">

              {/* Popular cities chips */}
              {showPopularCities && (
                <>
                  <p className="text-[10px] font-medium text-[#3B6D11] tracking-widest
                    uppercase mt-1 mb-3">
                    Quick select
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {/* Current location chip */}
                    <button
                      onClick={() => { setIsOpen(false); onUseCurrentLocation?.(); }}
                      className="flex flex-col justify-center items-center gap-1.5 px-4 py-2 rounded-md
                        bg-[#3B6D11] border-none text-white text-[20px] font-medium
                        cursor-pointer hover:bg-[#27500A] transition-colors w-[200px] h-[200px]"
                    >
                      <Locate size={13} />
                      Current location
                    </button>

                    {/* City chips */}
                    {POPULAR_CITIES.map((city) => (
                      <button
                        key={city.name}
                        onClick={() => handleSelectCity(city)}
                        className="flex flex-col items-center justify-center gap-1.5 px-3.5 py-2 rounded-md
                          border-[1.5px] border-[#C0DD97] bg-white text-[#27500A]
                          text-[20px] font-medium cursor-pointer
                          hover:border-[#639922] hover:bg-[#F7FDF0] transition-all w-[200px] h-[200px]"
                      >
                        <MapPin size={12} className="text-[#639922]" />
                        {city.name}
                      </button>
                    ))}
                  </div>
                </>
              )}

              {/* Divider */}
              {!showPopularCities && (
                <div className="h-px bg-[#EAF3DE] my-3" />
              )}

              {/* Search results */}
              {!showPopularCities && (
                <>
                  {loading && (
                    <p className="text-[13px] text-[#639922] px-1 py-3">
                      Searching…
                    </p>
                  )}

                  {!loading && suggestions.length === 0 && inputVal.length >= 2 && (
                    <div className="text-center py-8">
                      <p className="text-sm text-[#639922] m-0">No results found</p>
                      <p className="text-xs text-[#97C459] mt-1 m-0">
                        Try a different city or area
                      </p>
                    </div>
                  )}

                  {!loading && suggestions.map((s) => (
                    <button
                      key={s.placeId}
                      onClick={() => handleSelectSuggestion(s)}
                      className="w-full flex items-center gap-3 px-1 py-2.5
                        bg-transparent border-none border-b border-[#EAF3DE]
                        cursor-pointer text-left hover:bg-[#F7FDF0]
                        transition-colors rounded-lg"
                    >
                      <div className="w-[34px] h-[34px] rounded-full bg-[#EAF3DE]
                        flex items-center justify-center shrink-0">
                        <MapPin size={14} className="text-[#3B6D11]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="m-0 text-sm text-[#173404] truncate">
                          {s.description}
                        </p>
                      </div>
                    </button>
                  ))}
                </>
              )}
            </div>
          </div>

          <style>{`@keyframes pi-spin { to { transform: rotate(360deg); } }`}</style>
        </>,
        document.body
      )}
    </>
  );
}