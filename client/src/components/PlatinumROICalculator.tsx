import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calculator, TrendingUp, DollarSign } from 'lucide-react';
import { VaultSupremePanel } from './VaultForgeSupreme';

interface ROICalculatorProps {
  industry: string;
  qualificationScore: number;
}

interface ROIData {
  currentRevenue: number;
  clientValue: number;
  conversionBoost: number;
  projectedRevenue: number;
  roiMultiplier: number;
}

export function PlatinumROICalculator({ industry, qualificationScore }: ROICalculatorProps) {
  const [roiData, setRoiData] = useState<ROIData | null>(null);

  useEffect(() => {
    if (qualificationScore >= 75) {
      // Industry-specific base metrics
      const industryMetrics = {
        business: { baseRevenue: 120000, clientValue: 5000, conversionRate: 0.15 },
        finance: { baseRevenue: 180000, clientValue: 8000, conversionRate: 0.12 },
        technology: { baseRevenue: 150000, clientValue: 6500, conversionRate: 0.18 },
        marketing: { baseRevenue: 95000, clientValue: 4200, conversionRate: 0.20 },
        fitness: { baseRevenue: 75000, clientValue: 2500, conversionRate: 0.25 },
        health: { baseRevenue: 85000, clientValue: 3500, conversionRate: 0.22 },
        consulting: { baseRevenue: 140000, clientValue: 7500, conversionRate: 0.14 },
        default: { baseRevenue: 100000, clientValue: 4000, conversionRate: 0.18 }
      };

      const metrics = industryMetrics[industry] || industryMetrics.default;
      
      // Platinum boost calculations
      const conversionBoost = 2.8 + (qualificationScore - 75) * 0.02; // 2.8x-3.3x boost
      const projectedRevenue = metrics.baseRevenue * conversionBoost;
      const roiMultiplier = (projectedRevenue - 5000) / 5000; // ROI on $5K investment

      setRoiData({
        currentRevenue: metrics.baseRevenue,
        clientValue: metrics.clientValue,
        conversionBoost,
        projectedRevenue,
        roiMultiplier
      });
    }
  }, [industry, qualificationScore]);

  if (!roiData || qualificationScore < 75) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-8"
    >
      <VaultSupremePanel glowEffect={true}>
        <div className="text-center mb-6">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Calculator className="w-6 h-6" style={{ color: "var(--vault-gold-signature)" }} />
            <h3 className="text-xl font-medium" style={{ color: "var(--vault-text-primary)" }}>
              Your Platinum ROI Projection
            </h3>
          </div>
          <p className="text-sm" style={{ color: "var(--vault-text-secondary)" }}>
            Based on {industry} industry benchmarks and your qualification score
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Current State */}
          <div className="text-center p-4 rounded-lg" style={{
            background: "linear-gradient(135deg, rgba(107, 114, 128, 0.1), rgba(55, 65, 81, 0.1))",
            border: "1px solid rgba(107, 114, 128, 0.2)"
          }}>
            <div className="text-2xl font-bold mb-2" style={{ color: "#9CA3AF" }}>
              ${roiData.currentRevenue.toLocaleString()}
            </div>
            <div className="text-sm" style={{ color: "var(--vault-text-secondary)" }}>
              Current Annual Revenue
            </div>
          </div>

          {/* Arrow */}
          <div className="flex items-center justify-center">
            <TrendingUp className="w-8 h-8" style={{ color: "var(--vault-gold-signature)" }} />
          </div>

          {/* Projected State */}
          <div className="text-center p-4 rounded-lg" style={{
            background: "linear-gradient(135deg, rgba(249, 200, 14, 0.2), rgba(28, 132, 255, 0.1))",
            border: "1px solid rgba(249, 200, 14, 0.3)"
          }}>
            <div className="text-2xl font-bold mb-2" style={{ color: "var(--vault-gold-signature)" }}>
              ${roiData.projectedRevenue.toLocaleString()}
            </div>
            <div className="text-sm" style={{ color: "var(--vault-text-secondary)" }}>
              Platinum-Optimized Revenue
            </div>
          </div>
        </div>

        {/* ROI Breakdown */}
        <div className="space-y-4">
          <div className="flex justify-between items-center p-3 rounded-lg" style={{
            background: "rgba(28, 132, 255, 0.1)",
            border: "1px solid rgba(28, 132, 255, 0.2)"
          }}>
            <span className="text-sm" style={{ color: "var(--vault-text-secondary)" }}>
              Conversion Boost Factor
            </span>
            <span className="font-bold" style={{ color: "var(--vault-text-primary)" }}>
              {roiData.conversionBoost.toFixed(1)}x
            </span>
          </div>

          <div className="flex justify-between items-center p-3 rounded-lg" style={{
            background: "rgba(249, 200, 14, 0.1)",
            border: "1px solid rgba(249, 200, 14, 0.2)"
          }}>
            <span className="text-sm" style={{ color: "var(--vault-text-secondary)" }}>
              Revenue Increase
            </span>
            <span className="font-bold" style={{ color: "var(--vault-gold-signature)" }}>
              +${(roiData.projectedRevenue - roiData.currentRevenue).toLocaleString()}
            </span>
          </div>

          <div className="flex justify-between items-center p-3 rounded-lg" style={{
            background: "rgba(16, 185, 129, 0.1)",
            border: "1px solid rgba(16, 185, 129, 0.2)"
          }}>
            <span className="text-sm" style={{ color: "var(--vault-text-secondary)" }}>
              ROI on $5,000 Investment
            </span>
            <span className="font-bold text-green-400">
              {roiData.roiMultiplier.toFixed(0)}x (${(roiData.roiMultiplier * 5000).toLocaleString()})
            </span>
          </div>
        </div>

        <div className="mt-6 p-4 rounded-lg text-center" style={{
          background: "linear-gradient(135deg, rgba(249, 200, 14, 0.15), rgba(16, 185, 129, 0.1))",
          border: "1px solid rgba(249, 200, 14, 0.3)"
        }}>
          <DollarSign className="w-6 h-6 mx-auto mb-2" style={{ color: "var(--vault-gold-signature)" }} />
          <div className="text-sm font-medium mb-1" style={{ color: "var(--vault-gold-signature)" }}>
            Conservative 12-Month Projection
          </div>
          <div className="text-xs" style={{ color: "var(--vault-text-secondary)" }}>
            Based on Platinum clients achieving {roiData.conversionBoost.toFixed(1)}x performance improvement
          </div>
        </div>
      </VaultSupremePanel>
    </motion.div>
  );
}