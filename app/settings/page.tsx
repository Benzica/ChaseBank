"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, Save, Lock, Bell, Eye, EyeOff, Upload, Copy, Check } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface UserData {
  email: string
  name: string
  phone?: string
  accountNumber?: string
  bvn?: string
  ssn?: string
  profilePicture?: string | null
  balance?: number
}

export default function SettingsPage() {
  const router = useRouter()
  const [user, setUser] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("profile")
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [copiedField, setCopiedField] = useState("")

  // Profile state
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [bvn, setBvn] = useState("")
  const [ssn, setSsn] = useState("")
  const [profilePicture, setProfilePicture] = useState<string | null>(null)

  // Security state
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPasswords, setShowPasswords] = useState(false)

  // Notification preferences
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [smsNotifications, setSmsNotifications] = useState(false)
  const [transactionAlerts, setTransactionAlerts] = useState(true)
  const [promotionalEmails, setPromotionalEmails] = useState(false)

  // Privacy settings
  const [twoFactorAuth, setTwoFactorAuth] = useState(false)
  const [biometricLogin, setBiometricLogin] = useState(true)

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/")
      return
    }
    const parsedUser = JSON.parse(userData)
    setUser(parsedUser)
    setName(parsedUser.name)
    setEmail(parsedUser.email)
    setPhone(parsedUser.phone || "")
    setBvn(parsedUser.bvn || "")
    setSsn(parsedUser.ssn || "")
    setProfilePicture(parsedUser.profilePicture || null)
    setLoading(false)
  }, [router])

  const handleSaveProfile = () => {
    if (!user) return
    const updatedUser = {
      ...user,
      name,
      email,
      phone,
      bvn,
      ssn,
      profilePicture,
    }
    localStorage.setItem("user", JSON.stringify(updatedUser))
    setUser(updatedUser)
    setSaveSuccess(true)
    setTimeout(() => setSaveSuccess(false), 3000)
  }

  const handleProfilePictureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setProfilePicture(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleChangePassword = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      alert("Please fill in all password fields")
      return
    }
    if (newPassword !== confirmPassword) {
      alert("New passwords do not match")
      return
    }
    if (newPassword.length < 6) {
      alert("Password must be at least 6 characters")
      return
    }
    setSaveSuccess(true)
    setCurrentPassword("")
    setNewPassword("")
    setConfirmPassword("")
    setTimeout(() => setSaveSuccess(false), 3000)
  }

  const handleSaveNotifications = () => {
    setSaveSuccess(true)
    setTimeout(() => setSaveSuccess(false), 3000)
  }

  const handleSavePrivacy = () => {
    setSaveSuccess(true)
    setTimeout(() => setSaveSuccess(false), 3000)
  }

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text)
    setCopiedField(field)
    setTimeout(() => setCopiedField(""), 2000)
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
          <h1 className="text-2xl font-bold text-white">Settings</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {saveSuccess && (
          <Alert className="mb-6 bg-green-500/10 border-green-500/20">
            <AlertDescription className="text-green-400">Changes saved successfully!</AlertDescription>
          </Alert>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-slate-800/50 border border-slate-700">
            <TabsTrigger value="profile" className="text-slate-300 data-[state=active]:text-white">
              Profile
            </TabsTrigger>
            <TabsTrigger value="security" className="text-slate-300 data-[state=active]:text-white">
              Security
            </TabsTrigger>
            <TabsTrigger value="notifications" className="text-slate-300 data-[state=active]:text-white">
              Notifications
            </TabsTrigger>
            <TabsTrigger value="privacy" className="text-slate-300 data-[state=active]:text-white">
              Privacy
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6 mt-6">
            {/* Profile Picture Section */}
            <Card className="border-slate-700 bg-slate-800/50 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-white">Profile Picture</CardTitle>
                <CardDescription className="text-slate-400">Upload or change your profile picture</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-6">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center overflow-hidden">
                    {profilePicture ? (
                      <img
                        src={profilePicture || "/placeholder.svg"}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-3xl font-bold text-white">{name.charAt(0).toUpperCase()}</span>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="profile-picture" className="text-slate-300 cursor-pointer">
                      <div className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg">
                        <Upload className="w-4 h-4" />
                        Upload Picture
                      </div>
                    </Label>
                    <Input
                      id="profile-picture"
                      type="file"
                      accept="image/*"
                      onChange={handleProfilePictureUpload}
                      className="hidden"
                    />
                    <p className="text-slate-400 text-sm mt-2">JPG, PNG or GIF (Max 5MB)</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Personal Information */}
            <Card className="border-slate-700 bg-slate-800/50 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-white">Personal Information</CardTitle>
                <CardDescription className="text-slate-400">Update your personal details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-slate-300">
                    Full Name
                  </Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-slate-300">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-slate-300">
                    Phone Number
                  </Label>
                  <Input
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bvn" className="text-slate-300">
                    BVN (Bank Verification Number)
                  </Label>
                  <Input
                    id="bvn"
                    placeholder="Enter your 11-digit BVN"
                    value={bvn}
                    onChange={(e) => setBvn(e.target.value)}
                    className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500"
                  />
                  <p className="text-slate-400 text-xs">Used for identity verification and compliance</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ssn" className="text-slate-300">
                    SSN (Social Security Number)
                  </Label>
                  <Input
                    id="ssn"
                    placeholder="Enter your SSN (XXX-XX-XXXX)"
                    value={ssn}
                    onChange={(e) => setSsn(e.target.value)}
                    className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500"
                  />
                  <p className="text-slate-400 text-xs">Encrypted and securely stored</p>
                </div>

                <Button onClick={handleSaveProfile} className="bg-blue-600 hover:bg-blue-700 text-white w-full">
                  <Save className="w-4 h-4 mr-2" />
                  Save Profile
                </Button>
              </CardContent>
            </Card>

            {/* Account Information */}
            <Card className="border-slate-700 bg-slate-800/50 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-white">Account Information</CardTitle>
                <CardDescription className="text-slate-400">Your account details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg bg-slate-700/30">
                  <div>
                    <p className="text-slate-400 text-sm">Account Number</p>
                    <p className="text-white font-mono font-semibold">{user?.accountNumber}</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(user?.accountNumber || "", "account")}
                    className="border-slate-600 text-slate-300 hover:bg-slate-700 bg-transparent"
                  >
                    {copiedField === "account" ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg bg-slate-700/30">
                  <div>
                    <p className="text-slate-400 text-sm">Available Balance</p>
                    <p className="text-white font-semibold text-lg">${(user?.balance || 0).toLocaleString()}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg bg-slate-700/30">
                  <div>
                    <p className="text-slate-400 text-sm">Account Status</p>
                    <p className="text-green-400 font-semibold">Active</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-6 mt-6">
            <Card className="border-slate-700 bg-slate-800/50 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Lock className="w-5 h-5" />
                  Change Password
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Update your password regularly for security
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="current-password" className="text-slate-300">
                    Current Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="current-password"
                      type={showPasswords ? "text" : "password"}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords(!showPasswords)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                    >
                      {showPasswords ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-password" className="text-slate-300">
                    New Password
                  </Label>
                  <Input
                    id="new-password"
                    type={showPasswords ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password" className="text-slate-300">
                    Confirm Password
                  </Label>
                  <Input
                    id="confirm-password"
                    type={showPasswords ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500"
                  />
                </div>
                <Button onClick={handleChangePassword} className="bg-blue-600 hover:bg-blue-700 text-white w-full">
                  <Lock className="w-4 h-4 mr-2" />
                  Update Password
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6 mt-6">
            <Card className="border-slate-700 bg-slate-800/50 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  Notification Preferences
                </CardTitle>
                <CardDescription className="text-slate-400">Manage how you receive notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between p-4 rounded-lg bg-slate-700/30">
                  <div>
                    <p className="text-white font-medium">Email Notifications</p>
                    <p className="text-slate-400 text-sm">Receive updates via email</p>
                  </div>
                  <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg bg-slate-700/30">
                  <div>
                    <p className="text-white font-medium">SMS Notifications</p>
                    <p className="text-slate-400 text-sm">Receive updates via SMS</p>
                  </div>
                  <Switch checked={smsNotifications} onCheckedChange={setSmsNotifications} />
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg bg-slate-700/30">
                  <div>
                    <p className="text-white font-medium">Transaction Alerts</p>
                    <p className="text-slate-400 text-sm">Get notified for every transaction</p>
                  </div>
                  <Switch checked={transactionAlerts} onCheckedChange={setTransactionAlerts} />
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg bg-slate-700/30">
                  <div>
                    <p className="text-white font-medium">Promotional Emails</p>
                    <p className="text-slate-400 text-sm">Receive offers and promotions</p>
                  </div>
                  <Switch checked={promotionalEmails} onCheckedChange={setPromotionalEmails} />
                </div>

                <Button onClick={handleSaveNotifications} className="bg-blue-600 hover:bg-blue-700 text-white w-full">
                  <Save className="w-4 h-4 mr-2" />
                  Save Preferences
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Privacy Tab */}
          <TabsContent value="privacy" className="space-y-6 mt-6">
            <Card className="border-slate-700 bg-slate-800/50 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-white">Privacy & Security</CardTitle>
                <CardDescription className="text-slate-400">Control your account security settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between p-4 rounded-lg bg-slate-700/30">
                  <div>
                    <p className="text-white font-medium">Two-Factor Authentication</p>
                    <p className="text-slate-400 text-sm">Add an extra layer of security</p>
                  </div>
                  <Switch checked={twoFactorAuth} onCheckedChange={setTwoFactorAuth} />
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg bg-slate-700/30">
                  <div>
                    <p className="text-white font-medium">Biometric Login</p>
                    <p className="text-slate-400 text-sm">Use fingerprint or face recognition</p>
                  </div>
                  <Switch checked={biometricLogin} onCheckedChange={setBiometricLogin} />
                </div>

                <div className="p-4 rounded-lg bg-slate-700/30 border border-slate-600">
                  <p className="text-white font-medium mb-2">Active Sessions</p>
                  <p className="text-slate-400 text-sm mb-4">You have 1 active session</p>
                  <Button
                    variant="outline"
                    className="border-slate-600 text-slate-300 hover:bg-slate-700 bg-transparent"
                  >
                    Sign Out All Other Sessions
                  </Button>
                </div>

                <Button onClick={handleSavePrivacy} className="bg-blue-600 hover:bg-blue-700 text-white w-full">
                  <Save className="w-4 h-4 mr-2" />
                  Save Settings
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
