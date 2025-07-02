'use client'

import { useState, useRef, useEffect } from 'react'
import { Mic, MicOff, Square } from 'lucide-react'

interface VoiceRecorderProps {
  onTranscript: (text: string) => void
  isListening: boolean
  onStartListening: () => void
  onStopListening: () => void
  disabled?: boolean
}

export default function VoiceRecorder({
  onTranscript,
  isListening,
  onStartListening,
  onStopListening,
  disabled = false
}: VoiceRecorderProps) {
  const [isSupported, setIsSupported] = useState(false)
  const recognitionRef = useRef<any>(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition
      if (SpeechRecognition) {
        setIsSupported(true)
        recognitionRef.current = new SpeechRecognition()
        recognitionRef.current.continuous = false
        recognitionRef.current.interimResults = false
        recognitionRef.current.lang = 'ja-JP'
        
        recognitionRef.current.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript
          onTranscript(transcript)
        }
        
        recognitionRef.current.onend = () => {
          onStopListening()
        }
        
        recognitionRef.current.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error)
          onStopListening()
        }
      }
    }
  }, [onTranscript, onStopListening])

  const startRecording = () => {
    if (recognitionRef.current && !isListening) {
      try {
        recognitionRef.current.start()
        onStartListening()
      } catch (error) {
        console.error('Failed to start recording:', error)
      }
    }
  }

  const stopRecording = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop()
    }
  }

  if (!isSupported) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
        <p className="text-red-800">
          お使いのブラウザは音声認識に対応していません。<br />
          Chrome、Safari、Edgeなどの対応ブラウザをご利用ください。
        </p>
      </div>
    )
  }

  return (
    <div className="text-center">
      {!isListening ? (
        <button
          onClick={startRecording}
          disabled={disabled}
          className={`btn-primary ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <Mic className="w-6 h-6 inline-block mr-2" />
          話す
        </button>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-center">
            <div className="animate-pulse bg-red-500 rounded-full p-4">
              <Mic className="w-8 h-8 text-white" />
            </div>
          </div>
          <p className="text-large font-medium text-gray-700">聞いています...</p>
          <button
            onClick={stopRecording}
            className="btn-secondary"
          >
            <Square className="w-5 h-5 inline-block mr-2" />
            停止
          </button>
        </div>
      )}
    </div>
  )
}

// 型定義の拡張
declare global {
  interface Window {
    SpeechRecognition: any
    webkitSpeechRecognition: any
  }
} 