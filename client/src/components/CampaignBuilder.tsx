import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { generateUTMLink, generateCampaignTemplates } from "@/hooks/useTrackUTM";
import { Copy, ExternalLink, Zap, Target, Mail, Users, Play, Eye } from "lucide-react";

interface CampaignParams {
  source: string;
  medium: string;
  campaign: string;
  term?: string;
  content?: string;
}

export default function CampaignBuilder() {
  const { toast } = useToast();
  const [campaignParams, setCampaignParams] = useState<CampaignParams>({
    source: '',
    medium: '',
    campaign: '',
    term: '',
    content: ''
  });
  const [generatedLink, setGeneratedLink] = useState('');

  const templates = generateCampaignTemplates();

  const generateLink = () => {
    if (!campaignParams.source || !campaignParams.medium || !campaignParams.campaign) {
      toast({
        title: "Missing Parameters",
        description: "Source, Medium, and Campaign are required fields",
        variant: "destructive"
      });
      return;
    }

    const baseUrl = window.location.origin;
    const link = generateUTMLink(baseUrl, campaignParams);
    setGeneratedLink(link);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to Clipboard",
      description: "UTM link copied successfully"
    });
  };

  const useTemplate = (templateLink: string) => {
    const url = new URL(templateLink);
    setCampaignParams({
      source: url.searchParams.get('utm_source') || '',
      medium: url.searchParams.get('utm_medium') || '',
      campaign: url.searchParams.get('utm_campaign') || '',
      term: url.searchParams.get('utm_term') || '',
      content: url.searchParams.get('utm_content') || ''
    });
    setGeneratedLink(templateLink);
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 border-purple-500/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Target className="h-5 w-5 text-purple-400" />
            VaultForge Campaign Builder
          </CardTitle>
          <CardDescription>
            Create tracking links to measure campaign performance and attribution
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="builder" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-slate-800/50">
              <TabsTrigger value="builder" className="data-[state=active]:bg-purple-600">Custom Builder</TabsTrigger>
              <TabsTrigger value="templates" className="data-[state=active]:bg-purple-600">Quick Templates</TabsTrigger>
            </TabsList>

            <TabsContent value="builder" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="source" className="text-white">Source *</Label>
                    <Input
                      id="source"
                      placeholder="facebook, linkedin, email..."
                      value={campaignParams.source}
                      onChange={(e) => setCampaignParams({...campaignParams, source: e.target.value})}
                      className="bg-slate-800/50 border-slate-600 text-white"
                    />
                  </div>

                  <div>
                    <Label htmlFor="medium" className="text-white">Medium *</Label>
                    <Select value={campaignParams.medium} onValueChange={(value) => setCampaignParams({...campaignParams, medium: value})}>
                      <SelectTrigger className="bg-slate-800/50 border-slate-600 text-white">
                        <SelectValue placeholder="Select medium" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cpc">CPC (Paid Ads)</SelectItem>
                        <SelectItem value="social">Social Media</SelectItem>
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="affiliate">Affiliate</SelectItem>
                        <SelectItem value="referral">Referral</SelectItem>
                        <SelectItem value="organic">Organic</SelectItem>
                        <SelectItem value="display">Display</SelectItem>
                        <SelectItem value="video">Video</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="campaign" className="text-white">Campaign *</Label>
                    <Input
                      id="campaign"
                      placeholder="vault_launch, summer_promo..."
                      value={campaignParams.campaign}
                      onChange={(e) => setCampaignParams({...campaignParams, campaign: e.target.value})}
                      className="bg-slate-800/50 border-slate-600 text-white"
                    />
                  </div>

                  <div>
                    <Label htmlFor="term" className="text-white">Term (Optional)</Label>
                    <Input
                      id="term"
                      placeholder="high_ticket, coaching..."
                      value={campaignParams.term}
                      onChange={(e) => setCampaignParams({...campaignParams, term: e.target.value})}
                      className="bg-slate-800/50 border-slate-600 text-white"
                    />
                  </div>

                  <div>
                    <Label htmlFor="content" className="text-white">Content (Optional)</Label>
                    <Input
                      id="content"
                      placeholder="header_banner, sidebar_ad..."
                      value={campaignParams.content}
                      onChange={(e) => setCampaignParams({...campaignParams, content: e.target.value})}
                      className="bg-slate-800/50 border-slate-600 text-white"
                    />
                  </div>

                  <Button 
                    onClick={generateLink} 
                    className="w-full bg-purple-600 hover:bg-purple-700"
                  >
                    <Zap className="h-4 w-4 mr-2" />
                    Generate UTM Link
                  </Button>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label className="text-white">Generated Link</Label>
                    <div className="flex gap-2">
                      <Input
                        value={generatedLink}
                        readOnly
                        className="bg-slate-800/30 border-slate-600 text-green-400 font-mono text-xs"
                        placeholder="Your UTM link will appear here..."
                      />
                      {generatedLink && (
                        <>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => copyToClipboard(generatedLink)}
                            className="border-purple-500/50 text-purple-300"
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => window.open(generatedLink, '_blank')}
                            className="border-purple-500/50 text-purple-300"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>

                  {generatedLink && (
                    <Card className="bg-slate-800/30 border-slate-600/30">
                      <CardContent className="p-4">
                        <h4 className="font-medium text-white mb-2">UTM Parameters</h4>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span className="text-slate-400">Source:</span>
                            <span className="text-white">{campaignParams.source}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Medium:</span>
                            <span className="text-white">{campaignParams.medium}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Campaign:</span>
                            <span className="text-white">{campaignParams.campaign}</span>
                          </div>
                          {campaignParams.term && (
                            <div className="flex justify-between">
                              <span className="text-slate-400">Term:</span>
                              <span className="text-white">{campaignParams.term}</span>
                            </div>
                          )}
                          {campaignParams.content && (
                            <div className="flex justify-between">
                              <span className="text-slate-400">Content:</span>
                              <span className="text-white">{campaignParams.content}</span>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="templates" className="mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Facebook Templates */}
                <Card className="bg-slate-800/30 border-slate-600/30">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-white">
                      <Users className="h-4 w-4 text-blue-400" />
                      Facebook Campaigns
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {Object.entries(templates.facebook).map(([type, link]) => (
                      <div key={type} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                        <div>
                          <h4 className="font-medium text-white capitalize">{type.replace('_', ' ')}</h4>
                          <p className="text-xs text-slate-400">
                            {type === 'awareness' && 'Build brand awareness with organic reach'}
                            {type === 'conversion' && 'Drive direct conversions with paid ads'}
                            {type === 'retargeting' && 'Re-engage warm audiences'}
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => useTemplate(link)}
                          className="border-blue-500/50 text-blue-300"
                        >
                          <Play className="h-3 w-3 mr-1" />
                          Use
                        </Button>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* LinkedIn Templates */}
                <Card className="bg-slate-800/30 border-slate-600/30">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-white">
                      <Target className="h-4 w-4 text-blue-600" />
                      LinkedIn Campaigns
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {Object.entries(templates.linkedin).map(([type, link]) => (
                      <div key={type} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                        <div>
                          <h4 className="font-medium text-white capitalize">{type.replace('_', ' ')}</h4>
                          <p className="text-xs text-slate-400">
                            {type === 'organic' && 'Thought leadership and native content'}
                            {type === 'sponsored' && 'Sponsored content for professionals'}
                            {type === 'message' && 'Direct outreach campaigns'}
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => useTemplate(link)}
                          className="border-blue-500/50 text-blue-300"
                        >
                          <Play className="h-3 w-3 mr-1" />
                          Use
                        </Button>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Email Templates */}
                <Card className="bg-slate-800/30 border-slate-600/30">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-white">
                      <Mail className="h-4 w-4 text-green-400" />
                      Email Campaigns
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {Object.entries(templates.email).map(([type, link]) => (
                      <div key={type} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                        <div>
                          <h4 className="font-medium text-white capitalize">{type.replace('_', ' ')}</h4>
                          <p className="text-xs text-slate-400">
                            {type === 'newsletter' && 'Weekly newsletter campaigns'}
                            {type === 'nurture' && 'Automated nurture sequences'}
                            {type === 'launch' && 'Product launch announcements'}
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => useTemplate(link)}
                          className="border-green-500/50 text-green-300"
                        >
                          <Play className="h-3 w-3 mr-1" />
                          Use
                        </Button>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* YouTube Templates */}
                <Card className="bg-slate-800/30 border-slate-600/30">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-white">
                      <Eye className="h-4 w-4 text-red-400" />
                      YouTube Campaigns
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {Object.entries(templates.youtube).map(([type, link]) => (
                      <div key={type} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                        <div>
                          <h4 className="font-medium text-white capitalize">{type.replace('_', ' ')}</h4>
                          <p className="text-xs text-slate-400">
                            {type === 'organic' && 'Organic video content links'}
                            {type === 'ads' && 'Pre-roll and video ad campaigns'}
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => useTemplate(link)}
                          className="border-red-500/50 text-red-300"
                        >
                          <Play className="h-3 w-3 mr-1" />
                          Use
                        </Button>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Card className="bg-slate-900/50 border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-white">Campaign Best Practices</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Badge variant="outline" className="text-purple-300 border-purple-500/50">
                Naming Convention
              </Badge>
              <p className="text-sm text-slate-300">
                Use consistent, descriptive names: <code className="text-green-400">vault_launch_q3</code>
              </p>
            </div>
            <div className="space-y-2">
              <Badge variant="outline" className="text-blue-300 border-blue-500/50">
                Medium Selection
              </Badge>
              <p className="text-sm text-slate-300">
                Choose specific mediums: <code className="text-green-400">cpc</code> for paid, <code className="text-green-400">social</code> for organic
              </p>
            </div>
            <div className="space-y-2">
              <Badge variant="outline" className="text-green-300 border-green-500/50">
                Content Tracking
              </Badge>
              <p className="text-sm text-slate-300">
                Track variants: <code className="text-green-400">button_a</code>, <code className="text-green-400">header_banner</code>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}