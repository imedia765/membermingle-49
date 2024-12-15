import { AdminNote } from './admin'
import { Collector } from './collector'
import { Member, FamilyMember } from './member'
import { Payment } from './payment'
import { Profile } from './profile'
import { Registration } from './registration'
import { SupportTicket, TicketResponse } from './support'

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      admin_notes: AdminNote
      collectors: Collector
      family_members: FamilyMember
      members: Member
      payments: Payment
      profiles: Profile
      registrations: Registration
      support_tickets: SupportTicket
      ticket_responses: TicketResponse
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T]
export type TablesInsert<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type TablesUpdate<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']