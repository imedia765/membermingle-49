export type Payment = {
  Row: {
    amount: number
    collector_id: string | null
    created_at: string
    id: string
    member_id: string | null
    notes: string | null
    payment_date: string
    payment_type: string
    status: string | null
    updated_at: string
  }
  Insert: {
    amount: number
    collector_id?: string | null
    created_at?: string
    id?: string
    member_id?: string | null
    notes?: string | null
    payment_date?: string
    payment_type: string
    status?: string | null
    updated_at?: string
  }
  Update: {
    amount?: number
    collector_id?: string | null
    created_at?: string
    id?: string
    member_id?: string | null
    notes?: string | null
    payment_date?: string
    payment_type?: string
    status?: string | null
    updated_at?: string
  }
  Relationships: [
    {
      foreignKeyName: "payments_collector_id_fkey"
      columns: ["collector_id"]
      isOneToOne: false
      referencedRelation: "collectors"
      referencedColumns: ["id"]
    },
    {
      foreignKeyName: "payments_member_id_fkey"
      columns: ["member_id"]
      isOneToOne: false
      referencedRelation: "members"
      referencedColumns: ["id"]
    }
  ]
}