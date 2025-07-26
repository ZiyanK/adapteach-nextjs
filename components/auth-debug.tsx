"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AuthService } from '@/lib/auth'
import { useAuth } from '@/lib/auth-context'

export function AuthDebug() {
  const [debugInfo, setDebugInfo] = useState<string>('')
  const { user, isAuthenticated, isLoading } = useAuth()

  const runDebug = () => {
    const info: string[] = []
    
    // Test auth service
    AuthService.testAuthFlow()
    
    // Get current state
    info.push('=== Auth Context State ===')
    info.push(`Loading: ${isLoading}`)
    info.push(`Authenticated: ${isAuthenticated}`)
    info.push(`User: ${user ? JSON.stringify(user, null, 2) : 'null'}`)
    
    // Get localStorage info
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('access_token')
      info.push('\n=== LocalStorage ===')
      info.push(`Token exists: ${!!token}`)
      if (token) {
        info.push(`Token length: ${token.length}`)
        info.push(`Token validation: ${AuthService.validateToken(token)}`)
      }
    }
    
    setDebugInfo(info.join('\n'))
  }

  const clearTokens = () => {
    AuthService.logout()
    setDebugInfo('Tokens cleared')
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Authentication Debug</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Button onClick={runDebug} variant="outline">
            Run Debug
          </Button>
          <Button onClick={clearTokens} variant="destructive">
            Clear Tokens
          </Button>
        </div>
        
        {debugInfo && (
          <div className="bg-gray-100 p-4 rounded-md">
            <pre className="text-sm whitespace-pre-wrap">{debugInfo}</pre>
          </div>
        )}
      </CardContent>
    </Card>
  )
} 