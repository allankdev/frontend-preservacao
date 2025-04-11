import { AuthForm } from '@/components/AuthForm'

export default function RegisterPage() {
  return (
    <div className="mt-20 space-y-4">
      <h1 className="text-2xl font-bold text-center">Cadastro</h1>
      <AuthForm type="register" />
    </div>
  )
}
