'use client'
import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { MotionConfig } from 'framer-motion'

type Lang = 'en' | 'hi'
interface LangCtx { lang: Lang; toggle: () => void }

const LangContext = createContext<LangCtx>({ lang: 'en', toggle: () => {} })

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>('en')

  useEffect(() => {
    document.body.classList.toggle('lang-hi', lang === 'hi')
    document.documentElement.lang = lang
  }, [lang])

  return (
    <LangContext.Provider value={{ lang, toggle: () => setLang(l => l === 'en' ? 'hi' : 'en') }}>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LangContext.Provider>
  )
}

export function useLang() { return useContext(LangContext) }
