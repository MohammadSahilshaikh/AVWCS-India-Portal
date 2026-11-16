'use client'
import { useLang } from './LangContext'

export default function T({ en, hi }: { en: string; hi: string }) {
  const { lang } = useLang()
  return <>{lang === 'hi' ? hi : en}</>
}
