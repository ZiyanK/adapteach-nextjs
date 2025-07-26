"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { AuthService } from './auth'

interface User {
  id: string
  email: string
  full_name: string
  role: 'teacher' | 'student'
  is_active: boolean
  is_verified: boolean
  created_at: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (data: { email: string; full_name: string; password: string; role: 'teacher' | 'student' }) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is already authenticated on app load
    // Only run this on the client side
    if (typeof window !== 'undefined') {
      const token = AuthService.getToken()
      if (token) {
        // You could decode the JWT token here to get user info
        // For now, we'll just set isAuthenticated to true
        setIsLoading(false)
      } else {
        setIsLoading(false)
      }
    } else {
      setIsLoading(false)
    }
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const response = await AuthService.login({ email, password })
      if (response.user) {
        setUser(response.user)
      }
    } catch (error) {
      throw error
    }
  }

  const signup = async (data: { email: string; full_name: string; password: string; role: 'teacher' | 'student' }) => {
    try {
      const response = await AuthService.signup(data)
      if (response.user) {
        setUser(response.user)
      }
    } catch (error) {
      throw error
    }
  }

  const logout = () => {
    AuthService.logout()
    setUser(null)
  }

  const value = {
    user,
    isAuthenticated: !!user || AuthService.isAuthenticated(),
    isLoading,
    login,
    signup,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 