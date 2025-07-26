"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Users, TrendingUp, Clock, BookOpen, ArrowLeft } from "lucide-react"
import Link from "next/link"
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

const students = [
  {
    id: 1,
    name: "Aarav Sharma",
    email: "aarav.sharma@email.com",
    performance: "Excellent",
    lastActive: "2 hours ago",
    completedLessons: 15,
    totalLessons: 18,
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 2,
    name: "Priya Patel",
    email: "priya.patel@email.com",
    performance: "Good",
    lastActive: "1 day ago",
    completedLessons: 12,
    totalLessons: 18,
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 3,
    name: "Arjun Kumar",
    email: "arjun.kumar@email.com",
    performance: "Average",
    lastActive: "3 hours ago",
    completedLessons: 10,
    totalLessons: 18,
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 4,
    name: "Ananya Singh",
    email: "ananya.singh@email.com",
    performance: "Excellent",
    lastActive: "30 minutes ago",
    completedLessons: 16,
    totalLessons: 18,
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 5,
    name: "Rohan Gupta",
    email: "rohan.gupta@email.com",
    performance: "Good",
    lastActive: "5 hours ago",
    completedLessons: 13,
    totalLessons: 18,
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 6,
    name: "Kavya Reddy",
    email: "kavya.reddy@email.com",
    performance: "Average",
    lastActive: "1 day ago",
    completedLessons: 9,
    totalLessons: 18,
    avatar: "/placeholder.svg?height=40&width=40",
  },
]

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
  const [classroom, setClassroom] = useState<Classroom | null>(null)

  useEffect(() => {
    fetchClassroom()
  }, [classroomId])

  const fetchClassroom = async () => {
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
      
      const classrooms = await response.json()
      const currentClassroom = classrooms.find((c: Classroom) => c.id === classroomId)
      setClassroom(currentClassroom)
    } catch (error) {
      console.error("Error fetching classroom:", error)
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href={`/dashboard/${classroomId}`} className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Dashboard</span>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Students</h1>
            {classroom && (
              <div className="flex items-center gap-2 mt-1">
                <p className="text-gray-600">Classroom: {classroom.name}</p>
                <Badge variant="secondary">Grade {classroom.grade}</Badge>
                <Badge variant="secondary">{classroom.subject}</Badge>
              </div>
            )}
            <p className="text-gray-600">Monitor your students' progress and performance</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Users className="h-4 w-4" />
          <span>{students.length} Students</span>
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
                <Badge className={getPerformanceBadgeColor(student.performance)}>{student.performance}</Badge>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Progress</span>
                  <span className="font-medium">
                    {student.completedLessons}/{student.totalLessons} lessons
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${getProgressPercentage(student.completedLessons, student.totalLessons)}%` }}
                  />
                </div>
                <div className="text-xs text-gray-500 text-right">
                  {getProgressPercentage(student.completedLessons, student.totalLessons)}% complete
                </div>
              </div>

              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>{student.lastActive}</span>
                </div>
                <div className="flex items-center gap-1">
                  <BookOpen className="h-3 w-3" />
                  <span>{student.completedLessons} done</span>
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
                {Math.round(
                  students.reduce((acc, s) => acc + getProgressPercentage(s.completedLessons, s.totalLessons), 0) /
                    students.length,
                )}
                %
              </div>
              <div className="text-sm text-gray-600">Average Progress</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {students.filter((s) => s.lastActive.includes("hour") || s.lastActive.includes("minute")).length}
              </div>
              <div className="text-sm text-gray-600">Active Today</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 