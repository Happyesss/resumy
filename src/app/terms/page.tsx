import { AlertTriangle, ArrowLeft, FileText, Mail, Users } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service - Resumy",
  description: "Read Resumy's terms of service and user agreement.",
};

export default function TermsOfService() {
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
              <FileText className="h-6 w-6 text-purple-400" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold">Terms of Service</h1>
          </div>
          <p className="text-gray-400 text-lg">
            Last updated: November 27, 2025
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-invert max-w-none">
          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Acceptance of Terms</h2>
              <div className="text-gray-300 space-y-4">
                <p>
                  By accessing and using Resumy, you accept and agree to be bound by the terms 
                  and provision of this agreement. If you do not agree to abide by the above, 
                  please do not use this service.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-2">
                <Users className="h-5 w-5 text-purple-400" />
                User Account
              </h2>
              <div className="text-gray-300 space-y-4">
                <p>
                  To access certain features of Resumy, you may need to create an account. 
                  You are responsible for:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Maintaining the confidentiality of your account credentials</li>
                  <li>All activities that occur under your account</li>
                  <li>Providing accurate and up-to-date information</li>
                  <li>Notifying us of any unauthorized use of your account</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Service Description</h2>
              <div className="text-gray-300 space-y-4">
                <p>
                  Resumy provides an AI-powered resume building platform that helps users create 
                  professional resumes. Our service includes:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Resume templates and design tools</li>
                  <li>AI-powered content suggestions and optimization</li>
                  <li>ATS compatibility checking</li>
                  <li>PDF and document export functionality</li>
                </ul>
                <p className="font-semibold text-purple-300">
                  All services are provided free of charge.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">User Content</h2>
              <div className="text-gray-300 space-y-4">
                <p>
                  You retain ownership of all content you create using Resumy. However, 
                  you grant us a limited license to:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Store and process your content to provide our services</li>
                  <li>Make backups for data protection purposes</li>
                  <li>Use anonymized, aggregated data to improve our services</li>
                </ul>
                <p>
                  You are responsible for ensuring your content is accurate, lawful, 
                  and does not infringe on third-party rights.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-400" />
                Prohibited Uses
              </h2>
              <div className="text-gray-300 space-y-4">
                <p>
                  You agree not to use Resumy for:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Any unlawful purpose or in violation of any applicable regulations</li>
                  <li>Creating false, misleading, or fraudulent resumes</li>
                  <li>Attempting to gain unauthorized access to our systems</li>
                  <li>Distributing malware or other harmful code</li>
                  <li>Interfering with the proper working of our services</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Disclaimer</h2>
              <div className="text-gray-300 space-y-4">
                <p>
                  Resumy is provided "as is" without warranties of any kind. While we strive 
                  to provide accurate and helpful tools, we cannot guarantee:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Job placement or interview success</li>
                  <li>Compatibility with all ATS systems</li>
                  <li>Uninterrupted or error-free service</li>
                  <li>Complete accuracy of AI suggestions</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Limitation of Liability</h2>
              <div className="text-gray-300 space-y-4">
                <p>
                  To the maximum extent permitted by law, Resumy shall not be liable for any 
                  indirect, incidental, special, consequential, or punitive damages resulting 
                  from your use of our services.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Changes to Terms</h2>
              <div className="text-gray-300 space-y-4">
                <p>
                  We reserve the right to modify these terms at any time. We will notify users 
                  of any material changes via email or through our service. Continued use after 
                  changes constitutes acceptance of the new terms.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-2">
                <Mail className="h-5 w-5 text-purple-400" />
                Contact Information
              </h2>
              <div className="text-gray-300 space-y-4">
                <p>
                  If you have questions about these Terms of Service, please contact us:
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
