import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Shield, Eye, Lock, Mail } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy - Resumy",
  description: "Learn how Resumy protects your privacy and handles your personal data.",
};

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-purple-600/20 rounded-xl">
              <Shield className="h-6 w-6 text-purple-400" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold">Privacy Policy</h1>
          </div>
          <p className="text-gray-400 text-lg">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-invert max-w-none">
          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-2">
                <Eye className="h-5 w-5 text-purple-400" />
                Information We Collect
              </h2>
              <div className="text-gray-300 space-y-4">
                <p>
                  Resumy collects minimal information necessary to provide our services:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Account information (email address, name) when you sign up</li>
                  <li>Resume content you create using our platform</li>
                  <li>Usage analytics to improve our service (anonymized)</li>
                  <li>Technical data like IP address and browser information</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-2">
                <Lock className="h-5 w-5 text-purple-400" />
                How We Use Your Information
              </h2>
              <div className="text-gray-300 space-y-4">
                <p>
                  We use your information solely to:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Provide and improve our resume building services</li>
                  <li>Send important updates about your account</li>
                  <li>Provide customer support when requested</li>
                  <li>Analyze usage patterns to enhance our platform</li>
                </ul>
                <p className="font-semibold text-purple-300">
                  We never sell, rent, or share your personal information with third parties for marketing purposes.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Data Security</h2>
              <div className="text-gray-300 space-y-4">
                <p>
                  Your data security is our priority. We implement industry-standard security measures:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Encryption of data in transit and at rest</li>
                  <li>Regular security audits and updates</li>
                  <li>Limited access to your data on a need-to-know basis</li>
                  <li>Secure hosting with enterprise-grade infrastructure</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Your Rights</h2>
              <div className="text-gray-300 space-y-4">
                <p>
                  You have the right to:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Access your personal data</li>
                  <li>Correct inaccurate information</li>
                  <li>Delete your account and data</li>
                  <li>Export your resume data</li>
                  <li>Opt out of non-essential communications</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Data Retention</h2>
              <div className="text-gray-300 space-y-4">
                <p>
                  We retain your data only as long as necessary to provide our services. 
                  When you delete your account, we will permanently delete your personal information 
                  within 30 days, except where required by law.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-2">
                <Mail className="h-5 w-5 text-purple-400" />
                Contact Us
              </h2>
              <div className="text-gray-300 space-y-4">
                <p>
                  If you have any questions about this Privacy Policy or our data practices, 
                  please contact us at:
                </p>
                <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4">
                  <p>Email: <a href="mailto:resumy.co@gmail.com" className="text-purple-400 hover:text-purple-300">resumy.co@gmail.com</a></p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
