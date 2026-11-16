'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Play,
  Pause,
  ChevronDown,
  ArrowRight,
  Check,
  X,
  ShieldCheck,
} from 'lucide-react'
import T from '@/components/ui/T'
import { useLang } from '@/components/ui/LangContext'
import PrintButton from '@/components/ui/PrintButton'
import SourceTag from '@/components/ui/SourceTag'
import {
  HeroFlowStrip,
  GreenfieldVsOldVisual,
  PhaseVisualStage,
  DeliveryFlowDiagram,
} from '@/components/pilot/PilotAnimations'
import pilotData from '@/data/pilot.json'
import type { PilotPhase, DeliveryModel, KPI, Risk, Policy } from '@/lib/types'

const PHASES = pilotData.phases as PilotPhase[]
const DELIVERY_MODELS = pilotData.deliveryModels as DeliveryModel[]
const KPIS = pilotData.kpis as KPI[]
const RISKS = pilotData.risks as Risk[]
const POLICIES = pilotData.policies as Policy[]

const SITE_CHIPS = [
  { icon: '🏙️', en: 'New Township (>500 ha)', hi: 'नई टाउनशिप (>500 ha)' },
  { icon: '🎓', en: 'Large Campus', hi: 'बड़ा कैंपस' },
  { icon: '🏥', en: 'Hospital (>500 beds)', hi: 'अस्पताल (>500 बेड)' },
  { icon: '✈️', en: 'Airport / Transit', hi: 'एयरपोर्ट / ट्रांज़िट' },
]

const KPI_VISUALS = [
  { icon: '🚛', pct: 95, value: '90–100% ↓', color: '#16A34A' },
  { icon: '⚡', pct: 75, value: '≤100 kWh/T', color: '#EA580C' },
  { icon: '⚙️', pct: 98, value: '≥98%', color: '#1E3A5F' },
  { icon: '🌿', pct: 95, value: '~0', color: '#16A34A' },
  { icon: '♻️', pct: 85, value: '≥85%', color: '#2563EB' },
]

const RISK_SHORT = [
  {
    riskIcon: '💰',
    riskEn: 'High CAPEX',
    riskHi: 'ज़्यादा लागत',
    fixIcon: '📦',
    fixEn: '1–2 km² Co-Trenched Pilot',
    fixHi: '1–2 km² सह-खुदाई पायलट',
  },
  {
    riskIcon: '⚡',
    riskEn: 'High Power Use',
    riskHi: 'अधिक बिजली खर्च',
    fixIcon: '☀️',
    fixEn: 'Solar PV + 75% VFD Trigger',
    fixHi: 'सोलर PV + 75% VFD ट्रिगर',
  },
  {
    riskIcon: '🔧',
    riskEn: 'Skill Gap',
    riskHi: 'कुशल टीम की कमी',
    fixIcon: '🎓',
    fixEn: '5-Yr O&M + Local Training',
    fixHi: '5-वर्ष O&M + स्थानीय प्रशिक्षण',
  },
  {
    riskIcon: '🚧',
    riskEn: 'Old City Digging',
    riskHi: 'पुराने शहर में खुदाई',
    fixIcon: '🌱',
    fixEn: 'Greenfield-Only Mandate',
    fixHi: 'केवल ग्रीनफील्ड शुरुआत',
  },
]

const POLICY_BADGES = [
  [
    { icon: '🗑️', en: '4-Stream Segregation', hi: '4-धारा अलगाव' },
    { icon: '🏢', en: 'BWG On-Site Rule', hi: 'BWG ऑन-साइट नियम' },
    { icon: '📡', en: 'CPCB Digital Tracking', hi: 'CPCB डिजिटल ट्रैकिंग' },
  ],
  [
    { icon: '✨', en: 'Bin-Free Streets', hi: 'बिन-मुक्त सड़कें' },
    { icon: '🛡️', en: 'Zero Manual Handling', hi: 'हाथ-संपर्क मुक्त' },
    { icon: '♻️', en: 'Scientific Processing', hi: 'वैज्ञानिक प्रसंस्करण' },
  ],
]

