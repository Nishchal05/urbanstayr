"use client";

import { useRef } from "react";
import {
  Upload,
  ImagePlus,
  BedDouble,
  Bath,
  CookingPot,
  Building2,
  WashingMachine,
  Car,
  UtensilsCrossed,
  Images,
  Check,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";

interface PropertyPicturesProps {
  Property: any;
  setProperty: any;
  setflowno: any;
}

const pictureCategories = [
  {
    key: "roomImages",
    label: "Room",
    desc: "Upload bedroom photos",
    icon: BedDouble,
  },
  {
    key: "washroomImages",
    label: "Washroom",
    desc: "Bathroom & washroom photos",
    icon: Bath,
  },
  {
    key: "kitchenImages",
    label: "Kitchen",
    desc: "Kitchen area pictures",
    icon: CookingPot,
  },
  {
    key: "propertyImages",
    label: "Property",
    desc: "Building exterior & entrance",
    icon: Building2,
  },
  {
    key: "washingImages",
    label: "Laundry",
    desc: "Washing machine area",
    icon: WashingMachine,
  },
  {
    key: "parkingImages",
    label: "Parking",
    desc: "Parking availability photos",
    icon: Car,
  },
  {
    key: "diningImages",
    label: "Dining",
    desc: "Dining & food area",
    icon: UtensilsCrossed,
  },
  {
    key: "otherImages",
    label: "Other",
    desc: "Additional property photos",
    icon: Images,
  },
];

export default function PropertyPictures({
  Property = {},
  setProperty,
  setflowno,
}: PropertyPicturesProps) {
  const fileRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const handleFileUpload = (
    key: string,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(e.target.files || []);

    setProperty((prev: any) => ({
      ...prev,
      [key]: files,
    }));
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-1.5 text-sm font-medium text-emerald-700">
            <Check size={14} />
            Property Gallery
          </div>

          <h1 className="mt-4 text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
            Upload Property Pictures
          </h1>

          <p className="mt-3 max-w-2xl text-sm sm:text-base text-slate-600">
            High quality photos increase trust and improve booking chances for
            your property.
          </p>
        </div>

        {/* Main Card */}
        <div className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-8 shadow-sm">
          {/* Grid */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {pictureCategories.map((item) => {
              const Icon = item.icon;
              const uploadedFiles = Property?.[item.key] || [];
              const hasFiles = uploadedFiles.length > 0;

              return (
                <div
                  key={item.key}
                  className={`
                    rounded-3xl border p-5 transition-all duration-300
                    ${
                      hasFiles
                        ? "border-emerald-300 bg-emerald-50"
                        : "border-slate-200 bg-white hover:border-emerald-300 hover:shadow-md"
                    }
                  `}
                >
                  {/* Top */}
                  <div className="flex items-start justify-between gap-3">
                    <div
                      className={`
                        flex h-14 w-14 items-center justify-center rounded-2xl
                        ${
                          hasFiles
                            ? "bg-emerald-600 text-white"
                            : "bg-slate-100 text-slate-700"
                        }
                      `}
                    >
                      <Icon size={26} />
                    </div>

                    {hasFiles && (
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-600 text-white">
                        <Check size={15} />
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="mt-5">
                    <h3 className="text-lg font-semibold text-slate-900">
                      {item.label}
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      {item.desc}
                    </p>
                  </div>

                  {/* Upload Area */}
                  <button
                    type="button"
                    onClick={() =>
                      fileRefs.current[item.key]?.click()
                    }
                    className={`
                      mt-5 flex w-full flex-col items-center justify-center
                      rounded-2xl border-2 border-dashed px-4 py-6
                      transition-all duration-300
                      ${
                        hasFiles
                          ? "border-emerald-300 bg-white hover:bg-emerald-50"
                          : "border-slate-300 bg-slate-50 hover:border-emerald-400 hover:bg-emerald-50"
                      }
                    `}
                  >
                    <input
                      ref={(el) => {
                        fileRefs.current[item.key] = el;
                      }}
                      type="file"
                      multiple
                      accept=".jpeg,.jpg,.png"
                      className="hidden"
                      onChange={(e) =>
                        handleFileUpload(item.key, e)
                      }
                    />

                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm">
                      {hasFiles ? (
                        <ImagePlus
                          size={24}
                          className="text-emerald-600"
                        />
                      ) : (
                        <Upload
                          size={24}
                          className="text-slate-600"
                        />
                      )}
                    </div>

                    <p className="mt-4 text-sm font-semibold text-slate-800">
                      {hasFiles
                        ? "Add More Photos"
                        : "Upload Photos"}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      JPG, JPEG, PNG
                    </p>
                  </button>

                  {/* Preview */}
                  {hasFiles && (
                    <div className="mt-4 rounded-2xl border border-emerald-100 bg-white p-3">
                      <p className="text-sm font-semibold text-emerald-800">
                        {uploadedFiles.length} file
                        {uploadedFiles.length > 1 ? "s" : ""} uploaded
                      </p>

                      <div className="mt-2 space-y-1">
                        {uploadedFiles
                          .slice(0, 2)
                          .map((file: File, index: number) => (
                            <p
                              key={index}
                              className="truncate text-xs text-slate-500"
                            >
                              {file.name}
                            </p>
                          ))}

                        {uploadedFiles.length > 2 && (
                          <p className="text-xs text-emerald-700">
                            +{uploadedFiles.length - 2} more
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Bottom Note */}
          <div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-4">
            <p className="text-sm font-medium text-amber-900">
              Tips for better property photos
            </p>

            <ul className="mt-2 space-y-1 text-sm text-amber-700">
              <li>• Use bright and clean images</li>
              <li>• Upload landscape photos for better visibility</li>
              <li>• Avoid blurry or dark pictures</li>
            </ul>
          </div>

          {/* Footer */}
          <div className="mt-10 flex flex-col-reverse gap-4 sm:flex-row sm:items-center sm:justify-between">
            {/* Back */}
            <button
              type="button"
              onClick={() =>
                setflowno((prev: number) => prev - 1)
              }
              className="
                flex w-full items-center justify-center gap-2
                rounded-2xl border border-slate-300 bg-white
                px-6 py-3 text-sm font-semibold text-slate-700
                transition-all hover:bg-slate-50
                sm:w-auto
              "
            >
              <ChevronLeft size={18} />
              Back
            </button>

            {/* Next */}
            <button
              type="button"
              onClick={() =>
                setflowno((prev: number) => prev + 1)
              }
              className="
                flex w-full items-center justify-center gap-2
                rounded-2xl bg-emerald-600
                px-8 py-3 text-sm font-semibold text-white
                shadow-lg shadow-emerald-200
                transition-all duration-300
                hover:scale-[1.01] hover:bg-emerald-700
                sm:w-auto
              "
            >
              Save & Continue
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}