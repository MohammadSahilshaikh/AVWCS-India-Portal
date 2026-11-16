'use client'
import Link from 'next/link'
import { useLang } from '../ui/LangContext'

const footerLinks = [
  { href: '/', en: 'Home', hi: 'होम' },
  { href: '/how-it-works', en: 'How It Works', hi: 'कैसे काम करता है' },
  { href: '/explore', en: 'Explore', hi: 'एक्सप्लोर' },
  { href: '/simulator', en: 'Simulator', hi: 'सिमुलेटर' },
  { href: '/dashboard', en: 'Live Demo', hi: 'लाइव डैशबोर्ड' },
  { href: '/compare', en: 'Compare', hi: 'तुलना' },
  { href: '/pilot', en: 'Pilot Plan', hi: 'पायलट' },
  { href: '/paper', en: 'Paper', hi: 'रिसर्च' },
  { href: '/faq', en: 'FAQ', hi: 'सवाल-जवाब' },
  { href: '/about', en: 'About / Team', hi: 'प्रोजेक्ट टीम' },
  { href: '/contact', en: 'Contact', hi: 'संपर्क' },
]

export default function Footer() {
  const { lang } = useLang()
  const year = new Date().getFullYear()
  return (
    <footer className="border-t border-gray-200 mt-20" style={{ background: 'var(--brand-navy)' }}>
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-sm text-blue-200">
          {/* Brand */}
          <div>
            <div className="text-white font-bold text-lg mb-2">AVWCS India</div>
            <div className="leading-relaxed">
              {lang === 'hi'
                ? 'भारतीय स्मार्ट शहरों के लिए ऑटोमेटेड वैक्यूम कचरा संग्रह प्रणाली की व्यवहार्यता अध्ययन।'
                : 'Feasibility study for Automated Vacuum Waste Collection System in Indian smart cities.'}
            </div>
          </div>
          {/* Links */}
          <div>
            <div className="text-white font-semibold mb-3">{lang === 'hi' ? 'पेज' : 'Pages'}</div>
            <div className="grid grid-cols-2 gap-1.5">
              {footerLinks.map(l => (
                <Link key={l.href} href={l.href} className="hover:text-white transition-colors">
                  {lang === 'hi' ? l.hi : l.en}
                </Link>
              ))}
            </div>
          </div>
          {/* Disclaimer */}
          <div>
            <div className="text-white font-semibold mb-3">{lang === 'hi' ? 'अस्वीकरण एवं गोपनीयता' : 'Disclaimer & Privacy'}</div>
            <p className="leading-relaxed text-xs">
              {lang === 'hi'
                ? 'यह एक फ़ीज़िबिलिटी-स्तर अवधारणा अध्ययन है, न कि अंतिम इंजीनियरिंग डिज़ाइन या स्वीकृत सरकारी परियोजना। सभी लागत और ऊर्जा के आंकड़े साहित्य-आधारित अनुमान हैं; खरीद से पहले साइट-विशिष्ट DPR से सत्यापित करें।'
                : 'This is a feasibility-stage concept study, not a final engineering design, tender estimate, or approved city system. All cost and energy figures are preliminary estimates; verify with a site-specific DPR before procurement.'}
            </p>
            <p className="leading-relaxed text-xs mt-2 text-blue-300">
              {lang === 'hi'
                ? 'गोपनीयता: सिमुलेटर गणनाएं आपके ब्राउज़र में होती हैं; कोई व्यक्तिगत या इनपुट डेटा सर्वर पर संग्रहीत नहीं किया जाता।'
                : 'Privacy: Simulator calculations run locally in your browser; no personal or input data is stored on any server.'}
            </p>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-blue-800 text-xs text-blue-300 text-center">
          {lang === 'hi'
            ? `© ${year} AVWCS भारत व्यवहार्यता अध्ययन — IIT शोध पोर्टल`
            : `© ${year} AVWCS India Feasibility Study — IIT Research Portal`}
        </div>
      </div>
    </footer>
  )
}
