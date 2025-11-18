import React, { useEffect, useState } from 'react'
import { Plus, X } from 'lucide-react'
import { Button } from '@/sidepanel/components/ui/button'
import { useChatStore } from '@/sidepanel/stores/chatStore'
import { LLMSettingsReader } from '@/lib/llm/settings/LLMSettingsReader'
import { BrowserOSProvider } from '@/lib/llm/settings/browserOSTypes'
import { z } from 'zod'

// Props schema
const ProviderSelectorPropsSchema = z.object({
  className: z.string().optional()  // Optional additional CSS classes
})

type ProviderSelectorProps = z.infer<typeof ProviderSelectorPropsSchema>

export function ProviderSelector({ className = '' }: ProviderSelectorProps) {
  const { selectedProviderIds, addSelectedProvider, removeSelectedProvider, setSelectedProviders } = useChatStore()
  const [availableProviders, setAvailableProviders] = useState<BrowserOSProvider[]>([])
  const [loading, setLoading] = useState(true)

  // Load available providers on mount
  useEffect(() => {
    const loadProviders = async () => {
      try {
        const config = await LLMSettingsReader.readAllProviders()
        setAvailableProviders(config.providers)

        // Try to load from Chrome storage first
        const storedIds = await new Promise<string[]>((resolve) => {
          try {
            chrome.storage?.local?.get('nxtscape-selected-providers', (result) => {
              if (result && Array.isArray(result['nxtscape-selected-providers']) && result['nxtscape-selected-providers'].length > 0) {
                resolve(result['nxtscape-selected-providers'])
              } else {
                resolve([])
              }
            })
          } catch {
            resolve([])
          }
        })

        if (storedIds.length > 0) {
          // Restore from storage
          setSelectedProviders(storedIds)
        } else if (selectedProviderIds.length === 0 && config.providers.length > 0) {
          // Set default provider if none selected
          const defaultProvider = config.providers.find(p => p.id === config.defaultProviderId) || config.providers[0]
          setSelectedProviders([defaultProvider.id])
        }
      } catch (error) {
        console.error('Failed to load providers:', error)
      } finally {
        setLoading(false)
      }
    }

    loadProviders()
  }, []) // Only run once on mount

  // Handle provider selection change
  const handleProviderChange = (index: number, newProviderId: string) => {
    const newSelectedIds = [...selectedProviderIds]
    newSelectedIds[index] = newProviderId
    setSelectedProviders(newSelectedIds)
  }

  // Add new provider selector
  const handleAddProvider = () => {
    // Find first provider not already selected
    const unselectedProvider = availableProviders.find(p => !selectedProviderIds.includes(p.id))
    if (unselectedProvider) {
      addSelectedProvider(unselectedProvider.id)
    }
  }

  // Remove provider selector
  const handleRemoveProvider = (providerId: string) => {
    removeSelectedProvider(providerId)
  }

  // Get provider display name
  const getProviderDisplayName = (providerId: string): string => {
    const provider = availableProviders.find(p => p.id === providerId)
    if (!provider) return providerId
    return provider.modelId || provider.name
  }

  if (loading) {
    return <div className="text-xs text-muted-foreground">Loading providers...</div>
  }

  if (availableProviders.length === 0) {
    return <div className="text-xs text-muted-foreground">No providers configured</div>
  }

  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      {selectedProviderIds.map((providerId, index) => (
        <div key={`${providerId}-${index}`} className="flex items-center gap-1">
          <select
            value={providerId}
            onChange={(e) => handleProviderChange(index, e.target.value)}
            className="h-7 px-2 text-xs bg-background border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-brand/50"
            aria-label={`Select provider ${index + 1}`}
          >
            {availableProviders.map((provider) => (
              <option key={provider.id} value={provider.id}>
                {provider.modelId || provider.name}
              </option>
            ))}
          </select>
          {selectedProviderIds.length > 1 && (
            <Button
              onClick={() => handleRemoveProvider(providerId)}
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 hover:bg-destructive/10 hover:text-destructive"
              aria-label={`Remove ${getProviderDisplayName(providerId)}`}
            >
              <X className="w-3 h-3" />
            </Button>
          )}
        </div>
      ))}

      {selectedProviderIds.length < availableProviders.length && (
        <Button
          onClick={handleAddProvider}
          variant="ghost"
          size="sm"
          className="h-7 px-2 text-xs"
          aria-label="Add another provider"
        >
          <Plus className="w-3 h-3 mr-1" />
          Add
        </Button>
      )}
    </div>
  )
}
