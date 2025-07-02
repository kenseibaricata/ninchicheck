import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '認知症定期検診 | 簡単3分スクリーニング',
  description: 'AIを使った認知症の初期症状スクリーニング。音声での簡単な質問に答えるだけで、約3分で結果をお知らせします。',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body className="bg-gray-50 min-h-screen">
        <div className="min-h-screen flex flex-col">
          <header className="bg-white shadow-sm border-b border-gray-200">
            <div className="container mx-auto px-4 py-4">
              <h1 className="text-2xl-mobile font-bold text-primary-700 text-center">
                認知症定期検診
              </h1>
            </div>
          </header>
          
          <main className="flex-1 container mx-auto px-4 py-6">
            {children}
          </main>
          
          <footer className="bg-white border-t border-gray-200 py-4">
            <div className="container mx-auto px-4 text-center text-gray-600">
              <p className="text-sm">
                ※このアプリは医療診断ではありません。気になる症状がある場合は医師にご相談ください。
              </p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  )
} 