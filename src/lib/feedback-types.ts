// Feedback and Bug Report Types

export type FeedbackType = 'bug' | 'feature' | 'improvement' | 'general';
export type FeedbackPriority = 'low' | 'medium' | 'high' | 'critical';
export type FeedbackStatus = 'pending' | 'in_review' | 'in_progress' | 'resolved' | 'closed' | 'wont_fix';

export interface Feedback {
  id: string;
  user_id: string | null;
  user_email: string | null;
  type: FeedbackType;
  priority: FeedbackPriority;
  status: FeedbackStatus;
  title: string;
  description: string;
  screenshot_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface FeedbackFormData {
  type: FeedbackType;
  priority: FeedbackPriority;
  title: string;
  description: string;
  screenshot?: File | null;
}

export interface FeedbackSubmitResponse {
  success: boolean;
  message: string;
  feedback_id?: string;
}

export const FEEDBACK_TYPE_OPTIONS: { value: FeedbackType; label: string; description: string; icon: string }[] = [
  { value: 'general', label: 'General Feedback', description: 'General comments or suggestions', icon: '💬' },
  { value: 'bug', label: 'Bug Report', description: 'Something is broken or not working correctly', icon: '🐛' },
  { value: 'feature', label: 'Feature Request', description: 'Suggest a new feature or capability', icon: '✨' },
  { value: 'improvement', label: 'Improvement', description: 'Suggest an enhancement to existing features', icon: '💡' },
];

export const FEEDBACK_PRIORITY_OPTIONS: { value: FeedbackPriority; label: string; color: string }[] = [
  { value: 'low', label: 'Low', color: 'bg-gray-500' },
  { value: 'medium', label: 'Medium', color: 'bg-blue-500' },
  { value: 'high', label: 'High', color: 'bg-orange-500' },
  { value: 'critical', label: 'Critical', color: 'bg-red-500' },
];

export const FEEDBACK_STATUS_OPTIONS: { value: FeedbackStatus; label: string; color: string }[] = [
  { value: 'pending', label: 'Pending', color: 'bg-yellow-500' },
  { value: 'in_review', label: 'In Review', color: 'bg-blue-500' },
  { value: 'in_progress', label: 'In Progress', color: 'bg-purple-500' },
  { value: 'resolved', label: 'Resolved', color: 'bg-green-500' },
  { value: 'closed', label: 'Closed', color: 'bg-gray-500' },
  { value: 'wont_fix', label: "Won't Fix", color: 'bg-red-500' },
];
