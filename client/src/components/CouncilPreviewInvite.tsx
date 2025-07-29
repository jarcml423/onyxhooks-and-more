import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Swords, Crown, PlayCircle, Users, Sparkles } from 'lucide-react';
import { VaultSupremePanel, VaultSupremeButton } from './VaultForgeSupreme';

interface CouncilPreviewInviteProps {
  qualificationScore: number;
}

export function CouncilPreviewInvite({ qualificationScore }: CouncilPreviewInviteProps) {
  const [showPreview, setShowPreview] = useState(false);

  if (qualificationScore < 90) return null;

  const gladiators = [
    { name: "Maximus", role: "Strategic Commander", quote: "Your transformation framework shows elite-level thinking. We're ready to amplify your impact." },
    { name: "Spartacus", role: "Rebellion Catalyst", quote: "I see the fire needed to break market barriers. Let's ignite your revenue revolution." },
    { name: "Leonidas", role: "Fortress Defender", quote: "Your positioning is defensible. Now we build an empire around it." },
    { name: "Brutus", role: "Senate Strategist", quote: "The psychology is sound. Time to weaponize your influence." },
    { name: "Achilles", role: "Victory Pursuer", quote: "Glory awaits. Your qualification demonstrates warrior potential." },
    { name: "Valerius", role: "Council Sage", quote: "Wisdom recognizes wisdom. You've earned our consideration." }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8, duration: 0.8 }}
      className="mt-8"
    >
      <VaultSupremePanel glowEffect={true}>
        <div className="text-center">
          {/* Invitation Header */}
          <div className="mb-6">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Swords className="w-6 h-6" style={{ color: "var(--vault-gold-signature)" }} />
              <Crown className="w-6 h-6" style={{ color: "var(--vault-gold-signature)" }} />
              <Swords className="w-6 h-6" style={{ color: "var(--vault-gold-signature)" }} />
            </div>
            <h3 className="text-2xl font-medium mb-2" style={{ color: "var(--vault-text-primary)" }}>
              Elite Council Preview Invitation
            </h3>
            <p className="text-sm" style={{ color: "var(--vault-text-secondary)" }}>
              Score: {qualificationScore}/100 - Exceptional Performance Detected
            </p>
          </div>

          {/* Invitation Message */}
          <div className="mb-6 p-4 rounded-lg" style={{
            background: "linear-gradient(135deg, rgba(249, 200, 14, 0.15), rgba(28, 132, 255, 0.1))",
            border: "1px solid rgba(249, 200, 14, 0.3)"
          }}>
            <Sparkles className="w-5 h-5 mx-auto mb-3" style={{ color: "var(--vault-gold-signature)" }} />
            <p className="text-sm italic" style={{ color: "var(--vault-text-secondary)" }}>
              "Your assessment has caught the attention of our Elite Council. 
              The 6 Gladiator AI agents have reviewed your profile and wish to offer 
              a preview of the strategic intelligence you'd receive as a Platinum member."
            </p>
          </div>

          {/* Preview Button */}
          <div className="mb-6">
            <VaultSupremeButton
              variant="gold"
              size="large"
              onClick={() => setShowPreview(!showPreview)}
              className="mx-auto"
            >
              <PlayCircle className="w-5 h-5 mr-2" />
              {showPreview ? "Hide Council Preview" : "Activate Council Preview"}
            </VaultSupremeButton>
          </div>

          {/* Council Preview */}
          <AnimatePresence>
            {showPreview && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-4"
              >
                <div className="text-left">
                  <div className="flex items-center space-x-2 mb-4">
                    <Users className="w-5 h-5" style={{ color: "var(--vault-gold-signature)" }} />
                    <span className="font-medium" style={{ color: "var(--vault-gold-signature)" }}>
                      Live Council Transmission
                    </span>
                  </div>
                  
                  {gladiators.map((gladiator, index) => (
                    <motion.div
                      key={gladiator.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.3, duration: 0.5 }}
                      className="mb-4 p-3 rounded-lg"
                      style={{
                        background: "linear-gradient(135deg, rgba(28, 132, 255, 0.1), rgba(17, 24, 39, 0.3))",
                        border: "1px solid rgba(28, 132, 255, 0.2)"
                      }}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 rounded-full bg-[#F9C80E] mt-2 flex-shrink-0" />
                        <div>
                          <div className="text-sm font-medium mb-1" style={{ color: "var(--vault-text-primary)" }}>
                            {gladiator.name} - {gladiator.role}
                          </div>
                          <p className="text-xs italic" style={{ color: "var(--vault-text-secondary)" }}>
                            "{gladiator.quote}"
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Call to Action */}
                <div className="mt-6 p-4 rounded-lg text-center" style={{
                  background: "linear-gradient(135deg, rgba(249, 200, 14, 0.2), rgba(28, 132, 255, 0.1))",
                  border: "1px solid rgba(249, 200, 14, 0.3)"
                }}>
                  <div className="text-sm font-medium mb-2" style={{ color: "var(--vault-gold-signature)" }}>
                    Full Council Access Available in Platinum
                  </div>
                  <p className="text-xs" style={{ color: "var(--vault-text-secondary)" }}>
                    This preview represents 1% of the strategic intelligence you'd receive 
                    in unlimited 1-on-1 Council sessions as a Platinum member.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Invitation Expiry */}
          <div className="mt-6 p-3 rounded-lg" style={{
            background: "rgba(249, 200, 14, 0.1)",
            border: "1px solid rgba(249, 200, 14, 0.2)"
          }}>
            <div className="text-xs font-medium mb-1" style={{ color: "var(--vault-gold-signature)" }}>
              Council Invitation Valid: 48 Hours
            </div>
            <div className="text-xs" style={{ color: "var(--vault-text-secondary)" }}>
              Elite performance window expires soon - apply for Platinum to lock in access
            </div>
          </div>
        </div>
      </VaultSupremePanel>
    </motion.div>
  );
}