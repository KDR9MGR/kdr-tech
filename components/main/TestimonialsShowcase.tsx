'use client'

import { useEffect, useState } from 'react'
import { Star, Quote, Play } from 'lucide-react'

interface TextTestimonial {
  id: string
  client_name: string
  client_company: string | null
  client_position: string | null
  testimonial_text: string
  rating: number | null
  visible: boolean
  order_index: number
}

interface VideoTestimonial {
  id: string
  client_name: string
  client_company: string | null
  video_url: string
  thumbnail_url: string | null
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
      } catch (error) {
        console.error('Failed to load testimonials:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchTestimonials()
  }, [])

  if (loading) {
    return null
  }

  if (textTestimonials.length === 0 && videoTestimonials.length === 0) {
    return null
  }

  return (
    <section className="w-full py-20 bg-transparent relative z-[10]">
      <div className="max-w-[1400px] mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-cyan-500 mb-4">
            Client Testimonials
          </h2>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Don&apos;t just take our word for it - hear what our clients have to say about their experience working with us
          </p>
        </div>

        {/* Video Testimonials */}
        {videoTestimonials.length > 0 && (
          <div className="mb-16">
            <h3 className="text-2xl font-bold text-white mb-8 text-center">
              Video Testimonials
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {videoTestimonials.map((testimonial) => (
                <div
                  key={testimonial.id}
                  className="group relative bg-[#1A1A2E] border border-[#2A0E61] rounded-xl overflow-hidden hover:border-purple-500 transition-all duration-300 cursor-pointer"
                  onClick={() => setSelectedVideo(testimonial.video_url)}
                >
                  <div className="relative aspect-video bg-[#030014]">
                    {testimonial.thumbnail_url ? (
                      <img
                        src={testimonial.thumbnail_url}
                        alt={testimonial.client_name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-900/30 to-cyan-900/30">
                        <Play className="w-16 h-16 text-purple-400" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-all flex items-center justify-center">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Play className="w-8 h-8 text-white ml-1" />
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <h4 className="text-lg font-semibold text-white mb-1">
                      {testimonial.client_name}
                    </h4>
                    {testimonial.client_company && (
                      <p className="text-sm text-purple-400">
                        {testimonial.client_company}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Text Testimonials */}
        {textTestimonials.length > 0 && (
          <div>
            <h3 className="text-2xl font-bold text-white mb-8 text-center">
              What Our Clients Say
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {textTestimonials.map((testimonial) => (
                <div
                  key={testimonial.id}
                  className="bg-[#1A1A2E] border border-[#2A0E61] rounded-xl p-6 hover:border-purple-500 transition-all duration-300 flex flex-col"
                >
                  {/* Rating */}
                  {testimonial.rating && (
                    <div className="flex gap-1 mb-4">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 ${
                            i < testimonial.rating!
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-600'
                          }`}
                        />
                      ))}
                    </div>
                  )}

                  {/* Quote Icon */}
                  <Quote className="w-10 h-10 text-purple-500 mb-4 opacity-50" />

                  {/* Testimonial Text */}
                  <p className="text-gray-300 mb-6 flex-1 leading-relaxed">
                    &quot;{testimonial.testimonial_text}&quot;
                  </p>

                  {/* Client Info */}
                  <div className="border-t border-[#2A0E61] pt-4">
                    <p className="text-white font-semibold">
                      {testimonial.client_name}
                    </p>
                    {testimonial.client_position && testimonial.client_company && (
                      <p className="text-sm text-purple-400">
                        {testimonial.client_position} at {testimonial.client_company}
                      </p>
                    )}
                    {!testimonial.client_position && testimonial.client_company && (
                      <p className="text-sm text-purple-400">
                        {testimonial.client_company}
                      </p>
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
              className="absolute -top-12 right-0 text-white hover:text-purple-400 transition-colors text-xl font-bold"
            >
              ✕ Close
            </button>
            <iframe
              src={selectedVideo}
              className="w-full h-full rounded-lg"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </section>
  )
}
