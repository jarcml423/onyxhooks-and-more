import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Download, RefreshCw, Copy, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import html2canvas from 'html2canvas';

interface VisualTemplateProps {
  id: string;
  title: string;
  hook: string;
  body: string;
  cta: string;
  industry: string;
  tone: string;
  backgroundImage: string;
  metrics: {
    conversionRate: string;
    ctrLift: string;
    cpa: string;
    roas: string;
  };
  tier: 'starter' | 'pro' | 'vault';
}

export default function VisualTemplateGenerator({ 
  id, title, hook, body, cta, industry, tone, backgroundImage, metrics, tier 
}: VisualTemplateProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPreview, setShowPreview] = useState(true); // Default to showing preview
  const templateRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const getIndustryBackground = (industry: string): string => {
    const backgrounds = {
      fitness: 'https://images.unsplash.com/photo-1594736797933-d0401ba3cd00?w=800&h=600&fit=crop', // Woman 40+ working out
      yoga: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&h=600&fit=crop',
      business: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=600&fit=crop',
      coaching: 'https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=800&h=600&fit=crop',
      marketing: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop',
      real_estate: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=600&fit=crop',
      health: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop', // Active lifestyle
      finance: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=600&fit=crop',
      'women_fitness': 'https://images.unsplash.com/photo-1594736797933-d0401ba3cd00?w=800&h=600&fit=crop' // Specific for women 40+ fitness
    };
    return backgrounds[industry.toLowerCase()] || backgrounds.business;
  };

  const generateNewVariation = async () => {
    setIsGenerating(true);
    
    // Track usage for upgrade triggers
    await fetch('/api/starter/track-usage', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ templateId: id, action: 'generate_variation' })
    });

    // Simulate variation generation
    setTimeout(() => {
      setIsGenerating(false);
      toast({
        title: "New Variation Generated",
        description: `${title} variation created with ${metrics.conversionRate}% CVR`,
      });
    }, 2000);
  };

  const exportTemplate = async (format: 'png' | 'pdf') => {
    if (!templateRef.current) return;

    try {
      const canvas = await html2canvas(templateRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: null
      });

      const link = document.createElement('a');
      link.download = `${title.replace(/\s+/g, '_')}_template.${format}`;
      
      if (format === 'png') {
        link.href = canvas.toDataURL('image/png');
      } else {
        // For PDF, we'd need a library like jsPDF
        link.href = canvas.toDataURL('image/png');
      }
      
      link.click();

      toast({
        title: "Template Exported",
        description: `${title} exported as ${format.toUpperCase()}`,
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Please try again",
        variant: "destructive"
      });
    }
  };

  const copyTemplate = async () => {
    const templateText = `${hook}\n\n${body}\n\n${cta}`;
    await navigator.clipboard.writeText(templateText);
    
    toast({
      title: "Template Copied",
      description: `${metrics.conversionRate}% CVR template ready to use`,
    });
  };

  return (
    <Card className="overflow-hidden bg-gradient-to-br from-gray-900 to-black border border-gray-700">
      <CardContent className="p-0">
        {/* Visual Template Preview - Always Visible */}
        <div 
          ref={templateRef}
          className="relative w-full h-80 overflow-hidden bg-cover bg-center bg-no-repeat cursor-pointer hover:scale-[1.02] transition-transform duration-300"
          style={{ 
            backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.6)), url(${getIndustryBackground(industry)})`,
          }}
          onClick={() => setShowPreview(!showPreview)}
        >
          {/* Embedded Text Overlay */}
          <div className="absolute inset-0 p-8 flex flex-col justify-center text-white">
            {/* Hook */}
            <div className="mb-6">
              <div className="inline-flex items-center space-x-2 mb-3">
                <span className="text-2xl">🌟</span>
                <Badge variant="outline" className="text-yellow-400 border-yellow-400 bg-black/30">
                  {metrics.conversionRate}% CVR
                </Badge>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold leading-tight text-shadow-lg mb-4">
                {hook}
              </h2>
            </div>

            {/* Body Copy */}
            <div className="mb-6">
              <span className="text-xl mb-2 block">🧠</span>
              <p className="text-lg md:text-xl leading-relaxed text-shadow-md max-w-2xl">
                {body}
              </p>
            </div>

            {/* CTA */}
            <div className="mt-auto">
              <div className="inline-flex items-center space-x-2">
                <span className="text-xl">✅</span>
                <Button 
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold px-8 py-3 text-lg shadow-lg"
                >
                  {cta}
                </Button>
              </div>
            </div>
          </div>

          {/* Performance Metrics Overlay */}
          <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-sm rounded-lg p-3">
            <div className="flex space-x-4 text-xs text-gray-300">
              <div className="text-center">
                <div className="text-green-400 font-semibold">{metrics.ctrLift}%</div>
                <div>CTR Lift</div>
              </div>
              <div className="text-center">
                <div className="text-blue-400 font-semibold">${metrics.cpa}</div>
                <div>CPA</div>
              </div>
              <div className="text-center">
                <div className="text-purple-400 font-semibold">{metrics.roas}x</div>
                <div>ROAS</div>
              </div>
            </div>
          </div>
        </div>

        {/* Template Controls */}
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-white">{title}</h3>
              <div className="flex items-center space-x-2 mt-1">
                <Badge variant="secondary" className="text-xs">
                  {industry}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {tone}
                </Badge>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => setShowPreview(!showPreview)}
                className="text-gray-300 border-gray-600"
              >
                <Eye className="w-4 h-4 mr-1" />
                Preview
              </Button>
            </div>
          </div>

          {/* Primary Deploy Actions */}
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gradient-to-r from-green-900/30 to-blue-900/30 rounded-lg border border-green-500/30">
              <div>
                <div className="text-sm font-medium text-green-400 mb-1">Ready-to-Deploy Asset</div>
                <div className="text-xs text-gray-300">Optimized for {metrics.conversionRate}% conversion rate</div>
              </div>
              <Button 
                onClick={() => setShowPreview(!showPreview)}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <Eye className="w-4 h-4 mr-2" />
                {showPreview ? "Hide Details" : "Show Details"}
              </Button>
            </div>

            {/* Expanded Preview */}
            {showPreview && (
              <div className="p-4 bg-gray-900/50 rounded-lg border border-gray-700">
                <div className="text-sm font-medium text-white mb-3">Full Preview - Ready for Deployment</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Text Content */}
                  <div className="space-y-3">
                    <div>
                      <div className="text-xs text-yellow-400 font-semibold mb-1">HOOK</div>
                      <div className="text-sm text-gray-200">{hook}</div>
                    </div>
                    <div>
                      <div className="text-xs text-blue-400 font-semibold mb-1">BODY COPY</div>
                      <div className="text-sm text-gray-200">{body}</div>
                    </div>
                    <div>
                      <div className="text-xs text-green-400 font-semibold mb-1">CALL TO ACTION</div>
                      <div className="text-sm text-gray-200">{cta}</div>
                    </div>
                  </div>
                  
                  {/* Performance Metrics */}
                  <div className="space-y-2">
                    <div className="text-xs text-purple-400 font-semibold mb-2">PERFORMANCE METRICS</div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="p-2 bg-gray-800 rounded">
                        <div className="text-green-400 font-semibold">{metrics.conversionRate}%</div>
                        <div className="text-gray-400">Conversion Rate</div>
                      </div>
                      <div className="p-2 bg-gray-800 rounded">
                        <div className="text-blue-400 font-semibold">+{metrics.ctrLift}%</div>
                        <div className="text-gray-400">CTR Lift</div>
                      </div>
                      <div className="p-2 bg-gray-800 rounded">
                        <div className="text-purple-400 font-semibold">${metrics.cpa}</div>
                        <div className="text-gray-400">CPA</div>
                      </div>
                      <div className="p-2 bg-gray-800 rounded">
                        <div className="text-yellow-400 font-semibold">{metrics.roas}x</div>
                        <div className="text-gray-400">ROAS</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2">
              <Button 
                onClick={copyTemplate}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Copy className="w-4 h-4 mr-2" />
                Copy Text
              </Button>
              
              <Button 
                onClick={() => exportTemplate('png')}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <Download className="w-4 h-4 mr-2" />
                Deploy as PNG
              </Button>
              
              <Button 
                onClick={() => exportTemplate('pdf')}
                variant="outline"
                className="text-gray-300 border-gray-600"
              >
                <Download className="w-4 h-4 mr-2" />
                Deploy as PDF
              </Button>
              
              <Button 
                onClick={generateNewVariation}
                disabled={isGenerating}
                variant="outline"
                className="text-gray-300 border-gray-600"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isGenerating ? 'animate-spin' : ''}`} />
                Generate Variation
              </Button>
            </div>
          </div>

          {/* Tier-Based Unlock Message */}
          {tier === 'starter' && (
            <div className="mt-4 p-3 bg-gradient-to-r from-purple-900/30 to-blue-900/30 rounded-lg border border-purple-500/30">
              <p className="text-sm text-gray-300">
                <span className="text-purple-400 font-semibold">Pro Unlock:</span> Generate unlimited variations, custom backgrounds, and advanced text styling
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}