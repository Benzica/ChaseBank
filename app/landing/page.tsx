"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Zap, TrendingUp, Lock, ArrowRight, CheckCircle2 } from "lucide-react"

export default function LandingPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Navigation */}
      <nav className="border-b border-slate-700 bg-slate-800/50 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-blue-600">
              <span className="text-white font-bold">$</span>
            </div>
            <h1 className="text-2xl font-bold text-white">FinanceHub</h1>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => router.push("/")} className="text-slate-300 hover:text-white">
              Home
            </Button>
            <Button variant="ghost" onClick={() => router.push("/policy")} className="text-slate-300 hover:text-white">
              Policies
            </Button>
            <Button onClick={() => router.push("/")} className="bg-blue-600 hover:bg-blue-700 text-white">
              Login
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-5xl font-bold text-white mb-6 leading-tight">
              Banking Made <span className="text-blue-400">Simple & Secure</span>
            </h2>
            <p className="text-xl text-slate-400 mb-8">
              Manage your finances with confidence. Fast transfers, secure transactions, and complete control over your
              money.
            </p>
            <div className="flex gap-4">
              <Button
                onClick={() => router.push("/")}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg flex items-center gap-2"
              >
                Get Started <ArrowRight className="w-5 h-5" />
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push("/policy")}
                className="border-slate-600 text-slate-300 hover:bg-slate-700 bg-transparent px-8 py-6 text-lg"
              >
                Learn More
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Card className="border-slate-700 bg-slate-800/50 backdrop-blur">
              <CardContent className="pt-6">
                <TrendingUp className="w-8 h-8 text-green-400 mb-4" />
                <p className="text-white font-semibold">Smart Investments</p>
                <p className="text-slate-400 text-sm mt-2">Grow your wealth with intelligent recommendations</p>
              </CardContent>
            </Card>
            <Card className="border-slate-700 bg-slate-800/50 backdrop-blur">
              <CardContent className="pt-6">
                <Lock className="w-8 h-8 text-blue-400 mb-4" />
                <p className="text-white font-semibold">Bank-Level Security</p>
                <p className="text-slate-400 text-sm mt-2">Your data is encrypted and protected</p>
              </CardContent>
            </Card>
            <Card className="border-slate-700 bg-slate-800/50 backdrop-blur">
              <CardContent className="pt-6">
                <Zap className="w-8 h-8 text-yellow-400 mb-4" />
                <p className="text-white font-semibold">Instant Transfers</p>
                <p className="text-slate-400 text-sm mt-2">Send money in seconds, not days</p>
              </CardContent>
            </Card>
            <Card className="border-slate-700 bg-slate-800/50 backdrop-blur">
              <CardContent className="pt-6">
                <Shield className="w-8 h-8 text-purple-400 mb-4" />
                <p className="text-white font-semibold">Fraud Protection</p>
                <p className="text-slate-400 text-sm mt-2">24/7 monitoring and alerts</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 py-20 border-t border-slate-700">
        <h3 className="text-4xl font-bold text-white mb-12 text-center">Why Choose FinanceHub?</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="border-slate-700 bg-slate-800/50 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <CheckCircle2 className="w-6 h-6 text-green-400" />
                Zero Fees
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-400">
                No hidden charges. All transfers, payments, and account management are completely free.
              </p>
            </CardContent>
          </Card>

          <Card className="border-slate-700 bg-slate-800/50 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <CheckCircle2 className="w-6 h-6 text-green-400" />
                24/7 Support
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-400">
                Our dedicated support team is available round the clock to help you with any questions.
              </p>
            </CardContent>
          </Card>

          <Card className="border-slate-700 bg-slate-800/50 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <CheckCircle2 className="w-6 h-6 text-green-400" />
                Multi-Account
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-400">
                Manage multiple accounts from one dashboard. Savings, current, and investment accounts.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 py-20 border-t border-slate-700">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-12 text-center">
          <h3 className="text-3xl font-bold text-white mb-4">Ready to Take Control of Your Finances?</h3>
          <p className="text-blue-100 mb-8 text-lg">Join thousands of users who trust FinanceHub</p>
          <Button
            onClick={() => router.push("/")}
            className="bg-white hover:bg-slate-100 text-blue-600 px-8 py-6 text-lg font-semibold"
          >
            Create Your Account Now
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-700 bg-slate-800/50 backdrop-blur mt-20">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="text-white font-semibold mb-4">FinanceHub</h4>
              <p className="text-slate-400 text-sm">Secure banking for everyone</p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li>
                  <a href="#" className="hover:text-white transition">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Security
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li>
                  <a href="#" className="hover:text-white transition">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Careers
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li>
                  <a href="/policy" className="hover:text-white transition">
                    Policies
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Terms
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Privacy
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-700 pt-8 flex items-center justify-between">
            <p className="text-slate-400 text-sm">© 2025 FinanceHub. All rights reserved.</p>
            <div className="flex gap-4">
              <a href="#" className="text-slate-400 hover:text-white transition">
                Twitter
              </a>
              <a href="#" className="text-slate-400 hover:text-white transition">
                LinkedIn
              </a>
              <a href="#" className="text-slate-400 hover:text-white transition">
                GitHub
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
