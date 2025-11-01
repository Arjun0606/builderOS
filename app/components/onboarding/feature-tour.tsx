'use client'

import { useState, useEffect } from 'react'
import { X, ChevronRight, ChevronLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface TourStep {
  title: string
  description: string
  element?: string // CSS selector for the element to highlight
  position: 'top' | 'bottom' | 'left' | 'right'
}

const TOUR_STEPS: TourStep[] = [
  {
    title: 'Welcome to LegalOS!',
    description: 'Let\'s take a quick tour of the key features. This will only take 2 minutes.',
    position: 'bottom',
  },
  {
    title: 'AI Legal Assistant',
    description: 'Chat with your AI assistant trained on Indian law. It can draft documents, answer legal questions, and search your firm\'s past cases.',
    element: '[data-tour="ai-assistant"]',
    position: 'right',
  },
  {
    title: 'Case Management',
    description: 'Manage all your cases in one place. Track status, court dates, documents, and time entries.',
    element: '[data-tour="cases"]',
    position: 'right',
  },
  {
    title: 'Knowledge Base',
    description: 'Upload your firm\'s past cases and documents. The AI will learn from your institutional knowledge.',
    element: '[data-tour="knowledge-base"]',
    position: 'right',
  },
  {
    title: 'Case Law Search',
    description: 'Search Indian case law with AI-powered summaries. Find relevant precedents instantly.',
    element: '[data-tour="case-law"]',
    position: 'right',
  },
  {
    title: 'Document Generator',
    description: 'Generate legal documents from 500+ templates. AI helps you customize them instantly.',
    element: '[data-tour="templates"]',
    position: 'right',
  },
  {
    title: 'You\'re All Set!',
    description: 'Start by adding a client or case, or chat with the AI assistant. Need help? Click the help icon anytime.',
    position: 'bottom',
  },
]

export function FeatureTour() {
  const [isOpen, setIsOpen] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)

  useEffect(() => {
    // Check if user has seen the tour
    const hasSeenTour = localStorage.getItem('legalos-tour-completed')
    if (!hasSeenTour) {
      // Show tour after a short delay
      setTimeout(() => {
        setIsOpen(true)
      }, 1000)
    }
  }, [])

  const handleNext = () => {
    if (currentStep < TOUR_STEPS.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      handleComplete()
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleComplete = () => {
    localStorage.setItem('legalos-tour-completed', 'true')
    setIsOpen(false)
  }

  const handleSkip = () => {
    localStorage.setItem('legalos-tour-completed', 'true')
    setIsOpen(false)
  }

  if (!isOpen) {
    return null
  }

  const step = TOUR_STEPS[currentStep]

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50 z-40" onClick={handleSkip} />

      {/* Tour Popup */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md">
        <div className="bg-white rounded-lg shadow-2xl p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-slate-900">{step.title}</h3>
              <p className="text-sm text-slate-500 mt-1">
                Step {currentStep + 1} of {TOUR_STEPS.length}
              </p>
            </div>
            <button
              onClick={handleSkip}
              className="text-slate-400 hover:text-slate-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Content */}
          <p className="text-slate-700 mb-6">{step.description}</p>

          {/* Progress */}
          <div className="flex gap-1 mb-6">
            {TOUR_STEPS.map((_, index) => (
              <div
                key={index}
                className={`flex-1 h-1 rounded ${
                  index <= currentStep ? 'bg-blue-600' : 'bg-slate-200'
                }`}
              />
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={handleSkip}
              className="text-slate-600"
            >
              Skip Tour
            </Button>
            <div className="flex gap-2">
              {currentStep > 0 && (
                <Button variant="outline" onClick={handleBack}>
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Back
                </Button>
              )}
              <Button onClick={handleNext}>
                {currentStep === TOUR_STEPS.length - 1 ? (
                  'Get Started'
                ) : (
                  <>
                    Next
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

