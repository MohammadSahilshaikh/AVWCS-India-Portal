'use client'
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Wind, AlertTriangle, Info } from 'lucide-react'
import T from '@/components/ui/T'
import { useLang } from '@/components/ui/LangContext'
import { createInitialDashboardState, tickDashboard } from '@/lib/dashboard'
import type { DashboardState, InletStatus } from '@/lib/types'

function createDeterministicInitialState(): DashboardState {
  const zones = ['Block A', 'Block B', 'Block C', 'Block D']
  const types: Array<'organic' | 'recyclable' | 'residual'> = ['organic', 'recyclable', 'residual']
  const presets = [52, 44, 61, 68, 40, 56, 72, 48, 39, 75, 58, 42]
  const inlets: InletStatus[] = []
  let id = 1
  for (const zone of zones) {
    for (const type of types) {
      const idx = id - 1
      inlets.push({
        id: `I${String(id++).padStart(2, '0')}`,
        label: `${zone} · ${type.charAt(0).toUpperCase() + type.slice(1)}`,
        zone,
        fillPct: presets[idx] ?? 45,
        valveOpen: false,
        type,
      })
    }
  }
  return {
    inlets,
    terminal: {
      vacuumKpa: 0,
      exhaustersOn: false,
      organicContainerPct: 20,
      recyclableContainerPct: 15,
      residualContainerPct: 10,
    },
    alerts: [{ id: 'a0', time: '00:00', message: 'DEMO system initialised. All valves closed.', severity: 'info' }],
    todayTotalTonne: 0.8,
    todayCycles: 3,
  }
}

const TYPE_LABELS: Record<InletStatus['type'], { en: string; hi: string }> = {
  organic: { en: 'Organic', hi: 'ऑर्गेनिक' },
  recyclable: { en: 'Recyclable', hi: 'रीसाइकिल' },
  residual: { en: 'Residual', hi: 'शेष' },
}

function formatInletLabel(inlet: InletStatus, lang: 'en' | 'hi'): string {
  if (lang === 'en') return inlet.label
  const zoneHi = inlet.zone.replace(/^Block\s+/i, 'ब्लॉक ')
  const typeHi = TYPE_LABELS[inlet.type].hi
  return `${zoneHi} · ${typeHi}`
}

function translateAlertMessage(message: string, lang: 'en' | 'hi'): string {
  if (lang === 'en') return message
  if (message === 'DEMO system initialised. All valves closed.') {
    return 'डेमो सिस्टम प्रारंभ हुआ। सभी वाल्व बंद हैं।'
  }
  const suctionMatch = message.match(/^Inlet (I\d+) \((Block [A-D])\) reached (\d+)% — suction cycle triggered\.$/)
  if (suctionMatch) {
    const [, id, zone, pct] = suctionMatch
    const zoneHi = zone.replace(/^Block\s+/i, 'ब्लॉक ')
    return `इनलेट ${id} (${zoneHi}) ${pct}% भर गया — वैक्यूम सक्शन चक्र शुरू।`
  }
  const pickupMatch = message.match(/^Hook-lift truck pickup simulated — (Organic|Recyclable|Residual) container emptied\.$/i)
  if (pickupMatch) {
    const rawType = pickupMatch[1].toLowerCase() as InletStatus['type']
    const typeHi = TYPE_LABELS[rawType]?.hi ?? pickupMatch[1]
    return `हुक-लिफ्ट ट्रक पिकअप सिमुलेटेड — ${typeHi} कंटेनर खाली किया गया।`
  }
  return message
}

