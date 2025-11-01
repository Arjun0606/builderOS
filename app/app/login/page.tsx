import { Metadata } from 'next'
import { LoginForm } from '@/components/auth/login-form'

export const metadata: Metadata = {
  title: 'Login | LegalOS',
  description: 'Login to your LegalOS account',
}

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900">
            ⚖️ LegalOS
          </h1>
          <p className="mt-2 text-slate-600">
            The secure ChatGPT for Indian law firms
          </p>
        </div>

        <div className="rounded-lg bg-white p-8 shadow-lg">
          <LoginForm />
        </div>

        <p className="mt-6 text-center text-sm text-slate-600">
          By continuing, you agree to our{' '}
          <a href="/terms" className="font-medium text-blue-600 hover:text-blue-500">
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="/privacy" className="font-medium text-blue-600 hover:text-blue-500">
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  )
}

