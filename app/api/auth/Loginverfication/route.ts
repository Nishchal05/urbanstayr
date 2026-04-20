// app/api/me/route.ts
import { cookies } from "next/headers";

export async function GET () {
    const cookieStore = await cookies();
    const token = cookieStore.get("token");
  if (!token) {
    return Response.json({ loggedIn: false });
  }

  // (optional) verify JWT here

  return Response.json({
    loggedIn: true,
    user: {
      role: "client", // or partner
    },
  });
}