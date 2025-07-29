import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Star, Zap, Crown, Shield, ArrowRight } from "lucide-react";
import { Link } from "wouter";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Hero Section */}
      <div 
        className="relative w-full h-96 bg-cover bg-center flex items-center justify-center"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1629904853716-f0bc54eea481?auto=format&fit=crop&w=1600&q=80')"
        }}
      >
        <div className="bg-black/60 text-white text-5xl font-bold text-center p-8 rounded-lg">
          Onyx & Pearls Management, Inc.
        </div>
      </div>

      {/* Navigation */}
      <nav className="bg-black text-white p-4">
        <div className="flex justify-center flex-wrap gap-4">
          <a href="#services" className="text-white font-bold hover:text-gray-300 cursor-pointer transition-colors duration-200" onClick={(e) => {
            e.preventDefault();
            document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' });
          }}>Services</a>
          <a href="#contact" className="text-white font-bold hover:text-gray-300 cursor-pointer transition-colors duration-200" onClick={(e) => {
            e.preventDefault();
            document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
          }}>Contact</a>
          <Link href="/login" className="text-white font-bold hover:text-gray-300">Client Login</Link>
          <a href="#leadership" className="text-white font-bold hover:text-gray-300 cursor-pointer transition-colors duration-200" onClick={(e) => {
            e.preventDefault();
            document.getElementById('leadership')?.scrollIntoView({ behavior: 'smooth' });
          }}>Leadership</a>
          <a href="#about" className="text-white font-bold hover:text-gray-300 cursor-pointer transition-colors duration-200" onClick={(e) => {
            e.preventDefault();
            document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
          }}>About</a>
          <a href="#onyxhooks" className="text-white font-bold hover:text-gray-300 cursor-pointer transition-colors duration-200" onClick={(e) => {
            e.preventDefault();
            document.getElementById('onyxhooks')?.scrollIntoView({ behavior: 'smooth' });
          }}>OnyxHooks</a>
          <Link href="/privacy" className="text-white font-bold hover:text-gray-300">Privacy</Link>
          <Link href="/terms" className="text-white font-bold hover:text-gray-300">Terms</Link>
          <Link href="/faq" className="text-white font-bold hover:text-gray-300">FAQ</Link>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Services Section */}
        <section id="services" className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Our Services</h2>
          <p className="text-lg text-gray-600 mb-6">
            Onyx & Pearls now proudly offers cutting-edge SaaS solutions for businesses and entrepreneurs.
          </p>
          
          <div className="grid gap-6 md:grid-cols-3 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-6 h-6 text-purple-600" />
                  OnyxHooks & More™
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>Our flagship AI-powered platform offering curated sales hooks, marketing intelligence, and rapid content deployment across three subscription tiers (Starter, Pro, Vault).</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Crown className="w-6 h-6 text-yellow-600" />
                  NOS 9-Second Challenge™
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>An interactive gamified onboarding experience that helps users unlock high-conversion hooks based on psychological triggers.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-6 h-6 text-blue-600" />
                  Admin Dashboard Access
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>For Pro and Vault subscribers, including swipe copy, usage analytics, and tier upgrade options.</p>
              </CardContent>
            </Card>
          </div>

          <p className="text-lg text-gray-600 mb-6">
            Whether you're a solo founder or scaling brand, our platform helps you generate attention, leads, and revenue—faster than ever before.
          </p>

          <Link href="/pricing">
            <Button className="bg-purple-600 hover:bg-purple-700 text-white">
              Explore Our Plans <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </section>

        {/* About Section */}
        <section id="about" className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">About Us</h2>
          <p className="text-lg text-gray-600 mb-4">
            Headquartered in Las Vegas, Onyx & Pearls Management, Inc. is a private financial asset management firm serving a limited number of discreet clientele... enabling us to deliver superior returns for our select group of partners and stakeholders.
          </p>
          <p className="text-lg text-gray-600">
            In addition, we're excited to now offer OnyxHooks & More™, our first software-as-a-service (SaaS) platform, delivering intelligent marketing automation, lead optimization, and growth tools to digital entrepreneurs and business professionals worldwide.
          </p>
        </section>

        {/* Contact Section */}
        <section id="contact" className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Contact</h2>
          <div className="space-y-2">
            <p className="text-lg"><strong>Email:</strong> info@onyxnpearls.com</p>
            <p className="text-lg"><strong>Location:</strong> Las Vegas, Nevada</p>
          </div>
        </section>

        {/* Leadership Section */}
        <section id="leadership" className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Leadership</h2>
          <div className="space-y-2">
            <p className="text-lg">Siobhon Camp / CEO</p>
            <p className="text-lg">J. Camp / Director</p>
          </div>
        </section>

        {/* OnyxHooks Section */}
        <section id="onyxhooks" className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">OnyxHooks & More™</h2>
          
          <div className="mb-8">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">What is OnyxHooks & More™?</h3>
            <p className="text-lg text-gray-600 mb-6">
              OnyxHooks & More™ is a premium SaaS platform designed to help entrepreneurs, creators, and conversion-focused marketers craft high-converting sales hooks and content faster than ever. Built for speed, precision, and impact — our AI-powered tools make content creation feel like a race to 9 seconds.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
            <Card className="border-2 border-slate-200">
              <CardHeader>
                <Badge variant="outline" className="w-fit">Free</Badge>
                <CardTitle>Free Tier</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Perfect for curious creators wanting to explore our AI tools. Limited access with 2 hooks/month and a 7-day NOS Challenge trial.</p>
              </CardContent>
            </Card>

            <Card className="border-2 border-purple-200">
              <CardHeader>
                <Badge className="w-fit bg-purple-600">$47/mo</Badge>
                <CardTitle>Starter Tier</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Ideal for coaches and consultants starting to scale. Includes 25 hooks/month, branding tools, and NOS Challenge entry.</p>
              </CardContent>
            </Card>

            <Card className="border-2 border-blue-200">
              <CardHeader>
                <Badge className="w-fit bg-blue-600">$197/mo</Badge>
                <CardTitle>Pro Tier</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Built for content professionals and agency teams. Unlock unlimited hooks, Pro Tools, leaderboard visibility, and NOS Challenge entry.</p>
              </CardContent>
            </Card>

            <Card className="border-2 border-yellow-200">
              <CardHeader>
                <Badge className="w-fit bg-yellow-600">$5,000/year</Badge>
                <CardTitle>Vault Tier</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Designed for elite growth hackers and high-conversion pros. Includes everything from lower tiers, plus swipe copy vault, exclusive AI tools, and 100 NOS Challenge runs.</p>
              </CardContent>
            </Card>
          </div>

          <div className="mb-8">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Refund & Billing Policy</h3>
            <div className="space-y-4 text-gray-600">
              <p>
                By signing up for any subscription tier, you agree to automatic renewals based on the recurring billing cycle (monthly or annual, depending on the tier). All <strong>Starter Tier</strong> and <strong>Pro Tier</strong> subscriptions are billed at the beginning of each monthly cycle. All <strong>Vault Tier</strong> subscriptions are billed at the beginning of each yearly cycle.
              </p>
              <p>
                Customers can cancel at any time from their account dashboard. <strong>Refunds are only provided for billing errors or duplicate charges.</strong>
              </p>
              <p>
                We encourage new users to try our <strong>Free Tier</strong> to evaluate the platform before upgrading. Vault Tier subscriptions are <strong>annual commitments</strong> with specific terms outlined during checkout.
              </p>
              <p>
                Please refer to our <Link href="/terms" className="text-blue-600 hover:underline">Terms and Conditions</Link> for full details.
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Support</h3>
            <p className="text-gray-600">
              All support requests are handled via our official support ticketing form at{" "}
              <Link href="/support" className="text-blue-600 hover:underline">support@onyxnpearls.com</Link>
            </p>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white text-center p-4 mt-8">
        <p>&copy; 2025 Onyx & Pearls Management, Inc. All rights reserved.</p>
      </footer>
    </div>
  );
}