import { motion } from "framer-motion";
import { Crown, TrendingUp, Users, Target, Award, Sparkles, BarChart3, Globe, Shield } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import EliteVaultExperience, { LuxuryCard, ConsultingSection, MetricDisplay } from "./EliteVaultExperience";

interface EliteVaultDashboardProps {
  userData: {
    name: string;
    email: string;
    tier: string;
    usage: {
      hooks: number;
      offers: number;
      council: number;
    };
  };
  onStartWorkflow: () => void;
}

export default function EliteVaultDashboard({ userData, onStartWorkflow }: EliteVaultDashboardProps) {
  return (
    <EliteVaultExperience industry="consulting" showLuxuryElements={true}>
      <div className="max-w-7xl mx-auto px-8 py-12">
        
        {/* Elite Welcome Section */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <ConsultingSection
            title="VaultForge Elite"
            subtitle="Enterprise-Level Marketing Intelligence Platform"
            icon={Crown}
            gradient="from-amber-400/10 via-yellow-400/5 to-amber-400/10"
          >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Welcome Card */}
              <LuxuryCard delay={0.2} className="lg:col-span-2">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-full flex items-center justify-center">
                    <Crown className="w-8 h-8 text-black" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-light text-white tracking-wide">Welcome back, {userData.name}</h2>
                    <p className="text-white/60 text-lg">Elite Campaign Strategist</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <MetricDisplay 
                    value="Enterprise" 
                    label="Access Level" 
                    color="amber"
                  />
                  <MetricDisplay 
                    value="∞" 
                    label="Campaign Limit" 
                    color="emerald"
                  />
                  <MetricDisplay 
                    value="24/7" 
                    label="Elite Support" 
                    color="blue"
                  />
                </div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    onClick={onStartWorkflow}
                    className="w-full bg-gradient-to-r from-amber-400 to-yellow-500 text-black font-medium py-6 text-lg rounded-xl hover:from-amber-300 hover:to-yellow-400 transition-all duration-300 shadow-2xl"
                  >
                    <Sparkles className="w-6 h-6 mr-3" />
                    Launch Elite Campaign Generator
                  </Button>
                </motion.div>
              </LuxuryCard>

              {/* Status Card */}
              <LuxuryCard delay={0.4}>
                <h3 className="text-xl font-light text-white mb-6 tracking-wide flex items-center">
                  <Shield className="w-5 h-5 mr-2 text-amber-400" />
                  Elite Status
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <span className="text-white/70 text-sm">Campaign Access</span>
                    <span className="text-emerald-400 text-sm font-medium">Unlimited</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <span className="text-white/70 text-sm">AI Council</span>
                    <span className="text-amber-400 text-sm font-medium">Full Council</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <span className="text-white/70 text-sm">White Label</span>
                    <span className="text-blue-400 text-sm font-medium">Enabled</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <span className="text-white/70 text-sm">Priority Support</span>
                    <span className="text-purple-400 text-sm font-medium">24/7 Elite</span>
                  </div>
                </div>
              </LuxuryCard>
            </div>
          </ConsultingSection>
        </motion.div>

        {/* Performance Analytics */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <ConsultingSection
            title="Performance Intelligence"
            subtitle="Advanced analytics and campaign insights"
            icon={BarChart3}
          >
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <MetricDisplay 
                value="94.2%" 
                label="Conversion Rate" 
                trend="up" 
                color="emerald"
              />
              <MetricDisplay 
                value="$2.3M" 
                label="Revenue Generated" 
                trend="up" 
                color="amber"
              />
              <MetricDisplay 
                value="15.7x" 
                label="ROI Multiple" 
                trend="up" 
                color="blue"
              />
              <MetricDisplay 
                value="98.1%" 
                label="Client Retention" 
                trend="up" 
                color="purple"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <LuxuryCard delay={0.3}>
                <h3 className="text-lg font-light text-white mb-4 tracking-wide">Recent Campaign Performance</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <div>
                      <div className="text-white/80 text-sm">Executive Coaching Campaign</div>
                      <div className="text-white/50 text-xs">Launched 3 days ago</div>
                    </div>
                    <div className="text-emerald-400 text-sm font-medium">96.3% CVR</div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <div>
                      <div className="text-white/80 text-sm">Fitness Transformation Offer</div>
                      <div className="text-white/50 text-xs">Launched 1 week ago</div>
                    </div>
                    <div className="text-amber-400 text-sm font-medium">91.7% CVR</div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <div>
                      <div className="text-white/80 text-sm">Business Strategy Mastermind</div>
                      <div className="text-white/50 text-xs">Launched 2 weeks ago</div>
                    </div>
                    <div className="text-blue-400 text-sm font-medium">89.2% CVR</div>
                  </div>
                </div>
              </LuxuryCard>

              <LuxuryCard delay={0.5}>
                <h3 className="text-lg font-light text-white mb-4 tracking-wide">Market Intelligence</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white/70 text-sm">Industry Penetration</span>
                      <span className="text-amber-400 text-sm">73%</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2">
                      <div className="bg-gradient-to-r from-amber-400 to-yellow-500 h-2 rounded-full" style={{width: '73%'}}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white/70 text-sm">Competitive Advantage</span>
                      <span className="text-emerald-400 text-sm">89%</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2">
                      <div className="bg-gradient-to-r from-emerald-400 to-teal-500 h-2 rounded-full" style={{width: '89%'}}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white/70 text-sm">Market Share Growth</span>
                      <span className="text-blue-400 text-sm">+127%</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2">
                      <div className="bg-gradient-to-r from-blue-400 to-indigo-500 h-2 rounded-full" style={{width: '85%'}}></div>
                    </div>
                  </div>
                </div>
              </LuxuryCard>
            </div>
          </ConsultingSection>
        </motion.div>

        {/* Elite Features */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <ConsultingSection
            title="Elite Capabilities"
            subtitle="Enterprise-grade features and advanced AI council"
            icon={Award}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              
              <LuxuryCard delay={0.2}>
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Target className="w-6 h-6 text-black" />
                  </div>
                  <h3 className="text-lg font-light text-white mb-2">Strategic AI Council</h3>
                  <p className="text-white/60 text-sm leading-relaxed">
                    Access to all 6 AI council members with specialized expertise in psychology, conversion optimization, and market intelligence.
                  </p>
                </div>
              </LuxuryCard>

              <LuxuryCard delay={0.4}>
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Globe className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-light text-white mb-2">White Label Platform</h3>
                  <p className="text-white/60 text-sm leading-relaxed">
                    Complete white-label capabilities for agencies and consultants to brand the platform as their own proprietary solution.
                  </p>
                </div>
              </LuxuryCard>

              <LuxuryCard delay={0.6}>
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-light text-white mb-2">Elite Support</h3>
                  <p className="text-white/60 text-sm leading-relaxed">
                    24/7 priority support with dedicated account management and strategic consultation sessions.
                  </p>
                </div>
              </LuxuryCard>
            </div>
          </ConsultingSection>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <ConsultingSection
            title="Quick Actions"
            subtitle="Streamlined access to elite tools and resources"
            icon={Sparkles}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={onStartWorkflow}
                  className="w-full h-24 bg-gradient-to-br from-amber-400/20 to-yellow-500/20 border border-amber-400/30 text-white hover:from-amber-400/30 hover:to-yellow-500/30 backdrop-blur-sm rounded-xl"
                >
                  <div className="text-center">
                    <Sparkles className="w-6 h-6 mx-auto mb-2 text-amber-400" />
                    <div className="text-sm font-light">Elite Campaign</div>
                  </div>
                </Button>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="outline"
                  className="w-full h-24 border-white/20 text-white hover:bg-white/10 backdrop-blur-sm rounded-xl"
                >
                  <div className="text-center">
                    <BarChart3 className="w-6 h-6 mx-auto mb-2 text-emerald-400" />
                    <div className="text-sm font-light">Analytics</div>
                  </div>
                </Button>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="outline"
                  className="w-full h-24 border-white/20 text-white hover:bg-white/10 backdrop-blur-sm rounded-xl"
                >
                  <div className="text-center">
                    <Globe className="w-6 h-6 mx-auto mb-2 text-blue-400" />
                    <div className="text-sm font-light">White Label</div>
                  </div>
                </Button>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="outline"
                  className="w-full h-24 border-white/20 text-white hover:bg-white/10 backdrop-blur-sm rounded-xl"
                >
                  <div className="text-center">
                    <Users className="w-6 h-6 mx-auto mb-2 text-purple-400" />
                    <div className="text-sm font-light">Elite Support</div>
                  </div>
                </Button>
              </motion.div>
            </div>
          </ConsultingSection>
        </motion.div>
      </div>
    </EliteVaultExperience>
  );
}