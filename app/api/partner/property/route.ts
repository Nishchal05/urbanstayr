import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";

const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

async function uploadToS3(file: File): Promise<string> {
  const filename = file.name;
  const contentType = file.type;
  const ext = filename.split(".").pop();
  const key = `uploads/${uuidv4()}.${ext}`;

  const buffer = Buffer.from(await file.arrayBuffer());

  const command = new PutObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET_NAME!,
    Key: key,
    ContentType: contentType,
    Body: buffer,
  });

  await s3.send(command);

  return `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
}

export async function POST(request: NextRequest) {
  try {
    // ✅ Get user from token (cookie handled inside)
    const session = await getSession();

    if (!session || !session.userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const userId = session.userId;
    const contentType = request.headers.get("content-type") || "";
    let propertyData: any = {};

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();

      const getString = (key: string): string | null => {
        const val = formData.get(key);
        if (val === null || val === undefined || val === "null" || val === "undefined" || val === "") return null;
        return String(val);
      };

      const getBool = (key: string): boolean => {
        const val = formData.get(key);
        return val === "true";
      };

      const getFloat = (key: string): number | null => {
        const val = formData.get(key);
        if (!val) return null;
        const num = parseFloat(String(val));
        return isNaN(num) ? null : num;
      };

      const getInt = (key: string): number => {
        const val = formData.get(key);
        if (!val) return 0;
        const num = parseInt(String(val), 10);
        return isNaN(num) ? 0 : num;
      };

      // Upload helper
      const uploadFiles = async (key: string): Promise<string[]> => {
        const files = formData.getAll(key).filter((f) => f instanceof File && f.size > 0) as File[];
        const urls: string[] = [];
        for (const file of files) {
          try {
            const url = await uploadToS3(file);
            if (url) urls.push(url);
          } catch (err) {
            console.error(`Failed to upload file for key ${key}:`, err);
          }
        }
        return urls;
      };

      let menuJson: any = null;
      const menuFile = formData.get("menu");
      if (menuFile instanceof File && menuFile.size > 0) {
        try {
          const menuUrl = await uploadToS3(menuFile);
          menuJson = { url: menuUrl, name: menuFile.name };
        } catch (err) {
          console.error("Failed to upload menu:", err);
        }
      } else if (typeof menuFile === "string" && menuFile !== "" && menuFile !== "null") {
        menuJson = { url: menuFile };
      }

      const photoRooms = await uploadFiles("roomImages");
      const photoWashroom = (await uploadFiles("washroomImages"))[0] || null;
      const photoKitchen = (await uploadFiles("kitchenImages"))[0] || null;
      const photoProperty = (await uploadFiles("propertyImages"))[0] || null;
      const photoWashing = (await uploadFiles("washingImages"))[0] || null;
      const photoParking = (await uploadFiles("parkingImages"))[0] || null;
      const photoDining = (await uploadFiles("diningImages"))[0] || null;
      const photoTerrace = (await uploadFiles("otherImages"))[0] || null;

      propertyData = {
        name: getString("name") || "",
        sector: getString("sector"),
        area: getString("area"),
        street: getString("street"),
        phone: getString("phone"),
        location: getString("location"),
        latitude: getFloat("latitude"),
        longitude: getFloat("longitude"),
        ac: getBool("ac"),
        cooler: getBool("cooler"),
        table: getBool("table"),
        chair: getBool("chair"),
        attachedBathroom: getBool("attachedBathroom") || getBool("attachedWashroom"),
        sharingWashroom: getString("sharingWashroom"),
        breakfast: getBool("breakfast"),
        lunch: getBool("lunch"),
        dinner: getBool("dinner"),
        menu: menuJson,
        housekeeping: getBool("housekeeping"),
        washingMachine: getBool("washingMachine"),
        parking: getBool("parking"),
        kitchen: getBool("kitchenAccess") || getBool("kitchen"),
        photoRooms: photoRooms.length > 0 ? photoRooms : null,
        photoWashroom,
        photoKitchen,
        photoProperty,
        photoWashing,
        photoParking,
        photoDining,
        photoTerrace,
        rent: getInt("rent"),
        electricity: getInt("electricity"),
        propertyType: getString("propertyType") || "",
        listingType: getString("listingType") || "",
      };
    } else {
      // JSON body fallback
      const body = await request.json();
      propertyData = {
        ...body,
        latitude: body.latitude ? parseFloat(body.latitude) : null,
        longitude: body.longitude ? parseFloat(body.longitude) : null,
        rent: Number(body.rent),
        electricity: Number(body.electricity),
      };
    }

    // 🛠 Create property
    const property = await prisma.property.create({
      data: {
        ...propertyData,
        user: {
          connect: { id: userId },
        },
      },
    });

    return NextResponse.json(
      {
        message: "Property created successfully",
        property,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}