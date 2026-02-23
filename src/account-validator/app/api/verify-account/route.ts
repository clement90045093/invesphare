import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { account_number, bank_code } = await request.json()

    if (!account_number || !bank_code) {
      return NextResponse.json({ status: false, message: "Account number and bank code are required" }, { status: 400 })
    }

    const response = await fetch(
      `https://api.paystack.co/bank/resolve?account_number=${account_number}&bank_code=${bank_code}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      },
    )

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json({
        status: false,
        message: data.message || "Failed to verify account",
        data: {
          account_number: "",
          account_name: "",
          bank_id: 0,
        },
      })
    }

    return NextResponse.json({
      status: data.status,
      message: data.message,
      data: data.data,
    })
  } catch (error) {
    console.error("Error verifying account:", error)
    return NextResponse.json(
      {
        status: false,
        message: "Internal server error",
        data: {
          account_number: "",
          account_name: "",
          bank_id: 0,
        },
      },
      { status: 500 },
    )
  }
}
