import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'

interface LoaderProps {
  size?: number
  speed?: number
  color?: string
  className?: string
}

// Create a client-only version of the component
const Loader = ({ size = 40, speed = 1.75, color = "white", className = "" }: LoaderProps) => {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    // Only import and register on the client side
    if (typeof window !== 'undefined') {
      import('ldrs').then(({ tailChase }) => {
        tailChase.register()
      })
    }
  }, [])

  if (!isClient) {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-current" style={{ borderColor: color }}></div>
      </div>
    )
  }

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <l-tail-chase
        size={size}
        speed={speed}
        color={color}
      ></l-tail-chase>
    </div>
  )
}

// Export as a dynamic component with SSR disabled
export default dynamic(() => Promise.resolve(Loader), { ssr: false }) 