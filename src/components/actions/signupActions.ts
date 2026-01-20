"use server"
import { createClient } from "@/utils/superbase/server"
import { Wallet } from "ethers";  // <-- IMPORT ETHERS

interface Props {
    username: string,
    password: string,
    email: string
}

export const SignUpActions = async ({ email, password, username }: Props) => {
    const supabase = await createClient();

    try {
        const { data, error: signUpError } = await supabase.auth.signUp({
            email: email,
            password: password,
            options: {
                data: {
                    first_name: username,
                },
            },
        });

        if (signUpError) {
            console.log("❌ Sign-up error:", signUpError.message);
            return { error: "Error creating user account", reason: signUpError.message };
        }

        if (data?.user) {
            // ---------- CREATE WALLET ----------
            const wallet = Wallet.createRandom();

            // ---------- CONSOLE LOGS ----------
            console.log("🎉 NEW USER CREATED:", data.user);
            console.log("🔐 WALLET ADDRESS:", wallet.address);
            console.log("🗝️ PRIVATE KEY:", wallet.privateKey);
            console.log("📜 MNEMONIC:", wallet.mnemonic?.phrase);

            return {
                message: "ok",
                user: data.user,
                wallet: {
                    address: wallet.address,
                    privateKey: wallet.privateKey,
                    mnemonic: wallet.mnemonic?.phrase,
                },
            };
        }

        return { error: "Unknown error occurred" };

    } catch (err: any) {
        console.log("🔥 Unexpected error:", err);
        return { error: "Server error", reason: err?.message || "Unexpected error" };
    }
}
