import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Shield, Check, X, AlertCircle, Copy } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

interface ReCaptchaStatus {
  success: boolean;
  siteKey: string;
  secretKey: string;
  configured: boolean;
}

interface TestResult {
  success: boolean;
  valid: boolean;
  response: any;
  message: string;
}

export default function ReCaptchaManager() {
  const [newSecretKey, setNewSecretKey] = useState('');
  const [testResult, setTestResult] = useState<TestResult | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get current reCAPTCHA status
  const { data: status, isLoading: statusLoading } = useQuery<ReCaptchaStatus>({
    queryKey: ['/api/admin/recaptcha/status'],
    queryFn: () => apiRequest('GET', '/api/admin/recaptcha/status').then(res => res.json())
  });

  // Test secret key mutation
  const testKeyMutation = useMutation({
    mutationFn: (secretKey: string) => 
      apiRequest('POST', '/api/admin/recaptcha/test', { secretKey }).then(res => res.json()),
    onSuccess: (data: TestResult) => {
      setTestResult(data);
      if (data.valid) {
        toast({
          title: "Key Test Successful",
          description: "reCAPTCHA secret key format is valid",
        });
      } else {
        toast({
          title: "Key Test Failed",
          description: data.message,
          variant: "destructive",
        });
      }
    },
    onError: (error: any) => {
      toast({
        title: "Test Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Validate and provide instructions mutation
  const validateKeyMutation = useMutation({
    mutationFn: (secretKey: string) => 
      apiRequest('POST', '/api/admin/recaptcha/update-env', { secretKey }).then(res => res.json()),
    onSuccess: (data: any) => {
      toast({
        title: "Validation Complete",
        description: data.message,
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/recaptcha/status'] });
    },
    onError: (error: any) => {
      toast({
        title: "Validation Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const handleTestKey = () => {
    if (!newSecretKey.trim()) {
      toast({
        title: "Error",
        description: "Please enter a secret key to test",
        variant: "destructive",
      });
      return;
    }
    testKeyMutation.mutate(newSecretKey.trim());
  };

  const handleValidateKey = () => {
    if (!newSecretKey.trim()) {
      toast({
        title: "Error",
        description: "Please enter a secret key to validate",
        variant: "destructive",
      });
      return;
    }
    validateKeyMutation.mutate(newSecretKey.trim());
  };

  const copyInstructions = () => {
    const instructions = [
      "1. Go to Replit → Tools → Secrets",
      "2. Find RECAPTCHA_SECRET_KEY",
      "3. Update the value with your new secret key",
      "4. Click Save"
    ].join('\n');
    
    navigator.clipboard.writeText(instructions);
    toast({
      title: "Instructions Copied",
      description: "Manual update instructions copied to clipboard",
    });
  };

  if (statusLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Current Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            reCAPTCHA Configuration Status
          </CardTitle>
          <CardDescription>
            Current configuration of your reCAPTCHA keys
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {status && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Site Key (Frontend)</label>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{status.siteKey}</Badge>
                  <Check className="w-4 h-4 text-green-500" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Secret Key (Backend)</label>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{status.secretKey}</Badge>
                  {status.configured ? (
                    <Check className="w-4 h-4 text-green-500" />
                  ) : (
                    <X className="w-4 h-4 text-red-500" />
                  )}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Key Testing and Validation */}
      <Card>
        <CardHeader>
          <CardTitle>Test & Validate reCAPTCHA Secret Key</CardTitle>
          <CardDescription>
            Test your new reCAPTCHA secret key before updating in Replit Secrets
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">New reCAPTCHA Secret Key</label>
            <Input
              type="password"
              placeholder="6L...your_secret_key_here"
              value={newSecretKey}
              onChange={(e) => setNewSecretKey(e.target.value)}
              className="font-mono"
            />
            <p className="text-xs text-muted-foreground">
              Secret key should start with "6L" and be at least 30 characters long
            </p>
          </div>

          <div className="flex gap-2">
            <Button 
              onClick={handleTestKey}
              disabled={testKeyMutation.isPending}
              variant="outline"
            >
              {testKeyMutation.isPending ? "Testing..." : "Test Key"}
            </Button>
            <Button 
              onClick={handleValidateKey}
              disabled={validateKeyMutation.isPending}
            >
              {validateKeyMutation.isPending ? "Validating..." : "Validate & Get Instructions"}
            </Button>
          </div>

          {/* Test Results */}
          {testResult && (
            <div className={`p-4 rounded-lg border ${
              testResult.valid 
                ? 'bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800' 
                : 'bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-800'
            }`}>
              <div className="flex items-center gap-2 mb-2">
                {testResult.valid ? (
                  <Check className="w-4 h-4 text-green-600" />
                ) : (
                  <X className="w-4 h-4 text-red-600" />
                )}
                <span className="font-medium">{testResult.message}</span>
              </div>
              {testResult.response && (
                <pre className="text-xs bg-white dark:bg-gray-900 p-2 rounded border overflow-auto">
                  {JSON.stringify(testResult.response, null, 2)}
                </pre>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Manual Update Instructions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            Manual Update Required
          </CardTitle>
          <CardDescription>
            Due to Replit's security restrictions, environment variables must be updated manually
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
            <h4 className="font-medium mb-2">Steps to Update reCAPTCHA Secret Key:</h4>
            <ol className="list-decimal list-inside space-y-1 text-sm">
              <li>Go to <strong>Replit → Tools → Secrets</strong></li>
              <li>Find <strong>RECAPTCHA_SECRET_KEY</strong></li>
              <li>Update the value with your new secret key</li>
              <li>Click <strong>Save</strong></li>
            </ol>
          </div>
          
          <Button onClick={copyInstructions} variant="outline" size="sm">
            <Copy className="w-4 h-4 mr-2" />
            Copy Instructions
          </Button>
          
          <p className="text-xs text-muted-foreground">
            After updating the secret key in Replit Secrets, refresh this page to see the updated status.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}