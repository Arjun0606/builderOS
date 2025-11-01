import { NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { GoogleGenerativeAI } from '@google/generative-ai'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || '')

const INDIAN_LAW_SYSTEM_PROMPT = `You are an expert AI legal assistant specializing in Indian law. You have comprehensive knowledge of:

**Indian Legal System:**
- Indian Penal Code (IPC), 1860
- Code of Criminal Procedure (CrPC), 1973
- Code of Civil Procedure (CPC), 1908
- Indian Evidence Act, 1872
- Indian Contract Act, 1872
- Negotiable Instruments Act, 1881
- Companies Act, 2013
- Goods and Services Tax (GST) Act, 2017
- Income Tax Act, 1961
- RERA (Real Estate Regulation Act), 2016
- Consumer Protection Act, 2019
- Arbitration and Conciliation Act, 1996
- Indian Constitution (fundamental rights, directive principles)

**Courts & Procedure:**
- Supreme Court of India
- High Courts (all states)
- District Courts
- Tribunals (NCLT, NCLAT, ITAT, CAT, etc.)
- Filing procedures, limitation periods, appeals

**Your Capabilities:**
1. **Answer legal questions** with accurate citations (Section, Act, case law)
2. **Draft legal documents** (notices, contracts, petitions, affidavits, replies)
3. **Explain legal concepts** in simple language
4. **Provide procedural guidance** (how to file, required documents, timelines)
5. **Cite relevant case law** when applicable

**Guidelines:**
- Always cite sources (Section numbers, Act names, case citations)
- Be precise and professional in legal language
- Explain complex concepts in simple terms when asked
- For document drafts, use proper legal formatting
- Warn users when legal advice requires a licensed advocate
- Mention limitation periods and deadlines when relevant
- Consider jurisdiction (different states may have variations)

**Format for Citations:**
- Statutes: "Section X of [Act Name], [Year]"
- Cases: "[Party 1] v. [Party 2] ([Year]) [Volume] [Reporter] [Page]"

**Important Disclaimers:**
- You provide legal information, not legal advice
- Users should always consult a licensed advocate for their specific case
- Court procedures may vary by jurisdiction
- Laws and judgments are subject to amendments and interpretations

Now, assist the user with their legal query professionally and accurately.`

// Estimate token count (rough approximation: 1 token ≈ 4 characters)
function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4)
}

// Determine which AI model to use based on content size
function selectModel(messages: any[]): { model: 'claude' | 'gemini'; reason: string } {
  const totalText = messages.map(m => m.content).join(' ')
  const estimatedTokens = estimateTokens(totalText)
  
  // Rough conversion: 1 page ≈ 500 tokens
  // So 150 pages ≈ 75,000 tokens
  
  if (estimatedTokens < 75000) {
    return { 
      model: 'claude', 
      reason: 'Using Claude 4.5 Sonnet for standard queries (< 150 pages)' 
    }
  } else {
    return { 
      model: 'gemini', 
      reason: 'Using Gemini 2.5 Pro for large document analysis (> 150 pages)' 
    }
  }
}

export async function POST(request: Request) {
  try {
    const { messages, organizationId, forceModel } = await request.json()

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Invalid messages format' },
        { status: 400 }
      )
    }

    // Intelligent model selection (or use forced model for testing)
    const modelSelection = forceModel 
      ? { model: forceModel as 'claude' | 'gemini', reason: 'Force override' }
      : selectModel(messages)

    let assistantMessage = ''
    let modelUsed = ''
    let totalTokens = 0

    if (modelSelection.model === 'claude') {
      // Use Claude 4.5 Sonnet
      const anthropicMessages = messages.map((msg: any) => ({
        role: msg.role === 'assistant' ? 'assistant' : 'user',
        content: msg.content,
      }))

      const response = await anthropic.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 8192,
        system: INDIAN_LAW_SYSTEM_PROMPT,
        messages: anthropicMessages,
      })

      assistantMessage = response.content[0].type === 'text' 
        ? response.content[0].text 
        : ''
      modelUsed = 'claude-3-5-sonnet-20241022'
      totalTokens = response.usage.input_tokens + response.usage.output_tokens

    } else {
      // Use Gemini 2.5 Pro for large documents
      const model = genAI.getGenerativeModel({ 
        model: 'gemini-2.0-flash-exp',
        systemInstruction: INDIAN_LAW_SYSTEM_PROMPT,
      })

      // Convert messages to Gemini format
      const chat = model.startChat({
        history: messages.slice(0, -1).map((msg: any) => ({
          role: msg.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: msg.content }],
        })),
      })

      const lastMessage = messages[messages.length - 1]
      const result = await chat.sendMessage(lastMessage.content)
      const response = await result.response

      assistantMessage = response.text()
      modelUsed = 'gemini-2.0-flash-exp'
      // Gemini doesn't provide token counts in the same way, estimate
      totalTokens = estimateTokens(messages.map(m => m.content).join('') + assistantMessage)
    }

    // TODO: Save conversation to database (ai_conversations table)
    // For now, we're just returning the response

    return NextResponse.json({
      response: assistantMessage,
      model: modelUsed,
      tokens: totalTokens,
      modelSelection: modelSelection.reason,
    })
  } catch (error: any) {
    console.error('AI API Error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to get AI response' },
      { status: 500 }
    )
  }
}

