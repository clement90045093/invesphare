
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { zodResolver } from '@hookform/resolvers/zod';
import { SignUpActions } from "./actions/signupActions";
import { toast } from "sonner";

// =========================
//  ZOD VALIDATION SCHEMA
// =========================
const SignupSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username too long"),
  email: z.string().email("Enter a valid email address"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(32, "Password too long"),
});

type SignupSchemaType = z.infer<typeof SignupSchema>;

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);

  const {register,handleSubmit,formState: { errors, isSubmitting }, reset} = useForm<SignupSchemaType>({
    resolver: zodResolver(SignupSchema),
  });

  const onSubmit = async (data: SignupSchemaType) => {
    console.log("Form Data:", data);
    let  userdata  =  {
      username:  data?.username,
      password: data?.password, 
      email:data?.email
    }
    try{
      const  creatUser  =  await  SignUpActions(userdata)
      if(creatUser?.message === "ok"){

        toast("Account  created",  {
          description:"Your  account  has  been  successfully created",
          style:{background:"green",  color:"white"}
        })

      }

    }catch(error:any){
      if(error){
        console.log(error)

        toast("Failed",  {
          description:"Error trying  to  create an  account plesase  try again",
          style:{background:"red",  color:"white"}
        })
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white px-4">
      
      {/* ===== Logo & Title ===== */}
      <div className="flex flex-col items-center mb-10">
        <div className="bg-emerald-500 p-3 rounded-full mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 7l5 5m0 0l-5 5m5-5H6"
            />
          </svg>
        </div>
        <h1 className="text-2xl font-bold">InvestSphere</h1>
        <p className="text-gray-400 mt-1">Smart Investing Simplified</p>
      </div>

      {/* ===== Signup Card ===== */}
      <div className="bg-[#0B132B] w-full max-w-md rounded-lg shadow-lg p-8">
        <h2 className="text-xl font-semibold mb-2">Create Account</h2>
        <p className="text-gray-400 text-sm mb-6">
          Create your virtual top-up account
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Username */}
          <div>
            <input
              {...register("username")}
              type="text"
              placeholder="Username"
              className="w-full px-4 py-3 rounded-md bg-emerald-100/20 text-gray-100 placeholder-gray-400 border border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
            {errors.username && (
              <p className="text-red-400 text-sm mt-1">{errors.username.message}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <input
              {...register("email")}
              type="email"
              placeholder="Email"
              className="w-full px-4 py-3 rounded-md bg-[#1A2238] text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
            {errors.email && (
              <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div className="relative">
            <input
              {...register("password")}
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full px-4 py-3 rounded-md bg-[#1A2238] text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-3 flex items-center text-gray-400"
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </button>

            {errors.password && (
              <p className="text-red-400 text-sm mt-1">{errors.password.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-black font-semibold py-3 rounded-md transition disabled:bg-emerald-700/50"
          >
            {isSubmitting ? "Creating..." : "Create Account"}
          </button>
        </form>

        {/* Login Link */}
        <p className="text-gray-400 text-sm text-center mt-6">
          Already have an account?{" "}
          <a href="/login" className="text-emerald-400 hover:underline">
            Log In
          </a>
        </p>
      </div>

      {/* ===== Footer ===== */}
      <p className="text-gray-500 text-xs mt-10">
        © {new Date().getFullYear()} InvestSphere. All rights reserved.
      </p>
    </div>
  );
}





