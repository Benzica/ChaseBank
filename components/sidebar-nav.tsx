"use client"

import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, Send, Settings, FileText, LogOut } from "lucide-react"

export function SidebarNav() {
  const router = useRouter()
  const pathname = usePathname()

  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/transfers", label: "Transfers", icon: Send },
    { href: "/settings", label: "Settings", icon: Settings },
    { href: "/policy", label: "Policies", icon: FileText },
  ]

  const handleLogout = () => {
    localStorage.removeItem("user")
    router.push("/")
  }

  return (
    <div className="w-64 border-r border-slate-700 bg-slate-800/50 backdrop-blur min-h-screen p-4 space-y-4">
      <div className="flex items-center gap-3 mb-8">
        <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-blue-600">
          <span className="text-white font-bold">$</span>
        </div>
        <h1 className="text-xl font-bold text-white">FinanceHub</h1>
      </div>

      <nav className="space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Button
              key={item.href}
              onClick={() => router.push(item.href)}
              variant={isActive ? "default" : "ghost"}
              className={`w-full justify-start gap-2 ${
                isActive
                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                  : "text-slate-300 hover:text-white hover:bg-slate-700"
              }`}
            >
              <Icon className="w-4 h-4" />
              {item.label}
            </Button>
          )
        })}
      </nav>

      <div className="pt-4 border-t border-slate-700">
        <Button
          onClick={handleLogout}
          variant="ghost"
          className="w-full justify-start gap-2 text-red-400 hover:text-red-300 hover:bg-slate-700"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </Button>
      </div>
    </div>
  )
}
