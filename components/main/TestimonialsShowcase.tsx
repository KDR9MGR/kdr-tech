'use client'

import { useEffect, useState } from 'react'
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

// Extract YouTube video ID from any YouTube URL format
function getYouTubeId(url: string): string | null {
  const patterns = [
    /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/,
    /youtu\.be\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
  ]
  for (const re of patterns) {
    const m = url.match(re)
    if (m) return m[1]
  }
  return null
}

function getVimeoId(url: string): string | null {
  const m = url.match(/vimeo\.com\/(\d+)/)
  return m ? m[1] : null
}

function isShorts(url: string): boolean {
  return url.includes('/shorts/')
}

function getEmbedUrl(url: string, muted: boolean): string {
  const ytId = getYouTubeId(url)
  if (ytId) {
    const muteParam = muted ? '&mute=1' : '&mute=0'
    return `https://www.youtube.com/embed/${ytId}?autoplay=1${muteParam}&loop=1&playlist=${ytId}&playsinline=1&rel=0&modestbranding=1`
  }
  const vimeoId = getVimeoId(url)
  if (vimeoId) {
    const muteParam = muted ? '&muted=1' : '&muted=0'
    return `https://player.vimeo.com/video/${vimeoId}?autoplay=1${muteParam}&loop=1&background=0`
  }
  return url
}

function VideoCard({ testimonial }: { testimonial: VideoTestimonial }) {
  const [muted, setMuted] = useState(true)
  const portrait = isShorts(testimonial.video_url)
  const embedUrl = getEmbedUrl(testimonial.video_url, muted)

  return (
    <div className={`group relative bg-[#0F2040] border border-[#1E3A5F] rounded-2xl overflow-hidden hover:border-[#2563EB]/40 transition-all duration-200 card-glow flex flex-col ${portrait ? 'max-w-[320px] mx-auto' : ''}`}>
      {/* Video embed */}
      <div className={`relative w-full bg-[#0A1628] ${portrait ? 'aspect-[9/16]' : 'aspect-video'}`}>
        <iframe
          key={`${testimonial.id}-${muted}`}
          src={embedUrl}
          className="absolute inset-0 w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />

        {/* Mute/unmute toggle */}
        <button
          onClick={() => setMuted(prev => !prev)}
          className="absolute bottom-3 right-3 z-10 w-9 h-9 rounded-full bg-black/70 hover:bg-black/90 flex items-center justify-center transition-all border border-white/10 backdrop-blur-sm"
          title={muted ? 'Unmute' : 'Mute'}
        >
          {muted
            ? <VolumeX className="w-4 h-4 text-white" />
            : <Volume2 className="w-4 h-4 text-white" />
          }
        </button>
      </div>

      {/* Client info */}
      <div className="p-4">
        <h4 className="text-base font-semibold text-white mb-0.5">{testimonial.client_name}</h4>
        {testimonial.company_name && (
          <p className="text-sm text-[#2563EB]">{testimonial.company_name}</p>
        )}
        {testimonial.country && (
          <p className="text-xs text-[#94A3B8] mt-0.5">{testimonial.country}</p>
        )}
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

        {/* Video Testimonials — shown first if present */}
        {videoTestimonials.length > 0 && (
          <div className="mb-14">
            <div className={`grid gap-6 ${
              videoTestimonials.every(v => isShorts(v.video_url))
                ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
                : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
            }`}>
              {videoTestimonials.map((testimonial) => (
                <VideoCard key={testimonial.id} testimonial={testimonial} />
              ))}
            </div>
          </div>
        )}

        {/* Text Testimonials */}
        {textTestimonials.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {textTestimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="bg-[#0F2040] border border-[#1E3A5F] rounded-2xl p-6 hover:border-[#2563EB]/40 transition-all duration-200 card-glow flex flex-col"
              >
                {testimonial.rating && (
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < testimonial.rating!
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-[#1E3A5F]'
                        }`}
                      />
                    ))}
                  </div>
                )}
                <Quote className="w-8 h-8 text-[#2563EB] mb-3 opacity-40" />
                <p className="text-[#94A3B8] mb-6 flex-1 leading-relaxed text-sm">
                  &ldquo;{testimonial.testimonial}&rdquo;
                </p>
                <div className="border-t border-[#1E3A5F] pt-4 flex items-center gap-3">
                  {testimonial.avatar_url ? (
                    <img
                      src={testimonial.avatar_url}
                      alt={testimonial.client_name}
                      className="w-9 h-9 rounded-full object-cover"
                    />
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
