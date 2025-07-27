"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, BookOpen, ArrowLeft, Clock, Send, CheckCircle, XCircle } from "lucide-react"
import { AuthService } from "@/lib/auth"
import Link from "next/link"
import { toast } from "@/hooks/use-toast"

interface LearningOutcome {
  outcome: string
  bloomsLevel: string
  actionVerb: string
}

interface DailyPlan {
  day: string
  focus: string
  learningOutcome: string
  duration: string
}

interface WeeklyPlan {
  subject: string
  grade: number
  weekOverview: string
  dailyPlans: DailyPlan[]
}

interface LessonPlan {
  id: string
  classroom_id: string
  teacher_id: string
  title: string
  subject: string
  grade: number
  sections: string[]
  learning_outcomes: {
    subject: string
    grade: number
    topicSections: string[]
    learningOutcomes: LearningOutcome[]
  }
  weekly_plan: WeeklyPlan
  status: string
  created_at: string
  updated_at: string
}

interface LessonPlanResponse {
  count: number
  lesson_plans: LessonPlan[]
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
  const router = useRouter()
  const classroomId = params.id as string
  
  const [classroom, setClassroom] = useState<Classroom | null>(null)
  const [currentLessonPlan, setCurrentLessonPlan] = useState<LessonPlan | null>(null)
  const [loading, setLoading] = useState(true)
  const [loadingLessonPlan, setLoadingLessonPlan] = useState(false)
  const [sendingStatus, setSendingStatus] = useState<Record<string, 'idle' | 'sending' | 'success' | 'error'>>({})
  const [sendMessages, setSendMessages] = useState<Record<string, string>>({})

