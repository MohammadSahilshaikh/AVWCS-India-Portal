'use client'

import { useState } from 'react'
import Link from 'next/link'
import { FileText, Cpu, BarChart3, ArrowRight, Info, ExternalLink } from 'lucide-react'
import T from '@/components/ui/T'
import { useLang } from '@/components/ui/LangContext'
import PrintButton from '@/components/ui/PrintButton'

const CASE_REFERENCES = [
  {
    title: { en: 'Envac Global & India Smart City Overview', hi: 'Envac ग्लोबल और भारत स्मार्ट सिटी परिचय' },
    badge: { en: 'Supplier Reference', hi: 'सप्लायर संदर्भ', cls: 'bg-purple-100 text-purple-800' },
    url: 'https://www.envacgroup.com/in/envac-city/envac-city-citys/',
    note: {
      en: 'Underground inlets, pneumatic conveyance & terminal concepts (supplier-published claims; requires independent verification).',
      hi: 'भूमिगत इनलेट, न्यूमैटिक परिवहन और टर्मिनल प्रणाली अवधारणा (सप्लायर-प्रकाशित विवरण; स्वतंत्र सत्यापन आवश्यक)।',
    },
  },
  {
    title: { en: 'UK / Europe Projects (Barking Riverside, Wembley Park)', hi: 'UK / यूरोप प्रोजेक्ट (बार्किंग रिवरसाइड, वेम्बली पार्क)' },
    badge: { en: 'Supplier Case Study', hi: 'सप्लायर केस स्टडी', cls: 'bg-blue-100 text-blue-800' },
    url: 'https://www.envacgroup.com/uk/projects/',
    note: {
      en: 'Large planned high-density residential districts used as structural reference for greenfield township layouts.',
      hi: 'बड़ी प्लान्ड आवासीय टाउनशिप में लागू उदाहरण, जिनका उपयोग ग्रीनफील्ड लेआउट अध्ययन के लिए किया गया है।',
    },
  },
  {
    title: { en: 'Munich Olympic Village (1972–2017) — Historical Case', hi: 'म्यूनिख ओलंपिक विलेज (1972–2017) — ऐतिहासिक अध्ययन' },
    badge: { en: 'Historical · Closed 2017', hi: 'ऐतिहासिक · 2017 में बंद', cls: 'bg-amber-100 text-amber-900' },
    url: 'https://www.envacgroup.com/uk/news/bauwelt-pneumatic-systems-can-significantly-improve-the-quality-of-life-in-a-city/',
    note: {
      en: 'Historical pneumatic installation shut down in 2017 per cited Bauwelt/Envac discussion — studied for lifecycle O&M lessons, NOT an active German installation.',
      hi: '1972 की ऐतिहासिक प्रणाली जो संदर्भित चर्चा के अनुसार 2017 में बंद हो गई — जीवनचक्र व रखरखाव सीख के लिए संदर्भित (वर्तमान सक्रिय सिस्टम नहीं)।',
    },
  },
  {
    title: { en: 'Envac General Technical Brochure (Terminology)', hi: 'Envac तकनीकी विवरणिका (शब्दावली)' },
    badge: { en: 'Technical Literature', hi: 'तकनीकी साहित्य', cls: 'bg-slate-100 text-slate-800' },
    url: 'https://www.envacgroup.com/wp-content/uploads/2025/10/ENG_Envac-general-ME-digital.pdf',
    note: {
      en: 'General system architecture & component terminology reference; final specs vary by vendor & Indian site conditions.',
      hi: 'सामान्य प्रणाली व घटक शब्दावली का संदर्भ; अंतिम तकनीकी स्पेसिफिकेशन साइट व वेंडर पर निर्भर करते हैं।',
    },
  },
]

const KEY_POINTS = [
  {
    en: 'Pneumatic waste transport operates at 60–80 km/h through 400–500 mm underground steel pipes',
    hi: 'न्यूमैटिक परिवहन 400–500 मिमी की स्टील पाइप में 60–80 किमी/घंटा की गति से चलता है',
  },
  {
    en: 'Energy benchmark: 80–120 kWh per tonne (source: published life-cycle studies)',
    hi: 'ऊर्जा मानक: 80–120 kWh प्रति टन (प्रकाशित जीवन-चक्र अध्ययन)',
  },
  {
    en: 'Three-stream color-coded inlets enforce SWM Rules 2026 source segregation',
    hi: 'तीन-धारा रंग-कोडेड इनलेट SWM नियम 2026 का पालन सुनिश्चित करते हैं',
  },
  {
    en: 'Greenfield deployment recommended — retrofit in old cities is impractical',
    hi: 'ग्रीनफील्ड तैनाती अनुशंसित — पुराने शहरों में रेट्रोफिट अव्यावहारिक है',
  },
  {
    en: 'Carbon neutrality achievable with ≥ 60–70% renewable energy pairing',
    hi: '60–70% नवीकरणीय ऊर्जा के साथ कार्बन तटस्थता संभव',
  },
]

