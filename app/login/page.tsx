"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { findUserByEmail, setSession } from "@/lib/supabaseService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { HardDrive, Mail, Lock, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";

export default function LoginPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const user = await findUserByEmail(formData.email);

            if (!user) {
                toast.error("No account found with this email");
                setLoading(false);
                return;
            }

            if (user.password !== formData.password) {
                toast.error("Incorrect password");
                setLoading(false);
                return;
            }

            setSession(user.id, user.email, user.name);
            toast.success("Welcome back!");
            router.push("/drive");
        } catch (error: any) {
            toast.error("Failed to sign in. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
            <Toaster position="top-right" />

            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4">
                        <HardDrive className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">K-Drive</h1>
                    <p className="text-slate-600 dark:text-slate-400 mt-2">
                        Sign in to your account
                    </p>
                </div>

                {/* Login Form */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-800 p-8">
                    <form onSubmit={handleLogin} className="space-y-5">
                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <Input
                                    type="email"
                                    placeholder="you@example.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="pl-10"
                                    required
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <Input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="pl-10 pr-10"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? "Signing in..." : "Sign In"}
                        </Button>
                    </form>

                    {/* Signup Link */}
                    <p className="text-center text-sm text-slate-600 dark:text-slate-400 mt-6">
                        Don&apos;t have an account?{" "}
                        <Link href="/signup" className="text-blue-600 hover:text-blue-700 font-medium">
                            Create one
                        </Link>
                    </p>
                </div>

                {/* Info */}
                <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <p className="text-sm text-blue-900 dark:text-blue-100 font-medium mb-1">
                        ☁️ Cloud Powered!
                    </p>
                    <p className="text-xs text-blue-700 dark:text-blue-300">
                        Your files are securely stored in the cloud and accessible from anywhere.
                    </p>
                </div>
            </div>
        </div>
    );
}
