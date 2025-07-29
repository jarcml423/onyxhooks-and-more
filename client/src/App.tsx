import { Switch, Route, Redirect } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";

import Landing from "@/pages/landing";
import Login from "@/pages/login";
import Signup from "@/pages/signup";
import Quiz from "@/pages/quiz";
import QuizResult from "@/pages/quiz-result";
import OfferGenerator from "@/pages/offer-generator";
import RoiSimulator from "@/pages/roi-simulator";
import Vault from "@/pages/vault";
import BeforeAfter from "@/pages/before-after";
import Referral from "@/pages/referral";
import Agency from "@/pages/agency";
import Dashboard from "@/pages/dashboard";
import Subscribe from "@/pages/subscribe";
import FreeTier from "@/pages/free-tier";
import ProTier from "@/pages/pro-tier";
import EmailTemplates from "@/pages/email-templates";
import CoachingDemo from "@/pages/coaching-demo";
import EliteCoaching from "@/pages/elite-coaching";
import CouncilPage from "@/pages/council";
import Disclaimer from "@/pages/disclaimer";
import NotFound from "@/pages/not-found";
import TestLogin from "@/components/TestLogin";
import { FreeHookGenerator } from "@/components/FreeHookGenerator";
import { StarterHookGenerator } from "@/components/StarterHookGenerator";
import { ProHookGenerator } from "@/components/ProHookGenerator";
import { VaultHookGenerator } from "@/components/VaultHookGenerator";
import { SwipeCopyBank } from "@/components/SwipeCopyBank";
import NavigationPage from "@/pages/NavigationPage";
import AdminDashboard from "@/pages/AdminDashboard";
import BillingError from "@/pages/BillingError";
import TestConsole from "@/pages/TestConsole";
import SubscriptionTest from "@/pages/subscription-test";
import TestEmail from "@/pages/test-email";
import FAQ from "@/pages/faq";
import SupportPage from "@/pages/support";
import PricingPage from "@/pages/pricing";
import HomePage from "@/pages/HomePage";
import PrivacyPage from "@/pages/PrivacyPage";
import TermsPage from "@/pages/TermsPage";
import NOSChallenge from "@/components/NOSChallenge";
import ProtectedRoute from "@/components/ProtectedRoute";
import CheckoutPage from "@/pages/checkout";

// Protected Admin Dashboard Component with enhanced security
function AdminDashboardProtected() {
  const { user, loading } = useAuth();
  
  // Enhanced admin check with immediate redirect if not authenticated
  if (!loading && !user) {
    window.location.href = '/login';
    return null;
  }
  
  // Enhanced admin privilege check
  if (!loading && user && user.email !== 'jarviscamp@bellsouth.net' && user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center bg-white p-8 rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Unauthorized Access</h1>
          <p className="text-gray-600 mb-4">Admin privileges required to access this page.</p>
          <button 
            onClick={() => window.location.href = '/dashboard'}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <ProtectedRoute adminOnly>
      <AdminDashboard />
    </ProtectedRoute>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/landing" component={Landing} />
      <Route path="/" component={HomePage} />
      <Route path="/test-login" component={TestLogin} />
      <Route path="/login" component={Login} />
      <Route path="/signup" component={Signup} />
      <Route path="/quiz" component={Quiz} />
      <Route path="/result/:id" component={QuizResult} />
      <Route path="/offer-generator" component={OfferGenerator} />
      <Route path="/roi-sim" component={RoiSimulator} />
      <Route path="/vault" component={Vault} />
      <Route path="/before-after" component={BeforeAfter} />
      <Route path="/referral" component={Referral} />
      <Route path="/agency" component={Agency} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/subscribe" component={Subscribe} />
      <Route path="/free-tier" component={FreeTier} />
      <Route path="/pro-tier" component={ProTier} />
      <Route path="/email-templates" component={EmailTemplates} />
      <Route path="/free-hooks" component={() => <FreeHookGenerator />} />
      <Route path="/starter-hooks" component={() => <StarterHookGenerator />} />
      <Route path="/pro-hooks" component={() => <ProHookGenerator />} />
      <Route path="/vault-hooks" component={() => <VaultHookGenerator />} />
      <Route path="/swipe-copy" component={() => <SwipeCopyBank />} />
      <Route path="/coaching-demo" component={CoachingDemo} />
      <Route path="/coaching" component={CoachingDemo} />
      <Route path="/pro-tools" component={ProTier} />
      <Route path="/elite-coaching" component={EliteCoaching} />
      <Route path="/council" component={CouncilPage} />
      <Route path="/disclaimer" component={Disclaimer} />
      <Route path="/navigation" component={NavigationPage} />
      <Route path="/admin" component={AdminDashboardProtected} />
      <Route path="/admin-dashboard" component={AdminDashboardProtected} />
      <Route path="/test-console" component={TestConsole} />
      <Route path="/billing-error" component={BillingError} />
      <Route path="/subscription-test" component={SubscriptionTest} />
      <Route path="/test-email" component={TestEmail} />
      <Route path="/faq" component={FAQ} />
      <Route path="/support" component={SupportPage} />
      <Route path="/pricing" component={PricingPage} />
      <Route path="/privacy" component={PrivacyPage} />
      <Route path="/terms" component={TermsPage} />
      <Route path="/checkout" component={CheckoutPage} />
      <Route path="/nos-challenge" component={() => <ProtectedRoute><NOSChallenge /></ProtectedRoute>} />
      <Route component={NotFound} />
    </Switch>
  );
}

// Domain redirect component - ensures users never see Replit URLs
function DomainRedirect({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const currentHost = window.location.hostname;
    const currentUrl = window.location.href;
    
    // Skip redirects in development environment
    if (currentHost === 'localhost' || import.meta.env.DEV) {
      console.log(`[DEV MODE] Skipping domain redirect for ${currentHost}`);
      return;
    }
    
    // If on Replit domain, redirect to www subdomain using replace() to avoid browser history
    if (currentHost.includes('replit.app') || currentHost.includes('replit.dev')) {
      const redirectUrl = `https://www.onyxnpearls.com${window.location.pathname}${window.location.search}${window.location.hash}`;
      console.log(`[CLIENT REDIRECT] ${currentUrl} → ${redirectUrl}`);
      window.location.replace(redirectUrl); // replace() prevents back button from showing Replit URL
      return;
    }
    
    // Force apex domain to www subdomain (matches CNAME configuration)
    if (currentHost === 'onyxnpearls.com') {
      const redirectUrl = `https://www.onyxnpearls.com${window.location.pathname}${window.location.search}${window.location.hash}`;
      console.log(`[WWW REDIRECT] ${currentUrl} → ${redirectUrl}`);
      window.location.replace(redirectUrl);
      return;
    }
  }, []);
  
  return <>{children}</>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <DomainRedirect>
            <Toaster />
            <Router />
          </DomainRedirect>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
