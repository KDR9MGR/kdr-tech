'use client'

import { useEffect, useState } from 'react'

interface App {
  id: string
  app_name: string
  logo_url: string
  app_url: string | null
  description: string | null
  category: string | null
  scroll_direction: string
  scroll_speed: number
  visible: boolean
  order_index: number
}

export default function AppShowcase() {
  const [leftApps, setLeftApps] = useState<App[]>([])
  const [rightApps, setRightApps] = useState<App[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchApps()
  }, [])

  const fetchApps = async () => {
    try {
      const response = await fetch('/api/showcase')
      const data = await response.json()

      // Split apps by scroll direction
      const left = data.filter((app: App) => app.scroll_direction === 'left')
      const right = data.filter((app: App) => app.scroll_direction === 'right')

      setLeftApps(left)
      setRightApps(right)
    } catch (error) {
      console.error('Failed to load apps:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return null
  }

  if (leftApps.length === 0 && rightApps.length === 0) {
    return null
  }

  return (
    <section className="w-full py-20 bg-transparent relative z-[10]">
      <div className="max-w-[1400px] mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-cyan-500 mb-4">
            Our Portfolio
          </h2>
          <p className="text-gray-300 text-lg">
            Apps we&apos;ve built for our clients
          </p>
        </div>

        <div className="space-y-8">
          {/* Left to Right Scroll Row */}
          {leftApps.length > 0 && (
            <ScrollingRow apps={leftApps} direction="left" />
          )}

          {/* Right to Left Scroll Row */}
          {rightApps.length > 0 && (
            <ScrollingRow apps={rightApps} direction="right" />
          )}
        </div>
      </div>
    </section>
  )
}

interface ScrollingRowProps {
  apps: App[]
  direction: 'left' | 'right'
}

function ScrollingRow({ apps, direction }: ScrollingRowProps) {
  // Calculate average speed for this row
  const avgSpeed = apps.reduce((sum, app) => sum + app.scroll_speed, 0) / apps.length

  // Duplicate apps array for seamless infinite scroll
  const duplicatedApps = [...apps, ...apps, ...apps]

  const handleLogoClick = (app: App) => {
    if (app.app_url) {
      window.open(app.app_url, '_blank', 'noopener,noreferrer')
    }
  }

  return (
    <div className="relative overflow-hidden">
      <div
        className={`flex gap-8 ${direction === 'left' ? 'animate-scroll-left' : 'animate-scroll-right'}`}
        style={{
          animationDuration: `${avgSpeed}s`,
          width: 'fit-content',
        }}
      >
        {duplicatedApps.map((app, index) => (
          <div
            key={`${app.id}-${index}`}
            onClick={() => handleLogoClick(app)}
            className={`flex-shrink-0 bg-[#1A1A2E] border border-[#2A0E61] rounded-lg p-6 transition-all duration-300 hover:scale-105 hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/20 ${
              app.app_url ? 'cursor-pointer' : ''
            }`}
            title={app.app_name}
          >
            <div className="relative w-32 h-32 flex items-center justify-center">
              <img
                src={app.logo_url}
                alt={app.app_name}
                className="max-w-full max-h-full object-contain"
                onError={(e) => {
                  e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="128" height="128"%3E%3Crect fill="%23333" width="128" height="128"/%3E%3Ctext fill="%23666" x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-size="12"%3E' + encodeURIComponent(app.app_name) + '%3C/text%3E%3C/svg%3E'
                }}
              />
            </div>
            <div className="mt-3 text-center">
              <p className="text-white font-medium text-sm truncate">
                {app.app_name}
              </p>
              {app.category && (
                <p className="text-gray-400 text-xs mt-1 truncate">
                  {app.category}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Gradient overlays for seamless edges */}
      <div className="absolute top-0 left-0 w-32 h-full bg-gradient-to-r from-[#030014] to-transparent pointer-events-none z-10" />
      <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-[#030014] to-transparent pointer-events-none z-10" />
    </div>
  )
}
