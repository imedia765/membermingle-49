export interface Member {
  id: string;
  member_number: string;
  collector_id: string | null;
  full_name: string;
  date_of_birth: string | null;
  gender: string | null;
  marital_status: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  postcode: string | null;
  town: string | null;
  status: string | null;
  verified: boolean | null;
  created_at: string;
  updated_at: string;
  membership_type: string | null;
  collector: string | null;
  cors_enabled: boolean | null;
  name?: string; // Added for CoveredMembersOverview compatibility
  coveredMembers?: {
    spouses?: Array<{ name: string; dateOfBirth: string }>;
    dependants?: Array<{ name: string; dateOfBirth: string; relationship: string }>;
  };
}