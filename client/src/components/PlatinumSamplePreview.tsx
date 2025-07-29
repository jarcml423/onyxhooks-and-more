import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, FileText, Crown, Eye } from 'lucide-react';
import { VaultSupremePanel, VaultSupremeButton } from './VaultForgeSupreme';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface PlatinumSamplePreviewProps {
  qualificationScore: number;
  industry: string;
}

export function PlatinumSamplePreview({ qualificationScore, industry }: PlatinumSamplePreviewProps) {
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  if (qualificationScore < 75) return null;

  const sampleCampaigns = {
    business: {
      background: "linear-gradient(135deg, rgba(59, 130, 246, 0.8), rgba(147, 51, 234, 0.6))",
      title: "Transform Your Business Into a Revenue Machine",
      subtitle: "90-Day Elite Acceleration Program",
      metrics: "347% Average Revenue Increase",
      cta: "Reserve Your Platinum Strategy Session"
    },
    finance: {
      background: "linear-gradient(135deg, rgba(16, 185, 129, 0.8), rgba(59, 130, 246, 0.6))",
      title: "Build Wealth Through Strategic Intelligence",
      subtitle: "Exclusive Financial Mastery System",
      metrics: "$2.3M Average Client Portfolio Growth",
      cta: "Access Elite Investment Strategies"
    },
    technology: {
      background: "linear-gradient(135deg, rgba(147, 51, 234, 0.8), rgba(236, 72, 153, 0.6))",
      title: "Scale Your Tech Empire",
      subtitle: "Silicon Valley Growth Methodology", 
      metrics: "10x Faster Product-Market Fit",
      cta: "Unlock Platinum Tech Playbook"
    },
    default: {
      background: "linear-gradient(135deg, rgba(249, 200, 14, 0.8), rgba(28, 132, 255, 0.6))",
      title: "Elite Transformation Accelerator",
      subtitle: "Premium Coaching Methodology",
      metrics: "285% Performance Improvement",
      cta: "Begin Elite Transformation"
    }
  };

  const campaign = sampleCampaigns[industry] || sampleCampaigns.default;

  const generatePDF = async () => {
    setIsGeneratingPDF(true);
    
    try {
      const element = document.getElementById('platinum-preview-card');
      if (!element) return;

      const canvas = await html2canvas(element, {
        backgroundColor: null,
        scale: 2,
        useCORS: true
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      });
      
      const imgWidth = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(`platinum-elite-preview-${industry}.pdf`);
    } catch (error) {
      console.error('PDF generation failed:', error);
    }
    
    setIsGeneratingPDF(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.8 }}
      className="mt-8"
    >
      <VaultSupremePanel glowEffect={true}>
        <div className="text-center mb-6">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Crown className="w-6 h-6" style={{ color: "var(--vault-gold-signature)" }} />
            <h3 className="text-xl font-medium" style={{ color: "var(--vault-text-primary)" }}>
              Exclusive Platinum Campaign Preview
            </h3>
          </div>
          <p className="text-sm" style={{ color: "var(--vault-text-secondary)" }}>
            Sample of elite-level campaign assets available to Platinum members
          </p>
        </div>

        {/* Preview Card */}
        <div 
          id="platinum-preview-card"
          className="relative w-full h-64 rounded-lg overflow-hidden mb-6"
          style={{ background: campaign.background }}
        >
          <div className="absolute inset-0 flex flex-col justify-center items-center text-white p-8 text-center">
            {/* Elite Badge */}
            <div className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold bg-black bg-opacity-30 backdrop-blur-sm">
              PLATINUM ELITE
            </div>
            
            {/* Main Content */}
            <div className="space-y-4">
              <h2 className="text-3xl font-bold leading-tight text-shadow-lg">
                {campaign.title}
              </h2>
              <p className="text-lg opacity-90 text-shadow">
                {campaign.subtitle}
              </p>
              
              {/* Metrics */}
              <div className="px-6 py-3 rounded-full bg-white bg-opacity-20 backdrop-blur-sm">
                <div className="text-lg font-bold text-shadow">
                  {campaign.metrics}
                </div>
              </div>
              
              {/* CTA */}
              <div className="mt-6">
                <div className="inline-block px-8 py-3 bg-white bg-opacity-90 text-gray-900 rounded-lg font-bold text-lg shadow-lg">
                  {campaign.cta}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Download Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-center space-x-4">
            <VaultSupremeButton
              variant="gold"
              onClick={generatePDF}
              disabled={isGeneratingPDF}
              className="flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>{isGeneratingPDF ? "Generating..." : "Download PDF Preview"}</span>
            </VaultSupremeButton>
            
            <VaultSupremeButton
              variant="outline"
              className="flex items-center space-x-2"
            >
              <Eye className="w-4 h-4" />
              <span>View Full Gallery</span>
            </VaultSupremeButton>
          </div>

          <div className="text-center p-4 rounded-lg" style={{
            background: "linear-gradient(135deg, rgba(249, 200, 14, 0.1), rgba(28, 132, 255, 0.05))",
            border: "1px solid rgba(249, 200, 14, 0.2)"
          }}>
            <FileText className="w-5 h-5 mx-auto mb-2" style={{ color: "var(--vault-gold-signature)" }} />
            <div className="text-sm font-medium mb-1" style={{ color: "var(--vault-gold-signature)" }}>
              Platinum Members Receive:
            </div>
            <ul className="text-xs space-y-1" style={{ color: "var(--vault-text-secondary)" }}>
              <li>• 50+ industry-specific campaign templates</li>
              <li>• Custom visual branding for your niche</li>
              <li>• Unlimited export formats (PDF, PNG, JPG)</li>
              <li>• A/B testing variations automatically generated</li>
              <li>• Performance optimization recommendations</li>
            </ul>
          </div>
        </div>
      </VaultSupremePanel>
    </motion.div>
  );
}