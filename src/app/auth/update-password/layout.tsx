import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Update Password | Change Your Account Password - Resumy",
  description: "Update your Resumy account password. Keep your AI resume builder account secure with a new password.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function UpdatePasswordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
