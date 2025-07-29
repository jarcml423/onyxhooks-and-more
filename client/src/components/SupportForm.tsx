import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { Loader2, Mail, MessageCircle, CheckCircle } from 'lucide-react';

const supportFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  category: z.enum(['technical', 'billing', 'feature_request', 'bug_report', 'general']),
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters')
});

type SupportFormData = z.infer<typeof supportFormSchema>;

const categoryOptions = [
  { value: 'technical', label: 'Technical Support' },
  { value: 'billing', label: 'Billing & Subscriptions' },
  { value: 'feature_request', label: 'Feature Request' },
  { value: 'bug_report', label: 'Bug Report' },
  { value: 'general', label: 'General Inquiry' }
];

interface SupportFormProps {
  className?: string;
}

export function SupportForm({ className }: SupportFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [ticketNumber, setTicketNumber] = useState<string>('');
  const { toast } = useToast();

  const form = useForm<SupportFormData>({
    resolver: zodResolver(supportFormSchema),
    defaultValues: {
      name: '',
      email: '',
      category: 'general',
      subject: '',
      message: ''
    }
  });

  const onSubmit = async (data: SupportFormData) => {
    setIsSubmitting(true);
    try {
      const response = await apiRequest('POST', '/api/support/submit', data);
      const result = await response.json();

      if (result.success) {
        setTicketNumber(result.ticketNumber);
        setIsSubmitted(true);
        toast({
          title: 'Support Ticket Submitted',
          description: `Your ticket ${result.ticketNumber} has been submitted successfully.`
        });
        form.reset();
      } else {
        toast({
          title: 'Submission Failed',
          description: result.message || 'Failed to submit support ticket. Please try again.',
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('Support form submission error:', error);
      toast({
        title: 'Error',
        description: 'An unexpected error occurred. Please try again or contact support@onyxnpearls.com',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <Card className={className}>
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Support Ticket Submitted
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                Your ticket <span className="font-mono font-bold text-purple-600 dark:text-purple-400">{ticketNumber}</span> has been created successfully.
              </p>
            </div>
            
            <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
              <h4 className="font-medium text-purple-900 dark:text-purple-100 mb-2">What happens next?</h4>
              <ul className="text-sm text-purple-800 dark:text-purple-200 space-y-1">
                <li>• You'll receive a confirmation email shortly</li>
                <li>• Our team will review your request</li>
                <li>• Most tickets are resolved within 24-48 hours</li>
                <li>• You'll get email updates as we work on your case</li>
              </ul>
            </div>
            
            <div className="flex gap-3 justify-center">
              <Button 
                variant="outline" 
                onClick={() => setIsSubmitted(false)}
              >
                Submit Another Ticket
              </Button>
              <Button asChild>
                <a href="mailto:support@onyxnpearls.com">
                  <Mail className="w-4 h-4 mr-2" />
                  Contact Support
                </a>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
            <MessageCircle className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <CardTitle>Get Support</CardTitle>
            <CardDescription>
              Submit a support ticket and our team will help you resolve any issues
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                {...form.register('name')}
                placeholder="Your full name"
                className={form.formState.errors.name ? 'border-red-500' : ''}
              />
              {form.formState.errors.name && (
                <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                {...form.register('email')}
                placeholder="your.email@example.com"
                className={form.formState.errors.email ? 'border-red-500' : ''}
              />
              {form.formState.errors.email && (
                <p className="text-sm text-red-500">{form.formState.errors.email.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select
              value={form.watch('category')}
              onValueChange={(value: any) => form.setValue('category', value)}
            >
              <SelectTrigger className={form.formState.errors.category ? 'border-red-500' : ''}>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categoryOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {form.formState.errors.category && (
              <p className="text-sm text-red-500">{form.formState.errors.category.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              {...form.register('subject')}
              placeholder="Brief description of your issue"
              className={form.formState.errors.subject ? 'border-red-500' : ''}
            />
            {form.formState.errors.subject && (
              <p className="text-sm text-red-500">{form.formState.errors.subject.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              {...form.register('message')}
              placeholder="Please provide detailed information about your issue..."
              rows={5}
              className={form.formState.errors.message ? 'border-red-500' : ''}
            />
            {form.formState.errors.message && (
              <p className="text-sm text-red-500">{form.formState.errors.message.message}</p>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="flex-1"
            >
              {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Submit Support Ticket
            </Button>
            
            <Button 
              type="button" 
              variant="outline"
              asChild
            >
              <a href="mailto:support@onyxnpearls.com">
                <Mail className="w-4 h-4 mr-2" />
                Email Direct
              </a>
            </Button>
          </div>
        </form>
        
        <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            <strong>Need immediate help?</strong> For urgent issues, contact us directly at{' '}
            <a href="mailto:support@onyxnpearls.com" className="text-purple-600 dark:text-purple-400 hover:underline">
              support@onyxnpearls.com
            </a>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}