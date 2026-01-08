"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, CheckCircle2, Shield } from "lucide-react"

export default function VerifyOTPPage() {
  const router = useRouter()
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [resendTimer, setResendTimer] = useState(60)

  useEffect(() => {
    const timer = setInterval(() => {
      setResendTimer((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return
    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`)
      nextInput?.focus()
    }
  }

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setLoading(true)

    try {
      const otpCode = otp.join("")
      if (otpCode.length !== 6) {
        throw new Error("Please enter complete OTP")
      }

      // In a real app, verify OTP with backend
      // For demo, accept "123456" as valid OTP
      if (otpCode === "123456") {
        setSuccess("OTP verified successfully!")
        setTimeout(() => router.push("/kyc-upload"), 1500)
      } else {
        throw new Error("Invalid OTP. Please try again.")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Verification failed")
    } finally {
      setLoading(false)
    }
  }

  const handleResend = () => {
    if (resendTimer === 0) {
      setResendTimer(60)
      // In a real app, trigger resend OTP
      setSuccess("OTP resent successfully!")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-blue-600 mb-4">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Verify Your Identity</h1>
          <p className="text-slate-400">Enter the 6-digit code sent to your phone</p>
        </div>

        <Card className="border-slate-700 bg-slate-800/50 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-white">OTP Verification</CardTitle>
            <CardDescription className="text-slate-400">
              For demo purposes, use code: <span className="font-mono font-bold">123456</span>
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert className="bg-red-500/10 border-red-500/20 mb-4">
                <AlertCircle className="h-4 w-4 text-red-500" />
                <AlertDescription className="text-red-500">{error}</AlertDescription>
              </Alert>
            )}
            {success && (
              <Alert className="bg-green-500/10 border-green-500/20 mb-4">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <AlertDescription className="text-green-500">{success}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleVerify} className="space-y-6">
              <div className="space-y-2">
                <Label className="text-slate-300">Enter OTP</Label>
                <div className="flex gap-2 justify-between">
                  {otp.map((digit, index) => (
                    <Input
                      key={index}
                      id={`otp-${index}`}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      className="w-12 h-12 text-center text-xl font-bold bg-slate-700/50 border-slate-600 text-white"
                    />
                  ))}
                </div>
              </div>

              <Button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700">
                {loading ? "Verifying..." : "Verify OTP"}
              </Button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={resendTimer > 0}
                  className="text-sm text-slate-400 hover:text-white disabled:opacity-50"
                >
                  {resendTimer > 0 ? `Resend OTP in ${resendTimer}s` : "Resend OTP"}
                </button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
