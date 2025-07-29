import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, AlertTriangle, XCircle, TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface ValueValidatorProps {
  offer: string;
  transformation?: string;
  painPoint?: string;
  targetAudience?: string;
  onValidationComplete?: (result: any) => void;
}

export function ValueValidator({ offer, transformation, painPoint, targetAudience, onValidationComplete }: ValueValidatorProps) {
  const [validation, setValidation] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const validateValue = async () => {
    if (!offer) {
      toast({ title: "Missing offer description", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      const response = await apiRequest("POST", "/api/validate-offer-value", {
        offer,
        transformation,
        painPoint,
        targetAudience
      });
      const result = await response.json();
      
      // Extract validation data from API response structure
      const validationData = result.success ? result.validation : result;
      setValidation(validationData);
      onValidationComplete?.(validationData);
    } catch (error: any) {
      toast({ title: "Error validating offer value", description: error.message, variant: "destructive" });
      setValidation(null);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number | undefined) => {
    if (!score && score !== 0) return "text-gray-500";
    if (score >= 8) return "text-green-600";
    if (score >= 6) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreIcon = (score: number | undefined) => {
    if (!score && score !== 0) return <XCircle className="h-5 w-5 text-gray-500" />;
    if (score >= 8) return <CheckCircle className="h-5 w-5 text-green-600" />;
    if (score >= 6) return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
    return <XCircle className="h-5 w-5 text-red-600" />;
  };

  const formatScore = (score: number | undefined) => {
    if (!score && score !== 0) return "N/A";
    return Number(score).toFixed(1);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center gap-3">
          <TrendingUp className="h-6 w-6 text-blue-600" />
          <div>
            <CardTitle>Value Before Price Validation</CardTitle>
            <CardDescription>
              Validate transformation value before proceeding with pricing and monetization
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <Button 
          onClick={validateValue}
          disabled={loading || !offer}
          className="w-full"
        >
          {loading ? "Validating Value..." : "Validate Offer Value"}
        </Button>

        {validation && (
          <div className="space-y-6">
            {/* Overall Score */}
            <div className="text-center p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex items-center justify-center gap-2 mb-2">
                {getScoreIcon(validation?.overallScore)}
                <span className={`text-2xl font-bold ${getScoreColor(validation?.overallScore)}`}>
                  {formatScore(validation?.overallScore)}/10
                </span>
              </div>
              <p className="text-sm text-gray-600">
                {validation?.isValueStrong ? 
                  "Strong value foundation - ready for premium pricing" : 
                  "Value needs strengthening before monetization"
                }
              </p>
            </div>

            {/* Value Dimensions */}
            <div className="space-y-4">
              <h4 className="font-semibold">Value Creation Assessment</h4>
              
              {/* Emotional Value */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Emotional Value</span>
                  <div className="flex items-center gap-2">
                    {getScoreIcon(validation?.emotionalValue?.score)}
                    <span className={`font-medium ${getScoreColor(validation?.emotionalValue?.score)}`}>
                      {formatScore(validation?.emotionalValue?.score)}/10
                    </span>
                  </div>
                </div>
                <Progress value={(validation?.emotionalValue?.score || 0) * 10} className="h-2" />
                <p className="text-xs text-gray-600">{validation?.emotionalValue?.assessment || "No assessment available"}</p>
                {validation?.emotionalValue?.gaps && validation.emotionalValue.gaps.length > 0 && (
                  <div className="text-xs text-red-600 font-medium">
                    <strong>Gaps:</strong> {validation.emotionalValue.gaps.join(", ")}
                  </div>
                )}
              </div>

              {/* Functional Value */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Functional Value</span>
                  <div className="flex items-center gap-2">
                    {getScoreIcon(validation?.functionalValue?.score)}
                    <span className={`font-medium ${getScoreColor(validation?.functionalValue?.score)}`}>
                      {formatScore(validation?.functionalValue?.score)}/10
                    </span>
                  </div>
                </div>
                <Progress value={(validation?.functionalValue?.score || 0) * 10} className="h-2" />
                <p className="text-xs text-gray-600">{validation?.functionalValue?.assessment || "No assessment available"}</p>
                {validation?.functionalValue?.gaps && validation.functionalValue.gaps.length > 0 && (
                  <div className="text-xs text-red-600 font-medium">
                    <strong>Gaps:</strong> {validation.functionalValue.gaps.join(", ")}
                  </div>
                )}
              </div>

              {/* Identity Value */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Identity Value</span>
                  <div className="flex items-center gap-2">
                    {getScoreIcon(validation?.identityValue?.score)}
                    <span className={`font-medium ${getScoreColor(validation?.identityValue?.score)}`}>
                      {formatScore(validation?.identityValue?.score)}/10
                    </span>
                  </div>
                </div>
                <Progress value={(validation?.identityValue?.score || 0) * 10} className="h-2" />
                <p className="text-xs text-gray-600">{validation?.identityValue?.assessment || "No assessment available"}</p>
                {validation?.identityValue?.gaps && validation.identityValue.gaps.length > 0 && (
                  <div className="text-xs text-red-600 font-medium">
                    <strong>Gaps:</strong> {validation.identityValue.gaps.join(", ")}
                  </div>
                )}
              </div>
            </div>

            {/* Recommendations */}
            {validation.recommendations?.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-semibold">Recommendations</h4>
                <div className="space-y-2">
                  {validation.recommendations.map((rec: string, index: number) => (
                    <div key={index} className="text-sm p-3 bg-blue-50 dark:bg-blue-900/20 rounded border-l-4 border-blue-500">
                      {rec}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Clarifying Questions */}
            {validation.clarifyingQuestions?.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-semibold">Clarifying Questions</h4>
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Answer these questions to strengthen your value proposition:
                  </AlertDescription>
                </Alert>
                <div className="space-y-2">
                  {validation.clarifyingQuestions.map((question: string, index: number) => (
                    <div key={index} className="text-sm p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded border-l-4 border-yellow-500">
                      {question}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Value Status Badge */}
            <div className="flex justify-center">
              <Badge variant={validation?.isValueStrong ? "default" : "destructive"} className="text-sm">
                {validation?.isValueStrong ? 
                  "✓ Ready for Pro/Vault Tools" : 
                  "⚠ Strengthen Value Before Monetization"
                }
              </Badge>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}