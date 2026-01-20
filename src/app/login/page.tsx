"use client";

import Image from "next/image";
import image1 from "../../../public/ChatGPT_Image_Oct_17__2025__01_22_02_PM-removebg-preview.png";
import Link from "next/link";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { LoginActions } from "@/components/actions/LoginAction";
import { useAuthStore } from "@/store/AuthStore";


// ------------------
// ZOD VALIDATION SCHEMA
// ------------------
const loginSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});
type LoginFormData = z.infer<typeof loginSchema>

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
const router = useRouter()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });
const onSubmit = async (data: LoginFormData) => {
  const userdata = {
    email: data.email,
    password: data.password,
  };

  try {
    const createUser = await LoginActions(userdata);

    if (createUser?.status === "success") {
      toast("Login Successful!", {
        description: "Welcome back!",
        style: { background: "#22c55e", color: "white" },
      });

      router.push("/");
      return;
    }

    // Handle API-side error
    if (createUser?.error) {
      toast("Login Failed", {
        description: createUser.error,
        style: { backgroundColor: "#ef4444", color: "white" },
      });
    }
  } catch (error: any) {
    toast("Login failed", {
      description: error?.message || "An unexpected error occurred. Please try again.",
      style: { backgroundColor: "#ef4444", color: "white" },
    });
  }
};


  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white">
      {/* Logo and Branding */}
      <div className="flex flex-col items-center mb-8">
        <div className="bg-emerald-500 rounded-full p-4 mb-3">
          <Image src={image1} alt="InvestSphere Logo" className="w-10 h-10" />
        </div>
        <h1 className="text-3xl font-bold">InvestSphere</h1>
        <p className="text-gray-400 text-sm">Smart Investing Simplified</p>
      </div>

      {/* Login Card */}
      <div className="bg-[#0f1623] p-8 rounded-xl shadow-2xl w-[90%] sm:w-[400px]">
        <h2 className="text-2xl font-semibold mb-2">Welcome Back</h2>
        <p className="text-gray-400 text-sm mb-6">
          Log in to your account to continue
        </p>

        {/* FORM */}
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Email Input */}
          <input
            type="email"
            placeholder="Email"
            {...register("email")}
            className="w-full bg-[#1b2433] text-gray-300 p-3 mb-1 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          {errors.email && (
            <p className="text-red-400 text-sm mb-2">
              {errors.email.message}
            </p>
          )}

          {/* Password Input */}
          <div className="relative mb-1">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              {...register("password")}
              className="w-full bg-[#1b2433] text-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />

            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-gray-400 cursor-pointer select-none"
            >
              {showPassword ? "🙈" : "👁️"}
            </span>
          </div>

          {errors.password && (
            <p className="text-red-400 text-sm mb-3">
              {errors.password.message}
            </p>
          )}

          {/* Forgot Password */}
          <div className="flex justify-end mb-6">
            <a
              href="/forgot-password"
              className="text-emerald-500 text-sm hover:underline"
            >
              Forgot password?
            </a>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-black font-semibold py-3 rounded-md transition duration-200 disabled:opacity-50"
          >
            {isSubmitting ? "Logging in..." : "Log In"}
          </button>
        </form>

        {/* Sign Up Link */}
        <p className="text-sm text-center text-gray-400 mt-4">
          Don’t have an account?{" "}
          <Link href="/signup" className="text-emerald-500 hover:underline">
            Create an Account
          </Link>
        </p>
      </div>

      {/* Footer */}
      <p className="text-gray-600 text-xs mt-10">
        © 2025 BEATUS VTU. All rights reserved.
      </p>
    </div>
  );
}
