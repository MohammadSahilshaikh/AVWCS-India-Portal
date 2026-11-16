'use client'

import { motion, useInView } from 'framer-motion'
import { useState, useRef, useEffect, Fragment } from 'react'
import Link from 'next/link'
import T from '@/components/ui/T'
import { useLang } from '@/components/ui/LangContext'
import SourceTag from '@/components/ui/SourceTag'

// ─── Animated counter hook ───────────────────────────────────────────────────
function useCountUp(target: number, decimals = 0, duration = 1200) {
  const [value, setValue] = useState(target)
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.2 })

  useEffect(() => {
    if (!inView) return
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setValue(target)
      return
    }
    let rafId = 0
    const startTime = performance.now()
    setValue(0)

    const tick = (now: number) => {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      const current = target * eased
      setValue(current)
      if (progress < 1) {
        rafId = requestAnimationFrame(tick)
      } else {
        setValue(target)
      }
    }

    rafId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafId)
  }, [inView, target, duration])

  const formatted =
    decimals > 0
      ? value.toFixed(decimals)
      : Math.round(value).toLocaleString('en-IN')

  return { ref, formatted }
}

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({
  target,
  decimals = 0,
  suffix = '',
  label,
}: {
  target: number
  decimals?: number
  suffix?: string
  label: React.ReactNode
}) {
  const { ref, formatted } = useCountUp(target, decimals)

  return (
    <div className="flex flex-col items-center justify-center bg-white rounded-2xl shadow-sm p-4 sm:p-6 border border-gray-100">
      <span
        ref={ref}
        className="text-2xl sm:text-3xl md:text-4xl font-bold text-center whitespace-nowrap"
        style={{ color: 'var(--brand-green)' }}
      >
        {formatted}
        {suffix}
      </span>
      <span className="mt-2 text-xs sm:text-sm text-center" style={{ color: 'var(--brand-slate)' }}>
        {label}
      </span>
    </div>
  )
}