const NEXT_STEPS = [
  { icon: '🗺️', en: 'Share GIS Map', hi: 'GIS नक्शा साझा करें' },
  { icon: '📋', en: 'Sign Study MoU', hi: 'अध्ययन MoU करें' },
  { icon: '🤝', en: 'Assign Nodal Officer', hi: 'नोडल अधिकारी नियुक्त करें' },
]

export default function PilotPage() {
  const { lang } = useLang()

  // Section 2: Greenfield vs Old City visual toggle
  const [siteMode, setSiteMode] = useState<'greenfield' | 'old'>('greenfield')

  // Section 3: 5-Phase interactive animation player
  const [activePhase, setActivePhase] = useState<number>(1)
  const [isPlaying, setIsPlaying] = useState<boolean>(true)
  const [showPhaseDetail, setShowPhaseDetail] = useState<boolean>(false)

  // Section 4: Delivery model animated switcher
  const [modelIdx, setModelIdx] = useState<0 | 1>(0)
  const [showModelDetail, setShowModelDetail] = useState<boolean>(false)

  // Section 6 & 7 optional compact detail toggles
  const [expandedRisk, setExpandedRisk] = useState<number | null>(null)
  const [expandedPolicy, setExpandedPolicy] = useState<number | null>(null)

  useEffect(() => {
    if (!isPlaying) return
    const timer = setInterval(() => {
      setActivePhase((prev) => (prev >= PHASES.length ? 1 : prev + 1))
    }, 3600)
    return () => clearInterval(timer)
  }, [isPlaying])

  const currentPhase = PHASES.find((p) => p.step === activePhase) ?? PHASES[0]
  const currentModel = DELIVERY_MODELS[modelIdx] ?? DELIVERY_MODELS[0]

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-10 space-y-14">

        {/* 1. Hero + Animated Overview Flow Strip */}
        <motion.section
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="space-y-6"
        >
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="max-w-2xl">
              <span
                className="inline-block text-xs font-semibold px-3 py-1 rounded-full text-white mb-2.5"
                style={{ background: 'var(--brand-orange)' }}
              >
                <T en="Visual Pilot Guide · ULBs & Smart Cities" hi="विज़ुअल पायलट गाइड · स्मार्ट सिटी व ULB" />
              </span>
              <h1 className="text-3xl md:text-4xl font-bold leading-tight" style={{ color: 'var(--brand-navy)' }}>
                <T en="How We Roll Out a Pilot" hi="पायलट प्रोजेक्ट की चरणबद्ध योजना" />
              </h1>
              <p className="mt-2 text-base" style={{ color: 'var(--brand-slate)' }}>
                <T
                  en="See where to start, how phases run, who pays, and what we measure."
                  hi="एनीमेशन से समझें: कहाँ शुरू करें, 5 चरण, लागत मॉडल और जोखिम समाधान।"
                />
              </p>
            </div>
            <PrintButton />
          </div>

          <HeroFlowStrip lang={lang} />
        </motion.section>

        {/* 2. Where to Start: Greenfield vs Old City Animated Comparison */}
        <section className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-7 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold" style={{ color: 'var(--brand-navy)' }}>
                <T en="1. Where to Start? (Watch the Difference)" hi="1. शुरुआत कहाँ करें? (अंतर देखें)" />
              </h2>
            </div>

            <div className="no-print inline-flex rounded-xl bg-gray-100 p-1 self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setSiteMode('greenfield')}
                className={`px-3.5 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  siteMode === 'greenfield' ? 'bg-green-600 text-white shadow-sm' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                ✓ <T en="New Greenfield" hi="नया ग्रीनफील्ड" />
              </button>
              <button
                type="button"
                onClick={() => setSiteMode('old')}
                className={`px-3.5 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  siteMode === 'old' ? 'bg-red-600 text-white shadow-sm' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                ✕ <T en="Old Dense City" hi="पुराना घना शहर" />
              </button>
            </div>
          </div>

          <GreenfieldVsOldVisual lang={lang} mode={siteMode} />

          {/* 4 visual site chips */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-1">
            {SITE_CHIPS.map((chip, idx) => (
              <motion.div
                key={idx}
                initial={false}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.06 }}
                className="flex items-center gap-2 rounded-xl border border-green-200 bg-green-50/50 px-3 py-2.5 text-xs sm:text-sm font-semibold text-gray-800"
              >
                <span className="text-lg shrink-0">{chip.icon}</span>
                <span className="leading-tight">{lang === 'hi' ? chip.hi : chip.en}</span>
              </motion.div>
            ))}
          </div>

          <div>
            <SourceTag
              type="literature"
              text={lang === 'hi' ? 'ग्रीनफील्ड तर्क' : 'Greenfield-first rationale'}
              detail={
                lang === 'hi'
                  ? 'निर्माण के समय पानी/सीवर के साथ पाइप डालने से पुराने शहरों की तुलना में 2–3× खुदाई लागत बचती है।'
                  : 'Co-trenching during initial township construction avoids 2–3× retrofit excavation cost.'
              }
            />
          </div>
        </section>

        {/* 3. Interactive Animated 5-Phase Roadmap Player */}
        <section className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-7 shadow-sm space-y-6">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold" style={{ color: 'var(--brand-navy)' }}>
                <T en="2. 27-Month Phased Roadmap" hi="2. 27-माह का चरणबद्ध रोडमैप" />
              </h2>
            </div>

            <button
              type="button"
              onClick={() => setIsPlaying((p) => !p)}
              className="no-print inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-xs sm:text-sm font-semibold transition-colors hover:bg-orange-50 cursor-pointer"
              style={{ borderColor: 'var(--brand-orange)', color: 'var(--brand-orange)' }}
            >
              {isPlaying ? <Pause size={15} /> : <Play size={15} />}
              {isPlaying
                ? lang === 'hi' ? 'रोकें' : 'Pause'
                : lang === 'hi' ? 'ऑटो चलाएं' : 'Auto-Play'}
            </button>
          </div>

          {/* Interactive 5-Step Progress Track */}
          <div className="relative pt-1">
            <div className="hidden sm:block absolute top-6 left-[10%] right-[10%] h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ background: 'var(--brand-orange)' }}
                animate={{ width: `${((activePhase - 1) / (PHASES.length - 1)) * 100}%` }}
                transition={{ duration: 0.4 }}
              />
            </div>

            <div className="grid grid-cols-5 gap-2 relative z-10">
              {PHASES.map((phase) => {
                const isActive = phase.step === activePhase
                const isDone = phase.step < activePhase
                return (
                  <button
                    key={phase.step}
                    type="button"
                    onClick={() => {
                      setActivePhase(phase.step)
                      setIsPlaying(false)
                    }}
                    className="flex flex-col items-center text-center group cursor-pointer"
                  >
                    <motion.div
                      animate={{ scale: isActive ? 1.15 : 1 }}
                      className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center font-bold text-sm sm:text-base transition-colors border-2 ${
                        isActive
                          ? 'text-white border-orange-600 shadow-md'
                          : isDone
                          ? 'bg-orange-100 text-orange-700 border-orange-300'
                          : 'bg-white text-gray-500 border-gray-200 group-hover:border-orange-300'
                      }`}
                      style={isActive ? { background: 'var(--brand-orange)' } : undefined}
                    >
                      {phase.step}
                    </motion.div>
                    <span
                      className={`mt-2 text-[11px] sm:text-xs font-bold leading-tight ${
                        isActive ? 'text-orange-600' : 'text-gray-600'
                      }`}
                    >
                      {lang === 'hi' ? phase.duration.hi : phase.duration.en}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Animated SVG Stage for Active Phase */}
          <PhaseVisualStage step={activePhase} lang={lang} />

          {/* Concise Caption + Optional Details Toggle */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50 rounded-xl px-4 py-3.5 border border-slate-200">
            <div className="flex items-center gap-3 flex-wrap">
              <span
                className="px-2.5 py-0.5 rounded-full text-xs font-bold text-white"
                style={{ background: 'var(--brand-orange)' }}
              >
                {lang === 'hi' ? `चरण ${currentPhase.step}` : `Phase ${currentPhase.step}`} ·{' '}
                {lang === 'hi' ? currentPhase.duration.hi : currentPhase.duration.en}
              </span>
              <h3 className="font-bold text-base sm:text-lg" style={{ color: 'var(--brand-navy)' }}>
                {lang === 'hi' ? currentPhase.title.hi : currentPhase.title.en}
              </h3>
            </div>

            <button
              type="button"
              onClick={() => setShowPhaseDetail((s) => !s)}
              className="no-print inline-flex items-center gap-1 text-xs font-semibold text-orange-600 hover:text-orange-700 self-start sm:self-auto cursor-pointer"
            >
              <T en={showPhaseDetail ? 'Hide detail' : 'More detail'} hi={showPhaseDetail ? 'छुपाएं' : 'और जानें'} />
              <ChevronDown
                size={15}
                className={`transition-transform ${showPhaseDetail ? 'rotate-180' : ''}`}
              />
            </button>
          </div>

          <AnimatePresence>
            {showPhaseDetail && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <p className="text-sm text-gray-700 bg-orange-50/60 border border-orange-200 rounded-xl p-4 leading-relaxed">
                  {lang === 'hi' ? currentPhase.desc.hi : currentPhase.desc.en}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* 4. Animated Delivery & Financing Models */}
        <section className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-7 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-xl sm:text-2xl font-bold" style={{ color: 'var(--brand-navy)' }}>
              <T en="3. Who Funds & Runs It?" hi="3. पैसा और संचालन कौन करेगा?" />
            </h2>

            <div className="no-print inline-flex rounded-xl bg-gray-100 p-1 self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setModelIdx(0)}
                className={`px-3.5 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  modelIdx === 0 ? 'text-white shadow-sm' : 'text-gray-600 hover:text-gray-900'
                }`}
                style={modelIdx === 0 ? { background: 'var(--brand-navy)' } : undefined}
              >
                PPP / DBFOT
              </button>
              <button
                type="button"
                onClick={() => setModelIdx(1)}
                className={`px-3.5 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  modelIdx === 1 ? 'text-white shadow-sm' : 'text-gray-600 hover:text-gray-900'
                }`}
                style={modelIdx === 1 ? { background: 'var(--brand-navy)' } : undefined}
              >
                <T en="Public CAPEX + O&M" hi="सरकारी पूंजी + O&M" />
              </button>
            </div>
          </div>

          <DeliveryFlowDiagram lang={lang} modelIndex={modelIdx} />

          {/* Quick visual Pro / Con summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="flex items-center gap-2.5 bg-green-50 border border-green-200 rounded-xl px-4 py-3">
              <Check size={18} className="text-green-600 shrink-0" />
              <span className="text-xs sm:text-sm font-semibold text-green-900">
                {modelIdx === 0
                  ? lang === 'hi'
                    ? 'फायदा: जोखिम निजी फर्म पर + कुशल O&M'
                    : 'Pro: Performance risk transferred + skilled O&M'
                  : lang === 'hi'
                  ? 'फायदा: कुल लागत कम + सरकारी स्वामित्व'
                  : 'Pro: Lower lifecycle cost + 100% public asset'}
              </span>
            </div>
            <div className="flex items-center gap-2.5 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
              <X size={18} className="text-red-600 shrink-0" />
              <span className="text-xs sm:text-sm font-semibold text-red-900">
                {modelIdx === 0
                  ? lang === 'hi'
                    ? 'चुनौती: न्यूनतम कचरा गारंटी व मज़बूत अनुबंध'
                    : 'Watch-out: Needs guaranteed tonnage & tight contract'
                  : lang === 'hi'
                  ? 'चुनौती: शुरुआती सरकारी बजट व कड़ी निगरानी'
                  : 'Watch-out: Upfront govt budget + SLA monitoring'}
              </span>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => setShowModelDetail((s) => !s)}
              className="no-print inline-flex items-center gap-1 text-xs font-semibold text-orange-600 hover:text-orange-700 cursor-pointer"
            >
              <T en={showModelDetail ? 'Hide details' : 'Full comparison note'} hi={showModelDetail ? 'छुपाएं' : 'पूरा विवरण देखें'} />
              <ChevronDown
                size={15}
                className={`transition-transform ${showModelDetail ? 'rotate-180' : ''}`}
              />
            </button>
          </div>

          <AnimatePresence>
            {showModelDetail && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2 text-xs sm:text-sm text-gray-700">
                  <p className="font-bold" style={{ color: 'var(--brand-navy)' }}>
                    {lang === 'hi' ? currentModel.model.hi : currentModel.model.en}
                  </p>
                  <p>{lang === 'hi' ? currentModel.whoFunds.hi : currentModel.whoFunds.en}</p>
                  <p className="text-green-800">✓ {lang === 'hi' ? currentModel.pros.hi : currentModel.pros.en}</p>
                  <p className="text-red-800">✗ {lang === 'hi' ? currentModel.cons.hi : currentModel.cons.en}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* 5. Animated KPI Visual Gauges */}
        <section className="space-y-5">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <h2 className="text-xl sm:text-2xl font-bold" style={{ color: 'var(--brand-navy)' }}>
              <T en="4. What We Measure in 12 Months" hi="4. 12 महीने में क्या मापा जाएगा (KPIs)" />
            </h2>
            <Link
              href="/dashboard"
              className="no-print inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border text-xs sm:text-sm font-semibold transition-colors hover:bg-blue-50"
              style={{ borderColor: 'var(--brand-navy)', color: 'var(--brand-navy)' }}
            >
              <T en="View Live SCADA Demo →" hi="लाइव SCADA डेमो देखें →" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {KPIS.map((kpi, i) => {
              const vis = KPI_VISUALS[i] ?? KPI_VISUALS[0]
              return (
                <motion.div
                  key={i}
                  initial={false}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: i * 0.07 }}
                  className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm flex flex-col justify-between gap-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-2xl">{vis.icon}</span>
                    <span className="text-base font-extrabold" style={{ color: vis.color }}>
                      {vis.value}
                    </span>
                  </div>

                  {/* Animated Gauge Bar */}
                  <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: vis.color }}
                      initial={{ width: 0 }}
                      whileInView={{ width: `${vis.pct}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.9, delay: 0.15 + i * 0.08 }}
                    />
                  </div>

                  <div>
                    <p className="text-xs font-bold leading-snug" style={{ color: 'var(--brand-navy)' }}>
                      {lang === 'hi' ? kpi.metric.hi : kpi.metric.en}
                    </p>
                    <p className="text-[11px] text-gray-500 mt-0.5 leading-snug">
                      {lang === 'hi' ? kpi.target.hi : kpi.target.en}
                    </p>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </section>

        {/* 6. Animated Risk → Mitigation Transformation Cards */}
        <section className="space-y-5">
          <h2 className="text-xl sm:text-2xl font-bold" style={{ color: 'var(--brand-navy)' }}>
            <T en="5. Risks → Built-In Solutions" hi="5. जोखिम और उनके पक्के समाधान" />
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {RISKS.map((r, i) => {
              const short = RISK_SHORT[i] ?? RISK_SHORT[0]
              const isOpen = expandedRisk === i
              return (
                <motion.div
                  key={i}
                  initial={false}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07 }}
                  className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm"
                >
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2">
                      <span className="text-lg">{short.riskIcon}</span>
                      <span className="text-xs sm:text-sm font-bold text-amber-900">
                        {lang === 'hi' ? short.riskHi : short.riskEn}
                      </span>
                    </div>

                    <motion.div
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.6, repeat: Infinity }}
                      className="text-orange-500 font-bold"
                    >
                      <ArrowRight size={18} />
                    </motion.div>

                    <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-3 py-2 flex-1 min-w-[165px]">
                      <span className="text-lg">{short.fixIcon}</span>
                      <span className="text-xs sm:text-sm font-bold text-green-900">
                        {lang === 'hi' ? short.fixHi : short.fixEn}
                      </span>
                    </div>
                  </div>

                  <div className="mt-2.5 flex justify-end">
                    <button
                      type="button"
                      onClick={() => setExpandedRisk(isOpen ? null : i)}
                      className="no-print text-xs font-semibold text-slate-500 hover:text-orange-600 inline-flex items-center gap-1 cursor-pointer"
                    >
                      <T en={isOpen ? 'Hide note' : 'Details'} hi={isOpen ? 'छुपाएं' : 'विवरण'} />
                      <ChevronDown size={13} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                    </button>
                  </div>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden text-xs text-gray-600 pt-2 border-t border-gray-100 mt-2 leading-relaxed"
                      >
                        <strong>{lang === 'hi' ? r.risk.hi : r.risk.en}:</strong>{' '}
                        {lang === 'hi' ? r.mitigation.hi : r.mitigation.en}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </motion.div>
              )
            })}
          </div>
        </section>

        {/* 7. Visual Policy Alignment Cards */}
        <section className="space-y-5">
          <div className="flex items-center gap-2">
            <ShieldCheck size={22} style={{ color: 'var(--brand-green)' }} />
            <h2 className="text-xl sm:text-2xl font-bold" style={{ color: 'var(--brand-navy)' }}>
              <T en="6. Ready for Indian Rules & Missions" hi="6. भारतीय नियमों और मिशनों के अनुरूप" />
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {POLICIES.map((pol, i) => {
              const badges = POLICY_BADGES[i] ?? POLICY_BADGES[0]
              const isOpen = expandedPolicy === i
              return (
                <motion.div
                  key={i}
                  initial={false}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="bg-blue-50/70 border border-blue-200 rounded-2xl p-5 shadow-sm space-y-3"
                >
                  <h3 className="font-bold text-sm sm:text-base text-blue-950">
                    {lang === 'hi' ? pol.title.hi : pol.title.en}
                  </h3>

                  <div className="flex flex-wrap gap-2">
                    {badges.map((b, bi) => (
                      <span
                        key={bi}
                        className="inline-flex items-center gap-1.5 bg-white border border-blue-200 rounded-full px-3 py-1 text-xs font-semibold text-blue-900"
                      >
                        <span>{b.icon}</span>
                        <span>{lang === 'hi' ? b.hi : b.en}</span>
                      </span>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => setExpandedPolicy(isOpen ? null : i)}
                    className="no-print text-xs font-semibold text-blue-700 hover:underline inline-flex items-center gap-1 cursor-pointer"
                  >
                    <T en={isOpen ? 'Hide policy note' : 'Read policy note'} hi={isOpen ? 'छुपाएं' : 'नियम विवरण पढ़ें'} />
                    <ChevronDown size={13} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden text-xs sm:text-sm text-blue-900 leading-relaxed pt-1"
                      >
                        {lang === 'hi' ? pol.detail.hi : pol.detail.en}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </motion.div>
              )
            })}
          </div>
        </section>

        {/* 8. Animated 1 -> 2 -> 3 Next Steps CTA */}
        <section className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-sm">
          <h2 className="text-xl sm:text-2xl font-bold text-center mb-6" style={{ color: 'var(--brand-navy)' }}>
            <T en="Start a Pilot in 3 Simple Steps" hi="3 आसान कदमों में पायलट शुरू करें" />
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {NEXT_STEPS.map((step, i) => (
              <motion.div
                key={i}
                initial={false}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}
                className="relative rounded-xl border border-gray-200 bg-slate-50/70 p-4 flex items-center gap-3"
              >
                <motion.span
                  animate={{ scale: [1, 1.12, 1] }}
                  transition={{ duration: 2.2, repeat: Infinity, delay: i * 0.5 }}
                  className="text-3xl shrink-0"
                >
                  {step.icon}
                </motion.span>
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-orange-600">
                    {lang === 'hi' ? `कदम ${i + 1}` : `Step ${i + 1}`}
                  </span>
                  <p className="text-sm font-bold text-gray-800">
                    {lang === 'hi' ? step.hi : step.en}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/contact"
              className="no-print inline-flex items-center px-7 py-3.5 rounded-xl text-white font-semibold text-base shadow-sm transition-opacity hover:opacity-90"
              style={{ background: 'var(--brand-orange)' }}
            >
              <T en="Get In Touch →" hi="संपर्क करें →" />
            </Link>
            <Link
              href="/dashboard"
              className="no-print inline-flex items-center px-6 py-3.5 rounded-xl border-2 font-semibold text-base transition-colors hover:bg-blue-50"
              style={{ borderColor: 'var(--brand-navy)', color: 'var(--brand-navy)' }}
            >
              <T en="View Live SCADA Demo →" hi="लाइव SCADA डेमो देखें →" />
            </Link>
          </div>
        </section>

      </div>
    </div>
  )
}
