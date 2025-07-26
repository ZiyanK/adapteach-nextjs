"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, FileText, CheckCircle, AlertCircle, ArrowLeft } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { AuthService } from "@/lib/auth"

interface UploadedFile {
  id: string
  name: string
  size: string
  uploadDate: string
  status: "processing" | "completed" | "error"
  class: string
  subject: string
}

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

export default function UploadPage() {
  const params = useParams()
  const classroomId = params.id as string
  const [classroom, setClassroom] = useState<Classroom | null>(null)
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null)
  const [selectedClass, setSelectedClass] = useState("")
  const [selectedSubject, setSelectedSubject] = useState("")
  const [isUploading, setIsUploading] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([
    {
      id: "1",
      name: "Science_Class10_NCERT.pdf",
      size: "15.2 MB",
      uploadDate: "2024-01-15",
      status: "completed",
      class: "10",
      subject: "Science",
    },
    {
      id: "2",
      name: "Mathematics_Class9_RD_Sharma.pdf",
      size: "22.8 MB",
      uploadDate: "2024-01-14",
      status: "completed",
      class: "9",
      subject: "Mathematics",
    },
    {
      id: "3",
      name: "English_Class8_Honeydew.pdf",
      size: "8.5 MB",
      uploadDate: "2024-01-13",
      status: "processing",
      class: "8",
      subject: "English",
    },
  ])

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
      
      // Pre-fill the form with classroom data
      if (currentClassroom) {
        setSelectedClass(currentClassroom.grade.toString())
        setSelectedSubject(currentClassroom.subject)
      }
    } catch (error) {
      console.error("Error fetching classroom:", error)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedFiles(e.target.files)
  }

  const handleUpload = async () => {
    if (!selectedFiles || !selectedClass || !selectedSubject) return

    setIsUploading(true)

    // Simulate upload process
    setTimeout(() => {
      const newFiles: UploadedFile[] = Array.from(selectedFiles).map((file, index) => ({
        id: Date.now().toString() + index,
        name: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        uploadDate: new Date().toISOString().split("T")[0],
        status: "processing" as const,
        class: selectedClass,
        subject: selectedSubject,
      }))

      setUploadedFiles((prev) => [...newFiles, ...prev])
      setSelectedFiles(null)
      setIsUploading(false)

      // Simulate processing completion
      setTimeout(() => {
        setUploadedFiles((prev) =>
          prev.map((file) =>
            newFiles.some((newFile) => newFile.id === file.id) ? { ...file, status: "completed" as const } : file,
          ),
        )
      }, 3000)
    }, 2000)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "processing":
        return <div className="h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-600" />
      default:
        return null
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>
      case "processing":
        return <Badge className="bg-blue-100 text-blue-800">Processing</Badge>
      case "error":
        return <Badge className="bg-red-100 text-red-800">Error</Badge>
      default:
        return null
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/dashboard/${classroomId}`} className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Dashboard</span>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Upload Textbooks</h1>
          {classroom && (
            <div className="flex items-center gap-2 mt-1">
              <p className="text-gray-600">Classroom: {classroom.name}</p>
              <Badge variant="secondary">Grade {classroom.grade}</Badge>
              <Badge variant="secondary">{classroom.subject}</Badge>
            </div>
          )}
          <p className="text-gray-600">Upload textbook files to generate curriculum and lesson plans</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5 text-blue-600" />
              Upload New Textbook
            </CardTitle>
            <CardDescription>Select textbook files and specify class and subject details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="class">Class</Label>
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger>
                  <SelectValue placeholder="Select class" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((classNum) => (
                    <SelectItem key={classNum} value={classNum.toString()}>
                      Class {classNum}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                <SelectTrigger>
                  <SelectValue placeholder="Select subject" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Mathematics">Mathematics</SelectItem>
                  <SelectItem value="Science">Science</SelectItem>
                  <SelectItem value="English">English</SelectItem>
                  <SelectItem value="Social Science">Social Science</SelectItem>
                  <SelectItem value="Hindi">Hindi</SelectItem>
                  <SelectItem value="Physics">Physics</SelectItem>
                  <SelectItem value="Chemistry">Chemistry</SelectItem>
                  <SelectItem value="Biology">Biology</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="files">Textbook Files</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <Input
                  id="files"
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <Label htmlFor="files" className="cursor-pointer">
                  <span className="text-sm text-gray-600">Click to upload or drag and drop</span>
                  <br />
                  <span className="text-xs text-gray-400">PDF, DOC, DOCX files up to 50MB each</span>
                </Label>
              </div>
              {selectedFiles && (
                <div className="mt-2 space-y-1">
                  {Array.from(selectedFiles).map((file, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                      <FileText className="h-4 w-4" />
                      <span>{file.name}</span>
                      <span className="text-gray-400">({(file.size / (1024 * 1024)).toFixed(1)} MB)</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Button
              onClick={handleUpload}
              disabled={!selectedFiles || !selectedClass || !selectedSubject || isUploading}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              {isUploading ? "Uploading..." : "Upload Textbooks"}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-green-600" />
              Uploaded Textbooks
            </CardTitle>
            <CardDescription>View and manage your uploaded textbook files</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {uploadedFiles.map((file) => (
                <div key={file.id} className="border rounded-lg p-4 space-y-2">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(file.status)}
                        <h4 className="font-medium text-sm">{file.name}</h4>
                      </div>
                      <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                        <span>{file.size}</span>
                        <span>Uploaded: {file.uploadDate}</span>
                      </div>
                    </div>
                    {getStatusBadge(file.status)}
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="outline" className="text-xs">
                      Class {file.class}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {file.subject}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 