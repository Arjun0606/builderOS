import { NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

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

export async function POST(request: Request) {
  try {
    const { messages, organizationId } = await request.json()

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Invalid messages format' },
        { status: 400 }
      )
    }

    // Convert our message format to Anthropic format
    const anthropicMessages = messages.map((msg: any) => ({
      role: msg.role === 'assistant' ? 'assistant' : 'user',
      content: msg.content,
    }))

    // Call Claude API
    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 4096,
      system: INDIAN_LAW_SYSTEM_PROMPT,
      messages: anthropicMessages,
    })

    const assistantMessage = response.content[0].type === 'text' 
      ? response.content[0].text 
      : ''

    // TODO: Save conversation to database (ai_conversations table)
    // For now, we're just returning the response

    return NextResponse.json({
      response: assistantMessage,
      model: 'claude-3-5-sonnet-20241022',
      tokens: response.usage.input_tokens + response.usage.output_tokens,
    })
  } catch (error: any) {
    console.error('AI API Error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to get AI response' },
      { status: 500 }
    )
  }
}

