"use client";

import {
  Locate,
  MapPin,
  Search,
  X,
  ChevronDown,
  Sparkles,
} from "lucide-react";
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

  useEffect(() => {
    setMounted(true);
  }, []);

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

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const val = e.target.value;

    setInputVal(val);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      fetchSuggestions(val);
    }, 300);
  };

  const handleSelectCity = (city: SelectedPlace) => {
    onChange(city.name);
    onPlaceSelect?.(city);
    setIsOpen(false);
  };

  const handleSelectSuggestion = async (s: Suggestion) => {
    onChange(s.description);

    let lat = 0;
    let lng = 0;

    try {
      const res = await fetch(
        `https://places.googleapis.com/v1/places/${s.placeId}`,
        {
          headers: {
            "X-Goog-Api-Key": process.env.NEXT_PUBLIC_GOOGLE_API_KEY!,
            "X-Goog-FieldMask": "location",
          },
        }
      );

      const data = await res.json();

      lat = data.location?.latitude ?? 0;
      lng = data.location?.longitude ?? 0;
    } catch (err) {
      console.error("Place details error:", err);
    }

    onPlaceSelect?.({
      name: s.description,
      latitude: lat,
      longitude: lng,
      placeId: s.placeId,
    });

    setIsOpen(false);
  };

  const showPopularCities = inputVal.length < 2;

  return (
    <>
      {/* Trigger */}
      <div
        className={`
          w-full rounded-2xl border bg-white px-4 py-3.5
          transition-all duration-200
          flex items-center justify-between gap-3
          cursor-pointer
          
          ${
            hasError
              ? "border-red-400"
              : "border-slate-200 hover:border-emerald-300"
          }
        `}
        onClick={() => setIsOpen(true)}
      >
        <span
          className={`flex-1 text-sm truncate text-left ${
            value ? "text-slate-900 font-medium" : "text-slate-400"
          }`}
        >
          {value || (placeholder ?? "Search cities, areas…")}
        </span>
        
        {value ? (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onChange("");
              onPlaceSelect?.({ name: "", latitude: 0, longitude: 0 });
            }}
            className="flex items-center justify-center text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-full p-1 transition-colors shrink-0"
            title="Clear location"
          >
            <X size={14} />
          </button>
        ) : (
          <ChevronDown size={18} className="text-slate-400 shrink-0" />
        )}
      </div>

      {/* Portal */}
      {mounted &&
        createPortal(
          <>
            {/* Backdrop */}
            <div
              onClick={() => setIsOpen(false)}
              className={`
                fixed inset-0 z-[998]
                bg-black/40 backdrop-blur-sm
                transition-opacity duration-300
                ${
                  visible
                    ? "opacity-100"
                    : "opacity-0 pointer-events-none"
                }
              `}
            />

            {/* Bottom Sheet */}
            <div
              className={`
                fixed inset-x-0 bottom-0 z-[999]
                bg-white rounded-t-[32px]
                transition-transform duration-300
                flex flex-col
                shadow-2xl
                ${
                  visible
                    ? "translate-y-0"
                    : "translate-y-full"
                }
              `}
              style={{
                height: "88vh",
                transitionTimingFunction:
                  "cubic-bezier(0.32,0.72,0,1)",
              }}
            >
              {/* Handle */}
              <div className="flex justify-center pt-3">
                <div className="w-12 h-1.5 rounded-full bg-slate-300" />
              </div>

              {/* Header */}
              <div className="px-5 pt-5 pb-4 border-b border-slate-100">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center">
                        <Sparkles
                          size={16}
                          className="text-emerald-700"
                        />
                      </div>

                      <div>
                        <h2 className="text-lg font-semibold text-slate-900">
                          Choose your location
                        </h2>

                        <p className="text-sm text-slate-500 mt-0.5">
                          Find PGs near your preferred city
                        </p>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setIsOpen(false)}
                    className="
                      w-10 h-10 rounded-full
                      bg-slate-100 hover:bg-slate-200
                      flex items-center justify-center
                      transition-colors
                    "
                  >
                    <X
                      size={18}
                      className="text-slate-700"
                    />
                  </button>
                </div>

                {/* Search */}
                <div className="mt-5">
                  <div
                    className="
                      flex items-center gap-3
                      rounded-2xl border border-slate-200
                      bg-slate-50
                      px-4 py-3.5
                      focus-within:border-emerald-500
                      focus-within:bg-white
                      focus-within:ring-4
                      focus-within:ring-emerald-100
                      transition-all
                    "
                  >
                    <Search
                      size={18}
                      className="text-slate-400 shrink-0"
                    />

                    <input
                      ref={inputRef}
                      type="text"
                      value={inputVal}
                      onChange={handleInputChange}
                      placeholder="Search city, area, locality..."
                      className="
                        flex-1 bg-transparent outline-none
                        text-sm text-slate-900
                        placeholder:text-slate-400
                      "
                    />

                    {loading && (
                      <div
                        className="
                          w-5 h-5 rounded-full
                          border-2 border-slate-300
                          border-t-emerald-600
                          animate-spin
                        "
                      />
                    )}

                    {!loading && inputVal.length > 0 && (
                      <button
                        onClick={() => {
                          setInputVal("");
                          setSuggestions([]);
                          inputRef.current?.focus();
                        }}
                        className="
                          w-6 h-6 rounded-full
                          bg-slate-200 hover:bg-slate-300
                          flex items-center justify-center
                          transition-colors
                        "
                      >
                        <X
                          size={12}
                          className="text-slate-700"
                        />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto px-5 py-5">
                {showPopularCities ? (
                  <>
                    {/* Current Location */}
                    <button
                      onClick={() => {
                        if (onUseCurrentLocation) {
                          setIsOpen(false);
                          onUseCurrentLocation();
                          return;
                        }
                        
                        if ("geolocation" in navigator) {
                          setLoading(true);
                          navigator.geolocation.getCurrentPosition(
                            async (position) => {
                              const lat = position.coords.latitude;
                              const lng = position.coords.longitude;
                              try {
                                let cityName = "";
                                const res = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${process.env.NEXT_PUBLIC_GOOGLE_API_KEY}`);
                                const data = await res.json();
                                
                                if (data.status === "OK" && data.results && data.results.length > 0) {
                                  // try to find locality first
                                  for (const result of data.results) {
                                    const locality = result.address_components.find((c: any) => c.types.includes("locality"));
                                    if (locality) {
                                      cityName = locality.long_name;
                                      break;
                                    }
                                  }
                                  if (!cityName) cityName = data.results[0].formatted_address;
                                } else {
                                  // Fallback to OpenStreetMap if Google Geocoding API is not enabled
                                  const osmRes = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
                                  const osmData = await osmRes.json();
                                  cityName = osmData.address?.city || osmData.address?.town || osmData.address?.village || osmData.address?.state_district || "";
                                }
                                
                                if (cityName) {
                                  onChange(cityName);
                                  onPlaceSelect?.({
                                    name: cityName,
                                    latitude: lat,
                                    longitude: lng,
                                  });
                                } else {
                                  alert("Could not determine city name from coordinates.");
                                }
                              } catch (err) {
                                console.error("Geocoding error:", err);
                                alert("Failed to get location name.");
                              } finally {
                                setLoading(false);
                                setIsOpen(false);
                              }
                            },
                            (error) => {
                              console.error("Geolocation error:", error);
                              alert("Location access denied or unavailable.");
                              setLoading(false);
                            }
                          );
                        } else {
                          alert("Geolocation is not supported by your browser.");
                        }
                      }}
                      className="
                        w-full rounded-3xl
                        bg-gradient-to-r from-emerald-600 to-emerald-500
                        p-5 text-white
                        shadow-lg shadow-emerald-200
                        transition-all duration-200
                        hover:scale-[1.01]
                      "
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center">
                          <Locate size={24} />
                        </div>

                        <div className="text-left">
                          <p className="text-lg font-semibold">
                            Use Current Location
                          </p>

                          <p className="text-sm text-white/80 mt-1">
                            Detect nearby PGs instantly
                          </p>
                        </div>
                      </div>
                    </button>

                    {/* Popular Cities */}
                    <div className="mt-8">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-semibold text-slate-900">
                          Popular Cities
                        </h3>

                        <span className="text-xs text-slate-400">
                          Quick Select
                        </span>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {POPULAR_CITIES.map((city) => (
                          <button
                            key={city.name}
                            onClick={() =>
                              handleSelectCity(city)
                            }
                            className="
                              group rounded-2xl border border-slate-200
                              bg-white p-4
                              hover:border-emerald-300
                              hover:shadow-lg
                              hover:shadow-emerald-100
                              transition-all duration-200
                              text-left
                            "
                          >
                            <div className="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center mb-4 group-hover:bg-emerald-100 transition-colors">
                              <MapPin
                                size={18}
                                className="text-emerald-600"
                              />
                            </div>

                            <p className="font-semibold text-slate-900 text-sm">
                              {city.name}
                            </p>

                            <p className="text-xs text-slate-500 mt-1">
                              Explore PGs
                            </p>
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="mb-3">
                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                        Search Results
                      </p>
                    </div>

                    {loading && (
                      <div className="py-10 text-center">
                        <div className="w-8 h-8 mx-auto rounded-full border-2 border-slate-300 border-t-emerald-600 animate-spin" />

                        <p className="mt-4 text-sm text-slate-500">
                          Finding locations...
                        </p>
                      </div>
                    )}

                    {!loading &&
                      suggestions.length === 0 &&
                      inputVal.length >= 2 && (
                        <div className="py-16 text-center">
                          <div className="w-16 h-16 rounded-2xl bg-slate-100 mx-auto flex items-center justify-center">
                            <MapPin
                              size={26}
                              className="text-slate-400"
                            />
                          </div>

                          <h3 className="mt-5 text-base font-semibold text-slate-900">
                            No locations found
                          </h3>

                          <p className="mt-2 text-sm text-slate-500">
                            Try searching for another city or
                            area
                          </p>
                        </div>
                      )}

                    {!loading &&
                      suggestions.map((s) => (
                        <button
                          key={s.placeId}
                          onClick={() =>
                            handleSelectSuggestion(s)
                          }
                          className="
                            w-full rounded-2xl
                            border border-transparent
                            px-4 py-4
                            flex items-center gap-4
                            hover:bg-slate-50
                            hover:border-slate-200
                            transition-all
                            text-left
                          "
                        >
                          <div className="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
                            <MapPin
                              size={18}
                              className="text-emerald-600"
                            />
                          </div>

                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-slate-900 truncate">
                              {s.description}
                            </p>

                            <p className="text-xs text-slate-500 mt-1">
                              Location
                            </p>
                          </div>
                        </button>
                      ))}
                  </>
                )}
              </div>
            </div>
          </>,
          document.body
        )}
    </>
  );
}