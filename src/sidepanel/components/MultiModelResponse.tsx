import React, { useState, useEffect } from 'react'
import { z } from 'zod'
import { Loader2 } from 'lucide-react'
import { MarkdownContent } from './shared/Markdown'

// Schema for multi-model response content
const MultiModelContentSchema = z.object({
  __multiModel: z.literal(true),
  loading: z.boolean().optional(),
  providers: z.array(z.string()).optional(),
  responses: z.record(z.string(), z.string()).optional()
})

type MultiModelContent = z.infer<typeof MultiModelContentSchema>

// Props schema
const MultiModelResponsePropsSchema = z.object({
  content: z.string()  // JSON string of multi-model response
})

type MultiModelResponseProps = z.infer<typeof MultiModelResponsePropsSchema>

/**
 * Parse content to check if it's a multi-model response
 */
export function isMultiModelResponse(content: string): boolean {
  try {
    const parsed = JSON.parse(content)
    return parsed.__multiModel === true
  } catch {
    return false
  }
}

/**
 * Component for displaying multi-model responses in tabs
 */
export function MultiModelResponse({ content }: MultiModelResponseProps) {
  const [activeTab, setActiveTab] = useState<string>('')
  const [userSelected, setUserSelected] = useState<boolean>(false)  // Track if user manually selected a tab

  let parsed: MultiModelContent
  try {
    parsed = MultiModelContentSchema.parse(JSON.parse(content))
  } catch {
    return <div className="text-red-500">Failed to parse multi-model response</div>
  }

  // Loading state
  if (parsed.loading && parsed.providers) {
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span className="text-sm">Querying {parsed.providers.length} models...</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {parsed.providers.map((provider) => (
            <span
              key={provider}
              className="px-2 py-1 text-xs bg-muted rounded-md"
            >
              {provider}
            </span>
          ))}
        </div>
      </div>
    )
  }

  // Responses state
  if (!parsed.responses) {
    return <div className="text-muted-foreground">No responses received</div>
  }

  const responses = parsed.responses
  const modelNames = Object.keys(responses)

  // Set default active tab - prefer first completed response
  useEffect(() => {
    if (!activeTab && modelNames.length > 0) {
      const firstCompleted = modelNames.find(name => responses[name] !== '⏳ Loading...')
      setActiveTab(firstCompleted || modelNames[0])
    }
  }, [modelNames.length])

  // Auto-switch to first completed response if current tab is still loading (only if user hasn't manually selected)
  const currentResponse = responses[activeTab] || ''
  useEffect(() => {
    if (!userSelected && currentResponse === '⏳ Loading...' && modelNames.length > 0) {
      const firstCompleted = modelNames.find(name => responses[name] !== '⏳ Loading...')
      if (firstCompleted && firstCompleted !== activeTab) {
        setActiveTab(firstCompleted)
      }
    }
  }, [currentResponse, modelNames, activeTab, responses, userSelected])

  const isCurrentLoading = currentResponse === '⏳ Loading...'

  return (
    <div className="space-y-3">
      {/* Tab buttons */}
      <div className="flex flex-wrap gap-1 border-b border-border">
        {modelNames.map((modelName) => {
          const isLoading = responses[modelName] === '⏳ Loading...'
          const hasError = responses[modelName]?.startsWith('Error:')

          return (
            <button
              key={modelName}
              onClick={() => {
                setActiveTab(modelName)
                setUserSelected(true)  // Mark as user-selected to prevent auto-switching
              }}
              className={`px-3 py-1.5 text-xs font-medium transition-colors rounded-t-md flex items-center gap-1 ${
                activeTab === modelName
                  ? 'bg-brand text-white'
                  : isLoading
                    ? 'text-muted-foreground/50'
                    : hasError
                      ? 'text-red-500 hover:bg-red-50'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
              aria-selected={activeTab === modelName}
              role="tab"
            >
              {modelName}
              {isLoading && <Loader2 className="w-3 h-3 animate-spin" />}
            </button>
          )
        })}
      </div>

      {/* Response content */}
      <div className="max-w-none">
        {isCurrentLoading ? (
          <div className="flex items-center gap-2 text-muted-foreground py-4">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-sm">Waiting for {activeTab} response...</span>
          </div>
        ) : (
          <MarkdownContent
            content={currentResponse}
            className="break-words font-medium text-sm"
            compact={false}
          />
        )}
      </div>
    </div>
  )
}
