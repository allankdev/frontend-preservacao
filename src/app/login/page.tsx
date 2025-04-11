import { AuthForm } from '@/components/AuthForm'

export default function LoginPage() {
  return (
    <div className="mt-20 space-y-4">
      <h1 className="text-2xl font-bold text-center">Login</h1>
      <AuthForm type="login" />
    </div>
  )
}
