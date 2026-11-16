'use client'
import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Activity, ArrowRight } from 'lucide-react'
import T from '@/components/ui/T'
import { useLang } from '@/components/ui/LangContext'
import partsData from '@/data/parts.json'
import type { BilingualText, Part } from '@/lib/types'

const PARTS: Part[] = partsData.parts

const SHORT_LABELS: Record<string, BilingualText> = {
  inlet: { en: 'Street Inlets', hi: 'सड़क इनलेट' },
  chute: { en: 'Storage Chute', hi: 'स्टोरेज च्यूट' },
  sensor: { en: 'Level Sensor', hi: 'लेवल सेंसर' },
  valve: { en: 'Discharge Valve', hi: 'डिस्चार्ज वाल्व' },
  pipeline: { en: 'Vacuum Pipeline', hi: 'वैक्यूम पाइपलाइन' },
  fans: { en: 'Exhauster Fans', hi: 'एग्ज़ॉस्टर पंखे' },
  separator: { en: 'Cyclone Separator', hi: 'साइक्लोन सेपरेटर' },
  compactor: { en: 'Waste Compactor', hi: 'वेस्ट कॉम्पैक्टर' },
  containers: { en: 'Sealed Containers', hi: 'सीलबंद कंटेनर' },
  biofilter: { en: 'Odour Biofilter', hi: 'बायोफ़िल्टर' },
  control: { en: 'PLC SCADA', hi: 'PLC कंट्रोल' },
}

function getShortLabel(part: Part, lang: 'en' | 'hi'): string {
  const label = SHORT_LABELS[part.id] ?? part.name
  return lang === 'hi' ? label.hi : label.en
}

// ─── Zone config ──────────────────────────────────────────────────────────────
const ZONE_COLORS: Record<string, string> = {
  street: '#16A34A',
  subsurface: '#2563EB',
  underground: '#475569',
  terminal: '#EA580C',
}

const ZONE_BG: Record<string, string> = {
  street: 'rgba(22, 163, 74, 0.08)',
  subsurface: 'rgba(37, 99, 235, 0.08)',
  underground: 'rgba(71, 85, 105, 0.09)',
  terminal: 'rgba(234, 88, 12, 0.08)',
}

const ZONE_LABEL: Record<string, BilingualText> = {
  street: { en: 'Street Level 🟢', hi: 'सड़क स्तर 🟢' },
  subsurface: { en: 'Subsurface 🔵', hi: 'उप-सतह 🔵' },
  underground: { en: 'Underground Pipeline', hi: 'भूमिगत पाइपलाइन' },
  terminal: { en: 'Terminal', hi: 'टर्मिनल' },
}

const SHORT_CODE: Record<string, string> = {
  inlet: 'INL',
  chute: 'CHU',
  sensor: 'SEN',
  valve: 'VLV',
  pipeline: 'PIP',
  fans: 'FAN',
  separator: 'SEP',
  compactor: 'CMP',
  containers: 'BIN',
  biofilter: 'BIO',
  control: 'PLC',
}

// ─── Connection lines between parts ──────────────────────────────────────────
// [fromId, toId, dashed?, color?]
const CONNECTIONS: [string, string, boolean?, string?][] = [
  ['inlet', 'chute'],
  ['chute', 'valve'],
  ['valve', 'pipeline'],
  ['pipeline', 'separator'],
  ['separator', 'compactor'],
  ['compactor', 'containers'],
  ['fans', 'separator', true, '#EA580C'],   // suction line, dashed
  ['fans', 'biofilter', false, '#64748B'],  // exhaust to biofilter
  ['sensor', 'chute', false, '#2563EB'],    // sensor mounted on chute
  ['control', 'fans', true, '#94A3B8'],     // SCADA control link
]

