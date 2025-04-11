// lib/api.ts
import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:3000', // ou seu backend em produção
  withCredentials: true, // 🔒 garante que cookies como "token" vão junto nas requests
})

export default api
