
import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion } from "framer-motion";
import { BarChart3, TrendingUp, Award, Timer, Brain, Share2, Bookmark, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "sonner";

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
  const [isSaved, setIsSaved] = useState(false);
  const [showTrendTooltip, setShowTrendTooltip] = useState(false);
  
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
                          
  // Generate a more personalized insight
  const generateInsight = () => {
    const insights = [
      `${player.name} excels in ${player.detailedStats.passingAccuracy > 80 ? 'passing accuracy' : 'shooting precision'}.`,
      `Based on recent form, ${player.name} is likely to ${formRating > 7 ? 'outperform' : 'meet'} expectations.`,
      `${player.name}'s spatial awareness creates ${Math.random() > 0.5 ? 'additional scoring chances' : 'defensive stability'}.`,
      `Our AI predicts ${player.name} will have a ${formRating > 7 ? 'significant' : 'moderate'} impact on the next match.`
    ];
    return insights[Math.floor(Math.random() * insights.length)];
  };

  const getStrengthColor = (category: string) => {
    switch(category) {
      case "Elite": return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
      case "Excellent": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "Good": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "Average": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };
  
  // Show form trend tooltip
  const getTrendDirection = () => {
    if (player.detailedStats.formTrend.length < 2) return "stable";
    
    const recent = player.detailedStats.formTrend[0].rating;
    const previous = player.detailedStats.formTrend[1].rating;
    
    if (recent > previous + 0.5) return "improving";
    if (recent < previous - 0.5) return "declining";
    return "stable";
  };
  
  const getTrendIcon = () => {
    const trend = getTrendDirection();
    switch(trend) {
      case "improving": return <TrendingUp className="h-4 w-4 text-green-500" />;
      case "declining": return <TrendingUp className="h-4 w-4 text-red-500 rotate-180" />;
      default: return <TrendingUp className="h-4 w-4 text-yellow-500 rotate-90" />;
    }
  };
  
  // Handle bookmark/save functionality
  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsSaved(!isSaved);
    
    if (!isSaved) {
      toast.success("Player saved to favorites", {
        description: `${player.name} has been added to your favorites list.`
      });
    } else {
      toast.info("Player removed from favorites", {
        description: `${player.name} has been removed from your favorites list.`
      });
    }
  };
  
  // Handle share functionality
  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // In a real app, this would use the Web Share API or copy to clipboard
    toast.success("Share link copied to clipboard", {
      description: `A link to ${player.name}'s profile has been copied to your clipboard.`
    });
  };

  return (
    <motion.div
      layout
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="overflow-hidden relative">
        {/* Quick action buttons */}
        <div className="absolute top-3 right-3 flex gap-1 z-10">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background/90"
                  onClick={handleSave}
                >
                  <Bookmark className={`h-4 w-4 ${isSaved ? 'fill-primary text-primary' : 'text-muted-foreground'}`} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{isSaved ? 'Remove from favorites' : 'Add to favorites'}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background/90"
                  onClick={handleShare}
                >
                  <Share2 className="h-4 w-4 text-muted-foreground" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Share player profile</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      
        <CardHeader className="flex flex-row items-center gap-4 pb-2">
          <Avatar className="h-16 w-16 border-2 border-primary">
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
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center gap-1 cursor-help">
                      <span className="font-medium">{formRating.toFixed(1)}/10</span>
                      {getTrendIcon()}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Form is {getTrendDirection()}</p>
                    <p className="text-xs text-muted-foreground">
                      Based on last {player.detailedStats.formTrend.length} matches
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            
            <div className="space-y-1">
              <div className="flex justify-between items-center text-sm">
                <span>Goal Probability</span>
                <span>{goalProbability.toFixed(0)}%</span>
              </div>
              <Progress value={goalProbability} className="h-1.5" />
            </div>
          </div>
          
          {/* ML Insight */}
          <div className="mt-4 p-3 bg-primary/5 rounded-md border border-primary/10">
            <div className="flex items-center gap-1 text-xs text-primary font-medium mb-1">
              <Sparkles className="h-3 w-3" />
              AI INSIGHT
            </div>
            <p className="text-xs text-muted-foreground">{generateInsight()}</p>
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
