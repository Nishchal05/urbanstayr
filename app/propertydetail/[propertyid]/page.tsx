"use client";

import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { useState, useEffect, useRef } from "react";
import {
    MapPin, Wind, Car, Utensils, WashingMachine, Heart, CheckCircle2,
    Sparkles, ChevronRight, ChevronLeft, Phone, Coffee, Soup,
    BedDouble, Bath, Zap, IndianRupee, ArrowLeft, Share2, Info, Image as ImageIcon, FileText
} from "lucide-react";

// --- helpers ---
function safeEncode(url: string | null | undefined): string | null {
    if (!url || url.trim() === "") return null;
    try { return encodeURI(url.trim()); } catch { return null; }
}

function getAllPhotos(prop: any): string[] {
    const result: string[] = [];
    const push = (url: string | null | undefined) => {
        const u = safeEncode(url);
        if (u) result.push(u);
    };

    push(prop.photoProperty);
    if (prop.photoRooms) {
        try {
            const arr = typeof prop.photoRooms === "string" ? JSON.parse(prop.photoRooms) : prop.photoRooms;
            if (Array.isArray(arr)) arr.forEach((u: string) => push(u));
        } catch { /* ignore */ }
    }
    push(prop.photoWashroom);
    push(prop.photoKitchen);
    push(prop.photoWashing);
    push(prop.photoParking);
    push(prop.photoDining);
    push(prop.photoTerrace);

    return result;
}

