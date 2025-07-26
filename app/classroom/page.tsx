"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, Users, BookOpen, GraduationCap } from "lucide-react"
import { AuthService } from "@/lib/auth"

interface Classroom {
  id: string
  name: string
  description: string
  teacher_id: string
  students: string[]
  subject: string
  grade: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export default function ClassroomSelectionPage() {
  const [classrooms, setClassrooms] = useState<Classroom[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    fetchClassrooms()
  }, [])

  const fetchClassrooms = async () => {
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL
      if (!backendUrl) {
        throw new Error("NEXT_PUBLIC_BACKEND_URL environment variable is not set")
      }

      const response = await fetch(`${backendUrl}/api/teacher/classrooms`, {
        headers: AuthService.getAuthHeaders(),
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      setClassrooms(data)
    } catch (error) {
      console.error("Error fetching classrooms:", error)
      setError("Failed to load classrooms. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleClassroomSelect = (classroomId: string) => {
    router.push(`/dashboard/${classroomId}`)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading classrooms...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={fetchClassrooms} variant="outline">
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Select Your Classroom</h1>
          <p className="text-gray-600">Choose a classroom to access your dashboard</p>
        </div>

        {classrooms.length === 0 ? (
          <Card className="max-w-md mx-auto">
            <CardContent className="text-center py-8">
              <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Classrooms Found</h3>
              <p className="text-gray-600 mb-4">
                You don't have any classrooms yet. Contact your administrator to get started.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {classrooms.map((classroom) => (
              <Card 
                key={classroom.id} 
                className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-blue-300"
                onClick={() => handleClassroomSelect(classroom.id)}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{classroom.name}</CardTitle>
                    <Badge variant={classroom.is_active ? "default" : "secondary"}>
                      {classroom.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  <CardDescription className="text-sm">
                    {classroom.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <GraduationCap className="h-4 w-4" />
                      <span>Grade {classroom.grade}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <BookOpen className="h-4 w-4" />
                      <span>{classroom.subject}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Users className="h-4 w-4" />
                      <span>{classroom.students.length} students</span>
                    </div>
                  </div>
                  <Button 
                    className="w-full mt-4 bg-blue-600 hover:bg-blue-700"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleClassroomSelect(classroom.id)
                    }}
                  >
                    Select Classroom
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
} 