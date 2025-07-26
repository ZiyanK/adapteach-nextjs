"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

export default function DashboardPage() {
  const router = useRouter()

  useEffect(() => {
    router.push("/classroom")
  }, [router])

  return (
    <div className="flex items-center justify-center h-96">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
        <p className="text-gray-600">Redirecting to classroom selection...</p>
      </div>
    </div>
  )
}
