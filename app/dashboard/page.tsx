"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Loader2, BookOpen, CheckCircle } from "lucide-react"
import { AuthService } from "@/lib/auth"

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
  class: number
  subject: string
  medium: string
  chapters: Chapter[]
}

export default function WeeklyPlannerPage() {
  const [curriculum, setCurriculum] = useState<Curriculum | null>(null)
  const [loading, setLoading] = useState(true)
  const [generatingPlan, setGeneratingPlan] = useState(false)
  const [weeklyPlan, setWeeklyPlan] = useState<string[] | null>(null)

  useEffect(() => {
    fetchCurriculum()
  }, [])

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

      // Transform data to include selection states
      const transformedData = {
        ...data,
        chapters: data.chapters.map((chapter: any) => ({
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

      const selectedItems = curriculum.chapters.flatMap((chapter) =>
        chapter.sectionStates
          .filter((section) => section.selected)
          .map((section) => ({
            chapter: chapter.title,
            section: section.title,
          })),
      )

      const response = await fetch(`${backendUrl}/api/common/lesson-plan`, {
        method: "POST",
        headers: AuthService.getAuthHeaders(),
        body: JSON.stringify({ selectedItems }),
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

  const hasSelectedItems = curriculum?.chapters.some((chapter) =>
    chapter.sectionStates.some((section) => section.selected),
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Weekly Planner</h1>
          <p className="text-gray-600">Select curriculum topics to generate your weekly lesson plan</p>
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