// ─── Hero SVG Animation ───────────────────────────────────────────────────────
function HeroDiagram({ lang }: { lang: 'en' | 'hi' }) {
  const isHi = lang === 'hi'

  return (
    <div className="flex justify-center items-center w-full">
      <svg
        viewBox="0 0 400 300"
        className="w-full max-w-[420px] h-auto"
        aria-label={isHi ? 'AVWCS प्रणाली आरेख' : 'AVWCS system diagram'}
      >
        <style>{`
          @keyframes travelDot {
            0%   { offset-distance: 0%;   opacity: 0; }
            6%   { offset-distance: 6%;   opacity: 1; }
            82%  { offset-distance: 100%; opacity: 1; }
            92%  { offset-distance: 100%; opacity: 0; }
            100% { offset-distance: 0%;   opacity: 0; }
          }
          .travel-dot-1,
          .travel-dot-2,
          .travel-dot-3 {
            opacity: 0;
          }
          .travel-dot-1 {
            offset-path: path("M 60 82 L 60 140 Q 60 190 220 210 L 335 210");
            animation: travelDot 6s 0s linear infinite;
          }
          .travel-dot-2 {
            offset-path: path("M 160 82 L 160 140 Q 160 190 220 210 L 335 210");
            animation: travelDot 6s 2s linear infinite;
          }
          .travel-dot-3 {
            offset-path: path("M 260 82 L 260 140 Q 260 190 220 210 L 335 210");
            animation: travelDot 6s 4s linear infinite;
          }
        `}</style>

        {/* Ground line */}
        <line x1="10" y1="140" x2="390" y2="140" stroke="#d1d5db" strokeWidth="1.5" strokeDasharray="6,4" />
        <text x="12" y="134" fontSize="9" fill="#6b7280">
          {isHi ? 'ज़मीनी स्तर' : 'ground level'}
        </text>

        {/* Inlet circles & chutes */}
        {/* Green - organic */}
        <circle cx="60" cy="60" r="22" fill="#16A34A" opacity="0.92" />
        <text x="60" y="55" textAnchor="middle" fontSize="9" fill="white" fontWeight="bold">
          {isHi ? 'जैविक' : 'Organic'}
        </text>
        <text x="60" y="67" textAnchor="middle" fontSize="8" fill="white">
          {isHi ? 'इनलेट' : 'Inlet'}
        </text>
        <line x1="60" y1="82" x2="60" y2="140" stroke="#16A34A" strokeWidth="3" />

        {/* Blue - recyclable */}
        <circle cx="160" cy="60" r="22" fill="#3B82F6" opacity="0.92" />
        <text x="160" y="55" textAnchor="middle" fontSize="8.5" fill="white" fontWeight="bold">
          {isHi ? 'रीसाइकिल' : 'Recycle'}
        </text>
        <text x="160" y="67" textAnchor="middle" fontSize="8" fill="white">
          {isHi ? 'इनलेट' : 'Inlet'}
        </text>
        <line x1="160" y1="82" x2="160" y2="140" stroke="#3B82F6" strokeWidth="3" />

        {/* Gray - residual */}
        <circle cx="260" cy="60" r="22" fill="#6B7280" opacity="0.92" />
        <text x="260" y="55" textAnchor="middle" fontSize="9" fill="white" fontWeight="bold">
          {isHi ? 'शेष' : 'Residual'}
        </text>
        <text x="260" y="67" textAnchor="middle" fontSize="8" fill="white">
          {isHi ? 'इनलेट' : 'Inlet'}
        </text>
        <line x1="260" y1="82" x2="260" y2="140" stroke="#6B7280" strokeWidth="3" />

        {/* Underground pipes */}
        <path d="M 60 140 Q 60 190 220 210" fill="none" stroke="#374151" strokeWidth="3" strokeLinecap="round" />
        <path d="M 160 140 Q 160 190 220 210" fill="none" stroke="#374151" strokeWidth="3" strokeLinecap="round" />
        <path d="M 260 140 Q 260 190 220 210" fill="none" stroke="#374151" strokeWidth="3" strokeLinecap="round" />
        {/* Pipe from confluence to terminal */}
        <path d="M 220 210 L 322 210" fill="none" stroke="#374151" strokeWidth="3" strokeLinecap="round" />

        {/* Underground label (clear of pipe paths and legend) */}
        <text x="18" y="232" fontSize="9" fill="#6B7280" fontStyle="italic">
          {isHi ? 'भूमिगत पाइप (सीलबंद)' : 'underground pipes (sealed)'}
        </text>

        {/* Animated dots (rendered before Terminal box so they enter inside cleanly) */}
        <circle className="travel-dot-1" r="6" fill="#16A34A" />
        <circle className="travel-dot-2" r="6" fill="#3B82F6" />
        <circle className="travel-dot-3" r="6" fill="#6B7280" />

        {/* Arrow to terminal */}
        <polygon points="322,210 312,205 312,215" fill="#374151" />

        {/* Terminal rectangle */}
        <rect x="322" y="182" width="70" height="54" rx="8" fill="#EA580C" />
        <text x="357" y="202" textAnchor="middle" fontSize="9.5" fill="white" fontWeight="bold">
          {isHi ? 'टर्मिनल' : 'Terminal'}
        </text>
        <text x="357" y="216" textAnchor="middle" fontSize="7.5" fill="white">
          {isHi ? '60–80 किमी/घं.' : '60–80 km/h'}
        </text>
        <text x="357" y="228" textAnchor="middle" fontSize="8" fill="white">
          {isHi ? 'वैक्यूम' : 'vacuum'}
        </text>

        {/* Legend */}
        <rect x="6" y="255" width="388" height="38" rx="6" fill="#f9fafb" stroke="#e5e7eb" />
        <circle cx="22" cy="274" r="5" fill="#16A34A" />
        <text x="32" y="277" fontSize="9" fill="#374151">
          {isHi ? 'जैविक' : 'Organic'}
        </text>
        <circle cx="96" cy="274" r="5" fill="#3B82F6" />
        <text x="106" y="277" fontSize="9" fill="#374151">
          {isHi ? 'रीसाइकिल' : 'Recyclable'}
        </text>
        <circle cx="178" cy="274" r="5" fill="#6B7280" />
        <text x="188" y="277" fontSize="9" fill="#374151">
          {isHi ? 'शेष' : 'Residual'}
        </text>
        <rect x="242" y="269" width="12" height="10" rx="2" fill="#EA580C" />
        <text x="259" y="277" fontSize="9" fill="#374151">
          {isHi ? 'संग्रह टर्मिनल' : 'Collection Terminal'}
        </text>
      </svg>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function HomePage() {
  const { lang } = useLang()
  const [activeTab, setActiveTab] = useState(0)

  const tabs = {
    en: ['For Government / ULB', 'For Builders / Developers', 'For Campus / Hospital / Airport'],
    hi: ['सरकार / ULB के लिए', 'बिल्डर / डेवलपर के लिए', 'कैंपस / अस्पताल / एयरपोर्ट के लिए'],
  }

  const tabContent = [
    {
      en: [
        'Eliminate manual scavenging and open dumpsites',
        'Comply with SWM Rules 2026 source segregation mandate',
        'Reduce municipal truck fleet O&M costs over 20 years',
      ],
      hi: [
        'मैनुअल स्कैवेंजिंग और खुले लैंडफिल खत्म करें',
        'SWM नियम 2026 का पालन सुनिश्चित करें',
        '20 साल में ट्रक बेड़े की रखरखाव लागत कम करें',
      ],
    },
    {
      en: [
        'No internal garbage truck lanes — more usable land',
        'Premium livability = higher property values',
        'One-time installation with water/sewer trenches',
      ],
      hi: [
        'गलियों में ट्रक नहीं — ज़मीन का बेहतर उपयोग',
        'बेहतर जीवनशैली = ऊँची प्रॉपर्टी वैल्यू',
        'पानी/सीवर खुदाई के साथ एक बार स्थापना',
      ],
    },
    {
      en: [
        'Zero waste trucks inside campus perimeter',
        'Sealed inlets in corridors and buildings',
        'SCADA monitoring integrates with smart campus systems',
      ],
      hi: [
        'कैंपस के अंदर कोई कचरा ट्रक नहीं',
        'कॉरिडोर और बिल्डिंग में बंद इनलेट',
        'SCADA मॉनिटरिंग स्मार्ट कैंपस से जुड़ती है',
      ],
    },
  ]

  const currentTabs = lang === 'hi' ? tabs.hi : tabs.en

  return (
    <div style={{ background: '#FAFAF8' }}>
      {/* ══════════════════════ A: HERO ══════════════════════ */}
      <section className="relative flex items-center min-h-[85vh] overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 md:px-8 w-full py-12 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-12 items-center">
            {/* Left text */}
            <motion.div
              initial={false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="flex flex-col gap-6"
            >
              {/* Badge */}
              <span
                className="inline-flex items-center w-fit px-4 py-1.5 rounded-full text-sm font-semibold text-white"
                style={{ background: 'var(--brand-orange)' }}
              >
                <T
                  en="🏙️ Smart Cities India | SWM 2026"
                  hi="🏙️ स्मार्ट सिटी भारत | SWM 2026"
                />
              </span>

              {/* H1 */}
              <h1
                className="text-3xl md:text-5xl lg:text-6xl font-bold leading-tight"
                style={{ color: 'var(--brand-navy)' }}
              >
                <T
                  en="Garbage travels underground, not through your street."
                  hi="कचरा गली से नहीं, ज़मीन के नीचे से जाएगा"
                />
              </h1>

              {/* Subline */}
              <p className="text-lg leading-relaxed" style={{ color: 'var(--brand-slate)' }}>
                <T
                  en="Automated Vacuum Waste Collection System: sealed, odour-free and truck-free waste collection for India's planned townships."
                  hi="ऑटोमेटेड वैक्यूम वेस्ट कलेक्शन सिस्टम: भारतीय स्मार्ट सिटी के लिए बंद, बदबू-मुक्त और ट्रक-मुक्त कचरा संग्रह।"
                />
              </p>

              {/* Buttons */}
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/how-it-works"
                  className="inline-flex items-center px-6 py-3 rounded-xl text-white font-semibold text-base transition-opacity hover:opacity-90"
                  style={{ background: 'var(--brand-orange)' }}
                >
                  <T en="How It Works →" hi="कैसे काम करता है →" />
                </Link>
                <Link
                  href="/pilot"
                  className="inline-flex items-center px-6 py-3 rounded-xl font-semibold text-base border-2 transition-colors hover:bg-blue-50"
                  style={{ borderColor: 'var(--brand-navy)', color: 'var(--brand-navy)' }}
                >
                  <T en="View Pilot Proposal" hi="पायलट प्रस्ताव देखें" />
                </Link>
              </div>

              {/* SRS §6.1 clear feasibility status note */}
              <p className="text-xs text-slate-500 border-l-2 border-orange-400 pl-3 py-0.5">
                <T
                  en="Feasibility study concept — not an approved or operational municipal system."
                  hi="फ़ीज़िबिलिटी अध्ययन अवधारणा — यह स्वीकृत या चालू सरकारी परियोजना नहीं है।"
                />
              </p>
            </motion.div>

            {/* Right SVG */}
            <motion.div
              initial={false}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.45, ease: 'easeOut' }}
            >
              <HeroDiagram lang={lang} />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══════════════════════ B: PROBLEM STRIP ══════════════════════ */}
      <section className="py-16" style={{ background: '#F1F5F9' }}>
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: '🗑️',
                titleEn: 'Open Bins & Odour',
                titleHi: 'खुले कूड़ेदान और बदबू',
                descEn: 'Garbage sits open on streets, attracting flies and stray animals.',
                descHi: 'कचरा सड़क पर खुला पड़ा रहता है।',
              },
              {
                icon: '🚛',
                titleEn: 'Trucks & Traffic',
                titleHi: 'ट्रक और ट्रैफिक',
                descEn: 'Daily diesel trucks clog narrow streets with noise and exhaust.',
                descHi: 'रोज़ डीज़ल ट्रक गलियों में धुआँ और जाम लाते हैं।',
              },
              {
                icon: '⚠️',
                titleEn: 'Worker Health Risk',
                titleHi: 'मज़दूर का स्वास्थ्य खतरा',
                descEn: 'Sanitation workers handle mixed waste directly without protection.',
                descHi: 'सफ़ाई कर्मी बिना सुरक्षा के मिला-जुला कचरा उठाते हैं।',
              },
            ].map((card, i) => (
              <div
                key={i}
                className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 flex flex-col gap-3"
              >
                <span className="text-4xl">{card.icon}</span>
                <h3 className="text-lg font-bold" style={{ color: 'var(--brand-navy)' }}>
                  <T en={card.titleEn} hi={card.titleHi} />
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--brand-slate)' }}>
                  <T en={card.descEn} hi={card.descHi} />
                </p>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <p className="text-base italic mb-3" style={{ color: 'var(--brand-slate)' }}>
              <T
                en="That is why a different approach is needed."
                hi="इसीलिए एक अलग तरीका चाहिए।"
              />
            </p>
            <Link
              href="/how-it-works"
              className="text-sm font-medium underline"
              style={{ color: 'var(--brand-orange)' }}
            >
              <T en="Learn about AVWCS →" hi="AVWCS के बारे में जानें →" />
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════ C: 3 STEPS ══════════════════════ */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <h2
            className="text-2xl md:text-3xl font-bold text-center mb-12"
            style={{ color: 'var(--brand-navy)' }}
          >
            <T en="How AVWCS Works — in 3 Steps" hi="AVWCS कैसे काम करता है — 3 चरणों में" />
          </h2>

          <div className="flex flex-col md:flex-row items-stretch">
            {[
              {
                num: '①',
                titleEn: 'Deposit',
                titleHi: 'जमा करें',
                descEn: 'Residents drop waste in color-coded sealed inlets.',
                descHi: 'नागरिक रंगीन बंद इनलेट में कचरा डालते हैं।',
              },
              {
                num: '②',
                titleEn: 'Underground Travel',
                titleHi: 'भूमिगत यात्रा',
                descEn: 'Vacuum pulls waste through sealed underground pipes at 60–80 km/h.',
                descHi: 'वैक्यूम कचरे को भूमिगत पाइप से 60–80 किमी/घंटा की गति से खींचता है।',
              },
              {
                num: '③',
                titleEn: 'Terminal Processing',
                titleHi: 'टर्मिनल प्रसंस्करण',
                descEn: 'Waste is separated, compacted and sealed at a single terminal — not on streets.',
                descHi: 'कचरा एक टर्मिनल पर अलग, दबा और बंद किया जाता है।',
              },
            ].map((step, i) => (
              <Fragment key={i}>
                <motion.div
                  whileHover={{ scale: 1.03, borderColor: 'var(--brand-orange)' }}
                  className="flex-1 w-full bg-white rounded-xl shadow-sm p-6 border-2 border-gray-100 flex flex-col gap-3 transition-all cursor-default"
                >
                  <span className="text-3xl font-bold" style={{ color: 'var(--brand-orange)' }}>
                    {step.num}
                  </span>
                  <h3 className="font-bold text-base" style={{ color: 'var(--brand-navy)' }}>
                    <T en={step.titleEn} hi={step.titleHi} />
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--brand-slate)' }}>
                    <T en={step.descEn} hi={step.descHi} />
                  </p>
                </motion.div>

                {i < 2 && (
                  <div
                    className="flex items-center justify-center py-2 md:py-0 md:px-3 shrink-0"
                    aria-hidden="true"
                  >
                    <span
                      className="md:hidden text-2xl font-bold"
                      style={{ color: 'var(--brand-orange)' }}
                    >
                      ↓
                    </span>
                    <span
                      className="hidden md:inline text-2xl font-bold"
                      style={{ color: 'var(--brand-orange)' }}
                    >
                      →
                    </span>
                  </div>
                )}
              </Fragment>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link
              href="/how-it-works"
              className="inline-flex items-center px-6 py-3 rounded-xl font-semibold text-base border-2 transition-colors hover:bg-blue-50"
              style={{ borderColor: 'var(--brand-navy)', color: 'var(--brand-navy)' }}
            >
              <T en="Explore Full System →" hi="पूरी प्रणाली देखें →" />
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════ D: BENEFITS ══════════════════════ */}
      <section className="py-16" style={{ background: '#F1F5F9' }}>
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <h2
            className="text-2xl md:text-3xl font-bold text-center mb-10"
            style={{ color: 'var(--brand-navy)' }}
          >
            <T en="Key Benefits" hi="मुख्य लाभ" />
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: '🚫🚛',
                titleEn: '90–100% Fewer Street Trucks',
                titleHi: '90–100% कम ट्रक',
                descEn: 'Heavy vehicles leave residential areas.',
                descHi: 'भारी वाहन आवासीय क्षेत्र से हटते हैं।',
              },
              {
                icon: '🌿',
                titleEn: 'Near-Zero Odour',
                titleHi: 'लगभग शून्य बदबू',
                descEn: 'Sealed inlets, biofiltered exhaust.',
                descHi: 'बंद इनलेट, बायोफिल्टर्ड हवा।',
              },
              {
                icon: '♻️',
                titleEn: 'Built-in Source Segregation',
                titleHi: 'स्रोत पर कचरा अलगाव',
                descEn: 'Green/Blue/Grey inlets enforce SWM 2026.',
                descHi: 'हरा/नीला/धूसर इनलेट SWM 2026 का पालन।',
              },
              {
                icon: '🛡️',
                titleEn: 'Zero Manual Contact',
                titleHi: 'कोई हाथ-संपर्क नहीं',
                descEn: 'Fully automated, closed-system collection.',
                descHi: 'पूरी तरह स्वचालित और बंद प्रणाली।',
              },
            ].map((b, i) => (
              <div
                key={i}
                className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 flex flex-col gap-3"
              >
                <span className="text-3xl">{b.icon}</span>
                <h3 className="font-bold text-base" style={{ color: 'var(--brand-navy)' }}>
                  <T en={b.titleEn} hi={b.titleHi} />
                </h3>
                <p className="text-sm" style={{ color: 'var(--brand-slate)' }}>
                  <T en={b.descEn} hi={b.descHi} />
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════ E: HONESTY SECTION ══════════════════════ */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 sm:p-8 md:p-10">
            <h2 className="text-xl md:text-2xl font-bold mb-6 text-amber-800">
              <T en="⚠️ This Will Not Work Everywhere" hi="⚠️ यह हर जगह काम नहीं करेगा" />
            </h2>
            <ul className="flex flex-col gap-4 mb-8">
              {[
                {
                  en: 'High upfront capital cost — significantly more than truck systems',
                  hi: 'शुरुआती पूंजी लागत बहुत अधिक है — ट्रक प्रणाली से काफी ज़्यादा',
                },
                {
                  en: 'Terminal consumes significant electricity — needs solar pairing',
                  hi: 'टर्मिनल बहुत बिजली खाता है — सोलर की ज़रूरत है',
                },
                {
                  en: 'Requires skilled engineers for maintenance — not routine municipal staff',
                  hi: 'रखरखाव के लिए कुशल इंजीनियर चाहिए — सामान्य नगरपालिका कर्मचारी नहीं',
                },
                {
                  en: 'Retrofitting in old dense cities is extremely difficult',
                  hi: 'पुराने घने शहरों में लगाना बहुत मुश्किल है',
                },
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="mt-0.5 text-red-500 font-bold text-lg shrink-0">✗</span>
                  <span className="text-amber-900 text-sm leading-relaxed">
                    <T en={item.en} hi={item.hi} />
                  </span>
                </li>
              ))}
            </ul>

            {/* Green recommendation box */}
            <div className="bg-green-50 border border-green-200 rounded-xl p-5 flex items-start gap-3">
              <span className="text-green-600 font-bold text-lg shrink-0 mt-0.5">✓</span>
              <div className="flex flex-col gap-3">
                <p className="text-green-800 text-sm leading-relaxed">
                  <T
                    en="That is why we recommend starting with a small pilot in a new planned township or campus."
                    hi="इसीलिए हम नई प्लान्ड टाउनशिप या कैंपस में छोटे पायलट से शुरुआत की सलाह देते हैं।"
                  />
                </p>
                <Link
                  href="/pilot"
                  className="inline-flex items-center w-fit px-5 py-2.5 rounded-lg text-white text-sm font-semibold transition-opacity hover:opacity-90"
                  style={{ background: 'var(--brand-green)' }}
                >
                  <T en="View Pilot Proposal →" hi="पायलट प्रस्ताव देखें →" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════ F: NUMBERS BAND ══════════════════════ */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <div className="text-center mb-2">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-gray-200 text-gray-700 mb-2">
              <T en="[Example Project]" hi="[उदाहरण प्रोजेक्ट]" />
            </span>
          </div>
          <h2
            className="text-xl md:text-2xl font-bold text-center mb-8"
            style={{ color: 'var(--brand-navy)' }}
          >
            <T
              en="What a Typical Deployment Could Look Like"
              hi="एक सामान्य तैनाती कैसी दिख सकती है"
            />
          </h2>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 mb-6">
            <StatCard
              target={10000}
              label={<T en="Households (example)" hi="घर (उदाहरण)" />}
            />
            <StatCard
              target={4.5}
              decimals={1}
              suffix={lang === 'hi' ? ' टन/दिन' : ' T/day'}
              label={<T en="Waste collected (example)" hi="कचरा/दिन (उदाहरण)" />}
            />
            <StatCard
              target={17}
              suffix={lang === 'hi' ? ' कम' : ' fewer'}
              label={<T en="Street truck trips/day (example)" hi="कम ट्रक फेरे/दिन (उदाहरण)" />}
            />
            <StatCard
              target={200}
              label={<T en="Inlets installed (example)" hi="इनलेट (उदाहरण)" />}
            />
          </div>

          <div className="text-center">
            <SourceTag
              type="assumption"
              text={
                lang === 'hi'
                  ? 'उदाहरण प्रोजेक्ट — वास्तविक डेटा नहीं'
                  : 'Example project — not real data'
              }
              detail={
                lang === 'hi'
                  ? 'ये आंकड़े एक काल्पनिक 10,000 घरों की टाउनशिप (~4.5 टन/दिन) के उदाहरण हैं, किसी वास्तविक साइट का मापा गया डेटा नहीं।'
                  : 'Illustrative figures for a hypothetical 10,000-household planned township (~4.5 T/day), not measured data from an existing site.'
              }
            />
          </div>
        </div>
      </section>

      {/* ══════════════════════ G: AUDIENCE TABS ══════════════════════ */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <h2
            className="text-2xl md:text-3xl font-bold text-center mb-8"
            style={{ color: 'var(--brand-navy)' }}
          >
            <T en="Who Is This For?" hi="यह किसके लिए है?" />
          </h2>

          {/* Tab buttons with orange bottom underline */}
          <div
            className="flex flex-wrap justify-center border-b border-gray-200 mb-8 max-w-3xl mx-auto"
            role="tablist"
          >
            {currentTabs.map((tab, i) => {
              const isActive = activeTab === i
              return (
                <button
                  key={i}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveTab(i)}
                  className={`px-4 sm:px-6 py-3 text-sm sm:text-base transition-colors border-b-2 -mb-px ${
                    isActive
                      ? 'font-bold'
                      : 'font-medium border-transparent text-gray-500 hover:text-gray-800'
                  }`}
                  style={
                    isActive
                      ? { borderBottomColor: 'var(--brand-orange)', color: 'var(--brand-navy)' }
                      : undefined
                  }
                >
                  {tab}
                </button>
              )
            })}
          </div>

          {/* Tab content */}
          <motion.div
            key={activeTab}
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8 max-w-2xl mx-auto"
          >
            <ul className="flex flex-col gap-5">
              {(lang === 'hi' ? tabContent[activeTab].hi : tabContent[activeTab].en).map(
                (point, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span
                      className="mt-0.5 w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-xs font-bold text-white"
                      style={{ background: 'var(--brand-orange)' }}
                    >
                      {i + 1}
                    </span>
                    <span className="text-sm leading-relaxed" style={{ color: 'var(--brand-slate)' }}>
                      {point}
                    </span>
                  </li>
                )
              )}
            </ul>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════ H: FINAL CTA ══════════════════════ */}
      <section className="py-20" style={{ background: 'var(--brand-navy)' }}>
        <div className="max-w-6xl mx-auto px-4 md:px-8 text-center flex flex-col items-center gap-6">
          <h2 className="text-2xl md:text-3xl font-bold text-white">
            <T
              en="Ready to explore AVWCS for your city?"
              hi="अपने शहर के लिए AVWCS एक्सप्लोर करें?"
            />
          </h2>
          <p className="text-blue-200 text-base max-w-lg">
            <T
              en="Run our open-source simulator to see how the system scales for your population and waste profile."
              hi="हमारा ओपन-सोर्स सिमुलेटर चलाएं और देखें कि यह प्रणाली आपकी जनसंख्या के अनुसार कैसे काम करती है।"
            />
          </p>

          <Link
            href="/simulator"
            className="inline-flex items-center px-8 py-4 rounded-xl text-white font-bold text-lg transition-opacity hover:opacity-90 shadow-lg"
            style={{ background: 'var(--brand-orange)' }}
          >
            <T en="Run Simulator for Your City →" hi="अपने शहर के लिए सिमुलेटर चलाएं →" />
          </Link>

          <Link
            href="/paper"
            className="text-blue-200 hover:text-white underline text-sm transition-colors"
          >
            <T en="Download Research Paper" hi="रिसर्च पेपर डाउनलोड करें" />
          </Link>

          <p className="text-blue-300 text-xs mt-2">
            <T
              en="Feasibility-stage concept. Not a final design."
              hi="फ़ीज़िबिलिटी स्तर की अवधारणा। अंतिम डिज़ाइन नहीं।"
            />
          </p>
        </div>
      </section>
    </div>
  )
}
