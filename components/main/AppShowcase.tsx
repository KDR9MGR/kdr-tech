'use client'

import { useEffect, useState } from 'react'

interface App {
  id: string
  app_name: string
  logo_url: string
  app_url: string | null
  description: string | null
  category: string | null
  visible: boolean
  order_index: number
}

export default function AppShowcase() {
  const [apps, setApps] = useState<App[]>([])
  const [scrollSpeed, setScrollSpeed] = useState(30)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [appsRes, settingsRes] = await Promise.all([
          fetch('/api/showcase'),
          fetch('/api/settings'),
        ])
        const appsData: App[] = await appsRes.json()
        const settings = await settingsRes.json()

        setApps(appsData)

        if (settings.showcase_scroll_speed) {
          setScrollSpeed(parseInt(settings.showcase_scroll_speed))
        }
      } catch (error) {
        console.error('Failed to load showcase data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading || apps.length === 0) {
    return null
  }

  return (
    <section className="w-full py-24 relative z-[10]">
      <div className="max-w-[1400px] mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-xs font-semibold tracking-[0.3em] uppercase text-purple-400 mb-3">
            Our Work
          </p>
          <h2 className="text-3xl md:text-4xl font-light text-white mb-3">
            Portfolio
          </h2>
          <div className="w-12 h-[1px] bg-gradient-to-r from-transparent via-purple-500 to-transparent mx-auto" />
        </div>

        <div className="space-y-6">
          <ScrollingRow apps={apps} direction="left" speed={scrollSpeed} />
          <ScrollingRow apps={apps} direction="right" speed={scrollSpeed} />
        </div>
      </div>
    </section>
  )
}

interface ScrollingRowProps {
  apps: App[]
  direction: 'left' | 'right'
  speed: number
}

function ScrollingRow({ apps, direction, speed }: ScrollingRowProps) {
  const duplicatedApps = [...apps, ...apps, ...apps]

  const handleLogoClick = (app: App) => {
    if (app.app_url) {
      window.open(app.app_url, '_blank', 'noopener,noreferrer')
    }
  }

  return (
    <div className="relative overflow-hidden group">
      <div
        className={`flex gap-4 ${direction === 'left' ? 'animate-scroll-left' : 'animate-scroll-right'}`}
        style={{
          animationDuration: `${speed}s`,
          width: 'fit-content',
        }}
      >
        {duplicatedApps.map((app, index) => (
          <div
            key={`${app.id}-${index}`}
            onClick={() => handleLogoClick(app)}
            className={`flex-shrink-0 relative flex flex-col items-center justify-center gap-3 w-28 md:w-36 rounded-2xl bg-white/[0.03] backdrop-blur-sm border border-white/[0.06] py-6 transition-all duration-500 hover:bg-white/[0.07] hover:border-white/[0.15] hover:scale-[1.03] ${
              app.app_url ? 'cursor-pointer' : ''
            }`}
            title={app.app_name}
          >
            <img
              src={app.logo_url}
              alt={app.app_name}
              className="w-14 h-14 md:w-18 md:h-18 object-contain opacity-80 grayscale-[30%] transition-all duration-500 hover:opacity-100 hover:grayscale-0"
              onError={(e) => {
                e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="128" height="128"%3E%3Crect fill="%23222" rx="16" width="128" height="128"/%3E%3Ctext fill="%23555" x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-size="11"%3E' + encodeURIComponent(app.app_name) + '%3C/text%3E%3C/svg%3E'
              }}
            />
            <span className="text-[11px] md:text-xs text-gray-400 font-medium tracking-wide truncate max-w-[90%]">
              {app.app_name}
            </span>
          </div>
        ))}
      </div>

      {/* Fade edges */}
      <div className="absolute top-0 left-0 w-24 md:w-40 h-full bg-gradient-to-r from-[#0A1628] to-transparent pointer-events-none z-10" />
      <div className="absolute top-0 right-0 w-24 md:w-40 h-full bg-gradient-to-l from-[#0A1628] to-transparent pointer-events-none z-10" />
    </div>
  )
}
