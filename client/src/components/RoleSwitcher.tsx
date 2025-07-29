import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Crown, Star, Zap } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

interface RoleSwitcherProps {
  onRoleChange?: (role: string) => void;
}

export function RoleSwitcher({ onRoleChange }: RoleSwitcherProps) {
  const [currentRole, setCurrentRole] = useState<string>("free");
  const [switching, setSwitching] = useState(false);

  useEffect(() => {
    // Get current role on mount
    fetch("/api/test/current-role")
      .then(res => res.json())
      .then(data => setCurrentRole(data.currentRole))
      .catch(console.error);
  }, []);

  const switchRole = async (role: string) => {
    setSwitching(true);
    try {
      const response = await apiRequest("POST", "/api/test/switch-role", { role });
      const data = await response.json();
      setCurrentRole(data.currentRole);
      onRoleChange?.(data.currentRole);
    } catch (error) {
      console.error("Failed to switch role:", error);
    }
    setSwitching(false);
  };

  const roleConfig = {
    free: { 
      icon: Zap, 
      color: "bg-gray-500", 
      label: "Free",
      description: "2 hooks, 2 offers with watermark"
    },
    starter: { 
      icon: Star, 
      color: "bg-green-500", 
      label: "Starter",
      description: "Unlimited hooks & offers, editing enabled"
    },
    pro: { 
      icon: Star, 
      color: "bg-blue-500", 
      label: "Pro",
      description: "Pro tools + advanced monetization"
    },
    vault: { 
      icon: Crown, 
      color: "bg-purple-500", 
      label: "Vault",
      description: "Full suite + Swipe Copy Bank + White Label"
    }
  };

  return (
    <Card className="mb-6">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium">Test as:</span>
            <Badge 
              variant="outline" 
              className={`${roleConfig[currentRole as keyof typeof roleConfig]?.color} text-white border-0`}
            >
              {roleConfig[currentRole as keyof typeof roleConfig]?.icon && (() => {
                const Icon = roleConfig[currentRole as keyof typeof roleConfig].icon;
                return <Icon className="w-3 h-3 mr-1" />;
              })()}
              {roleConfig[currentRole as keyof typeof roleConfig]?.label} User
            </Badge>
            <span className="text-xs text-muted-foreground">
              {roleConfig[currentRole as keyof typeof roleConfig]?.description}
            </span>
          </div>
          
          <div className="flex gap-2">
            {Object.entries(roleConfig).map(([role, config]) => {
              const Icon = config.icon;
              return (
                <Button
                  key={role}
                  variant={currentRole === role ? "default" : "outline"}
                  size="sm"
                  onClick={() => switchRole(role)}
                  disabled={switching || currentRole === role}
                  className={currentRole === role ? config.color : ""}
                >
                  <Icon className="w-4 h-4 mr-1" />
                  {config.label}
                </Button>
              );
            })}
          </div>
        </div>
        
        <div className="mt-3 text-xs text-muted-foreground">
          <strong>Scoring differences:</strong>
          <ul className="mt-1 space-y-1">
            <li>• Free: Forge agent provides basic scoring and feedback</li>
            <li>• Pro: 3-agent council (Sabien, Blaze, Mosaic) + Michael's closing analysis</li>
            <li>• Vault: Full 6-agent council + Alex's optimized rewrites targeting 95-100 scores</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}