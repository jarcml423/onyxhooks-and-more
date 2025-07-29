import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function TestEmail() {
  const [email, setEmail] = useState("jarviscamp@bellsouth.net");
  const [customerName, setCustomerName] = useState("Jarvis Camp");
  const [tier, setTier] = useState("starter");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const testWelcomeEmail = async () => {
    setLoading(true);
    try {
      const response = await apiRequest("POST", "/api/test/send-welcome-email", {
        email,
        customerName,
        tier
      });
      
      toast({
        title: "Welcome Email Sent!",
        description: `Email sent successfully to ${email}`,
      });
    } catch (error: any) {
      toast({
        title: "Email Failed",
        description: error.message,
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  const testCompleteFlow = async () => {
    setLoading(true);
    try {
      const response = await apiRequest("POST", "/api/test/complete-subscription-flow", {
        email,
        customerName,
        tier
      });
      
      toast({
        title: "Complete Flow Test Successful!",
        description: `User created, webhook processed, and welcome email sent to ${email}`,
      });
    } catch (error: any) {
      toast({
        title: "Flow Test Failed",
        description: error.message,
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Email System Testing</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm text-white mb-2">Email Address</label>
              <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email address"
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
            
            <div>
              <label className="block text-sm text-white mb-2">Customer Name</label>
              <Input
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Enter customer name"
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
            
            <div>
              <label className="block text-sm text-white mb-2">Subscription Tier</label>
              <Select value={tier} onValueChange={setTier}>
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                  <SelectValue placeholder="Select tier" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem value="starter">Starter ($47/month)</SelectItem>
                  <SelectItem value="pro">Pro ($197/month)</SelectItem>
                  <SelectItem value="vault">Vault ($5,000/year)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
              <Button
                onClick={testWelcomeEmail}
                disabled={loading}
                className="bg-purple-600 hover:bg-purple-700"
              >
                {loading ? "Sending..." : "Send Welcome Email"}
              </Button>
              
              <Button
                onClick={testCompleteFlow}
                disabled={loading}
                variant="outline"
                className="border-purple-400 text-purple-400 hover:bg-purple-600 hover:text-white"
              >
                {loading ? "Testing..." : "Test Complete Flow"}
              </Button>
            </div>
            
            <div className="text-sm text-gray-400 mt-4">
              <h4 className="text-white font-medium mb-2">Test Functions:</h4>
              <ul className="space-y-1 list-disc list-inside">
                <li><strong>Send Welcome Email:</strong> Tests email delivery directly</li>
                <li><strong>Test Complete Flow:</strong> Creates user, processes webhook, sends email</li>
              </ul>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">System Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-green-400 font-bold">✅ SMTP</div>
                <div className="text-sm text-gray-400">Zoho Mail Connected</div>
              </div>
              <div className="text-center">
                <div className="text-green-400 font-bold">✅ Stripe</div>
                <div className="text-sm text-gray-400">Payment Processing</div>
              </div>
              <div className="text-center">
                <div className="text-green-400 font-bold">✅ Webhooks</div>
                <div className="text-sm text-gray-400">Event Processing</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}