"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  Users,
  Activity,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Shield,
  DollarSign,
  ArrowLeft,
  Search,
} from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface Transaction {
  id: string
  type: string
  amount: number
  date: string
  status: string
  sender?: string
  recipient?: string
  flagged?: boolean
}

interface User {
  accountNumber: string
  name: string
  username: string
  email: string
  phone: string
  balance: number
  createdAt: string
  kycStatus?: string
}

export default function AdminPanelPage() {
  const router = useRouter()
  const [allUsers, setAllUsers] = useState<User[]>([])
  const [allTransactions, setAllTransactions] = useState<Transaction[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/")
      return
    }

    const usersData = localStorage.getItem("allUsers")
    if (usersData) {
      setAllUsers(JSON.parse(usersData))
    }

    const transactionsData = localStorage.getItem("transactions")
    if (transactionsData) {
      setAllTransactions(JSON.parse(transactionsData))
    }
  }, [router])

  const totalBalance = allUsers.reduce((sum, user) => sum + (user.balance || 0), 0)
  const totalTransactions = allTransactions.length
  const flaggedTransactions = allTransactions.filter((t) => t.flagged).length

  const filteredUsers = searchQuery
    ? allUsers.filter(
        (user) =>
          user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.accountNumber.includes(searchQuery),
      )
    : allUsers

  const handleApproveKYC = (accountNumber: string) => {
    const updatedUsers = allUsers.map((user) =>
      user.accountNumber === accountNumber ? { ...user, kycStatus: "approved" } : user,
    )
    setAllUsers(updatedUsers)
    localStorage.setItem("allUsers", JSON.stringify(updatedUsers))
  }

  const handleRejectKYC = (accountNumber: string) => {
    const updatedUsers = allUsers.map((user) =>
      user.accountNumber === accountNumber ? { ...user, kycStatus: "rejected" } : user,
    )
    setAllUsers(updatedUsers)
    localStorage.setItem("allUsers", JSON.stringify(updatedUsers))
  }

  const handleFlagTransaction = (transactionId: string) => {
    const updatedTransactions = allTransactions.map((t) => (t.id === transactionId ? { ...t, flagged: !t.flagged } : t))
    setAllTransactions(updatedTransactions)
    localStorage.setItem("transactions", JSON.stringify(updatedTransactions))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <header className="border-b border-slate-700 bg-slate-800/50 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push("/dashboard")}
              className="text-slate-400 hover:text-white"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                <Shield className="w-6 h-6 text-blue-500" />
                Admin Panel
              </h1>
              <p className="text-slate-400 text-sm">System management and monitoring</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-slate-700 bg-slate-800/50 backdrop-blur">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Total Users</p>
                  <p className="text-3xl font-bold text-white mt-1">{allUsers.length}</p>
                </div>
                <Users className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-700 bg-slate-800/50 backdrop-blur">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Total Balance</p>
                  <p className="text-3xl font-bold text-white mt-1">${totalBalance.toLocaleString()}</p>
                </div>
                <DollarSign className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-700 bg-slate-800/50 backdrop-blur">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Transactions</p>
                  <p className="text-3xl font-bold text-white mt-1">{totalTransactions}</p>
                </div>
                <Activity className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-700 bg-slate-800/50 backdrop-blur">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Flagged</p>
                  <p className="text-3xl font-bold text-white mt-1">{flaggedTransactions}</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="bg-slate-800/50 border border-slate-700">
            <TabsTrigger value="users" className="text-slate-300 data-[state=active]:text-white">
              <Users className="w-4 h-4 mr-2" />
              Users
            </TabsTrigger>
            <TabsTrigger value="transactions" className="text-slate-300 data-[state=active]:text-white">
              <Activity className="w-4 h-4 mr-2" />
              Transactions
            </TabsTrigger>
            <TabsTrigger value="kyc" className="text-slate-300 data-[state=active]:text-white">
              <Shield className="w-4 h-4 mr-2" />
              KYC Approval
            </TabsTrigger>
            <TabsTrigger value="fraud" className="text-slate-300 data-[state=active]:text-white">
              <AlertTriangle className="w-4 h-4 mr-2" />
              Fraud Detection
            </TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-4">
            <Card className="border-slate-700 bg-slate-800/50 backdrop-blur">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white">User Management</CardTitle>
                  <div className="relative w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      placeholder="Search users..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 bg-slate-700/50 border-slate-600 text-white"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {filteredUsers.map((user) => (
                    <div
                      key={user.accountNumber}
                      className="p-4 rounded-lg bg-slate-700/30 border border-slate-600 hover:bg-slate-700/50 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-white font-semibold">{user.name}</h3>
                            <Badge variant="outline" className="text-slate-300">
                              @{user.username}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-sm text-slate-400">
                            <p>Account: {user.accountNumber}</p>
                            <p>Email: {user.email}</p>
                            <p>Phone: {user.phone}</p>
                            <p>Balance: ${user.balance?.toLocaleString() || 0}</p>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-blue-500/30 text-blue-300 hover:bg-blue-500/10 bg-transparent"
                          onClick={() => setSelectedUser(user)}
                        >
                          View Details
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="transactions" className="space-y-4">
            <Card className="border-slate-700 bg-slate-800/50 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-white">Transaction Monitoring</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {allTransactions.slice(0, 20).map((transaction) => (
                    <div
                      key={transaction.id}
                      className={`p-4 rounded-lg border transition-colors ${
                        transaction.flagged
                          ? "bg-red-500/10 border-red-500/30"
                          : "bg-slate-700/30 border-slate-600 hover:bg-slate-700/50"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <p className="text-white font-medium">{transaction.type}</p>
                            <Badge variant={transaction.status === "completed" ? "default" : "secondary"}>
                              {transaction.status}
                            </Badge>
                            {transaction.flagged && (
                              <Badge variant="destructive" className="bg-red-500/20 text-red-300">
                                <AlertTriangle className="w-3 h-3 mr-1" />
                                Flagged
                              </Badge>
                            )}
                          </div>
                          <div className="grid grid-cols-3 gap-4 text-sm text-slate-400">
                            <p>ID: {transaction.id}</p>
                            <p>Amount: ${transaction.amount.toLocaleString()}</p>
                            <p>Date: {new Date(transaction.date).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleFlagTransaction(transaction.id)}
                          className={
                            transaction.flagged
                              ? "border-green-500/30 text-green-300"
                              : "border-red-500/30 text-red-300"
                          }
                        >
                          {transaction.flagged ? "Unflag" : "Flag"}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="kyc" className="space-y-4">
            <Card className="border-slate-700 bg-slate-800/50 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-white">KYC Verification Queue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {allUsers.filter((u) => !u.kycStatus || u.kycStatus === "pending").length === 0 && (
                    <Alert className="bg-green-500/10 border-green-500/20">
                      <CheckCircle className="h-4 h-4 text-green-500" />
                      <AlertDescription className="text-green-400">
                        All KYC verifications are up to date
                      </AlertDescription>
                    </Alert>
                  )}
                  {allUsers
                    .filter((u) => !u.kycStatus || u.kycStatus === "pending")
                    .map((user) => (
                      <div key={user.accountNumber} className="p-4 rounded-lg bg-slate-700/30 border border-slate-600">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-white font-semibold mb-1">{user.name}</h3>
                            <p className="text-sm text-slate-400">Account: {user.accountNumber}</p>
                            <p className="text-sm text-slate-400">Email: {user.email}</p>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => handleApproveKYC(user.accountNumber)}
                              className="bg-green-600 hover:bg-green-700 text-white"
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleRejectKYC(user.accountNumber)}
                              className="bg-red-600 hover:bg-red-700 text-white"
                            >
                              <XCircle className="w-4 h-4 mr-1" />
                              Reject
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="fraud" className="space-y-4">
            <Card className="border-slate-700 bg-slate-800/50 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-white">Fraud Detection & Prevention</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-white font-semibold mb-3">Flagged Transactions</h3>
                    {allTransactions.filter((t) => t.flagged).length === 0 ? (
                      <Alert className="bg-green-500/10 border-green-500/20">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <AlertDescription className="text-green-400">
                          No suspicious transactions detected
                        </AlertDescription>
                      </Alert>
                    ) : (
                      <div className="space-y-3">
                        {allTransactions
                          .filter((t) => t.flagged)
                          .map((transaction) => (
                            <div key={transaction.id} className="p-4 rounded-lg bg-red-500/10 border border-red-500/30">
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="text-white font-medium mb-1">{transaction.type}</p>
                                  <p className="text-sm text-slate-400">
                                    Amount: ${transaction.amount.toLocaleString()}
                                  </p>
                                  <p className="text-sm text-slate-400">
                                    Date: {new Date(transaction.date).toLocaleDateString()}
                                  </p>
                                </div>
                                <div className="flex gap-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleFlagTransaction(transaction.id)}
                                    className="border-green-500/30 text-green-300"
                                  >
                                    Clear Flag
                                  </Button>
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                    )}
                  </div>

                  <div>
                    <h3 className="text-white font-semibold mb-3">Active Fraud Rules</h3>
                    <div className="space-y-2">
                      <div className="p-3 rounded-lg bg-slate-700/30 border border-slate-600">
                        <p className="text-white text-sm">
                          <CheckCircle className="inline w-4 h-4 text-green-500 mr-2" />
                          High-value transaction monitoring ($10,000+)
                        </p>
                      </div>
                      <div className="p-3 rounded-lg bg-slate-700/30 border border-slate-600">
                        <p className="text-white text-sm">
                          <CheckCircle className="inline w-4 h-4 text-green-500 mr-2" />
                          Multiple failed login attempts
                        </p>
                      </div>
                      <div className="p-3 rounded-lg bg-slate-700/30 border border-slate-600">
                        <p className="text-white text-sm">
                          <CheckCircle className="inline w-4 h-4 text-green-500 mr-2" />
                          Unusual transaction patterns
                        </p>
                      </div>
                      <div className="p-3 rounded-lg bg-slate-700/30 border border-slate-600">
                        <p className="text-white text-sm">
                          <CheckCircle className="inline w-4 h-4 text-green-500 mr-2" />
                          Geographic anomaly detection
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
