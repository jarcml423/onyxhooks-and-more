import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Mail, ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function FAQ() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/">
              <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <Link href="/login">
                <Button variant="outline" size="sm" className="text-gray-300 border-gray-600 hover:text-white hover:border-white">
                  Sign In
                </Button>
              </Link>
              <Link href="/signup">
                <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-white">
                  Get Started Free
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            🧠 OnyxHooks & More™ – Frequently Asked Questions
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Find answers to the most common questions about our AI-powered hook generation platform. 
            We're here to help you succeed with high-converting marketing content.
          </p>
        </div>

        {/* FAQ Content */}
        <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
          <CardContent className="p-8">
            <Accordion type="single" collapsible className="space-y-4">
              
              <AccordionItem value="item-1" className="border-slate-600">
                <AccordionTrigger className="text-white hover:text-purple-300 text-left">
                  What is OnyxHooks & More™?
                </AccordionTrigger>
                <AccordionContent className="text-gray-300 space-y-3">
                  <p>
                    OnyxHooks & More™ is an AI-powered marketing platform that helps you generate high-converting 
                    marketing hooks with the support of advanced psychology, A/B testing tools, and elite analysis 
                    from our specialized AI Council.
                  </p>
                  <p>
                    Our platform combines neuromarketing psychology with proven frameworks to help you create 
                    compelling content that drives results.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2" className="border-slate-600">
                <AccordionTrigger className="text-white hover:text-purple-300 text-left">
                  Who is this platform designed for?
                </AccordionTrigger>
                <AccordionContent className="text-gray-300">
                  <p>
                    OnyxHooks & More™ is built for creators, marketers, coaches, course creators, agencies, 
                    SaaS founders, and anyone looking to improve message clarity and conversion rates.
                  </p>
                  <p className="mt-3">
                    Whether you're a beginner or experienced marketer, our platform is designed to help you 
                    create more effective marketing content.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3" className="border-slate-600">
                <AccordionTrigger className="text-white hover:text-purple-300 text-left">
                  What are the differences between the subscription plans?
                </AccordionTrigger>
                <AccordionContent className="text-gray-300">
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-slate-600 rounded-lg">
                      <thead>
                        <tr className="bg-slate-700">
                          <th className="border border-slate-600 p-3 text-left text-white font-semibold">Plan</th>
                          <th className="border border-slate-600 p-3 text-left text-white font-semibold">Price</th>
                          <th className="border border-slate-600 p-3 text-left text-white font-semibold">Features</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="border border-slate-600 p-3">
                            <Badge variant="secondary">Free</Badge>
                          </td>
                          <td className="border border-slate-600 p-3">$0</td>
                          <td className="border border-slate-600 p-3">2 hooks/month + basic export</td>
                        </tr>
                        <tr>
                          <td className="border border-slate-600 p-3">
                            <Badge className="bg-blue-600">Starter</Badge>
                          </td>
                          <td className="border border-slate-600 p-3">$47/month</td>
                          <td className="border border-slate-600 p-3">25 hooks/month + edit/export features</td>
                        </tr>
                        <tr>
                          <td className="border border-slate-600 p-3">
                            <Badge className="bg-purple-600">Pro</Badge>
                          </td>
                          <td className="border border-slate-600 p-3">$197/month</td>
                          <td className="border border-slate-600 p-3">Unlimited hooks + AI Council access + Pro Tools</td>
                        </tr>
                        <tr>
                          <td className="border border-slate-600 p-3">
                            <Badge className="bg-gold-600 bg-gradient-to-r from-yellow-500 to-orange-500">Vault</Badge>
                          </td>
                          <td className="border border-slate-600 p-3">$5,000/year</td>
                          <td className="border border-slate-600 p-3">Everything in Pro + Swipe Copy Bank + Elite Tools + Founder's Circle Access</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="mt-4 p-4 bg-purple-900/30 rounded-lg border border-purple-700">
                    <p className="text-purple-200">
                      💡 <strong>The AI Council</strong> is an elite panel of specialized AI agents trained in persuasion, 
                      branding, direct response, storytelling, and strategy to analyze and optimize your hooks for maximum impact.
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4" className="border-slate-600">
                <AccordionTrigger className="text-white hover:text-purple-300 text-left">
                  What exactly is a "hook" in marketing?
                </AccordionTrigger>
                <AccordionContent className="text-gray-300">
                  <p>
                    A hook is a short, compelling marketing phrase designed to capture attention, drive interest, 
                    and generate clicks or conversions. It's typically the first thing your audience sees and 
                    determines whether they'll engage with your content.
                  </p>
                  <p className="mt-3">
                    Examples include email subject lines, ad headlines, social media captions, and video intros 
                    that stop the scroll and compel action.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5" className="border-slate-600">
                <AccordionTrigger className="text-white hover:text-purple-300 text-left">
                  How does the AI Council work?
                </AccordionTrigger>
                <AccordionContent className="text-gray-300">
                  <p>
                    The AI Council consists of six specialized AI agents, each trained in different aspects of 
                    high-converting marketing: persuasion psychology, brand positioning, direct response, 
                    storytelling, strategic analysis, and conversion optimization.
                  </p>
                  <p className="mt-3">
                    When you submit content for analysis, each agent provides expert feedback from their specialty, 
                    giving you comprehensive insights to improve your marketing effectiveness.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-6" className="border-slate-600">
                <AccordionTrigger className="text-white hover:text-purple-300 text-left">
                  What is the Swipe Copy Bank?
                </AccordionTrigger>
                <AccordionContent className="text-gray-300">
                  <p>
                    Exclusive to Vault members, the Swipe Copy Bank is a curated collection of high-converting 
                    templates, angles, and proven hooks from successful campaigns across multiple industries.
                  </p>
                  <p className="mt-3">
                    This vault of battle-tested content serves as inspiration and starting points for your own 
                    marketing campaigns, updated monthly with fresh content.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-7" className="border-slate-600">
                <AccordionTrigger className="text-white hover:text-purple-300 text-left">
                  Can I cancel my subscription anytime?
                </AccordionTrigger>
                <AccordionContent className="text-gray-300">
                  <p>
                    Yes, you have complete control over your subscription. You can cancel or downgrade your 
                    subscription anytime from your account dashboard. Changes take effect at your next billing cycle.
                  </p>
                  <p className="mt-3">
                    There are no cancellation fees or hidden charges - you maintain access to your current 
                    plan features until the end of your billing period.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-8" className="border-slate-600">
                <AccordionTrigger className="text-white hover:text-purple-300 text-left">
                  What happens if I exceed my monthly hook limit?
                </AccordionTrigger>
                <AccordionContent className="text-gray-300">
                  <p>
                    Free and Starter plans have monthly generation limits. When you reach your limit, you'll 
                    receive a friendly upgrade prompt with options to increase your capacity.
                  </p>
                  <p className="mt-3">
                    Pro and Vault tiers offer unlimited hook generation, so you never have to worry about limits 
                    constraining your creative process.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-9" className="border-slate-600">
                <AccordionTrigger className="text-white hover:text-purple-300 text-left">
                  Can I export hooks to my existing tools and platforms?
                </AccordionTrigger>
                <AccordionContent className="text-gray-300">
                  <p>
                    Absolutely. Generated hooks can be exported in multiple formats including text, CSV, and 
                    copy-paste functionality for seamless integration with your CRM, ad managers, email tools, 
                    or design software.
                  </p>
                  <p className="mt-3">
                    This ensures your OnyxHooks content fits perfectly into your existing marketing workflow.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-10" className="border-slate-600">
                <AccordionTrigger className="text-white hover:text-purple-300 text-left">
                  What is your refund policy?
                </AccordionTrigger>
                <AccordionContent className="text-gray-300">
                  <p>
                    We stand behind our platform with a satisfaction guarantee. If you're not completely satisfied 
                    within 7 days of purchase, contact our support team for a review.
                  </p>
                  <p className="mt-3">
                    Please note: Vault tier subscriptions are annual commitments and have specific terms outlined 
                    during checkout. We encourage trying our Free or Starter tiers first to experience the platform.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-11" className="border-slate-600">
                <AccordionTrigger className="text-white hover:text-purple-300 text-left">
                  How frequently is the Swipe Copy Bank updated?
                </AccordionTrigger>
                <AccordionContent className="text-gray-300">
                  <p>
                    The Swipe Copy Bank receives monthly updates with new hooks, campaign templates, and proven 
                    playbooks added exclusively for Vault members.
                  </p>
                  <p className="mt-3">
                    Each update includes fresh content across different industries and marketing channels to keep 
                    your campaigns current and effective.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-12" className="border-slate-600">
                <AccordionTrigger className="text-white hover:text-purple-300 text-left">
                  Do you offer team or agency account options?
                </AccordionTrigger>
                <AccordionContent className="text-gray-300">
                  <p>
                    Yes, team and agency features are currently in development. These will include multi-user 
                    access, client management tools, and collaborative workspaces.
                  </p>
                  <p className="mt-3">
                    For early access to team features or custom enterprise solutions, contact us at 
                    support@onyxnpearls.com with your specific requirements.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-13" className="border-slate-600">
                <AccordionTrigger className="text-white hover:text-purple-300 text-left">
                  Do I need marketing experience to use this platform?
                </AccordionTrigger>
                <AccordionContent className="text-gray-300">
                  <p>
                    Not at all. OnyxHooks & More™ is designed to be beginner-friendly while providing advanced 
                    features for experienced marketers.
                  </p>
                  <p className="mt-3">
                    Our AI guidance, built-in psychology frameworks, and clear explanations help anyone improve 
                    their marketing copy, regardless of their experience level.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-14" className="border-slate-600">
                <AccordionTrigger className="text-white hover:text-purple-300 text-left">
                  How quickly does the AI generate hooks?
                </AccordionTrigger>
                <AccordionContent className="text-gray-300">
                  <p>
                    Hook generation typically takes under 30 seconds. Our AI works in real-time and delivers 
                    multiple versions for you to choose from, allowing rapid iteration and testing.
                  </p>
                  <p className="mt-3">
                    The speed allows you to quickly explore different angles and approaches until you find 
                    the perfect hook for your campaign.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-15" className="border-slate-600">
                <AccordionTrigger className="text-white hover:text-purple-300 text-left">
                  Where can I use the generated hooks?
                </AccordionTrigger>
                <AccordionContent className="text-gray-300">
                  <p>
                    Our hooks are optimized for multiple marketing channels including paid advertising, 
                    email subject lines, landing page headlines, social media posts, video intros, 
                    and sales page copy.
                  </p>
                  <p className="mt-3">
                    The versatile output works across all major platforms: Facebook, Instagram, LinkedIn, 
                    YouTube, email marketing systems, and more.
                  </p>
                </AccordionContent>
              </AccordionItem>

            </Accordion>
          </CardContent>
        </Card>

        {/* Contact Section */}
        <Card className="mt-8 bg-gradient-to-r from-purple-900/50 to-slate-800/50 backdrop-blur-sm border-purple-700">
          <CardContent className="p-8 text-center">
            <Mail className="w-12 h-12 text-purple-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-3">Still Have Questions?</h3>
            <p className="text-gray-300 mb-6">
              Our support team is here to help you succeed with OnyxHooks & More™
            </p>
            <a 
              href="mailto:support@onyxnpearls.com" 
              className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              <Mail className="w-4 h-4" />
              Contact Support
            </a>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}