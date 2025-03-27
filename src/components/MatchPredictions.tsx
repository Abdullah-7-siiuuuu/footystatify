
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Loader2, Zap, BarChart, AlertTriangle, Percent } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

// Sample match data
const upcomingMatches = [
  {
    id: 1,
    homeTeam: "Manchester City",
    awayTeam: "Liverpool",
    dateTime: "2023-12-10T14:00:00",
    competition: "Premier League",
    venue: "Etihad Stadium",
    homeWinProb: 45,
    drawProb: 28,
    awayWinProb: 27,
    keyStats: {
      possession: { home: 58, away: 42 },
      shots: { home: 14, away: 11 },
      xG: { home: 2.4, away: 1.8 }
    },
    predictions: {
      score: "2-1",
      scorers: ["Haaland", "Salah", "De Bruyne"],
      keyEvents: ["Early goal likely", "High pressing game", "Cards expected"]
    }
  },
  {
    id: 2,
    homeTeam: "Arsenal",
    awayTeam: "Chelsea",
    dateTime: "2023-12-11T16:30:00",
    competition: "Premier League",
    venue: "Emirates Stadium",
    homeWinProb: 52,
    drawProb: 26,
    awayWinProb: 22,
    keyStats: {
      possession: { home: 55, away: 45 },
      shots: { home: 16, away: 9 },
      xG: { home: 2.1, away: 1.2 }
    },
    predictions: {
      score: "2-0",
      scorers: ["Saka", "Martinelli"],
      keyEvents: ["Clean sheet likely", "Fast counter-attacks", "Second half goals"]
    }
  },
  {
    id: 3,
    homeTeam: "Manchester United",
    awayTeam: "Tottenham",
    dateTime: "2023-12-12T20:00:00",
    competition: "Premier League",
    venue: "Old Trafford",
    homeWinProb: 38,
    drawProb: 30,
    awayWinProb: 32,
    keyStats: {
      possession: { home: 48, away: 52 },
      shots: { home: 12, away: 15 },
      xG: { home: 1.7, away: 1.9 }
    },
    predictions: {
      score: "1-1",
      scorers: ["Fernandes", "Son"],
      keyEvents: ["Tight midfield battle", "Late equalizer", "High intensity"]
    }
  }
];

export const MatchPredictions = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDetailedView, setIsDetailedView] = useState(false);
  
  const refreshPredictions = () => {
    setIsGenerating(true);
    // Simulate ML model processing
    setTimeout(() => {
      setIsGenerating(false);
      toast.success("Predictions refreshed", {
        description: "ML models have been updated with the latest data"
      });
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">AI Match Predictions</h2>
          <p className="text-muted-foreground">
            Powered by advanced machine learning models trained on 10+ seasons of data
          </p>
        </div>
        <Button 
          variant="outline" 
          onClick={refreshPredictions}
          disabled={isGenerating}
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Updating models
            </>
          ) : (
            <>
              <Zap className="mr-2 h-4 w-4" />
              Refresh predictions
            </>
          )}
        </Button>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {upcomingMatches.map((match) => (
          <MatchPredictionCard 
            key={match.id} 
            match={match} 
            isDetailedView={isDetailedView}
          />
        ))}
      </div>
      
      <div className="flex justify-end">
        <Button 
          variant="ghost" 
          onClick={() => setIsDetailedView(!isDetailedView)}
        >
          <BarChart className="mr-2 h-4 w-4" />
          {isDetailedView ? "Simple view" : "Detailed view"}
        </Button>
      </div>
      
      <div className="p-4 bg-muted/50 rounded-lg border">
        <div className="flex items-start gap-4">
          <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <h3 className="font-medium">About Match Predictions</h3>
            <p className="text-sm text-muted-foreground">
              Our AI prediction system analyzes over 35 variables including recent form, head-to-head history, 
              player availability, tactical approaches, and even weather conditions. 
              Predictions have achieved 68% accuracy for match outcomes and 42% for exact scores.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

interface MatchPredictionCardProps {
  match: typeof upcomingMatches[0];
  isDetailedView: boolean;
}

const MatchPredictionCard = ({ match, isDetailedView }: MatchPredictionCardProps) => {
  const matchDate = new Date(match.dateTime);
  const formattedDate = matchDate.toLocaleDateString('en-US', { 
    weekday: 'short', 
    month: 'short', 
    day: 'numeric' 
  });
  const formattedTime = matchDate.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
  
  // Get the highest probability outcome
  const outcomes = [
    { result: "home", prob: match.homeWinProb },
    { result: "draw", prob: match.drawProb },
    { result: "away", prob: match.awayWinProb }
  ];
  
  const mostLikelyOutcome = outcomes.reduce((prev, current) => 
    (prev.prob > current.prob) ? prev : current
  );
  
  // Get confidence level
  const getConfidenceLevel = (prob: number) => {
    if (prob >= 60) return { label: "High", color: "bg-green-100 text-green-800" };
    if (prob >= 45) return { label: "Medium", color: "bg-yellow-100 text-yellow-800" };
    return { label: "Low", color: "bg-orange-100 text-orange-800" };
  };
  
  const confidence = getConfidenceLevel(mostLikelyOutcome.prob);
  
  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-lg">{match.homeTeam} vs {match.awayTeam}</CardTitle>
              <p className="text-sm text-muted-foreground">
                {formattedDate} at {formattedTime} • {match.venue}
              </p>
            </div>
            <Badge>{match.competition}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Home win</span>
                <span>{match.homeWinProb}%</span>
              </div>
              <Progress value={match.homeWinProb} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Draw</span>
                <span>{match.drawProb}%</span>
              </div>
              <Progress value={match.drawProb} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Away win</span>
                <span>{match.awayWinProb}%</span>
              </div>
              <Progress value={match.awayWinProb} className="h-2" />
            </div>
            
            <div className="pt-2 flex items-center justify-between">
              <div>
                <div className="text-sm text-muted-foreground">Predicted score</div>
                <div className="text-xl font-bold">{match.predictions.score}</div>
              </div>
              <Badge variant="outline" className={`${confidence.color} border-none`}>
                <Percent className="h-3 w-3 mr-1" />
                {confidence.label} confidence
              </Badge>
            </div>
            
            {isDetailedView && (
              <div className="pt-3 mt-3 border-t space-y-3">
                <div>
                  <div className="text-sm font-medium mb-1">Key stats</div>
                  <div className="grid grid-cols-3 text-center text-sm">
                    <div>
                      <div className="font-medium">Possession</div>
                      <div className="text-muted-foreground">{match.keyStats.possession.home}% - {match.keyStats.possession.away}%</div>
                    </div>
                    <div>
                      <div className="font-medium">Shots</div>
                      <div className="text-muted-foreground">{match.keyStats.shots.home} - {match.keyStats.shots.away}</div>
                    </div>
                    <div>
                      <div className="font-medium">xG</div>
                      <div className="text-muted-foreground">{match.keyStats.xG.home} - {match.keyStats.xG.away}</div>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium mb-1">Likely scorers</div>
                  <div className="flex flex-wrap gap-1">
                    {match.predictions.scorers.map((scorer, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {scorer}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium mb-1">Match insights</div>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    {match.predictions.keyEvents.map((event, index) => (
                      <li key={index} className="flex items-center">
                        <span className="h-1.5 w-1.5 rounded-full bg-primary/70 mr-2"></span>
                        {event}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
