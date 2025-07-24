import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Cookie, Settings, Shield, Eye } from "lucide-react";

export const metadata: Metadata = {
  title: "Cookie Policy - Resumy",
  description: "Learn about how Resumy uses cookies and similar technologies.",
};

export default function CookiePolicy() {
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
              <Cookie className="h-6 w-6 text-purple-400" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold">Cookie Policy</h1>
          </div>
          <p className="text-gray-400 text-lg">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-invert max-w-none">
          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">What Are Cookies?</h2>
              <div className="text-gray-300 space-y-4">
                <p>
                  Cookies are small text files that are stored on your device when you visit 
                  our website. They help us provide you with a better experience by remembering 
                  your preferences and improving our services.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">How We Use Cookies</h2>
              <div className="text-gray-300 space-y-4">
                <p>
                  Resumy uses cookies for the following purposes:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Authentication and security</li>
                  <li>Remembering your preferences and settings</li>
                  <li>Analyzing how our website is used</li>
                  <li>Improving our services and user experience</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-2">
                <Settings className="h-5 w-5 text-purple-400" />
                Types of Cookies We Use
              </h2>
              <div className="space-y-6">
                <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
                    <Shield className="h-5 w-5 text-green-400" />
                    Essential Cookies
                  </h3>
                  <p className="text-gray-300">
                    These cookies are necessary for the website to function properly. They enable 
                    core functionality such as security, network management, and accessibility.
                  </p>
                  <div className="mt-3 text-sm">
                    <span className="bg-green-600/20 text-green-300 px-2 py-1 rounded">Required</span>
                  </div>
                </div>

                <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
                    <Eye className="h-5 w-5 text-blue-400" />
                    Analytics Cookies
                  </h3>
                  <p className="text-gray-300">
                    These cookies help us understand how visitors interact with our website 
                    by collecting and reporting information anonymously.
                  </p>
                  <div className="mt-3 text-sm">
                    <span className="bg-blue-600/20 text-blue-300 px-2 py-1 rounded">Optional</span>
                  </div>
                </div>

                <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
                    <Settings className="h-5 w-5 text-purple-400" />
                    Preference Cookies
                  </h3>
                  <p className="text-gray-300">
                    These cookies remember your preferences and settings to provide a 
                    personalized experience when you return to our website.
                  </p>
                  <div className="mt-3 text-sm">
                    <span className="bg-purple-600/20 text-purple-300 px-2 py-1 rounded">Optional</span>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Third-Party Cookies</h2>
              <div className="text-gray-300 space-y-4">
                <p>
                  We may use third-party services that set their own cookies. These include:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>Supabase:</strong> For authentication and database services</li>
                  <li><strong>Analytics providers:</strong> To understand website usage</li>
                  <li><strong>AI service providers:</strong> For resume optimization features</li>
                </ul>
                <p>
                  These third parties have their own privacy policies and cookie practices, 
                  which we encourage you to review.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Managing Your Cookie Preferences</h2>
              <div className="text-gray-300 space-y-4">
                <p>
                  You have several options for managing cookies:
                </p>
                <div className="space-y-4">
                  <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4">
                    <h4 className="font-semibold text-white mb-2">Browser Settings</h4>
                    <p>
                      Most web browsers allow you to control cookies through their settings. 
                      You can typically choose to accept all cookies, reject all cookies, 
                      or be notified when a cookie is set.
                    </p>
                  </div>
                  <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4">
                    <h4 className="font-semibold text-white mb-2">Cookie Banner</h4>
                    <p>
                      When you first visit our website, you'll see a cookie consent banner 
                      where you can choose which types of cookies to accept.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Cookie Retention</h2>
              <div className="text-gray-300 space-y-4">
                <p>
                  Different cookies have different retention periods:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>Session cookies:</strong> Deleted when you close your browser</li>
                  <li><strong>Persistent cookies:</strong> Remain until they expire or you delete them</li>
                  <li><strong>Authentication cookies:</strong> Typically last for 30 days</li>
                  <li><strong>Preference cookies:</strong> Usually last for 1 year</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Changes to This Policy</h2>
              <div className="text-gray-300 space-y-4">
                <p>
                  We may update this Cookie Policy from time to time. Any changes will be 
                  posted on this page with an updated revision date. We encourage you to 
                  review this policy periodically.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Contact Us</h2>
              <div className="text-gray-300 space-y-4">
                <p>
                  If you have any questions about our use of cookies, please contact us:
                </p>
                <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4">
                  <p>Email: <a href="mailto:privacy@resumy.live" className="text-purple-400 hover:text-purple-300">privacy@resumy.live</a></p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
