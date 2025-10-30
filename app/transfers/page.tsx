"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Send, CheckCircle2, AlertCircle, Clock, TrendingUp } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface UserData {
  email: string
  name: string
}

interface Transfer {
  id: string
  recipientName: string
  recipientAccount: string
  amount: number
  date: string
  status: "completed" | "pending" | "failed"
  type: "sent" | "received"
}

export default function TransfersPage() {
  const router = useRouter()
  const [user, setUser] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("new-transfer")

  // Transfer form state
  const [fromAccount, setFromAccount] = useState("savings")
  const [recipientName, setRecipientName] = useState("")
  const [recipientAccount, setRecipientAccount] = useState("")
  const [amount, setAmount] = useState("")
  const [description, setDescription] = useState("")
  const [transferError, setTransferError] = useState("")
  const [transferSuccess, setTransferSuccess] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const transfers: Transfer[] = [
    {
      id: "1",
      recipientName: "Rajesh Kumar",
      recipientAccount: "••••••••5021",
      amount: 5000,
      date: "Today",
      status: "completed",
      type: "sent",
    },
    {
      id: "2",
      recipientName: "Priya Singh",
      recipientAccount: "••••••••3456",
      amount: 2500,
      date: "Yesterday",
      status: "completed",
      type: "sent",
    },
    {
      id: "3",
      recipientName: "Amit Patel",
      recipientAccount: "••••••••7890",
      amount: 10000,
      date: "2 days ago",
      status: "pending",
      type: "sent",
    },
    {
      id: "4",
      recipientName: "Neha Sharma",
      recipientAccount: "••••••••1234",
      amount: 15000,
      date: "3 days ago",
      status: "completed",
      type: "received",
    },
    {
      id: "5",
      recipientName: "Vikram Desai",
      recipientAccount: "••••••••5678",
      amount: 3000,
      date: "4 days ago",
      status: "failed",
      type: "sent",
    },
  ]

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/")
      return
    }
    setUser(JSON.parse(userData))
    setLoading(false)
  }, [router])

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault()
    setTransferError("")
    setTransferSuccess(false)
    setIsSubmitting(true)

    try {
      if (!recipientName || !recipientAccount || !amount) {
        throw new Error("Please fill in all required fields")
      }
      if (isNaN(Number(amount)) || Number(amount) <= 0) {
        throw new Error("Please enter a valid amount")
      }
      if (Number(amount) > 24580.5) {
        throw new Error("Insufficient balance for this transfer")
      }

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      setTransferSuccess(true)
      setRecipientName("")
      setRecipientAccount("")
      setAmount("")
      setDescription("")

      setTimeout(() => {
        setTransferSuccess(false)
      }, 3000)
    } catch (err) {
      setTransferError(err instanceof Error ? err.message : "Transfer failed")
    } finally {
      setIsSubmitting(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-green-400"
      case "pending":
        return "text-yellow-400"
      case "failed":
        return "text-red-400"
      default:
        return "text-slate-400"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="w-5 h-5 text-green-400" />
      case "pending":
        return <Clock className="w-5 h-5 text-yellow-400" />
      case "failed":
        return <AlertCircle className="w-5 h-5 text-red-400" />
      default:
        return null
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
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
          <h1 className="text-2xl font-bold text-white">Transfers</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-slate-800/50 border border-slate-700">
            <TabsTrigger value="new-transfer" className="text-slate-300 data-[state=active]:text-white">
              New Transfer
            </TabsTrigger>
            <TabsTrigger value="history" className="text-slate-300 data-[state=active]:text-white">
              History
            </TabsTrigger>
          </TabsList>

          {/* New Transfer Tab */}
          <TabsContent value="new-transfer" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Transfer Form */}
              <div className="lg:col-span-2">
                <Card className="border-slate-700 bg-slate-800/50 backdrop-blur">
                  <CardHeader>
                    <CardTitle className="text-white">Send Money</CardTitle>
                    <CardDescription className="text-slate-400">Transfer funds to another account</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {transferError && (
                      <Alert className="mb-6 bg-red-500/10 border-red-500/20">
                        <AlertCircle className="h-4 w-4 text-red-500" />
                        <AlertDescription className="text-red-500">{transferError}</AlertDescription>
                      </Alert>
                    )}
                    {transferSuccess && (
                      <Alert className="mb-6 bg-green-500/10 border-green-500/20">
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                        <AlertDescription className="text-green-500">Transfer initiated successfully!</AlertDescription>
                      </Alert>
                    )}

                    <form onSubmit={handleTransfer} className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="from-account" className="text-slate-300">
                          From Account
                        </Label>
                        <Select value={fromAccount} onValueChange={setFromAccount}>
                          <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-slate-800 border-slate-700">
                            <SelectItem value="savings" className="text-white">
                              Savings Account ($24,580.50)
                            </SelectItem>
                            <SelectItem value="current" className="text-white">
                              Current Account ($8,920.00)
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="recipient-name" className="text-slate-300">
                          Recipient Name
                        </Label>
                        <Input
                          id="recipient-name"
                          placeholder="Enter recipient name"
                          value={recipientName}
                          onChange={(e) => setRecipientName(e.target.value)}
                          className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="recipient-account" className="text-slate-300">
                          Recipient Account Number
                        </Label>
                        <Input
                          id="recipient-account"
                          placeholder="Enter account number"
                          value={recipientAccount}
                          onChange={(e) => setRecipientAccount(e.target.value)}
                          className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="amount" className="text-slate-300">
                          Amount ($)
                        </Label>
                        <Input
                          id="amount"
                          type="number"
                          placeholder="0.00"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="description" className="text-slate-300">
                          Description (Optional)
                        </Label>
                        <Input
                          id="description"
                          placeholder="Add a note"
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500"
                        />
                      </div>

                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        <Send className="w-4 h-4 mr-2" />
                        {isSubmitting ? "Processing..." : "Send Money"}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Stats */}
              <div className="space-y-6">
                <Card className="border-slate-700 bg-slate-800/50 backdrop-blur">
                  <CardHeader>
                    <CardTitle className="text-slate-300 text-sm font-medium">Available Balance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-white">$24,580.50</div>
                    <p className="text-slate-400 text-sm mt-2">Savings Account</p>
                  </CardContent>
                </Card>

                <Card className="border-slate-700 bg-slate-800/50 backdrop-blur">
                  <CardHeader>
                    <CardTitle className="text-slate-300 text-sm font-medium">Transfer Limit</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-white">$100,000</div>
                    <p className="text-slate-400 text-sm mt-2">Per transaction</p>
                  </CardContent>
                </Card>

                <Card className="border-slate-700 bg-slate-800/50 backdrop-blur">
                  <CardHeader>
                    <CardTitle className="text-slate-300 text-sm font-medium">Transfer Fee</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-white">Free</div>
                    <p className="text-slate-400 text-sm mt-2">No charges</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history" className="space-y-6 mt-6">
            <Card className="border-slate-700 bg-slate-800/50 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-white">Transfer History</CardTitle>
                <CardDescription className="text-slate-400">View all your transfers</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {transfers.map((transfer) => (
                    <div
                      key={transfer.id}
                      className="flex items-center justify-between p-4 rounded-lg bg-slate-700/30 hover:bg-slate-700/50 transition cursor-pointer"
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center ${transfer.type === "received" ? "bg-green-500/20" : "bg-blue-500/20"}`}
                        >
                          {transfer.type === "received" ? (
                            <TrendingUp className="w-5 h-5 text-green-400" />
                          ) : (
                            <Send className="w-5 h-5 text-blue-400" />
                          )}
                        </div>
                        <div>
                          <p className="text-white font-medium">{transfer.recipientName}</p>
                          <p className="text-slate-400 text-sm">{transfer.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p
                            className={`font-semibold ${transfer.type === "received" ? "text-green-400" : "text-white"}`}
                          >
                            {transfer.type === "received" ? "+" : "-"}${transfer.amount.toLocaleString()}
                          </p>
                          <p className={`text-sm capitalize ${getStatusColor(transfer.status)}`}>{transfer.status}</p>
                        </div>
                        {getStatusIcon(transfer.status)}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
