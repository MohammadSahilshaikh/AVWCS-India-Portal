'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'
import { useLang } from '../ui/LangContext'

const navLinks = [
  { href: '/', en: 'Home', hi: 'होम' },
  { href: '/how-it-works', en: 'How It Works', hi: 'कैसे काम करता है' },
  { href: '/explore', en: 'Explore', hi: 'एक्सप्लोर' },
  { href: '/simulator', en: 'Simulator', hi: 'सिमुलेटर' },
  { href: '/compare', en: 'Compare', hi: 'तुलना' },
  { href: '/pilot', en: 'Pilot Plan', hi: 'पायलट' },
  { href: '/paper', en: 'Paper', hi: 'रिसर्च' },
  { href: '/contact', en: 'Contact', hi: 'संपर्क' },
]

export default function Navbar() {
  const pathname = usePathname()
  const { lang, toggle } = useLang()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav className={`sticky top-0 z-50 w-full transition-all duration-200 ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm' : 'bg-white/90 backdrop-blur-sm'}`}
      style={{ borderBottom: '1px solid #e5e7eb' }}>
      <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex flex-col leading-tight" onClick={() => setOpen(false)}>
          <span className="font-bold text-lg" style={{ color: 'var(--brand-navy)' }}>AVWCS</span>
          <span className="text-xs" style={{ color: 'var(--brand-slate)' }}>
            {lang === 'hi' ? 'भारतीय स्मार्ट कचरा' : 'India Smart Waste'}
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden lg:flex items-center gap-1">
          {navLinks.map(link => {
            const isActive = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'text-white'
                    : 'hover:bg-gray-100'
                }`}
                style={isActive ? { backgroundColor: 'var(--brand-orange)', color: 'white' } : { color: 'var(--brand-navy)' }}
              >
                {lang === 'hi' ? link.hi : link.en}
              </Link>
            )
          })}
        </div>

        {/* Right: lang toggle + hamburger */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggle}
            aria-label={lang === 'hi' ? 'Switch to English' : 'हिंदी में बदलें'}
            className="px-3 py-1.5 text-sm font-semibold rounded-lg border-2 transition-colors cursor-pointer"
            style={{ borderColor: 'var(--brand-orange)', color: 'var(--brand-orange)' }}
          >
            {lang === 'en' ? 'हिं' : 'EN'}
          </button>
          <button
            type="button"
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 cursor-pointer"
            onClick={() => setOpen(o => !o)}
            aria-label={lang === 'hi' ? 'नेविगेशन मेनू खोलें या बंद करें' : 'Toggle menu'}
            aria-expanded={open}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden border-t border-gray-200 bg-white px-4 py-3 flex flex-col gap-1">
          {navLinks.map(link => {
            const isActive = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive ? 'text-white' : ''
                }`}
                style={isActive ? { backgroundColor: 'var(--brand-orange)' } : { color: 'var(--brand-navy)' }}
              >
                {lang === 'hi' ? link.hi : link.en}
              </Link>
            )
          })}
        </div>
      )}
    </nav>
  )
}
