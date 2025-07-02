'use client'

import { useState, useEffect, useRef } from 'react'
import VoiceRecorder from './VoiceRecorder'
import TextToSpeech from './TextToSpeech'
import { generateScreeningQuestions, evaluateResponses } from '@/lib/screening'
import { Bot, User, Clock, Stethoscope } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface Message {
  id: string
  type: 'ai' | 'user'
  content: string
  timestamp: Date
}

interface ScreeningChatProps {
  onComplete: (result: any) => void
  onConversationUpdate: (messages: Message[]) => void
}

export default function ScreeningChat({ onComplete, onConversationUpdate }: ScreeningChatProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [questions, setQuestions] = useState<string[]>([])
  const [responses, setResponses] = useState<string[]>([])
  const [isListening, setIsListening] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [timeElapsed, setTimeElapsed] = useState(0)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const timerRef = useRef<NodeJS.Timeout>()
  const [autoPlayText, setAutoPlayText] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    initializeScreening()
    
    // タイマー開始
    timerRef.current = setInterval(() => {
      setTimeElapsed(prev => prev + 1)
    }, 1000)

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    onConversationUpdate(messages)
  }, [messages, onConversationUpdate])

  // 質問が追加されたら自動で音声再生
  useEffect(() => {
    if (messages.length > 0) {
      const last = messages[messages.length - 1]
      if (last.type === 'ai') {
        setAutoPlayText(last.content)
      }
    }
  }, [messages])

  // 10秒後に自動で結果画面へ遷移
  useEffect(() => {
    const timer = setTimeout(() => {
      // 仮のダミー結果
      const dummyResult = {
        score: 18,
        maxScore: 21,
        category: 'mild_concern',
        summary: '簡易チェックのため参考値です。',
        recommendations: ['3ヶ月後の再チェックをおすすめします', '生活習慣の見直しをしましょう', '気になる場合は医師にご相談ください'],
        detailedAnalysis: '10秒経過による自動遷移です。',
        timeElapsed: 10,
        conversationData: { questions: [], responses: [], messages: [] }
      }
      localStorage.setItem('screeningResult', JSON.stringify(dummyResult))
      router.push('/result')
    }, 10000)
    return () => clearTimeout(timer)
  }, [router])

  const initializeScreening = async () => {
    try {
      const generatedQuestions = await generateScreeningQuestions()
      setQuestions(generatedQuestions)
      
      const welcomeMessage: Message = {
        id: Date.now().toString(),
        type: 'ai',
        content: 'こんにちは、私はAI医者のAI医師です。これから認知機能のチェックを始めます。私の質問に音声でお答えください。準備はよろしいですか？',
        timestamp: new Date()
      }
      
      setMessages([welcomeMessage])
    } catch (error) {
      console.error('Failed to initialize screening:', error)
    }
  }

  const handleUserResponse = async (transcript: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: transcript,
      timestamp: new Date()
    }
    
    setMessages(prev => [...prev, userMessage])
    setResponses(prev => [...prev, transcript])
    setIsProcessing(true)

    // 次の質問または結果処理
    if (currentQuestionIndex < questions.length - 1) {
      const nextIndex = currentQuestionIndex + 1
      setCurrentQuestionIndex(nextIndex)
      
      setTimeout(() => {
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: 'ai',
          content: questions[nextIndex],
          timestamp: new Date()
        }
        setMessages(prev => [...prev, aiMessage])
        setIsProcessing(false)
      }, 1500)
    } else {
      // すべての質問が完了、結果を評価
      await evaluateAndComplete([...responses, transcript])
    }
  }

  const evaluateAndComplete = async (allResponses: string[]) => {
    try {
      const result = await evaluateResponses(questions, allResponses)
      
      const finalMessage: Message = {
        id: (Date.now() + 2).toString(),
        type: 'ai',
        content: 'チェックが完了しました。結果をまとめています...',
        timestamp: new Date()
      }
      
      setMessages(prev => [...prev, finalMessage])
      
      setTimeout(() => {
        onComplete({
          ...result,
          timeElapsed,
          conversationData: {
            questions,
            responses: allResponses,
            messages
          }
        })
      }, 2000)
    } catch (error) {
      console.error('Failed to evaluate responses:', error)
      setIsProcessing(false)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* ヘッダー */}
      <div className="card mb-6 flex items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-primary-100 flex items-center justify-center">
          <Stethoscope className="w-8 h-8 text-primary-700" />
        </div>
        <div>
          <h2 className="text-xl font-bold">AI医師と音声チェック</h2>
          <div className="flex items-center gap-2 text-gray-600">
            <Clock className="w-5 h-5" />
            <span className="text-lg font-mono">{formatTime(timeElapsed)}</span>
          </div>
        </div>
      </div>

      {/* メッセージ */}
      <div className="card mb-6 max-h-96 overflow-y-auto">
        <div className="space-y-4">
          {messages.map((message, i) => (
            <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex items-start gap-3 max-w-xs md:max-w-md ${message.type === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${message.type === 'ai' ? 'bg-primary-100 text-primary-700' : 'bg-gray-100 text-gray-700'}`}>
                  {message.type === 'ai' ? <Stethoscope className="w-5 h-5" /> : <User className="w-5 h-5" />}
                </div>
                <div className={`px-4 py-3 rounded-xl ${message.type === 'ai' ? 'bg-primary-50 text-primary-900' : 'bg-gray-100 text-gray-900'}`}>
                  <p className="text-large">{message.content}</p>
                  {message.type === 'ai' && (
                    <div className="mt-2">
                      <TextToSpeech text={message.content} autoPlay={autoPlayText === message.content} />
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          {isProcessing && (
            <div className="flex justify-start">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center">
                  <Stethoscope className="w-5 h-5" />
                </div>
                <div className="bg-primary-50 px-4 py-3 rounded-xl">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* 音声録音 */}
      <div className="card">
        <VoiceRecorder
          onTranscript={handleUserResponse}
          isListening={isListening}
          onStartListening={() => setIsListening(true)}
          onStopListening={() => setIsListening(false)}
          disabled={isProcessing || questions.length === 0}
        />
        
        <div className="mt-4 text-center">
          <p className="text-gray-600">
            {isListening ? '話してください' : '「話す」ボタンを押して回答してください'}
          </p>
        </div>
      </div>
    </div>
  )
} 