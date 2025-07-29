import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, CheckCircle, Target, Users, Lightbulb, RefreshCw } from "lucide-react";

interface CorrectionAlertProps {
  originalCopy: {
    hook: string;
    body: string;
    authority: string;
  };
  correctedCopy: {
    hook: string;
    body: string;
    authority: string;
  };
  onApplyCorrection: () => void;
}

export default function CampaignCorrections({ originalCopy, correctedCopy, onApplyCorrection }: CorrectionAlertProps) {
  return (
    <Card className="bg-gradient-to-br from-gray-900/50 to-black/50 border border-red-500/30 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-400" />
            Target Market Misalignment Detected
          </CardTitle>
          <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
            Council Alert
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Analysis Summary */}
        <div className="grid md:grid-cols-3 gap-4">
          <div className="text-center p-3 bg-red-900/20 rounded-lg border border-red-500/20">
            <Target className="w-6 h-6 text-red-400 mx-auto mb-2" />
            <p className="text-sm text-gray-300">Target Clarity</p>
            <p className="text-red-400 font-semibold">❌ Mismatch</p>
          </div>
          <div className="text-center p-3 bg-red-900/20 rounded-lg border border-red-500/20">
            <Users className="w-6 h-6 text-red-400 mx-auto mb-2" />
            <p className="text-sm text-gray-300">Emotional Resonance</p>
            <p className="text-red-400 font-semibold">❌ Zero Connection</p>
          </div>
          <div className="text-center p-3 bg-yellow-900/20 rounded-lg border border-yellow-500/20">
            <Lightbulb className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
            <p className="text-sm text-gray-300">CTA Psychology</p>
            <p className="text-yellow-400 font-semibold">⚠️ Needs Adjustment</p>
          </div>
        </div>

        {/* Before/After Comparison */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Original (Problematic) */}
          <div className="space-y-4">
            <h4 className="text-red-400 font-semibold flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Current Copy (Misaligned)
            </h4>
            
            <div className="space-y-3">
              <div className="p-3 bg-red-900/10 border border-red-500/20 rounded-lg">
                <p className="text-xs text-gray-400 mb-1">HOOK:</p>
                <p className="text-gray-300 text-sm">{originalCopy.hook}</p>
              </div>
              
              <div className="p-3 bg-red-900/10 border border-red-500/20 rounded-lg">
                <p className="text-xs text-gray-400 mb-1">BODY:</p>
                <p className="text-gray-300 text-sm">{originalCopy.body}</p>
              </div>
              
              <div className="p-3 bg-red-900/10 border border-red-500/20 rounded-lg">
                <p className="text-xs text-gray-400 mb-1">AUTHORITY:</p>
                <p className="text-gray-300 text-sm">{originalCopy.authority}</p>
              </div>
            </div>
          </div>

          {/* Corrected */}
          <div className="space-y-4">
            <h4 className="text-green-400 font-semibold flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Corrected Copy (Target-Aligned)
            </h4>
            
            <div className="space-y-3">
              <div className="p-3 bg-green-900/10 border border-green-500/20 rounded-lg">
                <p className="text-xs text-gray-400 mb-1">HOOK:</p>
                <p className="text-gray-300 text-sm">{correctedCopy.hook}</p>
              </div>
              
              <div className="p-3 bg-green-900/10 border border-green-500/20 rounded-lg">
                <p className="text-xs text-gray-400 mb-1">BODY:</p>
                <p className="text-gray-300 text-sm">{correctedCopy.body}</p>
              </div>
              
              <div className="p-3 bg-green-900/10 border border-green-500/20 rounded-lg">
                <p className="text-xs text-gray-400 mb-1">AUTHORITY:</p>
                <p className="text-gray-300 text-sm">{correctedCopy.authority}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Council Commentary */}
        <div className="p-4 bg-purple-900/20 border border-purple-500/30 rounded-lg">
          <h5 className="text-purple-400 font-semibold mb-2">Council Commentary</h5>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-400 mb-1"><strong>Michael:</strong></p>
              <p className="text-gray-300">"We're selling elite outcomes, but to the wrong persona. A 47-year-old mother isn't impressed by SVP titles — she's looking for hope, results, and trust."</p>
            </div>
            <div>
              <p className="text-gray-400 mb-1"><strong>Gary Vee:</strong></p>
              <p className="text-gray-300">"You gotta speak her language. Use terms like bloated, stubborn fat, mirror moments, can't button my jeans."</p>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-center">
          <Button 
            onClick={onApplyCorrection}
            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-3"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Apply Target-Aligned Copy
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}