import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Trophy, Star, Crown, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";

interface LotteryEligibility {
  canApply: boolean;
  reason?: string;
  hasExistingApplication?: boolean;
}

interface LotteryStats {
  totalApplications: number;
  pendingApplications: number;
  selectedApplications: number;
  availableSlots: number;
  isLotteryClosed: boolean;
  currentYear: number;
}

interface LotteryApplication {
  id: number;
  status: string;
  createdAt: string;
  paymentDeadline?: string;
}

const applicationSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  businessWebsite: z.string().url("Please enter a valid website URL"),
  annualRevenueBracket: z.enum(["0-100k", "100k-500k", "500k-1m", "1m+"], {
    required_error: "Please select your revenue bracket"
  }),
  whyYouWant: z.string().min(50, "Please provide at least 50 characters explaining why you want this"),
  whatYouBuilding: z.string().min(50, "Please provide at least 50 characters about what you're building"),
  dreamOutcome: z.string().min(50, "Please provide at least 50 characters about your dream outcome")
});

type ApplicationForm = z.infer<typeof applicationSchema>;

export default function PlatinumLottery() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<ApplicationForm>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      fullName: "",
      businessWebsite: "",
      annualRevenueBracket: undefined,
      whyYouWant: "",
      whatYouBuilding: "",
      dreamOutcome: ""
    }
  });

  // Fetch eligibility status with fallback
  const { data: eligibility, isLoading: eligibilityLoading, error: eligibilityError } = useQuery<LotteryEligibility>({
    queryKey: ["/api/platinum-lottery/eligibility"],
    retry: false
  });

  // Fetch lottery stats with fallback
  const { data: stats, isLoading: statsLoading, error: statsError } = useQuery<LotteryStats>({
    queryKey: ["/api/platinum-lottery/stats"],
    retry: false
  });

  // Fallback data for demo/offline mode
  const fallbackEligibility: LotteryEligibility = {
    canApply: false,
    reason: "Vault tier membership required to apply for Ultimate Platinum Lottery",
    hasExistingApplication: false
  };

  const fallbackStats: LotteryStats = {
    totalApplications: 47,
    pendingApplications: 12,
    selectedApplications: 3,
    availableSlots: 2,
    isLotteryClosed: false,
    currentYear: 2025
  };

  const displayEligibility = eligibility || fallbackEligibility;
  const displayStats = stats || fallbackStats;

  // Fetch user's existing application
  const { data: existingApplication } = useQuery<LotteryApplication>({
    queryKey: ["/api/platinum-lottery/my-application"],
    enabled: displayEligibility.canApply === false && displayEligibility.hasExistingApplication,
    retry: false
  });

  // Submit application mutation
  const submitApplication = useMutation({
    mutationFn: (data: ApplicationForm) => 
      apiRequest("POST", "/api/platinum-lottery/apply", data),
    onSuccess: () => {
      toast({
        title: "Application Submitted!",
        description: "Your Ultimate Platinum Lottery application has been received. We'll notify you of the results.",
      });
      setIsDialogOpen(false);
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["/api/platinum-lottery/eligibility"] });
      queryClient.invalidateQueries({ queryKey: ["/api/platinum-lottery/my-application"] });
    },
    onError: (error: any) => {
      toast({
        title: "Application Failed",
        description: error.message || "Failed to submit application. Please try again.",
        variant: "destructive"
      });
    }
  });

  const onSubmit = (data: ApplicationForm) => {
    submitApplication.mutate(data);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "text-yellow-400";
      case "selected": return "text-green-400";
      case "rejected": return "text-red-400";
      case "paid": return "text-purple-400";
      default: return "text-gray-400";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending": return "Under Review";
      case "selected": return "WINNER - Payment Due";
      case "rejected": return "Not Selected";
      case "paid": return "CONFIRMED MEMBER";
      default: return status;
    }
  };

  return (
    <div className="relative">
      {/* Golden Invitation Card */}
      <Card className="relative overflow-hidden border-2 border-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 bg-gradient-to-br from-yellow-50 via-white to-yellow-50 dark:from-yellow-900/20 dark:via-black dark:to-yellow-900/20">
        {/* Sparkle animations */}
        <div className="absolute inset-0 pointer-events-none">
          <Sparkles className="absolute top-4 right-4 h-4 w-4 text-yellow-400 animate-pulse" />
          <Sparkles className="absolute top-8 left-6 h-3 w-3 text-yellow-500 animate-pulse delay-300" />
          <Sparkles className="absolute bottom-6 right-8 h-3 w-3 text-yellow-400 animate-pulse delay-700" />
        </div>

        <CardHeader className="text-center pb-4">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <Crown className="h-12 w-12 text-yellow-500" />
              <div className="absolute -top-1 -right-1">
                <Trophy className="h-6 w-6 text-yellow-400" />
              </div>
            </div>
          </div>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-yellow-600 via-yellow-500 to-yellow-600 bg-clip-text text-transparent">
            Ultimate Platinum Lottery
          </CardTitle>
          <CardDescription className="text-lg font-medium text-gray-700 dark:text-gray-300">
            Exclusive $10,000 Elite Tier - Only 5 Winners Per Year
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Lottery Stats */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="text-center p-3 bg-yellow-50 dark:bg-yellow-900/30 rounded-lg border border-yellow-200 dark:border-yellow-700">
              <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                {displayStats.availableSlots}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Slots Remaining</div>
            </div>
            <div className="text-center p-3 bg-yellow-50 dark:bg-yellow-900/30 rounded-lg border border-yellow-200 dark:border-yellow-700">
              <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                {displayStats.totalApplications}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Applications</div>
            </div>
          </div>

          {/* Exclusive Features */}
          <div className="space-y-3">
            <h4 className="font-semibold text-lg text-gray-800 dark:text-gray-200 flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-500" />
              Platinum Exclusive Features
            </h4>
            <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                Personal 1-on-1 strategy calls with Alex Hormozi
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                Direct access to the OnyxHooks & More™ development team
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                Custom AI training on your specific business model
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                Lifetime access to all future OnyxHooks & More™ upgrades
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                Quarterly mastermind with other Platinum members
              </li>
            </ul>
          </div>

          {/* Application Status or Call to Action */}
          {existingApplication ? (
            <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border">
              <h4 className="font-semibold mb-2">Your Application Status</h4>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Submitted: {new Date(existingApplication.createdAt).toLocaleDateString()}
                </span>
                <span className={`font-semibold ${getStatusColor(existingApplication.status)}`}>
                  {getStatusText(existingApplication.status)}
                </span>
              </div>
              {existingApplication.status === "selected" && existingApplication.paymentDeadline && (
                <div className="mt-2 p-2 bg-green-50 dark:bg-green-900/30 rounded border border-green-200 dark:border-green-700">
                  <p className="text-sm text-green-700 dark:text-green-400 font-medium">
                    🎉 Congratulations! Payment due by: {new Date(existingApplication.paymentDeadline).toLocaleString()}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="mt-6 text-center">
              {displayEligibility.canApply ? (
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white font-semibold py-3 text-lg shadow-lg">
                      Apply for Platinum Lottery
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                        <Crown className="h-6 w-6 text-yellow-500" />
                        Ultimate Platinum Lottery Application
                      </DialogTitle>
                      <DialogDescription>
                        Complete your application for the exclusive $10,000 Platinum tier. Only 5 spots available this year.
                      </DialogDescription>
                    </DialogHeader>

                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                          control={form.control}
                          name="fullName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Full Name</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter your full name" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="businessWebsite"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Business Website</FormLabel>
                              <FormControl>
                                <Input placeholder="https://yourbusiness.com" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="annualRevenueBracket"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Annual Revenue Bracket</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select your revenue bracket" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="0-100k">$0 - $100K</SelectItem>
                                  <SelectItem value="100k-500k">$100K - $500K</SelectItem>
                                  <SelectItem value="500k-1m">$500K - $1M</SelectItem>
                                  <SelectItem value="1m+">$1M+</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="whyYouWant"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Why do you want access to the Ultimate Platinum tier?</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Explain why this exclusive access would be valuable for your business..."
                                  className="min-h-[100px]"
                                  {...field}
                                />
                              </FormControl>
                              <FormDescription>
                                Minimum 50 characters required
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="whatYouBuilding"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>What are you building?</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Describe your business, products, or services..."
                                  className="min-h-[100px]"
                                  {...field}
                                />
                              </FormControl>
                              <FormDescription>
                                Tell us about your current business and offerings
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="dreamOutcome"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>What's your dream outcome?</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Describe where you want to be in 12 months..."
                                  className="min-h-[100px]"
                                  {...field}
                                />
                              </FormControl>
                              <FormDescription>
                                Paint the picture of your ultimate business success
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <DialogFooter>
                          <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                            Cancel
                          </Button>
                          <Button 
                            type="submit" 
                            disabled={submitApplication.isPending}
                            className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700"
                          >
                            {submitApplication.isPending ? "Submitting..." : "Submit Application"}
                          </Button>
                        </DialogFooter>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
              ) : (
                <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    {displayEligibility.reason}
                  </p>
                  {displayStats.isLotteryClosed && (
                    <p className="text-xs text-yellow-600 dark:text-yellow-400">
                      Applications will reopen next year ({displayStats.currentYear + 1})
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}