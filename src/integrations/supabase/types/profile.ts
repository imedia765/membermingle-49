export type Profile = {
  Row: {
    created_at: string
    email: string | null
    id: string
    updated_at: string
    user_id: string | null
  }
  Insert: {
    created_at?: string
    email?: string | null
    id?: string
    updated_at?: string
    user_id?: string | null
  }
  Update: {
    created_at?: string
    email?: string | null
    id?: string
    updated_at?: string
    user_id?: string | null
  }
  Relationships: []
}