"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import { ArrowRight, BookOpen, Brain, Clock, Users, Zap, Target, Globe, TrendingUp, Shield, Lightbulb, Database, Search, BarChart3 } from "lucide-react"

export default function LandingPage() {
  const router = useRouter()

  const handleGetStarted = () => {
    router.push("/login")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Navigation */}
      <nav className="flex items-center justify-between p-6 max-w-7xl mx-auto">
        <div className="flex items-center space-x-2">
          <BookOpen className="h-8 w-8 text-blue-600" />
          <span className="text-2xl font-bold text-gray-900">AdapTeach</span>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={() => router.push("/login")}>
            Sign In
          </Button>
          <Button onClick={() => router.push("/login")}>
            Get Started
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="px-6 py-20 max-w-7xl mx-auto text-center">
        <Badge className="mb-4 bg-blue-100 text-blue-800 hover:bg-blue-100">
          <Brain className="h-4 w-4 mr-2" />
          AI-Powered Curriculum Co-Pilot
        </Badge>
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
          Transform Teaching with
          <span className="text-blue-600"> Intelligent</span> Lesson Planning
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          Reduce planning time from hours to minutes with our AI-powered platform that creates personalized, 
          engaging lesson plans while you focus on what matters most - inspiring students.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" onClick={handleGetStarted} className="bg-blue-600 hover:bg-blue-700">
            Start Free Trial
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <Button size="lg" variant="outline">
            Watch Demo
          </Button>
        </div>
      </section>

      {/* Problem Section */}
      <section className="px-6 py-16 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">The Problem We're Solving</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Teacher burnout driven by administrative overload is a critical issue affecting education quality worldwide.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-l-4 border-l-red-500">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Clock className="h-6 w-6 text-red-500" />
                  <CardTitle>Saving time for teachers</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Teachers spend over 10-12 hours per week on non-teaching tasks, with lesson planning being a major component.
                </p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-orange-500">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Users className="h-6 w-6 text-orange-500" />
                  <CardTitle>Reducing teacher attrition</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  44% of new teachers leave the profession within five years due to overwhelming administrative burden.
                </p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-yellow-500">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Target className="h-6 w-6 text-yellow-500" />
                  <CardTitle>Fragmented Workflows</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Teachers juggle curriculum standards, textbooks, and student data stored in different places.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Innovation Section */}
      <section className="px-6 py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Innovation</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              We're not just another LMS. We're creating a proactive, AI-powered curriculum co-pilot that 
              transforms how teachers plan and deliver lessons.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Context-Aware AI Synthesis</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-semibold">1</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Intelligent Reasoning</h4>
                    <p className="text-gray-600">Our agent reasons about what students have learned and their real-time progress</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-semibold">2</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Curriculum Integration</h4>
                    <p className="text-gray-600">Cross-references approved textbooks and curriculum standards automatically</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-semibold">3</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Dynamic Resource Discovery</h4>
                    <p className="text-gray-600">Scours the web for engaging, relevant activities for specific topics</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <h4 className="font-semibold text-gray-900 mb-4">Agentic Workflow Example</h4>
              <div className="space-y-3 text-sm">
                <div className="flex items-center space-x-2">
                  <Database className="h-4 w-4 text-blue-500" />
                  <span>Query student progress data</span>
                </div>
                <div className="flex items-center space-x-2">
                  <BookOpen className="h-4 w-4 text-green-500" />
                  <span>Access vectorized textbook content</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Search className="h-4 w-4 text-purple-500" />
                  <span>Find engaging external resources</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Brain className="h-4 w-4 text-orange-500" />
                  <span>Synthesize comprehensive lesson plan</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI Integration Section */}
      <section className="px-6 py-16 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Powered by Google AI & Agentic Thinking</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our AI integration is the core of our value proposition, using advanced LLMs and agentic workflows 
              to automate the entire curriculum creation process.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center p-6">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Brain className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Gemini API</h3>
              <p className="text-sm text-gray-600">Core intelligence for lesson generation and synthesis</p>
            </Card>

            <Card className="text-center p-6">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Database className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">MongoDB Integration</h3>
              <p className="text-sm text-gray-600">Flexible data modeling for curriculum structures</p>
            </Card>

            <Card className="text-center p-6">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Google Search API</h3>
              <p className="text-sm text-gray-600">Dynamic resource discovery and curation</p>
            </Card>

            <Card className="text-center p-6">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Function Calling</h3>
              <p className="text-sm text-gray-600">Seamless integration between AI and data systems</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Feasibility Section */}
      <section className="px-6 py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Built for Success</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our solution is designed with feasibility and scalability in mind, using proven technologies 
              and a phased approach to ensure reliable delivery.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Shield className="h-6 w-6 text-green-600" />
                  <CardTitle>Robust Tech Stack</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Next.js for full-stack development and MongoDB for flexible data modeling, 
                  perfect for storing varied curriculum structures.
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Next.js Frontend & Backend</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>MongoDB Database</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Google AI Integration</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Lightbulb className="h-6 w-6 text-blue-600" />
                  <CardTitle>Modular Development</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Build and test the agentic workflow in modular components, ensuring 
                  each piece works perfectly before integration.
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Core AI Agent</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Database Integration</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>External APIs</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Target className="h-6 w-6 text-purple-600" />
                  <CardTitle>Phased Rollout</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  MVP focuses on perfecting the teacher-facing curriculum agent, 
                  with student features and analytics in subsequent iterations.
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span>Phase 1: Teacher Agent</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span>Phase 2: Student Features</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span>Phase 3: Advanced Analytics</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="px-6 py-16 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Measurable Impact & Global Scalability</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our platform addresses immediate teacher needs while building a foundation for 
              global educational transformation.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Immediate Impact</h3>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <Clock className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Time Savings</h4>
                    <p className="text-gray-600">Reduce weekly planning time from hours to minutes, directly addressing teacher burnout</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Job Satisfaction</h4>
                    <p className="text-gray-600">Improve teacher retention and satisfaction, leading to higher quality education</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <BarChart3 className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Student Outcomes</h4>
                    <p className="text-gray-600">Better lesson quality and engagement lead to improved student performance</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Global Scalability</h3>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                    <Users className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">User Scalability</h4>
                    <p className="text-gray-600">From single schools to entire districts or national education systems</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                    <Globe className="h-6 w-6 text-indigo-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Geographic Scalability</h4>
                    <p className="text-gray-600">Adaptable to any educational framework: Common Core, UK National Curriculum, CBSE, etc.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center">
                    <BookOpen className="h-6 w-6 text-teal-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Sector Scalability</h4>
                    <p className="text-gray-600">Beyond K-12: corporate training, professional certifications, university courses</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-20 bg-gradient-to-r from-blue-600 to-indigo-700">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Transform Your Teaching?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of teachers who are already saving hours every week with AdapTeach.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" onClick={handleGetStarted}>
              Start Free Trial
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
              Schedule Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-12 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <BookOpen className="h-6 w-6 text-blue-400" />
                <span className="text-xl font-bold">AdapTeach</span>
              </div>
              <p className="text-gray-400">
                AI-powered curriculum co-pilot that transforms how teachers plan and deliver lessons.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Features</li>
                <li>Pricing</li>
                <li>Demo</li>
                <li>API</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li>About</li>
                <li>Blog</li>
                <li>Careers</li>
                <li>Contact</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Help Center</li>
                <li>Documentation</li>
                <li>Community</li>
                <li>Status</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 AdapTeach. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}