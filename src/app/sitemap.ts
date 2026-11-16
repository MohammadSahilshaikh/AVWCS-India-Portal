import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://avwcs-india.vercel.app'
  const routes = [
    '',
    '/how-it-works',
    '/explore',
    '/simulator',
    '/dashboard',
    '/compare',
    '/pilot',
    '/paper',
    '/faq',
    '/about',
    '/contact',
  ]
  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date('2026-11-11'),
    changeFrequency: 'monthly',
    priority: route === '' ? 1 : 0.8,
  }))
}
