"use server";

import { createClient } from "@/utils/superbase/server";
import { headers } from "next/headers";

interface Props {
  password: string;
  email: string;
}

export const LoginActions = async ({ email, password }: Props) => {
  const supabase = await createClient();

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    // If login fails
    if (error) {
      console.log("Login error:", error.message);

      return {
        status: "error",
        error: error.message, // return actual reason
      };
    }

    // If login succeeds
    return {
      status: "success",
      data:data?.user,
      msg: "Login successful, welcome back!",
    };
  } catch (err: any) {
    // Catch any unexpected server-side issue
    return {
      status: "error",
      error: err?.message || "Unexpected server error",
    };
  }
};
