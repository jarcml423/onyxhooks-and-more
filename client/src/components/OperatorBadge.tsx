import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Crown, Zap, Copy } from 'lucide-react';
import { VaultSupremePanel } from './VaultForgeSupreme';
import { useToast } from '@/hooks/use-toast';

interface OperatorBadgeProps {
  qualificationScore: number;
  candidateCode: string;
}

export function OperatorBadge({ qualificationScore, candidateCode }: OperatorBadgeProps) {
  const { toast } = useToast();

  if (qualificationScore < 85) return null;

  const copyBadgeCode = () => {
    navigator.clipboard.writeText(candidateCode);
    toast({
      title: "Badge Code Copied",
      description: "Include this code in your Platinum application",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.5, duration: 0.8 }}
      className="mt-8"
    >
      <VaultSupremePanel glowEffect={true}>
        <div className="text-center">
          {/* Badge Visual */}
          <div className="relative mx-auto w-32 h-32 mb-6">
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{
                background: "conic-gradient(from 0deg, #F9C80E, #1C84FF, #F9C80E)",
                padding: "3px"
              }}
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            >
              <div 
                className="w-full h-full rounded-full flex items-center justify-center"
                style={{
                  background: "linear-gradient(135deg, rgba(17, 24, 39, 0.95), rgba(31, 41, 55, 0.95))"
                }}
              >
                <div className="text-center">
                  <Shield className="w-8 h-8 mx-auto mb-2" style={{ color: "var(--vault-gold-signature)" }} />
                  <div className="text-xs font-bold" style={{ color: "var(--vault-text-primary)" }}>
                    OPERATOR
                  </div>
                  <div className="text-xs" style={{ color: "var(--vault-text-secondary)" }}>
                    CANDIDATE
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Badge Title */}
          <div className="mb-4">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Crown className="w-5 h-5" style={{ color: "var(--vault-gold-signature)" }} />
              <h3 className="text-xl font-medium" style={{ color: "var(--vault-text-primary)" }}>
                Operator-Candidate Badge Unlocked
              </h3>
            </div>
            <p className="text-sm" style={{ color: "var(--vault-text-secondary)" }}>
              Score: {qualificationScore}/100 - Elite Qualification Achieved
            </p>
          </div>

          {/* Badge Code */}
          <div className="mb-6">
            <div className="text-sm font-medium mb-2" style={{ color: "var(--vault-gold-signature)" }}>
              Your Candidate Authorization Code
            </div>
            <div 
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-lg cursor-pointer hover:brightness-110 transition-all"
              style={{
                background: "linear-gradient(135deg, rgba(249, 200, 14, 0.2), rgba(28, 132, 255, 0.1))",
                border: "1px solid rgba(249, 200, 14, 0.3)"
              }}
              onClick={copyBadgeCode}
            >
              <span className="font-mono text-lg font-bold" style={{ color: "var(--vault-text-primary)" }}>
                {candidateCode}
              </span>
              <Copy className="w-4 h-4" style={{ color: "var(--vault-gold-signature)" }} />
            </div>
            <p className="text-xs mt-2" style={{ color: "var(--vault-text-secondary)" }}>
              Click to copy - Include this code in your Platinum application
            </p>
          </div>

          {/* Badge Benefits */}
          <div className="space-y-3 text-left">
            <div className="text-sm font-medium" style={{ color: "var(--vault-gold-signature)" }}>
              Operator-Candidate Privileges:
            </div>
            <div className="space-y-2">
              {[
                "Priority review for Platinum applications",
                "Access to exclusive pre-qualification materials", 
                "Direct communication channel with Founder's Circle",
                "Invitation to monthly Elite Strategy sessions"
              ].map((privilege, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <Zap className="w-4 h-4 mt-0.5" style={{ color: "var(--vault-gold-signature)" }} />
                  <span className="text-xs" style={{ color: "var(--vault-text-secondary)" }}>
                    {privilege}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Expiration Notice */}
          <div className="mt-6 p-3 rounded-lg" style={{
            background: "rgba(249, 200, 14, 0.1)",
            border: "1px solid rgba(249, 200, 14, 0.2)"
          }}>
            <div className="text-xs font-medium mb-1" style={{ color: "var(--vault-gold-signature)" }}>
              Badge Valid Until: March 31, 2025
            </div>
            <div className="text-xs" style={{ color: "var(--vault-text-secondary)" }}>
              Use within 90 days for maximum application priority
            </div>
          </div>
        </div>
      </VaultSupremePanel>
    </motion.div>
  );
}