const FIGURES = [
  {
    icon: FileText,
    title: {
      en: 'Figure 1 — System Overview',
      hi: 'चित्र 1 — प्रणाली का समग्र दृश्य',
    },
    en: 'Full-system schematic from street inlets to terminal, showing 7 operational stages.',
    hi: 'सड़क इनलेट से टर्मिनल तक पूर्ण प्रणाली योजना, 7 परिचालन चरण।',
  },
  {
    icon: Cpu,
    title: {
      en: 'Figure 2 — Sequential Control Logic',
      hi: 'चित्र 2 — अनुक्रमिक नियंत्रण लॉजिक',
    },
    en: 'PLC-enforced single-stream suction sequencing preventing waste stream mixing.',
    hi: 'PLC-नियंत्रित एकल-धारा अनुक्रम जो कचरे को मिलने से रोकता है।',
  },
  {
    icon: BarChart3,
    title: {
      en: 'Figure 3 — Energy Balance',
      hi: 'चित्र 3 — ऊर्जा संतुलन',
    },
    en: 'Grid vs renewable energy comparison for terminal operation at different solar fractions.',
    hi: 'विभिन्न सोलर अनुपातों पर टर्मिनल संचालन के लिए ग्रिड बनाम नवीकरणीय ऊर्जा तुलना।',
  },
]

