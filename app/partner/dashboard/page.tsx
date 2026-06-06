"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Building2,
  TrendingUp,
  Eye,
  MousePointerClick,
  ShieldCheck,
  Zap,
  Plus,
  ExternalLink,
  Crown,
  Calendar,
  LayoutDashboard,
} from "lucide-react";

type Property = {
  id: number;
  name: string;
  location: string | null;
  sector: string | null;
  area: string | null;
  rent: number;
  electricity: number;
  propertyType: string;
  listingType: string;
  isVerified: boolean;
  status: string;
  rejectionReason: string | null;
  isBoosted: boolean;
  clickCount: number;
  impressionCount: number;
  seoScore: number;
  photoProperty: string | null;
  createdAt: string;
};

type Partner = {
  id: string;
  name: string | null;
  email: string;
  subscription: string | null;
  subscriptionstarting: string | null;
  subscriptionending: string | null;
  memberSince: string;
};

type Stats = {
  totalProperties: number;
  verifiedCount: number;
  boostedCount: number;
  totalClicks: number;
  totalImpressions: number;
};

export default function PartnerDashboard() {
  const [partner, setPartner] = useState<Partner | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const res = await axios.get("/api/partner/dashboard");
        setPartner(res.data.partner);
        setStats(res.data.stats);
        setProperties(res.data.properties);
      } catch (error) {
        console.error("Failed to fetch partner details:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchDashboard();
  }, []);

  const subscriptionColor: Record<string, string> = {
    free: "text-gray-500 bg-gray-100",
    premium: "text-amber-700 bg-amber-100",
    pro: "text-emerald-700 bg-emerald-100",
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-green-800 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-500">Loading dashboard…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/60">
      <div className="max-w-5xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-green-800 flex items-center justify-center">
              <LayoutDashboard size={15} color="white" />
            </div>
            <div>
              <h1 className="text-base font-semibold text-green-900 leading-tight">
                Partner Dashboard
              </h1>
              <p className="text-xs text-gray-500">
                Welcome back, {partner?.name ?? partner?.email}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {partner?.subscription && (
              <span
                className={`text-xs font-medium px-2.5 py-1 rounded-full flex items-center gap-1 ${
                  subscriptionColor[partner.subscription] ?? "text-gray-500 bg-gray-100"
                }`}
              >
                <Crown size={11} />
                {partner.subscription.charAt(0).toUpperCase() + partner.subscription.slice(1)}
              </span>
            )}
            <Link
              href="/rent/pg"
              className="flex items-center gap-1.5 bg-green-800 hover:bg-green-900 text-white text-xs font-medium px-3 py-1.5 rounded-full transition-colors"
            >
              <Plus size={13} />
              Add Property
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        {stats && (
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
            {[
              {
                label: "Properties",
                value: stats.totalProperties,
                icon: <Building2 size={15} />,
                color: "text-green-800 bg-green-50",
              },
              {
                label: "Verified",
                value: stats.verifiedCount,
                icon: <ShieldCheck size={15} />,
                color: "text-blue-700 bg-blue-50",
              },
              {
                label: "Boosted",
                value: stats.boostedCount,
                icon: <Zap size={15} />,
                color: "text-amber-700 bg-amber-50",
              },
              {
                label: "Total Clicks",
                value: stats.totalClicks,
                icon: <MousePointerClick size={15} />,
                color: "text-purple-700 bg-purple-50",
              },
              {
                label: "Impressions",
                value: stats.totalImpressions,
                icon: <Eye size={15} />,
                color: "text-teal-700 bg-teal-50",
              },
            ].map((s) => (
              <div
                key={s.label}
                className="bg-white border border-gray-100 rounded-xl px-4 py-3 flex flex-col gap-1.5 shadow-sm"
              >
                <span className={`w-7 h-7 rounded-lg flex items-center justify-center ${s.color}`}>
                  {s.icon}
                </span>
                <span className="text-lg font-bold text-gray-800 leading-tight">{s.value}</span>
                <span className="text-[11px] text-gray-400 font-medium">{s.label}</span>
              </div>
            ))}
          </div>
        )}

        {/* Subscription Info */}
        {partner?.subscription && (
          <div className="bg-white border border-gray-100 rounded-xl px-4 py-3 mb-6 shadow-sm flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <Crown size={14} className="text-amber-600" />
              <span className="text-xs font-medium text-gray-700">
                {partner.subscription.charAt(0).toUpperCase() + partner.subscription.slice(1)} Plan
              </span>
            </div>
            {partner.subscriptionstarting && (
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <Calendar size={12} />
                Started: {new Date(partner.subscriptionstarting).toLocaleDateString()}
              </div>
            )}
            {partner.subscriptionending && (
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <Calendar size={12} />
                Expires: {new Date(partner.subscriptionending).toLocaleDateString()}
              </div>
            )}
            <Link
              href="/partner/subscription"
              className="ml-auto text-xs text-green-800 hover:underline font-medium"
            >
              Manage →
            </Link>
          </div>
        )}

        {/* Properties List */}
        <div>
          <h2 className="text-sm font-semibold text-gray-700 mb-3">Your Properties</h2>

          {properties.length === 0 ? (
            <div className="bg-white border border-dashed border-gray-200 rounded-xl py-12 flex flex-col items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center">
                <Building2 size={18} className="text-green-800" />
              </div>
              <p className="text-sm text-gray-500">No properties listed yet.</p>
              <Link
                href="/rent/pg"
                className="text-xs text-green-800 font-medium hover:underline flex items-center gap-1"
              >
                <Plus size={12} /> Add your first property
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {properties.map((property) => (
                <div
                  key={property.id}
                  className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm flex items-center gap-4 hover:border-green-200 transition-colors"
                >
                  {/* Thumbnail */}
                  <div className="w-14 h-14 rounded-lg bg-green-50 flex-shrink-0 overflow-hidden">
                    {property.photoProperty ? (
                      <img
                        src={property.photoProperty}
                        alt={property.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Building2 size={20} className="text-green-600" />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-semibold text-gray-800 truncate">
                        {property.name}
                      </span>
                      {property.status === "REJECTED" ? (
                        <span className="text-[10px] font-medium text-red-700 bg-red-50 px-1.5 py-0.5 rounded-full flex items-center gap-0.5 border border-red-100">
                          <ShieldCheck size={9} /> Rejected
                        </span>
                      ) : property.isVerified ? (
                        <span className="text-[10px] font-medium text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded-full flex items-center gap-0.5 border border-blue-100">
                          <ShieldCheck size={9} /> Verified
                        </span>
                      ) : (
                        <span className="text-[10px] font-medium text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded-full flex items-center gap-0.5 border border-amber-100">
                          <ShieldCheck size={9} /> Pending
                        </span>
                      )}
                      {property.isBoosted && (
                        <span className="text-[10px] font-medium text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                          <Zap size={9} /> Boosted
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-gray-400 mt-0.5 truncate">
                      {[property.sector, property.area, property.location]
                        .filter(Boolean)
                        .join(", ") || "Location not set"}
                    </p>
                    <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                      <span className="text-[11px] text-gray-500 flex items-center gap-1">
                        <MousePointerClick size={10} /> {property.clickCount} clicks
                      </span>
                      <span className="text-[11px] text-gray-500 flex items-center gap-1">
                        <Eye size={10} /> {property.impressionCount} views
                      </span>
                      <span className="text-[11px] text-gray-500 flex items-center gap-1">
                        <TrendingUp size={10} /> SEO {property.seoScore}
                      </span>
                    </div>

                    {property.status === "REJECTED" && property.rejectionReason && (
                      <div className="mt-2.5 bg-red-50/80 border border-red-100 rounded-lg p-2 flex gap-2 w-full max-w-sm">
                        <div className="text-red-500 mt-0.5 shrink-0">
                          <ShieldCheck size={12} />
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-red-800">Action Required: Update Listing</p>
                          <p className="text-[10px] text-red-700 mt-0.5 leading-snug">{property.rejectionReason}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Rent + Actions */}
                  <div className="flex flex-col items-end gap-2 flex-shrink-0">
                    <div className="text-right">
                      <span className="text-sm font-bold text-green-800">
                        ₹{property.rent.toLocaleString()}
                      </span>
                      <span className="text-[10px] text-gray-400 block">/month</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] text-gray-400 bg-gray-50 border border-gray-100 px-2 py-0.5 rounded-full capitalize">
                        {property.propertyType}
                      </span>
                      <Link
                        href={`/rent/${property.listingType}/${property.id}`}
                        className="text-green-700 hover:text-green-900 transition-colors"
                        title="View listing"
                      >
                        <ExternalLink size={13} />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}