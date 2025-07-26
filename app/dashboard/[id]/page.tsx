"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Loader2, BookOpen, CheckCircle, ArrowLeft } from "lucide-react"
import { AuthService } from "@/lib/auth"
import Link from "next/link"

interface Section {
  id: string
  title: string
  selected: boolean
}

interface Chapter {
  chapter_number: number
  title: string
  sections: string[]
  selected: boolean
  sectionStates: Section[]
}

interface Curriculum {
  id: string
  class: number
  subject: string
  medium: string
  chapters: Chapter[]
  teacher_id: string
  is_active: boolean
  created_at: string
  updated_at: string
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

export default function WeeklyPlannerPage() {
  const params = useParams()
  const classroomId = params.id as string
  
  const [curriculum, setCurriculum] = useState<Curriculum | null>(null)
  const [allCurricula, setAllCurricula] = useState<Curriculum[]>([])
  const [selectedCurriculumId, setSelectedCurriculumId] = useState<string>("")
  const [classroom, setClassroom] = useState<Classroom | null>(null)
  const [loading, setLoading] = useState(true)
  const [generatingPlan, setGeneratingPlan] = useState(false)
  const [weeklyPlan, setWeeklyPlan] = useState<string[] | null>(null)

  useEffect(() => {
    if (classroomId) {
      fetchClassroom()
      fetchCurriculum()
    }
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

  const fetchCurriculum = async () => {
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL
      if (!backendUrl) {
        throw new Error("NEXT_PUBLIC_BACKEND_URL environment variable is not set")
      }

      const response = await fetch(`${backendUrl}/api/teacher/textbooks`, {
        headers: AuthService.getAuthHeaders(),
      })
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()

      console.log(data)

      // Handle array response
      const curricula = Array.isArray(data) ? data : [data]

      if (curricula.length === 0) {
        throw new Error("No curriculum data found")
      }

      setAllCurricula(curricula)

      // Select the first curriculum by default
      const firstCurriculum = curricula[0]
      setSelectedCurriculumId(firstCurriculum.id)

      // Transform data to include selection states
      const transformedData = {
        ...firstCurriculum,
        chapters: firstCurriculum.chapters.map((chapter: any) => ({
          ...chapter,
          selected: false,
          sectionStates: chapter.sections.map((section: string, index: number) => ({
            id: `${chapter.chapter_number}-${index}`,
            title: section,
            selected: false,
          })),
        })),
      }

      console.log("transformedData", transformedData)

      setCurriculum(transformedData)
    } catch (error) {
      console.error("Error fetching curriculum:", error)
    } finally {
      setLoading(false)
    }
  }

  const toggleChapter = (chapterIndex: number) => {
    if (!curriculum) return

    const newCurriculum = { ...curriculum }
    const chapter = newCurriculum.chapters[chapterIndex]
    chapter.selected = !chapter.selected

    // Update all sections in the chapter
    chapter.sectionStates = chapter.sectionStates.map((section) => ({
      ...section,
      selected: chapter.selected,
    }))

    setCurriculum(newCurriculum)
  }

  const toggleSection = (chapterIndex: number, sectionIndex: number) => {
    if (!curriculum) return

    const newCurriculum = { ...curriculum }
    const chapter = newCurriculum.chapters[chapterIndex]
    chapter.sectionStates[sectionIndex].selected = !chapter.sectionStates[sectionIndex].selected

    // Update chapter selection based on sections
    const allSectionsSelected = chapter.sectionStates.every((s) => s.selected)
    const someSectionsSelected = chapter.sectionStates.some((s) => s.selected)
    chapter.selected = allSectionsSelected

    setCurriculum(newCurriculum)
  }

  const generateWeeklyPlan = async () => {
    if (!curriculum) return

    setGeneratingPlan(true)
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL
      if (!backendUrl) {
        throw new Error("NEXT_PUBLIC_BACKEND_URL environment variable is not set")
      }

      const selectedSections = curriculum.chapters.flatMap((chapter) =>
        chapter.sectionStates
          .filter((section) => section.selected)
          .map((section) => section.title),
      )

      const requestBody = {
        grade: curriculum.class,
        subject: curriculum.subject,
        sections: selectedSections,
        classroom_id: classroomId,
      }

      const response = await fetch(`${backendUrl}/api/teacher/lesson-plan`, {
        method: "POST",
        headers: AuthService.getAuthHeaders(),
        body: JSON.stringify(requestBody),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      setWeeklyPlan(data.weeklyPlan)
    } catch (error) {
      console.error("Error generating weekly plan:", error)
    } finally {
      setGeneratingPlan(false)
    }
  }

  const handleCurriculumChange = (curriculumId: string) => {
    const selectedCurriculum = allCurricula.find(c => c.id === curriculumId)
    if (selectedCurriculum) {
      setSelectedCurriculumId(curriculumId)
      
      // Transform the selected curriculum
      const transformedData = {
        ...selectedCurriculum,
        chapters: selectedCurriculum.chapters.map((chapter: any) => ({
          ...chapter,
          selected: false,
          sectionStates: chapter.sections.map((section: string, index: number) => ({
            id: `${chapter.chapter_number}-${index}`,
            title: section,
            selected: false,
          })),
        })),
      }
      
      setCurriculum(transformedData)
      setWeeklyPlan(null) // Clear previous plan when curriculum changes
    }
  }

  const hasSelectedItems = curriculum?.chapters.some((chapter) =>
    chapter.sectionStates.some((section) => section.selected),
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading curriculum data...</p>
        </div>
      </div>
    )
  }

  if (!curriculum) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600">No curriculum data available</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/classroom" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Classrooms</span>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Weekly Planner</h1>
            {classroom && (
              <div className="flex items-center gap-2 mt-1">
                <p className="text-gray-600">Classroom: {classroom.name}</p>
                <Badge variant="secondary">Grade {classroom.grade}</Badge>
                <Badge variant="secondary">{classroom.subject}</Badge>
              </div>
            )}
          </div>
        </div>
        <Button
          onClick={generateWeeklyPlan}
          disabled={!hasSelectedItems || generatingPlan}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {generatingPlan ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            "Generate Weekly Plan"
          )}
        </Button>
      </div>

      {allCurricula.length > 1 && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Select Curriculum</CardTitle>
            <CardDescription>Choose the curriculum you want to work with</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {allCurricula.map((curr) => (
                <div
                  key={curr.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedCurriculumId === curr.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handleCurriculumChange(curr.id)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">{curr.subject}</h3>
                    {selectedCurriculumId === curr.id && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    )}
                  </div>
                  <div className="flex gap-2 text-sm text-gray-600">
                    <Badge variant="outline">Class {curr.class}</Badge>
                    <Badge variant="outline">{curr.medium}</Badge>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    {curr.chapters.length} chapters
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-blue-600" />
              Curriculum Selection
            </CardTitle>
            <CardDescription>
              {curriculum && (
                <div className="flex gap-2">
                  <Badge variant="secondary">Class {curriculum.class}</Badge>
                  <Badge variant="secondary">{curriculum.subject}</Badge>
                  <Badge variant="secondary">{curriculum.medium}</Badge>
                </div>
              )}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {curriculum?.chapters.map((chapter, chapterIndex) => (
              <div key={chapter.chapter_number} className="border rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-3">
                  <Checkbox
                    id={`chapter-${chapter.chapter_number}`}
                    checked={chapter.selected}
                    onCheckedChange={() => toggleChapter(chapterIndex)}
                  />
                  <label
                    htmlFor={`chapter-${chapter.chapter_number}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    Chapter {chapter.chapter_number}: {chapter.title}
                  </label>
                </div>

                <div className="ml-6 space-y-2">
                  {chapter.sectionStates.map((section, sectionIndex) => (
                    <div key={section.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={section.id}
                        checked={section.selected}
                        onCheckedChange={() => toggleSection(chapterIndex, sectionIndex)}
                      />
                      <label htmlFor={section.id} className="text-sm text-gray-600 cursor-pointer">
                        {section.title}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Generated Weekly Plan
            </CardTitle>
            <CardDescription>Your personalized lesson plan based on selected topics</CardDescription>
          </CardHeader>
          <CardContent>
            {weeklyPlan ? (
              <div className="space-y-3">
                {weeklyPlan.map((lesson, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                    <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </div>
                    <p className="text-sm text-gray-700">{lesson}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <BookOpen className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>
                  Select curriculum topics and click "Generate Weekly Plan" to see your personalized lesson plan here.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 