'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Brain, Clock, MessageSquare, Share2, AlertTriangle } from 'lucide-react'

interface SharedResult {
  score: number
  maxScore: number
  category: 'normal' | 'mild_concern' | 'requires_attention'
  summary: string
  timeElapsed: number
  timestamp: string
  id: string
}

export default function SharedResultPage() {
  const searchParams = useSearchParams()
  const [result, setResult] = useState<SharedResult | null>(null)
  const [error, setError] = useState<string>('')

  useEffect(() => {
    const dataParam = searchParams.get('data')
    if (!dataParam) {
      setError('共有データが見つかりません')
      return
    }

    try {
      const decodedData = atob(dataParam)
      const parsedResult = JSON.parse(decodedData)
      setResult(parsedResult)
    } catch (error) {
      setError('データの読み込みに失敗しました')
    }
  }, [searchParams])

  const getResultColor = () => {
    if (!result) return 'gray'
    
    switch (result.category) {
      case 'normal':
        return 'success'
      case 'mild_concern':
        return 'warning'
      case 'requires_attention':
        return 'red'
      default:
        return 'gray'
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}分${secs}秒`
  }

  const formatDate = (isoString: string) => {
    const date = new Date(isoString)
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto text-center">
        <div className="card">
          <AlertTriangle className="w-16 h-16 mx-auto text-red-400 mb-4" />
          <h2 className="text-xl font-bold mb-2">エラーが発生しました</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Link href="/" className="btn-primary">
            ホームに戻る
          </Link>
        </div>
      </div>
    )
  }

  if (!result) {
    return (
      <div className="max-w-2xl mx-auto text-center">
        <div className="card">
          <Brain className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <p className="text-large text-gray-600">結果を読み込んでいます...</p>
        </div>
      </div>
    )
  }

  const colorClass = getResultColor()

  return (
    <div className="max-w-3xl mx-auto">
      {/* ヘッダー */}
      <div className="card mb-8 text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Share2 className="w-8 h-8 text-primary-600" />
          <h1 className="text-2xl font-bold">共有された認知機能チェック結果</h1>
        </div>
        <p className="text-gray-600">
          実施日時: {formatDate(result.timestamp)}
        </p>
      </div>

      {/* 結果サマリー */}
      <div className="card mb-8 text-center">
        <div className={`bg-${colorClass}-50 border border-${colorClass}-200 rounded-xl p-6 mb-6`}>
          <div className="text-3xl font-bold mb-2">
            <span className={`text-${colorClass}-800`}>
              {result.score}点
            </span>
            <span className="text-gray-600 text-xl">
              /{result.maxScore}点
            </span>
          </div>
          <p className={`text-large font-medium text-${colorClass}-800`}>
            {result.summary}
          </p>
        </div>

        <div className="flex items-center justify-center gap-6 text-gray-600">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            <span>所要時間: {formatTime(result.timeElapsed)}</span>
          </div>
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            <span>AI音声チェック</span>
          </div>
        </div>
      </div>

      {/* 結果の説明 */}
      <div className="card mb-8">
        <h3 className="text-xl font-bold mb-4">結果について</h3>
        <div className="space-y-4">
          {result.category === 'normal' && (
            <div className="bg-success-50 border border-success-200 rounded-lg p-4">
              <h4 className="font-semibold text-success-800 mb-2">良好な結果</h4>
              <p className="text-success-700">
                認知機能に特に気になる点はありませんでした。引き続き健康的な生活習慣を心がけることをお勧めします。
              </p>
            </div>
          )}
          
          {result.category === 'mild_concern' && (
            <div className="bg-warning-50 border border-warning-200 rounded-lg p-4">
              <h4 className="font-semibold text-warning-800 mb-2">軽度の注意</h4>
              <p className="text-warning-700">
                一部の項目で軽度の注意が必要な結果となりました。3〜6ヶ月後の再チェックや、気になる症状があれば医師への相談をお勧めします。
              </p>
            </div>
          )}
          
          {result.category === 'requires_attention' && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h4 className="font-semibold text-red-800 mb-2">要注意</h4>
              <p className="text-red-700">
                医師への相談をお勧めする結果となりました。医療機関での詳しい検査をご検討ください。
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ご家族向けメッセージ */}
      <div className="card mb-8">
        <h3 className="text-xl font-bold mb-4">ご家族の皆様へ</h3>
        <div className="space-y-3 text-large text-gray-700">
          <p>
            この結果は、AI技術を使用した認知機能のスクリーニング結果です。
            医療診断ではありませんが、今後のケアの参考としてご活用ください。
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>結果について本人と一緒に確認してください</li>
            <li>気になる変化があれば記録しておきましょう</li>
            <li>定期的にチェックを実施することをお勧めします</li>
            <li>心配な症状がある場合は医師にご相談ください</li>
          </ul>
        </div>
      </div>

      {/* 重要事項 */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-8">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-yellow-800 mb-2">重要事項</h4>
            <ul className="text-yellow-800 space-y-1">
              <li>• この結果は医療診断ではありません</li>
              <li>• あくまで参考情報としてご利用ください</li>
              <li>• 心配な症状がある場合は専門医にご相談ください</li>
              <li>• 個人情報は含まれていません</li>
            </ul>
          </div>
        </div>
      </div>

      {/* アクション */}
      <div className="text-center mb-8">
        <Link href="/" className="btn-primary">
          認知症セルフチェックを試してみる
        </Link>
      </div>
    </div>
  )
} 