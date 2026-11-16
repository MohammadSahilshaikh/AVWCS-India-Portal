'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence, useInView, useScroll } from 'framer-motion'
import { ChevronDown, ChevronUp, Truck, ArrowUp, Wind, ArrowRight, Gauge } from 'lucide-react'
import T from '@/components/ui/T'
import { useLang } from '@/components/ui/LangContext'
import SourceTag from '@/components/ui/SourceTag'
import stepsData from '@/data/steps.json'
import type { BilingualText, Step, SequenceCycle } from '@/lib/types'

// ── Live JSON data from src/data/steps.json ──────────────────────────────────
const steps: Step[] = stepsData.steps
const sequenceCycle: SequenceCycle[] = stepsData.sequenceCycle

const sourceDetails: Record<string, BilingualText> = {
  deposit: {
    en: 'Solid Waste Management Rules 2026 mandate 3-stream source segregation (wet, dry, residual). Controlled ~300–400 mm inlet hatches help block oversized objects at street level.',
    hi: 'ठोस अपशिष्ट प्रबंधन नियम 2026 तीन-धारा स्रोत पृथक्करण (गीला, सूखा, शेष) अनिवार्य करते हैं। लगभग 300–400 मिमी इनलेट ढक्कन बड़े सामान को अंदर जाने से रोकते हैं।',
  },
  storage: {
    en: 'Standard AVWCS control logic isolates each chute from the vacuum line via a closed pneumatic valve until ultrasonic/optical sensors detect 75–85% fill or a timer triggers.',
    hi: 'मानक AVWCS नियंत्रण लॉजिक में हर च्यूट के नीचे बंद न्यूमैटिक वाल्व होता है जो 75–85% भराव या तय टाइमर तक वैक्यूम लाइन से दबाव को अलग रखता है।',
  },
  vacuum: {
    en: 'Published pneumatic engineering benchmarks specify VFD centrifugal exhausters maintaining -40 to -70 kPa negative gauge pressure prior to valve opening.',
    hi: 'प्रकाशित न्यूमैटिक इंजीनियरिंग मानकों के अनुसार वाल्व खुलने से पहले VFD सेंट्रीफ्यूगल एग्ज़ॉस्टर पंखे -40 से -70 kPa नेगेटिव प्रेशर बनाते हैं।',
  },
  transport: {
    en: 'Published AVWCS operational range reports 60–90 km/h (typically 60–80 km/h / 17–22 m/s) air transport velocity inside 400–500 mm buried carbon-steel pipes.',
    hi: 'प्रकाशित AVWCS मानकों के अनुसार 400–500 मिमी भूमिगत कार्बन-स्टील पाइपलाइन में 60–90 किमी/घंटा (आमतौर पर 60–80 किमी/घंटा) गति से कचरा चलता है।',
  },
  separation: {
    en: 'Central terminal architecture combines a cyclone vortex separator, rotary airlock, diverter gate, and 3:1–5:1 hydraulic compactors dedicated to each waste stream.',
    hi: 'केंद्रीय टर्मिनल डिज़ाइन में साइक्लोन सेपरेटर, रोटरी एयरलॉक, डाइवर्टर गेट और प्रत्येक कचरा धारा के लिए 3:1–5:1 हाइड्रोलिक कॉम्पैक्टर शामिल होते हैं।',
  },
  air_treatment: {
    en: 'Environmental odour control stages use multi-stage particulate filters plus activated carbon or moist biofilter media to scrub VOCs and H₂S prior to release.',
    hi: 'दुर्गंध नियंत्रण के लिए मल्टी-स्टेज पार्टिकुलेट फिल्टर के बाद एक्टिवेटेड कार्बन या बायोफिल्टर मीडिया से VOCs और H₂S गैसों को साफ किया जाता है।',
  },
  removal: {
    en: 'Perimeter hook-lift haulage consolidates pre-compacted sealed containers at one terminal edge, removing daily door-to-door garbage trucks from residential streets.',
    hi: 'टर्मिनल पर पहले से कॉम्पैक्ट और सीलबंद कंटेनर हुक-लिफ्ट ट्रक द्वारा सीधे उठाए जाते हैं, जिससे आवासीय सड़कों से रोज़ाना कचरा ट्रकों का आना बंद होता है।',
  },
}

