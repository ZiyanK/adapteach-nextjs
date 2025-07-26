"use client"

import { Calendar, Users, Upload, BookOpen, Home } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from "@/components/ui/sidebar"

export function AppSidebar() {
  const pathname = usePathname()
  
  // Extract classroom ID from pathname if we're in a classroom dashboard
  const classroomMatch = pathname.match(/\/dashboard\/([^\/]+)/)
  const classroomId = classroomMatch ? classroomMatch[1] : null

  const items = [
    {
      title: "Classrooms",
      url: "/classroom",
      icon: Home,
    },
    {
      title: "Weekly Planner",
      url: classroomId ? `/dashboard/${classroomId}` : "/dashboard",
      icon: Calendar,
    },
    {
      title: "Students",
      url: classroomId ? `/dashboard/${classroomId}/students` : "/dashboard/students",
      icon: Users,
    },
    {
      title: "Upload Textbook",
      url: classroomId ? `/dashboard/${classroomId}/upload` : "/dashboard/upload",
      icon: Upload,
    },
  ]

  return (
    <Sidebar className="border-r border-gray-200">
      <SidebarHeader className="border-b border-gray-200 p-4">
        <div className="flex items-center gap-2">
          <BookOpen className="h-6 w-6 text-blue-600" />
          <span className="text-lg font-semibold text-blue-900">Teacher Dashboard</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-gray-600">Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.url || (item.url === "/dashboard" && pathname.startsWith("/dashboard/"))}
                    className="data-[active=true]:bg-blue-100 data-[active=true]:text-blue-900"
                  >
                    <Link href={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
