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
      throw new Error(errorData.detail || `Login failed: ${response.status}`)
    }

    const authData = await response.json()
    
    // Store token in localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('access_token', authData.access_token)
      localStorage.setItem('token_type', authData.token_type)
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
      throw new Error(errorData.detail || `Signup failed: ${response.status}`)
    }

    const authData = await response.json()
    
    // Store token in localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('access_token', authData.access_token)
      localStorage.setItem('token_type', authData.token_type)
    }
    
    return authData
  }

  static logout(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token')
      localStorage.removeItem('token_type')
    }
  }

  static getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('access_token')
    }
    return null
  }

  static getTokenType(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token_type')
    }
    return null
  }

  static isAuthenticated(): boolean {
    return !!this.getToken()
  }

  static getAuthHeaders(): Record<string, string> {
    const token = this.getToken()
    const tokenType = this.getTokenType()
    
    if (!token) {
      return {}
    }

    return {
      // 'Authorization': `${tokenType || 'Bearer'} ${token}`,
      'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InVzZXIxQGV4YW1wbGUuY29tIiwiZXhwIjoxNzUzNTYwMzI1LCJpYXQiOjE3NTM1NTg1MjUsInJvbGUiOiJ0ZWFjaGVyIiwidXNlcl9pZCI6IjY4ODUyMWM5MWFhMDljZTViYmJlZDBhMiJ9.V7UScd-ZOrT0zZh6t6xRCXLv_OxPP5AKLird-7VBXkw',
      'Content-Type': 'application/json',
    }
  }
} 