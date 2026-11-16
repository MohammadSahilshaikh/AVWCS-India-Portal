'use client'
import { useState, useMemo, useEffect } from 'react'
import { motion } from 'framer-motion'
import { RotateCcw, Download, FunctionSquare } from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell
} from 'recharts'
import T from '@/components/ui/T'
import { useLang } from '@/components/ui/LangContext'
import SourceTag from '@/components/ui/SourceTag'
import PrintButton from '@/components/ui/PrintButton'
import { calculate, DEFAULT_INPUTS } from '@/lib/simulator'
import type { SimInputs } from '@/lib/types'

const PRESETS: Array<{ id: string; en: string; hi: string; inputs: SimInputs }> = [
  {
    id: 'township',
    en: '🏙️ Smart Township (10k)',
    hi: '🏙️ स्मार्ट टाउनशिप (10k)',
    inputs: DEFAULT_INPUTS,
  },
  {
    id: 'campus',
    en: '🎓 University Campus (5k)',
    hi: '🎓 विश्वविद्यालय कैंपस (5k)',
    inputs: {
      ...DEFAULT_INPUTS,
      population: 5000,
      wastePerPersonKg: 0.35,
      organicPct: 45,
      recyclePct: 35,
      residualPct: 20,
      pipelineLengthKm: 1.5,
      personsPerInlet: 60,
      currentTruckTripsPerDay: 10,
      renewablePct: 60,
    },
  },
  {
    id: 'hospital',
    en: '🏥 Hospital Complex (2.5k)',
    hi: '🏥 अस्पताल कॉम्प्लेक्स (2.5k)',
    inputs: {
      ...DEFAULT_INPUTS,
      population: 2500,
      wastePerPersonKg: 0.65,
      organicPct: 40,
      recyclePct: 30,
      residualPct: 30,
      pipelineLengthKm: 1.0,
      personsPerInlet: 40,
      currentTruckTripsPerDay: 8,
      renewablePct: 40,
    },
  },
]

// ─── Slider row ───────────────────────────────────────────────────────────────
interface SliderRowProps {
  id: string
  labelEn: string
  labelHi: string
  min: number
  max: number
  step: number
  value: number
  onChange: (v: number) => void
  display?: string
  sourceTag?: React.ReactNode
}

function SliderRow({
  id, labelEn, labelHi, min, max, step, value, onChange, display, sourceTag
}: SliderRowProps) {
  const { lang } = useLang()
  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-1 gap-2">
        <label htmlFor={id} className="text-sm font-medium text-gray-700 cursor-pointer">
          {lang === 'hi' ? labelHi : labelEn}
        </label>
        <span
          className="text-sm font-semibold tabular-nums shrink-0"
          style={{ color: 'var(--brand-navy)' }}
        >
          {display ?? value}
        </span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-gray-200"
        style={{ accentColor: 'var(--brand-green)' }}
      />
      {sourceTag && <div className="mt-1">{sourceTag}</div>}
    </div>
  )
}

// ─── Output card ──────────────────────────────────────────────────────────────
function OutCard({
  title, value, formula, showFormula, children, accent, className = ''
}: {
  title: React.ReactNode
  value: React.ReactNode
  formula?: string
  showFormula?: boolean
  children?: React.ReactNode
  accent?: string
  className?: string
}) {
  return (
    <div
      className={`bg-white rounded-xl border p-4 shadow-xs ${className}`}
      style={{ borderColor: accent ?? '#e2e8f0' }}
    >
      <p className="text-xs text-gray-500 font-medium mb-1">{title}</p>
      <p className="text-lg font-bold tabular-nums" style={{ color: accent ?? 'var(--brand-navy)' }}>
        {value}
      </p>
      {showFormula && formula && (
        <p className="mt-1.5 text-[11px] font-mono text-slate-600 bg-slate-50 border border-slate-200 rounded px-2 py-1">
          f(x): {formula}
        </p>
      )}
      {children}
    </div>
  )
}