function TypeBadge({ type }: { type: InletStatus['type'] }) {
  const { lang } = useLang()
  const styles = {
    organic: 'bg-green-100 text-green-700 border-green-200',
    recyclable: 'bg-blue-100 text-blue-700 border-blue-200',
    residual: 'bg-gray-100 text-gray-600 border-gray-200',
  }
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full border font-medium shrink-0 ${styles[type]}`}>
      {lang === 'hi' ? TYPE_LABELS[type].hi : TYPE_LABELS[type].en}
    </span>
  )
}

function InletCard({ inlet }: { inlet: InletStatus }) {
  const { lang } = useLang()
  const barColors = {
    organic: 'bg-green-500',
    recyclable: 'bg-blue-500',
    residual: 'bg-gray-400',
  }
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-3.5 shadow-sm">
      <div className="flex items-center justify-between gap-2 mb-2.5">
        <div className="min-w-0 truncate">
          <span className="font-mono text-xs font-bold text-gray-800">{inlet.id}</span>
          <span className="ml-2 text-xs text-gray-500">{formatInletLabel(inlet, lang)}</span>
        </div>
        <TypeBadge type={inlet.type} />
      </div>
      <div className="mb-2.5">
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span><T en="Fill" hi="भराव" /></span>
          <span className="font-medium text-gray-700">{inlet.fillPct}%</span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700 ease-in-out ${barColors[inlet.type]}`}
            style={{ width: `${inlet.fillPct}%` }}
          />
        </div>
      </div>
      <div className="flex items-center gap-1.5">
        <span className="text-xs text-gray-400"><T en="Valve:" hi="वाल्व:" /></span>
        {inlet.valveOpen ? (
          <motion.span
            animate={{ opacity: [1, 0.45, 1] }}
            transition={{ repeat: Infinity, duration: 1.1 }}
            className="text-xs px-2 py-0.5 rounded-full bg-orange-100 text-orange-700 font-semibold border border-orange-200"
          >
            {lang === 'hi' ? 'खुला' : 'OPEN'}
          </motion.span>
        ) : (
          <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 font-medium border border-gray-200">
            {lang === 'hi' ? 'बंद' : 'CLOSED'}
          </span>
        )}
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const { lang } = useLang()
  const [state, setState] = useState<DashboardState>(() => createDeterministicInitialState())
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    setState(createInitialDashboardState())
    intervalRef.current = setInterval(() => {
      setState(prev => tickDashboard(prev))
    }, 2500)
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [])

  const { inlets, terminal, alerts, todayTotalTonne, todayCycles } = state
  const anyContainerNearFull =
    terminal.organicContainerPct > 80 ||
    terminal.recyclableContainerPct > 80 ||
    terminal.residualContainerPct > 80

  const containers = [
    { key: 'organic', label: { en: 'Organic Container', hi: 'ऑर्गेनिक कंटेनर' }, pct: terminal.organicContainerPct, color: 'bg-green-500' },
    { key: 'recyclable', label: { en: 'Recyclable Container', hi: 'रीसाइकिल कंटेनर' }, pct: terminal.recyclableContainerPct, color: 'bg-blue-500' },
    { key: 'residual', label: { en: 'Residual Container', hi: 'शेष कचरा कंटेनर' }, pct: terminal.residualContainerPct, color: 'bg-gray-400' },
  ] as const

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      {/* DEMO DATA Banner */}
      <div className="w-full bg-orange-500 text-white py-2.5 px-4 text-center text-sm font-semibold shadow-sm">
        <T
          en="⚠️ DEMO DATA — Simulated values only. No real sensors connected."
          hi="⚠️ डेमो डेटा — केवल सिमुलेटेड मान। कोई वास्तविक सेंसर नहीं जुड़ा।"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
          <h1 className="text-2xl font-bold" style={{ color: 'var(--brand-navy)' }}>
            <T en="AVWCS Operations Dashboard (Demo)" hi="AVWCS संचालन डैशबोर्ड (डेमो)" />
          </h1>
          <span className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
            <T en="Updating every 2.5s" hi="हर 2.5 सेकंड में अपडेट" />
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Column 1: Inlets (~50% = 2 of 4 cols) */}
          <div className="lg:col-span-2">
            <h2 className="text-lg font-semibold mb-3" style={{ color: 'var(--brand-navy)' }}>
              <T en="Inlets Status" hi="इनलेट स्थिति" />
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {inlets.map(inlet => (
                <InletCard key={inlet.id} inlet={inlet} />
              ))}
            </div>
          </div>

          {/* Column 2: Terminal (~25% = 1 of 4 cols) */}
          <div className="lg:col-span-1">
            <h2 className="text-lg font-semibold mb-3" style={{ color: 'var(--brand-navy)' }}>
              <T en="Terminal" hi="टर्मिनल" />
            </h2>
            <div className="space-y-3">
              {/* Exhauster fans */}
              <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <motion.div
                    animate={terminal.exhaustersOn ? { rotate: 360 } : { rotate: 0 }}
                    transition={terminal.exhaustersOn ? { repeat: Infinity, duration: 1.5, ease: 'linear' } : {}}
                  >
                    <Wind size={18} className={terminal.exhaustersOn ? 'text-green-600' : 'text-gray-400'} />
                  </motion.div>
                  <span className="text-sm font-medium text-gray-700">
                    <T en="Exhauster Fans" hi="एक्सहॉस्टर पंखे" />
                  </span>
                  <span
                    className={`ml-auto text-xs px-2 py-0.5 rounded-full font-semibold border ${
                      terminal.exhaustersOn
                        ? 'bg-green-100 text-green-700 border-green-200'
                        : 'bg-gray-100 text-gray-500 border-gray-200'
                    }`}
                  >
                    {terminal.exhaustersOn ? (lang === 'hi' ? 'चालू' : 'ON') : (lang === 'hi' ? 'बंद' : 'OFF')}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-500 pt-1 border-t border-gray-100">
                  <span><T en="Vacuum Pressure" hi="वैक्यूम दबाव" /></span>
                  <span className="font-mono font-semibold text-gray-800">{terminal.vacuumKpa} kPa</span>
                </div>
              </div>

              {/* Container fill bars */}
              {containers.map(c => (
                <div key={c.key} className="bg-white rounded-xl border border-gray-200 p-3.5 shadow-sm">
                  <div className="flex justify-between text-xs text-gray-600 mb-1.5">
                    <span className="font-medium">{lang === 'hi' ? c.label.hi : c.label.en}</span>
                    <span className={`font-semibold ${c.pct > 80 ? 'text-orange-600' : 'text-gray-800'}`}>
                      {c.pct.toFixed(1)}%
                    </span>
                  </div>
                  <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ease-in-out ${c.color}`}
                      style={{ width: `${c.pct}%` }}
                    />
                  </div>
                </div>
              ))}

              {/* Container near-full warning */}
              <AnimatePresence>
                {anyContainerNearFull && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    className="flex items-start gap-2 bg-orange-50 border border-orange-300 rounded-xl p-3"
                  >
                    <AlertTriangle size={16} className="text-orange-600 mt-0.5 shrink-0" />
                    <p className="text-xs text-orange-800 font-medium leading-snug">
                      <T
                        en="Container nearly full — truck pickup needed"
                        hi="कंटेनर लगभग भरा है — ट्रक पिकअप आवश्यक"
                      />
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Column 3: Summary + Alerts (~25% = 1 of 4 cols) */}
          <div className="lg:col-span-1">
            <h2 className="text-lg font-semibold mb-3" style={{ color: 'var(--brand-navy)' }}>
              <T en="Summary & Alerts" hi="सारांश और अलर्ट" />
            </h2>

            <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm mb-4">
              <p className="text-xs text-gray-500 mb-3 font-medium uppercase tracking-wide">
                <T en="Today's Summary" hi="आज का सारांश" />
              </p>
              <div className="flex flex-col gap-3">
                <div>
                  <span className="text-2xl font-bold" style={{ color: 'var(--brand-green)' }}>
                    {todayTotalTonne.toFixed(2)} {lang === 'hi' ? 'टन' : 'tonne'}
                  </span>
                  <p className="text-xs text-gray-500">
                    <T en="collected today" hi="आज एकत्रित" />
                  </p>
                </div>
                <div className="pt-2 border-t border-gray-100">
                  <span className="text-2xl font-bold" style={{ color: 'var(--brand-orange)' }}>
                    {todayCycles} {lang === 'hi' ? 'चक्र' : 'cycles'}
                  </span>
                  <p className="text-xs text-gray-500">
                    <T en="completed today" hi="आज पूर्ण" />
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-4 py-2.5 border-b border-gray-100 bg-gray-50/60">
                <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                  <T en="Alert Feed" hi="अलर्ट फ़ीड" />
                </p>
              </div>
              <div className="max-h-80 overflow-y-auto divide-y divide-gray-100">
                <AnimatePresence initial={false}>
                  {alerts.map(alert => (
                    <motion.div
                      key={alert.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.25 }}
                      className={`px-4 py-2.5 flex items-start gap-2 ${
                        alert.severity === 'warning' ? 'bg-orange-50/40' : ''
                      }`}
                    >
                      {alert.severity === 'warning' ? (
                        <AlertTriangle size={14} className="text-orange-500 mt-0.5 shrink-0" />
                      ) : (
                        <Info size={14} className="text-gray-400 mt-0.5 shrink-0" />
                      )}
                      <div>
                        <p className="text-[11px] font-mono text-gray-400">{alert.time}</p>
                        <p
                          className={`text-xs leading-snug ${
                            alert.severity === 'warning' ? 'text-orange-700 font-medium' : 'text-gray-600'
                          }`}
                        >
                          {translateAlertMessage(alert.message, lang)}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
