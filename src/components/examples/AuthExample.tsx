'use client'

/**
 * Example Component: Authentication Flow
 * Demonstrates authentication with React Query hooks
 */

import { useState } from 'react'
import { useLogin, useLogout, useRegister, useCurrentUser } from '@/hooks'

export function AuthExample() {
  const [email, setEmail] = useState('admin@example.com')
  const [password, setPassword] = useState('password')
  const [name, setName] = useState('')

  const login = useLogin()
  const logout = useLogout()
  const register = useRegister()
  const { data: currentUser, isLoading } = useCurrentUser()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await login.mutateAsync({ email, password })
    } catch (error: any) {
      alert(`Login failed: ${error.message}`)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await register.mutateAsync({
        email,
        password,
        firstName: name.split(' ')[0],
        lastName: name.split(' ')[1] || '',
      })
    } catch (error: any) {
      alert(`Registration failed: ${error.message}`)
    }
  }

  const handleLogout = async () => {
    try {
      await logout.mutateAsync()
    } catch (error: any) {
      alert(`Logout failed: ${error.message}`)
    }
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div style={{ maxWidth: '400px', margin: '2rem auto' }}>
      {currentUser ? (
        <div>
          <h2>Welcome back!</h2>
          <p>
            <strong>Email:</strong> {currentUser.user.email}
          </p>
          {currentUser.user.name && (
            <p>
              <strong>Name:</strong> {currentUser.user.name}
            </p>
          )}
          {currentUser.user.roles && (
            <p>
              <strong>Roles:</strong> {currentUser.user.roles.join(', ')}
            </p>
          )}
          <button onClick={handleLogout} disabled={logout.isPending}>
            {logout.isPending ? 'Logging out...' : 'Logout'}
          </button>
        </div>
      ) : (
        <div>
          {/* Login Form */}
          <form onSubmit={handleLogin} style={{ marginBottom: '2rem' }}>
            <h2>Login</h2>
            <div style={{ marginBottom: '1rem' }}>
              <label>
                Email:
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ display: 'block', width: '100%', marginTop: '0.25rem' }}
                  required
                />
              </label>
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label>
                Password:
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ display: 'block', width: '100%', marginTop: '0.25rem' }}
                  required
                />
              </label>
            </div>
            <button type="submit" disabled={login.isPending}>
              {login.isPending ? 'Logging in...' : 'Login'}
            </button>
            {login.error && (
              <div style={{ color: 'red', marginTop: '0.5rem' }}>{login.error.message}</div>
            )}
          </form>

          {/* Register Form */}
          <form onSubmit={handleRegister}>
            <h2>Register</h2>
            <div style={{ marginBottom: '1rem' }}>
              <label>
                Name:
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{ display: 'block', width: '100%', marginTop: '0.25rem' }}
                  required
                />
              </label>
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label>
                Email:
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ display: 'block', width: '100%', marginTop: '0.25rem' }}
                  required
                />
              </label>
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label>
                Password:
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ display: 'block', width: '100%', marginTop: '0.25rem' }}
                  required
                />
              </label>
            </div>
            <button type="submit" disabled={register.isPending}>
              {register.isPending ? 'Registering...' : 'Register'}
            </button>
            {register.error && (
              <div style={{ color: 'red', marginTop: '0.5rem' }}>{register.error.message}</div>
            )}
          </form>
        </div>
      )}
    </div>
  )
}
