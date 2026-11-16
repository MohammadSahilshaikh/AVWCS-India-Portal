'use client'

import { useState, FormEvent } from 'react'
import Link from 'next/link'
import { useLang } from '@/components/ui/LangContext'
import T from '@/components/ui/T'
import { Mail, AlertCircle, Loader2, CheckCircle2, Send } from 'lucide-react'
import emailjs from '@emailjs/browser'

const MESSAGE_TYPES = [
  { value: 'General enquiry', en: 'General enquiry', hi: 'सामान्य पूछताछ' },
  { value: 'Pilot collaboration interest', en: 'Pilot collaboration interest', hi: 'पायलट सहयोग में रुचि' },
  { value: 'Research feedback', en: 'Research feedback', hi: 'शोध पर प्रतिक्रिया' },
  { value: 'Media / press', en: 'Media / press', hi: 'मीडिया / प्रेस' },
]

export default function ContactPage() {
  const { lang } = useLang()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [org, setOrg] = useState('')
  const [msgType, setMsgType] = useState(MESSAGE_TYPES[0].value)
  const [message, setMessage] = useState('')
  const [consent, setConsent] = useState(false)
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submittedNotice, setSubmittedNotice] = useState(false)

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    setSubmittedNotice(false)

    const trimmedName = name.trim()
    const trimmedEmail = email.trim()
    const trimmedMsg = message.trim()
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)

    if (!trimmedName || !emailOk || trimmedMsg.length < 10 || !consent) {
      setError(
        lang === 'hi'
          ? 'कृपया मान्य नाम, सही ईमेल, कम से कम 10 अक्षरों का संदेश और गोपनीयता सहमति चेकबॉक्स चुनें।'
          : 'Please enter your name, a valid email, a message (min 10 characters), and check the consent box.'
      )
      return
    }

    setIsSubmitting(true)

    const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || 'service_8ln5mu9'
    const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || 'template_ihpt477'
    const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || 'GIbeIviQo1ehc1gxX'

    try {
      const templateParams = {
        name: trimmedName,
        from_name: trimmedName,
        user_name: trimmedName,
        email: trimmedEmail,
        from_email: trimmedEmail,
        user_email: trimmedEmail,
        reply_to: trimmedEmail,
        organization: org.trim() || 'N/A',
        message_type: msgType,
        message: trimmedMsg,
        subject: `[AVWCS Enquiry] ${msgType} — ${trimmedName}`,
      }

      await emailjs.send(serviceId, templateId, templateParams, publicKey)

      setSubmittedNotice(true)
      setName('')
      setEmail('')
      setOrg('')
      setMessage('')
      setConsent(false)
    } catch (err: unknown) {
      console.error('EmailJS send error:', err)
      const errMsg =
        err && typeof err === 'object' && 'text' in err
          ? String((err as { text: unknown }).text)
          : ''
      setError(
        lang === 'hi'
          ? `संदेश भेजने में त्रुटि हुई। कृपया पुनः प्रयास करें${errMsg ? ` (${errMsg})` : ''} या सीधे ईमेल करें।`
          : `Failed to send enquiry. Please try again${errMsg ? ` (${errMsg})` : ''} or email us directly.`
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-16 space-y-12">
      {/* Heading */}
      <div className="text-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-3" style={{ color: 'var(--brand-navy)' }}>
          <T en="Contact & Collaboration" hi="संपर्क और सहयोग" />
        </h1>
        <p className="text-slate-500 text-lg">
          <T
            en="Interested in a pilot? Have feedback on the research? Get in touch."
            hi="पायलट में रुचि है? शोध पर फीडबैक? संपर्क करें।"
          />
        </p>
      </div>

      {/* Email card */}
      <a
        href="mailto:avwcs-feasibility@example.edu.in"
        className="flex items-center gap-4 p-5 rounded-2xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow"
      >
        <span
          className="p-3 rounded-xl shrink-0"
          style={{ backgroundColor: 'var(--brand-navy)', color: '#fff' }}
        >
          <Mail size={20} />
        </span>
        <div className="min-w-0">
          <div className="text-xs text-slate-400 font-medium uppercase tracking-wide">
            <T en="Email" hi="ईमेल" />
          </div>
          <div className="font-semibold break-all" style={{ color: 'var(--brand-navy)' }}>
            avwcs-feasibility@example.edu.in
          </div>
        </div>
      </a>

      {/* Contact form */}
      <form
        onSubmit={handleSubmit}
        noValidate
        className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 sm:p-8 space-y-5"
      >
        {error && (
          <div role="alert" className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3.5 text-sm text-red-800">
            <AlertCircle size={17} className="shrink-0 mt-0.5 text-red-600" />
            <span>{error}</span>
          </div>
        )}

        {submittedNotice && (
          <div role="status" className="flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-900">
            <CheckCircle2 size={18} className="shrink-0 mt-0.5 text-green-600" />
            <div className="space-y-1">
              <p className="font-semibold text-green-950">
                <T
                  en="Message sent successfully via EmailJS!"
                  hi="संदेश EmailJS के माध्यम से सफलतापूर्वक भेजा गया!"
                />
              </p>
              <p className="text-xs text-green-800">
                <T
                  en="Thank you for reaching out. We have received your message and will respond within 5 working days."
                  hi="संपर्क करने के लिए धन्यवाद। हमें आपका संदेश प्राप्त हो गया है और हम 5 कार्य दिवसों में उत्तर देंगे।"
                />
              </p>
            </div>
          </div>
        )}

        {/* Name */}
        <div className="space-y-1.5">
          <label htmlFor="contact-name" className="block text-sm font-semibold text-slate-700">
            <T en="Name" hi="नाम" /> <span className="text-red-500">*</span>
          </label>
          <input
            id="contact-name"
            type="text"
            name="name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-300"
            placeholder={lang === 'hi' ? 'आपका नाम' : 'Your name'}
          />
        </div>

        {/* Email */}
        <div className="space-y-1.5">
          <label htmlFor="contact-email" className="block text-sm font-semibold text-slate-700">
            <T en="Email" hi="ईमेल" /> <span className="text-red-500">*</span>
          </label>
          <input
            id="contact-email"
            type="email"
            name="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-300"
            placeholder={lang === 'hi' ? 'आपका ईमेल' : 'your@email.com'}
          />
        </div>

        {/* Organization */}
        <div className="space-y-1.5">
          <label htmlFor="contact-org" className="block text-sm font-semibold text-slate-700">
            <T en="Organization" hi="संगठन" />
          </label>
          <input
            id="contact-org"
            type="text"
            name="organization"
            value={org}
            onChange={(e) => setOrg(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-300"
            placeholder={lang === 'hi' ? 'आपका संगठन (वैकल्पिक)' : 'Your organization (optional)'}
          />
        </div>

        {/* Message type */}
        <div className="space-y-1.5">
          <label htmlFor="contact-type" className="block text-sm font-semibold text-slate-700">
            <T en="Message Type" hi="संदेश का प्रकार" />
          </label>
          <select
            id="contact-type"
            name="message_type"
            value={msgType}
            onChange={(e) => setMsgType(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            {MESSAGE_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {lang === 'hi' ? t.hi : t.en}
              </option>
            ))}
          </select>
        </div>

        {/* Message */}
        <div className="space-y-1.5">
          <label htmlFor="contact-message" className="block text-sm font-semibold text-slate-700">
            <T en="Message" hi="संदेश" /> <span className="text-red-500">*</span>
          </label>
          <textarea
            id="contact-message"
            name="message"
            required
            rows={5}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-300 resize-none"
            placeholder={lang === 'hi' ? 'अपना संदेश यहाँ लिखें…' : 'Write your message here…'}
          />
        </div>

        {/* Consent & Privacy Field (SRS FR-014 & §13) */}
        <label htmlFor="contact-consent" className="flex items-start gap-2.5 text-xs text-slate-600 cursor-pointer bg-slate-50 border border-slate-200 rounded-xl p-3">
          <input
            id="contact-consent"
            type="checkbox"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            className="mt-0.5 h-4 w-4 accent-[#EA580C] cursor-pointer"
          />
          <span>
            <T
              en="I consent to using these details solely to reply to my enquiry. This portal stores zero personal data on a database."
              hi="मैं सहमत हूँ कि इन विवरणों का उपयोग केवल मेरी पूछताछ का उत्तर देने के लिए किया जाएगा। यह पोर्टल कोई व्यक्तिगत डेटा सर्वर पर सहेजता नहीं है।"
            />
          </span>
        </label>

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3.5 rounded-xl text-white font-semibold text-base transition-all hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer shadow-sm hover:shadow"
          style={{ backgroundColor: 'var(--brand-orange)' }}
        >
          {isSubmitting ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              <T en="Sending Message…" hi="संदेश भेजा जा रहा है…" />
            </>
          ) : (
            <>
              <Send size={18} />
              <T en="Send Message" hi="संदेश भेजें" />
            </>
          )}
        </button>

        {/* Note */}
        <p className="text-center text-sm text-slate-500">
          <T
            en="We aim to respond within 5 working days."
            hi="हम 5 कार्यदिवसों में जवाब देने का प्रयास करते हैं।"
          />
        </p>
      </form>

      {/* Quick links */}
      <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
        <Link
          href="/about"
          className="px-4 py-2 rounded-xl border border-gray-200 bg-white font-semibold shadow-sm hover:shadow transition-shadow"
          style={{ color: 'var(--brand-navy)' }}
        >
          <T en="About the Research Team →" hi="शोध टीम के बारे में →" />
        </Link>
        <Link
          href="/faq"
          className="px-4 py-2 rounded-xl border border-gray-200 bg-white font-semibold shadow-sm hover:shadow transition-shadow"
          style={{ color: 'var(--brand-navy)' }}
        >
          <T en="Frequently Asked Questions →" hi="अक्सर पूछे जाने वाले सवाल →" />
        </Link>
      </div>
    </div>
  )
}
