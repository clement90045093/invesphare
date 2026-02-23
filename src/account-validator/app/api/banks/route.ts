import { NextResponse } from "next/server"

export async function GET() {
  try {
    const response = await fetch("https://api.paystack.co/bank", {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error("Failed to fetch banks")
    }

    const data = await response.json()

    return NextResponse.json({
      success: true,
      banks: data.data,
    })
  } catch (error) {
    console.error("Error fetching banks:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch banks" }, { status: 500 })
  }
}
