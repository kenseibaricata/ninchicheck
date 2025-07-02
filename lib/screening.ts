// MMSE（Mini-Mental State Examination）に基づく認知機能スクリーニング

export interface ScreeningQuestion {
  id: string
  category: 'orientation' | 'memory' | 'attention' | 'language' | 'visuospatial'
  question: string
  expectedType: 'specific' | 'recall' | 'calculation' | 'comprehension'
}

export interface ScreeningResult {
  score: number
  maxScore: number
  category: 'normal' | 'mild_concern' | 'requires_attention'
  summary: string
  recommendations: string[]
  detailedAnalysis: string
  timeElapsed?: number
  conversationData?: any
}

// MMSE基準に基づくスクリーニング質問
const baseQuestions: ScreeningQuestion[] = [
  {
    id: 'orientation_1',
    category: 'orientation',
    question: '今日は何年の何月何日でしょうか？曜日も教えてください。',
    expectedType: 'specific'
  },
  {
    id: 'orientation_2', 
    category: 'orientation',
    question: 'ここはどこでしょうか？どちらの都道府県にいらっしゃいますか？',
    expectedType: 'specific'
  },
  {
    id: 'memory_1',
    category: 'memory',
    question: 'これから3つの言葉をお伝えします。覚えてください。「桜、電車、りんご」です。復唱してください。',
    expectedType: 'recall'
  },
  {
    id: 'attention_1',
    category: 'attention',
    question: '100から7ずつ引き算をしてください。100、93、次はいくつでしょうか？',
    expectedType: 'calculation'
  },
  {
    id: 'memory_2',
    category: 'memory',
    question: '先ほどお伝えした3つの言葉を覚えていらっしゃいますか？',
    expectedType: 'recall'
  },
  {
    id: 'language_1',
    category: 'language',
    question: '「みんなで力を合わせて頑張りましょう」という文を繰り返して言ってください。',
    expectedType: 'comprehension'
  },
  {
    id: 'visuospatial_1',
    category: 'visuospatial',
    question: '時計の文字盤を思い浮かべてください。3時15分の時計の針の位置を説明してください。',
    expectedType: 'comprehension'
  }
]

export async function generateScreeningQuestions(): Promise<string[]> {
  // プロトタイプでは固定の質問セットを使用
  return baseQuestions.map(q => q.question)
}

export async function evaluateResponses(
  questions: string[], 
  responses: string[]
): Promise<ScreeningResult> {
  try {
    // OpenAI APIを使用してレスポンスを評価
    const response = await fetch('/api/evaluate-screening', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        questions,
        responses,
        questionsData: baseQuestions
      })
    })

    if (!response.ok) {
      throw new Error('評価API呼び出しに失敗しました')
    }

    const result = await response.json()
    return result

  } catch (error) {
    console.error('Screening evaluation error:', error)
    
    // フォールバック評価（簡易版）
    return generateFallbackResult(responses)
  }
}

function generateFallbackResult(responses: string[]): ScreeningResult {
  // 簡易的な評価ロジック（プロトタイプ用）
  let score = 0
  const maxScore = baseQuestions.length * 3 // 各質問最大3点

  responses.forEach((response, index) => {
    const question = baseQuestions[index]
    if (!question) return

    const cleanResponse = response.toLowerCase().trim()
    
    switch (question.category) {
      case 'orientation':
        // 日付や場所に関連するキーワードをチェック
        if (cleanResponse.includes('年') || cleanResponse.includes('月') || 
            cleanResponse.includes('日') || cleanResponse.includes('曜日') ||
            cleanResponse.includes('東京') || cleanResponse.includes('県') ||
            cleanResponse.includes('市')) {
          score += 2
        } else if (cleanResponse.length > 3) {
          score += 1
        }
        break

      case 'memory':
        // 記憶に関する質問の評価
        if (index === 2) { // 最初の記憶質問
          const keywords = ['桜', 'さくら', '電車', 'でんしゃ', 'りんご', 'リンゴ']
          const matches = keywords.filter(word => cleanResponse.includes(word)).length
          score += Math.min(matches, 3)
        } else if (index === 4) { // 遅延再生
          const keywords = ['桜', 'さくら', '電車', 'でんしゃ', 'りんご', 'リンゴ']
          const matches = keywords.filter(word => cleanResponse.includes(word)).length
          score += Math.min(matches, 3)
        }
        break

      case 'attention':
        // 計算問題の評価
        if (cleanResponse.includes('86') || cleanResponse.includes('八十六')) {
          score += 3
        } else if (/\d/.test(cleanResponse)) {
          score += 1
        }
        break

      case 'language':
        // 言語機能の評価
        if (cleanResponse.includes('みんな') && cleanResponse.includes('力') && cleanResponse.includes('頑張')) {
          score += 3
        } else if (cleanResponse.length > 5) {
          score += 1
        }
        break

      case 'visuospatial':
        // 視空間機能の評価
        if (cleanResponse.includes('3') && (cleanResponse.includes('15') || cleanResponse.includes('針'))) {
          score += 2
        } else if (cleanResponse.includes('時計') || cleanResponse.includes('針')) {
          score += 1
        }
        break
    }
  })

  const percentage = (score / maxScore) * 100

  let category: 'normal' | 'mild_concern' | 'requires_attention'
  let summary: string
  let recommendations: string[]

  if (percentage >= 80) {
    category = 'normal'
    summary = '認知機能に特に気になる点はありませんでした。'
    recommendations = [
      '引き続き健康的な生活習慣を心がけましょう',
      '定期的な運動と社会参加を続けてください',
      '年1回程度の定期チェックをお勧めします'
    ]
  } else if (percentage >= 60) {
    category = 'mild_concern'
    summary = '軽度の注意が必要な結果となりました。'
    recommendations = [
      '3〜6ヶ月後の再チェックをお勧めします',
      '規則正しい生活習慣を心がけてください',
      '気になる症状があれば医師にご相談ください'
    ]
  } else {
    category = 'requires_attention'
    summary = '医師への相談をお勧めします。'
    recommendations = [
      '医療機関での詳しい検査をお勧めします',
      'ご家族と一緒に結果を確認してください',
      '日常生活で気になることがあれば記録しておきましょう'
    ]
  }

  return {
    score,
    maxScore,
    category,
    summary,
    recommendations,
    detailedAnalysis: `${baseQuestions.length}問の質問にお答えいただき、${maxScore}点満点中${score}点でした。回答内容から判断して、${summary}`
  }
} 