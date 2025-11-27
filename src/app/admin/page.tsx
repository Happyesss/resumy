import { Metadata } from "next";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Page Not Found - Resumy",
  description: "The requested page could not be found.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminPage() {
    // Return 404 not found
    notFound();
}