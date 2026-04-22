import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Rent() {
  const cookieStore = await cookies();
  const isloggedin = cookieStore.get("token")?.value;
  
  if (!isloggedin) {
    redirect("/Login");
  }

  return (
    <section className="w-[90%] max-w-[900px] mx-auto mt-10 p-8 bg-white border border-green-700/20 rounded-2xl shadow-sm text-center">
      <h1 className="text-2xl font-bold text-green-900 mb-2">Welcome to the Rent Dashboard</h1>
      <p className="text-gray-600">You are securely logged in.</p>
    </section>
  );
}