  useEffect(() => {
    if (classroomId) {
      fetchClassroom()
      fetchCurrentLessonPlan()
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
    } finally {
      setLoading(false)
    }
  }

  const fetchCurrentLessonPlan = async () => {
    try {
      setLoadingLessonPlan(true)
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL
      if (!backendUrl) {
        throw new Error("NEXT_PUBLIC_BACKEND_URL environment variable is not set")
      }

      const response = await fetch(`${backendUrl}/api/teacher/lesson-plans?classroom_id=${classroomId}`, {
        headers: AuthService.getAuthHeaders(),
      })
      
      if (!response.ok) {
        if (response.status === 404) {
          // No lesson plan found, which is fine
          setCurrentLessonPlan(null)
          return
        }
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data: LessonPlanResponse = await response.json()
      
      // Handle the new response structure with count and lesson_plans array
      if (data.count > 0 && data.lesson_plans.length > 0) {
        // Use the most recent lesson plan (first in the array)
        setCurrentLessonPlan(data.lesson_plans[0])
      } else {
        setCurrentLessonPlan(null)
      }
    } catch (error) {
      console.error("Error fetching current lesson plan:", error)
      setCurrentLessonPlan(null)
    } finally {
      setLoadingLessonPlan(false)
    }
  }

  const getCurrentDayPlan = () => {
    if (!currentLessonPlan?.weekly_plan?.dailyPlans) return null
    
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' })
    return currentLessonPlan.weekly_plan.dailyPlans.find(plan => plan.day === today) || null
  }

  const getTomorrowPlan = () => {
    if (!currentLessonPlan?.weekly_plan?.dailyPlans) return null
    
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(today.getDate() + 1)
    const tomorrowDay = tomorrow.toLocaleDateString('en-US', { weekday: 'long' })
    return currentLessonPlan.weekly_plan.dailyPlans.find(plan => plan.day === tomorrowDay) || null
  }

  const sendLessonToStudents = async (day: string) => {
    if (!currentLessonPlan) return

    setSendingStatus(prev => ({ ...prev, [day]: 'sending' }))
    setSendMessages(prev => ({ ...prev, [day]: '' }))

    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL
      if (!backendUrl) {
        throw new Error("NEXT_PUBLIC_BACKEND_URL environment variable is not set")
      }

      const response = await fetch(`${backendUrl}/api/teacher/lesson-plans/student-lessons`, {
        method: 'POST',
        headers: AuthService.getAuthHeaders(),
        body: JSON.stringify({
          lesson_plan_id: currentLessonPlan.id,
          day: day
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.detail || errorData.message || `Failed to send lesson: ${response.status}`)
      }

      const data = await response.json()
      setSendingStatus(prev => ({ ...prev, [day]: 'success' }))
      setSendMessages(prev => ({ ...prev, [day]: 'Lesson sent successfully!' }))
      
      toast({
        title: "Success",
        description: `Lesson for ${day} has been sent to students.`,
      })

      // Reset success status after 3 seconds
      setTimeout(() => {
        setSendingStatus(prev => ({ ...prev, [day]: 'idle' }))
        setSendMessages(prev => ({ ...prev, [day]: '' }))
      }, 3000)

    } catch (error) {
      console.error(`Error sending lesson for ${day}:`, error)
      setSendingStatus(prev => ({ ...prev, [day]: 'error' }))
      setSendMessages(prev => ({ ...prev, [day]: error instanceof Error ? error.message : 'Failed to send lesson' }))
      
      toast({
        title: "Error",
        description: `Failed to send lesson for ${day}. Please try again.`,
        variant: "destructive",
      })

      // Reset error status after 5 seconds
      setTimeout(() => {
        setSendingStatus(prev => ({ ...prev, [day]: 'idle' }))
        setSendMessages(prev => ({ ...prev, [day]: '' }))
      }, 5000)
    }
  }

  const getSendButtonContent = (day: string) => {
    const status = sendingStatus[day] || 'idle'
    
    switch (status) {
      case 'sending':
        return (
          <>
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
            Sending...
          </>
        )
      case 'success':
        return (
          <>
            <CheckCircle className="h-4 w-4 mr-2" />
            Sent
          </>
        )
      case 'error':
        return (
          <>
            <XCircle className="h-4 w-4 mr-2" />
            Failed
          </>
        )
      default:
        return (
          <>
            <Send className="h-4 w-4 mr-2" />
            Send
          </>
        )
    }
  }

  const getSendButtonVariant = (day: string) => {
    const status = sendingStatus[day] || 'idle'
    
    switch (status) {
      case 'sending':
        return 'secondary'
      case 'success':
        return 'default'
      case 'error':
        return 'destructive'
      default:
        return 'default'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading dashboard...</p>
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
        {/* <Button
          onClick={() => router.push(`/dashboard/${classroomId}/curriculum-selection`)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Generate Weekly Plan
        </Button> */}
      </div>

      {/* Current Lesson Plan Section */}
      {loadingLessonPlan ? (
        <Card className="mb-6">
          <CardContent className="py-8">
            <div className="text-center">
              <Loader2 className="h-6 w-6 animate-spin text-blue-600 mx-auto mb-2" />
              <p className="text-gray-600">Loading current lesson plan...</p>
            </div>
          </CardContent>
        </Card>
      ) : currentLessonPlan ? (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-blue-600" />
              Current Lesson Plan
            </CardTitle>
            <CardDescription>
              {currentLessonPlan.title}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Weekly Learning Outcomes */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Weekly Learning Outcomes</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentLessonPlan.learning_outcomes.learningOutcomes.map((outcome, index) => (
                  <div key={index} className="p-3 border rounded-lg bg-gray-50">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="text-xs">
                        {outcome.bloomsLevel}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {outcome.actionVerb}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-700">{outcome.outcome}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Complete Weekly Plan */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Weekly Schedule</h3>
              <div className="space-y-4">
                {currentLessonPlan.weekly_plan.dailyPlans.map((dayPlan, index) => (
                  <div key={index} className="border rounded-lg p-4 bg-white shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-medium text-gray-900">{dayPlan.day}</h4>
                          <Badge variant="secondary">{dayPlan.duration}</Badge>
                        </div>
                        <p className="text-sm font-medium text-blue-600 mb-1">{dayPlan.focus}</p>
                        <p className="text-sm text-gray-700">{dayPlan.learningOutcome}</p>
                      </div>
                      <div className="flex flex-col items-end gap-2 ml-4">
                        <Button
                          onClick={() => sendLessonToStudents(dayPlan.day)}
                          disabled={sendingStatus[dayPlan.day] === 'sending'}
                          variant={getSendButtonVariant(dayPlan.day)}
                          size="sm"
                          className="min-w-[100px]"
                        >
                          {getSendButtonContent(dayPlan.day)}
                        </Button>
                        {sendMessages[dayPlan.day] && (
                          <p className={`text-xs ${
                            sendingStatus[dayPlan.day] === 'success' 
                              ? 'text-green-600' 
                              : sendingStatus[dayPlan.day] === 'error' 
                                ? 'text-red-600' 
                                : 'text-gray-600'
                          }`}>
                            {sendMessages[dayPlan.day]}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Today's Plan */}
            {getCurrentDayPlan() && (
              <div>
                <h3 className="text-lg font-semibold mb-3">Today's Plan</h3>
                <div className="border rounded-lg p-4 bg-blue-50">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-blue-900">{getCurrentDayPlan()?.day} - {getCurrentDayPlan()?.focus}</h4>
                    <Badge variant="secondary">{getCurrentDayPlan()?.duration}</Badge>
                  </div>
                  <p className="text-sm text-gray-700 mb-3">{getCurrentDayPlan()?.learningOutcome}</p>
                  
                  <div className="mt-3">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="h-4 w-4" />
                      <span>Duration: {getCurrentDayPlan()?.duration}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tomorrow's Plan */}
            {getTomorrowPlan() && (
              <div>
                <h3 className="text-lg font-semibold mb-3">Tomorrow's Plan</h3>
                <div className="border rounded-lg p-4 bg-green-50">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-green-900">{getTomorrowPlan()?.day} - {getTomorrowPlan()?.focus}</h4>
                    <Badge variant="secondary">{getTomorrowPlan()?.duration}</Badge>
                  </div>
                  <p className="text-sm text-gray-700 mb-3">{getTomorrowPlan()?.learningOutcome}</p>
                  
                  <div className="mt-3">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="h-4 w-4" />
                      <span>Duration: {getTomorrowPlan()?.duration}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card className="mb-6">
          <CardContent className="py-8">
            <div className="text-center">
              <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Current Lesson Plan</h3>
              <p className="text-gray-600">Create a new lesson plan by selecting curriculum topics below.</p>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-blue-600" />
              Quick Actions
            </CardTitle>
            <CardDescription>
              Manage your lesson plans and curriculum
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 border rounded-lg bg-blue-50">
              <h3 className="font-medium text-blue-900 mb-2">Create New Lesson Plan</h3>
              <p className="text-sm text-blue-700 mb-3">
                Select curriculum topics and generate a personalized weekly lesson plan.
              </p>
              <Button 
                onClick={() => router.push(`/dashboard/${classroomId}/curriculum-selection`)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Start Planning
              </Button>
            </div>
            
            <div className="p-4 border rounded-lg bg-green-50">
              <h3 className="font-medium text-green-900 mb-2">View Current Plans</h3>
              <p className="text-sm text-green-700 mb-3">
                Access your existing lesson plans and learning outcomes.
              </p>
              <p className="text-xs text-green-600">
                Your current lesson plan is displayed above.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-green-600" />
              Recent Activity
            </CardTitle>
            <CardDescription>Your latest lesson planning activity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-gray-500">
              <BookOpen className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>
                Your lesson planning activity will appear here.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 