'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useLang } from '@/components/ui/LangContext'
import T from '@/components/ui/T'
import SourceTag from '@/components/ui/SourceTag'
import { motion } from 'framer-motion'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts'
import comparisonData from '@/data/comparison.json'
import type { ComparisonRow, ComparisonBar } from '@/lib/types'
import {
  StreetShowdownVisual,
  CapexAdvantageVisual,
  SolarPowerVisual,
} from '@/components/compare/CompareAnimations'

// ── Comparison data loaded from src/data/comparison.json ─────────────────────

const ROWS = comparisonData.rows as ComparisonRow[]
const BARS = comparisonData.bars as ComparisonBar[]
const GUIDE = comparisonData.guide

function wrapLabelLines(text: string, maxChars = 16): string[] {
  const words = text.split(' ')
  const lines: string[] = []
  let current = ''
  for (const w of words) {
    if (!current) {
      current = w
    } else if ((current + ' ' + w).length <= maxChars) {
      current += ' ' + w
    } else {
      lines.push(current)
      current = w
    }
  }
  if (current) lines.push(current)
  return lines.slice(0, 3)
}

interface CustomTickProps {
  x?: number
  y?: number
  payload?: { value: string }
}

function WrappedAngledTick({ x = 0, y = 0, payload }: CustomTickProps) {
  const lines = wrapLabelLines(payload?.value ?? '', 12)
  return (
    <g transform={`translate(${x},${y + 6}) rotate(-28)`}>
      {lines.map((line, i) => (
        <text
          key={i}
          x={0}
          y={i * 11}
          textAnchor="end"
          fill="#475569"
          fontSize={9.5}
          fontWeight={500}
        >
          {line}
        </text>
      ))}
    </g>
  )
}

// ── Page component ───────────────────────────────────────────────────────────