export default function PaperPage() {
  const { lang } = useLang()
  const [showPreprintNote, setShowPreprintNote] = useState(false)

  return (
    <div className="max-w-4xl mx-auto px-4 py-16 space-y-14">
      {/* Heading */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="text-left">
          <h1 className="text-3xl md:text-4xl font-bold mb-2" style={{ color: 'var(--brand-navy)' }}>
            <T en="Research Paper & Documentation" hi="शोध पत्र और दस्तावेज़" />
          </h1>
          <p className="text-sm text-slate-500">
            <T
              en="Feasibility summary, core diagrams, and verified international case references."
              hi="फ़ीज़िबिलिटी सारांश, मुख्य आरेख और अंतर्राष्ट्रीय संदर्भ स्रोत।"
            />
          </p>
        </div>
        <PrintButton />
      </div>

      {/* Summary card */}
      <div className="bg-blue-50 rounded-2xl p-6 sm:p-8 border border-blue-100">
        <h2 className="text-xl font-bold mb-5" style={{ color: 'var(--brand-navy)' }}>
          <T
            en="AVWCS India — Feasibility Study Summary"
            hi="AVWCS भारत — फ़ीज़िबिलिटी अध्ययन सारांश"
          />
        </h2>
        <ul className="space-y-3">
          {KEY_POINTS.map((pt, i) => (
            <li key={i} className="flex items-start gap-3 text-slate-700 leading-relaxed">
              <span
                className="mt-2 h-2 w-2 rounded-full shrink-0"
                style={{ backgroundColor: 'var(--brand-green)' }}
              />
              <span>
                <T en={pt.en} hi={pt.hi} />
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Download section */}
      <div className="no-print text-center space-y-4">
        <div>
          <button
            type="button"
            onClick={() => setShowPreprintNote((prev) => !prev)}
            aria-expanded={showPreprintNote}
            className="no-print inline-flex items-center gap-2 px-8 py-4 rounded-xl text-white font-semibold text-base sm:text-lg shadow-sm transition-opacity hover:opacity-90 cursor-pointer"
            style={{ backgroundColor: 'var(--brand-orange)' }}
          >
            {lang === 'hi'
              ? '📄 पूरा शोध पत्र डाउनलोड करें (PDF)'
              : '📄 Download Full Paper (PDF)'}
          </button>
        </div>

        {showPreprintNote && (
          <div className="max-w-lg mx-auto bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-900 flex flex-col items-center gap-2">
            <div className="flex items-center gap-2 font-medium">
              <Info size={16} className="shrink-0 text-amber-600" />
              <span>
                <T
                  en="PDF preprint will be linked upon publication — contact us for a review copy."
                  hi="प्रकाशन के बाद PDF प्रीप्रिंट लिंक किया जाएगा — समीक्षा प्रति के लिए हमसे संपर्क करें।"
                />
              </span>
            </div>
            <Link
              href="/contact"
              className="inline-flex items-center gap-1 font-semibold underline"
              style={{ color: 'var(--brand-navy)' }}
            >
              <T en="Request a review copy →" hi="समीक्षा प्रति का अनुरोध करें →" />
            </Link>
          </div>
        )}

        <p className="text-sm text-slate-500">
          <T en="(PDF will be linked here)" hi="(PDF यहाँ जोड़ी जाएगी)" />
        </p>
        <p className="text-slate-600">
          <T
            en="Paper currently under review. Contact us for a preprint copy."
            hi="पेपर समीक्षाधीन है। प्रीप्रिंट के लिए संपर्क करें।"
          />
        </p>
      </div>

      {/* Key figures section */}
      <div>
        <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--brand-navy)' }}>
          <T en="Key Figures" hi="मुख्य आरेख" />
        </h2>
        <div className="grid gap-5 md:grid-cols-3">
          {FIGURES.map((fig) => {
            const Icon = fig.icon
            return (
              <div
                key={fig.title.en}
                className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-3"
              >
                <div
                  className="inline-flex p-2.5 rounded-xl bg-blue-50"
                  style={{ color: 'var(--brand-navy)' }}
                >
                  <Icon size={20} />
                </div>
                <div className="text-sm font-bold" style={{ color: 'var(--brand-navy)' }}>
                  {lang === 'hi' ? fig.title.hi : fig.title.en}
                </div>
                <p className="text-slate-600 text-sm leading-relaxed">
                  <T en={fig.en} hi={fig.hi} />
                </p>
              </div>
            )
          })}
        </div>
      </div>

      {/* Reference Case Studies & Sources (SRS §19) */}
      <div>
        <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--brand-navy)' }}>
          <T en="Case Studies & Verified References" hi="केस स्टडी और संदर्भ स्रोत" />
        </h2>
        <p className="text-sm text-slate-500 mb-6">
          <T
            en="External supplier & historical references studied for system context. Supplier claims are explicitly tagged until independently verified."
            hi="प्रणाली के अध्ययन हेतु बाहरी व ऐतिहासिक संदर्भ। सप्लायर के दावों को स्वतंत्र सत्यापन तक अलग से चिह्नित किया गया है।"
          />
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          {CASE_REFERENCES.map((ref) => (
            <a
              key={ref.url}
              href={ref.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:border-orange-300 hover:shadow transition-all flex flex-col justify-between gap-3"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${ref.badge.cls}`}>
                    {lang === 'hi' ? ref.badge.hi : ref.badge.en}
                  </span>
                  <ExternalLink size={15} className="text-slate-400 group-hover:text-orange-600 shrink-0" />
                </div>
                <h3 className="font-bold text-sm sm:text-base" style={{ color: 'var(--brand-navy)' }}>
                  {lang === 'hi' ? ref.title.hi : ref.title.en}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {lang === 'hi' ? ref.note.hi : ref.note.en}
                </p>
              </div>
              <span className="text-xs font-semibold text-orange-600 group-hover:underline">
                <T en="Open external source ↗" hi="स्रोत लिंक खोलें ↗" />
              </span>
            </a>
          ))}
        </div>
      </div>

      {/* Navigation link to About / Research Team */}
      <div className="no-print border-t border-gray-200 pt-8 flex flex-wrap items-center justify-between gap-4">
        <Link
          href="/about"
          className="no-print inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-200 bg-white text-sm font-semibold shadow-sm hover:shadow transition-shadow"
          style={{ color: 'var(--brand-navy)' }}
        >
          <T en="View Research Team →" hi="शोध टीम देखें →" />
        </Link>
        <Link
          href="/contact"
          className="inline-flex items-center gap-2 text-sm font-semibold hover:underline"
          style={{ color: 'var(--brand-orange)' }}
        >
          <T en="Contact for Preprint / Feedback" hi="प्रीप्रिंट / फीडबैक के लिए संपर्क करें" />
          <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  )
}
