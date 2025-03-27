
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  ArrowLeft, 
  Loader2, 
  Filter, 
  TrendingUp, 
  Activity,
  Grid3X3,
  GitBranch,
  BarChart3
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { PlayerService, UseMockData } from "@/services/api";
import { toast } from "sonner";
import { ChartContainer } from "@/components/ui/chart";
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  Tooltip as RechartsTooltip, 
  XAxis, 
  YAxis,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Cell,
  ZAxis
} from "recharts";
import { Heatmap } from "@/components/Heatmap";
import { PassingNetwork } from "@/components/PassingNetwork";
import { PerformanceRatings } from "@/components/PerformanceRatings";
import { Player, PlayerStats as PlayerStatsType, PlayerDetailedStats } from "@/components/PlayerCard";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { statsUtils } from "@/utils/statsUtils";

// Filter types
type TimeFilter = "all" | "2023-24" | "2022-23" | "last-5" | "last-10";
type CompetitionFilter = "all" | "premier-league" | "champions-league" | "fa-cup";
type PositionFilter = "all" | "forward" | "midfielder" | "defender" | "goalkeeper";

const PlayerStatsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("all");
  const [competitionFilter, setCompetitionFilter] = useState<CompetitionFilter>("all");
  const [positionFilter, setPositionFilter] = useState<PositionFilter>("all");
  const [activeDashboard, setActiveDashboard] = useState("overview");

  // Fetch player data
  const { data: player, isLoading, error } = useQuery({
    queryKey: ['player', id],
    queryFn: () => {
      // Check if we want to use mock data
      const useMockData = !import.meta.env.VITE_API_URL;
      
      if (useMockData) {
        return UseMockData.delay(600).then(() => {
          const allPlayers = UseMockData.getPlayers();
          const player = allPlayers.find(p => p.id === parseInt(id || "0"));
          if (!player) {
            throw new Error("Player not found");
          }
          return player;
        });
      }
      
      // Use real API
      return PlayerService.getPlayerById(parseInt(id || "0"));
    },
    staleTime: 60000, // 1 minute
  });

  // Show error toast if API request fails
  useEffect(() => {
    if (error) {
      toast.error("Failed to load player data");
    }
  }, [error]);

  // Calculate advanced stats using ML models
  const advancedStats = useMemo(() => {
    if (!player) return null;
    
    return {
      expectedGoals: statsUtils.calculateXG(player, timeFilter, competitionFilter),
      playerRating: statsUtils.calculateRating(player, timeFilter, competitionFilter),
      tacticalPatterns: statsUtils.identifyTacticalPatterns(player, timeFilter, competitionFilter),
      performanceScores: statsUtils.calculatePerformanceScores(player)
    };
  }, [player, timeFilter, competitionFilter]);

  // Generate heatmap data
  const heatmapData = useMemo(() => {
    if (!player) return [];
    return statsUtils.generateHeatmapData(player, timeFilter, competitionFilter);
  }, [player, timeFilter, competitionFilter]);

  // Generate passing network data
  const passingNetworkData = useMemo(() => {
    if (!player) return { nodes: [], links: [] };
    return statsUtils.generatePassingNetworkData(player, timeFilter, competitionFilter);
  }, [player, timeFilter, competitionFilter]);

  // Handle back navigation
  const handleBack = () => {
    navigate(-1);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto p-6 pt-24 flex justify-center items-center h-[80vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-muted-foreground">Loading player stats...</span>
        </div>
      </div>
    );
  }

  if (!player) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto p-6 pt-24">
          <Button onClick={handleBack} variant="ghost" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
          <div className="flex flex-col items-center justify-center h-[60vh]">
            <h2 className="text-2xl font-bold">Player not found</h2>
            <p className="text-muted-foreground mt-2">The player you're looking for doesn't exist or has been removed.</p>
            <Button onClick={() => navigate('/players')} className="mt-4">
              View All Players
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="container mx-auto p-6 pt-24"
      >
        <Button onClick={handleBack} variant="ghost" className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Players
        </Button>

        {/* Player header */}
        <div className="flex flex-col md:flex-row gap-6 mb-8 items-start md:items-center">
          <Avatar className="h-24 w-24 border-2 border-primary">
            <AvatarImage src={player.image} alt={player.name} />
            <AvatarFallback className="text-xl">{player.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-4xl font-bold">{player.name}</h1>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="outline" className="text-sm">
                {player.position}
              </Badge>
              <span className="text-muted-foreground">•</span>
              <span className="text-muted-foreground">{player.team}</span>
            </div>
            <div className="grid grid-cols-3 gap-4 mt-4">
              <div className="text-center">
                <div className="text-3xl font-bold">{player.stats.goals}</div>
                <div className="text-sm text-muted-foreground">Goals</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">{player.stats.assists}</div>
                <div className="text-sm text-muted-foreground">Assists</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">{player.stats.matches}</div>
                <div className="text-sm text-muted-foreground">Matches</div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg flex items-center">
                <Filter className="h-4 w-4 mr-2" /> Filters
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Time Period</label>
                <Select value={timeFilter} onValueChange={(value) => setTimeFilter(value as TimeFilter)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select time period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Time</SelectItem>
                    <SelectItem value="2023-24">2023-24 Season</SelectItem>
                    <SelectItem value="2022-23">2022-23 Season</SelectItem>
                    <SelectItem value="last-5">Last 5 Matches</SelectItem>
                    <SelectItem value="last-10">Last 10 Matches</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">Competition</label>
                <Select value={competitionFilter} onValueChange={(value) => setCompetitionFilter(value as CompetitionFilter)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select competition" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Competitions</SelectItem>
                    <SelectItem value="premier-league">Premier League</SelectItem>
                    <SelectItem value="champions-league">Champions League</SelectItem>
                    <SelectItem value="fa-cup">FA Cup</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">Position Filter</label>
                <Select value={positionFilter} onValueChange={(value) => setPositionFilter(value as PositionFilter)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select position filter" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Positions</SelectItem>
                    <SelectItem value="forward">Forward</SelectItem>
                    <SelectItem value="midfielder">Midfielder</SelectItem>
                    <SelectItem value="defender">Defender</SelectItem>
                    <SelectItem value="goalkeeper">Goalkeeper</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Dashboard selection */}
        <Tabs value={activeDashboard} onValueChange={setActiveDashboard} className="space-y-4">
          <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-4">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" /> Overview
            </TabsTrigger>
            <TabsTrigger value="heatmap" className="flex items-center gap-2">
              <Grid3X3 className="h-4 w-4" /> Heatmap
            </TabsTrigger>
            <TabsTrigger value="passing" className="flex items-center gap-2">
              <GitBranch className="h-4 w-4" /> Passing Network
            </TabsTrigger>
            <TabsTrigger value="ai-insights" className="flex items-center gap-2">
              <Activity className="h-4 w-4" /> AI Insights
            </TabsTrigger>
          </TabsList>

          {/* Overview Dashboard */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Performance by Metric */}
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Performance by Metric</CardTitle>
                  <CardDescription>Key performance indicators</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={[
                        { name: "Pass Acc", value: player.detailedStats.passingAccuracy },
                        { name: "Shots On", value: player.detailedStats.shotsOnTarget },
                        { name: "Tackles", value: player.detailedStats.tacklesWon },
                        { name: "Poss", value: player.detailedStats.possession },
                        { name: "Distance", value: player.detailedStats.distanceCovered / 2 },
                        { name: "xG", value: player.detailedStats.xGPerMatch * 10 }
                      ]}>
                        <XAxis dataKey="name" />
                        <YAxis />
                        <RechartsTooltip />
                        <Bar dataKey="value" fill="#4f46e5" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Form Trend */}
              <Card>
                <CardHeader>
                  <CardTitle>Form Trend</CardTitle>
                  <CardDescription>Performance over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={player.detailedStats.formTrend.map(item => ({
                        name: item.match,
                        rating: item.rating
                      }))}>
                        <XAxis dataKey="name" />
                        <YAxis domain={[0, 10]} />
                        <RechartsTooltip />
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
                </CardContent>
              </Card>

              {/* Expected Goals */}
              <Card>
                <CardHeader>
                  <CardTitle>Expected Goals (xG)</CardTitle>
                  <CardDescription>ML-derived xG analysis</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center h-[160px]">
                    <div className="text-center">
                      <div className="text-5xl font-bold">{advancedStats?.expectedGoals.total.toFixed(2)}</div>
                      <div className="text-sm text-muted-foreground mt-2">Total Expected Goals</div>
                      <div className="grid grid-cols-2 gap-4 mt-4">
                        <div>
                          <div className="text-xl font-bold">{advancedStats?.expectedGoals.perGame.toFixed(2)}</div>
                          <div className="text-xs text-muted-foreground">Per Game</div>
                        </div>
                        <div>
                          <div className="text-xl font-bold">{advancedStats?.expectedGoals.conversion.toFixed(1)}%</div>
                          <div className="text-xs text-muted-foreground">Conversion Rate</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Radar Chart */}
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Performance Radar</CardTitle>
                  <CardDescription>Comprehensive skill analysis</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart outerRadius={90} data={advancedStats?.performanceScores}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="skill" />
                        <PolarRadiusAxis domain={[0, 100]} />
                        <Radar
                          name="Performance"
                          dataKey="value"
                          stroke="#4f46e5"
                          fill="#4f46e5"
                          fillOpacity={0.5}
                        />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Cards Stats */}
              <Card>
                <CardHeader>
                  <CardTitle>Discipline</CardTitle>
                  <CardDescription>Yellow and red cards</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center justify-center gap-4 h-[200px]">
                    <div className="flex gap-4 items-center justify-center">
                      <div className="flex flex-col items-center">
                        <div className="w-16 h-24 bg-yellow-400 rounded shadow-md"></div>
                        <div className="text-2xl font-bold mt-2">{player.detailedStats.yellowCards}</div>
                        <div className="text-xs text-muted-foreground">Yellow Cards</div>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="w-16 h-24 bg-red-600 rounded shadow-md"></div>
                        <div className="text-2xl font-bold mt-2">{player.detailedStats.redCards}</div>
                        <div className="text-xs text-muted-foreground">Red Cards</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Heatmap Dashboard */}
          <TabsContent value="heatmap">
            <div className="grid grid-cols-1 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Spatial Heatmap</CardTitle>
                  <CardDescription>Player positioning and movement patterns</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[500px] w-full">
                    <Heatmap data={heatmapData} player={player} />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Passing Network Dashboard */}
          <TabsContent value="passing">
            <div className="grid grid-cols-1 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Passing Network</CardTitle>
                  <CardDescription>Connection patterns with teammates</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[500px] w-full">
                    <PassingNetwork data={passingNetworkData} player={player} />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* AI Insights Dashboard */}
          <TabsContent value="ai-insights">
            <div className="grid grid-cols-1 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>AI Performance Analysis</CardTitle>
                  <CardDescription>Advanced player ratings and prediction</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-3">
                      <PerformanceRatings player={player} />
                    </div>
                    
                    <div className="md:col-span-3">
                      <h3 className="text-lg font-semibold mb-4">Tactical Pattern Recognition</h3>
                      <ScrollArea className="h-[300px] w-full rounded-md border p-4">
                        {advancedStats?.tacticalPatterns.map((pattern, index) => (
                          <div key={index} className="mb-4 pb-4 border-b last:border-0">
                            <div className="flex items-start">
                              <TrendingUp className="h-5 w-5 mr-2 text-primary mt-0.5" />
                              <div>
                                <h4 className="font-medium">{pattern.name}</h4>
                                <p className="text-sm text-muted-foreground">{pattern.description}</p>
                                <div className="flex items-center mt-2">
                                  <div className="w-full bg-secondary rounded-full h-2">
                                    <div 
                                      className="bg-primary h-2 rounded-full" 
                                      style={{ width: `${pattern.confidence}%` }}
                                    ></div>
                                  </div>
                                  <span className="ml-2 text-xs font-medium">{pattern.confidence}%</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </ScrollArea>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
};

export default PlayerStatsPage;