export default function ComparePage() {
  const { lang } = useLang()
  const [mounted, setMounted] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    setMounted(true)
    const update = () => setIsMobile(window.innerWidth < 640)
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  const chartData = BARS.map(b => ({
    name: lang === 'hi' ? b.label.hi : b.label.en,
    Truck: b.truckScore,
    AVWCS: b.avwcsScore,
  }))

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      <div className="max-w-6xl mx-auto px-4 py-12 space-y-12">
        {/* Section 1: Intro + Visual Street Showdown */}
        <motion.div
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="space-y-6"
        >
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2" style={{ color: 'var(--brand-navy)' }}>
                <T en="Truck System vs AVWCS: Visual & Honest Comparison" hi="ट्रक प्रणाली बनाम AVWCS: विज़ुअल व ईमानदार तुलना" />
              </h1>
              <p className="text-base sm:text-lg text-gray-600">
                <T
                  en="See both sides clearly: how 25-year CAPEX value & rooftop Solar PV unlock AVWCS advantages where greenfield conditions fit."
                  hi="दोनों पहलू स्पष्ट देखें: नए प्रोजेक्ट में 25-वर्षीय CAPEX मूल्य और रूफटॉप सोलर पैनल से AVWCS कैसे फ़ायदेमंद बनता है।"
                />
              </p>
            </div>
            <Link
              href="/simulator"
              className="inline-flex items-center px-4 py-2 rounded-xl text-xs font-semibold text-white hover:opacity-90 transition-opacity shrink-0"
              style={{ background: 'var(--brand-orange)' }}
            >
              <T en="Test Solar % in Simulator →" hi="सिमुलेटर में सोलर % जांचें →" />
            </Link>
          </div>

          <StreetShowdownVisual lang={lang} />
        </motion.div>

        {/* Section 2: Animated CAPEX Value Explainer */}
        <CapexAdvantageVisual lang={lang} />

        {/* Section 3: Animated Solar Power Terminal Explainer */}
        <SolarPowerVisual lang={lang} />

        {/* Section 4: Comparison Table */}
        <section>
          <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--brand-navy)' }}>
            <T en="Criterion-by-Criterion Summary Table" hi="प्रमुख मानदंडों के अनुसार तुलना तालिका" />
          </h2>
          <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-sm bg-white">
            <table className="w-full min-w-[720px] text-sm">
              <thead>
                <tr className="border-b border-gray-200" style={{ background: 'var(--brand-navy)' }}>
                  <th className="text-left px-5 py-4 text-white font-semibold w-[22%]">
                    <T en="Criteria" hi="मानदंड" />
                  </th>
                  <th className="text-left px-5 py-4 text-white font-semibold w-[30%]">
                    <T en="Truck System" hi="ट्रक प्रणाली" />
                  </th>
                  <th className="text-left px-5 py-4 text-white font-semibold w-[31%]">AVWCS</th>
                  <th className="text-center px-5 py-4 text-white font-semibold w-[17%]">
                    <T en="Better for" hi="बेहतर" />
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {ROWS.map((row) => {
                  const truckGood = row.winner === 'truck'
                  const avwcsGood = row.winner === 'avwcs' || row.winner === 'longterm'
                  return (
                    <tr key={row.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="px-5 py-4 font-semibold text-gray-800 align-top">
                        <div>{lang === 'hi' ? row.criteria.hi : row.criteria.en}</div>
                        {row.note && (
                          <div className="mt-1.5 text-[11px] font-medium text-amber-800 bg-amber-50 border border-amber-200 rounded-md px-2 py-1">
                            {lang === 'hi' ? row.note.hi : row.note.en}
                          </div>
                        )}
                      </td>
                      <td
                        className={`px-5 py-4 text-gray-700 leading-snug align-top ${
                          truckGood ? 'bg-green-50' : 'bg-red-50/70'
                        }`}
                      >
                        <span
                          className={`mr-1.5 font-bold ${
                            truckGood ? 'text-green-700' : 'text-red-600'
                          }`}
                        >
                          {truckGood ? '✓' : '✗'}
                        </span>
                        {lang === 'hi' ? row.truck.hi : row.truck.en}
                      </td>
                      <td
                        className={`px-5 py-4 text-gray-700 leading-snug align-top ${
                          row.winner === 'longterm' ? 'bg-emerald-50/80' : avwcsGood ? 'bg-green-50' : 'bg-red-50/70'
                        }`}
                      >
                        <span
                          className={`mr-1.5 font-bold ${
                            avwcsGood ? 'text-green-700' : 'text-red-600'
                          }`}
                        >
                          {avwcsGood ? '✓' : '✗'}
                        </span>
                        {lang === 'hi' ? row.avwcs.hi : row.avwcs.en}
                      </td>
                      <td className="px-5 py-4 text-center align-middle">
                        <div className="flex flex-col items-center gap-1">
                          {row.winner === 'avwcs' ? (
                            <>
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-800 border border-green-200">
                                ✓ AVWCS
                              </span>
                              <span className="text-[11px] text-red-500">
                                ✗ <T en="Truck" hi="ट्रक" />
                              </span>
                            </>
                          ) : row.winner === 'longterm' ? (
                            <>
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-900 border border-emerald-300">
                                ✓ <T en="25-Yr Value: AVWCS" hi="25-साल लाभ: AVWCS" />
                              </span>
                              <span className="text-[11px] text-amber-700 font-medium">
                                <T en="Yr-1 Budget: Truck" hi="साल-1 बजट: ट्रक" />
                              </span>
                            </>
                          ) : (
                            <>
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-800 border border-green-200">
                                ✓ <T en="Truck" hi="ट्रक" />
                              </span>
                              <span className="text-[11px] text-red-500">✗ AVWCS</span>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </section>

        {/* Section 5: Bar Chart */}
        <section>
          <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--brand-navy)' }}>
            <T en="Performance & Cost Score Comparison (out of 100)" hi="प्रदर्शन और लागत स्कोर तुलना (100 में से)" />
          </h2>
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-3 sm:p-6">
            <div className={`w-full ${isMobile ? 'h-[430px]' : 'h-[370px]'}`}>
              {mounted ? (
                <ResponsiveContainer width="100%" height="100%" minHeight={340}>
                  {isMobile ? (
                    <BarChart data={chartData} layout="vertical" margin={{ top: 10, right: 16, left: 4, bottom: 10 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 10, fill: '#475569' }} />
                      <YAxis
                        type="category"
                        dataKey="name"
                        width={118}
                        tick={{ fontSize: 10, fill: '#1E3A5F', fontWeight: 500 }}
                      />
                      <Tooltip
                        contentStyle={{ borderRadius: '12px', border: '1px solid #e5e7eb', fontSize: 12 }}
                      />
                      <Legend verticalAlign="top" wrapperStyle={{ paddingBottom: 10, fontSize: 12 }} />
                      <Bar
                        dataKey="Truck"
                        name={lang === 'hi' ? 'ट्रक प्रणाली' : 'Truck System'}
                        fill="#475569"
                        radius={[0, 4, 4, 0]}
                        barSize={12}
                      />
                      <Bar
                        dataKey="AVWCS"
                        name="AVWCS"
                        fill="#EA580C"
                        radius={[0, 4, 4, 0]}
                        barSize={12}
                      />
                    </BarChart>
                  ) : (
                    <BarChart data={chartData} margin={{ top: 15, right: 16, left: 24, bottom: 48 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis
                        dataKey="name"
                        tick={<WrappedAngledTick />}
                        interval={0}
                        height={78}
                        padding={{ left: 16, right: 10 }}
                      />
                      <YAxis width={36} domain={[0, 100]} tick={{ fontSize: 11, fill: '#475569' }} />
                      <Tooltip
                        contentStyle={{ borderRadius: '12px', border: '1px solid #e5e7eb', fontSize: 13 }}
                      />
                      <Legend verticalAlign="top" wrapperStyle={{ paddingBottom: 12 }} />
                      <Bar
                        dataKey="Truck"
                        name={lang === 'hi' ? 'ट्रक प्रणाली' : 'Truck System'}
                        fill="#475569"
                        radius={[4, 4, 0, 0]}
                      />
                      <Bar
                        dataKey="AVWCS"
                        name="AVWCS"
                        fill="#EA580C"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  )}
                </ResponsiveContainer>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-sm text-gray-400">
                  <T en="Loading chart..." hi="चार्ट लोड हो रहा है..." />
                </div>
              )}
            </div>
            <div className="mt-2 flex flex-col items-center gap-1.5">
              <p className="text-xs text-gray-500 text-center font-medium">
                <T en="Higher score = better on that criterion" hi="अधिक स्कोर = उस मानदंड पर बेहतर" />
              </p>
              <SourceTag
                type="assumption"
                text={lang === 'hi' ? 'सांकेतिक तुलनात्मक स्कोर (0–100 मानक)' : 'Illustrative comparative index (0–100 scale)'}
                detail={lang === 'hi' ? 'ये स्कोर साहित्य आधारित सापेक्ष ताकत दिखाते हैं (सोलर और 25-साल ग्रीनफील्ड लाभ सहित); अंतिम चयन के लिए साइट DPR करें।' : 'Relative benchmark index reflecting greenfield lifecycle & solar-paired performance; verify with site DPR.'}
              />
            </div>
          </div>
        </section>

        {/* Section 4: When to Choose Guide */}
        <section>
          <h2 className="text-xl font-bold mb-5" style={{ color: 'var(--brand-navy)' }}>
            <T en="When to Choose Which?" hi="कौन सा और कब चुनें?" />
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Card: Truck */}
            <motion.div
              initial={false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="rounded-2xl border-2 border-blue-200 bg-blue-50/70 p-6"
            >
              <h3 className="text-lg font-bold text-blue-900 mb-4">
                {lang === 'hi' ? GUIDE.chooseTruck.title.hi : GUIDE.chooseTruck.title.en}
              </h3>
              <ul className="space-y-2.5">
                {(lang === 'hi' ? GUIDE.chooseTruck.points.hi : GUIDE.chooseTruck.points.en).map((pt, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-blue-900 leading-relaxed">
                    <span className="text-blue-600 font-bold mt-0.5 shrink-0">•</span>
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Right Card: AVWCS */}
            <motion.div
              initial={false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="rounded-2xl border-2 border-green-200 bg-green-50/70 p-6"
            >
              <h3 className="text-lg font-bold text-green-900 mb-4">
                {lang === 'hi' ? GUIDE.chooseAvwcs.title.hi : GUIDE.chooseAvwcs.title.en}
              </h3>
              <ul className="space-y-2.5">
                {(lang === 'hi' ? GUIDE.chooseAvwcs.points.hi : GUIDE.chooseAvwcs.points.en).map((pt, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-green-900 leading-relaxed">
                    <span className="text-green-600 font-bold mt-0.5 shrink-0">•</span>
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </section>
      </div>
    </div>
  )
}
