import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Check, Quote } from "lucide-react";

export interface CouncilMember {
  id: string;
  name: string;
  title: string;
  tone: string;
  sampleLine: string;
  avatar: string;
  expertise: string[];
  color: string;
}

const councilMembers: CouncilMember[] = [
  {
    id: "architect",
    name: "The Architect",
    title: "High-Ticket Offer Strategist",
    tone: "ROI-driven, tactical, sharp",
    sampleLine: "Your offer sounds like a warm hug — but no one's buying hugs.",
    avatar: "AR",
    expertise: ["Pricing Strategy", "Value Stacking", "ROI Optimization"],
    color: "from-blue-500 to-cyan-500"
  },
  {
    id: "hunter",
    name: "The Hunter",
    title: "Conversion Coach & Funnel Killer",
    tone: "Bold, high-urgency, pain-driven",
    sampleLine: "You're not screaming loud enough in a crowded market. Hook them by the throat or lose them forever.",
    avatar: "HU",
    expertise: ["Conversion Optimization", "Urgency Creation", "CTA Mastery"],
    color: "from-red-500 to-orange-500"
  },
  {
    id: "empath",
    name: "The Empath",
    title: "Authenticity & Brand Coach",
    tone: "Real, story-driven, emotionally resonant",
    sampleLine: "People don't buy products — they buy stories. Where's the human in this pitch?",
    avatar: "EM",
    expertise: ["Storytelling", "Brand Voice", "Emotional Triggers"],
    color: "from-green-500 to-emerald-500"
  },
  {
    id: "surgeon",
    name: "The Surgeon",
    title: "Behavioral Psychology Consultant",
    tone: "Precise, strategic, psychological",
    sampleLine: "You're not speaking their inner dialogue. Rewire your message to enter the convo already in their head.",
    avatar: "SU",
    expertise: ["Psychology", "Behavioral Triggers", "Decision Science"],
    color: "from-purple-500 to-violet-500"
  },
  {
    id: "visionary",
    name: "The Visionary",
    title: "Legacy Branding Advisor",
    tone: "Timeless, evergreen, long-term leverage",
    sampleLine: "This pitch is short-term candy. Where's the evergreen leverage play?",
    avatar: "VI",
    expertise: ["Brand Legacy", "Long-term Strategy", "Market Positioning"],
    color: "from-yellow-500 to-amber-500"
  }
];

interface CouncilSelectorProps {
  selectedCouncil: string[];
  onCouncilChange: (members: string[]) => void;
  maxSelections?: number;
  onContinue?: () => void;
}

export default function CouncilSelector({ 
  selectedCouncil, 
  onCouncilChange, 
  maxSelections = 3,
  onContinue
}: CouncilSelectorProps) {
  const [hoveredMember, setHoveredMember] = useState<string | null>(null);

  const toggleMember = (memberId: string) => {
    if (selectedCouncil.includes(memberId)) {
      onCouncilChange(selectedCouncil.filter(id => id !== memberId));
    } else if (selectedCouncil.length < maxSelections) {
      onCouncilChange([...selectedCouncil, memberId]);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold gradient-text">Choose Your Council</h2>
        <p className="text-muted-foreground">
          Select up to {maxSelections} expert voices to guide your offer creation
        </p>
        <div className="flex justify-center gap-2">
          <Badge variant="outline">{selectedCouncil.length}/{maxSelections} selected</Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {councilMembers.map((member) => {
          const isSelected = selectedCouncil.includes(member.id);
          const isHovered = hoveredMember === member.id;
          const canSelect = selectedCouncil.length < maxSelections || isSelected;

          return (
            <motion.div
              key={member.id}
              layout
              whileHover={{ scale: canSelect ? 1.02 : 1 }}
              whileTap={{ scale: canSelect ? 0.98 : 1 }}
              className="relative"
            >
              <Card 
                className={`cursor-pointer transition-all duration-300 ${
                  isSelected 
                    ? 'ring-2 ring-primary border-primary bg-primary/5' 
                    : canSelect 
                      ? 'hover:shadow-lg hover:border-primary/50' 
                      : 'opacity-50 cursor-not-allowed'
                }`}
                onMouseEnter={() => setHoveredMember(member.id)}
                onMouseLeave={() => setHoveredMember(null)}
                onClick={() => canSelect && toggleMember(member.id)}
              >
                <CardContent className="p-6 space-y-4">
                  {/* Avatar and Selection Status */}
                  <div className="flex items-center justify-between">
                    <Avatar className={`h-12 w-12 bg-gradient-to-r ${member.color}`}>
                      <AvatarFallback className="text-white font-bold">
                        {member.avatar}
                      </AvatarFallback>
                    </Avatar>
                    
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        className="bg-primary text-primary-foreground rounded-full p-1"
                      >
                        <Check className="h-4 w-4" />
                      </motion.div>
                    )}
                  </div>

                  {/* Member Info */}
                  <div className="space-y-2">
                    <h3 className="font-bold text-lg">{member.name}</h3>
                    <p className="text-sm text-muted-foreground">{member.title}</p>
                    
                    {/* Expertise Tags */}
                    <div className="flex flex-wrap gap-1">
                      {member.expertise.map((skill) => (
                        <Badge 
                          key={skill} 
                          variant="secondary" 
                          className="text-xs"
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Sample Quote */}
                  <AnimatePresence>
                    {isHovered && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="border-t pt-3"
                      >
                        <div className="flex items-start gap-2">
                          <Quote className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                          <p className="text-sm italic text-muted-foreground">
                            "{member.sampleLine}"
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Selection Actions */}
      {selectedCouncil.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-center gap-4"
        >
          <Button 
            variant="outline" 
            onClick={() => onCouncilChange([])}
          >
            Clear Selection
          </Button>
          <Button 
            onClick={onContinue}
            disabled={selectedCouncil.length === 0}
          >
            Continue with Selected Council
          </Button>
        </motion.div>
      )}
    </div>
  );
}

export { councilMembers };