export default function PropertyDetail() {
    const params = useParams();
    const router = useRouter();
    const id = params?.propertyid;

    const [property, setProperty] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [galleryIndex, setGalleryIndex] = useState(0);
    const touchStartX = useRef<number | null>(null);

    useEffect(() => {
        if (id) getProperty();
    }, [id]);

    async function getProperty() {
        try {
            setLoading(true);
            const response = await axios.get(`/api/property/${id}`);
            setProperty(response.data);
        } catch (error) {
            console.error("Failed to fetch property:", error);
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="flex flex-col items-center gap-4">
                    <div className="h-10 w-10 animate-spin rounded-full border-4 border-green-200 border-t-green-800"></div>
                    <p className="text-gray-500 font-medium animate-pulse">Loading property details...</p>
                </div>
            </div>
        );
    }

    if (!property) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
                <div className="text-center max-w-md">
                    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-100 mb-6">
                        <Info className="h-10 w-10 text-red-500" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Property Not Found</h1>
                    <p className="text-gray-500 mb-8">The property you are looking for does not exist or has been removed.</p>
                    <button 
                        onClick={() => router.back()}
                        className="px-6 py-3 bg-green-800 text-white rounded-xl font-medium hover:bg-green-900 transition shadow-md"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    const photos = getAllPhotos(property);
    const FALLBACK = "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80";
    const displayPhotos = photos.length > 0 ? photos : [FALLBACK];

    const formatPrice = (p: number) =>
        new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(p);

    const locationString = [
        property.sector && `Sector ${property.sector}`,
        property.area,
        property.street,
        property.location
    ].filter(Boolean).join(", ");

    const getMenuUrl = (menuData: any) => {
        if (!menuData) return null;
        try {
            const parsed = typeof menuData === "string" ? JSON.parse(menuData) : menuData;
            if (typeof parsed === "string") return parsed;
            if (Array.isArray(parsed) && parsed.length > 0) return parsed[0];
            if (parsed.url) return parsed.url;
        } catch {
            if (typeof menuData === "string") return menuData;
        }
        return null;
    };

    const menuUrl = getMenuUrl(property.menu);

    return (
        <main className="min-h-screen bg-gray-50 pb-24 lg:pb-12">
            {/* Top Navigation */}
            <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-200 px-4 py-3 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-7xl flex items-center justify-between">
                    <button 
                        onClick={() => router.back()}
                        className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition bg-white p-2 sm:px-4 sm:py-2 rounded-full sm:rounded-xl shadow-sm border border-gray-200"
                    >
                        <ArrowLeft size={18} />
                        <span className="hidden sm:inline">Back to Search</span>
                    </button>
                    
                    <div className="flex items-center gap-3">
                        <button className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm border border-gray-200 text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition">
                            <Share2 size={18} />
                        </button>
                        <button className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm border border-gray-200 text-gray-600 hover:text-red-500 hover:bg-red-50 transition">
                            <Heart size={18} />
                        </button>
                    </div>
                </div>
            </div>

            <div className="mx-auto max-w-7xl px-0 sm:px-6 lg:px-8 pt-4 sm:pt-6">
                
                {/* Image Gallery (Unified Swipeable Carousel) */}
                <div 
                    className="relative mb-8 bg-gray-100 sm:rounded-3xl overflow-hidden shadow-sm group w-full"
                    style={{ aspectRatio: "16/9", maxHeight: "60vh" }}
                    onMouseDown={(e) => { touchStartX.current = e.clientX; }}
                    onMouseUp={(e) => {
                        if (touchStartX.current === null) return;
                        const diff = touchStartX.current - e.clientX;
                        if (Math.abs(diff) > 40) {
                            if (diff > 0) setGalleryIndex(i => Math.min(displayPhotos.length - 1, i + 1));
                            else          setGalleryIndex(i => Math.max(0, i - 1));
                        }
                        touchStartX.current = null;
                    }}
                    onTouchStart={(e) => { touchStartX.current = e.touches[0].clientX; }}
                    onTouchEnd={(e) => {
                        if (touchStartX.current === null) return;
                        const diff = touchStartX.current - e.changedTouches[0].clientX;
                        if (Math.abs(diff) > 40) {
                            if (diff > 0) setGalleryIndex(i => Math.min(displayPhotos.length - 1, i + 1));
                            else          setGalleryIndex(i => Math.max(0, i - 1));
                        }
                        touchStartX.current = null;
                    }}
                >
                    <div 
                        className="flex h-full transition-transform duration-300 ease-in-out cursor-grab active:cursor-grabbing"
                        style={{ transform: `translateX(-${galleryIndex * 100}%)` }}
                    >
                        {displayPhotos.map((photo, i) => (
                            <img 
                                key={i} 
                                src={photo} 
                                alt={`Gallery ${i + 1}`} 
                                className="w-full h-full flex-shrink-0 object-cover"
                                onError={e => e.currentTarget.src = FALLBACK}
                                draggable={false}
                            />
                        ))}
                    </div>
                    
                    {/* Badges overlay */}
                    <div className="absolute left-4 top-4 flex flex-col gap-2 pointer-events-none">
                        {property.isBoosted && (
                            <span className="flex items-center gap-1.5 rounded-full bg-amber-600 px-3 py-1 text-xs font-bold text-white shadow-md">
                                <Sparkles size={12} /> Featured
                            </span>
                        )}
                        {property.isVerified && (
                            <span className="flex items-center gap-1.5 rounded-full bg-green-700 px-3 py-1 text-xs font-bold text-white shadow-md">
                                <CheckCircle2 size={12} /> Verified
                            </span>
                        )}
                    </div>

                    {/* Slider controls */}
                    {displayPhotos.length > 1 && (
                        <>
                            {galleryIndex > 0 && (
                                <button 
                                    onClick={(e) => { e.stopPropagation(); setGalleryIndex(i => Math.max(0, i - 1)); }}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-white/70 hover:bg-white backdrop-blur text-gray-900 shadow-lg transition opacity-100 md:opacity-0 md:group-hover:opacity-100"
                                >
                                    <ChevronLeft size={24} />
                                </button>
                            )}
                            {galleryIndex < displayPhotos.length - 1 && (
                                <button 
                                    onClick={(e) => { e.stopPropagation(); setGalleryIndex(i => Math.min(displayPhotos.length - 1, i + 1)); }}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-white/70 hover:bg-white backdrop-blur text-gray-900 shadow-lg transition opacity-100 md:opacity-0 md:group-hover:opacity-100"
                                >
                                    <ChevronRight size={24} />
                                </button>
                            )}
                            <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 bg-black/60 backdrop-blur px-4 py-1.5 rounded-full text-sm font-medium text-white shadow-md pointer-events-none">
                                {galleryIndex + 1} / {displayPhotos.length}
                            </div>
                        </>
                    )}
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 px-4 sm:px-0">
                    
                    {/* Left Column - Details */}
                    <div className="lg:col-span-2 space-y-8">
                        
                        {/* Header Info */}
                        <div className="pb-6 border-b border-gray-200">
                            <div className="flex flex-wrap items-center gap-2 mb-3">
                                <span className="rounded-full bg-[#f0f8e8] px-3 py-1 text-xs font-bold tracking-wide uppercase text-[#639922]">
                                    {property.propertyType}
                                </span>
                                <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-bold tracking-wide uppercase text-green-800 border border-green-100">
                                    {property.listingType}
                                </span>
                                {/* Desktop Badges */}
                                <div className="hidden md:flex gap-2">
                                    {property.isBoosted && (
                                        <span className="flex items-center gap-1 rounded-full bg-amber-100 text-amber-800 px-3 py-1 text-xs font-bold border border-amber-200">
                                            <Sparkles size={12} className="text-amber-600" /> Featured
                                        </span>
                                    )}
                                    {property.isVerified && (
                                        <span className="flex items-center gap-1 rounded-full bg-green-100 text-green-800 px-3 py-1 text-xs font-bold border border-green-200">
                                            <CheckCircle2 size={12} className="text-green-600" /> Verified
                                        </span>
                                    )}
                                </div>
                            </div>
                            
                            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-4 leading-tight">
                                {property.name}
                            </h1>
                            
                            {locationString && (
                                <div className="flex items-start gap-2.5 text-gray-600 bg-gray-100 p-3 sm:p-4 rounded-2xl w-fit">
                                    <MapPin size={20} className="shrink-0 text-green-700" />
                                    <span className="text-sm sm:text-base font-medium">{locationString}</span>
                                </div>
                            )}
                        </div>

                        {/* Amenities Section */}
                        <div className="pb-8 border-b border-gray-200">
                            <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <Sparkles size={20} className="text-amber-500" />
                                What this place offers
                            </h2>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-6 gap-x-4">
                                {property.ac && <AmenityItem icon={<Wind size={22} />} label="Air Conditioning" />}
                                {property.cooler && <AmenityItem icon={<Wind size={22} />} label="Air Cooler" />}
                                {property.kitchen && <AmenityItem icon={<Utensils size={22} />} label="Kitchen Available" />}
                                {property.parking && <AmenityItem icon={<Car size={22} />} label="Parking Space" />}
                                {property.washingMachine && <AmenityItem icon={<WashingMachine size={22} />} label="Washing Machine" />}
                                {property.attachedBathroom && <AmenityItem icon={<Bath size={22} />} label="Attached Bath" />}
                                {property.housekeeping && <AmenityItem icon={<Sparkles size={22} />} label="Housekeeping" />}
                                {property.table && <AmenityItem icon={<BedDouble size={22} />} label="Study Table" />}
                                {property.chair && <AmenityItem icon={<BedDouble size={22} />} label="Study Chair" />}
                            </div>
                        </div>

                        {/* Meals Section */}
                        {(property.breakfast || property.lunch || property.dinner || menuUrl) && (
                            <div className="pb-8 border-b border-gray-200">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                        <Utensils size={20} className="text-orange-500" />
                                        Food & Dining
                                    </h2>
                                    {menuUrl && (
                                        <a 
                                            href={menuUrl} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 px-4 py-2 bg-orange-50 text-orange-700 hover:bg-orange-100 rounded-xl font-medium transition text-sm border border-orange-200"
                                        >
                                            <FileText size={16} />
                                            View Menu
                                        </a>
                                    )}
                                </div>
                                
                                <div className="flex flex-wrap gap-4">
                                    {property.breakfast && (
                                        <div className="flex items-center gap-3 bg-orange-50/50 border border-orange-100 p-4 rounded-2xl">
                                            <div className="bg-orange-100 p-2.5 rounded-full text-orange-600"><Coffee size={20} /></div>
                                            <span className="font-semibold text-orange-900">Breakfast</span>
                                        </div>
                                    )}
                                    {property.lunch && (
                                        <div className="flex items-center gap-3 bg-orange-50/50 border border-orange-100 p-4 rounded-2xl">
                                            <div className="bg-orange-100 p-2.5 rounded-full text-orange-600"><Soup size={20} /></div>
                                            <span className="font-semibold text-orange-900">Lunch</span>
                                        </div>
                                    )}
                                    {property.dinner && (
                                        <div className="flex items-center gap-3 bg-orange-50/50 border border-orange-100 p-4 rounded-2xl">
                                            <div className="bg-orange-100 p-2.5 rounded-full text-orange-600"><Utensils size={20} /></div>
                                            <span className="font-semibold text-orange-900">Dinner</span>
                                        </div>
                                    )}
                                    
                                    {!property.breakfast && !property.lunch && !property.dinner && menuUrl && (
                                        <p className="text-gray-500 text-sm">See the menu for available food options and pricing.</p>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Description Placeholder */}
                        <div className="pb-8">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">About this property</h2>
                            <p className="text-gray-600 leading-relaxed">
                                Experience comfortable living at {property.name}. This well-maintained {property.propertyType.toLowerCase()} is perfect for those seeking a hassle-free stay. Strategically located with essential amenities nearby. The property features modern infrastructure and a safe environment. Contact the owner today to schedule a visit!
                            </p>
                        </div>

                    </div>

                    {/* Right Column - Sticky Sidebar Pricing Card */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24 bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-xl shadow-gray-200/50">
                            <div className="flex items-end gap-1 mb-6 pb-6 border-b border-gray-100">
                                <span className="text-3xl font-extrabold text-gray-900">{formatPrice(property.rent)}</span>
                                <span className="text-gray-500 font-medium mb-1">/month</span>
                            </div>

                            <div className="space-y-4 mb-8">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-600 font-medium">Monthly Rent</span>
                                    <span className="font-bold text-gray-900">{formatPrice(property.rent)}</span>
                                </div>
                                {property.electricity > 0 ? (
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-gray-600 font-medium flex items-center gap-1"><Zap size={14} className="text-amber-500"/> Electricity</span>
                                        <span className="font-bold text-gray-900">{formatPrice(property.electricity)} /mo</span>
                                    </div>
                                ) : (
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-gray-600 font-medium flex items-center gap-1"><Zap size={14} className="text-amber-500"/> Electricity</span>
                                        <span className="font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded text-xs">Included</span>
                                    </div>
                                )}
                            </div>

                            <div className="bg-green-50 border border-green-100 rounded-2xl p-4 mb-6 flex gap-3">
                                <div className="bg-white p-2 rounded-full h-fit text-green-600 shadow-sm">
                                    <CheckCircle2 size={20} />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-green-900">Verified Listing</p>
                                    <p className="text-xs text-green-700 mt-0.5 leading-relaxed">This property has been verified for authenticity and quality.</p>
                                </div>
                            </div>

                            {property.phone ? (
                                <a 
                                    href={`tel:${property.phone}`}
                                    className="w-full flex items-center justify-center gap-2 bg-green-800 hover:bg-green-900 text-white font-bold py-4 rounded-2xl transition shadow-md shadow-green-800/20 active:scale-[0.98]"
                                >
                                    <Phone size={20} />
                                    Contact Owner
                                </a>
                            ) : (
                                <button 
                                    disabled
                                    className="w-full flex items-center justify-center gap-2 bg-gray-100 text-gray-400 font-bold py-4 rounded-2xl cursor-not-allowed"
                                >
                                    <Phone size={20} />
                                    Contact Unavailable
                                </button>
                            )}
                            <p className="text-center text-xs text-gray-400 mt-4 font-medium">You won't be charged yet</p>
                        </div>
                    </div>

                </div>
            </div>

            {/* Mobile Fixed Bottom Bar (Visible only on small screens) */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] z-50 flex items-center justify-between">
                <div>
                    <p className="text-sm text-gray-500 font-medium">Rent</p>
                    <p className="text-xl font-extrabold text-gray-900">{formatPrice(property.rent)}<span className="text-sm font-normal text-gray-500"> /mo</span></p>
                </div>
                {property.phone && (
                    <a 
                        href={`tel:${property.phone}`}
                        className="flex items-center gap-2 bg-green-800 hover:bg-green-900 text-white font-bold px-8 py-3.5 rounded-xl transition shadow-md active:scale-[0.98]"
                    >
                        <Phone size={18} />
                        Call
                    </a>
                )}
            </div>
        </main>
    );
}

function AmenityItem({ icon, label }: { icon: React.ReactNode; label: string }) {
    return (
        <div className="flex items-center gap-3 text-gray-700 font-medium">
            <div className="text-gray-400 shrink-0">{icon}</div>
            <span className="text-sm sm:text-base">{label}</span>
        </div>
    );
}