import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, Copy, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TemplatePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  template: {
    title: string;
    hook: string;
    body: string;
    cta: string;
    industry: string;
    backgroundImage: string;
    metrics: {
      conversionRate: string;
      ctrLift: string;
      cpa: string;
      roas: string;
    };
  };
  onExport: (format: 'png' | 'pdf') => void;
  onCopy: () => void;
}

export function TemplatePreviewModal({ 
  isOpen, 
  onClose, 
  template, 
  onExport, 
  onCopy 
}: TemplatePreviewModalProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-6xl mx-4 bg-gray-900 rounded-xl border border-gray-700 overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-700">
            <div>
              <h2 className="text-2xl font-bold text-white">Ready-to-Deploy Asset Preview</h2>
              <p className="text-gray-400 mt-1">{template.title} - {template.industry}</p>
            </div>
            <Button
              onClick={onClose}
              variant="ghost"
              size="sm"
              className="text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            {/* Visual Preview */}
            <div className="relative">
              <div 
                className="h-96 lg:h-[600px] bg-cover bg-center relative"
                style={{ 
                  backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.6)), url(${template.backgroundImage})`,
                }}
              >
                {/* Performance Badge */}
                <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-sm rounded-lg p-3">
                  <div className="flex space-x-4 text-xs text-gray-300">
                    <div className="text-center">
                      <div className="text-green-400 font-semibold">{template.metrics.conversionRate}%</div>
                      <div>CVR</div>
                    </div>
                    <div className="text-center">
                      <div className="text-blue-400 font-semibold">+{template.metrics.ctrLift}%</div>
                      <div>CTR</div>
                    </div>
                    <div className="text-center">
                      <div className="text-purple-400 font-semibold">{template.metrics.roas}x</div>
                      <div>ROAS</div>
                    </div>
                  </div>
                </div>

                {/* Embedded Text Overlay */}
                <div className="absolute inset-0 p-8 flex flex-col justify-center text-white">
                  {/* Hook */}
                  <div className="mb-6">
                    <div className="inline-flex items-center space-x-2 mb-3">
                      <span className="text-2xl">🌟</span>
                      <div className="px-3 py-1 bg-yellow-400/20 border border-yellow-400/30 rounded-full text-yellow-400 text-sm font-semibold">
                        HIGH-CONVERTING
                      </div>
                    </div>
                    <h1 className="text-4xl lg:text-5xl font-bold leading-tight mb-4" style={{ textShadow: '2px 2px 8px rgba(0,0,0,0.8)' }}>
                      {template.hook}
                    </h1>
                  </div>

                  {/* Body Copy */}
                  <div className="mb-8">
                    <p className="text-xl lg:text-2xl leading-relaxed max-w-2xl" style={{ textShadow: '1px 1px 4px rgba(0,0,0,0.8)' }}>
                      {template.body}
                    </p>
                  </div>

                  {/* CTA */}
                  <div>
                    <div className="inline-block px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold text-xl rounded-lg shadow-2xl cursor-pointer transform hover:scale-105 transition-all">
                      {template.cta}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Details & Actions */}
            <div className="p-6 space-y-6">
              {/* Template Details */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Asset Components</h3>
                  <div className="space-y-3">
                    <div>
                      <div className="text-sm font-medium text-yellow-400 mb-1">HOOK</div>
                      <div className="text-gray-300 p-3 bg-gray-800 rounded-lg text-sm">
                        {template.hook}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-blue-400 mb-1">BODY COPY</div>
                      <div className="text-gray-300 p-3 bg-gray-800 rounded-lg text-sm">
                        {template.body}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-green-400 mb-1">CALL TO ACTION</div>
                      <div className="text-gray-300 p-3 bg-gray-800 rounded-lg text-sm">
                        {template.cta}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Performance Metrics */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Performance Data</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-green-900/30 rounded-lg border border-green-500/30">
                      <div className="text-green-400 font-bold text-lg">{template.metrics.conversionRate}%</div>
                      <div className="text-gray-400 text-sm">Conversion Rate</div>
                    </div>
                    <div className="p-3 bg-blue-900/30 rounded-lg border border-blue-500/30">
                      <div className="text-blue-400 font-bold text-lg">+{template.metrics.ctrLift}%</div>
                      <div className="text-gray-400 text-sm">CTR Improvement</div>
                    </div>
                    <div className="p-3 bg-purple-900/30 rounded-lg border border-purple-500/30">
                      <div className="text-purple-400 font-bold text-lg">${template.metrics.cpa}</div>
                      <div className="text-gray-400 text-sm">Cost Per Acquisition</div>
                    </div>
                    <div className="p-3 bg-yellow-900/30 rounded-lg border border-yellow-500/30">
                      <div className="text-yellow-400 font-bold text-lg">{template.metrics.roas}x</div>
                      <div className="text-gray-400 text-sm">Return on Ad Spend</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-4">
                <div className="text-lg font-semibold text-white">Deploy Asset</div>
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    onClick={() => onExport('png')}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export PNG
                  </Button>
                  <Button
                    onClick={() => onExport('pdf')}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export PDF
                  </Button>
                  <Button
                    onClick={onCopy}
                    variant="outline"
                    className="text-gray-300 border-gray-600"
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copy Text
                  </Button>
                  <Button
                    variant="outline"
                    className="text-gray-300 border-gray-600"
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    Share Link
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}