"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Copy, Check } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function PolicyPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("terms")
  const [hiddenCodeRevealed, setHiddenCodeRevealed] = useState(false)
  const [copied, setCopied] = useState(false)
  const [keySequence, setKeySequence] = useState<string[]>([])

  const hiddenCode = "FINTECH2024SECRET"

  // Konami code detection: up, up, down, down, left, right, left, right, b, a
  const konamiCode = [
    "ArrowUp",
    "ArrowUp",
    "ArrowDown",
    "ArrowDown",
    "ArrowLeft",
    "ArrowRight",
    "ArrowLeft",
    "ArrowRight",
    "b",
    "a",
  ]

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const newSequence = [...keySequence, e.key.toLowerCase()]

      // Keep only the last 10 keys
      if (newSequence.length > 10) {
        newSequence.shift()
      }

      setKeySequence(newSequence)

      // Check if the last 10 keys match the Konami code
      if (newSequence.length === 10) {
        const lastTen = newSequence.slice(-10)
        const konamiMatch = konamiCode.every((key, index) => lastTen[index] === key.toLowerCase())

        if (konamiMatch) {
          setHiddenCodeRevealed(true)
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [keySequence])

  const handleCopyCode = () => {
    navigator.clipboard.writeText(hiddenCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-800/50 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/dashboard")}
            className="text-slate-400 hover:text-white"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-bold text-white">Policies & Terms</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {hiddenCodeRevealed && (
          <Alert className="mb-6 bg-purple-500/10 border-purple-500/20">
            <AlertDescription className="text-purple-400">
              You found the hidden code! Copy it below to unlock special features.
            </AlertDescription>
          </Alert>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-slate-800/50 border border-slate-700">
            <TabsTrigger value="terms" className="text-slate-300 data-[state=active]:text-white">
              Terms of Service
            </TabsTrigger>
            <TabsTrigger value="privacy" className="text-slate-300 data-[state=active]:text-white">
              Privacy Policy
            </TabsTrigger>
            <TabsTrigger value="security" className="text-slate-300 data-[state=active]:text-white">
              Security
            </TabsTrigger>
          </TabsList>

          {/* Terms of Service Tab */}
          <TabsContent value="terms" className="space-y-6 mt-6">
            <Card className="border-slate-700 bg-slate-800/50 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-white">Terms of Service</CardTitle>
                <CardDescription className="text-slate-400">Last updated: October 2024</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 text-slate-300">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">1. Acceptance of Terms</h3>
                  <p className="leading-relaxed">
                    By accessing and using FinanceHub, you accept and agree to be bound by the terms and provision of
                    this agreement. If you do not agree to abide by the above, please do not use this service.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">2. Use License</h3>
                  <p className="leading-relaxed">
                    Permission is granted to temporarily download one copy of the materials (information or software) on
                    FinanceHub for personal, non-commercial transitory viewing only. This is the grant of a license, not
                    a transfer of title, and under this license you may not:
                  </p>
                  <ul className="list-disc list-inside mt-3 space-y-2">
                    <li>Modify or copy the materials</li>
                    <li>Use the materials for any commercial purpose or for any public display</li>
                    <li>Attempt to decompile or reverse engineer any software contained on FinanceHub</li>
                    <li>Remove any copyright or other proprietary notations from the materials</li>
                    <li>Transfer the materials to another person or "mirror" the materials on any other server</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">3. Disclaimer</h3>
                  <p className="leading-relaxed">
                    The materials on FinanceHub are provided on an 'as is' basis. FinanceHub makes no warranties,
                    expressed or implied, and hereby disclaims and negates all other warranties including, without
                    limitation, implied warranties or conditions of merchantability, fitness for a particular purpose,
                    or non-infringement of intellectual property or other violation of rights.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">4. Limitations</h3>
                  <p className="leading-relaxed">
                    In no event shall FinanceHub or its suppliers be liable for any damages (including, without
                    limitation, damages for loss of data or profit, or due to business interruption) arising out of the
                    use or inability to use the materials on FinanceHub.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">5. Accuracy of Materials</h3>
                  <p className="leading-relaxed">
                    The materials appearing on FinanceHub could include technical, typographical, or photographic
                    errors. FinanceHub does not warrant that any of the materials on FinanceHub are accurate, complete,
                    or current. FinanceHub may make changes to the materials contained on FinanceHub at any time without
                    notice.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Privacy Policy Tab */}
          <TabsContent value="privacy" className="space-y-6 mt-6">
            <Card className="border-slate-700 bg-slate-800/50 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-white">Privacy Policy</CardTitle>
                <CardDescription className="text-slate-400">Last updated: October 2024</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 text-slate-300">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">1. Information We Collect</h3>
                  <p className="leading-relaxed">
                    We collect information you provide directly to us, such as when you create an account, make a
                    transaction, or contact us for support. This includes your name, email address, phone number,
                    financial information, and any other information you choose to provide.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">2. How We Use Your Information</h3>
                  <p className="leading-relaxed">
                    We use the information we collect to provide, maintain, and improve our services, process
                    transactions, send transactional and promotional communications, and comply with legal obligations.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">3. Data Security</h3>
                  <p className="leading-relaxed">
                    We implement appropriate technical and organizational measures to protect your personal information
                    against unauthorized access, alteration, disclosure, or destruction. However, no method of
                    transmission over the Internet or electronic storage is completely secure.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">4. Sharing of Information</h3>
                  <p className="leading-relaxed">
                    We do not sell, trade, or rent your personal information to third parties. We may share information
                    with service providers who assist us in operating our website and conducting our business, subject
                    to confidentiality agreements.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">5. Your Rights</h3>
                  <p className="leading-relaxed">
                    You have the right to access, correct, or delete your personal information. You can also opt-out of
                    receiving promotional communications from us at any time.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-6 mt-6">
            <Card className="border-slate-700 bg-slate-800/50 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-white">Security Measures</CardTitle>
                <CardDescription className="text-slate-400">How we protect your account</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 text-slate-300">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">1. Encryption</h3>
                  <p className="leading-relaxed">
                    All data transmitted between your device and our servers is encrypted using industry-standard
                    SSL/TLS protocols. Your sensitive information is protected with end-to-end encryption.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">2. Two-Factor Authentication</h3>
                  <p className="leading-relaxed">
                    We offer two-factor authentication to add an extra layer of security to your account. You can enable
                    this feature in your security settings to require a verification code in addition to your password.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">3. Regular Security Audits</h3>
                  <p className="leading-relaxed">
                    We conduct regular security audits and penetration testing to identify and address potential
                    vulnerabilities. Our security team continuously monitors for suspicious activity.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">4. Fraud Detection</h3>
                  <p className="leading-relaxed">
                    We use advanced fraud detection systems to monitor transactions and identify suspicious activity. If
                    we detect unusual behavior, we will contact you immediately.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">5. Compliance</h3>
                  <p className="leading-relaxed">
                    FinanceHub complies with all applicable financial regulations and data protection laws, including
                    GDPR, PCI DSS, and local banking regulations.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Hidden Code Section */}
        {hiddenCodeRevealed && (
          <Card className="border-purple-500/30 bg-purple-500/10 backdrop-blur mt-8">
            <CardHeader>
              <CardTitle className="text-purple-300">Secret Code Unlocked</CardTitle>
              <CardDescription className="text-purple-400/70">You discovered the hidden code!</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 p-4 rounded-lg bg-slate-800/50 border border-purple-500/20">
                <code className="flex-1 text-purple-300 font-mono text-lg">{hiddenCode}</code>
                <Button onClick={handleCopyCode} size="sm" className="bg-purple-600 hover:bg-purple-700 text-white">
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
              <p className="text-slate-400 text-sm mt-4">
                This code grants you access to exclusive features and benefits. Keep it safe!
              </p>
            </CardContent>
          </Card>
        )}

        {/* Hint for hidden code */}
        {!hiddenCodeRevealed && (
          <div className="mt-8 p-4 rounded-lg bg-slate-800/30 border border-slate-700">
            <p className="text-slate-400 text-sm">
              Hint: Try using your keyboard to discover a hidden code. Look for patterns in classic gaming culture...
            </p>
          </div>
        )}
      </main>
    </div>
  )
}
