"use server"
import { createClient } from "@/utils/superbase/server"



export const  Logout  = async ( ) =>{
    const supabase  =  await createClient()
    const {error} =  await  supabase.auth.signOut()

    if(error){
        return {msg:"error trying to logout"}
    }

    return {msg:"Logout successful"}
}