// ─── Waste breakdown mini-bar ─────────────────────────────────────────────────
function WasteBar({
  color, label, value, total, unit
}: {
  color: string
  label: React.ReactNode
  value: number
  total: number
  unit: string
}) {
  const pct = total > 0 ? Math.min(100, (value / total) * 100) : 0
  return (
    <div className="flex-1 min-w-[90px]">
      <div className="flex justify-between text-xs text-gray-600 mb-1">
        <span>{label}</span>
        <span className="font-medium tabular-nums">{value.toFixed(1)} {unit}</span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-2 rounded-full transition-all duration-200"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
    </div>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function SimulatorPage() {
  const { lang } = useLang()
  const [inputs, setInputs] = useState<SimInputs>(DEFAULT_INPUTS)
  const [mounted, setMounted] = useState(false)
  const [showFormulas, setShowFormulas] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  function downloadSummary() {
    const lines = [
      'AVWCS India — Preliminary Feasibility Simulator Summary',
      'Status: Illustrative planning estimate ONLY (not final engineering design or DPR)',
      `Generated: ${new Date().toISOString().slice(0, 10)}`,
      '',
      '--- INPUT ASSUMPTIONS ---',
      `Population: ${inputs.population.toLocaleString('en-IN')}`,
      `Waste per person: ${inputs.wastePerPersonKg.toFixed(2)} kg/day`,
      `Waste streams (Organic / Recyclable / Residual): ${inputs.organicPct}% / ${inputs.recyclePct}% / ${inputs.residualPct}%`,
      `Pipeline length: ${inputs.pipelineLengthKm} km`,
      `Persons per inlet: ${inputs.personsPerInlet}`,
      `Current truck trips/day: ${inputs.currentTruckTripsPerDay}`,
      `Electricity tariff: Rs ${inputs.electricityRateRs}/kWh`,
      `Container capacity: ${inputs.containerCapacityTonne} T`,
      `Operating days/year: ${inputs.operatingDaysPerYear}`,
      `Renewable energy share: ${inputs.renewablePct}%`,
      '',
      '--- INDICATIVE OUTPUTS ---',
      `Daily waste: ${out.dailyWasteTonne.toFixed(2)} TPD (${Math.round(out.dailyWasteKg)} kg/day)`,
      `Annual waste: ${out.annualWasteTonne.toFixed(1)} TPY`,
      `Inlets required: ${out.numInlets}`,
      `Terminal truck trips/day: ${out.terminalTruckTrips}`,
      `Street truck trips removed/day: ${out.trucksRemoved}`,
      `Daily terminal power: ${Math.round(out.electricityKwhMin)}-${Math.round(out.electricityKwhMax)} kWh/day (literature 80-120 kWh/T)`,
      `Annual terminal power: ${Math.round(out.annualElectricityKwhMin / 1000)}-${Math.round(out.annualElectricityKwhMax / 1000)} MWh/year`,
      `Annual electricity cost: Rs ${(out.annualElectricityCostRsMin / 100000).toFixed(2)}-${(out.annualElectricityCostRsMax / 100000).toFixed(2)} Lakh/year`,
      `Indicative CAPEX range: Rs ${out.capitalCostCrMin.toFixed(1)}-${out.capitalCostCrMax.toFixed(1)} Crore`,
      `Indicative diesel saved: ${out.dieselSavedLitresMin.toFixed(0)}-${out.dieselSavedLitresMax.toFixed(0)} L/day`,
      `Energy balance status: ${out.netEnergyBalanceLabel}`,
      '',
      'CAVEAT: Pipeline diameter, pressure loss, fan sizing, soil trenching rates & carbon savings require site-specific DPR & specialist engineering review.',
    ]
    const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'avwcs-feasibility-summary.txt'
    a.click()
    URL.revokeObjectURL(url)
  }

  function set(key: keyof SimInputs, val: number) {
    setInputs(prev => {
      const next = { ...prev, [key]: val }
      if (key === 'organicPct') {
        const clampedRecycle = Math.min(prev.recyclePct, 100 - val)
        next.recyclePct = clampedRecycle
        next.residualPct = Math.max(0, 100 - val - clampedRecycle)
      } else if (key === 'recyclePct') {
        const clampedOrganic = Math.min(prev.organicPct, 100 - val)
        next.organicPct = clampedOrganic
        next.residualPct = Math.max(0, 100 - clampedOrganic - val)
      }
      return next
    })
  }

  const out = useMemo(() => calculate(inputs), [inputs])

  const energyData = [
    {
      name: lang === 'hi' ? 'ग्रिड बिजली' : 'Grid needed',
      fullName: lang === 'hi' ? 'ग्रिड बिजली आवश्यक' : 'Grid electricity needed',
      kwh: Math.round(out.renewableAdjustedKwh),
    },
    {
      name: lang === 'hi' ? 'अधिकतम लोड' : 'Max load',
      fullName: lang === 'hi' ? 'अधिकतम टर्मिनल लोड' : 'Max terminal load',
      kwh: Math.round(out.electricityKwhMax),
    },
  ]

  const balanceBadge =
    out.netEnergyBalanceLabel === 'Sustainable'
      ? { label: lang === 'hi' ? '✅ टिकाऊ' : '✅ Sustainable', bg: '#16A34A' }
      : out.netEnergyBalanceLabel === 'Marginal'
      ? { label: lang === 'hi' ? '⚠️ सीमान्त' : '⚠️ Marginal', bg: '#D97706' }
      : { label: lang === 'hi' ? '🔴 ग्रिड-निर्भर' : '🔴 Grid-dependent', bg: '#DC2626' }

  const unitT = lang === 'hi' ? 'टन' : 'T'
  const kwhUnit = lang === 'hi' ? 'kWh/दिन' : 'kWh/day'

  return (
    <div className="min-h-screen py-10 px-4" style={{ background: 'var(--bg)' }}>
      <div className="max-w-6xl mx-auto">
        {/* Page heading */}
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-1" style={{ color: 'var(--brand-navy)' }}>
              <T en="Project Simulator" hi="प्रोजेक्ट सिमुलेटर" />
            </h1>
            <p className="text-sm text-gray-500">
              <T
                en="Adjust inputs to estimate costs, energy balance, and truck reductions for your city or township."
                hi="अपने शहर या टाउनशिप के अनुसार स्लाइडर बदलें और लागत, ऊर्जा व ट्रक बचत का अनुमान लगाएं।"
              />
            </p>
          </div>
          <div className="no-print flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setShowFormulas(s => !s)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-colors cursor-pointer ${
                showFormulas
                  ? 'bg-blue-50 border-blue-300 text-blue-800'
                  : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              <FunctionSquare size={14} />
              <T
                en={showFormulas ? 'Hide Formulas' : 'Show Formulas'}
                hi={showFormulas ? 'सूत्र छुपाएं' : 'सूत्र दिखाएं'}
              />
            </button>
            <button
              type="button"
              onClick={downloadSummary}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-orange-300 bg-orange-50 text-xs font-semibold text-orange-700 hover:bg-orange-100 transition-colors cursor-pointer"
            >
              <Download size={14} />
              <T en="Download Summary" hi="सारांश डाउनलोड" />
            </button>
            <PrintButton />
            <button
              type="button"
              onClick={() => setInputs(DEFAULT_INPUTS)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <RotateCcw size={14} />
              <T en="Reset Defaults" hi="डिफ़ॉल्ट रीसेट करें" />
            </button>
          </div>
        </div>

        {/* Illustrative Presets Strip */}
        <div className="no-print mb-6 flex flex-wrap items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-3 shadow-xs">
          <span className="text-xs font-semibold text-gray-500 mr-1">
            <T en="Illustrative Presets (Assumptions):" hi="उदाहरण प्रीसेट (अनुमान):" />
          </span>
          {PRESETS.map(p => (
            <button
              key={p.id}
              type="button"
              onClick={() => setInputs(p.inputs)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-gray-200 bg-slate-50 hover:border-orange-300 hover:bg-orange-50 text-slate-700 transition-colors cursor-pointer"
            >
              {lang === 'hi' ? p.hi : p.en}
            </button>
          ))}
        </div>

        {/* Two-column layout: inputs left, outputs right */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* ── LEFT: INPUTS ── */}
          <section className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <h2 className="text-xl font-bold mb-1" style={{ color: 'var(--brand-navy)' }}>
              <T en="Project Inputs" hi="प्रोजेक्ट इनपुट" />
            </h2>
            <p className="text-xs text-gray-400 mb-5">
              <T
                en="(Adjust sliders to match your city/township)"
                hi="(अपने शहर के अनुसार स्लाइडर बदलें)"
              />
            </p>

            {/* 1. Population */}
            <SliderRow
              id="sim-population"
              labelEn="Population"
              labelHi="आबादी"
              min={1000}
              max={100000}
              step={500}
              value={inputs.population}
              onChange={v => set('population', v)}
              display={inputs.population.toLocaleString('en-IN')}
            />

            {/* 2. Waste per person */}
            <SliderRow
              id="sim-waste-per-person"
              labelEn="Waste per Person (kg/day)"
              labelHi="प्रति व्यक्ति कचरा (किग्रा/दिन)"
              min={0.1}
              max={1.0}
              step={0.05}
              value={inputs.wastePerPersonKg}
              onChange={v => set('wastePerPersonKg', v)}
              display={
                lang === 'hi'
                  ? `${inputs.wastePerPersonKg.toFixed(2)} किग्रा`
                  : `${inputs.wastePerPersonKg.toFixed(2)} kg`
              }
              sourceTag={
                <SourceTag
                  type="assumption"
                  text={
                    lang === 'hi'
                      ? '0.45 किग्रा/व्यक्ति/दिन — SWM भारत औसत'
                      : '0.45 kg/person/day — SWM India average'
                  }
                  detail={
                    lang === 'hi'
                      ? '0.45 किग्रा/व्यक्ति/दिन — भारतीय SWM औसत; अपने क्षेत्र के अनुसार बदलें'
                      : '0.45 kg/person/day — SWM India average; adjust for your context'
                  }
                />
              }
            />

            {/* 3. Organic % */}
            <SliderRow
              id="sim-organic-pct"
              labelEn="Organic Waste %"
              labelHi="ऑर्गेनिक कचरा %"
              min={0}
              max={100}
              step={5}
              value={inputs.organicPct}
              onChange={v => set('organicPct', v)}
              display={`${inputs.organicPct}%`}
            />

            {/* 4. Recyclable % */}
            <SliderRow
              id="sim-recycle-pct"
              labelEn="Recyclable Waste %"
              labelHi="रीसाइकिल कचरा %"
              min={0}
              max={100}
              step={5}
              value={inputs.recyclePct}
              onChange={v => set('recyclePct', v)}
              display={`${inputs.recyclePct}%`}
            />

            {/* 5. Residual % (auto-calculated, display only) */}
            <div className="mb-5 flex items-center justify-between gap-2 bg-gray-50 rounded-lg px-3 py-2.5 border border-dashed border-gray-200">
              <span className="text-sm text-gray-600">
                <T en="Residual % (auto-balanced · Total = 100%)" hi="शेष कचरा % (स्वचालित · कुल = 100%)" />
              </span>
              <span className="text-sm font-semibold tabular-nums text-gray-800 shrink-0">
                {inputs.residualPct}%
              </span>
            </div>

            {/* 6. Pipeline length */}
            <SliderRow
              id="sim-pipeline-km"
              labelEn="Pipeline Length (km)"
              labelHi="पाइपलाइन लंबाई (किमी)"
              min={0.5}
              max={10}
              step={0.5}
              value={inputs.pipelineLengthKm}
              onChange={v => set('pipelineLengthKm', v)}
              display={
                lang === 'hi'
                  ? `${inputs.pipelineLengthKm} किमी`
                  : `${inputs.pipelineLengthKm} km`
              }
            />

            {/* 7. Persons per inlet */}
            <SliderRow
              id="sim-persons-per-inlet"
              labelEn="Persons per Inlet"
              labelHi="प्रति इनलेट व्यक्ति"
              min={20}
              max={200}
              step={10}
              value={inputs.personsPerInlet}
              onChange={v => set('personsPerInlet', v)}
              display={`${inputs.personsPerInlet}`}
            />

            {/* 8. Current truck trips/day */}
            <SliderRow
              id="sim-truck-trips"
              labelEn="Current Truck Trips/day"
              labelHi="वर्तमान ट्रक फेरे/दिन"
              min={0}
              max={100}
              step={1}
              value={inputs.currentTruckTripsPerDay}
              onChange={v => set('currentTruckTripsPerDay', v)}
              display={`${inputs.currentTruckTripsPerDay}`}
            />

            {/* 9. Electricity rate */}
            <SliderRow
              id="sim-electricity-rate"
              labelEn="Electricity Rate (₹/kWh)"
              labelHi="बिजली दर (₹/kWh)"
              min={3}
              max={15}
              step={0.5}
              value={inputs.electricityRateRs}
              onChange={v => set('electricityRateRs', v)}
              display={`₹${inputs.electricityRateRs}/kWh`}
            />

            {/* 10. Container capacity */}
            <SliderRow
              id="sim-container-capacity"
              labelEn="Container Capacity (tonne)"
              labelHi="कंटेनर क्षमता (टन)"
              min={1}
              max={20}
              step={1}
              value={inputs.containerCapacityTonne}
              onChange={v => set('containerCapacityTonne', v)}
              display={
                lang === 'hi'
                  ? `${inputs.containerCapacityTonne} टन`
                  : `${inputs.containerCapacityTonne} T`
              }
            />

            {/* 11. Operating days per year */}
            <SliderRow
              id="sim-operating-days"
              labelEn="Operating Days / Year"
              labelHi="वार्षिक संचालन दिवस"
              min={1}
              max={366}
              step={1}
              value={inputs.operatingDaysPerYear}
              onChange={v => set('operatingDaysPerYear', v)}
              display={
                lang === 'hi'
                  ? `${inputs.operatingDaysPerYear} दिन`
                  : `${inputs.operatingDaysPerYear} days`
              }
            />
          </section>

          {/* ── RIGHT: OUTPUTS ── */}
          <section>
            <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--brand-navy)' }}>
              <T en="Estimated Outputs" hi="अनुमानित परिणाम" />
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* 1. Daily Waste */}
              <OutCard
                title={<T en="Daily Waste" hi="दैनिक कचरा" />}
                value={
                  lang === 'hi'
                    ? `${out.dailyWasteTonne.toFixed(1)} टन/दिन (${Math.round(out.dailyWasteKg).toLocaleString('en-IN')} किग्रा)`
                    : `${out.dailyWasteTonne.toFixed(1)} TPD (${Math.round(out.dailyWasteKg).toLocaleString('en-IN')} kg/day)`
                }
                formula="Population × kg/person/day ÷ 1,000"
                showFormula={showFormulas}
                className="sm:col-span-2"
              >
                <div className="mt-3 flex gap-4 flex-wrap">
                  <WasteBar
                    color="#16A34A"
                    label={<T en="Organic" hi="ऑर्गेनिक" />}
                    value={out.organicTonne}
                    total={out.dailyWasteTonne}
                    unit={unitT}
                  />
                  <WasteBar
                    color="#2563EB"
                    label={<T en="Recyclable" hi="रीसाइकिल" />}
                    value={out.recycleTonne}
                    total={out.dailyWasteTonne}
                    unit={unitT}
                  />
                  <WasteBar
                    color="#94A3B8"
                    label={<T en="Residual" hi="शेष" />}
                    value={out.residualTonne}
                    total={out.dailyWasteTonne}
                    unit={unitT}
                  />
                </div>
              </OutCard>

              {/* 2. Inlets Required */}
              <OutCard
                title={<T en="Inlets Required" hi="आवश्यक इनलेट" />}
                value={
                  lang === 'hi'
                    ? `${out.numInlets} इनलेट`
                    : `${out.numInlets} inlets`
                }
                formula="Ceiling(Population ÷ Persons/inlet)"
                showFormula={showFormulas}
              />

              {/* 3. Trucks Removed */}
              <OutCard
                title={<T en="Trucks Removed" hi="हटाए गए ट्रक फेरे" />}
                value={
                  lang === 'hi'
                    ? `${out.trucksRemoved} ट्रक फेरे/दिन कम`
                    : `${out.trucksRemoved} truck trips/day removed`
                }
                formula="Max(0, Current trips − Terminal trips)"
                showFormula={showFormulas}
                accent={out.trucksRemoved > 0 ? '#16A34A' : undefined}
                className={out.trucksRemoved > 0 ? '!bg-green-50/70' : ''}
              />

              {/* 4. Terminal Truck Trips */}
              <OutCard
                title={<T en="Terminal Truck Trips" hi="टर्मिनल ट्रक फेरे" />}
                value={
                  lang === 'hi'
                    ? `टर्मिनल पर ${out.terminalTruckTrips} फेरे/दिन शेष`
                    : `${out.terminalTruckTrips} trips/day remain at terminal`
                }
                formula="Ceiling(Daily TPD ÷ Container payload)"
                showFormula={showFormulas}
              />

              {/* 5. Electricity Required */}
              <OutCard
                title={<T en="Electricity Required" hi="बिजली आवश्यकता" />}
                value={`${Math.round(out.electricityKwhMin)}–${Math.round(out.electricityKwhMax)} ${kwhUnit}`}
                formula="Daily TPD × (80 to 120 kWh/tonne)"
                showFormula={showFormulas}
              >
                <div className="mt-1">
                  <SourceTag
                    type="literature"
                    text={
                      lang === 'hi'
                        ? '80–120 kWh/टन मानक'
                        : '80–120 kWh/tonne benchmark'
                    }
                    detail={
                      lang === 'hi'
                        ? 'न्यूमैटिक कचरा परिवहन के लिए प्रकाशित जीवन-चक्र ऊर्जा मानक (80–120 kWh/टन)'
                        : 'Published life-cycle energy benchmark for pneumatic waste transport (80–120 kWh/tonne)'
                    }
                  />
                </div>
              </OutCard>

              {/* 6. Daily & Annual Electricity Budget */}
              <OutCard
                title={<T en="Electricity Cost (Daily / Annual)" hi="बिजली लागत (दैनिक / वार्षिक)" />}
                value={
                  lang === 'hi'
                    ? `₹${Math.round(out.electricityCostRsMin).toLocaleString('en-IN')}–₹${Math.round(out.electricityCostRsMax).toLocaleString('en-IN')}/दिन · ₹${(out.annualElectricityCostRsMin / 100000).toFixed(1)}–${(out.annualElectricityCostRsMax / 100000).toFixed(1)} लाख/वर्ष`
                    : `₹${Math.round(out.electricityCostRsMin).toLocaleString('en-IN')}–₹${Math.round(out.electricityCostRsMax).toLocaleString('en-IN')}/day · ₹${(out.annualElectricityCostRsMin / 100000).toFixed(1)}–${(out.annualElectricityCostRsMax / 100000).toFixed(1)} Lakh/yr`
                }
                formula="Daily kWh × Tariff × Operating days/yr"
                showFormula={showFormulas}
                className="sm:col-span-2"
              >
                <p className="mt-1 text-xs text-gray-500">
                  {lang === 'hi'
                    ? `वार्षिक कचरा: ${out.annualWasteTonne.toFixed(0)} टन/वर्ष · वार्षिक ऊर्जा: ${Math.round(out.annualElectricityKwhMin / 1000)}–${Math.round(out.annualElectricityKwhMax / 1000)} MWh/वर्ष`
                    : `Annual waste: ${out.annualWasteTonne.toFixed(0)} TPY · Annual energy: ${Math.round(out.annualElectricityKwhMin / 1000)}–${Math.round(out.annualElectricityKwhMax / 1000)} MWh/yr`}
                </p>
              </OutCard>

              {/* 7. Capital Cost Range — prominent card */}
              <OutCard
                title={<T en="Capital Cost Range" hi="पूंजीगत लागत अनुमान" />}
                value={
                  lang === 'hi'
                    ? `₹${out.capitalCostCrMin.toFixed(1)}–${out.capitalCostCrMax.toFixed(1)} करोड़`
                    : `₹${out.capitalCostCrMin.toFixed(1)}–${out.capitalCostCrMax.toFixed(1)} Crore`
                }
                formula="(Pipe m × ₹25k–60k) + (Inlets × ₹2L–4L) + Terminal ₹3–8 Cr"
                showFormula={showFormulas}
                accent="var(--brand-orange)"
                className="sm:col-span-2 !border-2 !bg-orange-50/30"
              >
                <div className="mt-1">
                  <SourceTag
                    type="assumption"
                    text={
                      lang === 'hi'
                        ? 'साहित्य-आधारित अनुमान; साइट सर्वे आवश्यक'
                        : 'Literature-based range; site survey required'
                    }
                    detail={
                      lang === 'hi'
                        ? 'इसमें भूमिगत स्टील पाइपलाइन, इनलेट/वाल्व और टर्मिनल उपकरण शामिल हैं; मिट्टी व स्थानीय दरों के अनुसार लागत काफी बदलती है।'
                        : 'Includes underground steel pipeline, inlets/valves, and terminal equipment; site survey & soil conditions vary significantly.'
                    }
                  />
                </div>
              </OutCard>

              {/* 8. Diesel Saved — green card */}
              <OutCard
                title={<T en="Indicative Diesel Saved" hi="अनुमानित डीजल बचत" />}
                value={
                  lang === 'hi'
                    ? `${out.dieselSavedLitresMin.toFixed(0)}–${out.dieselSavedLitresMax.toFixed(0)} लीटर/दिन`
                    : `${out.dieselSavedLitresMin.toFixed(0)}–${out.dieselSavedLitresMax.toFixed(0)} litres/day`
                }
                formula="Trucks removed × 15 km avg trip × 0.35 L/km (±20%)"
                showFormula={showFormulas}
                accent="#16A34A"
                className="sm:col-span-2 !bg-green-50/70 !border-green-300"
              />
            </div>

            {/* IMPORTANT WARNING BOX (Engineering & Carbon caveats per SRS §7.3) */}
            <motion.div
              initial={false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mt-4 rounded-xl border-2 border-amber-300 bg-amber-50 p-4 text-xs sm:text-sm font-medium text-amber-900 leading-relaxed space-y-1.5"
            >
              <p>
                <T
                  en="⚠️ Preliminary Estimates Only: Capital costs vary sharply with soil strata, water table, local trenching rates, and pipe routing. Commission a site-specific DPR before any procurement decision."
                  hi="⚠️ केवल प्रारंभिक अनुमान: वास्तविक लागत मिट्टी, जल स्तर, स्थानीय दरों और पाइप मार्ग के अनुसार काफी बदलती है। किसी भी खरीद निर्णय से पहले साइट-विशिष्ट DPR बनवाएं।"
                />
              </p>
              <p className="text-amber-800">
                <T
                  en="🔧 Engineering & Carbon Note: Pipe diameter, pressure drop, airflow & fan sizing require specialist vendor validation. Net carbon savings require verified fleet km, fuel factors, and regional grid emission factors."
                  hi="🔧 इंजीनियरिंग व कार्बन नोट: पाइप व्यास, प्रेशर लॉस, एयरफ़्लो और पंखे की क्षमता विशेषज्ञ द्वारा सत्यापित होनी चाहिए। सटीक कार्बन बचत हेतु वास्तविक ट्रक किमी व ग्रिड उत्सर्जन डेटा आवश्यक है।"
                />
              </p>
            </motion.div>
          </section>
        </div>

        {/* ── ENERGY SUSTAINABILITY METER ── */}
        <section className="mt-10 bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
            <h2 className="text-xl font-bold" style={{ color: 'var(--brand-navy)' }}>
              <T en="Energy Balance — Is It Sustainable?" hi="ऊर्जा संतुलन — क्या यह टिकाऊ है?" />
            </h2>
            <span
              className="inline-block px-4 py-1.5 rounded-full text-white font-semibold text-sm"
              style={{ background: balanceBadge.bg }}
            >
              {balanceBadge.label}
            </span>
          </div>

          <SourceTag
            type="literature"
            text={
              lang === 'hi'
                ? '80–120 kWh/टन मानक — प्रकाशित जीवन-चक्र अध्ययन'
                : '80–120 kWh/tonne benchmark — published life-cycle studies'
            }
            detail={
              lang === 'hi'
                ? 'शुद्ध ग्रिड बिजली की मांग टर्मिनल पर रूफटॉप सोलर या बायोगैस बिजली जोड़ने पर निर्भर करती है।'
                : 'Net grid demand depends on integrating rooftop solar or biogas power at the waste terminal.'
            }
          />

          <div className="mt-5 max-w-md">
            <SliderRow
              id="sim-renewable-pct"
              labelEn="Renewable Energy Share %"
              labelHi="नवीकरणीय ऊर्जा का हिस्सा %"
              min={0}
              max={100}
              step={5}
              value={inputs.renewablePct}
              onChange={v => set('renewablePct', v)}
              display={`${inputs.renewablePct}%`}
            />
          </div>

          {/* Horizontal Bar Chart */}
          <div className="h-44 max-w-2xl mt-2">
            {mounted ? (
              <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={160}>
                <BarChart
                  data={energyData}
                  layout="vertical"
                  margin={{ left: 4, right: 20, top: 8, bottom: 8 }}
                >
                  <XAxis type="number" tick={{ fontSize: 11 }} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={105} />
                  <Tooltip
                    formatter={(v, _name, item) => [
                      `${v ?? 0} ${kwhUnit}`,
                      item?.payload?.fullName ?? '',
                    ]}
                  />
                  <Bar dataKey="kwh" radius={[0, 6, 6, 0]} barSize={26}>
                    <Cell fill="#EA580C" />
                    <Cell fill="#94A3B8" />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full w-full rounded-xl bg-gray-50 animate-pulse" />
            )}
          </div>

          <div className="mt-3 flex flex-wrap gap-4 text-xs text-gray-600">
            <span className="inline-flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-xs inline-block bg-[#EA580C]" />
              <T en="Grid electricity needed" hi="ग्रिड बिजली आवश्यक" />:
              <strong className="tabular-nums">{Math.round(out.renewableAdjustedKwh)} {kwhUnit}</strong>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-xs inline-block bg-[#94A3B8]" />
              <T en="Max terminal load" hi="अधिकतम टर्मिनल लोड" />:
              <strong className="tabular-nums">{Math.round(out.electricityKwhMax)} {kwhUnit}</strong>
            </span>
          </div>
        </section>
      </div>
    </div>
  )
}
