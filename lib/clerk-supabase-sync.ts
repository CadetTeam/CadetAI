// Client-side user sync service that calls our API routes
export class ClerkSupabaseSync {
  constructor() {
    // No initialization needed for client-side
  }

  // Sync user data from Clerk to Supabase via API route
  async syncUserToSupabase(clerkUserId: string) {
    try {
      const response = await fetch('/api/sync-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ clerkUserId })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to sync user')
      }

      const result = await response.json()
      console.log('User synced to Supabase:', result.data)
      return result.data
    } catch (error) {
      console.error('Error in syncUserToSupabase:', error)
      throw error
    }
  }

  // Handle user verification completion
  async handleUserVerificationComplete(clerkUserId: string) {
    try {
      // Sync user data first
      await this.syncUserToSupabase(clerkUserId)
      
      console.log(`User ${clerkUserId} sync completed`)
      return { verified: true, synced: true }
    } catch (error) {
      console.error('Error handling user verification:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      return { verified: false, synced: false, error: errorMessage }
    }
  }
}

// Singleton instance
export const clerkSupabaseSync = new ClerkSupabaseSync()
