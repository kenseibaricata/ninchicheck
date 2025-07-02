'use client'

import Link from 'next/link'
import { Brain, Clock, Shield, Users, Mic, Sparkles } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-sky-100 via-white to-blue-200 overflow-y-auto overflow-x-hidden">
      {/* 背景画像 doctor.jpg（ヒーローセクション上部・タイトル周辺） */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <img
          src="/doctor.jpg"
          alt="医師のイメージ"
          className="absolute top-0 left-0 right-0 mx-auto w-screen max-w-screen h-auto opacity-30 blur-sm object-cover select-none"
          style={{ zIndex: 1 }}
        />
      </div>
      {/* グラデーションの装飾 */}
      <div className="absolute inset-0 pointer-events-none z-0 w-screen max-w-screen">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-gradient-to-br from-blue-300 via-sky-200 to-transparent rounded-full opacity-40 blur-3xl w-screen max-w-screen" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-gradient-to-tr from-pink-200 via-purple-200 to-transparent rounded-full opacity-30 blur-3xl w-screen max-w-screen" />
      </div>

      {/* ヒーローセクション */}
      <section className="relative z-10 w-full max-w-3xl mx-auto text-center py-20 px-4 flex flex-col items-center">
        <div className="flex flex-col items-center gap-4 mb-6">
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 rounded-full shadow text-primary-700 font-semibold text-lg">
            <Sparkles className="w-6 h-6 text-yellow-400 animate-pulse" />
            専門医監修
          </span>
          <Brain className="w-24 h-24 text-primary-600 drop-shadow-lg" />
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight drop-shadow-sm">
          健康診断
        </h1>
        <p className="text-xl md:text-2xl text-gray-700 mb-8 max-w-2xl mx-auto leading-relaxed">
          AI医師が音声問診にてあなたの認知機能をチェックします。<br className="hidden md:block" />
        </p>
        <Link href="/screening" className="btn-primary text-2xl px-12 py-5 rounded-2xl shadow-xl hover:scale-105 transition-transform duration-200">
          <Mic className="w-7 h-7 inline-block mr-2 -mt-1" />
          チェックを開始する
        </Link>
      </section>

      {/* 特徴セクション */}
      <section className="relative z-10 w-full max-w-4xl mx-auto grid md:grid-cols-4 gap-6 mb-20 px-4">
        <div className="card flex flex-col items-center py-8 bg-white/90 hover:shadow-2xl transition-shadow duration-200">
          <Clock className="w-10 h-10 text-primary-500 mb-3" />
          <h3 className="text-lg font-bold mb-2">約3分で完了</h3>
          <p className="text-gray-600 text-base">5〜10問の簡単な質問に答えるだけ。音声で自然に会話しながらチェックできます。</p>
        </div>
        <div className="card flex flex-col items-center py-8 bg-white/90 hover:shadow-2xl transition-shadow duration-200">
          <Shield className="w-10 h-10 text-primary-500 mb-3" />
          <h3 className="text-lg font-bold mb-2">プライバシー保護</h3>
          <p className="text-gray-600 text-base">会話内容は安全に保護。結果は家族と簡単に共有できます。</p>
        </div>
        <div className="card flex flex-col items-center py-8 bg-white/90 hover:shadow-2xl transition-shadow duration-200">
          <Brain className="w-10 h-10 text-primary-500 mb-3" />
          <h3 className="text-lg font-bold mb-2">AI診断技術</h3>
          <p className="text-gray-600 text-base">最新AI技術でMMSE基準に基づいた信頼性の高いスクリーニング。</p>
        </div>
        <div className="card flex flex-col items-center py-8 bg-white/90 hover:shadow-2xl transition-shadow duration-200">
          <Users className="w-10 h-10 text-primary-500 mb-3" />
          <h3 className="text-lg font-bold mb-2">家族で安心</h3>
          <p className="text-gray-600 text-base">結果を家族と共有して、みんなで健康管理。早期発見で適切なケアにつなげます。</p>
        </div>
      </section>

      {/* 使い方セクション */}
      <section className="relative z-10 w-full max-w-2xl mx-auto mb-16 px-4">
        <div className="card bg-white/90 p-8 shadow-xl">
          <h3 className="text-2xl font-bold mb-6 text-center text-primary-700">使い方</h3>
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="bg-primary-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-lg shadow">
                1
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-1">チェック開始</h4>
                <p className="text-gray-600 text-base">「チェックを開始する」ボタンを押して、マイクの使用を許可してください。</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="bg-primary-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-lg shadow">
                2
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-1">音声会話</h4>
                <p className="text-gray-600 text-base">AIからの質問に音声で答えてください。自然な会話形式で進みます。</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="bg-primary-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-lg shadow">
                3
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-1">結果確認</h4>
                <p className="text-gray-600 text-base">約3分後に結果が表示されます。必要に応じて家族と共有できます。</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 注意事項 */}
      <section className="relative z-10 w-full max-w-2xl mx-auto mb-10 px-4">
        <div className="bg-warning-50 border border-warning-200 rounded-xl p-6 text-center shadow">
          <p className="text-lg text-warning-800 font-medium">
            ⚠️ 重要：このアプリは医療診断ではありません<br />
            気になる症状がある場合は、必ず医師にご相談ください
          </p>
        </div>
      </section>
    </div>
  )
} 