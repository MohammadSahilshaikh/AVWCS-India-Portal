'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import T from '@/components/ui/T'
import { useLang } from '@/components/ui/LangContext'
import faqData from '@/data/faq.json'
import type { FAQ } from '@/lib/types'

const FAQS: FAQ[] = faqData.faqs

const CATEGORY_STYLES: Record<string, { en: string; hi: string; className: string }> = {
  feasibility: { en: 'Feasibility', hi: 'व्यवहार्यता', className: 'bg-blue-100 text-blue-700' },
  energy: { en: 'Energy', hi: 'ऊर्जा', className: 'bg-green-100 text-green-700' },
  operations: { en: 'Operations', hi: 'संचालन', className: 'bg-orange-100 text-orange-700' },
}

const CATEGORY_FILTERS = [
  { id: 'all', en: 'All Questions', hi: 'सभी सवाल' },
  { id: 'feasibility', en: 'Feasibility', hi: 'व्यवहार्यता' },
  { id: 'energy', en: 'Energy', hi: 'ऊर्जा' },
  { id: 'operations', en: 'Operations', hi: 'संचालन' },
]

const GLOSSARY = [
  { term: 'AVWCS', en: 'Automated Vacuum Waste Collection System using sealed underground pipes.', hi: 'सीलबंद भूमिगत पाइपों द्वारा स्वचालित वैक्यूम कचरा संग्रह प्रणाली।' },
  { term: 'Negative Pressure', en: 'Pressure below atmospheric level created by exhausters to draw waste toward the terminal.', hi: 'एग्ज़ॉस्टर द्वारा बनाया गया कम दबाव जो हवा और कचरे को टर्मिनल की ओर खींचता है।' },
  { term: 'Exhauster', en: 'High-power terminal fan/blower creating suction across the pipe network.', hi: 'टर्मिनल पर लगा शक्तिशाली पंखा जो पाइपलाइन में वैक्यूम सक्शन बनाता है।' },
  { term: 'Cyclone Separator', en: 'Terminal unit that slows air spirally to drop solid waste down while air exits upward.', hi: 'टर्मिनल उपकरण जो कचरे और हवा को अलग करता है।' },
  { term: 'Discharge Valve', en: 'Heavy-duty valve below each chute isolating waste from the main vacuum line until triggered.', hi: 'च्यूट के नीचे लगा वाल्व जो सही समय पर ही कचरे को मुख्य पाइप में छोड़ता है।' },
  { term: 'DPR / BOQ', en: 'Detailed Project Report & Bill of Quantities required before civil tender and procurement.', hi: 'टेंडर और निर्माण से पहले तैयार विस्तृत परियोजना रिपोर्ट और मात्रा विवरण।' },
  { term: 'TPD', en: 'Tonnes Per Day — standard unit for municipal daily solid waste generation.', hi: 'टन प्रति दिन — दैनिक ठोस कचरा उत्पादन नापने की मानक इकाई।' },
  { term: 'CAPEX / O&M', en: 'Initial Capital Expenditure to build vs yearly Operation & Maintenance cost.', hi: 'सिस्टम बनाने की शुरुआती लागत (CAPEX) बनाम वार्षिक संचालन व रखरखाव खर्च (O&M)।' },
  { term: 'MRF / Biofilter', en: 'Material Recovery Facility for recyclables & biological odour-scrubbing filter bed at terminal.', hi: 'रीसाइक्लिंग छंटाई केंद्र (MRF) और टर्मिनल पर दुर्गंध साफ करने वाला बायोफिल्टर।' },
]

export default function FAQPage() {
  const { lang } = useLang()
  const [openId, setOpenId] = useState<string>(FAQS[0].id)
  const [category, setCategory] = useState<string>('all')

  const filteredFaqs = category === 'all' ? FAQS : FAQS.filter((f) => f.category === category)

  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      {/* Heading */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-3" style={{ color: 'var(--brand-navy)' }}>
          <T en="Frequently Asked Questions" hi="अक्सर पूछे जाने वाले सवाल" />
        </h1>
        <p className="text-slate-500 text-lg">
          <T
            en="Honest answers to the hardest questions about AVWCS"
            hi="AVWCS के बारे में कठिन सवालों के ईमानदार जवाब"
          />
        </p>
      </div>

      {/* Category Filter Pills (SRS FR-013) */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {CATEGORY_FILTERS.map((cat) => {
          const active = category === cat.id
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => {
                setCategory(cat.id)
                const nextList = cat.id === 'all' ? FAQS : FAQS.filter((f) => f.category === cat.id)
                if (nextList.length > 0) setOpenId(nextList[0].id)
              }}
              className={`px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold border transition-colors cursor-pointer ${
                active
                  ? 'text-white border-orange-600'
                  : 'bg-white text-slate-600 border-gray-200 hover:border-orange-300'
              }`}
              style={active ? { backgroundColor: 'var(--brand-orange)' } : undefined}
            >
              {lang === 'hi' ? cat.hi : cat.en}
            </button>
          )
        })}
      </div>

      {/* Accordion */}
      <div className="space-y-3">
        {filteredFaqs.map((faq) => {
          const isOpen = openId === faq.id
          const cat = CATEGORY_STYLES[faq.category] ?? {
            en: faq.category,
            hi: faq.category,
            className: 'bg-gray-100 text-gray-600',
          }

          return (
            <div
              key={faq.id}
              className="border border-gray-200 rounded-2xl overflow-hidden bg-white shadow-sm"
            >
              {/* Question row */}
              <button
                type="button"
                className="w-full flex items-start gap-3 px-5 py-4 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                onClick={() => setOpenId(isOpen ? '' : faq.id)}
                aria-expanded={isOpen}
              >
                <span
                  className={`mt-0.5 shrink-0 text-xs font-semibold px-2.5 py-0.5 rounded-full ${cat.className}`}
                >
                  {lang === 'hi' ? cat.hi : cat.en}
                </span>
                <span className="flex-1 font-semibold text-base" style={{ color: 'var(--brand-navy)' }}>
                  {lang === 'hi' ? faq.q.hi : faq.q.en}
                </span>
                <motion.span
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="shrink-0 mt-0.5 text-slate-400"
                >
                  <ChevronDown size={20} />
                </motion.span>
              </button>

              {/* Answer panel */}
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    key="answer"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-5 pt-3 text-gray-700 leading-relaxed border-t border-gray-100">
                      {lang === 'hi' ? faq.a.hi : faq.a.en}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </div>

      {/* Technical Glossary (SRS §1.5 & §20) */}
      <section className="mt-16 pt-10 border-t border-gray-200">
        <h2 className="text-2xl font-bold mb-2 text-center" style={{ color: 'var(--brand-navy)' }}>
          <T en="Key Terms & Glossary" hi="प्रमुख तकनीकी शब्दावली" />
        </h2>
        <p className="text-sm text-slate-500 text-center mb-6">
          <T
            en="Plain-language definitions for municipal officers and non-engineering readers."
            hi="नगर निगम अधिकारियों और आम नागरिकों के लिए सरल भाषा में तकनीकी शब्दों का अर्थ।"
          />
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {GLOSSARY.map((item) => (
            <div key={item.term} className="bg-white rounded-xl border border-gray-200 p-4 shadow-xs">
              <div className="font-bold text-sm mb-1" style={{ color: 'var(--brand-orange)' }}>
                {item.term}
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {lang === 'hi' ? item.hi : item.en}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
