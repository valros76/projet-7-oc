export type LeadStatus = "pending" | "accepted" | "refused" | "finished"

export interface Lead {
  id: number
  referrerId: number
  companyName: string
  contactFirstName: string
  contactLastName: string
  clientSiret?: string | null
  clientEmail: string
  clientPhone: string
  missionTitle: string
  missionStartDate: string
  durationDays?: number | null
  isIndefiniteDuration: boolean
  commissionRate: string
  status: LeadStatus
  createdAt?: string
  updatedAt?: string
}

export interface LeadsApiResponse {
  success: boolean
  leads: Lead[]
}