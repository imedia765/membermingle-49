import { supabase } from "@/integrations/supabase/client";

export const handleFirstTimeAuth = async (memberId: string, password: string) => {
  console.log("Handling first time auth for member:", memberId);

  try {
    // Step 1: Verify the member exists and get their details
    const { data: member, error: memberError } = await supabase
      .from('members')
      .select('*')
      .eq('member_number', memberId.toUpperCase())
      .maybeSingle();

    if (memberError) {
      console.error("Member lookup error:", memberError);
      throw new Error("Error looking up member details");
    }

    if (!member) {
      console.error("No member found with ID:", memberId);
      throw new Error("Invalid Member ID. Please check your credentials and try again.");
    }

    // Step 2: Verify the password matches their member ID (case-insensitive)
    if (password.toUpperCase() !== memberId.toUpperCase()) {
      throw new Error("For first-time login, your password must match your Member ID");
    }

    // Step 3: Create or sign in with temporary email
    const tempEmail = `${memberId.toLowerCase()}@temp.pwaburton.org`;
    console.log("Setting up auth for:", tempEmail);
    const upperPassword = password.toUpperCase();

    // Try to sign in first
    try {
      console.log("Attempting sign in with:", { email: tempEmail });
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: tempEmail,
        password: upperPassword,
      });

      if (!signInError && signInData.user) {
        console.log("Sign in successful for existing user:", signInData);
        return { success: true };
      }

      // If sign in fails, try to sign up
      console.log("Sign in failed, attempting sign up");
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: tempEmail,
        password: upperPassword,
        options: {
          data: {
            member_id: member.id,
            member_number: memberId.toUpperCase(),
          }
        }
      });

      if (signUpError) {
        console.error("Error creating auth user:", signUpError);
        throw signUpError;
      }

      // Wait a moment before attempting final sign in
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Try signing in one last time
      const { data: finalSignInData, error: finalSignInError } = await supabase.auth.signInWithPassword({
        email: tempEmail,
        password: upperPassword,
      });

      if (finalSignInError) {
        console.error("Error signing in after user creation:", finalSignInError);
        throw finalSignInError;
      }

      if (finalSignInData.user) {
        console.log("Final sign in successful:", finalSignInData);
        return { success: true };
      }

      throw new Error("Failed to authenticate after multiple attempts");

    } catch (error) {
      console.error("Authentication error:", error);
      throw error;
    }
  } catch (error) {
    console.error("First time auth error:", error);
    throw error;
  }
};