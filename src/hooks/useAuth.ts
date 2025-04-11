'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import api from '@/lib/api'

export function useAuth() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState<any>(null)

  async function fetchUser() {
    const token = Cookies.get('token')
    if (!token) {
      setUser(null)
      return
    }

    try {
      const res = await api.get('/auth/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      setUser(res.data)
    } catch (err) {
      setUser(null)
    }
  }

  useEffect(() => {
    fetchUser()
  }, [])

  async function login(email: string, password: string) {
    setLoading(true)
    try {
      const res = await api.post('/auth/login', { email, password })
      Cookies.set('token', res.data.token)
      await fetchUser()
      router.push('/dashboard')
    } catch (err) {
      console.error('Login failed', err)
    } finally {
      setLoading(false)
    }
  }

  async function register(email: string, password: string) {
    setLoading(true)
    try {
      const res = await api.post('/auth/register', { email, password })
      Cookies.set('token', res.data.token)
      await fetchUser()
      router.push('/dashboard')
    } catch (err) {
      console.error('Registration failed', err)
    } finally {
      setLoading(false)
    }
  }

  function logout() {
    Cookies.remove('token')
    setUser(null)
    router.push('/login')
  }

  return { user, login, register, logout, loading }
}
