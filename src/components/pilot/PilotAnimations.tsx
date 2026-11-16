'use client'
import { motion, AnimatePresence } from 'framer-motion'

type Lang = 'en' | 'hi'

/* ── 1. Hero Animated Process Strip ───────────────────────────────────────── */
export function HeroFlowStrip({ lang }: { lang: Lang }) {
  const nodes = [
    { icon: '🌱', en: 'Greenfield Site', hi: 'ग्रीनफील्ड साइट', color: '#16A34A' },
    { icon: '📐', en: '27-Mo Roadmap', hi: '27-माह रोडमैप', color: '#EA580C' },
    { icon: '📊', en: '12-Mo Audit', hi: '12-माह ऑडिट', color: '#1E3A5F' },
    { icon: '🏙️', en: 'City Scale-Up', hi: 'शहर विस्तार', color: '#16A34A' },
  ]

  return (
    <div className="relative bg-white border border-gray-200 rounded-2xl p-4 sm:p-5 shadow-sm overflow-hidden">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 relative z-10">
        {nodes.map((n, i) => (
          <motion.div
            key={i}
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="flex items-center gap-2.5 bg-slate-50/90 border border-slate-200 rounded-xl px-3 py-2.5 relative"
          >
            <motion.span
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ duration: 2.4, repeat: Infinity, delay: i * 0.6 }}
              className="text-xl shrink-0"
            >
              {n.icon}
            </motion.span>
            <span className="text-xs sm:text-sm font-bold leading-tight" style={{ color: n.color }}>
              {lang === 'hi' ? n.hi : n.en}
            </span>
            {i < nodes.length - 1 && (
              <motion.span
                aria-hidden="true"
                animate={{ x: [0, 4, 0], opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.4 }}
                className="hidden sm:inline-block absolute -right-2.5 top-1/2 -translate-y-1/2 text-orange-500 font-bold text-sm z-20"
              >
                →
              </motion.span>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  )
}

/* ── 2. Greenfield vs Old City Animated Split-Screen SVG ──────────────────── */
export function GreenfieldVsOldVisual({
  lang,
  mode,
}: {
  lang: Lang
  mode: 'greenfield' | 'old'
}) {
  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        {mode === 'greenfield' ? (
          <motion.svg
            key="greenfield"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.3 }}
            viewBox="0 0 640 270"
            className="w-full h-auto rounded-xl bg-gradient-to-b from-sky-50 via-emerald-50/40 to-amber-50/70 border border-green-200"
            role="img"
            aria-label={lang === 'hi' ? 'ग्रीनफील्ड सह-खुदाई एनीमेशन' : 'Greenfield co-trenching animation'}
          >
            {/* Sky & Sun */}
            <motion.circle
              cx="575"
              cy="42"
              r="20"
              fill="#FBBF24"
              animate={{ scale: [1, 1.08, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
            {/* Rising Township Buildings */}
            <motion.rect
              x="55"
              y="46"
              width="75"
              height="84"
              rx="6"
              fill="#1E3A5F"
              initial={{ scaleY: 0.3 }}
              animate={{ scaleY: 1 }}
              transition={{ duration: 0.7 }}
              style={{ transformOrigin: '92px 130px' }}
            />
            <rect x="68" y="60" width="16" height="14" rx="2" fill="#93C5FD" />
            <rect x="98" y="60" width="16" height="14" rx="2" fill="#93C5FD" />
            <rect x="68" y="85" width="16" height="14" rx="2" fill="#93C5FD" />
            <rect x="98" y="85" width="16" height="14" rx="2" fill="#93C5FD" />

            <motion.rect
              x="160"
              y="32"
              width="90"
              height="98"
              rx="6"
              fill="#2B4C7E"
              initial={{ scaleY: 0.3 }}
              animate={{ scaleY: 1 }}
              transition={{ duration: 0.85 }}
              style={{ transformOrigin: '205px 130px' }}
            />
            <rect x="175" y="48" width="18" height="15" rx="2" fill="#BFDBFE" />
            <rect x="212" y="48" width="18" height="15" rx="2" fill="#BFDBFE" />
            <rect x="175" y="75" width="18" height="15" rx="2" fill="#BFDBFE" />
            <rect x="212" y="75" width="18" height="15" rx="2" fill="#BFDBFE" />

            {/* Clean Street + Zero Trucks Badge */}
            <rect x="0" y="130" width="640" height="14" fill="#16A34A" opacity="0.22" />
            <line x1="0" y1="130" x2="640" y2="130" stroke="#16A34A" strokeWidth="3" />

            {/* Street Inlet popping cleanly */}
            <motion.g
              initial={{ y: -12, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.35, duration: 0.5 }}
            >
              <rect x="295" y="102" width="36" height="28" rx="5" fill="#16A34A" />
              <circle cx="313" cy="116" r="5" fill="white" />
              <text x="313" y="95" textAnchor="middle" fontSize="11" fontWeight="700" fill="#15803D">
                {lang === 'hi' ? 'इनलेट' : 'Inlet'}
              </text>
            </motion.g>

            {/* Open Shared Trench */}
            <rect x="35" y="144" width="570" height="106" rx="10" fill="#FDE68A" opacity="0.45" stroke="#D97706" strokeDasharray="5 4" />
            <text x="52" y="164" fontSize="12" fontWeight="700" fill="#92400E">
              {lang === 'hi' ? 'एक ही खुदाई में तीनों लाइनें साथ बिछती हैं' : 'ONE Shared Trench During Construction'}
            </text>

            {/* 1. Water Pipe dropping in */}
            <motion.g
              initial={{ y: -22, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <rect x="60" y="176" width="490" height="12" rx="6" fill="#2563EB" />
              <text x="560" y="186" fontSize="11" fontWeight="700" fill="#1D4ED8">
                {lang === 'hi' ? '💧 पानी' : '💧 Water'}
              </text>
            </motion.g>

            {/* 2. Sewer Pipe dropping in */}
            <motion.g
              initial={{ y: -22, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <rect x="60" y="198" width="490" height="12" rx="6" fill="#64748B" />
              <text x="560" y="208" fontSize="11" fontWeight="700" fill="#475569">
                {lang === 'hi' ? '🚰 सीवर' : '🚰 Sewer'}
              </text>
            </motion.g>

            {/* 3. AVWCS Pipe dropping in + glowing flow */}
            <motion.g
              initial={{ y: -22, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              <rect x="60" y="220" width="490" height="16" rx="8" fill="#1E3A5F" />
              <motion.circle
                cx="90"
                cy="228"
                r="5"
                fill="#EA580C"
                animate={{ cx: [85, 530] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
              />
              <text x="560" y="232" fontSize="11" fontWeight="700" fill="#EA580C">
                AVWCS
              </text>
            </motion.g>

            {/* Green Check Badge */}
            <rect x="355" y="48" width="185" height="58" rx="12" fill="#DCFCE7" stroke="#16A34A" strokeWidth="2" />
            <text x="447" y="72" textAnchor="middle" fontSize="13" fontWeight="800" fill="#15803D">
              {lang === 'hi' ? '✓ कोई सड़क बाधा नहीं' : '✓ Zero Road Disruption'}
            </text>
            <text x="447" y="92" textAnchor="middle" fontSize="11" fontWeight="600" fill="#166534">
              {lang === 'hi' ? 'लागत व समय की भारी बचत' : 'Lowest Cost · Co-Trenched'}
            </text>
          </motion.svg>
        ) : (
          <motion.svg
            key="old"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.3 }}
            viewBox="0 0 640 270"
            className="w-full h-auto rounded-xl bg-gradient-to-b from-red-50/70 to-amber-50/80 border border-red-200"
            role="img"
            aria-label={lang === 'hi' ? 'पुराने शहर की बाधा एनीमेशन' : 'Old city retrofit challenge animation'}
          >
            {/* Crowded Buildings */}
            <rect x="28" y="38" width="95" height="92" rx="4" fill="#64748B" />
            <rect x="135" y="25" width="85" height="105" rx="4" fill="#475569" />
            <rect x="445" y="35" width="95" height="95" rx="4" fill="#64748B" />
            <rect x="550" y="28" width="65" height="102" rx="4" fill="#475569" />

            {/* Narrow Jammed Lane */}
            <line x1="0" y1="130" x2="640" y2="130" stroke="#DC2626" strokeWidth="3" />
            <motion.g
              animate={{ x: [-4, 4, -4] }}
              transition={{ duration: 1.2, repeat: Infinity }}
            >
              <rect x="255" y="95" width="76" height="32" rx="6" fill="#EF4444" />
              <text x="293" y="115" textAnchor="middle" fontSize="11" fontWeight="700" fill="white">
                {lang === 'hi' ? '🚧 जाम / खुदाई' : '🚧 Traffic Jam'}
              </text>
            </motion.g>

            {/* Tangled Existing Underground Utilities */}
            <rect x="35" y="145" width="570" height="105" rx="10" fill="#FEE2E2" opacity="0.6" stroke="#EF4444" strokeDasharray="5 4" />
            <text x="52" y="165" fontSize="12" fontWeight="700" fill="#991B1B">
              {lang === 'hi' ? 'अज्ञात पुरानी केबल व पाइप (खोदाई बेहद कठिन)' : 'Unmapped Utility Maze Underground'}
            </text>

            {/* Messy crossing lines */}
            <path d="M55 182 Q 200 220, 340 185 T 585 215" stroke="#2563EB" strokeWidth="7" fill="none" opacity="0.8" />
            <path d="M55 225 Q 190 175, 360 225 T 585 180" stroke="#D97706" strokeWidth="6" fill="none" opacity="0.85" />
            <path d="M55 202 L 585 202" stroke="#16A34A" strokeWidth="5" strokeDasharray="8 6" fill="none" />

            {/* Blocked AVWCS Drill Pulse */}
            <motion.circle
              cx="320"
              cy="202"
              r="18"
              fill="#DC2626"
              opacity="0.25"
              animate={{ scale: [1, 1.4, 1], opacity: [0.2, 0.55, 0.2] }}
              transition={{ duration: 1.3, repeat: Infinity }}
            />
            <text x="320" y="207" textAnchor="middle" fontSize="16" fontWeight="900" fill="#B91C1C">
              ✕
            </text>

            {/* Warning Badge */}
            <rect x="235" y="34" width="195" height="52" rx="12" fill="#FEF2F2" stroke="#DC2626" strokeWidth="2" />
            <text x="332" y="56" textAnchor="middle" fontSize="13" fontWeight="800" fill="#B91C1C">
              {lang === 'hi' ? '⚠️ 2–3× अधिक लागत' : '⚠️ 2–3× Retrofit Cost'}
            </text>
            <text x="332" y="74" textAnchor="middle" fontSize="11" fontWeight="600" fill="#991B1B">
              {lang === 'hi' ? 'पहले चरण के लिए अनुपयुक्त' : 'Avoid in Phase 1 Pilot'}
            </text>
          </motion.svg>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ── 3. Animated 5-Phase Visual Stage SVG ─────────────────────────────────── */
export function PhaseVisualStage({ step, lang }: { step: number; lang: Lang }) {
  return (
    <AnimatePresence mode="wait">
      <motion.svg
        key={step}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.28 }}
        viewBox="0 0 560 220"
        className="w-full h-auto rounded-2xl bg-slate-50 border border-gray-200"
        role="img"
        aria-label={`Phase ${step} visual`}
      >
        {step === 1 && (
          <g>
            {/* Phase 1: Feasibility Scan */}
            <rect x="40" y="35" width="190" height="150" rx="12" fill="white" stroke="#CBD5E1" strokeWidth="2" />
            <rect x="60" y="58" width="45" height="45" rx="6" fill="#DBEAFE" />
            <rect x="115" y="58" width="45" height="45" rx="6" fill="#DCFCE7" />
            <rect x="170" y="58" width="40" height="45" rx="6" fill="#FEF3C7" />
            <rect x="60" y="114" width="150" height="18" rx="5" fill="#E2E8F0" />
            <rect x="60" y="142" width="110" height="18" rx="5" fill="#E2E8F0" />
            {/* Scanning Beam */}
            <motion.line
              x1="45"
              x2="225"
              y1="50"
              y2="50"
              stroke="#EA580C"
              strokeWidth="3"
              animate={{ y1: [45, 175, 45], y2: [45, 175, 45] }}
              transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
            />
            {/* Check badges */}
            {[
              { y: 52, en: '📊 Waste Audit', hi: '📊 कचरा ऑडिट' },
              { y: 98, en: '🗺️ Utility & Density Check', hi: '🗺️ घनत्व व लाइन जांच' },
              { y: 144, en: '☀️ Power + Solar Sizing', hi: '☀️ बिजली + सोलर आकलन' },
            ].map((item, idx) => (
              <motion.g
                key={idx}
                initial={{ x: 16, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.15 + idx * 0.2 }}
              >
                <rect x="265" y={item.y} width="255" height="36" rx="10" fill="white" stroke="#EA580C" strokeWidth="1.5" />
                <text x="282" y={item.y + 22} fontSize="13" fontWeight="700" fill="#1E3A5F">
                  {lang === 'hi' ? item.hi : item.en}
                </text>
              </motion.g>
            ))}
          </g>
        )}

        {step === 2 && (
          <g>
            {/* Phase 2: DPR Blueprint Self-Drawing */}
            <rect x="30" y="24" width="500" height="172" rx="14" fill="#1E3A5F" />
            {/* Blueprint grid lines */}
            <line x1="30" y1="80" x2="530" y2="80" stroke="#3B82F6" strokeOpacity="0.2" />
            <line x1="30" y1="140" x2="530" y2="140" stroke="#3B82F6" strokeOpacity="0.2" />
            <line x1="200" y1="24" x2="200" y2="196" stroke="#3B82F6" strokeOpacity="0.2" />
            <line x1="370" y1="24" x2="370" y2="196" stroke="#3B82F6" strokeOpacity="0.2" />

            {/* Drawing pneumatic network paths */}
            <motion.path
              d="M 85 75 L 85 135 L 405 135"
              fill="none"
              stroke="#38BDF8"
              strokeWidth="5"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.4, repeat: Infinity, repeatDelay: 1 }}
            />
            <motion.path
              d="M 225 75 L 225 135"
              fill="none"
              stroke="#4ADE80"
              strokeWidth="5"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1, delay: 0.3, repeat: Infinity, repeatDelay: 1.4 }}
            />
            <circle cx="85" cy="70" r="10" fill="#16A34A" />
            <circle cx="225" cy="70" r="10" fill="#3B82F6" />
            <rect x="405" y="102" width="90" height="58" rx="8" fill="#EA580C" />
            <text x="450" y="135" textAnchor="middle" fontSize="12" fontWeight="700" fill="white">
              {lang === 'hi' ? 'टर्मिनल DPR' : 'Terminal DPR'}
            </text>
            <text x="55" y="176" fontSize="12" fontWeight="600" fill="#BAE6FD">
              {lang === 'hi' ? '📐 मिट्टी सर्वे + पाइप नेटवर्क नक्शे + टेंडर SLA' : '📐 Soil Survey + Network Model + Tender SLA'}
            </text>
          </g>
        )}

        {step === 3 && (
          <g>
            {/* Phase 3: Pilot Construction & Commissioning */}
            <rect x="0" y="110" width="560" height="110" fill="#FEF3C7" opacity="0.55" />
            <line x1="0" y1="110" x2="560" y2="110" stroke="#16A34A" strokeWidth="4" />
            {/* Inlets rising */}
            {[110, 220].map((x, idx) => (
              <motion.g
                key={x}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: idx * 0.25, duration: 0.5 }}
              >
                <rect x={x - 16} y="78" width="32" height="32" rx="6" fill={idx === 0 ? '#16A34A' : '#2563EB'} />
                <rect x={x - 6} y="110" width="12" height="40" fill="#64748B" />
              </motion.g>
            ))}
            {/* Pipe segments sliding together */}
            <motion.rect
              x="95"
              y="148"
              width="140"
              height="16"
              rx="4"
              fill="#1E3A5F"
              initial={{ x: -30 }}
              animate={{ x: 0 }}
              transition={{ duration: 0.8 }}
            />
            <motion.rect
              x="240"
              y="148"
              width="140"
              height="16"
              rx="4"
              fill="#1E3A5F"
              initial={{ x: 30 }}
              animate={{ x: 0 }}
              transition={{ duration: 0.8 }}
            />
            {/* Terminal + Blinking PLC */}
            <rect x="395" y="75" width="125" height="98" rx="12" fill="#EA580C" />
            <text x="457" y="116" textAnchor="middle" fontSize="13" fontWeight="700" fill="white">
              {lang === 'hi' ? 'टर्मिनल + PLC' : 'Terminal + PLC'}
            </text>
            <motion.circle
              cx="457"
              cy="144"
              r="9"
              fill="#4ADE80"
              animate={{ opacity: [0.3, 1, 0.3], scale: [0.9, 1.2, 0.9] }}
              transition={{ duration: 1.2, repeat: Infinity }}
            />
            <text x="45" y="50" fontSize="13" fontWeight="700" fill="#1E3A5F">
              {lang === 'hi' ? '🏗️ पाइप स्थापना + इनलेट + ट्रायल टेस्टिंग' : '🏗️ Trenching + Inlets + PLC Commissioning'}
            </text>
          </g>
        )}

        {step === 4 && (
          <g>
            {/* Phase 4: 12-Month Live Audit */}
            <text x="35" y="42" fontSize="14" fontWeight="800" fill="#1E3A5F">
              {lang === 'hi' ? '📊 12-माह स्वतंत्र प्रदर्शन ऑडिट' : '📊 12-Month Independent Audit'}
            </text>
            {[
              { x: 35, pct: 0.98, color: '#16A34A', val: '98%', en: 'Uptime', hi: 'अपटाइम' },
              { x: 205, pct: 0.85, color: '#2563EB', val: '85%+', en: 'Purity', hi: 'शुद्धता' },
              { x: 375, pct: 0.72, color: '#EA580C', val: '≤100', en: 'kWh/T', hi: 'kWh/टन' },
            ].map((g, idx) => (
              <g key={idx}>
                <rect x={g.x} y="65" width="150" height="125" rx="14" fill="white" stroke="#E2E8F0" strokeWidth="2" />
                <circle cx={g.x + 75} cy="118" r="34" fill="none" stroke="#E2E8F0" strokeWidth="9" />
                <motion.circle
                  cx={g.x + 75}
                  cy="118"
                  r="34"
                  fill="none"
                  stroke={g.color}
                  strokeWidth="9"
                  strokeLinecap="round"
                  strokeDasharray="214"
                  initial={{ strokeDashoffset: 214 }}
                  animate={{ strokeDashoffset: 214 * (1 - g.pct) }}
                  transition={{ duration: 1.1, delay: idx * 0.15 }}
                  transform={`rotate(-90 ${g.x + 75} 118)`}
                />
                <text x={g.x + 75} y="123" textAnchor="middle" fontSize="14" fontWeight="800" fill="#1E3A5F">
                  {g.val}
                </text>
                <text x={g.x + 75} y="176" textAnchor="middle" fontSize="12" fontWeight="700" fill="#475569">
                  {lang === 'hi' ? g.hi : g.en}
                </text>
              </g>
            ))}
          </g>
        )}

        {step === 5 && (
          <g>
            {/* Phase 5: Scale-Up Decision Gate */}
            <rect x="35" y="82" width="120" height="56" rx="12" fill="#1E3A5F" />
            <text x="95" y="114" textAnchor="middle" fontSize="12" fontWeight="700" fill="white">
              {lang === 'hi' ? 'पायलट KPI ✓' : 'Pilot KPIs ✓'}
            </text>

            {/* Gate Diamond */}
            <motion.polygon
              points="250,62 308,110 250,158 192,110"
              fill="#EA580C"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{ transformOrigin: '250px 110px' }}
            />
            <text x="250" y="114" textAnchor="middle" fontSize="12" fontWeight="800" fill="white">
              {lang === 'hi' ? 'सफल?' : 'Pass?'}
            </text>

            {/* Animated branching rays */}
            {[46, 110, 174].map((ty, idx) => (
              <motion.path
                key={ty}
                d={`M 308 110 Q 355 110, 395 ${ty}`}
                fill="none"
                stroke="#16A34A"
                strokeWidth="4"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.9, delay: idx * 0.2, repeat: Infinity, repeatDelay: 1.5 }}
              />
            ))}
            {[
              { y: 26, en: '🏙️ Phase B Township', hi: '🏙️ फेज़ B टाउनशिप' },
              { y: 90, en: '🏥 Medical Zone', hi: '🏥 अस्पताल ज़ोन' },
              { y: 154, en: '✈️ Transit Corridor', hi: '✈️ ट्रांज़िट कॉरिडोर' },
            ].map((dest, idx) => (
              <g key={idx}>
                <rect x="395" y={dest.y} width="142" height="40" rx="10" fill="#DCFCE7" stroke="#16A34A" strokeWidth="2" />
                <text x="466" y={dest.y + 24} textAnchor="middle" fontSize="12" fontWeight="700" fill="#15803D">
                  {lang === 'hi' ? dest.hi : dest.en}
                </text>
              </g>
            ))}
          </g>
        )}
      </motion.svg>
    </AnimatePresence>
  )
}

/* ── 4. Delivery Model Flow Animation SVG ─────────────────────────────────── */
export function DeliveryFlowDiagram({
  lang,
  modelIndex,
}: {
  lang: Lang
  modelIndex: 0 | 1
}) {
  const isPPP = modelIndex === 0

  return (
    <AnimatePresence mode="wait">
      <motion.svg
        key={modelIndex}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        transition={{ duration: 0.25 }}
        viewBox="0 0 640 205"
        className="w-full h-auto rounded-2xl bg-slate-50 border border-gray-200"
        role="img"
        aria-label={isPPP ? 'PPP DBFOT flow' : 'Public CAPEX + O&M flow'}
      >
        {/* Node 1: Government / ULB */}
        <rect x="30" y="55" width="150" height="92" rx="14" fill="#1E3A5F" />
        <text x="105" y="92" textAnchor="middle" fontSize="22">🏛️</text>
        <text x="105" y="118" textAnchor="middle" fontSize="13" fontWeight="700" fill="white">
          {lang === 'hi' ? 'सरकार / ULB' : 'Govt / ULB'}
        </text>
        <text x="105" y="135" textAnchor="middle" fontSize="10" fill="#BFDBFE">
          {isPPP
            ? lang === 'hi' ? 'सेवा शुल्क भुगतान' : 'Pays Service Fee'
            : lang === 'hi' ? '100% स्वामित्व' : '100% Public Owner'}
        </text>

        {/* Node 2: AVWCS Infrastructure */}
        <rect x="245" y="55" width="150" height="92" rx="14" fill="#EA580C" />
        <text x="320" y="92" textAnchor="middle" fontSize="22">⚙️</text>
        <text x="320" y="118" textAnchor="middle" fontSize="13" fontWeight="700" fill="white">
          {lang === 'hi' ? 'AVWCS सिस्टम' : 'AVWCS System'}
        </text>
        <text x="320" y="135" textAnchor="middle" fontSize="10" fill="#FFEDD5">
          {lang === 'hi' ? 'पाइपलाइन + टर्मिनल' : 'Pipes + Terminal'}
        </text>

        {/* Node 3: Private Specialist */}
        <rect x="460" y="55" width="150" height="92" rx="14" fill="#16A34A" />
        <text x="535" y="92" textAnchor="middle" fontSize="22">👷</text>
        <text x="535" y="118" textAnchor="middle" fontSize="13" fontWeight="700" fill="white">
          {lang === 'hi' ? 'निजी विशेषज्ञ' : 'Specialist Firm'}
        </text>
        <text x="535" y="135" textAnchor="middle" fontSize="10" fill="#DCFCE7">
          {isPPP
            ? lang === 'hi' ? 'पूंजी + निर्माण + O&M' : 'Funds + Builds + Runs'
            : lang === 'hi' ? '5–7 वर्ष O&M अनुबंध' : '5–7 Yr O&M Contract'}
        </text>

        {/* Animated Arrows depending on model */}
        {isPPP ? (
          <>
            {/* Private -> System: CAPEX + Build + O&M */}
            <line x1="460" y1="88" x2="398" y2="88" stroke="#16A34A" strokeWidth="4" />
            <motion.circle
              cy="88"
              r="5"
              fill="#15803D"
              animate={{ cx: [455, 402] }}
              transition={{ duration: 1.4, repeat: Infinity }}
            />
            <text x="428" y="42" textAnchor="middle" fontSize="11" fontWeight="700" fill="#15803D">
              {lang === 'hi' ? '₹ पूंजी + निर्माण + O&M' : '₹ CAPEX + Build + O&M'}
            </text>

            {/* Govt -> Private: Annuity over top arc */}
            <path d="M 105 55 Q 320 6, 535 55" fill="none" stroke="#1E3A5F" strokeWidth="2.5" strokeDasharray="5 4" />
            <motion.circle
              r="5"
              fill="#EA580C"
              animate={{ cx: [110, 320, 530], cy: [52, 22, 52] }}
              transition={{ duration: 2.2, repeat: Infinity }}
            />
            <text x="320" y="18" textAnchor="middle" fontSize="11" fontWeight="700" fill="#1E3A5F">
              {lang === 'hi' ? 'तय सेवा शुल्क (Annuity) →' : 'Performance Service Fee →'}
            </text>
            <text x="320" y="180" textAnchor="middle" fontSize="12" fontWeight="700" fill="#15803D">
              {lang === 'hi' ? '🛡️ तकनीकी जोखिम निजी ऑपरेटर पर रहता है' : '🛡️ Technical & O&M Risk Stays on Private Operator'}
            </text>
          </>
        ) : (
          <>
            {/* Govt -> System: CAPEX */}
            <line x1="180" y1="95" x2="242" y2="95" stroke="#1E3A5F" strokeWidth="4" />
            <motion.circle
              cy="95"
              r="5"
              fill="#1E3A5F"
              animate={{ cx: [184, 238] }}
              transition={{ duration: 1.3, repeat: Infinity }}
            />
            <text x="211" y="42" textAnchor="middle" fontSize="11" fontWeight="700" fill="#1E3A5F">
              {lang === 'hi' ? '₹ सरकारी CAPEX' : '₹ Public CAPEX'}
            </text>

            {/* Private -> System: O&M */}
            <line x1="460" y1="95" x2="398" y2="95" stroke="#16A34A" strokeWidth="4" />
            <motion.circle
              cy="95"
              r="5"
              fill="#16A34A"
              animate={{ cx: [456, 402] }}
              transition={{ duration: 1.3, repeat: Infinity }}
            />
            <text x="429" y="42" textAnchor="middle" fontSize="11" fontWeight="700" fill="#15803D">
              {lang === 'hi' ? '🔧 विशेषज्ञ O&M' : '🔧 Specialist O&M'}
            </text>

            <text x="320" y="180" textAnchor="middle" fontSize="12" fontWeight="700" fill="#1E3A5F">
              {lang === 'hi' ? '🏛️ पहले दिन से सरकारी संपत्ति + कम दीर्घकालिक लागत' : '🏛️ Public Asset From Day 1 · Lower Lifecycle Cost'}
            </text>
          </>
        )}
      </motion.svg>
    </AnimatePresence>
  )
}
