"use client"
import react, { useState } from "react"
import { useParams } from "next/navigation";
import PgSharing from "./PgSharing";
import PropertyDetails from "./PropertyDetails";
import RoomDetails from "./RoomDetails";
import Food from "./Food";
import PropertyPictures from "./PropertyPictures";
import PropertyPricing from "./PropertyPricing";
import Pricing from "@/app/components/Pricing";
import PropertySubmit from "./PropertySubmit";
import Propertytype from "./Propertytype";
export default function () {
    const params = useParams();
    const type = typeof params?.type === "string" ? params.type : "";

    const [flowno, setflowno] = useState<number>(0);
    const [form, setform] = useState<any>({
        propertyType: "",
        name: "",
        sector: "",
        area: "",
        street: "",
        phone: "",
        location: "",
        latitude: 0,
        longitude: 0,
        amenities: {
            ac: false,
            cooler: false,
            table: false,
            chair: false,
            attachedBathroom: false,
            housekeeping: false,
            washingMachine: false,
            parking: false,
            kitchenAccess: false,
        },
        sharingWashroom: "",
        breakfast: false,
        lunch: false,
        dinner: false,
        menu: null,
        photoRooms: null,
        photoWashroom: null,
        photoKitchen: null,
        photoProperty: null,
        photoWashing: null,
        photoParking: null,
        photoDining: null,
        photoTerrace: null,
        rent: 0,
        electricity: 0,
        listingType: type,

    });
    return (
        <section>
            {flowno == 0 && <Propertytype  setProperty={setform} setflowno={setflowno} />}
            {flowno == 1 && <PgSharing Property={form} setProperty={setform} setflowno={setflowno} />}
            {flowno == 2 && <PropertyDetails Property={form} setProperty={setform} setflowno={setflowno} />}
            {flowno == 3 && <RoomDetails  Property={form} setProperty={setform} setflowno={setflowno} />}
            {flowno == 4 && <Food Property={form} setProperty={setform} setflowno={setflowno} />}
            {flowno == 5 && <PropertyPictures Property={form} setProperty={setform} setflowno={setflowno} />}
            {flowno == 6 && <PropertyPricing Property={form} setProperty={setform} setflowno={setflowno} />}
            {flowno == 7 && <Pricing Property={form} setflowno={setflowno} />}
            {flowno > 7 && <PropertySubmit/>}
        </section>
    )
}