import { SupportForm } from '@/components/SupportForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, MessageCircle, Clock, CheckCircle } from 'lucide-react';

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-purple-900/20">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Support Center</h1>
            </div>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Need help with OnyxHooks & More™? We're here to assist you. Submit a support ticket and our team will get back to you as soon as possible.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Support Form */}
            <div className="lg:col-span-2">
              <SupportForm />
            </div>

            {/* Support Information */}
            <div className="space-y-6">
              {/* Contact Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    Direct Contact
                  </CardTitle>
                  <CardDescription>
                    Need immediate assistance? Contact us directly
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Email Support</p>
                    <a 
                      href="mailto:support@onyxnpearls.com" 
                      className="text-purple-600 dark:text-purple-400 hover:underline"
                    >
                      support@onyxnpearls.com
                    </a>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    For urgent matters or if you prefer direct email communication
                  </div>
                </CardContent>
              </Card>

              {/* Support Process */}
              <Card>
                <CardHeader>
                  <CardTitle>How It Works</CardTitle>
                  <CardDescription>
                    Our support process is designed to get you help quickly
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <MessageCircle className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Submit Ticket</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Fill out the form with your issue details
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-yellow-100 dark:bg-yellow-900/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <Clock className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">We Review</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Our team reviews and prioritizes your request
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Get Resolution</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Receive updates and resolution via email
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Response Times */}
              <Card>
                <CardHeader>
                  <CardTitle>Response Times</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">General Inquiries</span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">24-48 hours</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Technical Issues</span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">12-24 hours</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Billing Questions</span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">4-8 hours</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Urgent Issues</span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">1-4 hours</span>
                  </div>
                </CardContent>
              </Card>

              {/* FAQ Link */}
              <Card>
                <CardHeader>
                  <CardTitle>Before You Submit</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    Check our FAQ page first - you might find your answer immediately!
                  </p>
                  <a 
                    href="/faq" 
                    className="inline-flex items-center text-purple-600 dark:text-purple-400 hover:underline text-sm font-medium"
                  >
                    Visit FAQ Page →
                  </a>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}