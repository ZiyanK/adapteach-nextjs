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

  // Function to decode JWT token and extract user info
  const decodeToken = (token: string): User | null => {
    try {
      const parts = token.split('.')
      if (parts.length !== 3) return null
      
      const payload = JSON.parse(atob(parts[1]))
      
      // Check if payload contains user information
      if (payload.user_id && payload.email && payload.role) {
        return {
          id: payload.user_id,
          email: payload.email,
          full_name: payload.full_name || payload.name || '',
          role: payload.role,
          is_active: payload.is_active !== false,
          is_verified: payload.is_verified !== false,
          created_at: payload.created_at || new Date().toISOString(),
        }
      }
      
      return null
    } catch (error) {
      console.error('Error decoding token:', error)
      return null
    }
  }

  // Function to fetch user data from backend
  const fetchUserData = async (token: string): Promise<User | null> => {
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL
      if (!backendUrl) {
        throw new Error("NEXT_PUBLIC_BACKEND_URL environment variable is not set")
      }

      const response = await fetch(`${backendUrl}/api/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        const userData = await response.json()
        return userData
      }
      
      return null
    } catch (error) {
      console.error('Error fetching user data:', error)
      return null
    }
  }

  useEffect(() => {
    // Check if user is already authenticated on app load
    // Only run this on the client side
    if (typeof window !== 'undefined') {
      const token = AuthService.getToken()
      if (token) {
        // Try to get user data from token first
        let userFromToken = decodeToken(token)
        
        if (userFromToken) {
          setUser(userFromToken)
          setIsLoading(false)
        } else {
          // If token doesn't contain user data, try to fetch from backend
          fetchUserData(token).then((userData) => {
            if (userData) {
              setUser(userData)
            } else {
              // If we can't get user data, the token might be invalid
              AuthService.logout()
            }
            setIsLoading(false)
          }).catch(() => {
            setIsLoading(false)
          })
        }
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
      
      // Set user from response or decode from token
      if (response.user) {
        setUser(response.user)
      } else if (response.access_token) {
        const userFromToken = decodeToken(response.access_token)
        if (userFromToken) {
          setUser(userFromToken)
        } else {
          throw new Error('Unable to extract user information from token')
        }
      } else {
        throw new Error('No user data received from login')
      }
    } catch (error) {
      throw error
    }
  }

  const signup = async (data: { email: string; full_name: string; password: string; role: 'teacher' | 'student' }) => {
    try {
      const response = await AuthService.signup(data)
      
      // Set user from response or decode from token
      if (response.user) {
        setUser(response.user)
      } else if (response.access_token) {
        const userFromToken = decodeToken(response.access_token)
        if (userFromToken) {
          setUser(userFromToken)
        } else {
          throw new Error('Unable to extract user information from token')
        }
      } else {
        throw new Error('No user data received from signup')
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