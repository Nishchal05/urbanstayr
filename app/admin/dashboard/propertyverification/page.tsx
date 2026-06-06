"use client"
import axios from "axios";
import { useEffect, useState } from "react";
import { Check, X, Loader2, Home, MapPin, IndianRupee, Image as ImageIcon } from "lucide-react";

export default function PropertyVerification() {
    const [properties, setProperties] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [rejectingId, setRejectingId] = useState<number | null>(null);
    const [rejectReason, setRejectReason] = useState("");
    const [actionLoading, setActionLoading] = useState<number | null>(null);

    async function fetchProperties() {
        try {
            const response = await axios.get("/api/auth/admin/Property");
            setProperties(response.data.property || []);
        } catch (error) {
            console.error("Failed to fetch properties:", error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchProperties();
    }, []);

    const handleVerify = async (id: number) => {
        try {
            setActionLoading(id);
            await axios.put("/api/auth/admin/Property", { id });
            // remove verified property from list
            setProperties(prev => prev.filter(p => p.id !== id));
        } catch (error) {
            console.error("Failed to verify property:", error);
            alert("Failed to verify property");
        } finally {
            setActionLoading(null);
        }
    };

    const handleReject = async (id: number) => {
        if (!rejectReason.trim()) {
            alert("Please provide a reason for rejection.");
            return;
        }
        try {
            setActionLoading(id);
            await axios.post("/api/auth/admin/message", { propertyId: id, feedback: rejectReason });
            // remove rejected property from list
            setProperties(prev => prev.filter(p => p.id !== id));
            setRejectingId(null);
            setRejectReason("");
        } catch (error) {
            console.error("Failed to reject property:", error);
            alert("Failed to reject property");
        } finally {
            setActionLoading(null);
        }
    };

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-gray-50">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="mx-auto max-w-5xl">
                <header className="mb-8 border-b border-gray-200 pb-4">
                    <h1 className="text-3xl font-bold text-gray-900">Property Verification</h1>
                    <p className="mt-2 text-gray-500">Review and verify new property listings submitted by hosts.</p>
                </header>

                {properties.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-2xl border border-gray-200 bg-white p-12 shadow-sm">
                        <Home className="mb-4 h-16 w-16 text-gray-300" />
                        <h2 className="text-xl font-semibold text-gray-900">No properties pending</h2>
                        <p className="text-gray-500">All properties have been reviewed.</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {properties.map(property => (
                            <div key={property.id} className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                                <div className="p-6">
                                    <div className="flex flex-col gap-6 md:flex-row md:justify-between">
                                        <div className="flex-1 space-y-4">
                                            <div>
                                                <h2 className="text-2xl font-bold text-gray-900">{property.name}</h2>
                                                <div className="mt-1 flex items-center text-gray-500">
                                                    <MapPin className="mr-1 h-4 w-4" />
                                                    <span>{property.sector}, {property.area}, {property.street}</span>
                                                </div>
                                            </div>
                                            
                                            <div className="grid grid-cols-2 gap-4 rounded-xl bg-gray-50 p-4">
                                                <div>
                                                    <p className="text-sm font-medium text-gray-500">Property Type</p>
                                                    <p className="font-semibold text-gray-900">{property.propertyType}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-gray-500">Listing Type</p>
                                                    <p className="font-semibold text-gray-900">{property.listingType}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-gray-500">Rent</p>
                                                    <p className="flex items-center font-semibold text-gray-900">
                                                        <IndianRupee className="mr-1 h-4 w-4" /> {property.rent}/mo
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-gray-500">Contact</p>
                                                    <p className="font-semibold text-gray-900">{property.phone}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex w-full flex-col gap-3 md:w-64">
                                            {rejectingId === property.id ? (
                                                <div className="flex flex-col gap-2 rounded-xl border border-red-200 bg-red-50 p-3">
                                                    <label className="text-sm font-medium text-red-800">Rejection Reason</label>
                                                    <textarea 
                                                        className="w-full rounded-lg border border-red-200 bg-white p-2 text-sm text-black focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                                                        rows={3}
                                                        placeholder="Provide feedback..."
                                                        value={rejectReason}
                                                        onChange={(e) => setRejectReason(e.target.value)}
                                                    />
                                                    <div className="flex gap-2">
                                                        <button 
                                                            onClick={() => handleReject(property.id)}
                                                            disabled={actionLoading === property.id}
                                                            className="flex-1 rounded-lg bg-red-600 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50"
                                                        >
                                                            {actionLoading === property.id ? <Loader2 className="mx-auto h-4 w-4 animate-spin" /> : "Confirm"}
                                                        </button>
                                                        <button 
                                                            onClick={() => { setRejectingId(null); setRejectReason(""); }}
                                                            className="flex-1 rounded-lg border border-gray-300 bg-white py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                                                        >
                                                            Cancel
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <>
                                                    <button 
                                                        onClick={() => handleVerify(property.id)}
                                                        disabled={actionLoading === property.id}
                                                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 font-semibold text-white transition-colors hover:bg-emerald-700 disabled:opacity-50"
                                                    >
                                                        {actionLoading === property.id ? <Loader2 className="h-5 w-5 animate-spin" /> : <Check className="h-5 w-5" />}
                                                        Verify Property
                                                    </button>
                                                    <button 
                                                        onClick={() => setRejectingId(property.id)}
                                                        disabled={actionLoading === property.id}
                                                        className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-3 font-semibold text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50"
                                                    >
                                                        <X className="h-5 w-5" />
                                                        Reject
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                    
                                    {/* Photos Section */}
                                    <div className="mt-6 border-t border-gray-100 pt-6">
                                        <h3 className="mb-4 flex items-center text-lg font-semibold text-gray-900">
                                            <ImageIcon className="mr-2 h-5 w-5 text-gray-400" />
                                            Uploaded Photos
                                        </h3>
                                        <div>
                                            <div className="min-w-[200px]">
                                                    <p className="mb-2 text-sm font-medium text-gray-500">Menu</p>
                                                    <img src={property.menu.url} alt="Menu" className="h-32 w-48 rounded-lg object-cover shadow-sm" />
                                                </div>
                                        </div>
                                        <div className="flex gap-4 overflow-x-auto pb-4">
                                            {property.photoProperty && (
                                                <div className="min-w-[200px]">
                                                    <p className="mb-2 text-sm font-medium text-gray-500">Main Property</p>
                                                    <img src={property.photoProperty} alt="Property" className="h-32 w-48 rounded-lg object-cover shadow-sm" />
                                                </div>
                                            )}
                                            {property.photoWashroom && (
                                                <div className="min-w-[200px]">
                                                    <p className="mb-2 text-sm font-medium text-gray-500">Washroom</p>
                                                    <img src={property.photoWashroom} alt="Washroom" className="h-32 w-48 rounded-lg object-cover shadow-sm" />
                                                </div>
                                            )}
                                            {property.photoKitchen && (
                                                <div className="min-w-[200px]">
                                                    <p className="mb-2 text-sm font-medium text-gray-500">Kitchen</p>
                                                    <img src={property.photoKitchen} alt="Kitchen" className="h-32 w-48 rounded-lg object-cover shadow-sm" />
                                                </div>
                                            )}
                                            {property.photoRooms && Array.isArray(property.photoRooms) && property.photoRooms.map((roomPic: string, idx: number) => (
                                                <div key={idx} className="min-w-[200px]">
                                                    <p className="mb-2 text-sm font-medium text-gray-500">Room {idx + 1}</p>
                                                    <img src={roomPic} alt={`Room ${idx + 1}`} className="h-32 w-48 rounded-lg object-cover shadow-sm" />
                                                </div>
                                            ))}
                                            {!property.photoProperty && !property.photoWashroom && !property.photoKitchen && (!property.photoRooms || property.photoRooms.length === 0) && (
                                                <p className="py-4 text-sm italic text-gray-500">No photos uploaded by the client.</p>
                                            )}
                                        </div>
                                    </div>

                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}