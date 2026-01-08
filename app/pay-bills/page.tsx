"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, CheckCircle2, Zap, Wifi, Phone, Tv, Home, ArrowLeft, DollarSign } from "lucide-react"

interface BillCategory {
  id: string
  name: string
  icon: React.ReactNode
  providers: string[]
}

const billCategories: BillCategory[] = [
  {
    id: "electricity",
    name: "Electricity",
    icon: <Zap className="w-5 h-5" />,
    providers: ["PowerGrid Inc", "Electric Co", "Energy Plus"],
  },
  {
    id: "internet",
    name: "Internet",
    icon: <Wifi className="w-5 h-5" />,
    providers: ["FastNet", "WebConnect", "SuperSpeed ISP"],
  },
  {
    id: "mobile",
    name: "Mobile/Airtime",
    icon: <Phone className="w-5 h-5" />,
    providers: ["AT&T", "Verizon", "T-Mobile", "Sprint"],
  },
  {
    id: "cable",
    name: "Cable TV",
    icon: <Tv className="w-5 h-5" />,
    providers: ["Comcast", "DirectTV", "Dish Network"],
  },
  {
    id: "water",
    name: "Water",
    icon: <Home className="w-5 h-5" />,
    providers: ["City Water Department", "Aqua Services"],
  },
]

export default function PayBillsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [userBalance, setUserBalance] = useState(0)

  const [selectedCategory, setSelectedCategory] = useState<string>("")
  const [selectedProvider, setSelectedProvider] = useState<string>("")
  const [accountNumber, setAccountNumber] = useState("")
  const [amount, setAmount] = useState("")

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/")
      return
    }
    const user = JSON.parse(userData)
    setUserBalance(user.balance || 0)
  }, [router])

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setLoading(true)

    try {
      if (!selectedCategory || !selectedProvider || !accountNumber || !amount) {
        throw new Error("Please fill in all fields")
      }

      const paymentAmount = Number.parseFloat(amount)
      if (isNaN(paymentAmount) || paymentAmount <= 0) {
        throw new Error("Please enter a valid amount")
      }

      if (paymentAmount > userBalance) {
        throw new Error("Insufficient balance")
      }

      // Get user data
      const userData = localStorage.getItem("user")
      if (!userData) throw new Error("Session expired")

      const user = JSON.parse(userData)
      const allUsersData = localStorage.getItem("allUsers")
      const allUsers = allUsersData ? JSON.parse(allUsersData) : []

      // Deduct amount from user balance
      user.balance -= paymentAmount
      setUserBalance(user.balance)

      // Update in allUsers array
      const userIndex = allUsers.findIndex((u: any) => u.accountNumber === user.accountNumber)
      if (userIndex !== -1) {
        allUsers[userIndex].balance = user.balance
      }

      // Save transaction
      const transactionId = `TXN${Date.now()}`
      const transaction = {
        id: transactionId,
        type: "bill_payment",
        category: selectedCategory,
        provider: selectedProvider,
        accountNumber: accountNumber,
        amount: paymentAmount,
        date: new Date().toISOString(),
        status: "completed",
      }

      const transactions = JSON.parse(localStorage.getItem("transactions") || "[]")
      transactions.push(transaction)
      localStorage.setItem("transactions", JSON.stringify(transactions))

      // Update storage
      localStorage.setItem("user", JSON.stringify(user))
      localStorage.setItem("allUsers", JSON.stringify(allUsers))

      setSuccess(`Bill payment successful! Transaction ID: ${transactionId}`)

      // Reset form
      setTimeout(() => {
        setSelectedCategory("")
        setSelectedProvider("")
        setAccountNumber("")
        setAmount("")
        setSuccess("")
      }, 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Payment failed")
    } finally {
      setLoading(false)
    }
  }

  const currentProviders = billCategories.find((cat) => cat.id === selectedCategory)?.providers || []

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      <div className="max-w-4xl mx-auto pt-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="icon" onClick={() => router.back()} className="text-slate-400 hover:text-white">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-white">Pay Bills</h1>
            <p className="text-slate-400">Pay your utilities and services</p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Bill Categories */}
          <Card className="border-slate-700 bg-slate-800/50 backdrop-blur md:col-span-2">
            <CardHeader>
              <CardTitle className="text-white">Select Bill Category</CardTitle>
              <CardDescription className="text-slate-400">Choose the service you want to pay for</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {error && (
                <Alert className="bg-red-500/10 border-red-500/20">
                  <AlertCircle className="h-4 w-4 text-red-500" />
                  <AlertDescription className="text-red-500">{error}</AlertDescription>
                </Alert>
              )}
              {success && (
                <Alert className="bg-green-500/10 border-green-500/20">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <AlertDescription className="text-green-500">{success}</AlertDescription>
                </Alert>
              )}

              {/* Category Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {billCategories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => {
                      setSelectedCategory(category.id)
                      setSelectedProvider("")
                    }}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      selectedCategory === category.id
                        ? "border-blue-500 bg-blue-500/10 text-white"
                        : "border-slate-600 bg-slate-700/30 text-slate-400 hover:border-slate-500"
                    }`}
                  >
                    <div className="flex flex-col items-center gap-2">
                      {category.icon}
                      <span className="text-sm font-medium">{category.name}</span>
                    </div>
                  </button>
                ))}
              </div>

              {/* Payment Form */}
              {selectedCategory && (
                <form onSubmit={handlePayment} className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label className="text-slate-300">Service Provider</Label>
                    <Select value={selectedProvider} onValueChange={setSelectedProvider}>
                      <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                        <SelectValue placeholder="Select provider" />
                      </SelectTrigger>
                      <SelectContent>
                        {currentProviders.map((provider) => (
                          <SelectItem key={provider} value={provider}>
                            {provider}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-slate-300">Account/Meter Number</Label>
                    <Input
                      type="text"
                      placeholder="Enter your account number"
                      value={accountNumber}
                      onChange={(e) => setAccountNumber(e.target.value)}
                      className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-slate-300">Amount</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <Input
                        type="number"
                        placeholder="0.00"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="pl-10 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500"
                      />
                    </div>
                  </div>

                  <Button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700">
                    {loading ? "Processing..." : "Pay Bill"}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>

          {/* Account Summary */}
          <div className="space-y-6">
            <Card className="border-slate-700 bg-slate-800/50 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-white text-lg">Available Balance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white">${userBalance.toLocaleString()}</div>
              </CardContent>
            </Card>

            <Card className="border-slate-700 bg-slate-800/50 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-white text-lg">Quick Tips</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-slate-400">
                <p>• Double-check your account number</p>
                <p>• Keep receipts for your records</p>
                <p>• Set up auto-pay to avoid late fees</p>
                <p>• Check for transaction limits</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
