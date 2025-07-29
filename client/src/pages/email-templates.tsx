import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Eye, X } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

interface EmailTemplate {
  id: string;
  name: string;
  description: string;
  tier: string;
}

export default function EmailTemplates() {
  const { toast } = useToast();
  const [selectedTemplates, setSelectedTemplates] = useState<string[]>([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewContent, setPreviewContent] = useState<any>(null);

  // Fetch available templates
  const { data: templatesData, isLoading: templatesLoading } = useQuery({
    queryKey: ['/api/email-templates/available']
  });

  const templates: EmailTemplate[] = templatesData?.templates || [];

  // Preview template mutation
  const previewMutation = useMutation({
    mutationFn: async (templateId: string) => {
      const response = await fetch(`/api/email-templates/preview/${templateId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          industry: 'Life Coaching',
          targetAudience: 'Entrepreneurs',
          score: 75,
          tier: 'Pro Operator',
          painPoint: 'Struggling to scale revenue',
          desiredOutcome: 'Consistent 6-figure months'
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to generate preview');
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      setPreviewContent(data.template);
      setPreviewOpen(true);
    },
    onError: (error: any) => {
      toast({
        title: "Preview Failed",
        description: "Could not generate preview at this time",
        variant: "destructive",
      });
    }
  });

  const handleTemplateToggle = (templateId: string) => {
    setSelectedTemplates(prev => 
      prev.includes(templateId) 
        ? prev.filter(id => id !== templateId)
        : [...prev, templateId]
    );
  };

  const handlePreview = (templateId: string) => {
    previewMutation.mutate(templateId);
  };

  if (templatesLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6" style={{
      background: "radial-gradient(circle at 30% 20%, rgba(138, 43, 226, 0.15), transparent 50%), radial-gradient(circle at 70% 80%, rgba(75, 0, 130, 0.12), transparent 50%), linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)"
    }}>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent mb-2">
            Elite Email Arsenal
          </h1>
          <p className="text-xl text-gray-300">Council-backed email templates for maximum conversion</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {templates.map((template: EmailTemplate) => {
            const isSelected = selectedTemplates.includes(template.id);
            return (
              <Card 
                key={template.id} 
                className="border-2 transition-all duration-300 hover:border-[#F9C80E] shadow-lg"
                style={{
                  background: "linear-gradient(135deg, rgba(31, 41, 55, 0.95), rgba(17, 24, 39, 0.95))",
                  borderColor: isSelected ? "#F9C80E" : "rgba(138, 43, 226, 0.3)",
                  boxShadow: isSelected 
                    ? "0 10px 25px rgba(249, 200, 14, 0.3)" 
                    : "0 10px 25px rgba(0, 0, 0, 0.3)"
                }}
              >
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl font-bold text-white">{template.name}</CardTitle>
                    <div className="px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-purple-600 to-purple-800 text-white">
                      AVAILABLE
                    </div>
                  </div>
                  <CardDescription className="text-base text-gray-200 leading-relaxed">
                    {template.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-3">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handlePreview(template.id)}
                      disabled={previewMutation.isPending}
                      className="border-gray-600 text-gray-300 hover:border-[#F9C80E] hover:text-white transition-all duration-300"
                    >
                      {previewMutation.isPending ? (
                        <div className="animate-spin w-3 h-3 border-2 border-gray-300 border-t-transparent rounded-full mr-1" />
                      ) : (
                        <Eye className="h-3 w-3 mr-1" />
                      )}
                      Preview
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleTemplateToggle(template.id)}
                      className={
                        isSelected
                          ? "bg-gradient-to-r from-[#F9C80E] to-[#FCD34D] hover:from-[#FCD34D] hover:to-[#F9C80E] text-black font-semibold"
                          : "border-gray-600 text-gray-300 hover:border-[#F9C80E] hover:text-white bg-transparent"
                      }
                      variant={isSelected ? "default" : "outline"}
                    >
                      {isSelected ? "✓ Selected" : "Select"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {selectedTemplates.length > 0 && (
          <div className="mt-8 p-6 rounded-xl border-2" style={{
            background: "radial-gradient(circle at center, rgba(138, 43, 226, 0.15), rgba(75, 0, 130, 0.08))",
            borderColor: "rgba(249, 200, 14, 0.4)"
          }}>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-xl font-bold text-white mb-1">Campaign Ready</p>
                <p className="text-gray-300">Selected Templates: <span className="text-[#F9C80E] font-semibold">{selectedTemplates.length}</span></p>
              </div>
              <Button className="bg-gradient-to-r from-[#F9C80E] to-[#FCD34D] hover:from-[#FCD34D] hover:to-[#F9C80E] text-black font-bold px-8 py-3 text-lg">
                Generate Campaign
              </Button>
            </div>
          </div>
        )}

        {/* Preview Dialog */}
        <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-gray-900 border-gray-700">
            <DialogHeader>
              <div className="flex justify-between items-center">
                <DialogTitle className="text-xl font-bold text-white">
                  Email Preview: {previewContent?.subject}
                </DialogTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setPreviewOpen(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </DialogHeader>
            {previewContent && (
              <div className="space-y-4">
                <div className="p-4 bg-gray-800 rounded-lg border border-gray-700">
                  <h3 className="text-sm font-semibold text-gray-400 mb-2">Subject Line:</h3>
                  <p className="text-white font-medium">{previewContent.subject}</p>
                </div>
                <div className="p-4 bg-gray-800 rounded-lg border border-gray-700">
                  <h3 className="text-sm font-semibold text-gray-400 mb-2">Email Content:</h3>
                  <div 
                    className="prose prose-invert max-w-none"
                    dangerouslySetInnerHTML={{ __html: previewContent.htmlContent }}
                  />
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}