function getPartById(id: string): Part | undefined {
  return PARTS.find(p => p.id === id)
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function ExplorePage() {
  const { lang } = useLang()
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const selectedPart = selectedId ? getPartById(selectedId) : null

  return (
    <div className="min-h-screen py-10 px-4" style={{ background: 'var(--bg)' }}>
      <div className="max-w-6xl mx-auto">
        {/* Page heading + Live SCADA link */}
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-1" style={{ color: 'var(--brand-navy)' }}>
              <T en="System Explorer" hi="सिस्टम एक्सप्लोरर" />
            </h1>
            <p className="text-sm text-gray-500">
              <T
                en="Click any component in the diagram to explore its role, failure modes, and civil engineering requirements."
                hi="किसी भी घटक पर क्लिक करें — उसकी भूमिका, खराबियाँ और सिविल इंजीनियरिंग आवश्यकताएं जानें।"
              />
            </p>
          </div>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white shadow-xs transition-opacity hover:opacity-90"
            style={{ background: 'var(--brand-navy)' }}
          >
            <Activity size={14} />
            <T en="Live SCADA Demo" hi="लाइव SCADA डेमो" />
            <ArrowRight size={14} />
          </Link>
        </div>

        {/* Two-column desktop (60% / 40%), stacked mobile */}
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          {/* ── LEFT: SVG Diagram + Quick-Select Bar (60%) ── */}
          <div className="lg:w-[60%] w-full space-y-3">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <SVGDiagram
                lang={lang}
                selectedId={selectedId}
                onSelect={id => setSelectedId(id)}
              />
              {/* Legend */}
              <div className="p-3.5 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3 bg-gray-50/50">
                <div className="flex flex-wrap gap-4">
                  {Object.entries(ZONE_LABEL).map(([zone, label]) => (
                    <div key={zone} className="flex items-center gap-1.5">
                      <span
                        className="w-3.5 h-3.5 rounded-sm inline-block"
                        style={{ background: ZONE_COLORS[zone] }}
                      />
                      <span className="text-xs font-medium text-gray-700">
                        {lang === 'hi' ? label.hi : label.en}
                      </span>
                    </div>
                  ))}
                </div>
                <span className="text-[11px] text-gray-400">
                  <T en="Dashed orange = vacuum suction line" hi="टूटी नारंगी रेखा = वैक्यूम सक्शन लाइन" />
                </span>
              </div>
            </div>

            {/* Compact mobile-friendly quick-select pill bar */}
            <div className="bg-white rounded-2xl border border-gray-200 p-3 shadow-xs">
              <p className="text-xs font-semibold text-gray-500 mb-2">
                <T en={`Quick Select Component (${PARTS.length})`} hi={`त्वरित घटक चयन (${PARTS.length})`} />
              </p>
              <div className="flex flex-wrap gap-1.5">
                {PARTS.map(part => {
                  const active = selectedId === part.id
                  const zoneColor = ZONE_COLORS[part.zone] ?? '#475569'
                  return (
                    <button
                      key={part.id}
                      type="button"
                      onClick={() => setSelectedId(part.id)}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-medium border transition-colors cursor-pointer ${
                        active
                          ? 'text-white border-transparent shadow-xs'
                          : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                      }`}
                      style={active ? { background: zoneColor } : undefined}
                    >
                      <span
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{ background: active ? '#FFFFFF' : zoneColor }}
                      />
                      {getShortLabel(part, lang)}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          {/* ── RIGHT: Detail Panel (40%) ── */}
          <div className="lg:w-[40%] w-full">
            <AnimatePresence mode="wait">
              {!selectedPart ? (
                <motion.div
                  key="placeholder"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center min-h-[260px] bg-white rounded-2xl border border-dashed border-gray-300 text-gray-400 p-6 text-center"
                >
                  <span className="text-4xl mb-3">🔍</span>
                  <p className="text-sm font-medium text-gray-600">
                    <T en="Click any component to explore" hi="किसी भी घटक पर क्लिक करें" />
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    <T
                      en={`${PARTS.length} mechanical, civil, and control components across 4 zones`}
                      hi={`4 ज़ोन में ${PARTS.length} यांत्रिक, सिविल और कंट्रोल घटक`}
                    />
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key={selectedPart.id}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 12 }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                  className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 space-y-4"
                >
                  {/* Zone badge */}
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className="inline-block px-3 py-0.5 rounded-full text-white text-xs font-semibold"
                      style={{ background: ZONE_COLORS[selectedPart.zone] }}
                    >
                      {lang === 'hi'
                        ? (ZONE_LABEL[selectedPart.zone]?.hi ?? selectedPart.zone)
                        : (ZONE_LABEL[selectedPart.zone]?.en ?? selectedPart.zone)}
                    </span>
                    <button
                      type="button"
                      onClick={() => setSelectedId(null)}
                      className="text-xs text-gray-400 hover:text-gray-700 cursor-pointer"
                    >
                      ✕ <T en="Clear" hi="बंद करें" />
                    </button>
                  </div>

                  {/* Part name */}
                  <h2 className="text-xl font-bold leading-snug" style={{ color: 'var(--brand-navy)' }}>
                    <T en={selectedPart.name.en} hi={selectedPart.name.hi} />
                  </h2>

                  {/* Role */}
                  <DetailSection
                    headingEn="What it does"
                    headingHi="यह क्या करता है"
                    lang={lang}
                    text={selectedPart.role}
                    bg="bg-gray-50"
                  />

                  {/* Failure */}
                  <DetailSection
                    headingEn="⚠️ Common Failures"
                    headingHi="⚠️ सामान्य खराबियाँ"
                    lang={lang}
                    text={selectedPart.failure}
                    bg="bg-amber-50"
                    textColor="text-amber-900"
                  />

                  {/* Civil */}
                  <DetailSection
                    headingEn="🏗️ Civil Engineering Note"
                    headingHi="🏗️ सिविल इंजीनियरिंग नोट"
                    lang={lang}
                    text={selectedPart.civil}
                    bg="bg-blue-50"
                    textColor="text-blue-900"
                  />

                  {/* Specs */}
                  <div>
                    <p className="text-xs font-semibold text-gray-500 mb-1">
                      {lang === 'hi' ? '📋 तकनीकी विशेषताएं' : '📋 Technical Specs'}
                    </p>
                    <p className="text-xs font-mono bg-gray-900 text-green-300 rounded-lg px-3 py-2.5 leading-relaxed whitespace-pre-wrap">
                      {lang === 'hi' ? selectedPart.specs.hi : selectedPart.specs.en}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Detail section sub-component ────────────────────────────────────────────
function DetailSection({
  headingEn, headingHi, lang, text, bg, textColor = 'text-gray-700'
}: {
  headingEn: string; headingHi: string; lang: string
  text: BilingualText; bg: string; textColor?: string
}) {
  return (
    <div>
      <p className="text-xs font-semibold text-gray-500 mb-1">
        {lang === 'hi' ? headingHi : headingEn}
      </p>
      <p className={`text-sm leading-relaxed rounded-lg px-3 py-2.5 ${bg} ${textColor}`}>
        {lang === 'hi' ? text.hi : text.en}
      </p>
    </div>
  )
}

// ─── SVG Diagram ──────────────────────────────────────────────────────────────
function SVGDiagram({
  lang,
  selectedId,
  onSelect,
}: {
  lang: 'en' | 'hi'
  selectedId: string | null
  onSelect: (id: string) => void
}) {
  const W = 960
  const H = 720

  function px(xPct: number) { return (xPct / 100) * W }
  function py(yPct: number) { return (yPct / 100) * H }

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="w-full block select-none"
      style={{ aspectRatio: '4/3' }}
      aria-label={lang === 'hi' ? 'AVWCS इंटरैक्टिव सिस्टम आरेख' : 'AVWCS Interactive System Diagram'}
    >
      <defs>
        <style>{`
          @keyframes avwcsPulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.15); }
          }
          .avwcs-pulse {
            animation: avwcsPulse 2s ease-in-out infinite;
            transform-box: fill-box;
            transform-origin: center;
          }
        `}</style>
      </defs>

      {/* ── Zone backgrounds ── */}
      {/* Street zone: top 30% */}
      <rect x={0} y={0} width={W * 0.65} height={H * 0.30} fill={ZONE_BG['street']} />
      <text x={14} y={24} fontSize={14} fill="#16A34A" fontWeight={700}>
        {lang === 'hi' ? ZONE_LABEL['street'].hi : ZONE_LABEL['street'].en}
      </text>

      {/* Subsurface zone: middle 30% (30%–60%) */}
      <rect x={0} y={H * 0.30} width={W * 0.65} height={H * 0.30} fill={ZONE_BG['subsurface']} />
      <text x={14} y={H * 0.30 + 24} fontSize={14} fill="#2563EB" fontWeight={700}>
        {lang === 'hi' ? ZONE_LABEL['subsurface'].hi : ZONE_LABEL['subsurface'].en}
      </text>

      {/* Underground pipeline zone: thin band 60%–76% (label offset clear of valve at x=14%) */}
      <rect x={0} y={H * 0.60} width={W * 0.65} height={H * 0.16} fill={ZONE_BG['underground']} />
      <text x={260} y={455} fontSize={13} fill="#475569" fontWeight={700}>
        {lang === 'hi' ? ZONE_LABEL['underground'].hi : ZONE_LABEL['underground'].en}
      </text>

      {/* Deep soil below underground pipeline */}
      <rect x={0} y={H * 0.76} width={W * 0.65} height={H * 0.24} fill="rgba(226, 232, 240, 0.25)" />

      {/* Terminal zone: right 35%, full height */}
      <rect x={W * 0.65} y={0} width={W * 0.35} height={H} fill={ZONE_BG['terminal']} />
      <line x1={W * 0.65} y1={0} x2={W * 0.65} y2={H} stroke="#FDBA74" strokeWidth={2} strokeDasharray="6 4" />
      <text x={W * 0.65 + 14} y={24} fontSize={14} fill="#EA580C" fontWeight={700}>
        {lang === 'hi' ? ZONE_LABEL['terminal'].hi : ZONE_LABEL['terminal'].en}
      </text>

      {/* ── Connecting lines between related parts ── */}
      {CONNECTIONS.map(([fromId, toId, dashed, strokeColor]) => {
        const from = getPartById(fromId)
        const to = getPartById(toId)
        if (!from || !to) return null
        return (
          <line
            key={`${fromId}-${toId}`}
            x1={px(from.x)}
            y1={py(from.y)}
            x2={px(to.x)}
            y2={py(to.y)}
            stroke={strokeColor ?? '#64748B'}
            strokeWidth={2.5}
            strokeDasharray={dashed ? '8 5' : undefined}
            strokeOpacity={0.65}
          />
        )
      })}

      {/* ── Part nodes ── */}
      {PARTS.map(part => {
        const cx = px(part.x)
        const cy = py(part.y)
        const color = ZONE_COLORS[part.zone] ?? '#475569'
        const isSelected = selectedId === part.id
        const r = isSelected ? 28 : 24
        const label = getShortLabel(part, lang)

        // Place sensor label above so it stays clear of chute
        const labelY = part.id === 'sensor' ? cy - r - 8 : cy + r + 15

        return (
          <g
            key={part.id}
            tabIndex={0}
            role="button"
            aria-label={lang === 'hi' ? part.name.hi : part.name.en}
            aria-pressed={isSelected}
            className="cursor-pointer focus:outline-none"
            onClick={() => onSelect(part.id)}
            onKeyDown={e => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                onSelect(part.id)
              }
            }}
          >
            {/* Larger transparent hit target for reliable clicking/touching */}
            <circle cx={cx} cy={cy} r={34} fill="transparent" />

            {/* Orange glowing outer ring when selected */}
            {isSelected && (
              <circle
                cx={cx}
                cy={cy}
                r={r + 8}
                fill="rgba(234, 88, 12, 0.14)"
                stroke="#EA580C"
                strokeWidth={3}
              />
            )}

            {/* Main 24px radius circle (only this circle pulses, keeping text rock-steady) */}
            <circle
              cx={cx}
              cy={cy}
              r={r}
              fill={color}
              fillOpacity={isSelected ? 1 : 0.9}
              stroke="white"
              strokeWidth={2.5}
              className={!isSelected ? 'avwcs-pulse' : undefined}
            />

            {/* Short ID code inside circle */}
            <text
              x={cx}
              y={cy + 1}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize={11}
              fill="white"
              fontWeight={700}
              style={{ pointerEvents: 'none' }}
            >
              {SHORT_CODE[part.id] ?? part.id.slice(0, 3).toUpperCase()}
            </text>

            {/* Clean non-truncated name label */}
            <text
              x={cx}
              y={labelY}
              textAnchor="middle"
              fontSize={11.5}
              fill="#1E3A5F"
              fontWeight={isSelected ? 700 : 600}
              style={{ pointerEvents: 'none' }}
            >
              {label}
            </text>
          </g>
        )
      })}
    </svg>
  )
}
