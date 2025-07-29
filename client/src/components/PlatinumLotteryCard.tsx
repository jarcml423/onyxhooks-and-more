import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Crown, Lock, Clock, Users, Zap, Star, CheckCircle } from "lucide-react";

interface PlatinumLotteryProps {
  isEligible: boolean;
  spotsRemaining: number;
  nextEligibilityDate?: string;
}

export default function PlatinumLotteryCard({ isEligible, spotsRemaining, nextEligibilityDate }: PlatinumLotteryProps) {
  const [timeUntilNext, setTimeUntilNext] = useState("");
  const [isApplicationOpen, setIsApplicationOpen] = useState(false);
  const [applicationData, setApplicationData] = useState({
    businessRevenue: "",
    industry: "",
    biggestChallenge: "",
    whyPlatinum: ""
  });

  useEffect(() => {
    if (nextEligibilityDate) {
      const interval = setInterval(() => {
        const now = new Date().getTime();
        const target = new Date(nextEligibilityDate).getTime();
        const difference = target - now;

        if (difference > 0) {
          const days = Math.floor(difference / (1000 * 60 * 60 * 24));
          const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
          setTimeUntilNext(`${days}d ${hours}h ${minutes}m`);
        } else {
          setTimeUntilNext("Applications Open Now");
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [nextEligibilityDate]);

  const handleApplicationSubmit = async () => {
    // Simulate application submission
    console.log("Platinum application submitted:", applicationData);
    setIsApplicationOpen(false);
    // Reset form
    setApplicationData({
      businessRevenue: "",
      industry: "",
      biggestChallenge: "",
      whyPlatinum: ""
    });
  };

  return (
    <Card className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-yellow-900/20 to-slate-900 border-2 border-yellow-500/30 group hover:border-yellow-400/50 transition-all duration-500">
      {/* Animated shimmer border */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-400/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
      
      <CardContent className="p-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-amber-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-2xl">
            <Crown className="w-10 h-10 text-black" />
          </div>
          <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-500 mb-2">
            Ultimate Platinum Lottery
          </h2>
          <p className="text-xl text-gray-300 font-medium">
            Only 5 founders per year will be remembered
          </p>
        </div>

        {/* Spots Remaining Counter */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-4 bg-black/40 rounded-full px-6 py-3 border border-yellow-500/30">
            <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse shadow-lg shadow-yellow-400/50" />
            <span className="text-yellow-300 font-semibold">
              {spotsRemaining} slots remaining
            </span>
          </div>
        </div>

        {/* Countdown */}
        {nextEligibilityDate && (
          <div className="text-center mb-8">
            <div className="text-sm text-gray-400 mb-2">Next eligibility opens in:</div>
            <div className="text-2xl font-mono font-bold text-yellow-400 bg-black/30 rounded-lg px-4 py-2 inline-block border border-yellow-500/20">
              <Clock className="w-5 h-5 inline mr-2" />
              {timeUntilNext}
            </div>
          </div>
        )}

        {/* Benefits List */}
        <div className="space-y-4 mb-8">
          <div className="text-center text-gray-400 text-sm mb-4">
            Applications are reviewed manually for legendary founders only
          </div>
          
          <div className="grid grid-cols-1 gap-3">
            {[
              "Private Intensives with Elite Scale Strategists",
              "Custom AI trained exclusively on your business",
              "Direct Slack access to the Core Dev Council", 
              "Lifetime upgrades and priority roadmap control"
            ].map((benefit, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 bg-gradient-to-r from-yellow-900/10 to-amber-900/10 rounded-lg border border-yellow-500/10">
                <div className="w-2 h-2 bg-gradient-to-r from-yellow-400 to-amber-400 rounded-full" />
                <span className="text-gray-200 font-medium">{benefit}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Alex Hormozi Photo Placeholder */}
        <div className="text-center mb-8">
          <div className="w-24 h-24 bg-gradient-to-br from-gray-700 to-gray-900 rounded-full mx-auto border-2 border-yellow-500/30 flex items-center justify-center">
            <Star className="w-8 h-8 text-yellow-400" />
          </div>
          <p className="text-xs text-gray-500 mt-2">Founder's Circle – Platinum Advisory Seat</p>
        </div>

        {/* Application Button */}
        <div className="text-center">
          {isEligible ? (
            <Dialog open={isApplicationOpen} onOpenChange={setIsApplicationOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-400 hover:to-amber-500 text-black font-bold px-8 py-4 text-lg shadow-2xl shadow-yellow-500/25 hover:shadow-yellow-400/40 transition-all duration-300">
                  <Crown className="w-5 h-5 mr-2" />
                  Apply Now
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl bg-gradient-to-br from-slate-900 to-slate-800 border-yellow-500/30">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold text-yellow-400 text-center">
                    Platinum Lottery Application
                  </DialogTitle>
                </DialogHeader>
                
                <div className="space-y-6 mt-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Current Business Revenue (Annual)
                    </label>
                    <Input
                      value={applicationData.businessRevenue}
                      onChange={(e) => setApplicationData({...applicationData, businessRevenue: e.target.value})}
                      placeholder="e.g., $500K, $2M, $10M+"
                      className="bg-black/30 border-yellow-500/30 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Industry/Niche
                    </label>
                    <Input
                      value={applicationData.industry}
                      onChange={(e) => setApplicationData({...applicationData, industry: e.target.value})}
                      placeholder="e.g., Fitness Coaching, Business Consulting, SaaS"
                      className="bg-black/30 border-yellow-500/30 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Your Biggest Marketing Challenge
                    </label>
                    <Textarea
                      value={applicationData.biggestChallenge}
                      onChange={(e) => setApplicationData({...applicationData, biggestChallenge: e.target.value})}
                      placeholder="What's preventing you from scaling to the next level?"
                      className="bg-black/30 border-yellow-500/30 text-white h-24"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Why Do You Deserve Platinum Access?
                    </label>
                    <Textarea
                      value={applicationData.whyPlatinum}
                      onChange={(e) => setApplicationData({...applicationData, whyPlatinum: e.target.value})}
                      placeholder="Tell us about your vision, impact, and why you're among the top 5 founders this year"
                      className="bg-black/30 border-yellow-500/30 text-white h-32"
                    />
                  </div>

                  <div className="flex gap-4 pt-4">
                    <Button 
                      variant="outline" 
                      onClick={() => setIsApplicationOpen(false)}
                      className="flex-1 border-gray-600 text-gray-300"
                    >
                      Cancel
                    </Button>
                    <Button 
                      onClick={handleApplicationSubmit}
                      className="flex-1 bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-400 hover:to-amber-500 text-black font-bold"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Submit Application
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          ) : (
            <Button disabled className="bg-gray-700 text-gray-400 px-8 py-4 text-lg">
              <Lock className="w-5 h-5 mr-2" />
              Request Access – Founder Verification Required
            </Button>
          )}
        </div>

        {/* Disclaimer */}
        <div className="text-center mt-6 text-xs text-gray-500">
          Platinum tier is invitation-only and requires manual approval by the Founder's Circle.
        </div>
      </CardContent>
    </Card>
  );
}