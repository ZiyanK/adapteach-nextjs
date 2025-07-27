'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Calendar, BookOpen, Clock, User } from 'lucide-react';
import LessonBlockRenderer from './LessonBlockRenderer';
import AssessmentForm from './AssessmentForm';
import { AuthService } from '@/lib/auth';
import { sampleAssessmentData } from './sample-assessment-data';

interface LearningMaterial {
  lesson: Array<{
    content: string;
    type: string;
    description?: string;
    animation_description?: string;
  }>;
  assessment?: Array<{
    question: string;
    options?: string[];
    correct_answer?: string;
    rationale?: string;
    type?: 'mcq' | 'text';
  }>;
}

interface StudentLessonPlan {
  id: string;
  lesson_plan_id: string;
  student_id: string;
  day: string;
  lesson: any;
  assessment: any;
  outcome: string;
  assessment_answers: any;
  follow_up_lesson: any;
  learning_material: LearningMaterial;
  status: string;
  created_at: string;
  updated_at: string;
  student_name: string;
  student_email: string;
}

interface LessonPlansResponse {
  count: number;
  student_lesson_plans: StudentLessonPlan[];
  user_role: string;
}

export default function StudentDashboardPage() {
  const [lessonPlans, setLessonPlans] = useState<StudentLessonPlan[]>([]);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAssessment, setShowAssessment] = useState(false);
  const [submittingAssessment, setSubmittingAssessment] = useState(false);

  useEffect(() => {
    fetchLessonPlans();
  }, []);

  const fetchLessonPlans = async () => {
    try {
      setLoading(true);
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
      if (!backendUrl) {
        throw new Error("NEXT_PUBLIC_BACKEND_URL environment variable is not set");
      }

      const response = await fetch(`${backendUrl}/api/student/lesson-plans`, {
        headers: AuthService.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: LessonPlansResponse = await response.json();

      console.log(data);
      
      // Add sample assessment data to the first lesson plan for testing
      if (data.student_lesson_plans.length > 0) {
        data.student_lesson_plans[0].learning_material.assessment = sampleAssessmentData;
      }
      
      setLessonPlans(data.student_lesson_plans);

      // Auto-select the first day if available
      if (data.student_lesson_plans?.length > 0 && !selectedDay) {
        setSelectedDay(data.student_lesson_plans[0].day);
      }
    } catch (error) {
      console.error("Error fetching lesson plans:", error);
      setError("Failed to load lesson plans. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getSelectedDayPlan = () => {
    return lessonPlans.find(plan => plan.day === selectedDay);
  };

  const getDayStatus = (day: string) => {
    const plan = lessonPlans.find(p => p.day === day);
    return plan?.status || 'pending';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'in_progress':
        return 'In Progress';
      case 'pending':
        return 'Pending';
      default:
        return 'Unknown';
    }
  };

  const handleAssessmentSubmit = async (answers: Record<number, string>) => {
    setSubmittingAssessment(true);
    try {
      // Here you would typically send the answers to your backend
      console.log('Assessment answers:', answers);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // You can add actual API call here:
      // const response = await fetch(`${backendUrl}/api/student/assessment-submit`, {
      //   method: 'POST',
      //   headers: AuthService.getAuthHeaders(),
      //   body: JSON.stringify({
      //     lesson_plan_id: getSelectedDayPlan()?.lesson_plan_id,
      //     day: selectedDay,
      //     answers: answers
      //   }),
      // });
      
    } catch (error) {
      console.error('Error submitting assessment:', error);
    } finally {
      setSubmittingAssessment(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your lesson plans...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={fetchLessonPlans} variant="outline">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">My Lessons</h1>
          <p className="text-gray-600 text-sm">Your weekly lesson plans</p>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-4 space-y-2">
            {lessonPlans.length === 0 ? (
              <div className="text-center py-8">
                <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No lesson plans available</p>
                <p className="text-gray-400 text-sm">Check back later for your lessons</p>
              </div>
            ) : (
              lessonPlans.map((plan) => (
                <Card
                  key={plan.id}
                  className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                    selectedDay === plan.day
                      ? 'ring-2 ring-blue-500 bg-blue-50'
                      : 'hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedDay(plan.day)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <h3 className="font-semibold text-gray-900">{plan.day}</h3>
                      </div>
                      <Badge className={getStatusColor(getDayStatus(plan.day))}>
                        {getStatusText(getDayStatus(plan.day))}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <Clock className="h-3 w-3" />
                      <span>
                        {new Date(plan.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {selectedDay ? (
          <>
            {/* Header */}
            <div className="bg-white border-b border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">
                    {selectedDay}'s Lesson
                  </h2>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <User className="h-4 w-4" />
                      <span>Student Dashboard</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>
                        {getSelectedDayPlan()?.created_at
                          ? new Date(getSelectedDayPlan()!.created_at).toLocaleDateString()
                          : 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Badge className={getStatusColor(getDayStatus(selectedDay))}>
                    {getStatusText(getDayStatus(selectedDay))}
                  </Badge>
                  {getSelectedDayPlan()?.learning_material?.assessment && (
                    <Button
                      variant={showAssessment ? "default" : "outline"}
                      onClick={() => setShowAssessment(!showAssessment)}
                      className="ml-2"
                    >
                      {showAssessment ? "Show Lesson" : "Take Assessment"}
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* Lesson Content */}
            <ScrollArea className="flex-1 bg-gray-50">
              <div className="p-6">
                {(() => {
                  const selectedPlan = getSelectedDayPlan();
                  const assessment = selectedPlan?.learning_material?.assessment;
                  
                  if (showAssessment && assessment && assessment.length > 0) {
                    return (
                      <AssessmentForm
                        questions={assessment}
                        onSubmit={handleAssessmentSubmit}
                        isSubmitting={submittingAssessment}
                      />
                    );
                  } else if (selectedPlan?.learning_material?.lesson) {
                    return (
                      <div className="max-w-4xl mx-auto">
                        <LessonBlockRenderer 
                          blocks={selectedPlan.learning_material.lesson} 
                        />
                      </div>
                    );
                  } else {
                    return (
                      <div className="text-center py-12">
                        <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                          No lesson content available
                        </h3>
                        <p className="text-gray-500">
                          The lesson content for {selectedDay} is not yet available.
                        </p>
                      </div>
                    );
                  }
                })()}
              </div>
            </ScrollArea>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Select a lesson
              </h3>
              <p className="text-gray-500">
                Choose a day from the sidebar to view your lesson content.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 