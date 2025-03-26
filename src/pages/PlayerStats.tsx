
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Activity, ChevronDown, BarChart3, Map, NetworkIcon, SlidersHorizontal } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { ResponsiveContainer, LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, ScatterChart, Scatter } from "recharts";
import { Player, PlayerService, UseMockData } from "@/services/api";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";

// Constants for filtering
const SEASONS = ["2023-24", "2022-23", "2021-22", "2020-21"];
const COMPETITIONS = ["Premier League", "Champions League", "FA Cup", "League Cup"];
const METRICS = ["Goals", "Assists", "xG", "Passes", "Tackles", "Interceptions"];
const ZONES = ["Left Wing", "Center", "Right Wing", "Defense", "Midfield", "Attack"];

const PlayerStats = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [player, setPlayer] = useState<Player | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [competition, setCompetition] = useState("Premier League");
  const [season, setSeason] = useState("2023-24");
  const [minMatchFilter, setMinMatchFilter] = useState([10]);
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>(["Goals", "xG"]);

  // ML-derived metrics (simulated)
  const [mlData, setMlData] = useState({
    performanceRating: 8.4,
    xGModel: 0.67,
    tacklingEfficiency: 78,
    passingNetworkCentrality: 0.82,
    tacticalContribution: 7.9,
    projectedDevelopment: "+5%"
  });

  useEffect(() => {
    const fetchPlayer = async () => {
      try {
        setIsLoading(true);
        // In a real app, we would fetch from API
        // For now, using mock data
        if (id) {
          const mockPlayers = UseMockData.getPlayers();
          const foundPlayer = mockPlayers.find(p => p.id === parseInt(id));
          
          if (foundPlayer) {
            // Simulate API delay
            await UseMockData.delay(800);
            setPlayer(foundPlayer);
          } else {
            toast.error("Player not found");
          }
        }
      } catch (error) {
        toast.error("Failed to load player data");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlayer();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto p-6 pt-24 text-center">
          <div className="space-y-4 flex items-center justify-center flex-col">
            <div className="h-16 w-16 animate-pulse rounded-full bg-muted"></div>
            <div className="h-8 w-48 animate-pulse rounded bg-muted"></div>
            <div className="h-4 w-36 animate-pulse rounded bg-muted"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!player) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto p-6 pt-24 text-center">
          <h1 className="text-2xl font-bold mb-4">Player not found</h1>
          <Button 
            onClick={() => navigate('/players')}
            variant="outline"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Players
          </Button>
        </div>
      </div>
    );
  }

  // Sample data for charts - in a real app this would come from the API
  const seasonalStats = [
    { month: "Aug", goals: 2, assists: 1, xG: 1.8, form: 7.2 },
    { month: "Sep", goals: 1, assists: 3, xG: 2.3, form: 8.1 },
    { month: "Oct", goals: 3, assists: 0, xG: 2.7, form: 7.8 },
    { month: "Nov", goals: 0, assists: 2, xG: 1.4, form: 6.9 },
    { month: "Dec", goals: 4, assists: 1, xG: 3.2, form: 8.5 },
    { month: "Jan", goals: 2, assists: 2, xG: 2.1, form: 7.4 },
    { month: "Feb", goals: 1, assists: 0, xG: 1.2, form: 6.8 },
    { month: "Mar", goals: 2, assists: 1, xG: 1.9, form: 7.5 },
  ];

  const passingNetwork = [
    { player: "De Bruyne", strength: 23 },
    { player: "Fernandes", strength: 18 },
    { player: "Mount", strength: 12 },
    { player: "Greenwood", strength: 8 },
    { player: "Shaw", strength: 6 },
  ];

  const heatmapData = player.detailedStats.heatmap.map(zone => ({
    zone: zone.zone,
    value: zone.value,
    color: `rgba(79, 70, 229, ${zone.value / 100})`
  }));

  const performanceByOpposition = [
    { opposition: "Arsenal", rating: 8.2, xG: 0.8, goals: 1 },
    { opposition: "Liverpool", rating: 7.4, xG: 0.5, goals: 0 },
    { opposition: "Man City", rating: 9.1, xG: 1.2, goals: 2 },
    { opposition: "Chelsea", rating: 6.8, xG: 0.3, goals: 0 },
    { opposition: "Tottenham", rating: 7.7, xG: 0.7, goals: 1 },
  ];

  const COLORS = ['#4f46e5', '#e11d48', '#f59e0b', '#10b981', '#6366f1'];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="container mx-auto space-y-6 p-6 pt-24"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <Button 
              onClick={() => navigate('/players')}
              variant="ghost"
              className="mb-2"
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Players
            </Button>
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20 rounded-full border-2 border-primary">
                <AvatarImage src={player.image} alt={player.name} />
                <AvatarFallback className="bg-primary/10 text-primary">
                  {player.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-4xl font-bold">{player.name}</h1>
                <div className="flex items-center gap-2">
                  <p className="text-muted-foreground">{player.team}</p>
                  <Badge variant="outline" className="ml-2">{player.position}</Badge>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="flex flex-col items-center bg-primary/10 rounded-lg p-3 min-w-28">
              <Activity className="h-5 w-5 text-primary mb-1" />
              <p className="text-xs text-muted-foreground">Performance Rating</p>
              <p className="text-2xl font-bold">{mlData.performanceRating}</p>
            </div>
            <div className="flex flex-col items-center bg-primary/10 rounded-lg p-3 min-w-28">
              <BarChart3 className="h-5 w-5 text-primary mb-1" />
              <p className="text-xs text-muted-foreground">Expected Goals</p>
              <p className="text-2xl font-bold">{mlData.xGModel}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 bg-muted/40 p-4 rounded-lg overflow-x-auto">
          <div className="flex items-center gap-2 min-w-max">
            <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Filters:</span>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <Select value={season} onValueChange={setSeason}>
              <SelectTrigger className="w-36 h-8">
                <SelectValue placeholder="Season" />
              </SelectTrigger>
              <SelectContent>
                {SEASONS.map((s) => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={competition} onValueChange={setCompetition}>
              <SelectTrigger className="w-40 h-8">
                <SelectValue placeholder="Competition" />
              </SelectTrigger>
              <SelectContent>
                {COMPETITIONS.map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <div className="flex flex-col gap-1 w-36">
              <span className="text-xs text-muted-foreground">Min. Matches: {minMatchFilter[0]}</span>
              <Slider value={minMatchFilter} onValueChange={setMinMatchFilter} max={38} step={1} className="w-full" />
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full grid grid-cols-2 sm:grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="heatmap">Heatmap</TabsTrigger>
            <TabsTrigger value="passing">Passing Network</TabsTrigger>
            <TabsTrigger value="predictions">AI Predictions</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Matches</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{player.stats.matches}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Goals</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{player.stats.goals}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Assists</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{player.stats.assists}</div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Season Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={seasonalStats}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="goals" stroke="#4f46e5" activeDot={{ r: 8 }} />
                      <Line type="monotone" dataKey="assists" stroke="#e11d48" />
                      <Line type="monotone" dataKey="xG" stroke="#f59e0b" strokeDasharray="5 5" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Form Trend</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart 
                        data={player.detailedStats.formTrend}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="match" />
                        <YAxis domain={[0, 10]} />
                        <Tooltip />
                        <Area type="monotone" dataKey="rating" stroke="#4f46e5" fill="#4f46e5" fillOpacity={0.3} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Performance by Opposition</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={performanceByOpposition}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="opposition" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="rating" fill="#4f46e5" />
                        <Bar dataKey="goals" fill="#e11d48" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Detailed Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Passing Accuracy</p>
                    <p className="text-lg font-medium">{player.detailedStats.passingAccuracy}%</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Shots on Target</p>
                    <p className="text-lg font-medium">{player.detailedStats.shotsOnTarget}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Tackles Won</p>
                    <p className="text-lg font-medium">{player.detailedStats.tacklesWon}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Possession</p>
                    <p className="text-lg font-medium">{player.detailedStats.possession}%</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Minutes Played</p>
                    <p className="text-lg font-medium">{player.detailedStats.minutesPlayed}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Distance Covered</p>
                    <p className="text-lg font-medium">{player.detailedStats.distanceCovered} km</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Yellow Cards</p>
                    <p className="text-lg font-medium">{player.detailedStats.yellowCards}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Red Cards</p>
                    <p className="text-lg font-medium">{player.detailedStats.redCards}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">xG Per Match</p>
                    <p className="text-lg font-medium">{player.detailedStats.xGPerMatch}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="heatmap" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Spatial Heatmap</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[500px] relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative w-full max-w-xl aspect-[4/3] bg-emerald-800/10 rounded-lg border border-emerald-600/30 overflow-hidden">
                      {/* Field markings */}
                      <div className="absolute inset-0 flex flex-col">
                        <div className="h-1/2 border-b border-emerald-600/50"></div>
                        <div className="absolute top-1/2 left-1/2 w-24 h-24 border-2 border-emerald-600/50 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
                        <div className="absolute top-0 left-1/2 w-36 h-16 border-2 border-emerald-600/50 -translate-x-1/2"></div>
                        <div className="absolute bottom-0 left-1/2 w-36 h-16 border-2 border-emerald-600/50 -translate-x-1/2"></div>
                      </div>
                      
                      {/* Heatmap bubbles */}
                      {heatmapData.map((zone, index) => (
                        <div 
                          key={index}
                          className="absolute rounded-full opacity-80"
                          style={{
                            backgroundColor: zone.color,
                            width: `${Math.max(30, zone.value / 2)}px`,
                            height: `${Math.max(30, zone.value / 2)}px`,
                            top: zone.zone === "Left Wing" ? "40%" : 
                                 zone.zone === "Center" ? "50%" : 
                                 zone.zone === "Right Wing" ? "60%" : 
                                 zone.zone === "Defense" ? "75%" : 
                                 zone.zone === "Midfield" ? "50%" : "25%",
                            left: zone.zone === "Left Wing" ? "20%" : 
                                  zone.zone === "Center" ? "50%" : 
                                  zone.zone === "Right Wing" ? "80%" : 
                                  zone.zone === "Defense" ? "50%" : 
                                  zone.zone === "Midfield" ? "50%" : "50%",
                            transform: "translate(-50%, -50%)"
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-2">
                  {heatmapData.map((zone, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-muted/50 rounded-md">
                      <span className="text-sm">{zone.zone}</span>
                      <Badge 
                        variant="outline" 
                        style={{backgroundColor: zone.color, color: "white"}}
                      >
                        {zone.value}%
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="passing" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Passing Network</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[400px] relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative w-full max-w-xl aspect-[4/3] bg-emerald-800/10 rounded-lg border border-emerald-600/30">
                      {/* Field markings */}
                      <div className="absolute inset-0 flex flex-col">
                        <div className="h-1/2 border-b border-emerald-600/50"></div>
                        <div className="absolute top-1/2 left-1/2 w-24 h-24 border-2 border-emerald-600/50 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
                      </div>
                      
                      {/* Center player (the analyzed player) */}
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                        <div className="bg-primary w-16 h-16 rounded-full flex items-center justify-center text-white font-medium text-xs shadow-lg">
                          {player.name.split(' ').map(n => n[0]).join('')}
                        </div>
                      </div>
                      
                      {/* Connected players */}
                      {passingNetwork.map((connectedPlayer, index) => {
                        // Calculate position based on index
                        const angle = (index * (360 / passingNetwork.length)) * (Math.PI / 180);
                        const distance = 120; // Distance from center
                        const x = 50 + Math.cos(angle) * distance / 5;
                        const y = 50 + Math.sin(angle) * distance / 5;
                        
                        return (
                          <div key={index}>
                            {/* Connection line */}
                            <div 
                              className="absolute top-1/2 left-1/2 bg-primary/30 -translate-y-1/2 -translate-x-0 origin-left"
                              style={{
                                height: `${Math.max(2, connectedPlayer.strength / 10)}px`,
                                width: `${distance}px`,
                                transform: `translateX(-50%) rotate(${angle * (180 / Math.PI)}deg)`
                              }}
                            ></div>
                            
                            {/* Player node */}
                            <div 
                              className="absolute flex items-center justify-center"
                              style={{
                                top: `${y}%`,
                                left: `${x}%`,
                                transform: "translate(-50%, -50%)"
                              }}
                            >
                              <div 
                                className="bg-primary/80 rounded-full flex items-center justify-center text-white font-medium shadow-md text-xs"
                                style={{
                                  width: `${Math.max(30, connectedPlayer.strength)}px`,
                                  height: `${Math.max(30, connectedPlayer.strength)}px`,
                                }}
                              >
                                {connectedPlayer.player.split(' ')[0]}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
                
                <div className="mt-4">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Player</TableHead>
                        <TableHead>Connection Strength</TableHead>
                        <TableHead>Passes</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {passingNetwork.map((connection, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{connection.player}</TableCell>
                          <TableCell>
                            <div className="w-full bg-muted rounded-full h-2.5">
                              <div 
                                className="bg-primary h-2.5 rounded-full" 
                                style={{ width: `${(connection.strength / 25) * 100}%` }}
                              ></div>
                            </div>
                          </TableCell>
                          <TableCell>{connection.strength * 4}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="predictions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>AI-Powered Performance Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2 p-4 border rounded-lg">
                      <h3 className="text-sm font-medium text-muted-foreground">Performance Rating</h3>
                      <div className="text-4xl font-bold text-primary">{mlData.performanceRating}</div>
                      <p className="text-xs text-muted-foreground">Based on 47 performance metrics</p>
                    </div>
                    <div className="space-y-2 p-4 border rounded-lg">
                      <h3 className="text-sm font-medium text-muted-foreground">xG Model</h3>
                      <div className="text-4xl font-bold text-primary">{mlData.xGModel}</div>
                      <p className="text-xs text-muted-foreground">Expected goals per 90 minutes</p>
                    </div>
                    <div className="space-y-2 p-4 border rounded-lg">
                      <h3 className="text-sm font-medium text-muted-foreground">Projected Development</h3>
                      <div className="text-4xl font-bold text-primary">{mlData.projectedDevelopment}</div>
                      <p className="text-xs text-muted-foreground">Estimated improvement over next season</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">Performance Radar</h3>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div className="space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Finishing</span>
                          <span className="text-sm font-medium">8.7</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div className="bg-primary h-2 rounded-full" style={{ width: '87%' }}></div>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Passing</span>
                          <span className="text-sm font-medium">7.9</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div className="bg-primary h-2 rounded-full" style={{ width: '79%' }}></div>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Dribbling</span>
                          <span className="text-sm font-medium">9.2</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div className="bg-primary h-2 rounded-full" style={{ width: '92%' }}></div>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Defending</span>
                          <span className="text-sm font-medium">5.4</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div className="bg-primary h-2 rounded-full" style={{ width: '54%' }}></div>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Physical</span>
                          <span className="text-sm font-medium">8.1</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div className="bg-primary h-2 rounded-full" style={{ width: '81%' }}></div>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Tactical IQ</span>
                          <span className="text-sm font-medium">7.7</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div className="bg-primary h-2 rounded-full" style={{ width: '77%' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Similar Players</h3>
                    <div className="flex flex-wrap gap-3">
                      <Badge className="py-2 text-sm">Kevin De Bruyne (82% match)</Badge>
                      <Badge className="py-2 text-sm">Bruno Fernandes (78% match)</Badge>
                      <Badge className="py-2 text-sm">Mason Mount (75% match)</Badge>
                      <Badge className="py-2 text-sm">Jack Grealish (72% match)</Badge>
                      <Badge className="py-2 text-sm">Phil Foden (70% match)</Badge>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <h3 className="text-lg font-medium mb-2">Performance Insight</h3>
                    <p className="text-sm text-muted-foreground">
                      Our AI analysis suggests {player.name} performs exceptionally well in high-pressing systems and excels 
                      at creating chances from the right half-space. The player shows significant contribution to expected threat (xT) 
                      metrics, particularly in the final third. Defensive positioning could be improved, especially 
                      when tracking back after attacking transitions.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
};

export default PlayerStats;
