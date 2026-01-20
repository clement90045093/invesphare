import { NextRequest, NextResponse } from "next/server";




export async function POST(req:NextRequest){

  try{
      const body  =  await req.json()

    console.log(body)

    return NextResponse.json({message:"successsfull"})
  }catch(err){
        console.log(err)
  }

}