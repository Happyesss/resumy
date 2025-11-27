import { getAllFeedback, getFeedbackStats } from "@/app/feedback/actions";
import { Metadata } from "next";
import { ensureAdmin } from "../actions";
import { FeedbackAdminClient } from "./FeedbackAdminClient";

export const metadata: Metadata = {
  title: "Feedback Management - Admin",
  description: "Manage user feedback and bug reports",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminFeedbackPage() {
  // Check admin access
  await ensureAdmin();

  // Fetch initial data
  const [feedbackResult, stats] = await Promise.all([
    getAllFeedback({ page: 1, limit: 20 }),
    getFeedbackStats(),
  ]);

  return (
    <FeedbackAdminClient 
      initialFeedback={feedbackResult.data}
      initialTotal={feedbackResult.total}
      stats={stats}
    />
  );
}
