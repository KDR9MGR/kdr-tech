'use client'

import { useEffect, useRef, useState } from 'react'
import { Star, Quote, Volume2, VolumeX } from 'lucide-react'

interface TextTestimonial {
  id: string
  client_name: string
  company_name: string | null
  project_name: string | null
  testimonial: string
  avatar_url: string | null
  rating: number | null
  country: string | null
  visible: boolean
  order_index: number
}

interface VideoTestimonial {
  id: string
  client_name: string
  company_name: string | null
  project_name: string | null
  video_url: string
  thumbnail_url: string | null
  country: string | null
  visible: boolean
  order_index: number
}

function isPortrait(url: string): boolean {
  // Heuristic: Supabase-stored vertical videos often have "portrait" or "shorts" in path
  // Default to landscape; admin can control this via aspect ratio of uploaded video
  return url.includes('portrait') || url.includes('shorts') || url.includes('vertical')
}

function VideoCard({ testimonial }: { testimonial: VideoTestimonial }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [muted, setMuted] = useState(true)
  const portrait = isPortrait(testimonial.video_url)

  const toggleMute = () => {
    if (!videoRef.current) return
    videoRef.current.muted = !videoRef.current.muted
    setMuted(videoRef.current.muted)
  }

  return (
    <div className="group relative bg-[#0a0f1e] border border-[#1E3A5F] rounded-2xl overflow-hidden hover:border-[#2563EB]/50 transition-all duration-300 flex flex-col shadow-xl shadow-black/40">
      {/* Native video */}
      <div className={`relative w-full bg-black ${portrait ? 'aspect-[9/16]' : 'aspect-video'}`}>
        <video
          ref={videoRef}
          src={testimonial.video_url}
          poster={testimonial.thumbnail_url || undefined}
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Mute toggle */}
        <button
          onClick={toggleMute}
          className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-black/70 hover:bg-black flex items-center justify-center transition-all border border-white/10 backdrop-blur-sm"
          title={muted ? 'Unmute' : 'Mute'}
        >
          {muted
            ? <VolumeX className="w-4 h-4 text-white" />
            : <Volume2 className="w-4 h-4 text-white" />
          }
        </button>
      </div>

      {/* Client info */}
      <div className="px-4 py-3 flex items-center gap-3 border-t border-[#1E3A5F]">
        <div className="w-8 h-8 rounded-full bg-[#2563EB]/20 border border-[#2563EB]/30 flex items-center justify-center text-xs font-bold text-[#2563EB] flex-shrink-0">
          {testimonial.client_name.charAt(0)}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-white truncate">{testimonial.client_name}</p>
          {(testimonial.company_name || testimonial.country) && (
            <p className="text-xs text-[#2563EB] truncate">
              {testimonial.company_name || ''}
              {testimonial.company_name && testimonial.country ? ' · ' : ''}
              {testimonial.country || ''}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default function TestimonialsShowcase() {
  const [textTestimonials, setTextTestimonials] = useState<TextTestimonial[]>([])
  const [videoTestimonials, setVideoTestimonials] = useState<VideoTestimonial[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const [textRes, videoRes] = await Promise.all([
          fetch('/api/testimonials/text'),
          fetch('/api/testimonials/video'),
        ])
        const textData = await textRes.json()
        const videoData = await videoRes.json()
        setTextTestimonials(textData.filter((t: TextTestimonial) => t.visible))
        setVideoTestimonials(videoData.filter((v: VideoTestimonial) => v.visible))
      } catch {
        // no-op
      } finally {
        setLoading(false)
      }
    }
    fetchTestimonials()
  }, [])

  if (loading || (textTestimonials.length === 0 && videoTestimonials.length === 0)) {
    return null
  }

  const portraitVideos = videoTestimonials.filter(v => isPortrait(v.video_url))
  const landscapeVideos = videoTestimonials.filter(v => !isPortrait(v.video_url))

  return (
    <section id="testimonials" className="w-full py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="text-center mb-14">
          <p className="text-sm font-semibold tracking-[0.2em] uppercase text-[#2563EB] mb-3">
            Testimonials
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            What Our Clients Say
          </h2>
          <p className="text-lg text-[#94A3B8] max-w-2xl mx-auto">
            We let our clients do the talking.
          </p>
        </div>

        {/* Landscape videos — 2-col wide grid */}
        {landscapeVideos.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {landscapeVideos.map(v => (
              <VideoCard key={v.id} testimonial={v} />
            ))}
          </div>
        )}

        {/* Portrait videos — narrow column grid */}
        {portraitVideos.length > 0 && (
          <div className={`grid gap-5 mb-8 ${
            portraitVideos.length === 1
              ? 'grid-cols-1 max-w-xs mx-auto'
              : portraitVideos.length === 2
              ? 'grid-cols-2 max-w-lg mx-auto'
              : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4'
          }`}>
            {portraitVideos.map(v => (
              <VideoCard key={v.id} testimonial={v} />
            ))}
          </div>
        )}

        {/* Text Testimonials */}
        {textTestimonials.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
            {textTestimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="bg-[#0F2040] border border-[#1E3A5F] rounded-2xl p-6 hover:border-[#2563EB]/40 transition-all duration-200 card-glow flex flex-col"
              >
                {testimonial.rating && (
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`w-4 h-4 ${i < testimonial.rating! ? 'fill-yellow-400 text-yellow-400' : 'text-[#1E3A5F]'}`} />
                    ))}
                  </div>
                )}
                <Quote className="w-8 h-8 text-[#2563EB] mb-3 opacity-40" />
                <p className="text-[#94A3B8] mb-6 flex-1 leading-relaxed text-sm">
                  &ldquo;{testimonial.testimonial}&rdquo;
                </p>
                <div className="border-t border-[#1E3A5F] pt-4 flex items-center gap-3">
                  {testimonial.avatar_url ? (
                    <img src={testimonial.avatar_url} alt={testimonial.client_name}
                      className="w-9 h-9 rounded-full object-cover" />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-[#2563EB]/10 border border-[#2563EB]/20 flex items-center justify-center text-sm font-bold text-[#2563EB]">
                      {testimonial.client_name.charAt(0)}
                    </div>
                  )}
                  <div>
                    <p className="text-white font-semibold text-sm">{testimonial.client_name}</p>
                    <p className="text-xs text-[#2563EB]">
                      {testimonial.company_name || testimonial.project_name || ''}
                      {testimonial.country && ` · ${testimonial.country}`}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
