"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, XCircle, Loader2, CreditCard, Building, User } from "lucide-react"
import { getBanks, verifyAccountNumber, type Bank, type AccountVerificationResponse } from "@/lib/paystack"

interface BankDetails {
  accountNumber: string
  bankCode: string
  accountName: string
}

interface ValidationState {
  isValidating: boolean
  isValid: boolean | null
  message: string
  verifiedName: string
}

export default function BankDetailsValidator() {
  const [banks, setBanks] = useState<Bank[]>([])
  const [bankDetails, setBankDetails] = useState<BankDetails>({
    accountNumber: "",
    bankCode: "",
    accountName: "",
  })
  const [validation, setValidation] = useState<ValidationState>({
    isValidating: false,
    isValid: null,
    message: "",
    verifiedName: "",
  })
  const [loadingBanks, setLoadingBanks] = useState(true)

  // Load banks on component mount
  useEffect(() => {
    const loadBanks = async () => {
      setLoadingBanks(true)
      try {
        const bankList = await getBanks()
        setBanks(bankList.filter((bank) => bank.active && bank.country === "Nigeria"))
      } catch (error) {
        console.error("Failed to load banks:", error)
      } finally {
        setLoadingBanks(false)
      }
    }

    loadBanks()
  }, [])

  // Validate account number format
  const isValidAccountNumber = (accountNumber: string): boolean => {
    return /^\d{10}$/.test(accountNumber)
  }

  // Handle account verification
  const handleVerifyAccount = async () => {
    if (!bankDetails.accountNumber || !bankDetails.bankCode) {
      setValidation({
        isValidating: false,
        isValid: false,
        message: "Please provide both account number and bank",
        verifiedName: "",
      })
      return
    }

    if (!isValidAccountNumber(bankDetails.accountNumber)) {
      setValidation({
        isValidating: false,
        isValid: false,
        message: "Account number must be exactly 10 digits",
        verifiedName: "",
      })
      return
    }

    setValidation((prev) => ({ ...prev, isValidating: true, message: "Verifying account..." }))

    try {
      const result: AccountVerificationResponse = await verifyAccountNumber(
        bankDetails.accountNumber,
        bankDetails.bankCode,
      )

      if (result.status && result.data.account_name) {
        setValidation({
          isValidating: false,
          isValid: true,
          message: "Account verified successfully",
          verifiedName: result.data.account_name,
        })
        setBankDetails((prev) => ({ ...prev, accountName: result.data.account_name }))
      } else {
        setValidation({
          isValidating: false,
          isValid: false,
          message: result.message || "Account verification failed",
          verifiedName: "",
        })
      }
    } catch (error) {
      setValidation({
        isValidating: false,
        isValid: false,
        message: "Failed to verify account. Please try again.",
        verifiedName: "",
      })
    }
  }

  // Auto-verify when account number and bank are provided
  useEffect(() => {
    if (bankDetails.accountNumber.length === 10 && bankDetails.bankCode) {
      const timeoutId = setTimeout(() => {
        handleVerifyAccount()
      }, 500)

      return () => clearTimeout(timeoutId)
    } else {
      setValidation({
        isValidating: false,
        isValid: null,
        message: "",
        verifiedName: "",
      })
    }
  }, [bankDetails.accountNumber, bankDetails.bankCode])

  const selectedBank = banks.find((bank) => bank.code === bankDetails.bankCode)

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="mx-auto max-w-2xl space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl font-bold">
              <CreditCard className="h-6 w-6" />
              Bank Details Validator
            </CardTitle>
            <CardDescription>
              Verify Nigerian bank account details using Paystack's verification service
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Bank Selection */}
            <div className="space-y-2">
              <Label htmlFor="bank">Select Bank</Label>
              <Select
                value={bankDetails.bankCode}
                onValueChange={(value) => setBankDetails((prev) => ({ ...prev, bankCode: value, accountName: "" }))}
                disabled={loadingBanks}
              >
                <SelectTrigger>
                  <SelectValue placeholder={loadingBanks ? "Loading banks..." : "Choose a bank"} />
                </SelectTrigger>
                <SelectContent>
                  {banks.map((bank) => (
                    <SelectItem key={bank.code} value={bank.code}>
                      <div className="flex items-center gap-2">
                        <Building className="h-4 w-4" />
                        {bank.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Account Number */}
            <div className="space-y-2">
              <Label htmlFor="accountNumber">Account Number</Label>
              <div className="relative">
                <Input
                  id="accountNumber"
                  value={bankDetails.accountNumber}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "").slice(0, 10)
                    setBankDetails((prev) => ({ ...prev, accountNumber: value, accountName: "" }))
                  }}
                  placeholder="Enter 10-digit account number"
                  maxLength={10}
                  className={
                    validation.isValid === true
                      ? "border-green-500"
                      : validation.isValid === false
                        ? "border-red-500"
                        : ""
                  }
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  {validation.isValidating && <Loader2 className="h-4 w-4 animate-spin text-blue-500" />}
                  {validation.isValid === true && <CheckCircle className="h-4 w-4 text-green-500" />}
                  {validation.isValid === false && <XCircle className="h-4 w-4 text-red-500" />}
                </div>
              </div>
              <div className="text-sm text-gray-500">{bankDetails.accountNumber.length}/10 digits</div>
            </div>

            {/* Verification Status */}
            {validation.message && (
              <Alert className={validation.isValid ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
                <AlertDescription className={validation.isValid ? "text-green-800" : "text-red-800"}>
                  {validation.message}
                </AlertDescription>
              </Alert>
            )}

            {/* Verified Account Name */}
            {validation.verifiedName && (
              <div className="space-y-2">
                <Label>Verified Account Name</Label>
                <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-md">
                  <User className="h-4 w-4 text-green-600" />
                  <span className="font-medium text-green-800">{validation.verifiedName}</span>
                  <Badge variant="default" className="ml-auto">
                    Verified
                  </Badge>
                </div>
              </div>
            )}

            {/* Manual Verify Button */}
            <Button
              onClick={handleVerifyAccount}
              disabled={
                !bankDetails.accountNumber ||
                !bankDetails.bankCode ||
                !isValidAccountNumber(bankDetails.accountNumber) ||
                validation.isValidating
              }
              className="w-full"
            >
              {validation.isValidating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying Account...
                </>
              ) : (
                "Verify Account Details"
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Validation Summary */}
        {(selectedBank || validation.verifiedName) && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Validation Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedBank && (
                <div className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <Building className="h-5 w-5 text-blue-500" />
                    <div>
                      <p className="font-medium">{selectedBank.name}</p>
                      <p className="text-sm text-gray-500">Code: {selectedBank.code}</p>
                    </div>
                  </div>
                  <Badge variant="outline">Selected</Badge>
                </div>
              )}

              {bankDetails.accountNumber && (
                <div className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <CreditCard className="h-5 w-5 text-blue-500" />
                    <div>
                      <p className="font-medium">{bankDetails.accountNumber}</p>
                      <p className="text-sm text-gray-500">Account Number</p>
                    </div>
                  </div>
                  <Badge variant={isValidAccountNumber(bankDetails.accountNumber) ? "default" : "destructive"}>
                    {isValidAccountNumber(bankDetails.accountNumber) ? "Valid Format" : "Invalid Format"}
                  </Badge>
                </div>
              )}

              {validation.verifiedName && (
                <div className="flex items-center justify-between p-3 rounded-lg border border-green-200 bg-green-50">
                  <div className="flex items-center gap-3">
                    <User className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-medium text-green-800">{validation.verifiedName}</p>
                      <p className="text-sm text-green-600">Account Holder</p>
                    </div>
                  </div>
                  <Badge variant="default">Verified</Badge>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Information Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">How It Works</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-gray-600">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-blue-600 font-medium text-xs">1</span>
              </div>
              <p>Select your bank from the dropdown list of Nigerian banks</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-blue-600 font-medium text-xs">2</span>
              </div>
              <p>Enter your 10-digit account number</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-blue-600 font-medium text-xs">3</span>
              </div>
              <p>The system automatically verifies your account details using Paystack's secure API</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-blue-600 font-medium text-xs">4</span>
              </div>
              <p>Get instant confirmation with the verified account holder name</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
