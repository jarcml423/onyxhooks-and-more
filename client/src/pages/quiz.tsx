import { useState, useEffect } from "react";
import { Link } from "wouter";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ReCaptcha from "@/components/ReCaptcha";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { 
  quizQuestions, 
  calculateQuizScore, 
  getTierColor, 
  getTierBadgeColor,
  type QuizAnswer,
  type QuizResult
} from "@/lib/offerScoring";
import { 
  Brain, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle, 
  Target, 
  Trophy,
  RefreshCw,
  Sparkles,
  Mail,
  Lock,
  Rocket,
  Star
} from "lucide-react";

type QuizState = 'intro' | 'questions' | 'email' | 'results';

export default function Quiz() {
  const [currentState, setCurrentState] = useState<QuizState>('intro');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [animatedScore, setAnimatedScore] = useState(0);
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Effect to restore selected answer when navigating between questions
  useEffect(() => {
    const existingAnswer = answers.find(answer => 
      answer.questionId === quizQuestions[currentQuestion]?.id
    );
    
    if (existingAnswer) {
      setSelectedAnswer(existingAnswer.value.toString());
    } else {
      setSelectedAnswer('');
    }
  }, [currentQuestion, answers]);

  // Submit quiz results
  const submitQuizMutation = useMutation({
    mutationFn: async (data: { email: string; firstName: string; lastName: string; score: number; tier: string; recaptchaToken: string }) => {
      const response = await apiRequest("POST", "/api/quiz-submit", data);
      return response.json();
    },
    onSuccess: (data) => {
      console.log('Quiz submission successful:', data);
      console.log('Current quizResult state:', quizResult);
      console.log('Setting currentState to results');
      setCurrentState('results');
      toast({
        title: "Quiz Completed!",
        description: "Your results have been saved and recommendations sent to your email.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Submission Error",
        description: error.message || "Failed to submit quiz. Please try again.",
        variant: "destructive",
      });
    }
  });

  // Handle answer selection
  const handleAnswerSelect = (value: string) => {
    setSelectedAnswer(value);
  };

  // Move to next question
  const handleNextQuestion = () => {
    if (!selectedAnswer) return;

    const questionData = quizQuestions[currentQuestion];
    const answerData = questionData.answers.find(a => a.value.toString() === selectedAnswer);
    
    if (answerData) {
      const newAnswer: QuizAnswer = {
        questionId: questionData.id,
        value: answerData.value,
        text: answerData.text
      };
      
      // Update answers array - replace existing answer or add new one
      const updatedAnswers = answers.filter(a => a.questionId !== questionData.id);
      updatedAnswers.push(newAnswer);
      setAnswers(updatedAnswers);
    }

    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedAnswer('');
    } else {
      // Calculate results
      const result = calculateQuizScore([...answers.filter(a => a.questionId !== questionData.id), {
        questionId: questionData.id,
        value: answerData?.value || 0,
        text: answerData?.text || ''
      }]);
      setQuizResult(result);
      setCurrentState('email');
    }
  };

  // Go back to previous question
  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      // Save current answer if one is selected
      if (selectedAnswer) {
        const questionData = quizQuestions[currentQuestion];
        const answerData = questionData.answers.find(a => a.value.toString() === selectedAnswer);
        
        if (answerData) {
          const newAnswer: QuizAnswer = {
            questionId: questionData.id,
            value: answerData.value,
            text: answerData.text
          };
          
          // Update answers array - replace existing answer or add new one
          const updatedAnswers = answers.filter(a => a.questionId !== questionData.id);
          updatedAnswers.push(newAnswer);
          setAnswers(updatedAnswers);
        }
      }
      
      // Move to previous question
      setCurrentQuestion(prev => prev - 1);
    }
  };

  // Handle email submission
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !firstName || !lastName || !quizResult) {
      toast({
        title: "Missing Information",
        description: "Please provide your first name, last name, and email address.",
        variant: "destructive",
      });
      return;
    }

    // Fallback: proceed without reCAPTCHA if it fails
    submitQuizMutation.mutate({
      email,
      firstName,
      lastName,
      score: quizResult.score,
      tier: quizResult.tier,
      recaptchaToken: recaptchaToken || 'fallback'
    });
  };

  // Animate score counter
  useEffect(() => {
    if (currentState === 'results' && quizResult) {
      let start = 0;
      const increment = quizResult.score / 50; // 50 steps
      const timer = setInterval(() => {
        start += increment;
        if (start >= quizResult.score) {
          setAnimatedScore(quizResult.score);
          clearInterval(timer);
        } else {
          setAnimatedScore(Math.floor(start));
        }
      }, 30);
      return () => clearInterval(timer);
    }
  }, [currentState, quizResult]);

  // Reset quiz
  const resetQuiz = () => {
    setCurrentState('intro');
    setCurrentQuestion(0);
    setAnswers([]);
    setSelectedAnswer('');
    setEmail('');
    setQuizResult(null);
    setAnimatedScore(0);
    setRecaptchaToken(null);
  };

  const progress = ((currentQuestion + 1) / quizQuestions.length) * 100;

  return (
    <div className="cinematic-page">
      <Navigation />
      
      <main className="max-w-4xl mx-auto px-4 py-12">
        {/* Intro State */}
        {currentState === 'intro' && (
          <div className="text-center">
            <div className="mb-8">
              <Brain className="w-16 h-16 text-purple-400 mx-auto mb-4" style={{
                filter: 'drop-shadow(0 0 10px rgba(168, 85, 247, 0.5))'
              }} />
              <h1 className="text-4xl font-bold text-white mb-4" style={{
                background: 'linear-gradient(90deg, #ffffff, #c084fc, #ffffff)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                Offer Strength Quiz
              </h1>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                Discover how strong your digital offer is and get personalized recommendations 
                from our Council of industry experts to maximize your revenue potential.
              </p>
            </div>

            <Card className="max-w-2xl mx-auto cinematic-card">
              <CardContent className="p-8">
                <div className="space-y-6">
                  <div className="flex items-center justify-center space-x-4 text-sm text-gray-300">
                    <div className="flex items-center">
                      <Target className="w-4 h-4 mr-2 text-purple-400" />
                      6 Strategic Questions
                    </div>
                    <div className="flex items-center">
                      <Trophy className="w-4 h-4 mr-2 text-purple-400" />
                      Council-Backed Scoring
                    </div>
                    <div className="flex items-center">
                      <Sparkles className="w-4 h-4 mr-2 text-purple-400" />
                      Personalized Plan
                    </div>
                  </div>
                  
                  <Button 
                    onClick={() => setCurrentState('questions')}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-lg py-6"
                  >
                    Start Quiz Assessment
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                  
                  <p className="text-xs text-gray-500">
                    Takes 3-5 minutes • Results include tier recommendation • No spam, ever
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Questions State */}
        {currentState === 'questions' && (
          <div>
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-900">
                  Question {currentQuestion + 1} of {quizQuestions.length}
                </h2>
                <span className="text-sm text-gray-500">
                  {Math.round(progress)}% Complete
                </span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl">
                  {quizQuestions[currentQuestion].question}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup value={selectedAnswer} onValueChange={handleAnswerSelect}>
                  <div className="space-y-4">
                    {quizQuestions[currentQuestion].answers.map((answer, index) => (
                      <div key={index} className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                        <RadioGroupItem value={answer.value.toString()} id={`answer-${index}`} />
                        <Label 
                          htmlFor={`answer-${index}`}
                          className="flex-1 cursor-pointer text-base"
                        >
                          {answer.text}
                        </Label>
                        <span className="text-sm font-medium text-blue-600">
                          +{answer.value} pts
                        </span>
                      </div>
                    ))}
                  </div>
                </RadioGroup>

                <div className="flex justify-between mt-8">
                  <Button
                    variant="outline"
                    onClick={handlePreviousQuestion}
                    disabled={currentQuestion === 0}
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Previous
                  </Button>
                  
                  <Button
                    onClick={handleNextQuestion}
                    disabled={!selectedAnswer}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {currentQuestion === quizQuestions.length - 1 ? 'Complete Quiz' : 'Next Question'}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Email Collection State */}
        {currentState === 'email' && quizResult && (
          <div className="text-center">
            <div className="mb-8">
              <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Quiz Complete!
              </h2>
              <p className="text-xl text-gray-600">
                Enter your details to receive your detailed results and personalized recommendations.
              </p>
            </div>

            <Card className="max-w-2xl mx-auto">
              <CardContent className="p-8">
                <form onSubmit={handleEmailSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName" className="text-base font-medium">
                        First Name
                      </Label>
                      <Input
                        id="firstName"
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="John"
                        className="mt-2"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName" className="text-base font-medium">
                        Last Name
                      </Label>
                      <Input
                        id="lastName"
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Smith"
                        className="mt-2"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="email" className="text-base font-medium">
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="john@company.com"
                      className="mt-2"
                      required
                    />
                  </div>

                  <ReCaptcha 
                    onVerify={setRecaptchaToken}
                    onExpired={() => setRecaptchaToken(null)}
                  />

                  <Button
                    type="submit"
                    disabled={!email || !firstName || !lastName || submitQuizMutation.isPending}
                    className="w-full bg-green-600 hover:bg-green-700 text-lg py-6"
                  >
                    {submitQuizMutation.isPending ? (
                      <>
                        <RefreshCw className="mr-2 h-5 w-5 animate-spin" />
                        Processing Results...
                      </>
                    ) : (
                      <>
                        <Mail className="mr-2 h-5 w-5" />
                        Get My Results
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Results State */}
        {currentState === 'results' && (
          <div className="text-center">
            {quizResult ? (
              <>
                <div className="mb-8">
                  <Trophy className="w-16 h-16 text-yellow-600 mx-auto mb-4" />
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    Your Offer Strength Score
                  </h2>
                </div>

                <Card className="max-w-3xl mx-auto mb-8">
                  <CardContent className="p-8">
                    <div className="text-center mb-8">
                      <div className="text-6xl font-bold text-blue-600 mb-2">
                        {animatedScore}
                        <span className="text-3xl text-gray-500">/100</span>
                      </div>
                      <Progress value={(animatedScore / 100) * 100} className="h-3 max-w-md mx-auto" />
                    </div>

                    <div className="mb-8">
                      <Badge className={`text-lg px-6 py-3 ${getTierBadgeColor(quizResult.tier)}`}>
                        {quizResult.recommendation.title}
                      </Badge>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-6 mb-8">
                      <blockquote className="text-lg italic text-gray-700 mb-4">
                        "{quizResult.recommendation.message}"
                      </blockquote>
                      <cite className="text-sm font-medium text-gray-600">
                        – {quizResult.recommendation.council}
                      </cite>
                    </div>

                    <div className="space-y-4">
                      <Button 
                        asChild
                        className={`w-full text-lg py-6 ${
                          quizResult.tier === 'vault' 
                            ? 'bg-purple-600 hover:bg-purple-700' 
                            : quizResult.tier === 'pro'
                            ? 'bg-blue-600 hover:bg-blue-700'
                            : 'bg-green-600 hover:bg-green-700'
                        }`}
                      >
                        <Link href="/#pricing">
                          {quizResult.tier === 'vault' && <Lock className="mr-2 h-5 w-5" />}
                          {quizResult.tier === 'pro' && <Rocket className="mr-2 h-5 w-5" />}
                          {quizResult.tier === 'free' && <Star className="mr-2 h-5 w-5" />}
                          See What You Get With {quizResult.tier === 'vault' ? 'Vault' : quizResult.tier === 'pro' ? 'Pro' : 'Free'}
                        </Link>
                      </Button>
                      
                      <Button
                        variant="outline"
                        onClick={resetQuiz}
                        className="w-full"
                      >
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Try Again
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <div className="text-sm text-gray-500">
                  <p>Results have been sent to your email • Share this quiz with other creators</p>
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <Trophy className="w-16 h-16 text-yellow-600 mx-auto mb-4" />
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Quiz Completed Successfully!
                </h2>
                <p className="text-lg text-gray-600 mb-8">
                  Your results have been saved and sent to your email.
                </p>
                <Button
                  variant="outline"
                  onClick={resetQuiz}
                  className="w-full max-w-md"
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Take Quiz Again
                </Button>
              </div>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}