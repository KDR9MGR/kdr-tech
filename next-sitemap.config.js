/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://kdrtech.in',
  generateRobotsTxt: true,
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/api'],
      },
    ],
  },
  exclude: ['/admin', '/admin/*', '/api/*'],

  // Every public page in this app reads the Supabase session cookie (for
  // the logged-in-admin vs. anonymous-visitor content split), which forces
  // dynamic rendering — so there are no static HTML files in the build
  // output for next-sitemap to auto-discover. List routes explicitly here
  // instead, and pull published blog slugs in at build time.
  additionalPaths: async () => {
    const now = new Date().toISOString()
    const staticPaths = [
      { loc: '/', priority: 1.0 },
      { loc: '/blog', priority: 0.7 },
      { loc: '/contact-us', priority: 0.6 },
      { loc: '/privacy-policy', priority: 0.3 },
      { loc: '/terms-and-conditions', priority: 0.3 },
      { loc: '/refund-and-cancellation-policy', priority: 0.3 },
      { loc: '/shipping-and-delivery-policy', priority: 0.3 },
    ]

    const result = staticPaths.map((p) => ({
      loc: p.loc,
      changefreq: 'weekly',
      priority: p.priority,
      lastmod: now,
    }))

    try {
      const rawSupabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

      if (rawSupabaseUrl && supabaseAnonKey) {
        // Normalize in case the env var has a trailing /rest/v1/ or slash.
        const supabaseUrl = rawSupabaseUrl.replace(/\/rest\/v1\/?$/, '').replace(/\/$/, '')

        const res = await fetch(
          `${supabaseUrl}/rest/v1/blog_posts?select=slug,updated_at&status=eq.published`,
          { headers: { apikey: supabaseAnonKey, Authorization: `Bearer ${supabaseAnonKey}` } }
        )

        if (res.ok) {
          const posts = await res.json()
          for (const post of posts) {
            result.push({
              loc: `/blog/${post.slug}`,
              changefreq: 'monthly',
              priority: 0.6,
              lastmod: post.updated_at || now,
            })
          }
        }
      }
    } catch {
      // Non-fatal — the sitemap still ships with the static paths above
      // even if the blog-post fetch fails at build time.
    }

    return result
  },
}
