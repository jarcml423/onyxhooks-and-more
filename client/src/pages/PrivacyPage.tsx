export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-8">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">Privacy Policy</h1>
          <p className="text-lg text-slate-600 dark:text-slate-300 mb-8">
            <strong>Effective Date:</strong> 7/1/2025
          </p>

          <p className="text-lg text-slate-600 dark:text-slate-300 mb-8">
            This Privacy Policy outlines how <strong>Onyx & Pearls Management, Inc.</strong> ("we," "us," or "our") collects, uses, and protects your personal information. We are committed to safeguarding your privacy and ensuring that your information is handled securely and responsibly.
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">1. Information We Collect</h2>
            <ul className="list-disc list-inside text-slate-600 dark:text-slate-300 space-y-2">
              <li>Name and email address when you register or contact us</li>
              <li>Billing information when you subscribe to a paid tier</li>
              <li>Usage data, including page views and engagement metrics</li>
              <li>IP address and browser data for analytics and security</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">2. How We Use Your Information</h2>
            <ul className="list-disc list-inside text-slate-600 dark:text-slate-300 space-y-2">
              <li>Provide and improve our services</li>
              <li>Process transactions and manage your account</li>
              <li>Send transactional and informational emails</li>
              <li>Enhance user experience and platform performance</li>
              <li>Comply with legal requirements</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">3. Data Sharing and Disclosure</h2>
            <p className="text-slate-600 dark:text-slate-300 mb-4">
              We <strong>do not sell, trade, or rent</strong> your personal information. We may share your data only:
            </p>
            <ul className="list-disc list-inside text-slate-600 dark:text-slate-300 space-y-2">
              <li>With trusted third-party vendors that help operate our platform (e.g., payment processors, email services)</li>
              <li>When required by law or to protect our rights</li>
              <li>With your explicit consent</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">4. Data Security</h2>
            <p className="text-slate-600 dark:text-slate-300">
              All personal information is stored securely with industry-standard encryption and access controls. We regularly audit our systems to protect against unauthorized access, alteration, or disclosure.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">5. Your Rights</h2>
            <p className="text-slate-600 dark:text-slate-300 mb-4">
              Depending on your jurisdiction, you may have rights to:
            </p>
            <ul className="list-disc list-inside text-slate-600 dark:text-slate-300 space-y-2 mb-4">
              <li>Access, correct, or delete your personal data</li>
              <li>Opt-out of marketing communications</li>
              <li>Request a copy of the data we hold about you</li>
            </ul>
            <p className="text-slate-600 dark:text-slate-300">
              To exercise these rights, contact us at <strong>support@onyxnpearls.com</strong>.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">6. Cookies and Tracking</h2>
            <p className="text-slate-600 dark:text-slate-300">
              We may use cookies or similar technologies to improve site performance and personalize content. You can control cookie settings through your browser.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">7. Policy Updates</h2>
            <p className="text-slate-600 dark:text-slate-300">
              We may update this Privacy Policy periodically. We will post any changes on this page and update the effective date above.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">8. Contact Us</h2>
            <p className="text-slate-600 dark:text-slate-300">
              If you have any questions or concerns regarding this policy, please contact us at:<br />
              <strong>support@onyxnpearls.com</strong>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}