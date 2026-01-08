"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, CheckCircle2, Upload, FileText, Camera } from "lucide-react"

export default function KYCUploadPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [idDocument, setIdDocument] = useState<File | null>(null)
  const [selfie, setSelfie] = useState<File | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: "id" | "selfie") => {
    const file = e.target.files?.[0]
    if (file) {
      if (type === "id") {
        setIdDocument(file)
      } else {
        setSelfie(file)
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setLoading(true)

    try {
      if (!idDocument || !selfie) {
        throw new Error("Please upload both ID document and selfie")
      }

      // In a real app, upload to secure storage and verify
      await new Promise((resolve) => setTimeout(resolve, 2000))

      setSuccess("KYC documents submitted successfully! Redirecting to dashboard...")
      setTimeout(() => router.push("/dashboard"), 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-blue-600 mb-4">
            <FileText className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Complete KYC Verification</h1>
          <p className="text-slate-400">Upload your ID and selfie to verify your identity</p>
        </div>

        <Card className="border-slate-700 bg-slate-800/50 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-white">Know Your Customer (KYC)</CardTitle>
            <CardDescription className="text-slate-400">
              We need to verify your identity to comply with banking regulations
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

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* ID Document Upload */}
              <div className="space-y-2">
                <Label className="text-slate-300">Government-Issued ID</Label>
                <div className="border-2 border-dashed border-slate-600 rounded-lg p-6 hover:border-blue-500 transition-colors">
                  <input
                    type="file"
                    id="id-upload"
                    accept="image/*,application/pdf"
                    onChange={(e) => handleFileChange(e, "id")}
                    className="hidden"
                  />
                  <label
                    htmlFor="id-upload"
                    className="flex flex-col items-center cursor-pointer text-slate-400 hover:text-white"
                  >
                    <Upload className="w-8 h-8 mb-2" />
                    <span className="text-sm">{idDocument ? idDocument.name : "Click to upload ID document"}</span>
                    <span className="text-xs mt-1">Passport, Driver's License, or National ID</span>
                  </label>
                </div>
              </div>

              {/* Selfie Upload */}
              <div className="space-y-2">
                <Label className="text-slate-300">Selfie Verification</Label>
                <div className="border-2 border-dashed border-slate-600 rounded-lg p-6 hover:border-blue-500 transition-colors">
                  <input
                    type="file"
                    id="selfie-upload"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, "selfie")}
                    className="hidden"
                  />
                  <label
                    htmlFor="selfie-upload"
                    className="flex flex-col items-center cursor-pointer text-slate-400 hover:text-white"
                  >
                    <Camera className="w-8 h-8 mb-2" />
                    <span className="text-sm">{selfie ? selfie.name : "Click to upload selfie"}</span>
                    <span className="text-xs mt-1">Hold your ID next to your face</span>
                  </label>
                </div>
              </div>

              {/* Requirements */}
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                <h3 className="text-white font-semibold mb-2">Requirements:</h3>
                <ul className="text-sm text-slate-400 space-y-1">
                  <li>• Clear, high-quality images</li>
                  <li>• All text on ID must be readable</li>
                  <li>• Your face must be clearly visible</li>
                  <li>• No filters or editing</li>
                </ul>
              </div>

              <Button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700">
                {loading ? "Uploading..." : "Submit KYC Documents"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