// ── Diagram component ─────────────────────────────────────────────────────────
function SystemDiagram({ activeStep }: { activeStep: Step }) {
  const { lang } = useLang()
  const isHi = lang === 'hi'
  const activeHighlight = activeStep.diagramHighlight
  const isActive = (key: string) => activeHighlight === key
  const terminalActive = ['fans', 'separator', 'biofilter', 'container'].includes(activeHighlight)

  const labels = {
    streetLevel: isHi ? 'सड़क स्तर' : 'Street Level',
    underground: isHi ? 'भूमिगत' : 'Underground',
    inlets: isHi ? 'इनलेट्स' : 'Inlets',
    wet: isHi ? 'गीला' : 'Wet',
    dry: isHi ? 'सूखा' : 'Dry',
    res: isHi ? 'शेष' : 'Res',
    chute: isHi ? 'च्यूट' : 'Chute',
    valve: isHi ? 'वाल्व' : 'Valve',
    pipeline: isHi ? 'भूमिगत पाइपलाइन' : 'Underground Pipeline',
    terminal: isHi ? 'टर्मिनल' : 'Terminal',
    fans: isHi ? 'पंखे' : 'Fans',
    biofilter: isHi ? 'बायोफिल्टर' : 'Biofilter',
    separator: isHi ? 'सेपरेटर' : 'Separator',
    compactor: isHi ? 'कॉम्पैक्टर' : 'Compactor',
    containers: isHi ? 'सीलबंद कंटेनर' : 'Sealed Containers',
    legendOrganic: isHi ? 'ऑर्गेनिक' : 'Organic',
    legendRecyclable: isHi ? 'रीसाइकिल' : 'Recyclable',
    legendResidual: isHi ? 'शेष' : 'Residual',
    legendActive: isHi ? 'सक्रिय' : 'Active',
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-3 sm:p-4">
      <div className="flex items-center justify-between mb-2 px-1">
        <div className="flex items-center gap-2 min-w-0">
          <span
            className="w-6 h-6 rounded-full text-white text-xs font-bold flex items-center justify-center flex-shrink-0"
            style={{ background: 'var(--brand-orange)' }}
          >
            {activeStep.id}
          </span>
          <span className="text-xs sm:text-sm font-semibold truncate" style={{ color: 'var(--brand-navy)' }}>
            {isHi ? activeStep.shortLabel.hi : activeStep.shortLabel.en}
          </span>
        </div>
        {isActive('container') && (
          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-orange-50 text-orange-700 border border-orange-200 flex-shrink-0">
            <Truck size={13} />
            <T en="Pickup Ready" hi="पिकअप तैयार" />
          </span>
        )}
      </div>

      <svg
        viewBox="0 0 400 300"
        className="w-full rounded-xl border border-slate-100 bg-[#FAFAF8]"
        style={{ aspectRatio: '4/3' }}
        aria-label={isHi ? 'AVWCS प्रणाली आरेख' : 'AVWCS system diagram'}
      >
        <defs>
          <filter id="greenGlow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="orangeGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Background */}
        <rect x="0" y="0" width="400" height="300" fill="#FAFAF8" rx="10" />

        {/* Sky / street vs underground */}
        <rect x="0" y="132" width="400" height="168" fill="#F1F5F9" opacity="0.55" />
        <line x1="0" y1="132" x2="400" y2="132" stroke="#CBD5E1" strokeWidth="1.5" strokeDasharray="5 3" />
        <text x="10" y="125" fontSize="8" fill="#64748B" fontWeight="600">{labels.streetLevel}</text>
        <text x="10" y="144" fontSize="8" fill="#64748B" fontWeight="600">{labels.underground}</text>

        {/* ── INLETS (top-left) ── */}
        <text x="86" y="32" textAnchor="middle" fontSize="10" fill="#1E3A5F" fontWeight="700">
          {labels.inlets}
        </text>
        {isActive('inlets') && (
          <motion.rect
            x="26"
            y="38"
            width="120"
            height="46"
            rx="12"
            fill="rgba(22, 163, 74, 0.08)"
            stroke="#16A34A"
            strokeWidth="1.5"
            filter="url(#greenGlow)"
            initial={{ opacity: 0.4 }}
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        )}

        {/* Green, Blue, Grey inlets */}
        <g filter={isActive('inlets') ? 'url(#greenGlow)' : undefined}>
          <circle
            cx="48"
            cy="61"
            r="13"
            fill={isActive('inlets') ? '#16A34A' : '#DCFCE7'}
            stroke="#16A34A"
            strokeWidth="2"
          />
          <text
            x="48"
            y="64"
            textAnchor="middle"
            fontSize="8"
            fill={isActive('inlets') ? '#FFFFFF' : '#16A34A'}
            fontWeight="700"
          >
            {labels.wet}
          </text>

          <circle
            cx="86"
            cy="61"
            r="13"
            fill={isActive('inlets') ? '#2563EB' : '#DBEAFE'}
            stroke="#2563EB"
            strokeWidth="2"
          />
          <text
            x="86"
            y="64"
            textAnchor="middle"
            fontSize="8"
            fill={isActive('inlets') ? '#FFFFFF' : '#2563EB'}
            fontWeight="700"
          >
            {labels.dry}
          </text>

          <circle
            cx="124"
            cy="61"
            r="13"
            fill={isActive('inlets') ? '#475569' : '#E2E8F0'}
            stroke="#475569"
            strokeWidth="2"
          />
          <text
            x="124"
            y="64"
            textAnchor="middle"
            fontSize="8"
            fill={isActive('inlets') ? '#FFFFFF' : '#475569'}
            fontWeight="700"
          >
            {labels.res}
          </text>
        </g>

        {/* Lines going down from inlets to chute cylinder */}
        <line x1="48" y1="74" x2="72" y2="96" stroke={isActive('inlets') || isActive('chute') ? '#16A34A' : '#94A3B8'} strokeWidth="2" />
        <line x1="86" y1="74" x2="86" y2="96" stroke={isActive('inlets') || isActive('chute') ? '#2563EB' : '#94A3B8'} strokeWidth="2" />
        <line x1="124" y1="74" x2="100" y2="96" stroke={isActive('inlets') || isActive('chute') ? '#475569' : '#94A3B8'} strokeWidth="2" />

        {/* ── VERTICAL CYLINDER CHUTE BELOW INLETS ── */}
        <g filter={isActive('chute') ? 'url(#orangeGlow)' : undefined}>
          {/* Cylinder body */}
          <rect
            x="64"
            y="96"
            width="44"
            height="56"
            fill={isActive('chute') ? '#FFF7ED' : '#FFFFFF'}
            stroke={isActive('chute') ? '#EA580C' : '#94A3B8'}
            strokeWidth={isActive('chute') ? 2.2 : 1.5}
          />
          {/* Cylinder top & bottom ellipses */}
          <ellipse
            cx="86"
            cy="96"
            rx="22"
            ry="5"
            fill={isActive('chute') ? '#FFEDD5' : '#F8FAFC'}
            stroke={isActive('chute') ? '#EA580C' : '#94A3B8'}
            strokeWidth={isActive('chute') ? 2 : 1.5}
          />
          <ellipse
            cx="86"
            cy="152"
            rx="22"
            ry="5"
            fill={isActive('chute') ? '#FED7AA' : '#E2E8F0'}
            stroke={isActive('chute') ? '#EA580C' : '#94A3B8'}
            strokeWidth={isActive('chute') ? 2 : 1.5}
          />
          {/* Stored waste fill inside cylinder */}
          <motion.rect
            x="68"
            y="118"
            width="36"
            height="28"
            rx="2"
            fill={isActive('chute') ? '#EA580C' : '#CBD5E1'}
            opacity={isActive('chute') ? 0.35 : 0.25}
            animate={isActive('chute') ? { opacity: [0.25, 0.55, 0.25] } : { opacity: 0.25 }}
            transition={{ duration: 1.4, repeat: Infinity }}
          />
          <text
            x="86"
            y="125"
            textAnchor="middle"
            fontSize="7.5"
            fill={isActive('chute') ? '#C2410C' : '#475569'}
            fontWeight="700"
          >
            {labels.chute}
          </text>
          {/* Discharge valve bar */}
          <line
            x1="66"
            y1="152"
            x2="106"
            y2="152"
            stroke={isActive('chute') ? '#EA580C' : '#64748B'}
            strokeWidth="3"
          />
          <text
            x="86"
            y="165"
            textAnchor="middle"
            fontSize="7"
            fill={isActive('chute') ? '#EA580C' : '#64748B'}
            fontWeight="600"
          >
            {labels.valve}
          </text>
        </g>

        {/* Vertical drop line from chute down to horizontal pipe */}
        <line
          x1="86"
          y1="157"
          x2="86"
          y2="188"
          stroke={isActive('chute') || isActive('pipeline') ? '#EA580C' : '#94A3B8'}
          strokeWidth="3"
        />

        {/* ── HORIZONTAL UNDERGROUND PIPELINE ── */}
        <rect
          x="74"
          y="188"
          width="162"
          height="22"
          rx="6"
          fill={isActive('pipeline') ? '#1E3A5F' : '#E2E8F0'}
          stroke={isActive('pipeline') ? '#EA580C' : '#94A3B8'}
          strokeWidth={isActive('pipeline') ? 2.2 : 1.5}
        />
        <text
          x="155"
          y="222"
          textAnchor="middle"
          fontSize="8.5"
          fill={isActive('pipeline') ? '#1E3A5F' : '#475569'}
          fontWeight="700"
        >
          {labels.pipeline}
        </text>

        {/* Animated dots traveling along pipe during transport */}
        {isActive('pipeline') && (
          <g>
            <motion.circle
              cx={86}
              cy={199}
              r={5}
              fill="#EA580C"
              animate={{ x: [0, 138] }}
              transition={{ duration: 1.25, repeat: Infinity, ease: 'linear' }}
            />
            <motion.circle
              cx={86}
              cy={199}
              r={3.5}
              fill="#FDBA74"
              animate={{ x: [0, 138] }}
              transition={{ duration: 1.25, repeat: Infinity, ease: 'linear', delay: 0.6 }}
            />
          </g>
        )}

        {/* ── LARGE ORANGE TERMINAL BOX (right end) ── */}
        <rect
          x="236"
          y="58"
          width="150"
          height="200"
          rx="10"
          fill={terminalActive ? '#FFF7ED' : '#FFFBF5'}
          stroke="#EA580C"
          strokeWidth={terminalActive ? 2.5 : 1.8}
        />
        <rect x="236" y="58" width="150" height="22" rx="10" fill="#EA580C" />
        <rect x="236" y="70" width="150" height="10" fill="#EA580C" />
        <text x="311" y="73" textAnchor="middle" fontSize="10" fill="#FFFFFF" fontWeight="700">
          {labels.terminal}
        </text>

        {/* Exhauster Fans (Step 3) */}
        <g>
          <rect
            x="246"
            y="88"
            width="60"
            height="46"
            rx="6"
            fill={isActive('fans') ? '#1E3A5F' : '#FFFFFF'}
            stroke={isActive('fans') ? '#1E3A5F' : '#CBD5E1'}
            strokeWidth={isActive('fans') ? 2 : 1.2}
          />
          {/* Animated fan blades */}
          <g transform="translate(276, 108)">
            <circle
              cx="0"
              cy="0"
              r="12"
              fill="none"
              stroke={isActive('fans') ? '#93C5FD' : '#CBD5E1'}
              strokeWidth="1.2"
            />
            <motion.g
              animate={isActive('fans') ? { rotate: 360 } : { rotate: 0 }}
              transition={
                isActive('fans')
                  ? { duration: 0.85, repeat: Infinity, ease: 'linear' }
                  : { duration: 0.3 }
              }
            >
              <path
                d="M0,-10 C3,-6 3,-2 0,0 C-3,-2 -3,-6 0,-10 Z"
                fill={isActive('fans') ? '#F97316' : '#94A3B8'}
              />
              <path
                d="M0,10 C3,6 3,2 0,0 C-3,2 -3,6 0,10 Z"
                fill={isActive('fans') ? '#F97316' : '#94A3B8'}
              />
              <path
                d="M10,0 C6,3 2,3 0,0 C2,-3 6,-3 10,0 Z"
                fill={isActive('fans') ? '#FDBA74' : '#94A3B8'}
              />
              <path
                d="M-10,0 C-6,3 -2,3 0,0 C-2,-3 -6,-3 -10,0 Z"
                fill={isActive('fans') ? '#FDBA74' : '#94A3B8'}
              />
            </motion.g>
            <circle cx="0" cy="0" r="2.5" fill={isActive('fans') ? '#FFFFFF' : '#64748B'} />
          </g>
          <text
            x="276"
            y="129"
            textAnchor="middle"
            fontSize="7"
            fill={isActive('fans') ? '#FFFFFF' : '#475569'}
            fontWeight="700"
          >
            {labels.fans}
          </text>
        </g>

        {/* Biofilter (Step 6) */}
        <g>
          <rect
            x="316"
            y="88"
            width="60"
            height="46"
            rx="6"
            fill={isActive('biofilter') ? '#16A34A' : '#FFFFFF'}
            stroke={isActive('biofilter') ? '#15803D' : '#CBD5E1'}
            strokeWidth={isActive('biofilter') ? 2 : 1.2}
          />
          {isActive('biofilter') && (
            <motion.g
              animate={{ y: [0, -4, 0], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.2, repeat: Infinity }}
            >
              <line x1="336" y1="84" x2="336" y2="78" stroke="#16A34A" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="346" y1="84" x2="346" y2="76" stroke="#16A34A" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="356" y1="84" x2="356" y2="78" stroke="#16A34A" strokeWidth="1.5" strokeLinecap="round" />
            </motion.g>
          )}
          <text
            x="346"
            y="114"
            textAnchor="middle"
            fontSize="8"
            fill={isActive('biofilter') ? '#FFFFFF' : '#475569'}
            fontWeight="700"
          >
            {labels.biofilter}
          </text>
        </g>

        {/* Separator (Step 5) */}
        <g>
          <motion.rect
            x="246"
            y="144"
            width="60"
            height="42"
            rx="6"
            fill={isActive('separator') ? '#16A34A' : '#FFFFFF'}
            stroke={isActive('separator') ? '#15803D' : '#CBD5E1'}
            strokeWidth={isActive('separator') ? 2 : 1.2}
            animate={isActive('separator') ? { scale: [1, 1.03, 1] } : { scale: 1 }}
            transition={isActive('separator') ? { duration: 1.1, repeat: Infinity } : undefined}
          />
          <text
            x="276"
            y="168"
            textAnchor="middle"
            fontSize="8"
            fill={isActive('separator') ? '#FFFFFF' : '#475569'}
            fontWeight="700"
          >
            {labels.separator}
          </text>
        </g>

        {/* Compactor */}
        <g>
          <rect
            x="316"
            y="144"
            width="60"
            height="42"
            rx="6"
            fill={isActive('separator') ? '#DCFCE7' : '#FFFFFF'}
            stroke={isActive('separator') ? '#16A34A' : '#CBD5E1'}
            strokeWidth={isActive('separator') ? 1.8 : 1.2}
          />
          <text
            x="346"
            y="168"
            textAnchor="middle"
            fontSize="8"
            fill={isActive('separator') ? '#15803D' : '#475569'}
            fontWeight="700"
          >
            {labels.compactor}
          </text>
        </g>

        {/* Containers + Truck icon (Step 7) */}
        <g>
          <rect
            x="246"
            y="196"
            width="130"
            height="50"
            rx="6"
            fill={isActive('container') ? '#1E3A5F' : '#FFFFFF'}
            stroke={isActive('container') ? '#1E3A5F' : '#CBD5E1'}
            strokeWidth={isActive('container') ? 2 : 1.2}
          />
          <text
            x="311"
            y="214"
            textAnchor="middle"
            fontSize="8.5"
            fill={isActive('container') ? '#FFFFFF' : '#475569'}
            fontWeight="700"
          >
            {labels.containers}
          </text>
          {/* 3 mini waste stream containers */}
          <rect x="256" y="222" width="22" height="16" rx="2" fill="#16A34A" opacity={isActive('container') ? 1 : 0.65} />
          <rect x="284" y="222" width="22" height="16" rx="2" fill="#2563EB" opacity={isActive('container') ? 1 : 0.65} />
          <rect x="312" y="222" width="22" height="16" rx="2" fill="#475569" opacity={isActive('container') ? 1 : 0.65} />

          {/* Vector Truck icon when Step 7 active */}
          {isActive('container') && (
            <motion.g
              transform="translate(342, 220)"
              initial={{ x: 8, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              <rect x="0" y="3" width="16" height="11" rx="2" fill="#EA580C" />
              <path d="M16,6 L22,6 L25,10 L25,14 L16,14 Z" fill="#FDBA74" />
              <circle cx="5" cy="16" r="2.5" fill="#FFFFFF" stroke="#1E3A5F" strokeWidth="1" />
              <circle cx="20" cy="16" r="2.5" fill="#FFFFFF" stroke="#1E3A5F" strokeWidth="1" />
            </motion.g>
          )}
        </g>

        {/* Legend */}
        <g transform="translate(16, 278)">
          <circle cx="0" cy="0" r="4.5" fill="#16A34A" />
          <text x="9" y="3" fontSize="8" fill="#475569">{labels.legendOrganic}</text>
          <circle cx="68" cy="0" r="4.5" fill="#2563EB" />
          <text x="77" y="3" fontSize="8" fill="#475569">{labels.legendRecyclable}</text>
          <circle cx="146" cy="0" r="4.5" fill="#475569" />
          <text x="155" y="3" fontSize="8" fill="#475569">{labels.legendResidual}</text>
          <circle cx="214" cy="0" r="4.5" fill="#EA580C" />
          <text x="223" y="3" fontSize="8" fill="#475569">{labels.legendActive}</text>
        </g>
      </svg>
    </div>
  )
}

// ── Step panel ────────────────────────────────────────────────────────────────
function StepPanel({
  step,
  isActive,
  onVisibilityChange,
}: {
  step: Step
  isActive: boolean
  onVisibilityChange: (stepId: number, inView: boolean) => void
}) {
  const { lang } = useLang()
  const [expanded, setExpanded] = useState(false)
  const [overflowVisible, setOverflowVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { margin: '-35% 0px -35% 0px' })

  useEffect(() => {
    onVisibilityChange(step.id, inView)
  }, [inView, onVisibilityChange, step.id])

  const badgeColors: Record<string, string> = {
    'Street Level': 'bg-green-100 text-green-700',
    'Underground Chute': 'bg-orange-100 text-orange-700',
    'Central Terminal': 'bg-blue-100 text-blue-700',
    'Underground Pipe': 'bg-slate-100 text-slate-700',
    'Separator & Press': 'bg-green-100 text-green-700',
    'Odour Control': 'bg-teal-100 text-teal-700',
    'Sealed Haulage': 'bg-indigo-100 text-indigo-900',
  }

  const badgeClass = badgeColors[step.badge.en] ?? 'bg-gray-100 text-gray-600'
  const detailText = sourceDetails[step.key]

  const toggleExpanded = () => {
    if (expanded) {
      setOverflowVisible(false)
      setExpanded(false)
    } else {
      setExpanded(true)
    }
  }

  return (
    <motion.div
      id={`step-${step.id}`}
      ref={ref}
      layout
      className={`scroll-mt-32 p-6 mb-6 bg-white rounded-2xl shadow-sm border transition-all duration-300 ${
        isActive ? 'border-orange-400 shadow-md' : 'border-gray-100'
      }`}
      initial={false}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-10%' }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex items-start gap-4">
        {/* Step number circle */}
        <div
          className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold"
          style={{ background: 'var(--brand-orange)' }}
        >
          {step.id}
        </div>
        <div className="flex-1 min-w-0">
          {/* Badge */}
          <span className={`inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full mb-2 ${badgeClass}`}>
            {lang === 'hi' ? step.badge.hi : step.badge.en}
          </span>
          {/* Title */}
          <h3 className="text-base font-bold mb-2" style={{ color: 'var(--brand-navy)' }}>
            {lang === 'hi' ? step.title.hi : step.title.en}
          </h3>
          {/* Simple explanation */}
          <p className="text-sm leading-relaxed mb-3" style={{ color: '#475569' }}>
            {lang === 'hi' ? step.simple.hi : step.simple.en}
          </p>
          {/* Collapsible technical detail (default closed) */}
          <button
            type="button"
            onClick={toggleExpanded}
            aria-expanded={expanded}
            className="flex items-center gap-1 text-xs font-medium text-orange-600 hover:text-orange-700 transition-colors cursor-pointer"
          >
            <T en="Technical Detail" hi="तकनीकी विवरण" />
            {expanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
          </button>
          <AnimatePresence initial={false}>
            {expanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                onAnimationComplete={() => {
                  if (expanded) setOverflowVisible(true)
                }}
                className={overflowVisible ? 'overflow-visible' : 'overflow-hidden'}
              >
                <div className="mt-3 p-3.5 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-600 leading-relaxed">
                  <p className="mb-2">{lang === 'hi' ? step.technical.hi : step.technical.en}</p>
                  <SourceTag
                    type="source"
                    text={lang === 'hi' ? step.sourceTag.hi : step.sourceTag.en}
                    detail={detailText ? (lang === 'hi' ? detailText.hi : detailText.en) : undefined}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  )
}

// ── Sequence cycle section ────────────────────────────────────────────────────
function SequenceCycleSection() {
  const { lang } = useLang()
  const [activeCycle, setActiveCycle] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveCycle(prev => (prev + 1) % sequenceCycle.length)
    }, 2500)
    return () => clearInterval(timer)
  }, [activeCycle])

  const cycle = sequenceCycle[activeCycle]

  return (
    <section className="mt-16 mb-10">
      <h2 className="text-2xl font-bold text-center mb-2" style={{ color: 'var(--brand-navy)' }}>
        <T en="One Waste Type at a Time" hi="एक समय में एक ही कचरे का प्रकार" />
      </h2>
      <p className="text-center text-slate-500 text-sm mb-8">
        <T
          en="The PLC sequences waste streams to prevent cross-contamination."
          hi="PLC कचरे के प्रकारों को क्रम से संसाधित करता है ताकि कचरा न मिले।"
        />
      </p>

      {/* Horizontal tabs: colored circle, label, status text */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6 items-stretch">
        {sequenceCycle.map((item, i) => {
          const isCurrent = i === activeCycle
          return (
            <motion.button
              key={item.id}
              type="button"
              onClick={() => setActiveCycle(i)}
              animate={{ scale: isCurrent ? 1.03 : 0.98 }}
              transition={{ duration: 0.25 }}
              className={`text-left rounded-2xl border-2 p-4 transition-shadow cursor-pointer flex flex-col justify-between ${
                isCurrent ? 'shadow-md' : 'bg-white opacity-80 hover:opacity-100'
              }`}
              style={{
                borderColor: item.color,
                background: isCurrent ? item.color : '#FFFFFF',
                color: isCurrent ? '#FFFFFF' : '#1E3A5F',
              }}
            >
              <div className="flex items-center gap-2.5 mb-1.5">
                <span
                  className="w-3.5 h-3.5 rounded-full flex-shrink-0 border"
                  style={{
                    background: isCurrent ? '#FFFFFF' : item.color,
                    borderColor: isCurrent ? 'rgba(255,255,255,0.6)' : item.color,
                  }}
                />
                <span className="font-bold text-sm leading-snug">
                  {lang === 'hi' ? item.label.hi : item.label.en}
                </span>
              </div>
              <p
                className="text-xs leading-relaxed"
                style={{ color: isCurrent ? 'rgba(255,255,255,0.92)' : '#475569' }}
              >
                {lang === 'hi' ? item.status.hi : item.status.en}
              </p>
            </motion.button>
          )
        })}
      </div>

      {/* Active cycle detail card below */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeCycle}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.35 }}
          className="max-w-3xl mx-auto bg-white rounded-2xl border-2 p-6 shadow-sm"
          style={{ borderColor: cycle.color }}
        >
          <div className="flex items-center gap-3 mb-2">
            <span className="w-4 h-4 rounded-full flex-shrink-0" style={{ background: cycle.color }} />
            <h3 className="text-base font-bold" style={{ color: 'var(--brand-navy)' }}>
              {lang === 'hi' ? cycle.label.hi : cycle.label.en}
            </h3>
          </div>
          <p className="text-xs font-semibold text-slate-500 mb-3">
            {lang === 'hi' ? cycle.status.hi : cycle.status.en}
          </p>
          <p className="text-sm text-slate-600 leading-relaxed">
            {lang === 'hi' ? cycle.detail.hi : cycle.detail.en}
          </p>
          {/* progress bar */}
          <div className="mt-4 h-1 bg-slate-100 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ background: cycle.color }}
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: 2.5, ease: 'linear' }}
              key={activeCycle}
            />
          </div>
        </motion.div>
      </AnimatePresence>
    </section>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function HowItWorksPage() {
  const { lang } = useLang()
  const [visibleSteps, setVisibleSteps] = useState<number[]>([1])
  const stepsContainerRef = useRef<HTMLDivElement>(null)
  const mobileDiagramRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: stepsContainerRef,
    offset: ['start center', 'end center'],
  })

  const handleVisibilityChange = useCallback((stepId: number, inView: boolean) => {
    setVisibleSteps(prev => {
      if (inView) {
        if (prev.includes(stepId)) return prev
        return [...prev, stepId].sort((a, b) => a - b)
      }
      return prev.filter(id => id !== stepId)
    })
  }, [])

  const activeStepId = visibleSteps.length > 0 ? visibleSteps[0] : 1
  const activeStep = steps.find(s => s.id === activeStepId) ?? steps[0]

  const scrollToStep = (stepId: number) => {
    const el = document.getElementById(`step-${stepId}`)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }

  const scrollToMobileDiagram = () => {
    mobileDiagramRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg, #FAFAF8)' }}>
      {/* ── Hero band ── */}
      <section
        className="py-16 px-4 text-center"
        style={{ background: 'linear-gradient(135deg, var(--brand-navy) 0%, #2d4f7c 100%)' }}
      >
        <motion.h1
          className="text-3xl md:text-5xl font-bold text-white mb-4"
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <T en="How AVWCS Works" hi="AVWCS कैसे काम करता है" />
        </motion.h1>
        <motion.p
          className="text-base md:text-lg text-blue-100 max-w-2xl mx-auto"
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <T
            en="7 steps from your doorstep to the central terminal — underground, sealed, automated."
            hi="आपके दरवाज़े से केंद्रीय टर्मिनल तक 7 चरण — भूमिगत, बंद, स्वचालित।"
          />
        </motion.p>

        {/* Step quick-nav pills */}
        <motion.div
          className="flex flex-wrap justify-center gap-2 mt-8"
          initial={false}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          {steps.map(s => (
            <button
              key={s.id}
              type="button"
              onClick={() => scrollToStep(s.id)}
              className={`text-xs px-3 py-1 rounded-full border transition-colors cursor-pointer ${
                s.id === activeStepId
                  ? 'bg-orange-600 text-white border-orange-500'
                  : 'bg-white/10 text-white border-white/20 hover:bg-white/20'
              }`}
            >
              {s.id}. <T en={s.shortLabel.en} hi={s.shortLabel.hi} />
            </button>
          ))}
        </motion.div>
      </section>

      {/* ── Negative Pressure & Airflow Principle Strip (SRS FR-004) ── */}
      <section className="max-w-6xl mx-auto px-4 pt-8 pb-2">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
            <div className="flex items-center gap-2">
              <Gauge size={18} className="text-orange-600 shrink-0" />
              <h2 className="text-sm sm:text-base font-bold" style={{ color: 'var(--brand-navy)' }}>
                <T
                  en="How Negative Pressure Moves Waste Underground"
                  hi="नेगेटिव प्रेशर भूमिगत कचरा कैसे खींचता है"
                />
              </h2>
            </div>
            <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600">
              <T en="Airflow Principle (0 kPa → -70 kPa)" hi="एयरफ़्लो सिद्धांत (0 kPa → -70 kPa)" />
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-stretch">
            <div className="rounded-xl border border-green-200 bg-green-50/60 p-4 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-green-800 uppercase tracking-wide">
                  <T en="1. Street Inlet Air Intake" hi="1. सड़क इनलेट हवा प्रवेश" />
                </span>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-white text-green-700 border border-green-200">
                  ~0 kPa
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                <T
                  en="Normal atmospheric air enters behind the queued waste batch when the discharge valve opens."
                  hi="डिस्चार्ज वाल्व खुलते ही कचरे के पीछे सामान्य बाहरी हवा प्रवेश करती है।"
                />
              </p>
            </div>

            <div className="rounded-xl border border-sky-200 bg-sky-50/70 p-4 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-sky-900 uppercase tracking-wide inline-flex items-center gap-1">
                  <Wind size={13} className="text-sky-600" />
                  <T en="2. Sealed Pipe Transport" hi="2. बंद पाइप में गति" />
                </span>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-white text-sky-800 border border-sky-200">
                  60–80 km/h
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed flex items-center gap-2">
                <span>
                  <T
                    en="Air pressure difference carries one waste stream at a time through sealed steel pipes — keeping odour trapped inside."
                    hi="दबाव का अंतर एक समय में एक ही कचरा धारा को बंद स्टील पाइप में खींचता है — दुर्गंध बाहर नहीं आती।"
                  />
                </span>
                <ArrowRight size={16} className="hidden md:block text-sky-600 shrink-0" />
              </p>
            </div>

            <div className="rounded-xl border border-orange-200 bg-orange-50/70 p-4 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-orange-800 uppercase tracking-wide">
                  <T en="3. Terminal Vacuum Fans" hi="3. टर्मिनल वैक्यूम पंखे" />
                </span>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-white text-orange-700 border border-orange-200">
                  -40 to -70 kPa
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                <T
                  en="Terminal exhauster blowers pull air below atmospheric pressure; air is scrubbed via biofilter before safe release."
                  hi="टर्मिनल के पंखे हवा को खींचकर नेगेटिव प्रेशर बनाते हैं; हवा को बायोफ़िल्टर से साफ कर बाहर छोड़ा जाता है।"
                />
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Main two-column layout ── */}
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="lg:grid lg:grid-cols-2 lg:gap-10 items-start">
          {/* LEFT: sticky diagram (desktop) */}
          <div className="hidden lg:block" style={{ position: 'sticky', top: '5rem' }}>
            <SystemDiagram activeStep={activeStep} />
            <div className="mt-3 px-1">
              <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{
                    background: 'var(--brand-orange)',
                    scaleX: scrollYProgress,
                    transformOrigin: '0% 50%',
                  }}
                />
              </div>
              <p className="text-xs text-center text-slate-400 mt-2">
                <T
                  en="Diagram highlights the active step as you scroll →"
                  hi="स्क्रॉल करते समय सक्रिय चरण हाइलाइट होता है →"
                />
              </p>
            </div>
          </div>

          {/* Mobile diagram (top, non-sticky) */}
          <div ref={mobileDiagramRef} className="lg:hidden mb-4 scroll-mt-20">
            <SystemDiagram activeStep={activeStep} />
          </div>

          {/* RIGHT: scrolling steps */}
          <div ref={stepsContainerRef}>
            {/* Mobile compact sticky active-step indicator bar (< lg) */}
            <div className="lg:hidden sticky top-[4.5rem] z-30 mb-4">
              <div className="flex items-center justify-between gap-2 px-3 py-2 rounded-xl bg-white/95 backdrop-blur-md border border-orange-200 shadow-sm">
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className="w-6 h-6 rounded-full text-white text-xs font-bold flex items-center justify-center flex-shrink-0"
                    style={{ background: 'var(--brand-orange)' }}
                  >
                    {activeStep.id}
                  </span>
                  <div className="min-w-0">
                    <div className="text-[11px] font-semibold text-orange-600 leading-none mb-0.5">
                      <T en={`Step ${activeStep.id} of ${steps.length}`} hi={`चरण ${activeStep.id} / ${steps.length}`} />
                    </div>
                    <div className="text-xs font-bold truncate" style={{ color: 'var(--brand-navy)' }}>
                      {lang === 'hi' ? activeStep.shortLabel.hi : activeStep.shortLabel.en}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <div className="flex items-center gap-1" aria-label={lang === 'hi' ? 'चरण प्रगति' : 'Step progress'}>
                    {steps.map(s => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => scrollToStep(s.id)}
                        aria-label={lang === 'hi' ? `चरण ${s.id}` : `Step ${s.id}`}
                        className={`h-2 rounded-full transition-all cursor-pointer ${
                          s.id === activeStep.id
                            ? 'w-4 bg-orange-600'
                            : 'w-2 bg-slate-200 hover:bg-slate-300'
                        }`}
                      />
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={scrollToMobileDiagram}
                    className="ml-1 inline-flex items-center gap-0.5 text-[11px] font-medium px-2 py-1 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 cursor-pointer"
                  >
                    <ArrowUp size={11} />
                    <T en="Diagram" hi="आरेख" />
                  </button>
                </div>
              </div>
            </div>

            {steps.map(step => (
              <StepPanel
                key={step.id}
                step={step}
                isActive={activeStep.id === step.id}
                onVisibilityChange={handleVisibilityChange}
              />
            ))}
          </div>
        </div>

        {/* ── Sequence cycle section ── */}
        <SequenceCycleSection />
      </div>
    </div>
  )
}
