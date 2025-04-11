"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/useAuth"

export function Navbar() {
  const pathname = usePathname()
  const { user, logout } = useAuth()

  const isAuthPage = pathname === "/login" || pathname === "/register"

  if (isAuthPage) return null

  return (
    <header className="w-full border-b bg-white dark:bg-zinc-900">
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link href={user ? "/dashboard" : "/"} className="font-bold text-lg">
          Preservação Digital
        </Link>

        <div className="flex gap-2">
          {user ? (
            <>
              <Link href="/upload">
                <Button variant="outline">Novo Documento</Button>
              </Link>
              <Button onClick={logout} variant="destructive">
                Sair
              </Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="default">Entrar</Button>
              </Link>
              <Link href="/register">
                <Button variant="outline">Cadastrar</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
