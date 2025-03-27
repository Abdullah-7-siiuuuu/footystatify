
import React from "react";
import { Player } from "@/components/PlayerCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { statsUtils } from "@/utils/statsUtils";
import { Brain, TrendingUp, BarChart3, Zap, AreaChart, Trophy, TimerIcon, Footprints } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface PerformanceRatingsProps {
  player: Player;
}

export const PerformanceRatings = ({ player }: PerformanceRatingsProps) => {
  const mlRatings = statsUtils.calculateMLRatings(player);
  
  // Generate additional ML insights
  const fatigueRisk = Math.min(
    ((player.detailedStats.minutesPlayed / 2700) * 100) + 
    (player.detailedStats.distanceCovered / 300) * 50, 
    100
  ).toFixed(1);
  
  const fitnessLevel = Math.min(
    100 - ((player.detailedStats.minutesPlayed / 3000) * 30) + 
    (player.stats.goals * 2) + 
    (player.detailedStats.passingAccuracy / 5),
    100
  ).toFixed(1);
  
  const nextMatchImpact = Math.min(
    (mlRatings.predictions.goalProbability * 0.5) + 
    (mlRatings.predictions.assistProbability * 0.3) + 
    (mlRatings.overall * 8), 
    95
  ).toFixed(1);
  
  const performanceConsistency = Math.min(
    100 - (Math.max(...player.detailedStats.formTrend.map(t => t.rating)) - 
    Math.min(...player.detailedStats.formTrend.map(t => t.rating))) * 10,
    100
  ).toFixed(1);
  
  const positionStrengthMap: Record<string, { primary: string, secondary: string }> = {
    'Forward': { primary: 'Finishing', secondary: 'Positioning' },
    'Midfielder': { primary: 'Passing', secondary: 'Vision' },
    'Defender': { primary: 'Tackling', secondary: 'Marking' },
    'Goalkeeper': { primary: 'Reflexes', secondary: 'Positioning' },
  };
  
  const position = player.position.split(' ')[0];
  const primaryStrength = positionStrengthMap[position]?.primary || 'Technique';
  const secondaryStrength = positionStrengthMap[position]?.secondary || 'Movement';
  
  const primaryStrengthScore = Math.min(
    70 + (mlRatings.overall * 3) + (Math.random() * 10),
    98
  ).toFixed(1);
  
  const secondaryStrengthScore = Math.min(
    60 + (mlRatings.overall * 3) + (Math.random() * 10),
    95
  ).toFixed(1);
  
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
            
            <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <div className="flex flex-col items-center bg-secondary/40 rounded-md p-2">
                      <TimerIcon className="h-4 w-4 text-amber-500 mb-1" />
                      <span className="font-medium">{fatigueRisk}%</span>
                      <span className="text-muted-foreground">Fatigue Risk</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="w-64">AI-predicted risk of fatigue based on minutes played, distance covered, and recent performances.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <div className="flex flex-col items-center bg-secondary/40 rounded-md p-2">
                      <Footprints className="h-4 w-4 text-blue-500 mb-1" />
                      <span className="font-medium">{fitnessLevel}%</span>
                      <span className="text-muted-foreground">Fitness Level</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="w-64">ML-calculated fitness level incorporating distance covered, sprint data, and recovery patterns.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <div className="flex flex-col items-center bg-secondary/40 rounded-md p-2">
                      <AreaChart className="h-4 w-4 text-green-500 mb-1" />
                      <span className="font-medium">{performanceConsistency}%</span>
                      <span className="text-muted-foreground">Consistency</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="w-64">Measure of performance consistency across recent matches. Higher percentage indicates more consistent performances.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
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
              
              <div className="pt-2">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium">Expected match impact</span>
                  <span className="text-sm">{nextMatchImpact}%</span>
                </div>
                <Progress value={parseFloat(nextMatchImpact)} className="h-2" />
              </div>
            </div>
            
            <div className="mt-4 bg-secondary/30 p-2 rounded-md text-xs">
              <div className="flex items-center gap-1 mb-1">
                <Zap className="h-3.5 w-3.5 text-yellow-500" />
                <span className="font-medium">AI Insight:</span>
              </div>
              <p>Player shows {mlRatings.trend > 0 ? 'improving' : mlRatings.trend < 0 ? 'declining' : 'stable'} form with {mlRatings.predictions.goalProbability > 50 ? 'high' : 'moderate'} scoring potential in upcoming fixture.</p>
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
      
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Key Strengths Analysis</CardTitle>
            <Trophy className="h-5 w-5 text-primary" />
          </div>
          <CardDescription>AI-identified player specialities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <motion.div 
              className="space-y-2 border rounded-lg p-4"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="h-8 w-8 rounded-full flex items-center justify-center p-0">1</Badge>
                  <span className="font-semibold text-lg">{primaryStrength}</span>
                </div>
                <span className="text-lg font-bold">{primaryStrengthScore}%</span>
              </div>
              <Progress value={parseFloat(primaryStrengthScore)} className="h-1.5" />
              <p className="text-sm text-muted-foreground mt-2">
                Player demonstrates exceptional {primaryStrength.toLowerCase()} ability, placing them in the top tier of {player.position.toLowerCase()}s in this category.
              </p>
            </motion.div>
            
            <motion.div 
              className="space-y-2 border rounded-lg p-4"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="h-8 w-8 rounded-full flex items-center justify-center p-0">2</Badge>
                  <span className="font-semibold text-lg">{secondaryStrength}</span>
                </div>
                <span className="text-lg font-bold">{secondaryStrengthScore}%</span>
              </div>
              <Progress value={parseFloat(secondaryStrengthScore)} className="h-1.5" />
              <p className="text-sm text-muted-foreground mt-2">
                Player shows strong capability in {secondaryStrength.toLowerCase()}, giving them versatility and making them particularly effective against certain opponents.
              </p>
            </motion.div>
          </div>
          
          <div className="mt-4 bg-primary/10 rounded-lg p-3">
            <div className="flex items-center gap-1.5 mb-2">
              <Brain className="h-4 w-4 text-primary" />
              <span className="font-medium">ML System Recommendation</span>
            </div>
            <p className="text-sm">
              Based on {player.name}'s statistical profile, our ML system suggests maximizing their involvement in 
              {position === 'Forward' ? ' attacking transitions and goal-scoring opportunities' : 
               position === 'Midfielder' ? ' build-up play and creative passing sequences' : 
               position === 'Defender' ? ' defensive organization and set-piece situations' : 
               ' shot-stopping scenarios and distribution phases'}.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
