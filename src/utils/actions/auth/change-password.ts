'use server';

import { createClient } from "@/utils/supabase/server";

interface ChangePasswordResult {
  success: boolean;
  error?: string;
}

export async function changePassword(
  newPassword: string
): Promise<ChangePasswordResult> {
  try {
    const supabase = await createClient();
    
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return { success: false, error: 'User not authenticated' };
    }

    if (!user.email) {
      return { success: false, error: 'User email not found' };
    }

    // Update to new password - user is already authenticated, no need to verify current password
    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword
    });

    if (updateError) {
      return { success: false, error: updateError.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Password change error:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}
