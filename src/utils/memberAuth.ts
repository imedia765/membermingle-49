import { supabase } from "@/integrations/supabase/client";

export const getMemberByMemberId = async (memberId: string) => {
  console.log("Looking up member with ID:", memberId);
  
  try {
    console.log("Looking up member with member_number:", memberId);
    const { data: members, error } = await supabase
      .from('members')
      .select('*')
      .eq('member_number', memberId)
      .limit(1);
    
    console.log("Raw query response:", { members, error });

    if (error) {
      throw error;
    }

    const member = members?.[0] || null;
    console.log("Final member lookup result:", member);
    
    return member;
  } catch (error) {
    console.error("Error looking up member:", error);
    throw error;
  }
};