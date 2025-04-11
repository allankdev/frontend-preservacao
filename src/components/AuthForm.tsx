"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Eye, EyeOff, Mail, Lock, Loader2, Github, ChromeIcon as Google } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/hooks/useAuth"

interface AuthFormProps {
  type: "login" | "register"
}

export function AuthForm({ type }: AuthFormProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<{ email?: string; password?: string; name?: string }>({})
  const { login, register, loading } = useAuth()

  const validateForm = () => {
    const newErrors: { email?: string; password?: string; name?: string } = {}
    let isValid = true

    if (!email) {
      newErrors.email = "E-mail é obrigatório"
      isValid = false
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "E-mail inválido"
      isValid = false
    }

    if (!password) {
      newErrors.password = "Senha é obrigatória"
      isValid = false
    } else if (password.length < 6) {
      newErrors.password = "A senha deve ter pelo menos 6 caracteres"
      isValid = false
    }

    if (type === "register" && !name) {
      newErrors.name = "Nome é obrigatório"
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    try {
      if (type === "login") {
        await login(email, password)
      } else {
        await register(email, password)
      }
    } catch (error) {
      console.error("Erro de autenticação:", error)
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">
          {type === "login" ? "Entrar na sua conta" : "Criar uma nova conta"}
        </CardTitle>
        <CardDescription className="text-center">
          {type === "login"
            ? "Digite suas credenciais abaixo para acessar sua conta"
            : "Preencha os campos abaixo para criar sua conta"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {type === "register" && (
            <div className="space-y-2">
              <Label htmlFor="name">Nome completo</Label>
              <Input
                id="name"
                placeholder="Seu nome completo"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="email"
                placeholder="seu@email.com"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`pl-10 ${errors.email ? "border-red-500" : ""}`}
              />
            </div>
            {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Senha</Label>
              {type === "login" && (
                <Link
                  href="/esqueci-senha"
                  className="text-sm text-muted-foreground underline-offset-4 hover:underline"
                >
                  Esqueceu a senha?
                </Link>
              )}
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="password"
                placeholder={type === "login" ? "Sua senha" : "Crie uma senha forte"}
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`pl-10 ${errors.password ? "border-red-500" : ""}`}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                <span className="sr-only">{showPassword ? "Esconder senha" : "Mostrar senha"}</span>
              </Button>
            </div>
            {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {type === "login" ? "Entrando..." : "Cadastrando..."}
              </>
            ) : type === "login" ? (
              "Entrar"
            ) : (
              "Cadastrar"
            )}
          </Button>
        </form>

        <div className="relative my-6">
        </div>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4">
        <div className="text-center text-sm">
          {type === "login" ? (
            <>
              Não tem uma conta?{" "}
              <Link href="/register" className="font-medium text-primary underline-offset-4 hover:underline">
                Cadastre-se
              </Link>
            </>
          ) : (
            <>
              Já tem uma conta?{" "}
              <Link href="/login" className="font-medium text-primary underline-offset-4 hover:underline">
                Faça login
              </Link>
            </>
          )}
        </div>
        <p className="text-xs text-center text-muted-foreground">
          Ao continuar, você concorda com nossos{" "}
          <Link href="/termos" className="underline underline-offset-4 hover:text-primary">
            Termos de Serviço
          </Link>{" "}
          e{" "}
          <Link href="/privacidade" className="underline underline-offset-4 hover:text-primary">
            Política de Privacidade
          </Link>
          .
        </p>
      </CardFooter>
    </Card>
  )
}
