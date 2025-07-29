import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 text-white py-12 mt-20 border-t border-purple-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold mb-4" style={{
              background: 'linear-gradient(90deg, #ffffff, #c084fc, #ffffff)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>OnyxHooks & More™</h3>
            <p className="text-gray-400 mb-4 max-w-md">
              AI-powered platform helping coaches and creators generate, optimize, and monetize high-converting digital offers.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Tools</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/quiz" className="hover:text-white">Offer Quiz</Link></li>
              <li><Link href="/offer-generator" className="hover:text-white">Offer Generator</Link></li>
              <li><Link href="/roi-sim" className="hover:text-white">ROI Simulator</Link></li>
              <li><Link href="/vault" className="hover:text-white">Prompt Vault</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/disclaimer" className="hover:text-white">Earnings Disclaimer</Link></li>
              <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white">Terms of Service</a></li>
            </ul>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <small className="text-xs text-gray-500 block mb-4">
            <strong>Disclaimer:</strong> Results featured on this site are illustrative and not guarantees of specific outcomes. 
            Actual results may vary based on individual effort, business model, market conditions, and other variables. 
            OnyxHooks & More™ provides strategic tools and templates, not financial or business guarantees.
          </small>
          
          <div className="flex flex-col md:flex-row justify-between items-center text-gray-400 text-sm">
            <p>&copy; 2025 OnyxHooks & More™. All rights reserved.</p>
            <p className="mt-2 md:mt-0">Built for creators who demand results.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}