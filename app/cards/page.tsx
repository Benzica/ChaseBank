"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Eye, EyeOff, Lock, Unlock, Plus, Trash2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface UserData {
  name: string
  accountNumber: string
  cards?: BankCard[]
}

interface BankCard {
  id: string
  type: "credit" | "debit"
  cardNumber: string
  cardholderName: string
  expiryDate: string
  cvv: string
  isActive: boolean
  createdAt: string
}

export default function CardsPage() {
  const router = useRouter()
  const [user, setUser] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const [cards, setCards] = useState<BankCard[]>([])
  const [showCVV, setShowCVV] = useState<{ [key: string]: boolean }>({})
  const [showCardNumber, setShowCardNumber] = useState<{ [key: string]: boolean }>({})
  const [successMessage, setSuccessMessage] = useState("")

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/")
      return
    }
    const parsedUser = JSON.parse(userData)
    setUser(parsedUser)

    // Load cards from localStorage or create default cards
    const storedCards = localStorage.getItem("userCards")
    if (storedCards) {
      setCards(JSON.parse(storedCards))
    } else {
      const defaultCards: BankCard[] = [
        {
          id: "card-1",
          type: "debit",
          cardNumber: "4532" + Math.random().toString().slice(2, 14),
          cardholderName: parsedUser.name,
          expiryDate: "12/26",
          cvv: Math.random().toString().slice(2, 5),
          isActive: true,
          createdAt: new Date().toISOString(),
        },
        {
          id: "card-2",
          type: "credit",
          cardNumber: "5425" + Math.random().toString().slice(2, 14),
          cardholderName: parsedUser.name,
          expiryDate: "08/27",
          cvv: Math.random().toString().slice(2, 5),
          isActive: true,
          createdAt: new Date().toISOString(),
        },
      ]
      setCards(defaultCards)
      localStorage.setItem("userCards", JSON.stringify(defaultCards))
    }
    setLoading(false)
  }, [router])

  const toggleCardStatus = (cardId: string) => {
    const updatedCards = cards.map((card) => (card.id === cardId ? { ...card, isActive: !card.isActive } : card))
    setCards(updatedCards)
    localStorage.setItem("userCards", JSON.stringify(updatedCards))
    setSuccessMessage(`Card ${updatedCards.find((c) => c.id === cardId)?.isActive ? "activated" : "deactivated"}`)
    setTimeout(() => setSuccessMessage(""), 3000)
  }

  const deleteCard = (cardId: string) => {
    const updatedCards = cards.filter((card) => card.id !== cardId)
    setCards(updatedCards)
    localStorage.setItem("userCards", JSON.stringify(updatedCards))
    setSuccessMessage("Card deleted successfully")
    setTimeout(() => setSuccessMessage(""), 3000)
  }

  const addNewCard = () => {
    const newCard: BankCard = {
      id: `card-${Date.now()}`,
      type: Math.random() > 0.5 ? "credit" : "debit",
      cardNumber: (Math.random() > 0.5 ? "4532" : "5425") + Math.random().toString().slice(2, 14),
      cardholderName: user?.name || "Cardholder",
      expiryDate: `${String(Math.floor(Math.random() * 12) + 1).padStart(2, "0")}/${String(new Date().getFullYear() + Math.floor(Math.random() * 5) + 1).slice(-2)}`,
      cvv: Math.random().toString().slice(2, 5),
      isActive: true,
      createdAt: new Date().toISOString(),
    }
    const updatedCards = [...cards, newCard]
    setCards(updatedCards)
    localStorage.setItem("userCards", JSON.stringify(updatedCards))
    setSuccessMessage("New card added successfully")
    setTimeout(() => setSuccessMessage(""), 3000)
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
          <h1 className="text-2xl font-bold text-white">Card Management</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {successMessage && (
          <Alert className="mb-6 bg-green-500/10 border-green-500/20">
            <AlertDescription className="text-green-400">{successMessage}</AlertDescription>
          </Alert>
        )}

        {/* Add Card Button */}
        <div className="mb-8">
          <Button onClick={addNewCard} className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add New Card
          </Button>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {cards.map((card) => (
            <Card
              key={card.id}
              className={`border-slate-700 bg-gradient-to-br ${
                card.type === "credit" ? "from-amber-600 to-amber-700" : "from-slate-700 to-slate-800"
              } text-white overflow-hidden`}
            >
              <CardContent className="pt-6">
                {/* Card Header */}
                <div className="flex items-start justify-between mb-8">
                  <div>
                    <p className="text-sm opacity-75 mb-1">{card.type === "credit" ? "CREDIT CARD" : "DEBIT CARD"}</p>
                    <p className="text-lg font-semibold">{card.cardholderName}</p>
                  </div>
                  <div
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      card.isActive ? "bg-green-500/20 text-green-300" : "bg-red-500/20 text-red-300"
                    }`}
                  >
                    {card.isActive ? "Active" : "Inactive"}
                  </div>
                </div>

                {/* Card Number */}
                <div className="mb-8">
                  <p className="text-xs opacity-75 mb-2">CARD NUMBER</p>
                  <div className="flex items-center gap-2">
                    <p className="text-2xl font-mono tracking-widest">
                      {showCardNumber[card.id] ? card.cardNumber : `•••• •••• •••• ${card.cardNumber.slice(-4)}`}
                    </p>
                    <button
                      onClick={() =>
                        setShowCardNumber({
                          ...showCardNumber,
                          [card.id]: !showCardNumber[card.id],
                        })
                      }
                      className="opacity-75 hover:opacity-100"
                    >
                      {showCardNumber[card.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Card Details */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div>
                    <p className="text-xs opacity-75 mb-1">EXPIRES</p>
                    <p className="font-mono">{card.expiryDate}</p>
                  </div>
                  <div>
                    <p className="text-xs opacity-75 mb-1">CVV</p>
                    <div className="flex items-center gap-2">
                      <p className="font-mono">{showCVV[card.id] ? card.cvv : "•••"}</p>
                      <button
                        onClick={() =>
                          setShowCVV({
                            ...showCVV,
                            [card.id]: !showCVV[card.id],
                          })
                        }
                        className="opacity-75 hover:opacity-100"
                      >
                        {showCVV[card.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs opacity-75 mb-1">TYPE</p>
                    <p className="font-mono uppercase">{card.type}</p>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="flex gap-2">
                  <Button
                    onClick={() => toggleCardStatus(card.id)}
                    variant="outline"
                    className={`flex-1 ${
                      card.isActive
                        ? "border-red-500/30 text-red-300 hover:bg-red-500/10"
                        : "border-green-500/30 text-green-300 hover:bg-green-500/10"
                    } bg-transparent`}
                  >
                    {card.isActive ? (
                      <>
                        <Lock className="w-4 h-4 mr-2" />
                        Deactivate
                      </>
                    ) : (
                      <>
                        <Unlock className="w-4 h-4 mr-2" />
                        Activate
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={() => deleteCard(card.id)}
                    variant="outline"
                    className="border-red-500/30 text-red-300 hover:bg-red-500/10 bg-transparent"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {cards.length === 0 && (
          <Card className="border-slate-700 bg-slate-800/50 backdrop-blur">
            <CardContent className="pt-12 pb-12 text-center">
              <p className="text-slate-400 mb-4">No cards found</p>
              <Button onClick={addNewCard} className="bg-blue-600 hover:bg-blue-700 text-white">
                Add Your First Card
              </Button>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}
