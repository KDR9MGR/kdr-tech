'use client'

import { useEffect, useState } from 'react'
import { Star, Quote, Play } from 'lucide-react'

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

export default function TestimonialsShowcase() {
  const [textTestimonials, setTextTestimonials] = useState<TextTestimonial[]>([])
  const [videoTestimonials, setVideoTestimonials] = useState<VideoTestimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null)

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

        {/* Text Testimonials */}
        {textTestimonials.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {textTestimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="bg-[#0F2040] border border-[#1E3A5F] rounded-2xl p-6 hover:border-[#2563EB]/40 transition-all duration-200 card-glow flex flex-col"
              >
                {/* Rating */}
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

                {/* Quote */}
                <Quote className="w-8 h-8 text-[#2563EB] mb-3 opacity-40" />

                {/* Text */}
                <p className="text-[#94A3B8] mb-6 flex-1 leading-relaxed text-sm">
                  &ldquo;{testimonial.testimonial}&rdquo;
                </p>

                {/* Client info */}
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

        {/* Video Testimonials */}
        {videoTestimonials.length > 0 && (
          <div>
            <h3 className="text-xl font-bold text-white mb-6 text-center">Video Testimonials</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {videoTestimonials.map((testimonial) => (
                <div
                  key={testimonial.id}
                  className="group relative bg-[#0F2040] border border-[#1E3A5F] rounded-2xl overflow-hidden hover:border-[#2563EB]/40 transition-all duration-200 cursor-pointer card-glow"
                  onClick={() => setSelectedVideo(testimonial.video_url)}
                >
                  <div className="relative aspect-video bg-[#0A1628]">
                    {testimonial.thumbnail_url ? (
                      <img
                        src={testimonial.thumbnail_url}
                        alt={testimonial.client_name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#0F2040] to-[#0A1628]">
                        <Play className="w-12 h-12 text-[#2563EB]/40" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-all flex items-center justify-center">
                      <div className="w-14 h-14 rounded-full bg-[#2563EB] flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-blue-900/40">
                        <Play className="w-6 h-6 text-white ml-1" />
                      </div>
                    </div>
                  </div>
                  <div className="p-5">
                    <h4 className="text-base font-semibold text-white mb-0.5">{testimonial.client_name}</h4>
                    {testimonial.company_name && (
                      <p className="text-sm text-[#2563EB]">{testimonial.company_name}</p>
                    )}
                    {testimonial.country && (
                      <p className="text-xs text-[#94A3B8] mt-0.5">{testimonial.country}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Video Modal */}
      {selectedVideo && (
        <div
          className="fixed inset-0 bg-black/90 z-[100] flex items-center justify-center p-4"
          onClick={() => setSelectedVideo(null)}
        >
          <div
            className="relative w-full max-w-4xl aspect-video"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedVideo(null)}
              className="absolute -top-12 right-0 text-white hover:text-[#2563EB] transition-colors font-semibold text-sm"
            >
              ✕ Close
            </button>
            <iframe
              src={selectedVideo}
              className="w-full h-full rounded-xl"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </section>
  )
}
