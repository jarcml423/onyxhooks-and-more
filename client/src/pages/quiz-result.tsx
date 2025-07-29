import { useEffect, useState } from "react";
import { Link, useRoute } from "wouter";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useQuery } from "@tanstack/react-query";
import { CheckCircle, AlertCircle, TrendingUp, Sparkles, ArrowRight, Mail } from "lucide-react";

export default function QuizResult() {
  const [, params] = useRoute("/result/:id");
  const resultId = params?.id;

  const { data: result, isLoading } = useQuery({
    queryKey: [`/api/quiz-result/${resultId}`],
    enabled: !!resultId,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-gray-600">Analyzing your results...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Card className="text-center">
            <CardContent className="pt-8">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Results Not Found</h2>
              <p className="text-gray-600 mb-6">We couldn't find your quiz results. Please try taking the quiz again.</p>
              <Link href="/quiz">
                <Button>Take Quiz Again</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const getTierInfo = (score: number) => {
    if (score >= 76) {
      return {
        tier: "Optimized",
        color: "green",
        bgColor: "bg-green-50",
        borderColor: "border-green-200",
        textColor: "text-green-800",
        icon: CheckCircle,
        description: "Your offer is well-optimized and ready to scale!"
      };
    } else if (score >= 41) {
      return {
        tier: "Getting Close",
        color: "yellow",
        bgColor: "bg-yellow-50",
        borderColor: "border-yellow-200",
        textColor: "text-yellow-800",
        icon: TrendingUp,
        description: "Your offer has potential - a few tweaks will make it convert much better."
      };
    } else {
      return {
        tier: "Needs Work",
        color: "red",
        bgColor: "bg-red-50",
        borderColor: "border-red-200",
        textColor: "text-red-800",
        icon: AlertCircle,
        description: "There's significant room for improvement in your offer structure."
      };
    }
  };

  const tierInfo = getTierInfo(result.score);
  const TierIcon = tierInfo.icon;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Your Offer Strength Results
          </h1>
          <p className="text-xl text-gray-600">
            Here's how your offer performs and what you can do to improve it
          </p>
        </div>

        {/* Score Card */}
        <Card className={`mb-8 ${tierInfo.bgColor} ${tierInfo.borderColor} border-2`}>
          <CardContent className="text-center py-12">
            <div className="relative mb-6">
              <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center mx-auto shadow-lg">
                <span className="text-4xl font-bold text-gray-900">{result.score}</span>
              </div>
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                <Badge className={`${tierInfo.textColor} ${tierInfo.bgColor} border-white`}>
                  {tierInfo.tier}
                </Badge>
              </div>
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Offer Strength: {result.score}/100
            </h2>
            <p className={`text-lg ${tierInfo.textColor} mb-6`}>
              {tierInfo.description}
            </p>

            <div className="max-w-md mx-auto">
              <Progress value={result.score} className="h-3 mb-2" />
              <div className="flex justify-between text-sm text-gray-500">
                <span>Needs Work</span>
                <span>Getting Close</span>
                <span>Optimized</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Feedback */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TierIcon className={`w-5 h-5 mr-2 ${tierInfo.textColor}`} />
                Detailed Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">
                {result.feedback}
              </p>
            </CardContent>
          </Card>

          {/* Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Sparkles className="w-5 h-5 mr-2 text-primary" />
                Key Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {result.recommendations?.map((rec: string, index: number) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{rec}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Email Confirmation */}
        <Card className="mt-8 bg-blue-50 border-blue-200">
          <CardContent className="text-center py-8">
            <Mail className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Check Your Email!
            </h3>
            <p className="text-gray-600 mb-6">
              We've sent a detailed breakdown of your results plus AI-generated improvement suggestions to your email address.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/offer-generator">
                <Button className="btn-primary">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Try OnyxHooks & More™ Free
                </Button>
              </Link>
              <Link href="/quiz">
                <Button variant="outline">
                  Retake Quiz
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <div className="text-center mt-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">
            Ready to Optimize Your Offer?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="card-hover">
              <CardContent className="text-center p-6">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-6 h-6 text-primary" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Generate Better Offers</h4>
                <p className="text-sm text-gray-600 mb-4">Use our AI to create optimized offers based on your niche and goals.</p>
                <Link href="/offer-generator">
                  <Button variant="outline" size="sm">
                    Try Generator
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="card-hover">
              <CardContent className="text-center p-6">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">ROI Simulator</h4>
                <p className="text-sm text-gray-600 mb-4">Model different pricing strategies and see potential returns.</p>
                <Link href="/roi-sim">
                  <Button variant="outline" size="sm">
                    Run Simulation
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="card-hover">
              <CardContent className="text-center p-6">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-6 h-6 text-purple-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Prompt Vault</h4>
                <p className="text-sm text-gray-600 mb-4">Access 200+ proven templates for offers, emails, and ads.</p>
                <Link href="/vault">
                  <Button variant="outline" size="sm">
                    Browse Vault
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
