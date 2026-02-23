import { createClient } from "../../../utils/superbase/server";
import { NextRequest, NextResponse } from "next/server";
import { type EmailOtpType } from '@supabase/supabase-js'



export async function GET(request:NextRequest){
    const  requestUrl =  new  URL(request.url)
    const  token_hash  =  requestUrl?.searchParams.get("token_hash")
    const origin = process.env.NGROK_URL || requestUrl.origin;
    const  type =  requestUrl?.searchParams.get("type") as EmailOtpType | null



    if(token_hash && type){
    const  supabase =  await  createClient()
   
    const {error} = await supabase.auth.verifyOtp({
        token_hash,
        type
    })

    if(!error){
        return NextResponse.redirect(`${origin}/`)
    }

   }


   return  NextResponse.redirect(`${origin}/error?error="missing token on the verify url"`)

}