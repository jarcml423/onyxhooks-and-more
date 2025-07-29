import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

export default function Disclaimer() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Earnings Disclaimer</h1>
        
        <div className="prose prose-lg max-w-none">
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 mb-8">
            <h2 className="text-xl font-semibold text-yellow-800 mb-2">Important Notice</h2>
            <p className="text-yellow-700">
              The following disclaimer applies to all content, examples, testimonials, and case studies 
              presented on this website and through OfferForge AI services.
            </p>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-4">Results Disclaimer</h2>
          <p className="text-gray-700 mb-6">
            Results featured on this site are illustrative and not guarantees of specific outcomes. 
            The examples, case studies, and testimonials presented are real but represent exceptional results 
            and may not reflect the typical experience of all users.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mb-4">Individual Results May Vary</h2>
          <p className="text-gray-700 mb-6">
            Your actual results may vary significantly based on numerous factors including but not limited to:
          </p>
          <ul className="list-disc pl-6 mb-6 text-gray-700">
            <li>Individual effort and dedication</li>
            <li>Business model and industry</li>
            <li>Market conditions and timing</li>
            <li>Prior experience and skill level</li>
            <li>Available resources and investment</li>
            <li>Implementation of strategies and recommendations</li>
            <li>External economic factors</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mb-4">No Financial Guarantees</h2>
          <p className="text-gray-700 mb-6">
            OfferForge AI provides strategic tools, templates, and educational content. We do not guarantee 
            any specific financial results, income levels, or business outcomes. Success in business requires 
            hard work, dedication, and often involves risk.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mb-4">Tool Purpose</h2>
          <p className="text-gray-700 mb-6">
            OnyxHooks & More™ is designed to help users:
          </p>
          <ul className="list-disc pl-6 mb-6 text-gray-700">
            <li>Generate ideas for digital offers and products</li>
            <li>Analyze and optimize existing business funnels</li>
            <li>Simulate potential ROI scenarios</li>
            <li>Access proven templates and frameworks</li>
            <li>Learn positioning and pricing strategies</li>
          </ul>
          <p className="text-gray-700 mb-6">
            These tools are meant to assist and inform your business decisions, not replace professional 
            business, financial, or legal advice.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mb-4">Professional Advice</h2>
          <p className="text-gray-700 mb-6">
            The content provided through OnyxHooks & More™ does not constitute professional business, financial, 
            legal, or tax advice. Always consult with qualified professionals before making significant 
            business decisions or investments.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mb-4">Testimonials</h2>
          <p className="text-gray-700 mb-6">
            Testimonials and case studies presented on this site reflect the real experiences of actual users. 
            However, they represent exceptional results and should not be considered typical or expected outcomes. 
            Individual results will vary based on the factors mentioned above.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mb-4">Limitation of Liability</h2>
          <p className="text-gray-700 mb-6">
            OfferForge AI and its creators shall not be held liable for any business losses, missed opportunities, 
            or other damages that may result from the use of our tools, content, or recommendations. Users assume 
            full responsibility for their business decisions and outcomes.
          </p>

          <div className="bg-blue-50 border-l-4 border-blue-400 p-6 mt-8">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">Questions?</h3>
            <p className="text-blue-700">
              If you have questions about this disclaimer or our services, please contact our support team 
              through the appropriate channels provided on our platform.
            </p>
          </div>

          <p className="text-sm text-gray-500 mt-8 italic">
            Last updated: June 19, 2025
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
}