
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import RentPgHome from "./component/RentPgHome";
export default async function RentPg() {
  const cookieStore = await cookies();
  const cookie = cookieStore.get("token");
  if (!cookie) {
    redirect("/Login");
  }
  return (
    <RentPgHome/>
  );
}
