'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function AuthLoginPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const supabase = createClient()

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) {
        setError(error.message)
      } else {
        setMessage('Check your email for the magic link!')
      }
    } catch (error) {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#030014] via-[#1A1A2E] to-[#2A0E61] p-4">
      <Card className="w-full max-w-md bg-[#1A1A2E] border-[#2A0E61]">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-white">
            KDR Tech Admin
          </CardTitle>
          <CardDescription className="text-gray-400">
            Sign in with magic link
          </CardDescription>
        </CardHeader>
        <CardContent>
          {message && (
            <div className="mb-4 p-4 bg-green-900/20 border border-green-500 rounded-lg text-green-400 text-sm">
              {message}
            </div>
          )}

          {error && (
            <div className="mb-4 p-4 bg-red-900/20 border border-red-500 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleMagicLink} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-white">
                Email Address
              </label>
              <Input
                id="email"
                type="email"
                placeholder="admin@kdrtech.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                className="bg-[#030014] border-[#2A0E61] text-white"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600"
            >
              {loading ? 'Sending...' : 'Send Magic Link'}
            </Button>
          </form>

          <div className="mt-6 p-4 bg-[#030014] border border-[#2A0E61] rounded-lg">
            <p className="text-xs text-gray-400 mb-2">
              <strong className="text-white">How it works:</strong>
            </p>
            <ol className="text-xs text-gray-400 space-y-1 list-decimal list-inside">
              <li>Enter your admin email address</li>
              <li>Click &quot;Send Magic Link&quot;</li>
              <li>Check your email inbox</li>
              <li>Click the link in the email to sign in</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
