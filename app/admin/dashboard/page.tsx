"use client"
import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Users, Home, ShieldCheck, UserPlus, Loader2 } from "lucide-react";

export default function Dashboard() {
    const [admindata, setadmindata] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    async function getadmindata() {
        try {
            const response = await axios.get("/api/auth/admin/admindetails");
            setadmindata(response.data.user);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }
    
    useEffect(() => {
        getadmindata();
    }, []);

    if (loading) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-gray-50">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
        );
    }

    if (!admindata) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-gray-50">
                <p className="text-xl font-medium text-gray-600">Failed to load admin data</p>
            </div>
        );
    }

    const access = admindata.access || {};

    return (
        <div className="min-h-screen bg-gray-50 p-8 text-gray-900">
            <div className="mx-auto max-w-6xl">
                <header className="mb-10 flex flex-col gap-2 border-b border-gray-200 pb-6 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Admin Dashboard</h1>
                        <p className="mt-1 text-gray-500">Welcome back, {admindata.name || "Admin"}</p>
                    </div>
                </header>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    
                    {/* Create Employ Card */}
                    {access.Employaccess && (
                        <div 
                            onClick={() => router.push('/admin/createemploy')}
                            className="group cursor-pointer rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-blue-500 hover:shadow-md"
                        >
                            <div className="mb-4 inline-flex rounded-xl bg-blue-100 p-3 text-blue-600 transition-colors group-hover:bg-blue-600 group-hover:text-white">
                                <UserPlus size={24} />
                            </div>
                            <h3 className="mb-2 text-xl font-semibold text-gray-900">Manage Employees</h3>
                            <p className="text-sm text-gray-500">Add or manage employee accounts and permissions.</p>
                        </div>
                    )}

                    {/* Property Verification Card */}
                    {access.propertyVerification && (
                        <div 
                            onClick={() => router.push('/admin/dashboard/propertyverification')}
                            className="group cursor-pointer rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-emerald-500 hover:shadow-md"
                        >
                            <div className="mb-4 inline-flex rounded-xl bg-emerald-100 p-3 text-emerald-600 transition-colors group-hover:bg-emerald-600 group-hover:text-white">
                                <Home size={24} />
                            </div>
                            <h3 className="mb-2 text-xl font-semibold text-gray-900">Verify Properties</h3>
                            <p className="text-sm text-gray-500">Review and approve new property listings.</p>
                        </div>
                    )}

                    {/* Account Verification Card */}
                    {access.accountVerification && (
                        <div 
                            onClick={() => router.push('/admin/accountverification')}
                            className="group cursor-pointer rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-purple-500 hover:shadow-md"
                        >
                            <div className="mb-4 inline-flex rounded-xl bg-purple-100 p-3 text-purple-600 transition-colors group-hover:bg-purple-600 group-hover:text-white">
                                <ShieldCheck size={24} />
                            </div>
                            <h3 className="mb-2 text-xl font-semibold text-gray-900">Account Verification</h3>
                            <p className="text-sm text-gray-500">Verify user identity and host applications.</p>
                        </div>
                    )}
                </div>

                {/* If no access */}
                {!access.Employaccess && !access.propertyVerification && !access.accountVerification && (
                    <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-10 text-center shadow-sm">
                        <Users className="mx-auto mb-4 h-12 w-12 text-gray-300" />
                        <h3 className="mb-1 text-lg font-medium text-gray-900">No Quick Actions Available</h3>
                        <p className="text-gray-500">You do not have any specific administrative permissions assigned to your account.</p>
                    </div>
                )}
            </div>
        </div>
    );
}