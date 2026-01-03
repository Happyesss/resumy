'use server';

import { createClient, createServiceClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

/**
 * Delete user account and all associated data
 * This action will:
 * 1. Verify user authentication
 * 2. Delete all user data from database (profiles, resumes, jobs, etc.)
 * 3. Delete the user from Supabase Auth
 * 4. Sign out the user and redirect to home page
 */
export async function deleteAccount(password: string): Promise<{ success: boolean; error?: string }> {
  try {
    // Create authenticated client
    const supabase = await createClient();
    
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return { 
        success: false, 
        error: "You must be logged in to delete your account" 
      };
    }

    // Verify password by attempting to sign in
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user?.email) {
      return { 
        success: false, 
        error: "Could not verify user email" 
      };
    }

    // Verify password
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: userData.user.email,
      password: password,
    });

    if (signInError) {
      return { 
        success: false, 
        error: "Incorrect password. Please try again." 
      };
    }

    const userId = user.id;

    // Use service role client for deletion (has admin privileges)
    const serviceClient = await createServiceClient();

    // Delete all user data from database
    // Note: ON DELETE CASCADE in schema will automatically delete related records
    // But we'll explicitly delete for clarity and to handle any edge cases
    
    // Delete resumes (will cascade to cover letters)
    const { error: resumesError } = await serviceClient
      .from('resumes')
      .delete()
      .eq('user_id', userId);

    if (resumesError) {
      console.error('Error deleting resumes:', resumesError);
      // Continue anyway - we'll still try to delete the user
    }

    // Delete jobs
    const { error: jobsError } = await serviceClient
      .from('jobs')
      .delete()
      .eq('user_id', userId);

    if (jobsError) {
      console.error('Error deleting jobs:', jobsError);
      // Continue anyway
    }

    // Delete profile
    const { error: profileError } = await serviceClient
      .from('profiles')
      .delete()
      .eq('user_id', userId);

    if (profileError) {
      console.error('Error deleting profile:', profileError);
      // Continue anyway
    }

    // Delete any other user-related data (notifications, feedback, etc.)
    const { error: notificationsError } = await serviceClient
      .from('notifications')
      .delete()
      .eq('user_id', userId);

    if (notificationsError) {
      console.error('Error deleting notifications:', notificationsError);
      // Continue anyway - table might not exist
    }

    // Delete push subscriptions
    const { error: pushSubsError } = await serviceClient
      .from('push_subscriptions')
      .delete()
      .eq('user_id', userId);

    if (pushSubsError) {
      console.error('Error deleting push subscriptions:', pushSubsError);
      // Continue anyway
    }

    // Delete resume shares (if exists)
    const { error: sharesError } = await serviceClient
      .from('resume_shares')
      .delete()
      .eq('user_id', userId);

    if (sharesError) {
      console.error('Error deleting resume shares:', sharesError);
      // Continue anyway
    }

    // Finally, delete the user from Supabase Auth
    const { error: deleteUserError } = await serviceClient.auth.admin.deleteUser(userId);

    if (deleteUserError) {
      console.error('Error deleting user from auth:', deleteUserError);
      return { 
        success: false, 
        error: "Failed to delete account. Please contact support." 
      };
    }

    // Sign out the user
    await supabase.auth.signOut();

    // Revalidate paths
    revalidatePath('/', 'layout');
    
    return { success: true };
  } catch (error) {
    console.error('Unexpected error deleting account:', error);
    return { 
      success: false, 
      error: "An unexpected error occurred. Please try again." 
    };
  }
}

/**
 * Handle post-deletion redirect
 * Call this from the client after successful deletion
 */
export async function redirectAfterDeletion() {
  redirect('/');
}
