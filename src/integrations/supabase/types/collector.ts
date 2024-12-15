export type Collector = {
  Row: {
    active: boolean | null
    created_at: string
    email: string | null
    id: string
    name: string
    number: string
    phone: string | null
    prefix: string
    updated_at: string
  }
  Insert: {
    active?: boolean | null
    created_at?: string
    email?: string | null
    id?: string
    name: string
    number: string
    phone?: string | null
    prefix: string
    updated_at?: string
  }
  Update: {
    active?: boolean | null
    created_at?: string
    email?: string | null
    id?: string
    name?: string
    number?: string
    phone?: string | null
    prefix?: string
    updated_at?: string
  }
  Relationships: []
}