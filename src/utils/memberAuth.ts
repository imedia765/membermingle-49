import { supabase } from "@/integrations/supabase/client";

export async function getMemberByMemberId(memberId: string) {
  console.log("Looking up member with member_number:", memberId);
  
  try {
    const { data, error } = await supabase
      .from('members')
      .select('*')
      .eq('member_number', memberId.toUpperCase().trim())
      .maybeSingle(); // Use maybeSingle() instead of single()

    if (error) {
      console.error("Database error when looking up member:", error);
      throw error;
    }

    console.log("Member lookup result:", data);
    return data;
  } catch (error) {
    console.error("Error in getMemberByMemberId:", error);
    return null;
  }
}

export async function verifyMemberPassword(memberId: string, password: string) {
  const member = await getMemberByMemberId(memberId);
  
  if (!member) {
    console.log("No member found for verification");
    return false;
  }

  // For development, just check if password matches member number
  // In production, this should use proper password hashing
  return password === member.member_number;
}