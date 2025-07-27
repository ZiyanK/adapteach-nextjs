"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Users, TrendingUp, Clock, BookOpen, Loader2, RefreshCw } from "lucide-react"
import { AuthService } from "@/lib/auth"

interface Student {
  id: string
  name: string
  email: string
  performance?: string
  lastActive?: string
  completedLessons?: number
  totalLessons?: number
  avatar?: string
}

const getPerformanceBadgeColor = (performance: string) => {
  switch (performance) {
    case "Excellent":
      return "bg-green-100 text-green-800"
    case "Good":
      return "bg-blue-100 text-blue-800"
    case "Average":
      return "bg-yellow-100 text-yellow-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

const getProgressPercentage = (completed: number, total: number) => {
  return Math.round((completed / total) * 100)
}

export default function StudentsPage() {
  const params = useParams()
  const classroomId = params.id as string
  
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (classroomId) {
      fetchStudents()
    }
  }, [classroomId])

  const fetchStudents = async () => {
    setLoading(true)
    setError(null)
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL
      if (!backendUrl) {
        throw new Error("NEXT_PUBLIC_BACKEND_URL environment variable is not set")
      }

      const response = await fetch(`${backendUrl}/api/teacher/classrooms/${classroomId}/students`, {
        headers: AuthService.getAuthHeaders(),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      console.log('Students data:', data)
      
      // Transform the API response to match our interface
      const transformedStudents: Student[] = data.map((student: any) => ({
        id: student.id || student.student_id || '',
        name: student.name || student.full_name || `${student.first_name || ''} ${student.last_name || ''}`.trim() || 'Unknown Student',
        email: student.email || '',
        performance: student.performance || 'Average',
        lastActive: student.last_active || student.lastActive || 'Unknown',
        completedLessons: student.completed_lessons || student.completedLessons || 0,
        totalLessons: student.total_lessons || student.totalLessons || 0,
        avatar: student.avatar || "/placeholder.svg?height=40&width=40",
      }))

      setStudents(transformedStudents)
    } catch (error) {
      console.error("Error fetching students:", error)
      setError("Failed to load students. Please try again.")
    } finally {
      setLoading(false)
    }
  }
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading students...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={fetchStudents} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Students</h1>
          <p className="text-gray-600">Monitor your students' progress and performance</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Users className="h-4 w-4" />
            <span>{students.length} Students</span>
          </div>
          <Button onClick={fetchStudents} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {students.map((student) => (
          <Card key={student.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={student.avatar || "/placeholder.svg"} alt={student.name} />
                  <AvatarFallback className="bg-blue-100 text-blue-600">
                    {student.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <CardTitle className="text-lg">{student.name}</CardTitle>
                  <CardDescription className="text-sm">{student.email}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">Performance</span>
                <Badge className={getPerformanceBadgeColor(student.performance || 'Average')}>{student.performance || 'Average'}</Badge>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Progress</span>
                  <span className="font-medium">
                    {student.completedLessons || 0}/{student.totalLessons || 0} lessons
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${getProgressPercentage(student.completedLessons || 0, student.totalLessons || 1)}%` }}
                  />
                </div>
                <div className="text-xs text-gray-500 text-right">
                  {getProgressPercentage(student.completedLessons || 0, student.totalLessons || 1)}% complete
                </div>
              </div>

              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>{student.lastActive || 'Unknown'}</span>
                </div>
                <div className="flex items-center gap-1">
                  <BookOpen className="h-3 w-3" />
                  <span>{student.completedLessons || 0} done</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            Class Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{students.length}</div>
              <div className="text-sm text-gray-600">Total Students</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {students.filter((s) => s.performance === "Excellent").length}
              </div>
              <div className="text-sm text-gray-600">Excellent Performance</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">
                {students.length > 0 ? Math.round(
                  students.reduce((acc, s) => acc + getProgressPercentage(s.completedLessons || 0, s.totalLessons || 1), 0) /
                    students.length,
                ) : 0}%
              </div>
              <div className="text-sm text-gray-600">Average Progress</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {students.filter((s) => (s.lastActive || '').includes("hour") || (s.lastActive || '').includes("minute")).length}
              </div>
              <div className="text-sm text-gray-600">Active Today</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
