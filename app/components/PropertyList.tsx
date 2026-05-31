"use client";

import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { useRouter, useParams } from "next/navigation";

import {
    MapPin,
    Wind,
    Car,
    Utensils,
    WashingMachine,
    Heart,
    CheckCircle2,
    Sparkles,
    SlidersHorizontal,
    RotateCcw,
    ChevronRight,
} from "lucide-react";

interface Property {
    id: number;
    name: string;
    sector: string | null;
    area: string | null;
    rent: number;
    propertyType: string;
    listingType: string;
    isVerified: boolean;
    isBoosted: boolean;
    ac: boolean;
    kitchen: boolean;
    parking: boolean;
    washingMachine: boolean;
    photoRooms: any;
    photoProperty: string | null;
}

export default function PropertyList() {
    const router = useRouter();
    const params = useParams();
    const type = typeof params?.type === "string" ? params.type : "pg";

    const [properties, setProperties] = useState<Property[]>([]);
    const [loading, setLoading] = useState(true);

    const [selectedType, setSelectedType] = useState("All");
    const [maxBudget, setMaxBudget] = useState(50000);
    const [favorites, setFavorites] = useState<number[]>([]);

    useEffect(() => {
        fetchProperties();
    }, [type]);

    const fetchProperties = async () => {
        try {
            setLoading(true);

            const response = await axios.get(
                `/api/property/filter?type=${type}`
            );

            console.log("PROPERTY DATA:", response.data);

            setProperties(response.data);
        } catch (err) {
            console.error("FETCH ERROR:", err);
        } finally {
            setLoading(false);
        }
    };

    const filteredProperties = useMemo(() => {
        return properties.filter((prop) => {
            const matchesType =
                selectedType === "All" ||
                prop.propertyType.toLowerCase() ===
                selectedType.toLowerCase();

            const matchesBudget =
                maxBudget === 50000 || prop.rent <= maxBudget;

            return matchesType && matchesBudget;
        });
    }, [properties, selectedType, maxBudget]);

    const toggleFavorite = (id: number) => {
        setFavorites((prev) =>
            prev.includes(id)
                ? prev.filter((fav) => fav !== id)
                : [...prev, id]
        );
    };

    const resetFilters = () => {
        setSelectedType("All");
        setMaxBudget(50000);
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0,
        }).format(price);
    };

    // FIXED IMAGE FUNCTION
    const getCoverImage = (prop: Property) => {
        try {
            // MAIN PROPERTY IMAGE
            if (prop.photoProperty) {
                return encodeURI(prop.photoProperty.trim());
            }

            // ROOM IMAGES
            if (prop.photoRooms) {
                const rooms =
                    typeof prop.photoRooms === "string"
                        ? JSON.parse(prop.photoRooms)
                        : prop.photoRooms;

                if (Array.isArray(rooms) && rooms.length > 0) {
                    return encodeURI(String(rooms[0]).trim());
                }
            }
        } catch (error) {
            console.error("IMAGE ERROR:", error);
        }

        // FALLBACK IMAGE
        return "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80";
    };

    return (
        <section className="min-h-screen bg-white px-4 py-10 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">

                {/* HEADER */}
                <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                    <div>
                        <p className="mb-2 text-sm font-medium uppercase tracking-widest text-[#639922]">
                            Find your next stay
                        </p>

                        <h1 className="text-2xl font-bold capitalize tracking-tight text-green-900 md:text-4xl">
                            {type === "pg"
                                ? "PG & Hostel Properties"
                                : `${type} Properties`}
                        </h1>

                        <p className="mt-3 max-w-2xl text-base text-gray-500">
                            Discover verified and affordable properties with
                            modern amenities and comfortable living spaces.
                        </p>
                    </div>

                    <div className="rounded-2xl border border-green-100 bg-green-50 px-5 py-3">
                        <p className="text-sm text-gray-500">
                            Available Properties
                        </p>

                        <h3 className="text-xl font-bold text-green-800">
                            {filteredProperties.length}
                        </h3>
                    </div>
                </div>

                {/* FILTERS */}
                <div className="mb-10 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">

                    <div className="mb-6 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <SlidersHorizontal
                                className="text-[#639922]"
                                size={20}
                            />

                            <h2 className="text-md font-semibold text-gray-900">
                                Filters
                            </h2>
                        </div>

                        {(selectedType !== "All" ||
                            maxBudget !== 50000) && (
                                <button
                                    onClick={resetFilters}
                                    className="flex items-center gap-2 rounded-xl border border-red-100 px-4 py-2 text-sm font-medium text-red-500 transition hover:bg-red-50"
                                >
                                    <RotateCcw size={14} />
                                    Reset
                                </button>
                            )}
                    </div>

                    <div className="grid gap-8 md:grid-cols-2">

                        {/* TYPE */}
                        <div>
                            <p className="mb-3 text-sm font-semibold text-gray-700">
                                Property Type
                            </p>

                            <div className="flex flex-wrap gap-3">
                                {["All", "PG", "Hostel", "Flat"].map(
                                    (item) => (
                                        <button
                                            key={item}
                                            onClick={() =>
                                                setSelectedType(item)
                                            }
                                            className={`rounded-xl px-5 py-2.5 text-sm font-medium transition-all ${selectedType === item
                                                    ? "bg-green-800 text-white shadow-md"
                                                    : "border border-gray-200 bg-white text-gray-600 hover:border-green-300 hover:text-green-800"
                                                }`}
                                        >
                                            {item}
                                        </button>
                                    )
                                )}
                            </div>
                        </div>

                        {/* BUDGET */}
                        <div>
                            <div className="mb-3 flex items-center justify-between">
                                <p className="text-sm font-semibold text-gray-700">
                                    Max Budget
                                </p>

                                <span className="rounded-lg bg-[#f0f8e8] px-3 py-1 text-sm font-semibold text-[#639922]">
                                    {maxBudget === 50000
                                        ? "Any"
                                        : formatPrice(maxBudget)}
                                </span>
                            </div>

                            <input
                                type="range"
                                min="2000"
                                max="50000"
                                step="500"
                                value={maxBudget}
                                onChange={(e) =>
                                    setMaxBudget(Number(e.target.value))
                                }
                                className="w-full accent-green-700"
                            />

                            <div className="mt-2 flex justify-between text-xs text-gray-400">
                                <span>₹2k</span>
                                <span>₹15k</span>
                                <span>₹30k</span>
                                <span>₹50k+</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* LOADING */}
                {loading && (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {[1, 2, 3].map((item) => (
                            <div
                                key={item}
                                className="animate-pulse rounded-3xl border border-gray-100 bg-white p-4"
                            >
                                <div className="aspect-[4/3] rounded-2xl bg-gray-100" />

                                <div className="mt-4 h-5 w-1/2 rounded bg-gray-100" />

                                <div className="mt-3 h-4 w-2/3 rounded bg-gray-100" />

                                <div className="mt-6 h-10 rounded-xl bg-gray-100" />
                            </div>
                        ))}
                    </div>
                )}

                {/* EMPTY */}
                {!loading && filteredProperties.length === 0 && (
                    <div className="rounded-3xl border border-dashed border-green-200 bg-green-50 py-20 text-center">

                        <h2 className="text-xl font-bold text-green-900">
                            No properties found
                        </h2>

                        <p className="mt-3 text-gray-500">
                            Try changing your filters or budget range.
                        </p>

                        <button
                            onClick={resetFilters}
                            className="mt-6 rounded-xl bg-green-800 px-6 py-3 font-medium text-white transition hover:bg-green-900"
                        >
                            Clear Filters
                        </button>
                    </div>
                )}

                {/* PROPERTY GRID */}
                {!loading && filteredProperties.length > 0 && (
                    <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">

                        {filteredProperties.map((prop) => {
                            const isFav = favorites.includes(prop.id);

                            return (
                                <div
                                    key={prop.id}
                                    className="group overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                                >

                                    {/* IMAGE */}
                                    <div className="relative aspect-[4/3] overflow-hidden">
                                        <img
                                            src={getCoverImage(prop)}
                                            alt={prop.name}
                                            loading="lazy"
                                            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                                            onError={(e) => {
                                                console.log(
                                                    "FAILED IMAGE:",
                                                    e.currentTarget.src
                                                );

                                                e.currentTarget.src =
                                                    "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80";
                                            }}
                                        />

                                        {/* BADGES */}
                                        <div className="absolute left-4 top-4 flex flex-col gap-2">

                                            {prop.isBoosted && (
                                                <span className="flex items-center gap-1 rounded-full bg-amber-600 px-3 py-1 text-xs font-semibold text-white">
                                                    <Sparkles size={12} />
                                                    Featured
                                                </span>
                                            )}

                                            {prop.isVerified && (
                                                <span className="flex items-center gap-1 rounded-full bg-green-700 px-3 py-1 text-xs font-semibold text-white">
                                                    <CheckCircle2 size={12} />
                                                    Verified
                                                </span>
                                            )}
                                        </div>

                                        {/* FAVORITE */}
                                        <button
                                            onClick={() =>
                                                toggleFavorite(prop.id)
                                            }
                                            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 backdrop-blur"
                                        >
                                            <Heart
                                                size={18}
                                                className={
                                                    isFav
                                                        ? "fill-red-500 text-red-500"
                                                        : "text-gray-500"
                                                }
                                            />
                                        </button>
                                    </div>

                                    {/* CONTENT */}
                                    <div className="p-5">
                                        <div className="mb-2 flex items-center gap-2 text-sm">
                                            <span className="rounded-full bg-[#f0f8e8] px-3 py-1 font-medium text-[#639922]">
                                                {prop.propertyType}
                                            </span>

                                            <span className="rounded-full bg-green-50 px-3 py-1 font-medium text-green-700">
                                                {prop.listingType}
                                            </span>
                                        </div>
                                        <h3 className="line-clamp-1 text-lg font-bold text-gray-900">
                                            {prop.name}
                                        </h3>

                                        <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
                                            <MapPin size={15} />

                                            <span>
                                                {prop.sector &&
                                                    `Sector ${prop.sector}`}
                                                {prop.area &&
                                                    `, ${prop.area}`}
                                            </span>
                                        </div>
                                        <div className="mt-5 flex flex-wrap gap-2">
                                            {prop.ac && (
                                                <Amenity
                                                    icon={<Wind size={14} />}
                                                    label="AC"
                                                />
                                            )}
                                            {prop.kitchen && (
                                                <Amenity
                                                    icon={
                                                        <Utensils size={14} />
                                                    }
                                                    label="Kitchen"
                                                />
                                            )}
                                            {prop.parking && (
                                                <Amenity
                                                    icon={<Car size={14} />}
                                                    label="Parking"
                                                />
                                            )}
                                            {prop.washingMachine && (
                                                <Amenity
                                                    icon={
                                                        <WashingMachine
                                                            size={14}
                                                        />
                                                    }
                                                    label="Laundry"
                                                />
                                            )}
                                        </div>
                                        <div className="mt-6 flex items-center justify-between border-t border-gray-100 pt-5">
                                            <div>
                                                <p className="text-xs text-gray-400">
                                                    Starting From
                                                </p>

                                                <h3 className="text-2xl font-bold text-green-800">
                                                    {formatPrice(prop.rent)}

                                                    <span className="text-sm font-medium text-gray-400">
                                                        /mo
                                                    </span>
                                                </h3>
                                            </div>

                                            <button className="flex items-center gap-1 rounded-xl bg-green-800 px-5 py-3 text-sm font-medium text-white transition hover:bg-[#639922]"
                                             onClick={()=>{
                                                router.push(`/propertydetail/${prop.id}`)
                                             }}>
                                                Details
                                                <ChevronRight size={16} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </section>
    );
}

function Amenity({
    icon,
    label,
}: {
    icon: React.ReactNode;
    label: string;
}) {
    return (
        <div className="flex items-center gap-1 rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-medium text-gray-600">
            {icon}
            {label}
        </div>
    );
}