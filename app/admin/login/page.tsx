'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
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

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        setError(error.message)
      } else if (data.user) {
        router.push('/admin')
        router.refresh()
      }
    } catch (error) {
      setError('An unexpected error occurred')
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
      background: 'linear-gradient(135deg, #030014 0%, #1A1A2E 50%, #2A0E61 100%)',
      padding: '20px',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '420px',
        backgroundColor: '#1A1A2E',
        border: '1px solid #2A0E61',
        borderRadius: '12px',
        padding: '40px',
        boxShadow: '0 10px 40px rgba(0,0,0,0.3)'
      }}>
        <h1 style={{
          color: 'white',
          fontSize: '28px',
          fontWeight: 'bold',
          marginBottom: '8px',
          textAlign: 'center'
        }}>
          KDR Tech Admin
        </h1>
        <p style={{
          color: '#9CA3AF',
          marginBottom: '32px',
          textAlign: 'center',
          fontSize: '14px'
        }}>
          Enter your credentials to access the dashboard
        </p>

        {error && (
          <div style={{
            backgroundColor: '#7F1D1D',
            color: '#FCA5A5',
            padding: '12px',
            borderRadius: '6px',
            marginBottom: '20px',
            fontSize: '14px'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '20px' }}>
            <label
              htmlFor="email"
              style={{
                display: 'block',
                color: 'white',
                marginBottom: '8px',
                fontSize: '14px',
                fontWeight: '500'
              }}
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              placeholder="admin@kdrtech.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onInput={(e) => console.log('Email input:', e.currentTarget.value)}
              onClick={() => console.log('Email clicked')}
              onFocus={() => console.log('Email focused')}
              required
              autoComplete="email"
              disabled={loading}
              style={{
                width: '100%',
                height: '44px',
                padding: '10px 14px',
                backgroundColor: '#030014',
                border: '2px solid #2A0E61',
                borderRadius: '6px',
                color: 'white',
                fontSize: '15px',
                outline: 'none',
                transition: 'border-color 0.2s',
                cursor: loading ? 'not-allowed' : 'text',
                opacity: loading ? 0.6 : 1
              }}
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label
              htmlFor="password"
              style={{
                display: 'block',
                color: 'white',
                marginBottom: '8px',
                fontSize: '14px',
                fontWeight: '500'
              }}
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onInput={(e) => console.log('Password input:', e.currentTarget.value.length + ' chars')}
              onClick={() => console.log('Password clicked')}
              onFocus={() => console.log('Password focused')}
              required
              autoComplete="current-password"
              disabled={loading}
              style={{
                width: '100%',
                height: '44px',
                padding: '10px 14px',
                backgroundColor: '#030014',
                border: '2px solid #2A0E61',
                borderRadius: '6px',
                color: 'white',
                fontSize: '15px',
                outline: 'none',
                transition: 'border-color 0.2s',
                cursor: loading ? 'not-allowed' : 'text',
                opacity: loading ? 0.6 : 1
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              height: '44px',
              background: 'linear-gradient(135deg, #A855F7 0%, #06B6D4 100%)',
              color: 'white',
              fontWeight: '600',
              fontSize: '15px',
              border: 'none',
              borderRadius: '6px',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              transition: 'opacity 0.2s'
            }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div style={{
          marginTop: '20px',
          padding: '12px',
          backgroundColor: '#030014',
          borderRadius: '6px',
          fontSize: '12px',
          color: '#6B7280',
          fontFamily: 'monospace'
        }}>
          <div style={{ marginBottom: '4px' }}>Debug Info:</div>
          <div>Email: {email || '(empty)'}</div>
          <div>Password: {password ? '•'.repeat(password.length) : '(empty)'}</div>
          <div>Loading: {loading ? 'Yes' : 'No'}</div>
        </div>

        <div style={{
          marginTop: '20px',
          padding: '12px',
          backgroundColor: '#1E3A8A',
          borderRadius: '6px',
          fontSize: '12px',
          color: '#BFDBFE'
        }}>
          <strong>Instructions:</strong> Open browser console (F12) and try clicking/typing in the fields above. You should see console logs.
        </div>
      </div>
    </div>
  )
}
