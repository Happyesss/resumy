import { redirect } from "next/navigation";
import { getDashboardData } from "@/utils/actions";
import { ProfileEditForm } from "@/components/profile/profile-edit-form";
import { Suspense } from "react";

// Force dynamic behavior and disable caching
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function EditProfilePage() {
  // Fetch profile data and handle authentication
  let data;
  try {
    data = await getDashboardData();
  } catch (error: unknown) {
    void error
    redirect("/");
  }

  const { profile } = data;

  // Display a friendly message if no profile exists
  if (!profile) {
    redirect("/home");
  }

  return (
    <main className="min-h-screen relative bg-black">
      {/* Main Content Layer */}
      <div className="relative z-10 w-full">
        <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
          <ProfileEditForm profile={profile} />
        </Suspense>
      </div>
    </main>
  );
} 