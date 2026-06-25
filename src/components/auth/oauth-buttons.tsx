import { useState } from 'react'
import { Github } from "@/components/icons/github-icon"
import { Mail } from "@/components/icons/google-icon";
import { supabase } from '@/lib/client'
import { Button } from '@/components/ui/button'

export function OAuthButtons() {
  const [isLoading, setIsLoading] = useState(false)

  const handleOAuth = async (provider: 'google' | 'github') => {
    setIsLoading(true)
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      })
      if (error) throw error
    } catch (error) {
      console.error('OAuth error:', error)
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-3 pt-4">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-background px-2 text-muted-foreground">O continúa con</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <Button
          variant="outline"
          onClick={() => handleOAuth('google')}
          disabled={isLoading}
          className="w-full"
        >
          <Mail className="size-4 mr-2" />
          Google
        </Button>
        <Button
          variant="outline"
          onClick={() => handleOAuth('github')}
          disabled={isLoading}
          className="w-full"
        >
          <Github className="size-4 mr-2" />
          GitHub
        </Button>
      </div>
    </div>
  )
}
