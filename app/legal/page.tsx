'use client';

import { useState } from 'react';

export default function LegalPage() {
  const [activeTab, setActiveTab] = useState('terms');

  const tabs = [
    { id: 'terms', label: 'Terms of Service', icon: '📜' },
    { id: 'privacy', label: 'Privacy Policy', icon: '🔒' },
    { id: 'compliance', label: 'Compliance', icon: '§' },
    { id: 'disclaimers', label: 'Disclaimers', icon: '[!]' },
    { id: 'cookies', label: 'Cookies', icon: '🍪' },
    { id: 'accessibility', label: 'Accessibility', icon: '♿' }
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-4">Legal Information</h1>
        <p className="text-slate-400">
          Important legal information, policies, and disclaimers for LabelLens users.
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-slate-800 rounded-lg p-8">
        {/* Terms of Service */}
        {activeTab === 'terms' && (
          <div className="prose prose-invert max-w-none">
            <h2 className="text-2xl font-bold text-white mb-6">Terms of Service</h2>
            <p className="text-slate-400 text-sm mb-6">
              Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>

            <section className="mb-8">
              <h3 className="text-xl font-semibold text-white mb-4">1. Acceptance of Terms</h3>
              <div className="text-slate-300 space-y-4">
                <p>
                  By accessing and using LabelLens, you accept and agree to be bound by the terms and provision of this agreement.
                  If you do not agree to abide by the above, please do not use this service.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h3 className="text-xl font-semibold text-white mb-4">2. Description of Service</h3>
              <div className="text-slate-300 space-y-4">
                <p>
                  LabelLens is a food label analysis tool that provides automated analysis of ingredient lists,
                  including identification of additives, allergens, and processing classifications.
                </p>
                <p>
                  The service is provided "as is" and is intended for informational and educational purposes only.
                  It should not be used as the sole basis for dietary or health decisions.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h3 className="text-xl font-semibold text-white mb-4">3. User Responsibilities</h3>
              <div className="text-slate-300 space-y-4">
                <p>You agree to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Use the service lawfully and in accordance with these terms</li>
                  <li>Not attempt to reverse engineer, decompile, or extract proprietary algorithms</li>
                  <li>Not use the service for commercial analysis without explicit permission</li>
                  <li>Verify critical information with authoritative sources</li>
                  <li>Not submit false or misleading ingredient information deliberately</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h3 className="text-xl font-semibold text-white mb-4">4. Intellectual Property</h3>
              <div className="text-slate-300 space-y-4">
                <p>
                  LabelLens and its original content, features, and functionality are owned by the service provider
                  and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
                </p>
                <p>
                  User-generated content (ingredient lists submitted for analysis) remains the property of the user,
                  but users grant LabelLens a license to process and analyze this content for service provision.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h3 className="text-xl font-semibold text-white mb-4">5. Limitation of Liability</h3>
              <div className="text-slate-300 space-y-4">
                <p>
                  In no event shall LabelLens be liable for any indirect, incidental, special, consequential,
                  or punitive damages, including without limitation, loss of profits, data, use, goodwill,
                  or other intangible losses resulting from your use of the service.
                </p>
              </div>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-white mb-4">6. Changes to Terms</h3>
              <div className="text-slate-300 space-y-4">
                <p>
                  We reserve the right to modify or replace these terms at any time. If a revision is material,
                  we will provide at least 30 days notice prior to any new terms taking effect.
                </p>
              </div>
            </section>
          </div>
        )}

        {/* Privacy Policy */}
        {activeTab === 'privacy' && (
          <div className="prose prose-invert max-w-none">
            <h2 className="text-2xl font-bold text-white mb-6">Privacy Policy</h2>
            <p className="text-slate-400 text-sm mb-6">
              Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>

            <section className="mb-8">
              <h3 className="text-xl font-semibold text-white mb-4">Data Collection</h3>
              <div className="text-slate-300 space-y-4">
                <p>We collect information in the following ways:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Ingredient Data:</strong> Text you submit for analysis</li>
                  <li><strong>Usage Analytics:</strong> How you interact with the service (if enabled)</li>
                  <li><strong>Technical Data:</strong> Browser type, device information, IP address</li>
                  <li><strong>Local Storage:</strong> Preferences and analysis history stored on your device</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h3 className="text-xl font-semibold text-white mb-4">Data Usage</h3>
              <div className="text-slate-300 space-y-4">
                <p>Your data is used to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Provide accurate ingredient analysis</li>
                  <li>Improve our algorithms and detection accuracy</li>
                  <li>Generate anonymized insights about food trends</li>
                  <li>Troubleshoot technical issues</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h3 className="text-xl font-semibold text-white mb-4">Data Sharing</h3>
              <div className="text-slate-300 space-y-4">
                <p>
                  We do not sell, trade, or otherwise transfer your personal information to third parties.
                  Anonymized, aggregated data may be shared with research institutions for food safety research.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h3 className="text-xl font-semibold text-white mb-4">Data Retention</h3>
              <div className="text-slate-300 space-y-4">
                <p>
                  Analysis data is stored locally on your device. Server logs are retained for 90 days for security purposes.
                  You can delete your local data at any time through the settings page.
                </p>
              </div>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-white mb-4">Your Rights</h3>
              <div className="text-slate-300 space-y-4">
                <p>You have the right to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Access your personal data</li>
                  <li>Correct inaccurate data</li>
                  <li>Delete your data</li>
                  <li>Export your data</li>
                  <li>Opt out of analytics</li>
                </ul>
              </div>
            </section>
          </div>
        )}

        {/* Compliance */}
        {activeTab === 'compliance' && (
          <div className="prose prose-invert max-w-none">
            <h2 className="text-2xl font-bold text-white mb-6">Regulatory Compliance</h2>

            <section className="mb-8">
              <h3 className="text-xl font-semibold text-white mb-4">Food Safety Disclaimer</h3>
              <div className="text-slate-300 space-y-4">
                <p>
                  LabelLens is not a substitute for professional nutritional advice or official regulatory guidance.
                  Our analysis is based on publicly available regulatory information and scientific research.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h3 className="text-xl font-semibold text-white mb-4">Regulatory Sources</h3>
              <div className="text-slate-300 space-y-4">
                <p>Our analysis incorporates data from:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>FDA Code of Federal Regulations (CFR)</li>
                  <li>Health Canada Food and Drug Regulations</li>
                  <li>European Food Safety Authority (EFSA) opinions</li>
                  <li>California Food Safety Act (AB 418)</li>
                  <li>WHO/FAO Codex Alimentarius</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h3 className="text-xl font-semibold text-white mb-4">Accuracy Limitations</h3>
              <div className="text-slate-300 space-y-4">
                <p>
                  While we strive for accuracy, regulations change frequently and interpretation can vary.
                  Always consult official regulatory sources for definitive information.
                </p>
              </div>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-white mb-4">GDPR Compliance</h3>
              <div className="text-slate-300 space-y-4">
                <p>
                  For users in the European Union, we comply with the General Data Protection Regulation (GDPR).
                  Processing is based on legitimate interest for service provision and consent for analytics.
                </p>
              </div>
            </section>
          </div>
        )}

        {/* Disclaimers */}
        {activeTab === 'disclaimers' && (
          <div className="prose prose-invert max-w-none">
            <h2 className="text-2xl font-bold text-white mb-6">Important Disclaimers</h2>

            <section className="mb-8">
              <h3 className="text-xl font-semibold text-white mb-4">[!] Medical Disclaimer</h3>
              <div className="text-slate-300 space-y-4">
                <p>
                  LabelLens is not intended to provide medical advice, diagnosis, or treatment.
                  Always consult with a qualified healthcare provider regarding health concerns or before making dietary changes.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h3 className="text-xl font-semibold text-white mb-4">🔬 Analysis Limitations</h3>
              <div className="text-slate-300 space-y-4">
                <p>
                  Our analysis may not detect all additives or allergens. Processing methods, concentrations,
                  and individual sensitivities can affect actual safety. Always read full product labels.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h3 className="text-xl font-semibold text-white mb-4">* Data Accuracy</h3>
              <div className="text-slate-300 space-y-4">
                <p>
                  Scores and classifications are algorithmic estimates based on available data.
                  Scientific understanding and regulatory status of ingredients may change.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h3 className="text-xl font-semibold text-white mb-4">🌍 Regional Variations</h3>
              <div className="text-slate-300 space-y-4">
                <p>
                  Regulatory status varies by jurisdiction. An ingredient legal in one country may be banned in another.
                  Check local regulations for your specific location.
                </p>
              </div>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-white mb-4">🔄 Information Currency</h3>
              <div className="text-slate-300 space-y-4">
                <p>
                  Regulatory information is updated regularly but may not reflect the most recent changes.
                  For time-sensitive decisions, verify with current official sources.
                </p>
              </div>
            </section>
          </div>
        )}

        {/* Cookies */}
        {activeTab === 'cookies' && (
          <div className="prose prose-invert max-w-none">
            <h2 className="text-2xl font-bold text-white mb-6">Cookie Policy</h2>

            <section className="mb-8">
              <h3 className="text-xl font-semibold text-white mb-4">What Are Cookies?</h3>
              <div className="text-slate-300 space-y-4">
                <p>
                  Cookies are small text files stored on your device when you visit our website.
                  They help us provide a better user experience by remembering your preferences.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h3 className="text-xl font-semibold text-white mb-4">Types of Cookies We Use</h3>
              <div className="text-slate-300 space-y-4">
                <div className="bg-slate-700 rounded-lg p-4">
                  <h4 className="font-semibold mb-2">🔧 Essential Cookies</h4>
                  <p>Required for basic functionality like settings and preferences.</p>
                </div>
                <div className="bg-slate-700 rounded-lg p-4">
                  <h4 className="font-semibold mb-2">* Analytics Cookies</h4>
                  <p>Help us understand how you use the service (only with your consent).</p>
                </div>
                <div className="bg-slate-700 rounded-lg p-4">
                  <h4 className="font-semibold mb-2">💾 Functional Cookies</h4>
                  <p>Remember your analysis history and custom settings.</p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h3 className="text-xl font-semibold text-white mb-4">Managing Cookies</h3>
              <div className="text-slate-300 space-y-4">
                <p>You can control cookies through:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Browser settings (delete or block cookies)</li>
                  <li>Our privacy settings page</li>
                  <li>Incognito/private browsing mode</li>
                </ul>
              </div>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-white mb-4">Local Storage</h3>
              <div className="text-slate-300 space-y-4">
                <p>
                  We also use browser local storage to save your analysis history and preferences locally on your device.
                  This data never leaves your device unless you explicitly export it.
                </p>
              </div>
            </section>
          </div>
        )}

        {/* Accessibility */}
        {activeTab === 'accessibility' && (
          <div className="prose prose-invert max-w-none">
            <h2 className="text-2xl font-bold text-white mb-6">Accessibility Statement</h2>

            <section className="mb-8">
              <h3 className="text-xl font-semibold text-white mb-4">Our Commitment</h3>
              <div className="text-slate-300 space-y-4">
                <p>
                  LabelLens is committed to ensuring digital accessibility for people with disabilities.
                  We are continually improving the user experience for everyone.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h3 className="text-xl font-semibold text-white mb-4">Standards Compliance</h3>
              <div className="text-slate-300 space-y-4">
                <p>We strive to conform to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>WCAG 2.1 Level AA guidelines</li>
                  <li>Section 508 of the Rehabilitation Act</li>
                  <li>ADA Title III requirements</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h3 className="text-xl font-semibold text-white mb-4">Accessibility Features</h3>
              <div className="text-slate-300 space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-slate-700 rounded-lg p-4">
                    <h4 className="font-semibold mb-2">* Keyboard Navigation</h4>
                    <p>Full keyboard accessibility with logical tab order</p>
                  </div>
                  <div className="bg-slate-700 rounded-lg p-4">
                    <h4 className="font-semibold mb-2">* Screen Reader Support</h4>
                    <p>Semantic HTML and ARIA labels for assistive technologies</p>
                  </div>
                  <div className="bg-slate-700 rounded-lg p-4">
                    <h4 className="font-semibold mb-2">🎨 High Contrast</h4>
                    <p>Optional high contrast mode for better visibility</p>
                  </div>
                  <div className="bg-slate-700 rounded-lg p-4">
                    <h4 className="font-semibold mb-2">📱 Responsive Design</h4>
                    <p>Works across devices and screen sizes</p>
                  </div>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h3 className="text-xl font-semibold text-white mb-4">Known Issues</h3>
              <div className="text-slate-300 space-y-4">
                <p>
                  We are aware of some accessibility limitations and are actively working to address them.
                  If you encounter barriers, please contact us for assistance.
                </p>
              </div>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-white mb-4">Feedback</h3>
              <div className="text-slate-300 space-y-4">
                <p>
                  We welcome feedback about the accessibility of LabelLens. If you encounter accessibility barriers,
                  please contact us through our feedback page with details about the issue.
                </p>
              </div>
            </section>
          </div>
        )}
      </div>

      {/* Contact Information */}
      <div className="mt-8 bg-slate-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Contact Us</h3>
        <div className="text-slate-300 space-y-2">
          <p>
            If you have questions about these legal documents or need assistance,
            please contact us through our feedback page.
          </p>
          <div className="flex gap-4 mt-4">
            <a 
              href="/feedback" 
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors"
            >
              📧 Submit Feedback
            </a>
            <a 
              href="/about" 
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
            >
              Info Learn More
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
