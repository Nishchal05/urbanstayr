"use client";

import { Mail, Lock, LogIn } from "lucide-react";
import { useState } from "react";
import axios from "axios";
import { redirect } from "next/navigation";

export default function EmployeeLoginPage() {

  const [form, setForm] = useState({
    email: "",
    password: "",
    role: "employee",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await axios.post(
        "/api/auth/admin/login",
        form
      );

      if (response.data.message === "Login successful") {
        redirect("/admin/dashboard");
      }
    } catch (error: any) {
      console.error(error);

      alert(
        error?.response?.data?.message ||
          "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20">
            <LogIn className="h-8 w-8 text-green-300" />
          </div>

          <h1 className="mt-4 text-3xl font-bold text-black">
            Employee Portal
          </h1>

          <p className="mt-2 text-black">
            Sign in to access your workspace
          </p>
        </div>

        {/* Login Card */}
        <div className="rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Email Address
              </label>

              <div className="relative">
                <Mail
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-green-300"
                  size={18}
                />

                <input
                  name="email"
                  type="email"
                  placeholder="employee@company.com"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/10 border border-white/20 text-black placeholder:text-gray-300 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/30"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Password
              </label>

              <div className="relative">
                <Lock
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-green-300"
                  size={18}
                />

                <input
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/10 border border-white/20 text-black placeholder:text-gray-300 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/30"
                />
              </div>
            </div>

            {/* Forgot Password */}
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => redirect("/employee/forgot-password")}
                className="text-sm text-blue-300 hover:text-blue-200 transition cursor-pointer"
              >
                Forgot Password?
              </button>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-green-700 to-blue-700 text-white font-semibold shadow-lg hover:from-green-600 hover:to-blue-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </form>

          {/* Footer inside card */}
          <div className="mt-6 border-t border-white/10 pt-6 text-center">
            <p className="text-sm text-green-100">
              Secure access for authorized employees only
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-xs text-green-100">
          © 2026 UrbanStayr. All rights reserved.
        </p>
      </div>
    </div>
  );
}