import { Link } from "wouter";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-8">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">Terms and Conditions</h1>
          <p className="text-lg text-slate-600 dark:text-slate-300 mb-8">
            <strong>Effective Date:</strong> January 7, 2025
          </p>

          <p className="text-lg text-slate-600 dark:text-slate-300 mb-8">
            By accessing or using any part of this website or the services provided by <strong>OnyxHooks & More™</strong>, you agree to be bound by the following Terms and Conditions. If you do not agree with these terms, you may not access or use our services.
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">1. Use of Services</h2>
            <p className="text-slate-600 dark:text-slate-300">
              You must be at least 18 years old or have legal parental/guardian consent to use this platform. By using the platform, you warrant that you meet these requirements.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">2. Intellectual Property</h2>
            <p className="text-slate-600 dark:text-slate-300">
              All materials, AI-generated outputs, marketing templates, content, and tools provided on this site are proprietary to <strong>OnyxHooks & More™</strong>. They may not be copied, reproduced, republished, uploaded, posted, transmitted, or distributed in any form without prior written consent. Misuse may result in account termination or legal action.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">3. Subscription & Billing</h2>
            <p className="text-slate-600 dark:text-slate-300 mb-4">
              Subscription tiers, pricing, and billing policies are clearly outlined on the <Link href="/pricing" className="text-blue-600 hover:underline">Pricing page</Link>. By subscribing to any tier, you agree to automatic renewals according to the billing cycle (monthly or annual).
            </p>
            <p className="text-slate-600 dark:text-slate-300">
              Refunds are only issued for duplicate charges or billing errors. Vault tier subscriptions are annual commitments with terms defined at checkout. Users are encouraged to try the Free Tier before upgrading.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">4. Modifications</h2>
            <p className="text-slate-600 dark:text-slate-300">
              We reserve the right to update, revise, or modify these Terms at any time without prior notice. Continued use of the website or services after changes indicates your acceptance of the updated terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">5. Termination</h2>
            <p className="text-slate-600 dark:text-slate-300">
              We may suspend or terminate your account at any time for violations of these Terms or misuse of the platform. In such cases, no refunds will be issued.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">6. Limitation of Liability</h2>
            <p className="text-slate-600 dark:text-slate-300">
              <strong>OnyxHooks & More™</strong> is not liable for any direct, indirect, incidental, or consequential damages arising from the use of this platform. Users are responsible for how they use AI-generated content and marketing materials.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">7. Contact</h2>
            <p className="text-slate-600 dark:text-slate-300">
              If you have any questions about these Terms, please contact us at:<br />
              📧 <a href="mailto:support@onyxnpearls.com" className="text-blue-600 hover:underline">support@onyxnpearls.com</a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}