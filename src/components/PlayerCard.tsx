
import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion } from "framer-motion";
import { BarChart3, TrendingUp, Award, Timer, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export interface PlayerStats {
  goals: number;
  assists: number;
  matches: number;
}

export interface PlayerDetailedStats {
  passingAccuracy: number;
  shotsOnTarget: number;
  tacklesWon: number;
  possession: number;
  minutesPlayed: number;
  distanceCovered: number;
  yellowCards: number;
  redCards: number;
  formTrend: { match: string, rating: number }[];
  heatmap: { zone: string, value: number }[];
  xGPerMatch: number;
}

export interface Player {
  id: number;
  name: string;
  team: string;
  position: string;
  stats: PlayerStats;
  detailedStats: PlayerDetailedStats;
  image: string;
}

export interface PlayerCardProps {
  player: Player;
}

export const PlayerCard = ({ player }: PlayerCardProps) => {
  // Calculate ML-based form rating (simplified version of the full model)
  const formRating = player.detailedStats.formTrend.length > 0 
    ? player.detailedStats.formTrend.reduce((sum, match) => sum + match.rating, 0) / player.detailedStats.formTrend.length 
    : 0;

  // Calculate predicted goal probability for next match
  const goalProbability = Math.min(
    30 + (player.stats.goals * 7) + (player.detailedStats.xGPerMatch * 30), 
    98
  );

  // Quick ML-generated strength assessment
  const strengthCategory = formRating > 8 ? "Elite" : 
                          formRating > 7 ? "Excellent" : 
                          formRating > 6 ? "Good" : 
                          formRating > 5 ? "Average" : "Developing";

  const getStrengthColor = (category: string) => {
    switch(category) {
      case "Elite": return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
      case "Excellent": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "Good": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "Average": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  return (
    <motion.div
      layout
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="overflow-hidden">
        <CardHeader className="flex flex-row items-center gap-4 pb-2">
          <Avatar className="h-16 w-16 border-2 border-primary">
            <AvatarImage src={player.image || "/placeholder.svg"} alt={player.name} />
            <AvatarFallback>{player.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-lg">{player.name}</h3>
              <Badge className={`ml-2 ${getStrengthColor(strengthCategory)}`}>
                {strengthCategory}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">{player.position} • {player.team}</p>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="space-y-1">
              <p className="text-2xl font-bold">{player.stats.goals}</p>
              <p className="text-xs text-muted-foreground">Goals</p>
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold">{player.stats.assists}</p>
              <p className="text-xs text-muted-foreground">Assists</p>
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold">{player.stats.matches}</p>
              <p className="text-xs text-muted-foreground">Matches</p>
            </div>
          </div>
          
          <div className="mt-4 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center">
                <Brain className="h-4 w-4 mr-1 text-primary" />
                <span>Form Rating</span>
              </div>
              <span className="font-medium">{formRating.toFixed(1)}/10</span>
            </div>
            
            <div className="space-y-1">
              <div className="flex justify-between items-center text-sm">
                <span>Goal Probability</span>
                <span>{goalProbability.toFixed(0)}%</span>
              </div>
              <Progress value={goalProbability} className="h-1.5" />
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t">
            <Link to={`/players/${player.id}`}>
              <Button className="w-full" variant="outline">
                <BarChart3 className="h-4 w-4 mr-2" />
                View Detailed Stats
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
