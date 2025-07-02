'use client'

import { useState } from 'react'
import { Volume2, VolumeX } from 'lucide-react'

interface TextToSpeechProps {
  text: string
  autoPlay?: boolean
}

export default function TextToSpeech({ text, autoPlay = false }: TextToSpeechProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isSupported, setIsSupported] = useState(typeof window !== 'undefined' && 'speechSynthesis' in window)

  const speak = () => {
    if (!isSupported || isPlaying) return

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'ja-JP'
    utterance.rate = 0.8 // 少しゆっくり話す
    utterance.pitch = 1
    utterance.volume = 1

    utterance.onstart = () => setIsPlaying(true)
    utterance.onend = () => setIsPlaying(false)
    utterance.onerror = () => setIsPlaying(false)

    // 既存の音声を停止
    speechSynthesis.cancel()
    speechSynthesis.speak(utterance)
  }

  const stop = () => {
    speechSynthesis.cancel()
    setIsPlaying(false)
  }

  if (!isSupported) {
    return null
  }

  return (
    <button
      onClick={isPlaying ? stop : speak}
      className="text-primary-600 hover:text-primary-700 p-1 rounded"
      title={isPlaying ? '停止' : '読み上げ'}
    >
      {isPlaying ? (
        <VolumeX className="w-4 h-4" />
      ) : (
        <Volume2 className="w-4 h-4" />
      )}
    </button>
  )
} 