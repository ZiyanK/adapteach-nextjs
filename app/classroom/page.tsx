"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Loader2, Users, BookOpen, GraduationCap, Plus } from "lucide-react"
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
  const [creatingClassroom, setCreatingClassroom] = useState(false)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [newClassroom, setNewClassroom] = useState({
    name: '',
    description: '',
    subject: '',
    grade: 10
  })
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

  const handleCreateClassroom = async () => {
    setCreatingClassroom(true)
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL
      if (!backendUrl) {
        throw new Error("NEXT_PUBLIC_BACKEND_URL environment variable is not set")
      }

      const response = await fetch(`${backendUrl}/api/teacher/classrooms`, {
        method: 'POST',
        headers: AuthService.getAuthHeaders(),
        body: JSON.stringify(newClassroom),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.detail || errorData.message || `Failed to create classroom: ${response.status}`)
      }

      const createdClassroom = await response.json()
      
      // Add the new classroom to the list
      setClassrooms(prev => [...prev, createdClassroom])
      
      // Reset form and close dialog
      setNewClassroom({
        name: '',
        description: '',
        subject: '',
        grade: 10
      })
      setCreateDialogOpen(false)
      
      // Optionally navigate to the new classroom
      router.push(`/dashboard/${createdClassroom.id}`)
      
    } catch (error) {
      console.error("Error creating classroom:", error)
      setError(error instanceof Error ? error.message : "Failed to create classroom")
    } finally {
      setCreatingClassroom(false)
    }
  }

  const handleInputChange = (field: string, value: string | number) => {
    setNewClassroom(prev => ({
      ...prev,
      [field]: value
    }))
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

        {/* Create Classroom Button */}
        <div className="flex justify-center mb-8">
          <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-green-600 hover:bg-green-700 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Create New Classroom
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Create New Classroom</DialogTitle>
                <DialogDescription>
                  Fill in the details to create a new classroom for your students.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Classroom Name</Label>
                  <Input
                    id="name"
                    value={newClassroom.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="e.g., 1A, Physics 101"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newClassroom.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Brief description of the classroom"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Select value={newClassroom.subject} onValueChange={(value) => handleInputChange('subject', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a subject" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Physics">Physics</SelectItem>
                      <SelectItem value="Chemistry">Chemistry</SelectItem>
                      <SelectItem value="Biology">Biology</SelectItem>
                      <SelectItem value="Mathematics">Mathematics</SelectItem>
                      <SelectItem value="English">English</SelectItem>
                      <SelectItem value="History">History</SelectItem>
                      <SelectItem value="Geography">Geography</SelectItem>
                      <SelectItem value="Computer Science">Computer Science</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="grade">Grade Level</Label>
                  <Select value={newClassroom.grade.toString()} onValueChange={(value) => handleInputChange('grade', parseInt(value))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select grade level" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 12 }, (_, i) => i + 1).map(grade => (
                        <SelectItem key={grade} value={grade.toString()}>
                          Grade {grade}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleCreateClassroom}
                  disabled={creatingClassroom || !newClassroom.name || !newClassroom.subject}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {creatingClassroom ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    'Create Classroom'
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
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