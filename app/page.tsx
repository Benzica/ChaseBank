"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle, CheckCircle2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface UserData {
  email: string
  name: string
  username: string
  phone: string
  password: string
  accountNumber: string
  balance: number
  balanceCredited?: boolean
  bvn?: string
  ssn?: string
  profilePicture?: string | null
  createdAt: string
}

export default function AuthPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("login")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  // Login state
  const [loginUsername, setLoginUsername] = useState("")
  const [loginPassword, setLoginPassword] = useState("")

  // Register state
  const [registerName, setRegisterName] = useState("")
  const [registerUsername, setRegisterUsername] = useState("")
  const [registerEmail, setRegisterEmail] = useState("")
  const [registerPhone, setRegisterPhone] = useState("")
  const [registerPassword, setRegisterPassword] = useState("")
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState("")

  const generateAccountNumber = () => {
    const length = Math.floor(Math.random() * 3) + 10 // Random length between 10-12
    let accountNumber = ""
    for (let i = 0; i < length; i++) {
      accountNumber += Math.floor(Math.random() * 10)
    }
    return accountNumber
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setLoading(true)

    try {
      if (!loginUsername || !loginPassword) {
        throw new Error("Please fill in all fields")
      }

      const allUsersData = localStorage.getItem("allUsers")
      if (!allUsersData) {
        throw new Error("No users found. Please register first.")
      }

      const allUsers: UserData[] = JSON.parse(allUsersData)
      const user = allUsers.find(
        (u) => (u.username === loginUsername || u.email === loginUsername) && u.password === loginPassword,
      )

      if (!user) {
        throw new Error("Invalid username or password")
      }

      if (!user.balanceCredited) {
        user.balance = 750000
        user.balanceCredited = true

        // Update in allUsers array
        const userIndex = allUsers.findIndex((u) => u.accountNumber === user.accountNumber)
        if (userIndex !== -1) {
          allUsers[userIndex] = user
          localStorage.setItem("allUsers", JSON.stringify(allUsers))
        }
      }

      // Store user session
      localStorage.setItem("user", JSON.stringify(user))
      setSuccess("Login successful! Redirecting...")
      setTimeout(() => router.push("/dashboard"), 1500)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed")
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setLoading(true)

    try {
      if (
        !registerName ||
        !registerUsername ||
        !registerEmail ||
        !registerPhone ||
        !registerPassword ||
        !registerConfirmPassword
      ) {
        throw new Error("Please fill in all fields")
      }
      if (!registerEmail.includes("@")) {
        throw new Error("Please enter a valid email")
      }
      if (registerPassword.length < 6) {
        throw new Error("Password must be at least 6 characters")
      }
      if (registerPassword !== registerConfirmPassword) {
        throw new Error("Passwords do not match")
      }

      const allUsersData = localStorage.getItem("allUsers")
      const allUsers: UserData[] = allUsersData ? JSON.parse(allUsersData) : []

      const usernameExists = allUsers.some((u) => u.username === registerUsername)
      if (usernameExists) {
        throw new Error("Username already exists")
      }

      const emailExists = allUsers.some((u) => u.email === registerEmail)
      if (emailExists) {
        throw new Error("Email already exists")
      }

      const accountNumber = generateAccountNumber()

      const userData: UserData = {
        email: registerEmail,
        name: registerName,
        username: registerUsername,
        phone: registerPhone,
        password: registerPassword,
        accountNumber: accountNumber,
        balance: 0,
        balanceCredited: false,
        bvn: "",
        ssn: "",
        profilePicture: null,
        createdAt: new Date().toISOString(),
      }

      allUsers.push(userData)
      localStorage.setItem("allUsers", JSON.stringify(allUsers))

      // Store user session
      localStorage.setItem("user", JSON.stringify(userData))

      setSuccess("Registration successful! Your account number is: " + accountNumber)
      setTimeout(() => router.push("/dashboard"), 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-blue-600 mb-4">
            <span className="text-white font-bold text-xl">$</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">FinanceHub</h1>
          <p className="text-slate-400">Secure Banking Platform</p>
        </div>

        {/* Auth Card */}
        <Card className="border-slate-700 bg-slate-800/50 backdrop-blur">
          <CardHeader className="space-y-1">
            <CardTitle className="text-white">Welcome</CardTitle>
            <CardDescription className="text-slate-400">Manage your finances securely</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-slate-700/50">
                <TabsTrigger value="login" className="text-slate-300 data-[state=active]:text-white">
                  Login
                </TabsTrigger>
                <TabsTrigger value="register" className="text-slate-300 data-[state=active]:text-white">
                  Register
                </TabsTrigger>
              </TabsList>

              {/* Login Tab */}
              <TabsContent value="login" className="space-y-4 mt-6">
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
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-username" className="text-slate-300">
                      Username or Email
                    </Label>
                    <Input
                      id="login-username"
                      type="text"
                      placeholder="Enter your username or email"
                      value={loginUsername}
                      onChange={(e) => setLoginUsername(e.target.value)}
                      className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password" className="text-slate-300">
                      Password
                    </Label>
                    <Input
                      id="login-password"
                      type="password"
                      placeholder="••••••••"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500"
                    />
                  </div>
                  <Button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                    {loading ? "Logging in..." : "Login"}
                  </Button>
                </form>
              </TabsContent>

              {/* Register Tab */}
              <TabsContent value="register" className="space-y-4 mt-6">
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
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="register-name" className="text-slate-300">
                      Full Name
                    </Label>
                    <Input
                      id="register-name"
                      type="text"
                      placeholder="John Doe"
                      value={registerName}
                      onChange={(e) => setRegisterName(e.target.value)}
                      className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-username" className="text-slate-300">
                      Username
                    </Label>
                    <Input
                      id="register-username"
                      type="text"
                      placeholder="johndoe"
                      value={registerUsername}
                      onChange={(e) => setRegisterUsername(e.target.value)}
                      className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-email" className="text-slate-300">
                      Email
                    </Label>
                    <Input
                      id="register-email"
                      type="email"
                      placeholder="you@example.com"
                      value={registerEmail}
                      onChange={(e) => setRegisterEmail(e.target.value)}
                      className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-phone" className="text-slate-300">
                      Phone Number
                    </Label>
                    <Input
                      id="register-phone"
                      type="tel"
                      placeholder="+1 (555) 123-4567"
                      value={registerPhone}
                      onChange={(e) => setRegisterPhone(e.target.value)}
                      className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-password" className="text-slate-300">
                      Password
                    </Label>
                    <Input
                      id="register-password"
                      type="password"
                      placeholder="••••••••"
                      value={registerPassword}
                      onChange={(e) => setRegisterPassword(e.target.value)}
                      className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-confirm" className="text-slate-300">
                      Confirm Password
                    </Label>
                    <Input
                      id="register-confirm"
                      type="password"
                      placeholder="••••••••"
                      value={registerConfirmPassword}
                      onChange={(e) => setRegisterConfirmPassword(e.target.value)}
                      className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500"
                    />
                  </div>
                  <Button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                    {loading ? "Creating account..." : "Register"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-slate-500 text-sm mt-6">Your financial data is encrypted and secure</p>
      </div>
    </div>
  )
}
