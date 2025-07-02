'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  CheckCircle, 
  AlertTriangle, 
  AlertCircle, 
  Share2, 
  Download, 
  RotateCcw,
  Clock,
  Brain,
  MessageSquare,
  Sparkles
} from 'lucide-react'
import { ScreeningResult } from '@/lib/screening'

export default function ResultPage() {
  const router = useRouter()
  const [result, setResult] = useState<ScreeningResult | null>(null)
  const [conversationData, setConversationData] = useState<any>(null)
  const [shareUrl, setShareUrl] = useState<string>('')
  const [isGeneratingShare, setIsGeneratingShare] = useState(false)

  useEffect(() => {
    // ローカルストレージから結果を取得
    const savedResult = localStorage.getItem('screeningResult')
    if (savedResult) {
      const parsedResult = JSON.parse(savedResult)
      setResult(parsedResult)
      setConversationData(parsedResult.conversationData)
    } else {
      // 結果がない場合はホームに戻る
      router.push('/')
    }
  }, [router])

  const getResultIcon = () => {
    if (!result) return null
    
    switch (result.category) {
      case 'normal':
        return <CheckCircle className="w-16 h-16 text-success-600" />
      case 'mild_concern':
        return <AlertTriangle className="w-16 h-16 text-warning-600" />
      case 'requires_attention':
        return <AlertCircle className="w-16 h-16 text-red-600" />
      default:
        return <Brain className="w-16 h-16 text-gray-600" />
    }
  }

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

  const generateShareUrl = async () => {
    if (!result) return
    
    setIsGeneratingShare(true)
    try {
      // 共有用のデータを準備（個人情報を除外）
      const shareData = {
        score: result.score,
        maxScore: result.maxScore,
        category: result.category,
        summary: result.summary,
        timeElapsed: result.timeElapsed,
        timestamp: new Date().toISOString(),
        id: Math.random().toString(36).substr(2, 9)
      }

      // 実際のアプリでは、サーバーにデータを保存してURLを生成
      // プロトタイプでは簡易的な方法を使用
      const encodedData = btoa(JSON.stringify(shareData))
      const url = `${window.location.origin}/shared-result?data=${encodedData}`
      setShareUrl(url)
      
      // クリップボードにコピー
      await navigator.clipboard.writeText(url)
      alert('共有URLをクリップボードにコピーしました')
      
    } catch (error) {
      console.error('Share URL generation failed:', error)
      alert('共有URLの生成に失敗しました')
    } finally {
      setIsGeneratingShare(false)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}分${secs}秒`
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
    <div className="max-w-4xl mx-auto">
      {/* メイン結果 */}
      <div className="card mb-8 text-center">
        <div className="mb-6">
          {getResultIcon()}
        </div>
        
        <h2 className="text-2xl-mobile font-bold mb-4">
          認知機能チェック結果
        </h2>
        
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

        <div className="flex items-center justify-center gap-6 text-gray-600 mb-6">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            <span>所要時間: {result.timeElapsed ? formatTime(result.timeElapsed) : '約3分'}</span>
          </div>
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            <span>質問数: {conversationData?.questions?.length || 7}問</span>
          </div>
        </div>
      </div>

      {/* 推奨事項 */}
      <div className="card mb-8">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <CheckCircle className="w-6 h-6 text-primary-600" />
          推奨事項
        </h3>
        <ul className="space-y-3">
          {result.recommendations.map((recommendation, index) => (
            <li key={index} className="flex items-start gap-3">
              <div className="w-6 h-6 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center text-sm font-bold mt-0.5">
                {index + 1}
              </div>
              <span className="text-large text-gray-700">{recommendation}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* クリニック紹介 or クロスセル */}
      {(result.category === 'requires_attention' || result.category === 'mild_concern') && (
        <div className="card mb-8 border-red-200 border-2">
          <h3 className="text-xl font-bold mb-4 text-red-700 flex items-center gap-2">
            <AlertCircle className="w-6 h-6 text-red-600" />
            おすすめクリニックのご案内
          </h3>
          <ul className="space-y-4">
            <li>
              <div className="font-bold text-lg">東京メモリークリニック</div>
              <div className="text-gray-600">東京都千代田区1-2-3</div>
              <a href="https://tokyo-memory.example.com" target="_blank" className="text-primary-600 underline">Webサイトを見る</a>
            </li>
            <li>
              <div className="font-bold text-lg">新宿脳神経外科</div>
              <div className="text-gray-600">東京都新宿区4-5-6</div>
              <a href="https://shinjuku-brain.example.com" target="_blank" className="text-primary-600 underline">Webサイトを見る</a>
            </li>
            <li>
              <div className="font-bold text-lg">横浜メディカルセンター</div>
              <div className="text-gray-600">神奈川県横浜市7-8-9</div>
              <a href="https://yokohama-medical.example.com" target="_blank" className="text-primary-600 underline">Webサイトを見る</a>
            </li>
          </ul>
          <div className="mt-6 text-center">
            <a href="https://www.jadecom.or.jp/clinic/" target="_blank" className="btn-primary">全国の認知症外来を探す</a>
          </div>
        </div>
      )}
      {(result.category === 'normal' || result.category === 'mild_concern') && (
        <div className="card mb-8 border-green-200 border-2">
          <h3 className="text-xl font-bold mb-4 text-green-700 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-green-500" />
            脳トレ・予防商品・医療保険のご案内
          </h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-green-50 rounded-xl p-4 flex flex-col items-center">
              <div className="font-bold mb-2">脳トレアプリ「脳活道場」</div>
              <a href="https://noukatsu.example.com" target="_blank" className="btn-secondary mb-2">アプリを見る</a>
              <span className="text-xs text-gray-500">毎日3分で脳を活性化</span>
            </div>
            <div className="bg-green-50 rounded-xl p-4 flex flex-col items-center">
              <div className="font-bold mb-2">記憶力サポートサプリ</div>
              <a href="https://supple.example.com" target="_blank" className="btn-secondary mb-2">商品を見る</a>
              <span className="text-xs text-gray-500">DHA・EPA配合</span>
            </div>
            <div className="bg-green-50 rounded-xl p-4 flex flex-col items-center">
              <div className="font-bold mb-2">医療保険「安心プラン」</div>
              <a href="https://hoken.example.com" target="_blank" className="btn-secondary mb-2">資料請求</a>
              <span className="text-xs text-gray-500">認知症もカバー</span>
            </div>
          </div>
        </div>
      )}

      {/* 詳細分析 */}
      <div className="card mb-8">
        <h3 className="text-xl font-bold mb-4">詳細分析</h3>
        <p className="text-large text-gray-700 leading-relaxed">
          {result.detailedAnalysis}
        </p>
      </div>

      {/* アクションボタン */}
      <div className="grid md:grid-cols-2 gap-4 mb-8">
        <button
          onClick={generateShareUrl}
          disabled={isGeneratingShare}
          className="btn-secondary flex items-center justify-center gap-2"
        >
          <Share2 className="w-5 h-5" />
          {isGeneratingShare ? '生成中...' : 'ご家族と共有'}
        </button>
        
        <Link href="/screening" className="btn-secondary flex items-center justify-center gap-2">
          <RotateCcw className="w-5 h-5" />
          再チェック
        </Link>
      </div>

      {/* 共有URL表示 */}
      {shareUrl && (
        <div className="card mb-8">
          <h4 className="font-bold mb-3">共有URL</h4>
          <div className="bg-gray-50 p-3 rounded-lg border">
            <p className="text-sm text-gray-600 mb-2">
              このURLをご家族に送ることで、結果を安全に共有できます：
            </p>
            <code className="text-sm break-all text-primary-700">
              {shareUrl}
            </code>
          </div>
        </div>
      )}

      {/* 注意事項 */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-8">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-yellow-800 mb-2">重要なお知らせ</h4>
            <ul className="text-yellow-800 space-y-1">
              <li>• このチェックは医療診断ではありません</li>
              <li>• 心配な症状がある場合は医師にご相談ください</li>
              <li>• 結果は参考程度にお考えください</li>
              <li>• 定期的なチェックをお勧めします</li>
            </ul>
          </div>
        </div>
      </div>

      {/* フィードバック */}
      <div className="card text-center">
        <h4 className="font-bold mb-3">フィードバック</h4>
        <p className="text-gray-600 mb-4">
          チェック結果に関してご意見・ご感想がございましたら、お聞かせください。
        </p>
        <button className="btn-secondary">
          フィードバックを送信
        </button>
      </div>

      {/* ナビゲーション */}
      <div className="mt-8 text-center">
        <Link href="/" className="text-primary-600 hover:text-primary-700 font-medium">
          ← ホームに戻る
        </Link>
      </div>
    </div>
  )
} 