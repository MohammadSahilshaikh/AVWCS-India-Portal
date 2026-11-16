'use client'
import { useState, useRef, useEffect } from 'react'
import { useLang } from './LangContext'

type TagType = 'source' | 'assumption' | 'literature'

const interactiveStyles: Record<TagType, string> = {
  source: 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100',
  assumption: 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100',
  literature: 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100',
}

const staticStyles: Record<TagType, string> = {
  source: 'bg-blue-50 text-blue-700 border-blue-200',
  assumption: 'bg-amber-50 text-amber-700 border-amber-200',
  literature: 'bg-purple-50 text-purple-700 border-purple-200',
}

const labels: Record<TagType, string> = {
  source: '📄',
  assumption: '⚠️',
  literature: '📚',
}

interface SourceTagProps {
  type: TagType
  text: string
  detail?: string
}

export default function SourceTag({ type, text, detail }: SourceTagProps) {
  const [open, setOpen] = useState(false)
  const [leftOffset, setLeftOffset] = useState(0)
  const wrapRef = useRef<HTMLSpanElement>(null)
  const { lang } = useLang()

  useEffect(() => {
    if (!open || !wrapRef.current) return
    const updatePosition = () => {
      if (!wrapRef.current) return
      const rect = wrapRef.current.getBoundingClientRect()
      const vw = window.innerWidth
      const popWidth = Math.min(vw >= 640 ? 288 : 256, vw - 32)
      const minLeft = 16 - rect.left
      const maxLeft = vw - 16 - popWidth - rect.left
      setLeftOffset(Math.min(Math.max(0, minLeft), maxLeft))
    }
    updatePosition()
    window.addEventListener('resize', updatePosition)
    return () => window.removeEventListener('resize', updatePosition)
  }, [open])

  if (!detail) {
    return (
      <span className="inline-block relative mt-1">
        <span
          className={`inline-block text-xs px-2 py-0.5 rounded-full border font-medium ${staticStyles[type]}`}
        >
          {labels[type]} {text}
        </span>
      </span>
    )
  }

  return (
    <span ref={wrapRef} className="inline-block relative mt-1">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
        className={`text-xs px-2 py-0.5 rounded-full border font-medium transition-colors cursor-pointer ${interactiveStyles[type]}`}
        title={detail}
      >
        {labels[type]} {text}
      </button>
      {open && (
        <span
          style={{ left: `${leftOffset}px` }}
          className="absolute bottom-full mb-2 w-64 sm:w-72 max-w-[calc(100vw-2rem)] bg-white shadow-xl rounded-xl p-3 text-xs text-gray-700 border border-gray-200 z-50 leading-relaxed text-left"
        >
          {detail}
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="block mt-2 text-gray-400 hover:text-gray-600 cursor-pointer"
          >
            {lang === 'hi' ? '✕ बंद करें' : '✕ close'}
          </button>
        </span>
      )}
    </span>
  )
}
