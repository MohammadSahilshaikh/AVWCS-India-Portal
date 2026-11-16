'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Sun, Zap, Landmark, Layers, Fuel, Sparkles } from 'lucide-react'
import SourceTag from '@/components/ui/SourceTag'

type Lang = 'en' | 'hi'

/* ── 1. Animated Street Comparison: Truck Street vs AVWCS Underground ─────── */
export function StreetShowdownVisual({ lang }: { lang: Lang }) {
  const isHi = lang === 'hi'
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* LEFT: Truck Street */}
      <div className="bg-white rounded-2xl border-2 border-slate-200 p-4 shadow-sm">
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
            🚛 {isHi ? 'पारंपरिक ट्रक गली' : 'Conventional Truck Street'}
          </span>
          <span className="text-[11px] font-semibold text-red-600">
            {isHi ? 'रोज़ शोर · धुआँ · खुले बिन' : 'Daily Noise · Exhaust · Open Bins'}
          </span>
        </div>

        <svg viewBox="0 0 360 155" className="w-full h-auto rounded-xl bg-slate-50 border border-slate-100" aria-label={isHi ? 'ट्रक आधारित कचरा संग्रह दृश्य' : 'Truck waste collection street visual'}>
          {/* Sky & Buildings */}
          <rect x="20" y="20" width="52" height="58" rx="4" fill="#CBD5E1" />
          <rect x="86" y="12" width="58" height="66" rx="4" fill="#94A3B8" />
          <rect x="260" y="24" width="60" height="54" rx="4" fill="#CBD5E1" />
          {/* Road */}
          <rect x="0" y="78" width="360" height="36" fill="#475569" />
          <line x1="10" y1="96" x2="350" y2="96" stroke="#CBD5E1" strokeWidth="1.5" strokeDasharray="10 8" />
          {/* Subsoil */}
          <rect x="0" y="114" width="360" height="41" fill="#E2E8F0" />
          <text x="180" y="138" textAnchor="middle" fontSize="9.5" fill="#64748B" fontWeight="600">
            {isHi ? 'भूमिगत कचरा पाइप नहीं — सारा बोझ सड़क पर' : 'No underground pipeline — heavy traffic on road'}
          </text>

          {/* Overflowing street bin bay */}
          <rect x="210" y="58" width="22" height="20" rx="2" fill="#EF4444" opacity="0.88" />
          <circle cx="218" cy="55" r="3.5" fill="#B45309" />
          <circle cx="225" cy="56" r="3" fill="#65A30D" />
          <text x="221" y="48" textAnchor="middle" fontSize="7.5" fill="#DC2626" fontWeight="700">
            {isHi ? 'बदबू' : 'Odour'}
          </text>

          {/* Animated Diesel Truck + Exhaust */}
          <motion.g
            animate={{ x: [-15, 78, -15] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          >
            {/* Exhaust Puffs */}
            <motion.circle
              cx="68"
              cy="64"
              r="5"
              fill="#94A3B8"
              animate={{ x: [0, -16], y: [0, -18], opacity: [0.85, 0], scale: [0.8, 1.8] }}
              transition={{ duration: 1.4, repeat: Infinity }}
            />
            <motion.circle
              cx="65"
              cy="62"
              r="4"
              fill="#64748B"
              animate={{ x: [0, -20], y: [0, -20], opacity: [0.7, 0], scale: [0.7, 1.6] }}
              transition={{ duration: 1.4, repeat: Infinity, delay: 0.6 }}
            />
            {/* Truck Body */}
            <rect x="74" y="62" width="46" height="22" rx="3" fill="#334155" />
            <rect x="120" y="67" width="18" height="17" rx="3" fill="#64748B" />
            <rect x="124" y="70" width="9" height="6" rx="1" fill="#E0F2FE" />
            <circle cx="86" cy="86" r="5" fill="#0F172A" />
            <circle cx="127" cy="86" r="5" fill="#0F172A" />
            <text x="97" y="76" textAnchor="middle" fontSize="7" fill="#F8FAFC" fontWeight="700">DIESEL</text>
          </motion.g>
        </svg>
      </div>

      {/* RIGHT: AVWCS Clean Street + Underground Pipe + Solar Terminal */}
      <div className="bg-white rounded-2xl border-2 border-green-300 p-4 shadow-sm">
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full bg-green-100 text-green-800">
            ⚡ {isHi ? 'AVWCS सोलर-भूमिगत गली' : 'AVWCS Solar + Underground'}
          </span>
          <span className="text-[11px] font-semibold text-green-700">
            {isHi ? 'ट्रक-मुक्त सड़क · सोलर टर्मिनल' : 'Zero Street Trucks · Solar Powered'}
          </span>
        </div>

        <svg viewBox="0 0 360 155" className="w-full h-auto rounded-xl bg-green-50/40 border border-green-100" aria-label={isHi ? 'AVWCS भूमिगत व सोलर दृश्य' : 'AVWCS underground and solar visual'}>
          {/* Clean Street & Trees */}
          <rect x="18" y="20" width="52" height="58" rx="4" fill="#1E3A5F" opacity="0.82" />
          <circle cx="102" cy="56" r="13" fill="#16A34A" opacity="0.85" />
          <rect x="100" y="65" width="4" height="13" fill="#78350F" />
          {/* Sun & Solar Terminal */}
          <motion.circle
            cx="326"
            cy="20"
            r="9"
            fill="#F59E0B"
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ duration: 2.5, repeat: Infinity }}
          />
          <rect x="266" y="42" width="66" height="36" rx="5" fill="#EA580C" />
          {/* Tilted Solar Panel on Terminal Roof */}
          <polygon points="270,41 328,41 322,31 276,31" fill="#0284C7" stroke="#E0F2FE" strokeWidth="1" />
          <text x="299" y="61" textAnchor="middle" fontSize="8" fill="#FFFFFF" fontWeight="700">
            {isHi ? 'सोलर टर्मिनल' : 'SOLAR TERMINAL'}
          </text>
          <text x="299" y="71" textAnchor="middle" fontSize="6.8" fill="#FFEDD5">
            {isHi ? '-55 kPa वैक्यूम' : '-55 kPa Vacuum'}
          </text>

          {/* Clean Pedestrian/Green Lane */}
          <rect x="0" y="78" width="360" height="14" fill="#F1F5F9" />
          <line x1="0" y1="92" x2="360" y2="92" stroke="#CBD5E1" strokeWidth="1.5" />

          {/* 3 Color-coded Sealed Inlets */}
          <rect x="128" y="61" width="14" height="17" rx="3" fill="#16A34A" />
          <rect x="150" y="61" width="14" height="17" rx="3" fill="#2563EB" />
          <rect x="172" y="61" width="14" height="17" rx="3" fill="#64748B" />
          <text x="157" y="55" textAnchor="middle" fontSize="7.5" fill="#1E3A5F" fontWeight="700">
            {isHi ? '3-धारा बंद इनलेट' : '3-Stream Sealed Inlets'}
          </text>

          {/* Underground Pipe Network */}
          <rect x="0" y="92" width="360" height="63" fill="#0F172A" opacity="0.93" />
          <path d="M 135 92 L 135 126 L 295 126 L 295 78" fill="none" stroke="#334155" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M 157 92 L 157 126" fill="none" stroke="#334155" strokeWidth="7" />
          <path d="M 179 92 L 179 126" fill="none" stroke="#334155" strokeWidth="7" />

          {/* Moving Glowing Waste Packets inside pipe */}
          {[0, 0.9, 1.8].map((delay, idx) => (
            <motion.circle
              key={idx}
              cx="135"
              cy="126"
              r="4.2"
              fill={idx === 0 ? '#22C55E' : idx === 1 ? '#38BDF8' : '#FB923C'}
              animate={{ x: [0, 155], opacity: [0.3, 1, 1, 0] }}
              transition={{ duration: 2.6, repeat: Infinity, delay, ease: 'easeIn' }}
            />
          ))}

          <text x="180" y="146" textAnchor="middle" fontSize="8.5" fill="#94A3B8" fontWeight="600">
            {isHi ? 'भूमिगत 60–80 km/h वैक्यूम प्रवाह · सड़कें पूरी तरह साफ़' : '60–80 km/h underground airflow · Zero trucks on residential street'}
          </text>
        </svg>
      </div>
    </div>
  )
}

