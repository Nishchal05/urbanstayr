"use client"
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Rent() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const res = await fetch("/api/me");
      const data = await res.json();

      if (!data.loggedIn) {
        router.push("/login"); // 🔥 redirect if not logged in
      } else {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) return <p>Checking auth...</p>;

  return (
    <section>
      <h1>Welcome, you are logged in</h1>
    </section>
  );
}