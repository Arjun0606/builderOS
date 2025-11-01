'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Loader2, Send, User, Bot, Copy, Check } from 'lucide-react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: string
}

interface AIChatProps {
  organizationId: string
  userId: string
  userName: string
}

export function AIChat({ organizationId, userId, userName }: AIChatProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const supabase = createClientComponentClient()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Load previous conversation from localStorage (temporary, will use DB later)
  useEffect(() => {
    const saved = localStorage.getItem('ai-chat-history')
    if (saved) {
      try {
        setMessages(JSON.parse(saved))
      } catch (e) {
        console.error('Error loading chat history:', e)
      }
    }
  }, [])

  // Save conversation to localStorage (temporary)
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('ai-chat-history', JSON.stringify(messages))
    }
  }, [messages])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!input.trim() || loading) return

    const userMessage: Message = {
      role: 'user',
      content: input.trim(),
      timestamp: new Date().toISOString(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setLoading(true)

    try {
      const response = await fetch('/api/ai/legal-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          organizationId,
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      const assistantMessage: Message = {
        role: 'assistant',
        content: data.response,
        timestamp: new Date().toISOString(),
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error: any) {
      console.error('Error calling AI:', error)
      const errorMessage: Message = {
        role: 'assistant',
        content: `Sorry, I encountered an error: ${error.message}. Please try again.`,
        timestamp: new Date().toISOString(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setLoading(false)
    }
  }

  function copyToClipboard(text: string, index: number) {
    navigator.clipboard.writeText(text)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  function clearChat() {
    if (confirm('Are you sure you want to clear the chat history?')) {
      setMessages([])
      localStorage.removeItem('ai-chat-history')
    }
  }

  return (
    <div className="flex h-full flex-col rounded-lg border border-slate-200 bg-white">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
              <Bot className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-slate-900">
              How can I help you today?
            </h3>
            <p className="mt-2 text-sm text-slate-600 max-w-md">
              I'm trained on Indian law (IPC, CPC, CrPC, Companies Act, GST, etc.). 
              Ask me legal questions, request document drafts, or get case law research help.
            </p>
            <div className="mt-6 grid grid-cols-1 gap-3 w-full max-w-2xl">
              <button
                onClick={() => setInput('Draft a legal notice for cheque bounce under Section 138 NI Act')}
                className="rounded-lg border border-slate-300 bg-white p-4 text-left text-sm hover:bg-slate-50 transition-colors"
              >
                <p className="font-medium text-slate-900">Draft a legal notice</p>
                <p className="mt-1 text-xs text-slate-600">For cheque bounce under Section 138 NI Act</p>
              </button>
              <button
                onClick={() => setInput('What is the limitation period for filing a civil suit in India?')}
                className="rounded-lg border border-slate-300 bg-white p-4 text-left text-sm hover:bg-slate-50 transition-colors"
              >
                <p className="font-medium text-slate-900">Ask about limitation period</p>
                <p className="mt-1 text-xs text-slate-600">For filing civil suits in India</p>
              </button>
              <button
                onClick={() => setInput('Explain the difference between bail and anticipatory bail under CrPC')}
                className="rounded-lg border border-slate-300 bg-white p-4 text-left text-sm hover:bg-slate-50 transition-colors"
              >
                <p className="font-medium text-slate-900">Explain legal concepts</p>
                <p className="mt-1 text-xs text-slate-600">Bail vs anticipatory bail under CrPC</p>
              </button>
            </div>
          </div>
        ) : (
          <>
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex gap-4 ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {message.role === 'assistant' && (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100">
                    <Bot className="h-5 w-5 text-blue-600" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-3 ${
                    message.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 text-slate-900'
                  }`}
                >
                  <div className="prose prose-sm max-w-none">
                    <p className="whitespace-pre-wrap">{message.content}</p>
                  </div>
                  {message.role === 'assistant' && (
                    <div className="mt-2 flex items-center gap-2">
                      <button
                        onClick={() => copyToClipboard(message.content, index)}
                        className="text-xs text-slate-600 hover:text-slate-900 flex items-center gap-1"
                      >
                        {copiedIndex === index ? (
                          <>
                            <Check className="h-3 w-3" />
                            Copied
                          </>
                        ) : (
                          <>
                            <Copy className="h-3 w-3" />
                            Copy
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
                {message.role === 'user' && (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-200">
                    <User className="h-5 w-5 text-slate-700" />
                  </div>
                )}
              </div>
            ))}
            {loading && (
              <div className="flex gap-4 justify-start">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100">
                  <Bot className="h-5 w-5 text-blue-600" />
                </div>
                <div className="rounded-lg bg-slate-100 px-4 py-3">
                  <Loader2 className="h-5 w-5 animate-spin text-slate-600" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input */}
      <div className="border-t border-slate-200 p-4">
        <form onSubmit={handleSubmit} className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me anything about Indian law..."
            disabled={loading}
            className="flex-1 rounded-lg border border-slate-300 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-slate-50 disabled:text-slate-500"
          />
          <Button type="submit" disabled={loading || !input.trim()} size="lg">
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
          </Button>
        </form>
        {messages.length > 0 && (
          <div className="mt-2 flex justify-between items-center">
            <p className="text-xs text-slate-500">
              {messages.length} messages in conversation
            </p>
            <button
              onClick={clearChat}
              className="text-xs text-red-600 hover:text-red-700"
            >
              Clear chat
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

