"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LogOut, Settings, Eye, EyeOff, TrendingUp, TrendingDown, Send, Plus } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface UserData {
  email: string
  name: string
}

interface Transaction {
  id: string
  type: "credit" | "debit"
  description: string
  amount: number
  date: string
  category: string
}

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const [showBalance, setShowBalance] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")

  const transactions: Transaction[] = [
    { id: "1", type: "debit", description: "Grocery Store", amount: 2500, date: "Today", category: "Shopping" },
    { id: "2", type: "credit", description: "Salary Deposit", amount: 50000, date: "Yesterday", category: "Income" },
    { id: "3", type: "debit", description: "Electric Bill", amount: 1200, date: "2 days ago", category: "Utilities" },
    { id: "4", type: "debit", description: "Restaurant", amount: 850, date: "3 days ago", category: "Dining" },
    {
      id: "5",
      type: "credit",
      description: "Freelance Payment",
      amount: 15000,
      date: "4 days ago",
      category: "Income",
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

  const handleLogout = () => {
    localStorage.removeItem("user")
    router.push("/")
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
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-blue-600">
              <span className="text-white font-bold">$</span>
            </div>
            <h1 className="text-2xl font-bold text-white">FinanceHub</h1>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push("/settings")}
              className="text-slate-400 hover:text-white"
            >
              <Settings className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleLogout} className="text-slate-400 hover:text-white">
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">Welcome back, {user?.name}!</h2>
          <p className="text-slate-400">Manage your accounts and transactions</p>
        </div>

        {/* Primary Account Card */}
        <Card className="border-slate-700 bg-gradient-to-br from-blue-600 to-blue-700 mb-8 text-white">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between mb-12">
              <div>
                <p className="text-blue-100 text-sm mb-2">Primary Account</p>
                <h3 className="text-2xl font-bold">Savings Account</h3>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowBalance(!showBalance)}
                className="text-blue-100 hover:text-white"
              >
                {showBalance ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
              </Button>
            </div>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-blue-100 text-sm mb-2">Available Balance</p>
                <p className="text-4xl font-bold">{showBalance ? "$24,580.50" : "••••••"}</p>
              </div>
              <div className="text-right">
                <p className="text-blue-100 text-sm">Card Number</p>
                <p className="text-lg font-mono">•••• •••• •••• 4829</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-slate-800/50 border border-slate-700">
            <TabsTrigger value="overview" className="text-slate-300 data-[state=active]:text-white">
              Overview
            </TabsTrigger>
            <TabsTrigger value="accounts" className="text-slate-300 data-[state=active]:text-white">
              Accounts
            </TabsTrigger>
            <TabsTrigger value="transactions" className="text-slate-300 data-[state=active]:text-white">
              Transactions
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6 mt-6">
            {/* Account Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="border-slate-700 bg-slate-800/50 backdrop-blur">
                <CardHeader>
                  <CardTitle className="text-slate-300 text-sm font-medium flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-green-400" />
                    Income
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-white">$65,000</div>
                  <p className="text-green-400 text-sm mt-2">This month</p>
                </CardContent>
              </Card>

              <Card className="border-slate-700 bg-slate-800/50 backdrop-blur">
                <CardHeader>
                  <CardTitle className="text-slate-300 text-sm font-medium flex items-center gap-2">
                    <TrendingDown className="w-4 h-4 text-red-400" />
                    Expenses
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-white">$4,550</div>
                  <p className="text-red-400 text-sm mt-2">This month</p>
                </CardContent>
              </Card>

              <Card className="border-slate-700 bg-slate-800/50 backdrop-blur">
                <CardHeader>
                  <CardTitle className="text-slate-300 text-sm font-medium">Savings Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-white">93%</div>
                  <p className="text-blue-400 text-sm mt-2">Excellent</p>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card className="border-slate-700 bg-slate-800/50 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-white">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2">
                    <Send className="w-4 h-4" />
                    Transfer
                  </Button>
                  <Button
                    variant="outline"
                    className="border-slate-600 text-slate-300 hover:bg-slate-700 bg-transparent flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add Account
                  </Button>
                  <Button
                    variant="outline"
                    className="border-slate-600 text-slate-300 hover:bg-slate-700 bg-transparent"
                  >
                    Pay Bills
                  </Button>
                  <Button
                    variant="outline"
                    className="border-slate-600 text-slate-300 hover:bg-slate-700 bg-transparent"
                  >
                    View Statements
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Accounts Tab */}
          <TabsContent value="accounts" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-slate-700 bg-slate-800/50 backdrop-blur">
                <CardHeader>
                  <CardTitle className="text-white">Savings Account</CardTitle>
                  <CardDescription className="text-slate-400">Primary Account</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Balance</span>
                    <span className="text-white font-semibold">$24,580.50</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Interest Rate</span>
                    <span className="text-white font-semibold">4.5% p.a.</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Account Number</span>
                    <span className="text-white font-mono text-sm">••••••••4829</span>
                  </div>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white mt-4">Manage Account</Button>
                </CardContent>
              </Card>

              <Card className="border-slate-700 bg-slate-800/50 backdrop-blur">
                <CardHeader>
                  <CardTitle className="text-white">Current Account</CardTitle>
                  <CardDescription className="text-slate-400">Business Account</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Balance</span>
                    <span className="text-white font-semibold">$8,920.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Monthly Fee</span>
                    <span className="text-white font-semibold">$0</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Account Number</span>
                    <span className="text-white font-mono text-sm">••••••••5021</span>
                  </div>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white mt-4">Manage Account</Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Transactions Tab */}
          <TabsContent value="transactions" className="space-y-6 mt-6">
            <Card className="border-slate-700 bg-slate-800/50 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-white">Recent Transactions</CardTitle>
                <CardDescription className="text-slate-400">Your latest account activity</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {transactions.map((transaction) => (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between p-4 rounded-lg bg-slate-700/30 hover:bg-slate-700/50 transition"
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center ${transaction.type === "credit" ? "bg-green-500/20" : "bg-red-500/20"}`}
                        >
                          {transaction.type === "credit" ? (
                            <TrendingUp
                              className={`w-5 h-5 ${transaction.type === "credit" ? "text-green-400" : "text-red-400"}`}
                            />
                          ) : (
                            <TrendingDown className="w-5 h-5 text-red-400" />
                          )}
                        </div>
                        <div>
                          <p className="text-white font-medium">{transaction.description}</p>
                          <p className="text-slate-400 text-sm">{transaction.date}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p
                          className={`font-semibold ${transaction.type === "credit" ? "text-green-400" : "text-white"}`}
                        >
                          {transaction.type === "credit" ? "+" : "-"}${transaction.amount.toLocaleString()}
                        </p>
                        <p className="text-slate-400 text-sm">{transaction.category}</p>
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
