export type Registration = {
  Row: {
    created_at: string
    id: string
    member_id: string | null
    status: string | null
    updated_at: string
  }
  Insert: {
    created_at?: string
    id?: string
    member_id?: string | null
    status?: string | null
    updated_at?: string
  }
  Update: {
    created_at?: string
    id?: string
    member_id?: string | null
    status?: string | null
    updated_at?: string
  }
  Relationships: [
    {
      foreignKeyName: "registrations_member_id_fkey"
      columns: ["member_id"]
      isOneToOne: false
      referencedRelation: "members"
      referencedColumns: ["id"]
    }
  ]
}