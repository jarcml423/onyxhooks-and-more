import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Navigation from "@/components/Navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Calculator, TrendingUp, DollarSign, Users, Target, BarChart3, ArrowUpDown } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line, PieChart, Pie, Cell } from "recharts";

interface ROISimulation {
  name: string;
  traffic: number;
  conversionRate: number;
  price: number;
  adSpend?: number;
  results?: {
    conversions: number;
    revenue: number;
    netProfit: number;
    roi: number;
    breakEvenTraffic: number;
    profitMargin: number;
  };
}

const COLORS = ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--accent))', 'hsl(var(--success))'];

export default function RoiSimulator() {
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Single simulation state
  const [simulation, setSimulation] = useState<ROISimulation>({
    name: "",
    traffic: 1000,
    conversionRate: 2,
    price: 497,
    adSpend: 0,
  });

  // Comparison simulations
  const [compareSimulations, setCompareSimulations] = useState<ROISimulation[]>([
    {
      name: "Current Offer",
      traffic: 1000,
      conversionRate: 2,
      price: 197,
      adSpend: 300,
    },
    {
      name: "Optimized Offer",
      traffic: 1000,
      conversionRate: 3.5,
      price: 497,
      adSpend: 300,
    }
  ]);

  const [activeTab, setActiveTab] = useState("single");

  // Get saved simulations
  const { data: savedSimulations } = useQuery({
    queryKey: ["/api/roi-simulations"],
    enabled: !!user,
  });

  // Simulate ROI mutation
  const simulateMutation = useMutation({
    mutationFn: async (data: ROISimulation) => {
      const response = await apiRequest("POST", "/api/simulate-roi", data);
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/roi-simulations"] });
      toast({
        title: "Simulation complete!",
        description: "Your ROI analysis has been calculated and saved.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Simulation failed",
        description: error.message || "Failed to run simulation. Please try again.",
        variant: "destructive",
      });
    },
  });

  const calculateResults = (sim: ROISimulation) => {
    const conversions = Math.round(sim.traffic * (sim.conversionRate / 100));
    const revenue = conversions * sim.price;
    const totalAdSpend = sim.adSpend || 0;
    const netProfit = revenue - totalAdSpend;
    const roi = totalAdSpend > 0 ? ((netProfit / totalAdSpend) * 100) : 0;
    const breakEvenTraffic = totalAdSpend > 0 ? Math.ceil(totalAdSpend / (sim.price * (sim.conversionRate / 100))) : 0;
    const profitMargin = revenue > 0 ? ((netProfit / revenue) * 100) : 0;

    return {
      conversions,
      revenue,
      netProfit,
      roi,
      breakEvenTraffic,
      profitMargin
    };
  };

  const handleSimulate = () => {
    if (!simulation.name.trim()) {
      toast({
        title: "Missing name",
        description: "Please enter a name for your simulation.",
        variant: "destructive",
      });
      return;
    }

    const results = calculateResults(simulation);
    const simWithResults = { ...simulation, results };
    
    simulateMutation.mutate(simWithResults);
    setSimulation(prev => ({ ...prev, results }));
  };

  const updateSimulation = (field: keyof ROISimulation, value: string | number) => {
    setSimulation(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const updateCompareSimulation = (index: number, field: keyof ROISimulation, value: string | number) => {
    setCompareSimulations(prev => prev.map((sim, i) => 
      i === index ? { ...sim, [field]: value } : sim
    ));
  };

  // Calculate results for comparison
  const comparisonResults = compareSimulations.map(sim => ({
    ...sim,
    results: calculateResults(sim)
  }));

  const chartData = comparisonResults.map(sim => ({
    name: sim.name,
    revenue: sim.results.revenue,
    profit: sim.results.netProfit,
    conversions: sim.results.conversions,
    roi: sim.results.roi
  }));

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              ROI Simulator
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Model your offer performance with different pricing strategies, traffic volumes, and conversion rates. Compare scenarios and find your optimal strategy.
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto mb-8">
              <TabsTrigger value="single">Single Simulation</TabsTrigger>
              <TabsTrigger value="compare">Compare Offers</TabsTrigger>
            </TabsList>

            <TabsContent value="single">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Input Form */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Calculator className="w-5 h-5 mr-2 text-primary" />
                      Simulation Parameters
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <Label htmlFor="name">Simulation Name</Label>
                      <Input
                        id="name"
                        placeholder="e.g., Premium Coaching Offer"
                        value={simulation.name}
                        onChange={(e) => updateSimulation('name', e.target.value)}
                        className="mt-1"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="traffic">Monthly Traffic</Label>
                        <Input
                          id="traffic"
                          type="number"
                          value={simulation.traffic}
                          onChange={(e) => updateSimulation('traffic', parseInt(e.target.value) || 0)}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="conversionRate">Conversion Rate (%)</Label>
                        <Input
                          id="conversionRate"
                          type="number"
                          step="0.1"
                          value={simulation.conversionRate}
                          onChange={(e) => updateSimulation('conversionRate', parseFloat(e.target.value) || 0)}
                          className="mt-1"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="price">Offer Price ($)</Label>
                        <Input
                          id="price"
                          type="number"
                          value={simulation.price}
                          onChange={(e) => updateSimulation('price', parseInt(e.target.value) || 0)}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="adSpend">Monthly Ad Spend ($)</Label>
                        <Input
                          id="adSpend"
                          type="number"
                          value={simulation.adSpend || 0}
                          onChange={(e) => updateSimulation('adSpend', parseInt(e.target.value) || 0)}
                          className="mt-1"
                        />
                      </div>
                    </div>

                    <Button
                      onClick={handleSimulate}
                      disabled={simulateMutation.isPending}
                      className="w-full"
                    >
                      {simulateMutation.isPending ? (
                        "Calculating..."
                      ) : (
                        <>
                          <BarChart3 className="w-4 h-4 mr-2" />
                          Run Simulation
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>

                {/* Results Display */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <TrendingUp className="w-5 h-5 mr-2 text-primary" />
                      Simulation Results
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {simulation.results ? (
                      <div className="space-y-6">
                        {/* Key Metrics */}
                        <div className="grid grid-cols-2 gap-4">
                          <div className="text-center p-4 bg-blue-50 rounded-lg">
                            <DollarSign className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                            <p className="text-2xl font-bold text-blue-900">
                              ${simulation.results.revenue.toLocaleString()}
                            </p>
                            <p className="text-sm text-blue-600">Monthly Revenue</p>
                          </div>
                          <div className="text-center p-4 bg-green-50 rounded-lg">
                            <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
                            <p className="text-2xl font-bold text-green-900">
                              ${simulation.results.netProfit.toLocaleString()}
                            </p>
                            <p className="text-sm text-green-600">Net Profit</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="text-center p-4 bg-purple-50 rounded-lg">
                            <Users className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                            <p className="text-2xl font-bold text-purple-900">
                              {simulation.results.conversions}
                            </p>
                            <p className="text-sm text-purple-600">Conversions</p>
                          </div>
                          <div className="text-center p-4 bg-orange-50 rounded-lg">
                            <Target className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                            <p className="text-2xl font-bold text-orange-900">
                              {simulation.results.roi.toFixed(1)}%
                            </p>
                            <p className="text-sm text-orange-600">ROI</p>
                          </div>
                        </div>

                        {/* Additional Metrics */}
                        <div className="space-y-3 pt-4 border-t">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Break-even Traffic:</span>
                            <span className="font-semibold">{simulation.results.breakEvenTraffic.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Profit Margin:</span>
                            <span className="font-semibold">{simulation.results.profitMargin.toFixed(1)}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Cost per Conversion:</span>
                            <span className="font-semibold">
                              ${simulation.adSpend && simulation.results.conversions > 0 
                                ? ((simulation.adSpend || 0) / simulation.results.conversions).toFixed(2)
                                : '0.00'}
                            </span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500 mb-2">No simulation run yet</p>
                        <p className="text-sm text-gray-400">
                          Fill in the parameters and click "Run Simulation" to see results
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="compare">
              <div className="space-y-8">
                {/* Comparison Inputs */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {compareSimulations.map((sim, index) => (
                    <Card key={index}>
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <ArrowUpDown className="w-5 h-5 mr-2 text-primary" />
                          {sim.name}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <Input
                          placeholder="Offer name"
                          value={sim.name}
                          onChange={(e) => updateCompareSimulation(index, 'name', e.target.value)}
                        />
                        
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <Label>Traffic</Label>
                            <Input
                              type="number"
                              value={sim.traffic}
                              onChange={(e) => updateCompareSimulation(index, 'traffic', parseInt(e.target.value) || 0)}
                            />
                          </div>
                          <div>
                            <Label>Conv. Rate (%)</Label>
                            <Input
                              type="number"
                              step="0.1"
                              value={sim.conversionRate}
                              onChange={(e) => updateCompareSimulation(index, 'conversionRate', parseFloat(e.target.value) || 0)}
                            />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <Label>Price ($)</Label>
                            <Input
                              type="number"
                              value={sim.price}
                              onChange={(e) => updateCompareSimulation(index, 'price', parseInt(e.target.value) || 0)}
                            />
                          </div>
                          <div>
                            <Label>Ad Spend ($)</Label>
                            <Input
                              type="number"
                              value={sim.adSpend || 0}
                              onChange={(e) => updateCompareSimulation(index, 'adSpend', parseInt(e.target.value) || 0)}
                            />
                          </div>
                        </div>

                        {/* Quick Results */}
                        <div className="grid grid-cols-2 gap-3 pt-3 border-t">
                          <div className="text-center p-3 bg-blue-50 rounded">
                            <p className="text-lg font-bold text-blue-900">
                              ${comparisonResults[index].results.revenue.toLocaleString()}
                            </p>
                            <p className="text-xs text-blue-600">Revenue</p>
                          </div>
                          <div className="text-center p-3 bg-green-50 rounded">
                            <p className="text-lg font-bold text-green-900">
                              ${comparisonResults[index].results.netProfit.toLocaleString()}
                            </p>
                            <p className="text-xs text-green-600">Profit</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Comparison Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Revenue vs Profit Chart */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Revenue vs Profit Comparison</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip 
                            formatter={(value: number) => [`$${value.toLocaleString()}`, '']}
                          />
                          <Bar dataKey="revenue" fill={COLORS[0]} name="Revenue" />
                          <Bar dataKey="profit" fill={COLORS[1]} name="Net Profit" />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  {/* ROI Comparison */}
                  <Card>
                    <CardHeader>
                      <CardTitle>ROI & Conversions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis yAxisId="left" />
                          <YAxis yAxisId="right" orientation="right" />
                          <Tooltip />
                          <Bar yAxisId="left" dataKey="roi" fill={COLORS[2]} name="ROI %" />
                          <Bar yAxisId="right" dataKey="conversions" fill={COLORS[3]} name="Conversions" />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </div>

                {/* Detailed Comparison Table */}
                <Card>
                  <CardHeader>
                    <CardTitle>Detailed Comparison</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left p-3 font-semibold">Metric</th>
                            {comparisonResults.map((sim, index) => (
                              <th key={index} className="text-center p-3 font-semibold">
                                {sim.name}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {[
                            { label: 'Traffic', key: 'traffic', format: (v: number) => v.toLocaleString() },
                            { label: 'Conversion Rate', key: 'conversionRate', format: (v: number) => `${v}%` },
                            { label: 'Price', key: 'price', format: (v: number) => `$${v}` },
                            { label: 'Ad Spend', key: 'adSpend', format: (v: number) => `$${v}` },
                            { label: 'Conversions', key: 'conversions', format: (v: number) => v.toString(), isResult: true },
                            { label: 'Revenue', key: 'revenue', format: (v: number) => `$${v.toLocaleString()}`, isResult: true },
                            { label: 'Net Profit', key: 'netProfit', format: (v: number) => `$${v.toLocaleString()}`, isResult: true },
                            { label: 'ROI', key: 'roi', format: (v: number) => `${v.toFixed(1)}%`, isResult: true },
                          ].map((row) => (
                            <tr key={row.key} className="border-b">
                              <td className="p-3 font-medium">{row.label}</td>
                              {comparisonResults.map((sim, index) => (
                                <td key={index} className="text-center p-3">
                                  {row.format(
                                    row.isResult 
                                      ? (sim.results as any)[row.key]
                                      : (sim as any)[row.key] || 0
                                  )}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>

          {/* Saved Simulations */}
          {savedSimulations && savedSimulations.length > 0 && (
            <Card className="mt-12">
              <CardHeader>
                <CardTitle>Your Saved Simulations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {savedSimulations.map((sim: any) => (
                    <div key={sim.id} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                      <h4 className="font-semibold text-gray-900 mb-2">{sim.name}</h4>
                      <div className="space-y-1 text-sm text-gray-600">
                        <p>Traffic: {sim.traffic.toLocaleString()}</p>
                        <p>Conversion: {sim.conversionRate}%</p>
                        <p>Price: ${sim.price}</p>
                        {sim.results && (
                          <div className="pt-2 border-t">
                            <p className="font-medium text-green-600">
                              Profit: ${sim.results.netProfit?.toLocaleString()}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
