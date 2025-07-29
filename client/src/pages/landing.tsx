import { useState } from "react";
import { Link } from "wouter";
import onyxLogo from "@assets/ChatGPT Image Jul 1, 2025, 11_01_09 PM_1751431893117.png";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import PricingCard from "@/components/PricingCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { useToast } from "@/hooks/use-toast";
import { 
  Sparkles, Search, TrendingUp, Vault, ClipboardCheck, Users,
  Play, Star, Twitter, Share, ArrowRight, Zap, Shield, Rocket, Lock
} from "lucide-react";

export default function Landing() {
  const [email, setEmail] = useState("");

  const { toast } = useToast();

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    toast({
      title: "Thanks for your interest!",
      description: "We'll be in touch soon with early access.",
    });
    setEmail("");
  };

  const handleQuizStart = () => {
    window.location.href = "/quiz";
  };

  const handlePlanSelect = (planType: string) => {
    if (planType === "free") {
      window.location.href = "/signup";
    } else {
      window.location.href = "/signup?plan=" + planType;
    }
  };

  const handleSocialShare = (platform: string) => {
    const text = "Check out these amazing offer transformations from OnyxHooks & More™!";
    const url = window.location.href;
    
    if (platform === "twitter") {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`);
    }
  };

  const pricingPlans = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      description: "Perfect for getting started",
      features: [
        { name: "2 hook generations", included: true },
        { name: "2 offer generations", included: true },
        { name: "Offer strength quiz", included: true },
        { name: "Basic email support", included: true },
        { name: "Content has watermark", included: true },
        { name: "Editing capabilities", included: false },
        { name: "Pro tools", included: false },
        { name: "Export features", included: false },
      ],
      buttonText: "Get Started Free",
      buttonVariant: "outline" as const,
    },
    {
      name: "Starter",
      price: "$47",
      period: "one-time",
      description: "Remove limits, unlock editing",
      features: [
        { name: "Unlimited hook generation", included: true },
        { name: "Unlimited offer generation", included: true },
        { name: "Full editing enabled", included: true },
        { name: "PDF & clipboard export", included: true },
        { name: "Watermark removed", included: true },
        { name: "Priority support", included: true },
        { name: "Pro tools", included: false },
        { name: "Vault features", included: false },
      ],
      buttonText: "Get Starter",
    },
    {
      name: "Pro",
      price: "$197",
      period: "month",
      description: "Advanced monetization tools",
      popular: true,
      features: [
        { name: "Everything in Starter", included: true },
        { name: "Pricing Justification Tool", included: true },
        { name: "Upsell Builder", included: true },
        { name: "Objection Eraser", included: true },
        { name: "Guarantee Generator", included: true },
        { name: "Urgency Frameworks", included: true },
        { name: "3-agent council scoring", included: true },
        { name: "Michael's closer analysis", included: true },
      ],
      buttonText: "Start Pro",
    },
    {
      name: "Vault",
      price: "$5,000",
      period: "year",
      description: "Complete offer domination suite",
      features: [
        { name: "Everything in Pro", included: true },
        { name: "Value Ladder Mapping", included: true },
        { name: "Origin Story Builder", included: true },
        { name: "VSL Script Writer", included: true },
        { name: "Lead Magnet Generator", included: true },
        { name: "Email Sequence Builder", included: true },
        { name: "Swipe Copy Bank (20 examples)", included: true },
        { name: "White Label + CRM Export", included: true },
        { name: "6-agent council + Alex upgrades", included: true },
      ],
      buttonText: "Get Vault Access",
      buttonVariant: "outline" as const,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-20 pb-32" style={{
        background: 'radial-gradient(circle at top, #ffffff 0%, #f3f4f8 40%, #e8ebf5 100%)'
      }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            {/* Logo */}
            <div className="mb-8">
              <img 
                src={onyxLogo}
                alt="OnyxHooks & More™ Logo"
                className="mx-auto h-24 w-auto mb-4"
              />
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6" style={{
              fontSize: '3.5rem',
              fontWeight: '800',
              lineHeight: '1.15'
            }}>
              Build Magnetic Hooks That Multiply Your Conversions.
            </h1>
            <p className="cinematic-subtitle text-xl text-gray-600 mb-8 max-w-4xl mx-auto" style={{ lineHeight: '1.6', paddingTop: '1rem' }}>
              Take the 6-question reality check to uncover blind spots, generate your own magnetic hook, and unlock your ideal growth plan — plus see if you qualify for a free tier.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <div className="cta-container relative inline-block">
                <Button 
                  id="cta-button"
                  onClick={handleQuizStart} 
                  className="btn-primary relative shine-button cta-pulse" 
                  style={{
                    color: 'white',
                    boxShadow: '0 0 10px rgba(190, 110, 255, 0.5)',
                    fontWeight: '600',
                    transition: 'all 0.25s ease',
                    border: 'none',
                    position: 'relative',
                    zIndex: 1
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 0 10px rgba(175, 80, 255, 0.45)';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = '0 0 10px rgba(190, 110, 255, 0.5)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}>
                  <Zap className="mr-2 h-5 w-5" />
                  See If I Qualify + Get My Hook
                  <span className="cinematic-time-badge absolute -top-2 -right-2 bg-purple-500 text-white text-xs px-2 py-1 rounded-full">
                    3 min
                  </span>
                </Button>
                <img 
                  src="/cursor-icon.svg" 
                  id="cta-cursor" 
                  className="cta-cursor absolute" 
                  alt="Mouse cursor" 
                  style={{
                    width: '28px',
                    top: '60%',
                    left: '-30px',
                    opacity: 0,
                    pointerEvents: 'none',
                    zIndex: 2
                  }}
                />
                <img 
                  src="/finger-icon.svg" 
                  id="cta-finger" 
                  className="cta-finger absolute hidden" 
                  alt="Tap finger" 
                  style={{
                    width: '28px',
                    top: '60%',
                    left: '-30px',
                    opacity: 0,
                    pointerEvents: 'none',
                    zIndex: 2
                  }}
                />
              </div>
              <Link href="/nos-challenge">
                <Button variant="outline" className="demo-button bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-blue-500">
                  <Rocket className="mr-2 h-4 w-4" />
                  Take the NOS Challenge
                </Button>
              </Link>
            </div>

            {/* Email Capture */}
            <div className="max-w-md mx-auto">
              <form onSubmit={handleEmailSubmit} className="flex rounded-lg shadow-lg overflow-hidden">
                <Input
                  type="email"
                  placeholder="Enter your email for instant access"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="cinematic-input flex-1 border-0"
                  style={{
                    transition: 'all 0.25s ease'
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.border = '1px solid #a855f7';
                    e.currentTarget.style.boxShadow = '0 0 6px rgba(168, 85, 247, 0.3)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.border = '1px solid rgba(0,0,0,0.1)';
                    e.currentTarget.style.boxShadow = '0 2px 6px rgba(0,0,0,0.08)';
                  }}
                />
                <Button type="submit" className="cinematic-secondary-button bg-primary hover:bg-primary/90 px-6">
                  Get Started
                </Button>
              </form>
              <p style={{
                fontSize: '0.875rem',
                color: '#666',
                textAlign: 'center',
                marginTop: '0.5rem'
              }}>Join 2,000+ creators already using OnyxHooks & More™</p>
            </div>
          </div>
        </div>
      </section>

      {/* Explainer Demo Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">$2K to $20K: The OfferForge Transformation</h2>
            <p className="text-xl text-gray-600">Watch real coaches go from struggling offers to conversion machines in under 10 minutes</p>
          </div>
          
          <div className="relative bg-gray-900 rounded-2xl overflow-hidden shadow-2xl">
            <img 
              src="https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080" 
              alt="Business coaching session demonstrating offer optimization" 
              className="w-full h-96 object-cover opacity-60"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <Button className="bg-white bg-opacity-20 backdrop-blur-sm rounded-full p-6 hover:bg-opacity-30 transition-all duration-300 transform hover:scale-110">
                <Play className="text-white text-3xl ml-1" />
              </Button>
            </div>
            <div className="absolute bottom-6 left-6 text-white">
              <h3 className="text-xl font-semibold mb-2">From $47 to $497 in 3 clicks</h3>
              <p className="text-gray-200">Watch Sarah transform her coaching offer</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Everything You Need to Optimize Your Offers</h2>
            <p className="text-xl text-gray-600">Powerful AI tools designed specifically for coaches, creators, and service providers</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* AI Offer Generator */}
            <Card className="card-hover">
              <CardContent className="p-8">
                <div className="feature-icon mb-6">
                  <Sparkles />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Instant Offer Transformer</h3>
                <p className="text-gray-600 mb-6">Turn any weak offer into a conversion machine. Our AI analyzes 10,000+ high-performing offers to craft yours with proven psychology.</p>
                <div className="flex space-x-2">
                  <Badge variant="secondary">GPT-Powered</Badge>
                  <Badge className="bg-green-100 text-green-800">Instant</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Funnel Critique Tool */}
            <Card className="card-hover">
              <CardContent className="p-8">
                <div className="feature-icon mb-6">
                  <Search />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Funnel Critique Tool</h3>
                <p className="text-gray-600 mb-6">Paste your funnel URL or copy. Get detailed AI analysis of your CTA clarity, messaging, and conversion structure.</p>
                <div className="flex space-x-2">
                  <Badge className="bg-purple-100 text-purple-800">Deep Analysis</Badge>
                  <Badge className="bg-orange-100 text-orange-800">Actionable</Badge>
                </div>
              </CardContent>
            </Card>

            {/* ROI Simulator */}
            <Card className="card-hover">
              <CardContent className="p-8">
                <div className="feature-icon mb-6">
                  <TrendingUp />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">ROI Simulator</h3>
                <p className="text-gray-600 mb-6">Model your traffic, conversion rates, and ad spend. Compare multiple offer strategies side-by-side with visual charts.</p>
                <div className="flex space-x-2">
                  <Badge className="bg-green-100 text-green-800">Data-Driven</Badge>
                  <Badge className="bg-yellow-100 text-yellow-800">Compare</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Prompt Vault */}
            <Card className="card-hover">
              <CardContent className="p-8">
                <div className="feature-icon mb-6">
                  <Vault />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Prompt Vault</h3>
                <p className="text-gray-600 mb-6">200+ proven prompts for VSLs, ads, testimonials, hooks, and email sequences. Premium content with searchable categories.</p>
                <div className="flex space-x-2">
                  <Badge className="bg-indigo-100 text-indigo-800">Premium</Badge>
                  <Badge className="bg-red-100 text-red-800">200+ Prompts</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Offer Strength Quiz */}
            <Card className="card-hover">
              <CardContent className="p-8">
                <div className="feature-icon mb-6">
                  <ClipboardCheck />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Offer Strength Quiz</h3>
                <p className="text-gray-600 mb-6">5-question assessment scoring your offer 0-100. Get tiered feedback and AI-powered improvement suggestions via email.</p>
                <div className="flex space-x-2">
                  <Badge className="bg-cyan-100 text-cyan-800">Free</Badge>
                  <Badge className="bg-purple-100 text-purple-800">Lead Gen</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Agency Mode */}
            <Card className="card-hover">
              <CardContent className="p-8">
                <div className="feature-icon mb-6">
                  <Users />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Agency Mode</h3>
                <p className="text-gray-600 mb-6">Manage multiple client brands and offers. Team workspace with permissions for agencies and consultants.</p>
                <div className="flex space-x-2">
                  <Badge variant="secondary">Pro Feature</Badge>
                  <Badge className="bg-blue-100 text-blue-800">Team Access</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Before/After Examples */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Real Transformations, Real Results</h2>
            <p className="text-xl text-gray-600">See how OfferForge AI has helped creators optimize their offers</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            {/* Example 1 */}
            <Card className="bg-gray-50 relative">
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <Badge variant="destructive">BEFORE</Badge>
                </div>
                <div className="space-y-4 mb-6">
                  <p className="text-gray-600 italic">"Generic Life Coaching Session - $75"</p>
                  <div className="text-sm text-gray-500 space-y-1">
                    <p>• Vague transformation promise</p>
                    <p>• Low-ticket pricing</p>
                    <p>• Generic positioning</p>
                  </div>
                </div>
                <div className="border-t pt-6">
                  <Badge className="bg-green-100 text-green-800 mb-4">AFTER</Badge>
                  <div>
                    <p className="text-gray-900 font-semibold">"The 90-Day Executive Presence Transformation - $2,497"</p>
                    <div className="text-sm text-gray-600 mt-2 space-y-1">
                      <p>• Specific outcome & timeline</p>
                      <p>• Premium pricing strategy</p>
                      <p>• Executive niche positioning</p>
                    </div>
                  </div>
                </div>
                <div className="mt-6 text-center">
                  <span className="text-2xl font-bold text-green-600">3,229% ROI Increase</span>
                </div>
                
                {/* Tier Watermark */}
                <div className="absolute bottom-3 right-3">
                  <div className="inline-flex items-center text-xs px-2 py-1 rounded-md border bg-purple-100 text-purple-700 border-purple-200">
                    <Lock className="w-3 h-3 mr-1" />
                    Powered by Vault Tier
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Example 2 */}
            <Card className="bg-gray-50 relative">
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <Badge variant="destructive">BEFORE</Badge>
                </div>
                <div className="space-y-4 mb-6">
                  <p className="text-gray-600 italic">"Marketing Course - $197"</p>
                  <div className="text-sm text-gray-500 space-y-1">
                    <p>• Broad market appeal</p>
                    <p>• Course-focused messaging</p>
                    <p>• Price-conscious positioning</p>
                  </div>
                </div>
                <div className="border-t pt-6">
                  <Badge className="bg-green-100 text-green-800 mb-4">AFTER</Badge>
                  <div>
                    <p className="text-gray-900 font-semibold">"The $10K/Month Agency Blueprint - $997"</p>
                    <div className="text-sm text-gray-600 mt-2 space-y-1">
                      <p>• Income-specific outcome</p>
                      <p>• Business model clarity</p>
                      <p>• Value-based pricing</p>
                    </div>
                  </div>
                </div>
                <div className="mt-6 text-center">
                  <span className="text-2xl font-bold text-green-600">406% Price Increase</span>
                </div>
                
                {/* Tier Watermark */}
                <div className="absolute bottom-3 right-3">
                  <div className="inline-flex items-center text-xs px-2 py-1 rounded-md border bg-blue-100 text-blue-700 border-blue-200">
                    <Rocket className="w-3 h-3 mr-1" />
                    Achieved with Pro Tier
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Example 3 */}
            <Card className="bg-gray-50 relative">
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <Badge variant="destructive">BEFORE</Badge>
                </div>
                <div className="space-y-4 mb-6">
                  <p className="text-gray-600 italic">"Fitness Consultation - $50"</p>
                  <div className="text-sm text-gray-500 space-y-1">
                    <p>• Time-based pricing</p>
                    <p>• Service-focused offer</p>
                    <p>• Hourly mindset</p>
                  </div>
                </div>
                <div className="border-t pt-6">
                  <Badge className="bg-green-100 text-green-800 mb-4">AFTER</Badge>
                  <div>
                    <p className="text-gray-900 font-semibold">"The Body Transformation Guarantee - $1,497"</p>
                    <div className="text-sm text-gray-600 mt-2 space-y-1">
                      <p>• Outcome guarantee</p>
                      <p>• Transformation focus</p>
                      <p>• Premium positioning</p>
                    </div>
                  </div>
                </div>
                <div className="mt-6 text-center">
                  <span className="text-2xl font-bold text-green-600">2,894% Value Jump</span>
                </div>
                
                {/* Tier Watermark */}
                <div className="absolute bottom-3 right-3">
                  <div className="inline-flex items-center text-xs px-2 py-1 rounded-md border bg-purple-100 text-purple-700 border-purple-200">
                    <Lock className="w-3 h-3 mr-1" />
                    Backed by Vault Tier
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Social Sharing */}
          <div className="text-center">
            <p className="text-gray-600 mb-4">Share these transformations:</p>
            <div className="flex justify-center space-x-4">
              <Button onClick={() => handleSocialShare("twitter")} className="bg-blue-500 hover:bg-blue-600">
                <Twitter className="mr-2 h-4 w-4" />
                Share on Twitter
              </Button>
              <Button onClick={() => handleSocialShare("tiktok")} className="bg-black hover:bg-gray-800">
                <Share className="mr-2 h-4 w-4" />
                Share on TikTok
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Join 2,000+ Successful Creators</h2>
            <p className="text-xl text-gray-600">See what our community is saying about OfferForge AI</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <Card>
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  <img 
                    src="https://images.unsplash.com/photo-1494790108755-2616b612b47c?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150" 
                    alt="Sarah Johnson - Business Coach" 
                    className="w-12 h-12 rounded-full object-cover mr-4"
                  />
                  <div>
                    <p className="font-semibold text-gray-900">Sarah Johnson</p>
                    <p className="text-sm text-gray-500">Business Coach</p>
                  </div>
                </div>
                <p className="text-gray-600 mb-4">"OfferForge AI helped me transform my $47 coaching session into a $497 signature program. The ROI simulator showed me exactly how to price for profit. Game-changer!"</p>
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Testimonial 2 */}
            <Card>
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  <img 
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150" 
                    alt="Marcus Chen - Marketing Consultant" 
                    className="w-12 h-12 rounded-full object-cover mr-4"
                  />
                  <div>
                    <p className="font-semibold text-gray-900">Marcus Chen</p>
                    <p className="text-sm text-gray-500">Marketing Consultant</p>
                  </div>
                </div>
                <p className="text-gray-600 mb-4">"The Prompt Vault alone is worth the subscription. I've 10x'd my content creation speed using their proven hooks and email templates. Incredible ROI."</p>
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Testimonial 3 */}
            <Card>
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  <img 
                    src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150" 
                    alt="Jessica Liu - Course Creator" 
                    className="w-12 h-12 rounded-full object-cover mr-4"
                  />
                  <div>
                    <p className="font-semibold text-gray-900">Jessica Liu</p>
                    <p className="text-sm text-gray-500">Course Creator</p>
                  </div>
                </div>
                <p className="text-gray-600 mb-4">"The funnel critique tool caught conversion killers I never would have noticed. Fixed my sales page and increased conversions by 340% in one week!"</p>
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Choose Your Growth Plan</h2>
            <p className="text-xl text-gray-600">Start free, scale as you grow</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {pricingPlans.map((plan, index) => (
              <PricingCard key={index} plan={plan} onSelect={handlePlanSelect} />
            ))}
          </div>

          <div className="text-center mt-12">
            <div className="inline-flex items-center bg-green-50 px-6 py-3 rounded-full">
              <Shield className="text-green-600 mr-2 h-5 w-5" />
              <span className="text-green-800 font-medium">30-day money-back guarantee on all paid plans</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-secondary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Transform Your Offers?</h2>
          <p className="text-xl text-blue-100 mb-8">Join 2,000+ creators who've already optimized their offers with OfferForge AI</p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button onClick={handleQuizStart} className="bg-white text-primary hover:bg-gray-100 transform hover:scale-105">
              <Zap className="mr-2 h-5 w-5" />
              Take Free Quiz Now
            </Button>
            <Link href="/signup">
              <Button variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
                Start Free Trial
              </Button>
            </Link>
          </div>
          
          <p className="text-blue-100 text-sm mt-6">No credit card required • Get results in under 5 minutes</p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
