// Paystack API utilities
export interface Bank {
  id: number
  name: string
  code: string
  longcode: string
  gateway: string
  pay_with_bank: boolean
  active: boolean
  country: string
  currency: string
  type: string
  is_deleted: boolean
  createdAt: string
  updatedAt: string
}

export interface AccountVerificationResponse {
  status: boolean
  message: string
  data: {
    account_number: string
    account_name: string
    bank_id: number
  }
}

export async function getBanks(): Promise<Bank[]> {
  try {
    const response = await fetch("/api/banks")
    const data = await response.json()
    return data.banks || []
  } catch (error) {
    console.error("Error fetching banks:", error)
    return []
  }
}

export async function verifyAccountNumber(
  accountNumber: string,
  bankCode: string,
): Promise<AccountVerificationResponse> {
  try {
    const response = await fetch("/api/verify-account", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        account_number: accountNumber,
        bank_code: bankCode,
      }),
    })

    return await response.json()
  } catch (error) {
    console.error("Error verifying account:", error)
    return {
      status: false,
      message: "Failed to verify account",
      data: {
        account_number: "",
        account_name: "",
        bank_id: 0,
      },
    }
  }
}
