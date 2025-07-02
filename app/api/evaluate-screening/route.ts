import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

export async function POST(request: NextRequest) {
  try {
    const { questions, responses, questionsData } = await request.json()

    if (!questions || !responses || questions.length !== responses.length) {
      return NextResponse.json(
        { error: '無効なリクエストデータです' },
        { status: 400 }
      )
    }

    // --- ここからモック対応 ---
    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      // モックの診断結果を返す
      return NextResponse.json({
        score: 17,
        maxScore: 21,
        category: 'mild_concern',
        summary: '（モック表示）軽度の注意が必要な結果となりました。',
        recommendations: [
          '3〜6ヶ月後の再チェックをお勧めします',
          '規則正しい生活習慣を心がけてください',
          '気になる症状があれば医師にご相談ください'
        ],
        detailedAnalysis: '（モック表示）AIによる診断結果のサンプルです。',
      })
    }
    // --- ここまでモック対応 ---

    const openai = new OpenAI({
      apiKey
    })

    // OpenAI APIでスクリーニング結果を評価
    const prompt = createEvaluationPrompt(questions, responses, questionsData)
    
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `あなたは認知機能評価の専門家です。MMSE（Mini-Mental State Examination）基準に基づいて、ユーザーの回答を評価してください。
          
評価基準：
- 見当識（時間・場所）: 各質問最大3点
- 記憶機能（即時・遅延再生）: 各質問最大3点  
- 注意・計算: 各質問最大3点
- 言語機能: 各質問最大3点
- 視空間機能: 各質問最大3点

回答は以下のJSON形式で返してください：
{
  "score": 数値,
  "maxScore": 数値,
  "category": "normal" | "mild_concern" | "requires_attention",
  "summary": "結果の簡潔な要約",
  "recommendations": ["推奨事項1", "推奨事項2", "推奨事項3"],
  "detailedAnalysis": "詳細な分析文"
}

重要：これは医療診断ではないことを明記し、医師への相談を促してください。`
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 1000
    })

    const result = completion.choices[0]?.message?.content
    if (!result) {
      throw new Error('OpenAI APIからの応答が空です')
    }

    // JSONパース
    const evaluation = JSON.parse(result)
    
    return NextResponse.json(evaluation)

  } catch (error) {
    console.error('Screening evaluation API error:', error)
    
    // エラー時のフォールバック
    return NextResponse.json({
      score: 15,
      maxScore: 21,
      category: 'mild_concern',
      summary: '評価中にエラーが発生しました。参考値として表示しています。',
      recommendations: [
        '正確な評価のため、再度チェックを実行してください',
        '気になる症状がある場合は医師にご相談ください',
        'しばらく時間をおいてから再度お試しください'
      ],
      detailedAnalysis: 'システムエラーのため正確な評価を行えませんでした。このアプリは医療診断ではありませんので、心配な症状がある場合は医療機関にご相談ください。'
    }, { status: 200 })
  }
}

function createEvaluationPrompt(questions: string[], responses: string[], questionsData: any[]): string {
  let prompt = '以下の認知機能チェックの質問と回答を評価してください：\n\n'
  
  questions.forEach((question, index) => {
    const response = responses[index]
    const questionData = questionsData[index]
    
    prompt += `質問${index + 1}（${questionData?.category || '一般'}）: ${question}\n`
    prompt += `回答: ${response}\n\n`
  })
  
  prompt += `
評価のポイント：
1. 見当識：日時、場所の認識
2. 記憶：即時記憶と遅延再生
3. 注意・計算：計算能力と集中力
4. 言語：理解と表現能力
5. 視空間：空間認識能力

各回答の妥当性を評価し、総合的なスコアを算出してください。
スコアは控えめに評価し、疑わしい場合は医師への相談を促してください。
`
  
  return prompt
} 