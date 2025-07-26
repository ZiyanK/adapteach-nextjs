interface User {
  id: string
  email: string
  full_name: string
  role: 'teacher' | 'student'
  is_active: boolean
  is_verified: boolean
  created_at: string
}

interface AuthResponse {
  access_token: string
  token_type: string
  user?: User
}

interface LoginData {
  email: string
  password: string
}

interface SignupData {
  email: string
  full_name: string
  password: string
  role: 'teacher' | 'student'
}

export class AuthService {
  private static getBackendUrl(): string {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL
    if (!backendUrl) {
      throw new Error("NEXT_PUBLIC_BACKEND_URL environment variable is not set")
    }
    return backendUrl
  }

  static async login(data: LoginData): Promise<AuthResponse> {
    const backendUrl = this.getBackendUrl()
    
    const response = await fetch(`${backendUrl}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.detail || errorData.message || `Login failed: ${response.status}`)
    }

    const authData = await response.json()
    
    // Validate the token before storing
    if (authData.access_token && this.validateToken(authData.access_token)) {
      // Store token in localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('access_token', authData.access_token)
      }
    } else {
      throw new Error('Invalid token received from server')
    }
    
    return authData
  }

  static async signup(data: SignupData): Promise<AuthResponse> {
    const backendUrl = this.getBackendUrl()
    
    const response = await fetch(`${backendUrl}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.detail || errorData.message || `Signup failed: ${response.status}`)
    }

    const authData = await response.json()
    
    // Validate the token before storing
    if (authData.access_token && this.validateToken(authData.access_token)) {
      // Store token in localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('access_token', authData.access_token)
      }
    } else {
      throw new Error('Invalid token received from server')
    }
    
    return authData
  }

  static logout(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token')
    }
  }

  static getToken(): string | null {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('access_token')
      if (token && this.validateToken(token)) {
        return token
      } else if (token) {
        // Invalid token, remove it
        this.logout()
      }
    }
    return null
  }

  static isAuthenticated(): boolean {
    return !!this.getToken()
  }

  static getAuthHeaders(): Record<string, string> {
    const token = this.getToken()
    
    if (!token) {
      return {}
    }

    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    }
  }

  static validateToken(token: string): boolean {
    try {
      // Basic JWT structure validation
      const parts = token.split('.')
      if (parts.length !== 3) {
        console.warn('Invalid JWT structure: token should have 3 parts')
        return false
      }
      
      // Decode the payload to check expiration
      const payload = JSON.parse(atob(parts[1]))
      const currentTime = Math.floor(Date.now() / 1000)
      
      if (payload.exp && payload.exp < currentTime) {
        console.warn('Token is expired')
        // Token is expired, remove it
        this.logout()
        return false
      }
      
      return true
    } catch (error) {
      console.error('Token validation error:', error)
      return false
    }
  }

  static debugToken(): void {
    if (typeof window === 'undefined') {
      console.log('Debug token: Not in browser environment')
      return
    }

    const token = localStorage.getItem('access_token')
    
    console.log('=== Token Debug Info ===')
    console.log('Token exists:', !!token)
    
    if (token) {
      console.log('Token length:', token.length)
      console.log('Token validation:', this.validateToken(token))
      
      try {
        const parts = token.split('.')
        if (parts.length === 3) {
          const payload = JSON.parse(atob(parts[1]))
          console.log('Token payload:', payload)
          console.log('Token expiration:', new Date(payload.exp * 1000))
          console.log('Current time:', new Date())
          console.log('Is expired:', payload.exp && payload.exp < Math.floor(Date.now() / 1000))
        }
      } catch (error) {
        console.error('Error parsing token:', error)
      }
    }
    
    console.log('Is authenticated:', this.isAuthenticated())
    console.log('=======================')
  }

  static async refreshToken(): Promise<boolean> {
    try {
      const token = this.getToken()
      if (!token) return false

      const backendUrl = this.getBackendUrl()
      const response = await fetch(`${backendUrl}/api/auth/refresh`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        const authData = await response.json()
        if (authData.access_token && this.validateToken(authData.access_token)) {
          if (typeof window !== 'undefined') {
            localStorage.setItem('access_token', authData.access_token)
          }
          return true
        }
      }
      
      return false
    } catch (error) {
      console.error('Error refreshing token:', error)
      return false
    }
  }

  static async testAuthFlow(): Promise<void> {
    console.log('=== Testing Authentication Flow ===')
    
    // Test 1: Check if backend URL is configured
    try {
      const backendUrl = this.getBackendUrl()
      console.log('✅ Backend URL configured:', backendUrl)
    } catch (error) {
      console.error('❌ Backend URL not configured:', error)
      return
    }
    
    // Test 2: Check current token state
    const token = this.getToken()
    console.log('Current token state:', !!token)
    
    if (token) {
      this.debugToken()
    }
    
    // Test 3: Test token validation
    if (token) {
      const isValid = this.validateToken(token)
      console.log('Token validation result:', isValid)
    }
    
    console.log('=== End Test ===')
  }
} 