"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, XCircle, AlertCircle, Eye, EyeOff } from "lucide-react"

interface ValidationResult {
  isValid: boolean
  message: string
  severity: "success" | "error" | "warning"
}

interface AccountDetails {
  username: string
  email: string
  password: string
  confirmPassword: string
  phoneNumber: string
  age: string
}

export default function Component() {
  const [accountDetails, setAccountDetails] = useState<AccountDetails>({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
    age: "",
  })

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [validationResults, setValidationResults] = useState<Record<string, ValidationResult>>({})

  // Validation functions
  const validateUsername = (username: string): ValidationResult => {
    if (username.length === 0) {
      return { isValid: false, message: "Username is required", severity: "error" }
    }
    if (username.length < 3) {
      return { isValid: false, message: "Username must be at least 3 characters", severity: "error" }
    }
    if (username.length > 20) {
      return { isValid: false, message: "Username must be less than 20 characters", severity: "error" }
    }
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      return {
        isValid: false,
        message: "Username can only contain letters, numbers, and underscores",
        severity: "error",
      }
    }
    // Simulate checking if username is taken
    const takenUsernames = ["admin", "user", "test", "demo"]
    if (takenUsernames.includes(username.toLowerCase())) {
      return { isValid: false, message: "Username is already taken", severity: "error" }
    }
    return { isValid: true, message: "Username is available", severity: "success" }
  }

  const validateEmail = (email: string): ValidationResult => {
    if (email.length === 0) {
      return { isValid: false, message: "Email is required", severity: "error" }
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return { isValid: false, message: "Please enter a valid email address", severity: "error" }
    }
    // Check for common disposable email domains
    const disposableDomains = ["tempmail.com", "10minutemail.com", "guerrillamail.com"]
    const domain = email.split("@")[1]
    if (disposableDomains.includes(domain)) {
      return { isValid: false, message: "Disposable email addresses are not allowed", severity: "warning" }
    }
    return { isValid: true, message: "Email format is valid", severity: "success" }
  }

  const validatePassword = (password: string): ValidationResult => {
    if (password.length === 0) {
      return { isValid: false, message: "Password is required", severity: "error" }
    }
    if (password.length < 8) {
      return { isValid: false, message: "Password must be at least 8 characters", severity: "error" }
    }

    const hasUppercase = /[A-Z]/.test(password)
    const hasLowercase = /[a-z]/.test(password)
    const hasNumbers = /\d/.test(password)
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password)

    const criteriaMet = [hasUppercase, hasLowercase, hasNumbers, hasSpecialChar].filter(Boolean).length

    if (criteriaMet < 3) {
      return {
        isValid: false,
        message: "Password must contain at least 3 of: uppercase, lowercase, numbers, special characters",
        severity: "error",
      }
    }

    if (criteriaMet === 3) {
      return { isValid: true, message: "Password strength: Good", severity: "warning" }
    }

    return { isValid: true, message: "Password strength: Strong", severity: "success" }
  }

  const validateConfirmPassword = (confirmPassword: string, password: string): ValidationResult => {
    if (confirmPassword.length === 0) {
      return { isValid: false, message: "Please confirm your password", severity: "error" }
    }
    if (confirmPassword !== password) {
      return { isValid: false, message: "Passwords do not match", severity: "error" }
    }
    return { isValid: true, message: "Passwords match", severity: "success" }
  }

  const validatePhoneNumber = (phoneNumber: string): ValidationResult => {
    if (phoneNumber.length === 0) {
      return { isValid: false, message: "Phone number is required", severity: "error" }
    }
    const phoneRegex = /^\+?[\d\s\-$$$$]{10,}$/
    if (!phoneRegex.test(phoneNumber)) {
      return { isValid: false, message: "Please enter a valid phone number", severity: "error" }
    }
    return { isValid: true, message: "Phone number format is valid", severity: "success" }
  }

  const validateAge = (age: string): ValidationResult => {
    if (age.length === 0) {
      return { isValid: false, message: "Age is required", severity: "error" }
    }
    const ageNum = Number.parseInt(age)
    if (isNaN(ageNum) || ageNum < 1) {
      return { isValid: false, message: "Please enter a valid age", severity: "error" }
    }
    if (ageNum < 13) {
      return { isValid: false, message: "You must be at least 13 years old", severity: "error" }
    }
    if (ageNum > 120) {
      return { isValid: false, message: "Please enter a realistic age", severity: "error" }
    }
    return { isValid: true, message: "Age is valid", severity: "success" }
  }

  // Calculate password strength percentage
  const getPasswordStrength = (password: string): number => {
    if (password.length === 0) return 0

    let strength = 0
    if (password.length >= 8) strength += 25
    if (/[A-Z]/.test(password)) strength += 25
    if (/[a-z]/.test(password)) strength += 25
    if (/\d/.test(password)) strength += 12.5
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength += 12.5

    return Math.min(strength, 100)
  }

  // Update validation results when account details change
  useEffect(() => {
    const results: Record<string, ValidationResult> = {
      username: validateUsername(accountDetails.username),
      email: validateEmail(accountDetails.email),
      password: validatePassword(accountDetails.password),
      confirmPassword: validateConfirmPassword(accountDetails.confirmPassword, accountDetails.password),
      phoneNumber: validatePhoneNumber(accountDetails.phoneNumber),
      age: validateAge(accountDetails.age),
    }
    setValidationResults(results)
  }, [accountDetails])

  const handleInputChange = (field: keyof AccountDetails, value: string) => {
    setAccountDetails((prev) => ({ ...prev, [field]: value }))
  }

  const getValidationIcon = (result: ValidationResult) => {
    if (result.severity === "success") return <CheckCircle className="h-4 w-4 text-green-500" />
    if (result.severity === "warning") return <AlertCircle className="h-4 w-4 text-yellow-500" />
    return <XCircle className="h-4 w-4 text-red-500" />
  }

  const getValidationColor = (result: ValidationResult) => {
    if (result.severity === "success") return "text-green-600"
    if (result.severity === "warning") return "text-yellow-600"
    return "text-red-600"
  }

  const allFieldsValid = Object.values(validationResults).every((result) => result.isValid)
  const validFieldsCount = Object.values(validationResults).filter((result) => result.isValid).length
  const totalFields = Object.keys(validationResults).length

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="mx-auto max-w-2xl space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Account Validation Checker</CardTitle>
            <CardDescription>Enter your account details below to validate them in real-time</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Overall Progress */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Validation Progress</Label>
                <Badge variant={allFieldsValid ? "default" : "secondary"}>
                  {validFieldsCount}/{totalFields} Valid
                </Badge>
              </div>
              <Progress value={(validFieldsCount / totalFields) * 100} className="h-2" />
            </div>

            {/* Username */}
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <div className="relative">
                <Input
                  id="username"
                  value={accountDetails.username}
                  onChange={(e) => handleInputChange("username", e.target.value)}
                  placeholder="Enter username"
                  className={validationResults.username?.isValid ? "border-green-500" : "border-red-500"}
                />
                {validationResults.username && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    {getValidationIcon(validationResults.username)}
                  </div>
                )}
              </div>
              {validationResults.username && (
                <p className={`text-sm ${getValidationColor(validationResults.username)}`}>
                  {validationResults.username.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Input
                  id="email"
                  type="email"
                  value={accountDetails.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="Enter email address"
                  className={validationResults.email?.isValid ? "border-green-500" : "border-red-500"}
                />
                {validationResults.email && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    {getValidationIcon(validationResults.email)}
                  </div>
                )}
              </div>
              {validationResults.email && (
                <p className={`text-sm ${getValidationColor(validationResults.email)}`}>
                  {validationResults.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={accountDetails.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  placeholder="Enter password"
                  className={validationResults.password?.isValid ? "border-green-500" : "border-red-500"}
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center space-x-2">
                  {validationResults.password && getValidationIcon(validationResults.password)}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              {accountDetails.password && (
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span>Password Strength</span>
                    <span>{Math.round(getPasswordStrength(accountDetails.password))}%</span>
                  </div>
                  <Progress value={getPasswordStrength(accountDetails.password)} className="h-1" />
                </div>
              )}
              {validationResults.password && (
                <p className={`text-sm ${getValidationColor(validationResults.password)}`}>
                  {validationResults.password.message}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={accountDetails.confirmPassword}
                  onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                  placeholder="Confirm password"
                  className={validationResults.confirmPassword?.isValid ? "border-green-500" : "border-red-500"}
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center space-x-2">
                  {validationResults.confirmPassword && getValidationIcon(validationResults.confirmPassword)}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              {validationResults.confirmPassword && (
                <p className={`text-sm ${getValidationColor(validationResults.confirmPassword)}`}>
                  {validationResults.confirmPassword.message}
                </p>
              )}
            </div>

            {/* Phone Number */}
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <div className="relative">
                <Input
                  id="phoneNumber"
                  value={accountDetails.phoneNumber}
                  onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                  placeholder="Enter phone number"
                  className={validationResults.phoneNumber?.isValid ? "border-green-500" : "border-red-500"}
                />
                {validationResults.phoneNumber && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    {getValidationIcon(validationResults.phoneNumber)}
                  </div>
                )}
              </div>
              {validationResults.phoneNumber && (
                <p className={`text-sm ${getValidationColor(validationResults.phoneNumber)}`}>
                  {validationResults.phoneNumber.message}
                </p>
              )}
            </div>

            {/* Age */}
            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <div className="relative">
                <Input
                  id="age"
                  type="number"
                  value={accountDetails.age}
                  onChange={(e) => handleInputChange("age", e.target.value)}
                  placeholder="Enter age"
                  className={validationResults.age?.isValid ? "border-green-500" : "border-red-500"}
                />
                {validationResults.age && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    {getValidationIcon(validationResults.age)}
                  </div>
                )}
              </div>
              {validationResults.age && (
                <p className={`text-sm ${getValidationColor(validationResults.age)}`}>
                  {validationResults.age.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <Button className="w-full" disabled={!allFieldsValid} variant={allFieldsValid ? "default" : "secondary"}>
              {allFieldsValid ? "Account Details Valid ✓" : "Complete Validation"}
            </Button>
          </CardContent>
        </Card>

        {/* Validation Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Validation Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              {Object.entries(validationResults).map(([field, result]) => (
                <div key={field} className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center space-x-3">
                    {getValidationIcon(result)}
                    <span className="font-medium capitalize">{field.replace(/([A-Z])/g, " $1").trim()}</span>
                  </div>
                  <Badge variant={result.isValid ? "default" : "destructive"}>
                    {result.isValid ? "Valid" : "Invalid"}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
