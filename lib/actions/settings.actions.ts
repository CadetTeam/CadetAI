"use server"

import { cookies } from "next/headers"

export interface SettingsPayload {
  userSettings?: Record<string, unknown>
  orgSettings?: Record<string, unknown>
}

export async function fetchSettings() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/settings`, {
    method: 'GET',
    headers: { Cookie: cookies().toString() },
    cache: 'no-store'
  })
  if (!res.ok) throw new Error('Failed to fetch settings')
  return res.json()
}

export async function updateSettings(payload: SettingsPayload) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/settings`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Cookie: cookies().toString()
    },
    body: JSON.stringify(payload)
  })
  if (!res.ok) throw new Error('Failed to update settings')
  return res.json()
}


