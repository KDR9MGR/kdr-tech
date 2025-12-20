'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function LoginTestPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    console.log('Attempting login with:', email)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        setError(error.message)
        console.error('Login error:', error)
      } else if (data.user) {
        console.log('Login successful:', data.user)
        router.push('/admin')
        router.refresh()
      }
    } catch (error) {
      setError('An unexpected error occurred')
      console.error('Unexpected error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(to bottom right, #030014, #1A1A2E, #2A0E61)',
      padding: '20px'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '400px',
        backgroundColor: '#1A1A2E',
        border: '1px solid #2A0E61',
        borderRadius: '8px',
        padding: '32px'
      }}>
        <h1 style={{ color: 'white', fontSize: '24px', fontWeight: 'bold', marginBottom: '8px' }}>
          KDR Tech Admin - Test Login
        </h1>
        <p style={{ color: '#9CA3AF', marginBottom: '24px' }}>
          Simple test version to debug input issues
        </p>

        {error && (
          <div style={{
            backgroundColor: '#7F1D1D',
            color: '#FCA5A5',
            padding: '12px',
            borderRadius: '4px',
            marginBottom: '16px'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '16px' }}>
            <label htmlFor="email" style={{ display: 'block', color: 'white', marginBottom: '8px' }}>
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="admin@kdrtech.com"
              value={email}
              onChange={(e) => {
                console.log('Email changed:', e.target.value)
                setEmail(e.target.value)
              }}
              onFocus={() => console.log('Email input focused')}
              required
              autoComplete="email"
              style={{
                width: '100%',
                height: '40px',
                padding: '8px 12px',
                backgroundColor: '#030014',
                border: '1px solid #2A0E61',
                borderRadius: '4px',
                color: 'white',
                fontSize: '14px',
                outline: 'none',
                pointerEvents: 'auto',
                cursor: 'text'
              }}
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label htmlFor="password" style={{ display: 'block', color: 'white', marginBottom: '8px' }}>
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => {
                console.log('Password changed:', e.target.value.replace(/./g, '*'))
                setPassword(e.target.value)
              }}
              onFocus={() => console.log('Password input focused')}
              required
              autoComplete="current-password"
              style={{
                width: '100%',
                height: '40px',
                padding: '8px 12px',
                backgroundColor: '#030014',
                border: '1px solid #2A0E61',
                borderRadius: '4px',
                color: 'white',
                fontSize: '14px',
                outline: 'none',
                pointerEvents: 'auto',
                cursor: 'text'
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              height: '40px',
              background: 'linear-gradient(to right, #A855F7, #06B6D4)',
              color: 'white',
              fontWeight: '600',
              border: 'none',
              borderRadius: '4px',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div style={{ marginTop: '16px', fontSize: '12px', color: '#6B7280' }}>
          <p>State debug:</p>
          <p>Email: {email || '(empty)'}</p>
          <p>Password: {password ? '***' : '(empty)'}</p>
        </div>
      </div>
    </div>
  )
}
