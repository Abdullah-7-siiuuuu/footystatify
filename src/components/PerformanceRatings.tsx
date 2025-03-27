
import React from "react";
import { Player } from "@/components/PlayerCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { statsUtils } from "@/utils/statsUtils";
import { Brain, TrendingUp, BarChart3 } from "lucide-react";

interface PerformanceRatingsProps {
  player: Player;
}

export const PerformanceRatings = ({ player }: PerformanceRatingsProps) => {
  const mlRatings = statsUtils.calculateMLRatings(player);
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-6">
        <Card className="flex-1">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Overall Rating</CardTitle>
              <Brain className="h-5 w-5 text-primary" />
            </div>
            <CardDescription>AI-generated performance score</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-5xl font-bold">{mlRatings.overall.toFixed(1)}</span>
              <div className="text-right">
                <span className="text-muted-foreground text-sm">out of 10.0</span>
                <div className="flex items-center gap-1 text-sm">
                  <TrendingUp className={`h-4 w-4 ${mlRatings.trend > 0 ? 'text-green-500' : mlRatings.trend < 0 ? 'text-red-500' : 'text-yellow-500'}`} />
                  <span className={mlRatings.trend > 0 ? 'text-green-500' : mlRatings.trend < 0 ? 'text-red-500' : 'text-yellow-500'}>
                    {mlRatings.trend > 0 ? '+' : ''}{mlRatings.trend.toFixed(1)}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="flex-1">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Performance Prediction</CardTitle>
              <BarChart3 className="h-5 w-5 text-primary" />
            </div>
            <CardDescription>Next match performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium">Goal probability</span>
                  <span className="text-sm">{mlRatings.predictions.goalProbability}%</span>
                </div>
                <Progress value={mlRatings.predictions.goalProbability} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium">Assist probability</span>
                  <span className="text-sm">{mlRatings.predictions.assistProbability}%</span>
                </div>
                <Progress value={mlRatings.predictions.assistProbability} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Object.entries(mlRatings.categories).map(([category, value]) => (
          <div key={category} className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium capitalize">{category.replace(/([A-Z])/g, ' $1').trim()}</span>
              <span className="text-sm font-bold">{value.toFixed(1)}</span>
            </div>
            <Progress value={value * 10} className="h-2" />
          </div>
        ))}
      </div>
    </div>
  );
};
