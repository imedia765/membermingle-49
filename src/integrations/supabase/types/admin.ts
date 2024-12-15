export type AdminNote = {
  Row: {
    admin_id: string | null
    created_at: string
    id: string
    member_id: string | null
    note: string
    updated_at: string
  }
  Insert: {
    admin_id?: string | null
    created_at?: string
    id?: string
    member_id?: string | null
    note: string
    updated_at?: string
  }
  Update: {
    admin_id?: string | null
    created_at?: string
    id?: string
    member_id?: string | null
    note?: string
    updated_at?: string
  }
  Relationships: [
    {
      foreignKeyName: "admin_notes_admin_id_fkey"
      columns: ["admin_id"]
      isOneToOne: false
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    },
    {
      foreignKeyName: "admin_notes_member_id_fkey"
      columns: ["member_id"]
      isOneToOne: false
      referencedRelation: "members"
      referencedColumns: ["id"]
    }
  ]
}