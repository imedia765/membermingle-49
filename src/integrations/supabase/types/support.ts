export type SupportTicket = {
  Row: {
    created_at: string
    description: string
    id: string
    member_id: string | null
    priority: string | null
    status: string | null
    subject: string
    updated_at: string
  }
  Insert: {
    created_at?: string
    description: string
    id?: string
    member_id?: string | null
    priority?: string | null
    status?: string | null
    subject: string
    updated_at?: string
  }
  Update: {
    created_at?: string
    description?: string
    id?: string
    member_id?: string | null
    priority?: string | null
    status?: string | null
    subject?: string
    updated_at?: string
  }
  Relationships: [
    {
      foreignKeyName: "support_tickets_member_id_fkey"
      columns: ["member_id"]
      isOneToOne: false
      referencedRelation: "members"
      referencedColumns: ["id"]
    }
  ]
}

export type TicketResponse = {
  Row: {
    created_at: string
    id: string
    responder_id: string | null
    response: string
    ticket_id: string | null
    updated_at: string
  }
  Insert: {
    created_at?: string
    id?: string
    responder_id?: string | null
    response: string
    ticket_id?: string | null
    updated_at?: string
  }
  Update: {
    created_at?: string
    id?: string
    responder_id?: string | null
    response?: string
    ticket_id?: string | null
    updated_at?: string
  }
  Relationships: [
    {
      foreignKeyName: "ticket_responses_responder_id_fkey"
      columns: ["responder_id"]
      isOneToOne: false
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    },
    {
      foreignKeyName: "ticket_responses_ticket_id_fkey"
      columns: ["ticket_id"]
      isOneToOne: false
      referencedRelation: "support_tickets"
      referencedColumns: ["id"]
    }
  ]
}