/* ── 2. CAPEX Value Explorer: Shared Trenching + 25-Yr Asset vs Fleet ─────── */
export function CapexAdvantageVisual({ lang }: { lang: Lang }) {
  const isHi = lang === 'hi'
  const [view, setView] = useState<'trench' | 'lifecycle'>('trench')

  return (
    <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 sm:p-6 space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-orange-600 mb-1">
            <Landmark size={14} />
            {isHi ? 'पूंजीगत लागत (CAPEX) का स्मार्ट विश्लेषण' : 'How CAPEX Delivers Long-Term Value'}
          </span>
          <h2 className="text-xl font-bold" style={{ color: 'var(--brand-navy)' }}>
            {isHi
              ? 'शुरुआती खर्च ज़्यादा क्यों है — और यह 25 साल में फ़ायदेमंद कैसे बनता है?'
              : 'Higher Year-1 Build, Smarter 25-Year Infrastructure Return'}
          </h2>
        </div>

        {/* Toggle */}
        <div className="inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200">
          <button
            type="button"
            onClick={() => setView('trench')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              view === 'trench' ? 'bg-white shadow-xs text-slate-900' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers size={13} className="text-green-600" />
            {isHi ? 'एक ही खुदाई + ज़मीन बचत' : 'Shared Trench + Land Saved'}
          </button>
          <button
            type="button"
            onClick={() => setView('lifecycle')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              view === 'lifecycle' ? 'bg-white shadow-xs text-slate-900' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles size={13} className="text-orange-600" />
            {isHi ? '25-साल संपत्ति बनाम ट्रक' : '25-Yr Asset vs Repeat Trucks'}
          </button>
        </div>
      </div>

      {view === 'trench' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
          {/* Animated Shared Utility Trench Cutaway */}
          <div className="lg:col-span-7">
            <svg viewBox="0 0 460 195" className="w-full h-auto rounded-xl bg-slate-50 border border-slate-200" aria-label="Shared utility trench animation">
              {/* Surface Green Promenade + Saved Real Estate */}
              <rect x="0" y="0" width="460" height="62" fill="#F0FDF4" />
              <rect x="18" y="14" width="135" height="36" rx="6" fill="#DCFCE7" stroke="#86EFAC" />
              <text x="85" y="30" textAnchor="middle" fontSize="9.5" fill="#166534" fontWeight="700">
                {isHi ? '🌳 बची हुई सड़क ज़मीन' : '🌳 Freed Prime Land'}
              </text>
              <text x="85" y="42" textAnchor="middle" fontSize="8" fill="#15803D">
                {isHi ? 'कोई कूड़ा-पॉइंट/ट्रक लेन नहीं' : 'Zero bin bays & turning yards'}
              </text>

              <rect x="172" y="14" width="270" height="36" rx="6" fill="#EFF6FF" stroke="#BFDBFE" />
              <text x="307" y="30" textAnchor="middle" fontSize="9.5" fill="#1E3A5F" fontWeight="700">
                {isHi ? '🚧 निर्माण के समय एक ही संयुक्त खुदाई (Co-Trenching)' : '🚧 One-Time Co-Trenching During Township Build'}
              </text>
              <text x="307" y="42" textAnchor="middle" fontSize="8" fill="#1D4ED8">
                {isHi ? 'पानी + सीवर के साथ पाइप डलने से अलग सड़क तोड़फोड़ नहीं' : 'Laid alongside water & sewer — avoids repeat road excavation'}
              </text>

              {/* Road & Earth */}
              <rect x="0" y="62" width="460" height="14" fill="#64748B" />
              <rect x="0" y="76" width="460" height="119" fill="#E2E8F0" />

              {/* Single Excavation Trench Box */}
              <rect x="90" y="76" width="280" height="102" rx="8" fill="#1E293B" />
              <text x="230" y="94" textAnchor="middle" fontSize="8.5" fill="#CBD5E1" fontWeight="600">
                {isHi ? 'एक संयुक्त यूटिलिटी ट्रेंच (कम खुदाई खर्च)' : 'Single Shared Utility Corridor (Lower Civil CAPEX)'}
              </text>

              {/* 3 Utility Pipes lowering in sync */}
              <motion.g
                initial={false}
                animate={{ y: [0, 3, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              >
                {/* Water */}
                <rect x="115" y="108" width="230" height="14" rx="7" fill="#38BDF8" />
                <text x="230" y="118" textAnchor="middle" fontSize="8.5" fill="#0F172A" fontWeight="700">
                  💧 {isHi ? 'पेयजल पाइपलाइन (Water Supply)' : 'Potable Water Pipe'}
                </text>

                {/* AVWCS Highlight */}
                <rect x="115" y="129" width="230" height="17" rx="8.5" fill="#EA580C" stroke="#FED7AA" strokeWidth="1.5" />
                <text x="230" y="140.5" textAnchor="middle" fontSize="8.5" fill="#FFFFFF" fontWeight="700">
                  ⚡ {isHi ? 'AVWCS स्टील पाइप (25–30 साल आयु)' : 'AVWCS Carbon-Steel Pipe (25–30 Yr Life)'}
                </text>

                {/* Sewer */}
                <rect x="115" y="153" width="230" height="14" rx="7" fill="#64748B" />
                <text x="230" y="163" textAnchor="middle" fontSize="8.5" fill="#F8FAFC" fontWeight="700">
                  🚰 {isHi ? 'सीवर / ड्रेनेज लाइन' : 'Sewer & Storm Conduit'}
                </text>
              </motion.g>
            </svg>
          </div>

          {/* 3 Bullet Value Points */}
          <div className="lg:col-span-5 space-y-3">
            <div className="rounded-xl border border-orange-200 bg-orange-50/70 p-3.5">
              <div className="text-xs font-bold text-orange-800 mb-1">
                {isHi ? '1. साझा खुदाई से सिविल बचत' : '1. Shared Excavation Cuts CAPEX'}
              </div>
              <p className="text-xs text-slate-700 leading-relaxed">
                {isHi
                  ? 'नई टाउनशिप या कैंपस बनाते समय पानी-सीवर ट्रेंच पहले ही खोदी जाती है — उसी समय पाइप डालने से दोबारा सड़क तोड़ने का बड़ा खर्च बचता है।'
                  : 'In greenfield townships, trenches already open for water/sewer lines — co-laying AVWCS avoids duplicate road-cutting CAPEX.'}
              </p>
            </div>
            <div className="rounded-xl border border-green-200 bg-green-50/70 p-3.5">
              <div className="text-xs font-bold text-green-800 mb-1">
                {isHi ? '2. कीमती ज़मीन और सड़क स्पेस मुक्त' : '2. Frees High-Value Urban Land'}
              </div>
              <p className="text-xs text-slate-700 leading-relaxed">
                {isHi
                  ? 'सोसायटियों में डंपिंग प्वाइंट और ट्रक टर्निंग यार्ड की ज़मीन खाली बचती है, जिसे पार्क, पार्किंग या बिल्ड-अप एरिया में इस्तेमाल किया जा सकता है।'
                  : 'Reclaims street bin bays and truck turnaround corridors for parks, pedestrian zones, or productive real estate.'}
              </p>
            </div>
            <SourceTag
              type="assumption"
              text={isHi ? 'सिविल बचत केवल ग्रीनफील्ड साइट में अधिक' : 'Savings apply mainly to dense greenfield builds'}
              detail={isHi ? 'पुराने शहरों में खुदाई लागत काफी बढ़ जाती है; हर प्रोजेक्ट में DPR और BOQ आवश्यक है।' : 'Retrofitting dense old streets increases civil trenching cost; always confirm via site DPR & BOQ.'}
            />
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
          {/* 25-Yr Lifecycle Visual Bar Timeline */}
          <div className="lg:col-span-7 bg-slate-50 rounded-xl border border-slate-200 p-4 space-y-4">
            {/* Truck Row */}
            <div>
              <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1.5">
                <span>🚛 {isHi ? 'ट्रक प्रणाली: कम शुरुआत, पर बार-बार वाहन खरीद' : 'Truck System: Low Yr-1, Repeat Replacements'}</span>
                <span className="text-red-600">{isHi ? '3 बार नया बेड़ा (25 साल में)' : '3x Fleet Cycles in 25 Yrs'}</span>
              </div>
              <div className="grid grid-cols-4 gap-1.5 text-[10px] font-bold text-center text-white">
                {['Yr 1\nCAPEX', 'Yr 8\nNew Trucks', 'Yr 16\nNew Trucks', 'Yr 24\nNew Trucks'].map((lbl, idx) => (
                  <motion.div
                    key={idx}
                    initial={false}
                    animate={{ scale: [0.97, 1, 0.97] }}
                    transition={{ duration: 2.2, repeat: Infinity, delay: idx * 0.45 }}
                    className={`rounded-lg py-2 px-1 whitespace-pre-line ${idx === 0 ? 'bg-slate-600' : 'bg-red-500'}`}
                  >
                    {isHi ? lbl.replace('New Trucks', 'नए ट्रक').replace('Yr', 'साल') : lbl}
                  </motion.div>
                ))}
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                {isHi ? '+ 25 साल तक डीज़ल महंगाई, सड़क मरम्मत व अधिक ड्राइवर/कर्मी वेतन' : '+ 25 yrs of diesel fuel escalation, street pavement wear & fleet labour'}
              </p>
            </div>

            {/* AVWCS Row */}
            <div>
              <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1.5">
                <span>⚡ {isHi ? 'AVWCS: एक बार मजबूत निर्माण, 25–30 साल सेवा' : 'AVWCS: One-Time Civil Asset, 25–30 Yr Service'}</span>
                <span className="text-green-700">{isHi ? 'स्थायी भूमिगत ढांचा' : 'Permanent Subsurface Infrastructure'}</span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-white">
                <div className="w-[34%] bg-orange-600 rounded-lg py-2.5 text-center px-2">
                  {isHi ? 'साल-1 CAPEX' : 'Yr-1 Build'}
                </div>
                <motion.div
                  className="flex-1 bg-green-600 rounded-lg py-2.5 px-3 flex items-center justify-between"
                  animate={{ opacity: [0.88, 1, 0.88] }}
                  transition={{ duration: 2.5, repeat: Infinity }}
                >
                  <span>{isHi ? '25–30 वर्ष स्थिर पाइपलाइन सेवा' : '25–30 Yr Pipe & Inlet Lifespan'}</span>
                  <span>✓</span>
                </motion.div>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                {isHi ? 'केवल टर्मिनल मोटर/वाल्व की नियमित सर्विसिंग — सड़कें हमेशा वाहन-मुक्त' : 'Only scheduled terminal valve/fan maintenance — zero street bin expansion needed'}
              </p>
            </div>
          </div>

          <div className="lg:col-span-5 space-y-3">
            <div className="rounded-xl border border-blue-200 bg-blue-50/70 p-4 space-y-2">
              <h3 className="text-sm font-bold text-blue-950">
                {isHi ? 'निवेश का असली पैमाना: 25 साल की कुल लागत (LCC)' : 'Real Financial Metric: 25-Year Lifecycle Value'}
              </h3>
              <p className="text-xs text-slate-700 leading-relaxed">
                {isHi
                  ? 'ट्रक सिस्टम पहली नजर में सस्ता दिखता है क्योंकि साल-1 में केवल गाड़ियाँ खरीदनी होती हैं। लेकिन ऊँचे घनत्व वाली स्मार्ट टाउनशिप में AVWCS एक बार बनकर 25–30 साल तक स्थिर सेवा देता है।'
                  : 'Trucks appear cheaper in Year 1 because capital is split across repeat fleet purchases. In high-density planned developments, AVWCS locks in multi-decade infrastructure value.'}
              </p>
            </div>
            <SourceTag
              type="assumption"
              text={isHi ? 'साल-1 CAPEX अधिक; पेबैक साइट DPR पर निर्भर' : 'Year-1 CAPEX stays high; payback depends on site DPR'}
              detail={isHi ? 'अंतिम वित्तीय पेबैक की गारंटी बिना स्थानीय ट्रक दर व कचरा ऑडिट के नहीं दी जा सकती।' : 'Payback is never guaranteed without site-specific waste audit, density, and tender BOQ.'}
            />
          </div>
        </div>
      )}
    </section>
  )
}

/* ── 3. Interactive Solar Panel Power Offset Visual ───────────────────────── */
export function SolarPowerVisual({ lang }: { lang: Lang }) {
  const isHi = lang === 'hi'
  const [solarPct, setSolarPct] = useState(70)
  const gridPct = 100 - solarPct

  return (
    <section className="bg-gradient-to-br from-amber-50/60 via-white to-green-50/60 rounded-2xl border border-amber-200 shadow-sm p-5 sm:p-6 space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-700 mb-1">
            <Sun size={14} className="text-amber-500" />
            {isHi ? 'बिजली खपत का स्मार्ट समाधान' : 'Turning Electricity Demand into Clean Solar Advantage'}
          </span>
          <h2 className="text-xl font-bold" style={{ color: 'var(--brand-navy)' }}>
            {isHi
              ? 'टर्मिनल पर सोलर पैनल लगाकर ग्रिड बिजली निर्भरता घटाएं'
              : 'Power AVWCS Terminal Exhausters With Rooftop Solar Panels'}
          </h2>
        </div>

        {/* Preset buttons */}
        <div className="flex flex-wrap gap-1.5">
          {[
            { pct: 0, en: '0% Grid Only', hi: '0% केवल ग्रिड' },
            { pct: 50, en: '50% Solar Hybrid', hi: '50% सोलर हाइब्रिड' },
            { pct: 80, en: '80% Solar + Biogas', hi: '80% सोलर + बायोगैस' },
          ].map((preset) => (
            <button
              key={preset.pct}
              type="button"
              onClick={() => setSolarPct(preset.pct)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${
                solarPct === preset.pct
                  ? 'bg-amber-600 text-white border-amber-600'
                  : 'bg-white text-slate-700 border-amber-200 hover:bg-amber-50'
              }`}
            >
              {isHi ? preset.hi : preset.en}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
        {/* Interactive SVG Solar → Terminal Animation */}
        <div className="lg:col-span-7">
          <svg viewBox="0 0 440 205" className="w-full h-auto rounded-xl bg-white border border-amber-100" aria-label="Solar powered AVWCS terminal diagram">
            {/* Sun */}
            <motion.g
              animate={solarPct > 0 ? { scale: [1, 1.08, 1] } : { scale: 1 }}
              transition={{ duration: 2.2, repeat: Infinity }}
              style={{ transformOrigin: '60px 42px' }}
            >
              <circle cx="60" cy="42" r="20" fill={solarPct > 0 ? '#F59E0B' : '#CBD5E1'} />
              <text x="60" y="45.5" textAnchor="middle" fontSize="9.5" fill="#FFFFFF" fontWeight="700">
                {solarPct > 0 ? 'SUN PV' : 'OFF'}
              </text>
            </motion.g>

            {/* Solar Rays (only bright when solarPct > 0) */}
            {solarPct > 0 && [0, 1, 2].map((i) => (
              <motion.line
                key={i}
                x1={78 + i * 6}
                y1={50 - i * 4}
                x2={132 + i * 18}
                y2={82}
                stroke="#F59E0B"
                strokeWidth="2.5"
                strokeDasharray="6 6"
                animate={{ strokeDashoffset: [24, 0] }}
                transition={{ duration: 1.1, repeat: Infinity, ease: 'linear' }}
              />
            ))}

            {/* Rooftop Solar Panel Array */}
            <polygon points="116,95 214,95 198,74 132,74" fill={solarPct > 0 ? '#0369A1' : '#94A3B8'} stroke="#BAE6FD" strokeWidth="1.5" />
            <line x1="150" y1="74" x2="146" y2="95" stroke="#BAE6FD" strokeWidth="1" />
            <line x1="176" y1="74" x2="178" y2="95" stroke="#BAE6FD" strokeWidth="1" />
            <text x="165" y="109" textAnchor="middle" fontSize="8.5" fill="#0369A1" fontWeight="700">
              {isHi ? `रूफटॉप सोलर पैनल (${solarPct}%)` : `Terminal Rooftop Solar (${solarPct}%)`}
            </text>

            {/* Energy Flow Pipe from Solar Panel to Terminal Fan */}
            <path d="M 165 113 L 165 142 L 246 142" fill="none" stroke={solarPct > 0 ? '#16A34A' : '#CBD5E1'} strokeWidth="4" strokeLinecap="round" />
            {solarPct > 0 && (
              <motion.circle
                cx="168"
                cy="142"
                r="4"
                fill="#22C55E"
                animate={{ x: [0, 76], opacity: [1, 1, 0] }}
                transition={{ duration: Math.max(0.7, 1.8 - solarPct / 100), repeat: Infinity, ease: 'linear' }}
              />
            )}

            {/* Grid Backup line */}
            <path d="M 60 172 L 246 172 L 246 156" fill="none" stroke={gridPct > 0 ? '#EA580C' : '#CBD5E1'} strokeWidth="3" strokeDasharray="5 4" />
            <text x="60" y="164" fontSize="8.5" fill={gridPct > 0 ? '#C2410C' : '#94A3B8'} fontWeight="700">
              ⚡ {isHi ? `ग्रिड बैकअप (${gridPct}%)` : `Grid Backup (${gridPct}%)`}
            </text>

            {/* Terminal Box + Spinning Vacuum Exhauster */}
            <rect x="246" y="110" width="174" height="72" rx="10" fill="#1E3A5F" />
            <text x="333" y="128" textAnchor="middle" fontSize="9.5" fill="#FFFFFF" fontWeight="700">
              {isHi ? 'वैक्यूम एग्ज़ॉस्टर टर्मिनल' : 'Vacuum Exhauster Terminal'}
            </text>
            {/* Spinning Fan */}
            <motion.g
              animate={{ rotate: 360 }}
              transition={{ duration: 1.6, repeat: Infinity, ease: 'linear' }}
              style={{ transformOrigin: '280px 154px' }}
            >
              <circle cx="280" cy="154" r="14" fill="#EA580C" />
              <line x1="268" y1="154" x2="292" y2="154" stroke="#FFFFFF" strokeWidth="2.5" />
              <line x1="280" y1="142" x2="280" y2="166" stroke="#FFFFFF" strokeWidth="2.5" />
            </motion.g>
            <text x="352" y="150" textAnchor="middle" fontSize="8.5" fill="#86EFAC" fontWeight="700">
              {isHi ? '0% गली डीज़ल' : '0% Street Diesel'}
            </text>
            <text x="352" y="163" textAnchor="middle" fontSize="7.5" fill="#CBD5E1">
              {isHi ? 'तय समय पर सोलर चक्र' : 'Timed daytime suction batches'}
            </text>
          </svg>
        </div>

        {/* Live Slider + Bars Comparison */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-xl border border-amber-200 p-4 space-y-2.5">
            <div className="flex items-center justify-between text-xs font-bold">
              <label htmlFor="compare-solar-slider" className="text-slate-700 cursor-pointer flex items-center gap-1.5">
                <Zap size={14} className="text-amber-500" />
                {isHi ? 'सोलर पैनल से बिजली हिस्सा:' : 'Solar PV Share at Terminal:'}
              </label>
              <span className="text-sm font-extrabold text-amber-700 tabular-nums">{solarPct}%</span>
            </div>
            <input
              id="compare-solar-slider"
              type="range"
              min={0}
              max={100}
              step={5}
              value={solarPct}
              onChange={(e) => setSolarPct(Number(e.target.value))}
              className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-amber-100"
              style={{ accentColor: '#16A34A' }}
            />
          </div>

          {/* Comparative Energy Meters */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3">
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-700">{isHi ? 'AVWCS शुद्ध ग्रिड बिजली लोड' : 'AVWCS Net Grid Electricity Needed'}</span>
                <span className="tabular-nums font-bold text-orange-600">{gridPct}%</span>
              </div>
              <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-orange-500"
                  animate={{ width: `${gridPct}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-700 flex items-center gap-1">
                  <Fuel size={12} className="text-red-500" />
                  {isHi ? 'ट्रक प्रणाली: गली में रोज़ डीज़ल धुआँ' : 'Truck System: Street Fossil Diesel Exhaust'}
                </span>
                <span className="font-bold text-red-600">100%</span>
              </div>
              <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full w-full rounded-full bg-red-500" />
              </div>
            </div>

            <p className="text-[11px] text-slate-600 leading-relaxed pt-1">
              {isHi
                ? 'क्योंकि च्यूट कचरे को रोककर रखते हैं, वैक्यूम पंखे दिन में सोलर बिजली के पीक समय पर चलाए जा सकते हैं — और गीले कचरे से बनी बायोगैस भी जोड़ सकते हैं।'
                : 'Because storage chutes buffer waste, suction cycles can prioritize peak daytime solar generation — plus optional terminal biogas.'}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
