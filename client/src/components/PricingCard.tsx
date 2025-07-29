import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";

interface PricingPlan {
  name: string;
  price: string;
  period: string;
  description: string;
  features: { name: string; included: boolean }[];
  popular?: boolean;
  buttonText: string;
  buttonVariant?: "default" | "outline";
}

interface PricingCardProps {
  plan: PricingPlan;
  onSelect: (planType: string) => void;
}

export default function PricingCard({ plan, onSelect }: PricingCardProps) {
  return (
    <div className={`pricing-card ${plan.popular ? 'popular' : ''}`}>
      {plan.popular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <span className="bg-primary text-white px-4 py-1 rounded-full text-sm font-medium">
            Most Popular
          </span>
        </div>
      )}
      
      <div className="text-center">
        <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
        <div className="mb-6">
          <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
          <span className="text-gray-600">/{plan.period}</span>
        </div>
        <p className="text-gray-600 mb-8">{plan.description}</p>
        
        <ul className="space-y-3 text-sm text-gray-600 mb-8">
          {plan.features.map((feature, index) => (
            <li key={index} className="flex items-center">
              {feature.included ? (
                <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
              ) : (
                <X className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0" />
              )}
              <span className={feature.included ? "" : "text-gray-400"}>
                {feature.name}
              </span>
            </li>
          ))}
        </ul>
        
        <Button
          onClick={() => onSelect(plan.name.toLowerCase().replace(" + ", "_").replace(" ", "_"))}
          variant={plan.buttonVariant || "default"}
          className="w-full"
        >
          {plan.buttonText}
        </Button>
      </div>
    </div>
  );
}
