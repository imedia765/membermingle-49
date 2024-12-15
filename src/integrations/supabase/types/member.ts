export type Member = {
  Row: {
    address: string | null
    collector_id: string | null
    created_at: string
    date_of_birth: string | null
    email: string | null
    full_name: string
    gender: string | null
    id: string
    marital_status: string | null
    member_number: string
    phone: string | null
    postcode: string | null
    status: string | null
    town: string | null
    updated_at: string
    verified: boolean | null
  }
  Insert: {
    address?: string | null
    collector_id?: string | null
    created_at?: string
    date_of_birth?: string | null
    email?: string | null
    full_name: string
    gender?: string | null
    id?: string
    marital_status?: string | null
    member_number: string
    phone?: string | null
    postcode?: string | null
    status?: string | null
    town?: string | null
    updated_at?: string
    verified?: boolean | null
  }
  Update: {
    address?: string | null
    collector_id?: string | null
    created_at?: string
    date_of_birth?: string | null
    email?: string | null
    full_name?: string
    gender?: string | null
    id?: string
    marital_status?: string | null
    member_number?: string
    phone?: string | null
    postcode?: string | null
    status?: string | null
    town?: string | null
    updated_at?: string
    verified?: boolean | null
  }
  Relationships: [
    {
      foreignKeyName: "members_collector_id_fkey"
      columns: ["collector_id"]
      isOneToOne: false
      referencedRelation: "collectors"
      referencedColumns: ["id"]
    }
  ]
}

export type FamilyMember = {
  Row: {
    created_at: string
    date_of_birth: string | null
    gender: string | null
    id: string
    member_id: string | null
    name: string
    relationship: string
    updated_at: string
  }
  Insert: {
    created_at?: string
    date_of_birth?: string | null
    gender?: string | null
    id?: string
    member_id?: string | null
    name: string
    relationship: string
    updated_at?: string
  }
  Update: {
    created_at?: string
    date_of_birth?: string | null
    gender?: string | null
    id?: string
    member_id?: string | null
    name?: string
    relationship?: string
    updated_at?: string
  }
  Relationships: [
    {
      foreignKeyName: "family_members_member_id_fkey"
      columns: ["member_id"]
      isOneToOne: false
      referencedRelation: "members"
      referencedColumns: ["id"]
    }
  ]
}