"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Cookies from "js-cookie"
import api from "@/lib/api"

export function useAuth() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  async function fetchUser() {
    try {
      const res = await api.get("/auth/me")
      setUser(res.data)
    } catch {
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchUser()

    // ✅ Escuta mudanças no cookie de token
    const interval = setInterval(() => {
      const token = Cookies.get("token")
      if (!token && user) {
        setUser(null)
      }
      if (token && !user) {
        fetchUser()
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [user])

  async function login(email: string, password: string) {
    const res = await api.post("/auth/login", { email, password })
    Cookies.set("token", res.data.token)
    await fetchUser()
    router.push("/dashboard")
  }

  async function register(email: string, password: string) {
    const res = await api.post("/auth/register", { email, password })
    Cookies.set("token", res.data.token)
    await fetchUser()
    router.push("/dashboard")
  }

  function logout() {
    Cookies.remove("token")
    setUser(null)
    router.push("/login")
  }

  return { user, isLoading, login, register, logout }
}
