'use client'
import { Printer } from 'lucide-react'
import { useLang } from './LangContext'

export default function PrintButton() {
  const { lang } = useLang()
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="no-print flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-colors hover:bg-gray-50"
      style={{ borderColor: 'var(--brand-navy)', color: 'var(--brand-navy)' }}
    >
      <Printer size={16} />
      {lang === 'hi' ? 'प्रिंट / PDF' : 'Print / PDF'}
    </button>
  )
}
