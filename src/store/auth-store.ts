import { create } from 'zustand'
import Cookies from 'js-cookie'
import { useRouter } from 'next/navigation'

interface AuthState {
  logout: () => void
}

export const useAuthStore = create<AuthState>(() => ({
  logout: () => {
    Cookies.remove('token')
    window.location.href = '/login' // redirect instantâneo
  },
}))
