import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { loginWithEmail, loginWithGoogle, resetPassword } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff, Mail } from "lucide-react";
import ProtectedRoute from "@/components/ProtectedRoute";
import ReCaptcha from "@/components/ReCaptcha";
import { attachFingerprint } from "@/lib/fingerprint";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!captchaToken) {
      toast({
        title: "Verification required",
        description: "Please complete the reCAPTCHA verification.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // Attach browser fingerprint for enhanced security
      const loginData = await attachFingerprint({
        email,
        password,
        recaptchaToken: captchaToken
      });
      
      await loginWithEmail(loginData.email, loginData.password, loginData.recaptchaToken);
      toast({
        title: "Welcome back!",
        description: "You've successfully logged in.",
      });
      setLocation("/dashboard");
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message || "Invalid email or password",
        variant: "destructive",
      });
      setCaptchaToken(null); // Reset captcha on error
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      await loginWithGoogle();
    } catch (error: any) {
      console.error("Google login error:", error);
      
      let errorMessage = "Failed to login with Google";
      
      // Handle specific Firebase Auth errors
      if (error.code === 'auth/unauthorized-domain') {
        errorMessage = "Google login is not authorized for this domain. Please contact support.";
      } else if (error.code === 'auth/operation-not-allowed') {
        errorMessage = "Google login is currently disabled. Please use email login.";
      } else if (error.code === 'auth/popup-blocked') {
        errorMessage = "Popup was blocked. Please allow popups and try again.";
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Google Login Issue",
        description: errorMessage,
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "Email required",
        description: "Please enter your email address first.",
        variant: "destructive",
      });
      return;
    }

    try {
      setResetLoading(true);
      await resetPassword(email);
      toast({
        title: "Password reset email sent",
        description: "Please check your inbox for password reset instructions.",
      });
    } catch (error: any) {
      console.log("Password reset error:", error.code, error.message);
      let errorMessage = "Failed to send password reset email";
      
      if (error.code === 'auth/user-not-found') {
        errorMessage = "No account found with this email address";
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = "Too many reset attempts. Please try again later";
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = "Please enter a valid email address";
      } else {
        errorMessage = `${errorMessage} (${error.code || 'unknown error'})`;
      }
      
      toast({
        title: "Reset failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <ProtectedRoute requireAuth={false}>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <Link href="/">
              <div className="flex items-center justify-center mb-3 cursor-pointer">
                <svg className="w-6 h-6 text-purple-500 mr-2" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
                </svg>
                <div className="text-2xl font-bold gradient-text">
                  OnyxHooks & More™
                </div>
              </div>
            </Link>
            <CardTitle className="text-2xl">Welcome back</CardTitle>
            <CardDescription>
              Sign in to your account to continue mastering high-converting hooks
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Button
              onClick={handleGoogleLogin}
              variant="outline"
              className="w-full"
              type="button"
              disabled={loading}
            >
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              {loading ? "Connecting..." : "Continue with Google"}
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with email
                </span>
              </div>
            </div>

            <form onSubmit={handleEmailLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pr-10"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              {/* reCAPTCHA */}
              <div className="flex justify-center">
                <ReCaptcha
                  onVerify={setCaptchaToken}
                  onExpired={() => setCaptchaToken(null)}
                  onError={() => setCaptchaToken(null)}
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading || !captchaToken}>
                {loading ? "Signing in..." : "Sign in"}
              </Button>
            </form>

            <div className="text-center space-y-2">
              <p className="text-sm text-gray-600">
                Don't have an account?{" "}
                <Link href="/signup">
                  <a className="text-primary hover:underline font-medium">
                    Sign up
                  </a>
                </Link>
              </p>
              <p className="text-sm">
                <a 
                  href="#" 
                  onClick={handleForgotPassword}
                  className="text-primary hover:underline"
                >
                  {resetLoading ? "Sending..." : "Forgot your password?"}
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </ProtectedRoute>
  );
}
