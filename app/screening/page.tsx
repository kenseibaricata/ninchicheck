'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import VoiceRecorder from '@/components/VoiceRecorder'
import ScreeningChat from '@/components/ScreeningChat'
import { Mic, MicOff, Volume2 } from 'lucide-react'

export default function ScreeningPage() {
  const router = useRouter()
  const [isStarted, setIsStarted] = useState(false)
  const [micPermission, setMicPermission] = useState<'pending' | 'granted' | 'denied'>('pending')
  const [conversationData, setConversationData] = useState<any[]>([])

  const requestMicPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      stream.getTracks().forEach(track => track.stop())
      setMicPermission('granted')
    } catch (error) {
      setMicPermission('denied')
    }
  }

  const startScreening = () => {
    if (micPermission === 'granted') {
      setIsStarted(true)
    }
  }

  const onScreeningComplete = (result: any) => {
    // 結果を結果ページに渡す
    localStorage.setItem('screeningResult', JSON.stringify(result))
    router.push('/result')
  }

  return (
    <div className="max-w-2xl mx-auto">
      {!isStarted ? (
        <div className="text-center">
          <div className="card mb-8">
            <Volume2 className="w-16 h-16 mx-auto text-primary-600 mb-6" />
            <h2 className="text-2xl-mobile font-bold mb-4">音声チェックの準備</h2>
            <p className="text-large text-gray-600 mb-6">
              AIとの音声会話でチェックを行います。<br />
              マイクの使用を許可してください。
            </p>
            
            {micPermission === 'pending' && (
              <button
                onClick={requestMicPermission}
                className="btn-primary mb-4"
              >
                <Mic className="w-6 h-6 inline-block mr-2" />
                マイクを許可する
              </button>
            )}
            
            {micPermission === 'granted' && (
              <div>
                <div className="bg-success-50 border border-success-200 rounded-lg p-4 mb-6">
                  <p className="text-success-800 font-medium">
                    ✓ マイクの準備ができました
                  </p>
                </div>
                <button
                  onClick={startScreening}
                  className="btn-primary"
                >
                  チェックを開始する
                </button>
              </div>
            )}
            
            {micPermission === 'denied' && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <MicOff className="w-8 h-8 mx-auto text-red-600 mb-2" />
                <p className="text-red-800 font-medium mb-2">
                  マイクの許可が必要です
                </p>
                <p className="text-red-700 text-sm">
                  ブラウザの設定でマイクアクセスを許可してから、再度お試しください。
                </p>
              </div>
            )}
          </div>
          
          <div className="card">
            <h3 className="text-xl font-bold mb-4">チェックについて</h3>
            <ul className="text-large text-gray-600 text-left space-y-2">
              <li>• 所要時間：約3分</li>
              <li>• 質問数：5〜10問</li>
              <li>• 音声での自然な会話形式</li>
              <li>• いつでも中断可能</li>
            </ul>
          </div>
        </div>
      ) : (
        <ScreeningChat
          onComplete={onScreeningComplete}
          onConversationUpdate={setConversationData}
        />
      )}
    </div>
  )
} 