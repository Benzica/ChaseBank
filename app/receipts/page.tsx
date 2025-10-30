"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, FileText, ImageIcon } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface Transaction {
  id: string
  type: "sent" | "received"
  senderName: string
  senderAccount: string
  recipientName: string
  recipientAccount: string
  amount: number
  date: string
  time: string
  description: string
  status: "completed" | "pending" | "failed"
}

export default function ReceiptsPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [selectedReceipt, setSelectedReceipt] = useState<Transaction | null>(null)
  const [downloadMessage, setDownloadMessage] = useState("")

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/")
      return
    }
    const parsedUser = JSON.parse(userData)
    setUser(parsedUser)

    // Load transactions from localStorage
    const storedTransactions = localStorage.getItem("transactions")
    if (storedTransactions) {
      setTransactions(JSON.parse(storedTransactions))
    } else {
      const defaultTransactions: Transaction[] = [
        {
          id: "TXN001",
          type: "sent",
          senderName: parsedUser.name,
          senderAccount: parsedUser.accountNumber,
          recipientName: "John Smith",
          recipientAccount: "CCB1234567890",
          amount: 500,
          date: "2024-01-15",
          time: "14:30:00",
          description: "Payment for services",
          status: "completed",
        },
        {
          id: "TXN002",
          type: "received",
          senderName: "Sarah Johnson",
          senderAccount: "CCB9876543210",
          recipientName: parsedUser.name,
          recipientAccount: parsedUser.accountNumber,
          amount: 1200,
          date: "2024-01-14",
          time: "10:15:00",
          description: "Freelance payment",
          status: "completed",
        },
        {
          id: "TXN003",
          type: "sent",
          senderName: parsedUser.name,
          senderAccount: parsedUser.accountNumber,
          recipientName: "Mike Davis",
          recipientAccount: "CCB5555555555",
          amount: 250,
          date: "2024-01-13",
          time: "09:45:00",
          description: "Lunch reimbursement",
          status: "completed",
        },
      ]
      setTransactions(defaultTransactions)
      localStorage.setItem("transactions", JSON.stringify(defaultTransactions))
    }
    setLoading(false)
  }, [router])

  const generateReceiptHTML = (transaction: Transaction) => {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
          .receipt { background: white; max-width: 600px; margin: 0 auto; padding: 40px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
          .header { text-align: center; border-bottom: 2px solid #2563eb; padding-bottom: 20px; margin-bottom: 30px; }
          .logo { font-size: 32px; font-weight: bold; color: #2563eb; margin-bottom: 10px; }
          .bank-name { font-size: 18px; color: #333; }
          .receipt-title { font-size: 24px; font-weight: bold; color: #333; margin: 20px 0; }
          .section { margin-bottom: 30px; }
          .section-title { font-size: 14px; font-weight: bold; color: #666; text-transform: uppercase; margin-bottom: 10px; }
          .row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee; }
          .label { color: #666; font-size: 14px; }
          .value { color: #333; font-weight: bold; font-size: 14px; }
          .amount { font-size: 28px; font-weight: bold; color: #2563eb; text-align: center; margin: 20px 0; }
          .status { text-align: center; padding: 10px; background: #d1fae5; color: #065f46; border-radius: 4px; margin: 20px 0; font-weight: bold; }
          .footer { text-align: center; color: #999; font-size: 12px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; }
        </style>
      </head>
      <body>
        <div class="receipt">
          <div class="header">
            <div class="logo">$</div>
            <div class="bank-name">FinanceHub Bank</div>
          </div>
          
          <div class="receipt-title">Transaction Receipt</div>
          
          <div class="section">
            <div class="section-title">Transaction Details</div>
            <div class="row">
              <span class="label">Transaction ID:</span>
              <span class="value">${transaction.id}</span>
            </div>
            <div class="row">
              <span class="label">Date:</span>
              <span class="value">${transaction.date}</span>
            </div>
            <div class="row">
              <span class="label">Time:</span>
              <span class="value">${transaction.time}</span>
            </div>
            <div class="row">
              <span class="label">Status:</span>
              <span class="value">${transaction.status.toUpperCase()}</span>
            </div>
          </div>
          
          <div class="section">
            <div class="section-title">${transaction.type === "sent" ? "From" : "To"}</div>
            <div class="row">
              <span class="label">Name:</span>
              <span class="value">${transaction.type === "sent" ? transaction.senderName : transaction.recipientName}</span>
            </div>
            <div class="row">
              <span class="label">Account Number:</span>
              <span class="value">${transaction.type === "sent" ? transaction.senderAccount : transaction.recipientAccount}</span>
            </div>
          </div>
          
          <div class="section">
            <div class="section-title">${transaction.type === "sent" ? "To" : "From"}</div>
            <div class="row">
              <span class="label">Name:</span>
              <span class="value">${transaction.type === "sent" ? transaction.recipientName : transaction.senderName}</span>
            </div>
            <div class="row">
              <span class="label">Account Number:</span>
              <span class="value">${transaction.type === "sent" ? transaction.recipientAccount : transaction.senderAccount}</span>
            </div>
          </div>
          
          <div class="amount">$${transaction.amount.toLocaleString()}</div>
          
          <div class="section">
            <div class="row">
              <span class="label">Description:</span>
              <span class="value">${transaction.description}</span>
            </div>
          </div>
          
          <div class="status">Transaction Completed Successfully</div>
          
          <div class="footer">
            <p>This is an electronically generated receipt. No signature is required.</p>
            <p>FinanceHub Bank | Secure Banking Platform</p>
            <p>Generated on ${new Date().toLocaleString()}</p>
          </div>
        </div>
      </body>
      </html>
    `
  }

  const downloadReceiptPDF = (transaction: Transaction) => {
    const htmlContent = generateReceiptHTML(transaction)
    const blob = new Blob([htmlContent], { type: "text/html" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `receipt-${transaction.id}.html`
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
    setDownloadMessage("Receipt downloaded successfully")
    setTimeout(() => setDownloadMessage(""), 3000)
  }

  const downloadReceiptImage = (transaction: Transaction) => {
    const canvas = document.createElement("canvas")
    canvas.width = 600
    canvas.height = 800
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.fillStyle = "#ffffff"
    ctx.fillRect(0, 0, 600, 800)

    ctx.fillStyle = "#2563eb"
    ctx.font = "bold 32px Arial"
    ctx.textAlign = "center"
    ctx.fillText("$", 300, 50)

    ctx.fillStyle = "#333333"
    ctx.font = "18px Arial"
    ctx.fillText("FinanceHub Bank", 300, 90)

    ctx.font = "bold 24px Arial"
    ctx.fillText("Transaction Receipt", 300, 140)

    let yPos = 180
    const lineHeight = 30

    ctx.font = "14px Arial"
    ctx.textAlign = "left"
    ctx.fillStyle = "#666666"

    const details = [
      `Transaction ID: ${transaction.id}`,
      `Date: ${transaction.date}`,
      `Time: ${transaction.time}`,
      `Status: ${transaction.status.toUpperCase()}`,
      "",
      `${transaction.type === "sent" ? "From" : "To"}: ${transaction.type === "sent" ? transaction.senderName : transaction.recipientName}`,
      `Account: ${transaction.type === "sent" ? transaction.senderAccount : transaction.recipientAccount}`,
      "",
      `${transaction.type === "sent" ? "To" : "From"}: ${transaction.type === "sent" ? transaction.recipientName : transaction.senderName}`,
      `Account: ${transaction.type === "sent" ? transaction.recipientAccount : transaction.senderAccount}`,
    ]

    details.forEach((detail) => {
      ctx.fillText(detail, 30, yPos)
      yPos += lineHeight
    })

    ctx.fillStyle = "#2563eb"
    ctx.font = "bold 28px Arial"
    ctx.textAlign = "center"
    ctx.fillText(`$${transaction.amount.toLocaleString()}`, 300, yPos + 20)

    const link = document.createElement("a")
    link.href = canvas.toDataURL("image/png")
    link.download = `receipt-${transaction.id}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    setDownloadMessage("Receipt image downloaded successfully")
    setTimeout(() => setDownloadMessage(""), 3000)
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
          <h1 className="text-2xl font-bold text-white">Transaction Receipts</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {downloadMessage && (
          <Alert className="mb-6 bg-green-500/10 border-green-500/20">
            <AlertDescription className="text-green-400">{downloadMessage}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Transactions List */}
          <div className="lg:col-span-2">
            <Card className="border-slate-700 bg-slate-800/50 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-white">Recent Transactions</CardTitle>
                <CardDescription className="text-slate-400">Select a transaction to view receipt</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {transactions.map((transaction) => (
                    <div
                      key={transaction.id}
                      onClick={() => setSelectedReceipt(transaction)}
                      className={`p-4 rounded-lg cursor-pointer transition ${
                        selectedReceipt?.id === transaction.id
                          ? "bg-blue-600/20 border border-blue-500"
                          : "bg-slate-700/30 hover:bg-slate-700/50 border border-slate-700"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="text-white font-medium">
                            {transaction.type === "sent" ? "Sent to" : "Received from"}{" "}
                            {transaction.type === "sent" ? transaction.recipientName : transaction.senderName}
                          </p>
                          <p className="text-slate-400 text-sm">{transaction.date}</p>
                        </div>
                        <div className="text-right">
                          <p
                            className={`font-semibold ${transaction.type === "sent" ? "text-red-400" : "text-green-400"}`}
                          >
                            {transaction.type === "sent" ? "-" : "+"}${transaction.amount.toLocaleString()}
                          </p>
                          <p className="text-slate-400 text-sm">{transaction.id}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Receipt Preview */}
          <div>
            {selectedReceipt ? (
              <Card className="border-slate-700 bg-slate-800/50 backdrop-blur sticky top-24">
                <CardHeader>
                  <CardTitle className="text-white text-lg">Receipt Preview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-slate-700/30 p-4 rounded-lg space-y-3">
                    <div>
                      <p className="text-slate-400 text-sm">Transaction ID</p>
                      <p className="text-white font-mono">{selectedReceipt.id}</p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-sm">Amount</p>
                      <p className="text-2xl font-bold text-blue-400">${selectedReceipt.amount.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-sm">Date & Time</p>
                      <p className="text-white">
                        {selectedReceipt.date} {selectedReceipt.time}
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-sm">Status</p>
                      <p className="text-green-400 font-semibold">{selectedReceipt.status.toUpperCase()}</p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-sm">Description</p>
                      <p className="text-white">{selectedReceipt.description}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Button
                      onClick={() => downloadReceiptPDF(selectedReceipt)}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-2"
                    >
                      <FileText className="w-4 h-4" />
                      Download as HTML
                    </Button>
                    <Button
                      onClick={() => downloadReceiptImage(selectedReceipt)}
                      variant="outline"
                      className="w-full border-slate-600 text-slate-300 hover:bg-slate-700 bg-transparent flex items-center justify-center gap-2"
                    >
                      <ImageIcon className="w-4 h-4" />
                      Download as Image
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="border-slate-700 bg-slate-800/50 backdrop-blur">
                <CardContent className="pt-12 pb-12 text-center">
                  <FileText className="w-12 h-12 text-slate-500 mx-auto mb-4" />
                  <p className="text-slate-400">Select a transaction to view receipt</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
