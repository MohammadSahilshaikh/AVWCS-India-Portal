import Link from 'next/link'
import T from '@/components/ui/T'
import teamData from '@/data/team.json'

const ROLE_COLORS: Record<string, string> = {
  'Lead Developer & Student Researcher': 'bg-blue-100 text-blue-700',
  'Lead Student Researcher': 'bg-blue-100 text-blue-700',
  'Academic Advisor / Faculty Mentor': 'bg-green-100 text-green-700',
  'Faculty Advisor / Guide': 'bg-green-100 text-green-700',
}

function getRoleClass(roleEn: string): string {
  return ROLE_COLORS[roleEn] ?? 'bg-slate-100 text-slate-600'
}

function formatDisplayName(
  raw: string,
  roleText: string,
  lang: 'en' | 'hi'
): string {
  const trimmed = raw.trim()
  if (!trimmed.includes('[') && !trimmed.includes(']')) {
    return trimmed
  }
  const stripped = trimmed
    .replace(/[\[\]]/g, '')
    .replace(/\s*[—–-]\s*Edit in data\/team\.json/i, '')
    .replace(/\s*[—–-]\s*data\/team\.json में बदलें/i, '')
    .trim()

  if (/your name|आपका नाम/i.test(stripped)) {
    return lang === 'hi'
      ? 'शोध छात्र — IIT अध्ययन दल'
      : 'Research Scholar — IIT Study Team'
  }
  if (/faculty guide name|गाइड का नाम/i.test(stripped)) {
    return lang === 'hi'
      ? 'फैकल्टी मार्गदर्शक — सिविल एवं पर्यावरण समूह'
      : 'Faculty Advisor — Civil & Environmental Group'
  }
  return stripped || roleText
}

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 space-y-14">
      {/* Heading */}
      <div className="text-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: 'var(--brand-navy)' }}>
          <T en="About This Project" hi="इस प्रोजेक्ट के बारे में" />
        </h1>
        <p className="text-slate-600 text-lg max-w-2xl mx-auto leading-relaxed">
          <T
            en="This feasibility study was developed as part of an infrastructure research project at IIT, examining the technical, economic and policy feasibility of Automated Vacuum Waste Collection Systems for Indian urban conditions."
            hi="यह फ़ीज़िबिलिटी अध्ययन IIT के एक अवसंरचना शोध प्रोजेक्ट के रूप में विकसित किया गया है, जिसमें भारतीय शहरी परिस्थितियों के लिए स्वचालित वैक्यूम कचरा संग्रह प्रणाली की तकनीकी, आर्थिक और नीतिगत व्यवहार्यता की जांच की गई है।"
          />
        </p>
      </div>

      {/* Team cards */}
      <div>
        <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--brand-navy)' }}>
          <T en="Project Team" hi="प्रोजेक्ट टीम" />
        </h2>
        <div className="grid gap-5 md:grid-cols-2">
          {teamData.members.map((member, i) => {
            const displayEn = formatDisplayName(member.name.en, member.role.en, 'en')
            const displayHi = formatDisplayName(member.name.hi, member.role.hi, 'hi')
            return (
              <div
                key={i}
                className="bg-white shadow-sm rounded-2xl p-6 border border-gray-100 space-y-3"
              >
                <span
                  className={`inline-block text-xs font-semibold px-3 py-1 rounded-full ${getRoleClass(member.role.en)}`}
                >
                  <T en={member.role.en} hi={member.role.hi} />
                </span>
                <div
                  className="text-xl font-bold"
                  style={{ color: 'var(--brand-navy)' }}
                >
                  <T en={displayEn} hi={displayHi} />
                </div>
                <p className="text-slate-600 text-sm leading-relaxed">
                  <T en={member.focus.en} hi={member.focus.hi} />
                </p>
              </div>
            )
          })}
        </div>
      </div>

      {/* Project info */}
      <div className="bg-slate-50 rounded-2xl p-6 sm:p-8 space-y-4 border border-gray-100">
        <h2 className="text-xl font-bold" style={{ color: 'var(--brand-navy)' }}>
          <T en="Project Information" hi="प्रोजेक्ट जानकारी" />
        </h2>
        <div className="space-y-2 text-slate-600">
          <div>
            <span className="font-semibold text-slate-700">
              <T en="Project: " hi="प्रोजेक्ट: " />
            </span>
            <T en={teamData.projectTitle.en} hi={teamData.projectTitle.hi} />
          </div>
          <div>
            <span className="font-semibold text-slate-700">
              <T en="Institution: " hi="संस्था: " />
            </span>
            <T en={teamData.institution.en} hi={teamData.institution.hi} />
          </div>
          <div>
            <span className="font-semibold text-slate-700">
              <T en="Lead Developer: " hi="प्रमुख डेवलपर: " />
            </span>
            <span className="font-medium text-slate-800">Mohammad Sahil Shaikh</span>
          </div>
          <div>
            <span className="font-semibold text-slate-700">
              <T en="Email: " hi="ईमेल: " />
            </span>
            <a
              href={`mailto:${teamData.contactEmail}`}
              className="underline font-medium break-all"
              style={{ color: 'var(--brand-green)' }}
            >
              {teamData.contactEmail}
            </a>
          </div>
          <div>
            <span className="font-semibold text-slate-700">
              <T en="Contact Number: " hi="संपर्क नंबर: " />
            </span>
            <a
              href="tel:+919263602455"
              className="underline font-medium text-blue-600 hover:text-blue-800"
            >
              +91 9263602455
            </a>
          </div>
        </div>
      </div>

      {/* Quick links */}
      <div className="flex flex-wrap items-center justify-center gap-4">
        <Link
          href="/paper"
          className="px-5 py-2.5 rounded-xl border border-gray-200 bg-white text-sm font-semibold shadow-sm hover:shadow transition-shadow"
          style={{ color: 'var(--brand-navy)' }}
        >
          <T en="Read Research Paper →" hi="शोध पत्र पढ़ें →" />
        </Link>
        <Link
          href="/contact"
          className="px-5 py-2.5 rounded-xl text-white text-sm font-semibold shadow-sm transition-opacity hover:opacity-90"
          style={{ backgroundColor: 'var(--brand-orange)' }}
        >
          <T en="Contact & Collaboration →" hi="संपर्क एवं सहयोग →" />
        </Link>
      </div>

      {/* Tech credits */}
      <div className="text-center text-slate-500 text-sm border-t border-gray-200 pt-8">
        <T
          en="Website built with Next.js, Tailwind CSS, Framer Motion, Recharts. Source data from published literature and SWM Rules 2026."
          hi="वेबसाइट Next.js, Tailwind CSS, Framer Motion, Recharts से बनी है। डेटा प्रकाशित साहित्य और SWM नियम 2026 से।"
        />
      </div>
    </div>
  )
}
