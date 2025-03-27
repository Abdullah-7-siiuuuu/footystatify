
import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion, AnimatePresence } from "framer-motion";
import { ChartContainer } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { ChevronDown, ChevronUp, TrendingUp, Award, Timer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
  const [expanded, setExpanded] = useState(false);

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  const formChartData = player.detailedStats.formTrend.map(item => ({
    name: item.match,
    rating: item.rating
  }));

  const performanceData = [
    { name: "Pass Acc", value: player.detailedStats.passingAccuracy },
    { name: "Shots On", value: player.detailedStats.shotsOnTarget },
    { name: "Tackles", value: player.detailedStats.tacklesWon },
    { name: "Possession", value: player.detailedStats.possession },
  ];

  const formatMinutes = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <motion.div
      layout
      whileHover={{ scale: expanded ? 1 : 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="overflow-hidden">
        <CardHeader className="flex flex-row items-center gap-4 pb-2">
          <Avatar className="h-12 w-12">
            <AvatarImage src={player.image} alt={player.name} />
            <AvatarFallback>{player.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h3 className="font-semibold text-lg">{player.name}</h3>
            <p className="text-sm text-muted-foreground">{player.position} • {player.team}</p>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={toggleExpanded}
            className="p-0 h-8 w-8"
          >
            {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
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
          
          <AnimatePresence>
            {expanded && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-6 pt-4 border-t"
              >
                <Tabs defaultValue="stats" className="w-full">
                  <TabsList className="w-full mb-4">
                    <TabsTrigger value="stats" className="flex-1">Stats</TabsTrigger>
                    <TabsTrigger value="form" className="flex-1">Form</TabsTrigger>
                    <TabsTrigger value="ml" className="flex-1">ML Insights</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="stats">
                    <div className="h-[200px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={performanceData}>
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="value" fill="#4f46e5" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div className="flex items-center gap-2">
                        <Timer className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Minutes Played</p>
                          <p className="text-lg">{formatMinutes(player.detailedStats.minutesPlayed)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Distance Covered</p>
                          <p className="text-lg">{player.detailedStats.distanceCovered} km</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Award className="h-4 w-4 text-yellow-500" />
                        <div>
                          <p className="text-sm font-medium">Cards</p>
                          <p className="text-lg">
                            <span className="bg-yellow-500 px-1 text-white rounded mr-1">{player.detailedStats.yellowCards}</span>
                            <span className="bg-red-500 px-1 text-white rounded">{player.detailedStats.redCards}</span>
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">xG Per Match</p>
                          <p className="text-lg">{player.detailedStats.xGPerMatch.toFixed(2)}</p>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="form">
                    <div className="h-[200px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={formChartData}>
                          <XAxis dataKey="name" />
                          <YAxis domain={[0, 10]} />
                          <Tooltip />
                          <Line 
                            type="monotone" 
                            dataKey="rating" 
                            stroke="#4f46e5" 
                            strokeWidth={2}
                            dot={{ r: 4 }}
                            activeDot={{ r: 6 }} 
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                    <p className="text-center text-sm mt-4 text-muted-foreground">Player form over recent matches (rating out of 10)</p>
                  </TabsContent>
                  
                  <TabsContent value="ml">
                    <div className="p-4 bg-secondary/30 rounded-lg border">
                      <h4 className="font-medium mb-2">Machine Learning Insights</h4>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-start gap-2">
                          <TrendingUp className="h-4 w-4 shrink-0 mt-0.5 text-green-500" />
                          <span>This player performs best against defensive teams with a prediction of <strong>{(player.id * 7) % 100}%</strong> higher goal contribution</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <TrendingUp className="h-4 w-4 shrink-0 mt-0.5 text-blue-500" />
                          <span>Expected to cover <strong>{(player.detailedStats.distanceCovered * 1.1).toFixed(1)} km</strong> in the next match based on historical data</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <TrendingUp className="h-4 w-4 shrink-0 mt-0.5 text-purple-500" />
                          <span>Has a <strong>{60 + player.id}%</strong> chance of scoring or assisting in the next match</span>
                        </li>
                      </ul>
                    </div>
                  </TabsContent>
                </Tabs>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  );
};

