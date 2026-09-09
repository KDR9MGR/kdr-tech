const fs = require('fs')
const path = require('path')

function loadEnvFile(fileName) {
  const filePath = path.join(__dirname, fileName)
  if (!fs.existsSync(filePath)) return

  const contents = fs.readFileSync(filePath, 'utf8')
  for (const rawLine of contents.split(/\r?\n/)) {
    const line = rawLine.trim()
    if (!line || line.startsWith('#')) continue

    const withoutExport = line.startsWith('export ') ? line.slice('export '.length) : line
    const equalsIndex = withoutExport.indexOf('=')
    if (equalsIndex === -1) continue

    const key = withoutExport.slice(0, equalsIndex).trim()
    if (!key) continue

    let value = withoutExport.slice(equalsIndex + 1).trim()
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }

    if (process.env[key] === undefined) {
      process.env[key] = value
    }
  }
}

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  loadEnvFile('local.env')
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY

/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  env: {
    NEXT_PUBLIC_SUPABASE_URL: supabaseUrl,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: supabaseAnonKey,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ecdbvjqgqwhttdgfnzzr.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
  async headers() {
    return [
      {
        // Security headers on every response.
        //
        // img-src/media-src are intentionally broad (https: from anywhere):
        // the admin CMS lets an authenticated user enter arbitrary
        // third-party URLs for client portfolio logos (app_showcase) and
        // testimonial videos (VideoTestimonialForm accepts any direct video
        // URL, not just YouTube/Vimeo) — there's no fixed set of domains to
        // allow-list. That's fine: <img>/<video> can't execute script, so
        // this doesn't weaken XSS protection. The load-bearing directives
        // against XSS/clickjacking here are script-src, object-src,
        // base-uri, and frame-ancestors.
        //
        // script-src keeps 'unsafe-inline'/'unsafe-eval' because Next.js
        // injects inline hydration scripts and the homepage uses
        // react-three-fiber/framer-motion; tighten with nonces if that's
        // ever revisited. frame-ancestors 'none' is the modern equivalent
        // of X-Frame-Options: DENY and is what actually stops /admin/login
        // from being framed for clickjacking.
        source: '/:path*',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "img-src 'self' data: blob: https:",
              "media-src 'self' https:",
              "frame-src 'self' https://www.youtube.com https://player.vimeo.com https://*.supabase.co",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
              "style-src 'self' 'unsafe-inline'",
              "font-src 'self' data:",
              "connect-src 'self' https://*.supabase.co wss://*.supabase.co",
              "object-src 'none'",
              "base-uri 'self'",
              "frame-ancestors 'none'",
            ].join('; '),
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig
