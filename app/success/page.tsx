import { Suspense } from "react"
import dynamic from "next/dynamic"
import { Loader2 } from "lucide-react"

const SuccessContent = dynamic(() => import("@/components/success-content"), {
  loading: () => <Loader2 className="h-8 w-8 animate-spin" />,
})

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <Suspense fallback={<Loader2 className="h-8 w-8 animate-spin" />}>
        <SuccessContent />
      </Suspense>
    </div>
  )
}

