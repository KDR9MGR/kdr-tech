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
}

module.exports = nextConfig
