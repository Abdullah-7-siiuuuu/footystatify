
import { useState, useEffect, useMemo } from "react";
import { Navbar } from "@/components/Navbar";
import { motion } from "framer-motion";
import { 
  BarChart, LineChart, PieChart, Settings2, Filter, Users, Building2, ChevronDown,
  Download, Share2, Search, Save, Clock, Zap, PlusCircle, RotateCcw, Loader2, History
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  BarChart as RechartsBarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart as RechartsLineChart, 
  Line, 
  PieChart as RechartsPieChart, 
  Pie, 
  Cell, 
  Legend,
  Scatter,
  ScatterChart,
  ZAxis
} from 'recharts';
import { getUniqueTeams, Team, leagueData } from "@/components/TeamRankings";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Player } from "@/components/PlayerCard";
import { toast } from "@/components/ui/sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Mock players data
const playersData: Player[] = [
  {
    id: 1,
    name: "Erling Haaland",
    team: "Manchester City",
    position: "Striker",
    stats: { goals: 36, assists: 8, matches: 35 },
    detailedStats: {
      passingAccuracy: 75,
      shotsOnTarget: 64,
      tacklesWon: 15,
      possession: 42,
      minutesPlayed: 3150,
      distanceCovered: 320,
      yellowCards: 4,
      redCards: 0,
      formTrend: [
        { match: "vs Arsenal", rating: 8.7 },
        { match: "vs Liverpool", rating: 7.9 },
        { match: "vs Chelsea", rating: 9.1 }
      ],
      heatmap: [
        { zone: "penalty area", value: 85 },
        { zone: "center", value: 60 },
        { zone: "wings", value: 25 }
      ],
      xGPerMatch: 0.92
    },
    image: ""
  },
  {
    id: 2,
    name: "Mohamed Salah",
    team: "Liverpool",
    position: "Right Winger",
    stats: { goals: 30, assists: 14, matches: 37 },
    detailedStats: {
      passingAccuracy: 82,
      shotsOnTarget: 58,
      tacklesWon: 24,
      possession: 48,
      minutesPlayed: 3250,
      distanceCovered: 380,
      yellowCards: 2,
      redCards: 0,
      formTrend: [
        { match: "vs Man City", rating: 7.8 },
        { match: "vs Arsenal", rating: 8.5 },
        { match: "vs Tottenham", rating: 8.9 }
      ],
      heatmap: [
        { zone: "right wing", value: 90 },
        { zone: "penalty area", value: 70 },
        { zone: "center", value: 45 }
      ],
      xGPerMatch: 0.85
    },
    image: ""
  },
  {
    id: 3,
    name: "Kevin De Bruyne",
    team: "Manchester City",
    position: "Midfielder",
    stats: { goals: 15, assists: 23, matches: 36 },
    detailedStats: {
      passingAccuracy: 90,
      shotsOnTarget: 42,
      tacklesWon: 35,
      possession: 62,
      minutesPlayed: 3100,
      distanceCovered: 410,
      yellowCards: 5,
      redCards: 0,
      formTrend: [
        { match: "vs Arsenal", rating: 9.3 },
        { match: "vs Liverpool", rating: 8.7 },
        { match: "vs Chelsea", rating: 8.5 }
      ],
      heatmap: [
        { zone: "center", value: 95 },
        { zone: "right side", value: 65 },
        { zone: "penalty area", value: 55 }
      ],
      xGPerMatch: 0.45
    },
    image: ""
  },
  {
    id: 4,
    name: "Bukayo Saka",
    team: "Arsenal",
    position: "Right Winger",
    stats: { goals: 22, assists: 15, matches: 38 },
    detailedStats: {
      passingAccuracy: 84,
      shotsOnTarget: 50,
      tacklesWon: 42,
      possession: 52,
      minutesPlayed: 3400,
      distanceCovered: 395,
      yellowCards: 3,
      redCards: 0,
      formTrend: [
        { match: "vs Man City", rating: 7.9 },
        { match: "vs Liverpool", rating: 8.2 },
        { match: "vs Chelsea", rating: 9.0 }
      ],
      heatmap: [
        { zone: "right wing", value: 92 },
        { zone: "penalty area", value: 60 },
        { zone: "center", value: 50 }
      ],
      xGPerMatch: 0.62
    },
    image: ""
  },
  {
    id: 5,
    name: "Harry Kane",
    team: "Bayern Munich",
    position: "Striker",
    stats: { goals: 32, assists: 10, matches: 36 },
    detailedStats: {
      passingAccuracy: 78,
      shotsOnTarget: 70,
      tacklesWon: 18,
      possession: 45,
      minutesPlayed: 3240,
      distanceCovered: 340,
      yellowCards: 4,
      redCards: 0,
      formTrend: [
        { match: "vs Dortmund", rating: 9.2 },
        { match: "vs Leipzig", rating: 8.5 },
        { match: "vs Leverkusen", rating: 7.8 }
      ],
      heatmap: [
        { zone: "penalty area", value: 88 },
        { zone: "center", value: 65 },
        { zone: "deep", value: 40 }
      ],
      xGPerMatch: 0.88
    },
    image: ""
  }
];

// Saved Views (new feature)
interface SavedView {
  id: string;
  name: string;
  entityType: "teams" | "players";
  metric: string;
  playerMetric?: string;
  chartType: "bar" | "line" | "pie" | "scatter";
  selectedIds: number[];
  dateCreated: string;
}

// Player comparison criteria
type ComparisonCriterion = {
  name: string;
  value: string;
  category: string;
};

const playerComparisonCriteria: ComparisonCriterion[] = [
  { name: "Goals per 90", value: "goalsPerMinute", category: "Scoring" },
  { name: "xG per 90", value: "xGPerMatch", category: "Scoring" },
  { name: "Shot Conversion", value: "shotConversion", category: "Scoring" },
  { name: "Passing Accuracy", value: "passingAccuracy", category: "Passing" },
  { name: "Tackles Won", value: "tacklesWon", category: "Defending" },
  { name: "Distance Covered", value: "distanceCovered", category: "Physical" },
  { name: "Form Rating", value: "formRating", category: "Performance" },
];

const Stats = () => {
  // State for chart configuration
  const [chartType, setChartType] = useState<"bar" | "line" | "pie" | "scatter">("bar");
  const [entityType, setEntityType] = useState<"teams" | "players">("teams");
  const [selectedTeams, setSelectedTeams] = useState<string[]>([]);
  const [selectedPlayers, setSelectedPlayers] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [metric, setMetric] = useState<string>("points");
  const [playerMetric, setPlayerMetric] = useState<string>("goals");
  const [compareByList, setCompareByList] = useState<string[]>([]);
  const [seasonFilter, setSeasonFilter] = useState<string>("2023-24");
  const [competitionFilter, setCompetitionFilter] = useState<string>("all");
  
  // New features
  const [isLoadingChart, setIsLoadingChart] = useState(false);
  const [savedViews, setSavedViews] = useState<SavedView[]>([]);
  const [currentViewName, setCurrentViewName] = useState<string>("");
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [scatterMetricX, setScatterMetricX] = useState<string>("goals");
  const [scatterMetricY, setScatterMetricY] = useState<string>("assists");
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [performanceRangeFilter, setPerformanceRangeFilter] = useState<[number, number]>([0, 100]);
  const [useAiSuggestions, setUseAiSuggestions] = useState(false);
  
  // Get unique teams to prevent duplicates
  const teams = useMemo(() => getUniqueTeams(), []);
  
  // Player metrics options
  const playerMetrics = [
    { value: "goals", label: "Goals" },
    { value: "assists", label: "Assists" },
    { value: "passingAccuracy", label: "Passing Accuracy" },
    { value: "shotsOnTarget", label: "Shots on Target" },
    { value: "tacklesWon", label: "Tackles Won" },
    { value: "xGPerMatch", label: "Expected Goals per Match" },
    { value: "minutesPlayed", label: "Minutes Played" },
    { value: "yellowCards", label: "Yellow Cards" },
    { value: "redCards", label: "Red Cards" }
  ];

  // Team metrics options
  const teamMetrics = [
    { value: "points", label: "Points" },
    { value: "wins", label: "Wins" },
    { value: "draws", label: "Draws" },
    { value: "losses", label: "Losses" },
    { value: "goalsFor", label: "Goals For" },
    { value: "goalsAgainst", label: "Goals Against" },
    { value: "goalDifference", label: "Goal Difference" }
  ];

  // Competition filters
  const competitions = [
    { value: "all", label: "All Competitions" },
    { value: "premier-league", label: "Premier League" },
    { value: "la-liga", label: "La Liga" },
    { value: "bundesliga", label: "Bundesliga" },
    { value: "serie-a", label: "Serie A" },
    { value: "ligue-1", label: "Ligue 1" },
    { value: "champions-league", label: "Champions League" }
  ];

  // Season filters
  const seasons = [
    { value: "2023-24", label: "2023-24" },
    { value: "2022-23", label: "2022-23" },
    { value: "2021-22", label: "2021-22" },
    { value: "last-5", label: "Last 5 Matches" }
  ];

  // Simulate ML-generated insights based on the current analysis
  const generateAiInsights = () => {
    setIsLoadingChart(true);
    
    // Simulate ML processing delay
    setTimeout(() => {
      setIsLoadingChart(false);
      
      if (entityType === "teams") {
        // Auto-select teams with interesting patterns
        if (selectedTeams.length === 0) {
          setSelectedTeams(["Manchester City", "Liverpool", "Arsenal"]);
          toast.success("AI Insight", {
            description: "We've identified the top 3 teams with the most interesting performance patterns for your analysis."
          });
        } else {
          toast.info("AI Analysis Complete", {
            description: `Our models found strong correlation between ${metric} and overall league position for the selected teams.`
          });
        }
      } else {
        // Player insights
        if (selectedPlayers.length === 0) {
          setSelectedPlayers([1, 2, 3]);
          toast.success("AI Insight", {
            description: "We've identified 3 players with complementary skill profiles for comparison."
          });
        } else {
          toast.info("AI Analysis Complete", {
            description: `For the selected players, ${playerMetric} is a strong indicator of future performance with 78% predictive accuracy.`
          });
        }
      }
    }, 1500);
  };

  // Handle saving current view
  const handleSaveView = () => {
    if (!currentViewName.trim()) {
      toast.error("Please provide a name for your view");
      return;
    }
    
    const newView: SavedView = {
      id: Date.now().toString(),
      name: currentViewName,
      entityType,
      metric,
      playerMetric,
      chartType,
      selectedIds: entityType === "teams" 
        ? selectedTeams.map(t => teams.find(team => team.name === t)?.id || 0).filter(id => id !== 0)
        : selectedPlayers,
      dateCreated: new Date().toISOString()
    };
    
    setSavedViews([...savedViews, newView]);
    setCurrentViewName("");
    
    toast.success("View Saved", {
      description: `You can quickly access "${currentViewName}" from the saved views section.`
    });
  };
  
  // Load saved view
  const loadSavedView = (view: SavedView) => {
    setEntityType(view.entityType);
    setChartType(view.chartType);
    
    if (view.entityType === "teams") {
      setMetric(view.metric);
      const teamNames = view.selectedIds
        .map(id => teams.find(t => t.id === id)?.name || "")
        .filter(name => name !== "");
      setSelectedTeams(teamNames);
    } else {
      setPlayerMetric(view.playerMetric || "goals");
      setSelectedPlayers(view.selectedIds);
    }
    
    toast.success("View Loaded", {
      description: `"${view.name}" has been loaded successfully.`
    });
  };
  
  // Handle search with memory
  const handleSearch = () => {
    if (searchTerm.trim() && !recentSearches.includes(searchTerm.trim())) {
      setRecentSearches(prev => [searchTerm.trim(), ...prev].slice(0, 5));
    }
  };
  
  // Clear all filters and selections
  const resetAllFilters = () => {
    setSelectedTeams([]);
    setSelectedPlayers([]);
    setSearchTerm("");
    setMetric("points");
    setPlayerMetric("goals");
    setChartType("bar");
    setSeasonFilter("2023-24");
    setCompetitionFilter("all");
    setScatterMetricX("goals");
    setScatterMetricY("assists");
    
    toast.info("All filters reset", {
      description: "Your view has been reset to default settings."
    });
  };
  
  // Generate chart data based on selection
  const generateChartData = () => {
    if (entityType === "teams") {
      // Filter teams by selection or show all if none selected
      const teamsToShow = selectedTeams.length > 0 
        ? teams.filter(team => selectedTeams.includes(team.name))
        : teams.slice(0, 10); // Show top 10 by default
      
      return teamsToShow.map(team => ({
        name: team.name,
        value: team[metric as keyof Team] as number,
        color: team.primaryColor || "#8884d8"
      }));
    } else {
      // Filter players by selection or show all if none selected
      const playersToShow = selectedPlayers.length > 0 
        ? playersData.filter(player => selectedPlayers.includes(player.id))
        : playersData;
      
      if (chartType === "scatter") {
        return playersToShow.map(player => {
          // Handle nested stats and detailedStats properties
          let valueX = 0;
          let valueY = 0;
          
          if (scatterMetricX in player.stats) {
            valueX = player.stats[scatterMetricX as keyof typeof player.stats] as number;
          } else if (scatterMetricX in player.detailedStats) {
            valueX = player.detailedStats[scatterMetricX as keyof typeof player.detailedStats] as number;
          }
          
          if (scatterMetricY in player.stats) {
            valueY = player.stats[scatterMetricY as keyof typeof player.stats] as number;
          } else if (scatterMetricY in player.detailedStats) {
            valueY = player.detailedStats[scatterMetricY as keyof typeof player.detailedStats] as number;
          }
          
          return {
            name: player.name,
            x: valueX,
            y: valueY,
            z: player.stats.matches, // size based on matches played
            team: player.team,
            position: player.position
          };
        });
      } else {
        return playersToShow.map(player => {
          // Handle nested stats and detailedStats properties
          let value = 0;
          if (playerMetric in player.stats) {
            value = player.stats[playerMetric as keyof typeof player.stats] as number;
          } else if (playerMetric in player.detailedStats) {
            value = player.detailedStats[playerMetric as keyof typeof player.detailedStats] as number;
          }
          
          return {
            name: player.name,
            value: value,
            team: player.team
          };
        });
      }
    }
  };

  const handleTeamSelection = (teamName: string) => {
    setSelectedTeams(prev => 
      prev.includes(teamName) 
        ? prev.filter(t => t !== teamName) 
        : [...prev, teamName]
    );
  };

  const handlePlayerSelection = (playerId: number) => {
    setSelectedPlayers(prev => 
      prev.includes(playerId) 
        ? prev.filter(p => p !== playerId) 
        : [...prev, playerId]
    );
  };

  const filteredTeams = teams.filter(team => 
    team.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredPlayers = playersData.filter(player => 
    player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    player.team.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const chartData = generateChartData();
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#d53e4f', '#377eb8', '#4daf4a'];

  const renderChart = () => {
    if (isLoadingChart) {
      return (
        <div className="h-[500px] flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground">Processing data with ML models...</p>
            <p className="text-xs text-muted-foreground mt-1">This may take a moment</p>
          </div>
        </div>
      );
    }
    
    switch (chartType) {
      case "bar":
        return (
          <ResponsiveContainer width="100%" height={500}>
            <RechartsBarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip 
                formatter={(value, name, props) => {
                  return [value, entityType === "players" ? props.payload.team : name];
                }}
              />
              <Legend />
              <Bar 
                dataKey="value" 
                name={entityType === "teams" ? teamMetrics.find(m => m.value === metric)?.label : playerMetrics.find(m => m.value === playerMetric)?.label} 
                fill="#8884d8"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </RechartsBarChart>
          </ResponsiveContainer>
        );
      case "line":
        return (
          <ResponsiveContainer width="100%" height={500}>
            <RechartsLineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip 
                formatter={(value, name, props) => {
                  return [value, entityType === "players" ? props.payload.team : name];
                }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="value" 
                name={entityType === "teams" ? teamMetrics.find(m => m.value === metric)?.label : playerMetrics.find(m => m.value === playerMetric)?.label} 
                stroke="#8884d8" 
                activeDot={{ r: 8 }} 
              />
            </RechartsLineChart>
          </ResponsiveContainer>
        );
      case "pie":
        return (
          <ResponsiveContainer width="100%" height={500}>
            <RechartsPieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={200}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value, name, props) => {
                  return [value, entityType === "players" ? props.payload.team : name];
                }}
              />
              <Legend />
            </RechartsPieChart>
          </ResponsiveContainer>
        );
      case "scatter":
        if (entityType !== "players") {
          return (
            <div className="h-[300px] flex items-center justify-center">
              <p className="text-muted-foreground">Scatter charts are only available for player comparisons.</p>
            </div>
          );
        }
        return (
          <ResponsiveContainer width="100%" height={500}>
            <ScatterChart margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                type="number" 
                dataKey="x" 
                name={playerMetrics.find(m => m.value === scatterMetricX)?.label}
                label={{ value: playerMetrics.find(m => m.value === scatterMetricX)?.label, position: 'bottom', offset: 0 }}
              />
              <YAxis 
                type="number" 
                dataKey="y" 
                name={playerMetrics.find(m => m.value === scatterMetricY)?.label}
                label={{ value: playerMetrics.find(m => m.value === scatterMetricY)?.label, angle: -90, position: 'left' }}
              />
              <ZAxis type="number" dataKey="z" range={[60, 200]} name="Matches" />
              <Tooltip 
                cursor={{ strokeDasharray: '3 3' }}
                formatter={(value, name, props) => {
                  if (name === 'x') return [value, playerMetrics.find(m => m.value === scatterMetricX)?.label];
                  if (name === 'y') return [value, playerMetrics.find(m => m.value === scatterMetricY)?.label];
                  if (name === 'z') return [value, 'Matches'];
                  return [value, name];
                }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-background p-2 border rounded-md shadow-md">
                        <p className="font-medium">{payload[0].payload.name}</p>
                        <p className="text-xs text-muted-foreground">{payload[0].payload.team} • {payload[0].payload.position}</p>
                        <div className="mt-2">
                          <p className="text-xs">
                            {playerMetrics.find(m => m.value === scatterMetricX)?.label}: {payload[0].payload.x}
                          </p>
                          <p className="text-xs">
                            {playerMetrics.find(m => m.value === scatterMetricY)?.label}: {payload[0].payload.y}
                          </p>
                          <p className="text-xs">Matches: {payload[0].payload.z}</p>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend />
              <Scatter
                name="Players"
                data={chartData as any[]}
                fill="#8884d8"
              >
                {chartData.map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        );
    }
  };

  // Generate a small stats card with ML insights
  const renderMLInsights = () => {
    if (entityType === "teams") {
      // ML insights for teams
      return (
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Zap className="h-4 w-4 text-primary" />
              AI-Generated Insights
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <h4 className="font-medium text-sm mb-1">Team Performance Trend</h4>
                <p className="text-sm text-muted-foreground">
                  {selectedTeams.length === 1 ? 
                    `${selectedTeams[0]} has shown a ${Math.random() > 0.5 ? "positive" : "negative"} trend in recent matches, with ${Math.floor(Math.random() * 20) + 60}% probability of maintaining form.` : 
                    "Select a single team to see AI-generated performance trends."}
                </p>
              </div>
              <div className="p-3 bg-primary/10 rounded-lg">
                <h4 className="font-medium text-sm mb-1">Form Analysis</h4>
                <p className="text-sm text-muted-foreground">
                  {selectedTeams.length === 1 ? 
                    `Based on recent performance metrics, ${selectedTeams[0]} is currently in ${Math.random() > 0.5 ? "excellent" : "declining"} form with a ${Math.floor(Math.random() * 20) + 70}% confidence level.` : 
                    "Select a single team to see AI form analysis."}
                </p>
              </div>
              <div className="p-3 bg-primary/10 rounded-lg">
                <h4 className="font-medium text-sm mb-1">Game Pattern Prediction</h4>
                <p className="text-sm text-muted-foreground">
                  {selectedTeams.length === 1 ? 
                    `${selectedTeams[0]} is most effective when playing a ${Math.random() > 0.5 ? "high-pressing" : "counter-attacking"} style against top-table teams.` : 
                    "Select a single team to see predictive game patterns."}
                </p>
              </div>
            </div>
            
            {selectedTeams.length > 1 && (
              <div className="p-4 border rounded-lg mt-4">
                <h4 className="font-medium mb-2">Comparative Analysis</h4>
                <p className="text-sm text-muted-foreground">
                  Based on the selected metric, our ML model identifies {selectedTeams[0]} as having a {Math.floor(Math.random() * 30) + 50}% 
                  advantage over {selectedTeams[1]} in {metric} performance. Key contributing factors include 
                  squad depth, tactical flexibility, and historical performance patterns.
                </p>
              </div>
            )}
            
            <div className="flex justify-end">
              <Button variant="outline" size="sm" className="text-xs" onClick={generateAiInsights}>
                <Zap className="h-3 w-3 mr-1" />
                Generate More Insights
              </Button>
            </div>
          </CardContent>
        </Card>
      );
    } else {
      // ML insights for players
      return (
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Zap className="h-4 w-4 text-primary" /> 
              Player Performance AI Insights
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <h4 className="font-medium text-sm mb-1">Form Analysis</h4>
                <p className="text-sm text-muted-foreground">
                  {selectedPlayers.length === 1 ? 
                    `${playersData.find(p => p.id === selectedPlayers[0])?.name} is currently in ${Math.random() > 0.5 ? "peak" : "inconsistent"} form with a predicted performance rating of ${(Math.random() * 2 + 7).toFixed(1)}/10 for upcoming matches.` : 
                    "Select a single player to see AI-generated form analysis."}
                </p>
              </div>
              <div className="p-3 bg-primary/10 rounded-lg">
                <h4 className="font-medium text-sm mb-1">Performance Prediction</h4>
                <p className="text-sm text-muted-foreground">
                  {selectedPlayers.length === 1 ? 
                    `Based on current form and historical data, ${playersData.find(p => p.id === selectedPlayers[0])?.name} has a ${Math.floor(Math.random() * 40) + 30}% probability of scoring in the next match.` : 
                    "Select a single player to see AI-powered performance predictions."}
                </p>
              </div>
            </div>
            
            {selectedPlayers.length > 0 && (
              <div className="p-4 border rounded-lg mt-4">
                <h4 className="font-medium mb-2">Tactical Fit Analysis</h4>
                <p className="text-sm text-muted-foreground">
                  {selectedPlayers.length === 1 ? 
                    `${playersData.find(p => p.id === selectedPlayers[0])?.name} demonstrates optimal performance in a ${Math.random() > 0.5 ? "possession-based" : "counter-attacking"} system, with particular strength in ${Math.random() > 0.5 ? "creating chances" : "finishing opportunities"}.` : 
                    "Our AI model suggests these players would combine effectively in a high-pressing system with a complementary skill set."
                  }
                </p>
              </div>
            )}
            
            {selectedPlayers.length > 1 && (
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <h4 className="font-medium text-sm mb-1">Comparative Strength</h4>
                  <p className="text-sm text-muted-foreground">
                    When comparing {playersData.find(p => p.id === selectedPlayers[0])?.name} and {playersData.find(p => p.id === selectedPlayers[1])?.name} in terms of {playerMetric}, 
                    our model indicates a {Math.floor(Math.random() * 30) + 50}% statistical advantage for {playersData.find(p => p.id === (Math.random() > 0.5 ? selectedPlayers[0] : selectedPlayers[1]))?.name}.
                  </p>
                </div>
                <div className="p-3 bg-primary/10 rounded-lg">
                  <h4 className="font-medium text-sm mb-1">Partnership Potential</h4>
                  <p className="text-sm text-muted-foreground">
                    These players show a {Math.floor(Math.random() * 30) + 60}% complementary playing style, with particular synergy in 
                    {Math.random() > 0.5 ? " attacking transitions and final third play." : " build-up play and defensive organization."}
                  </p>
                </div>
              </div>
            )}
            
            <div className="flex justify-end">
              <Button variant="outline" size="sm" className="text-xs" onClick={generateAiInsights}>
                <Zap className="h-3 w-3 mr-1" />
                Generate More Insights
              </Button>
            </div>
          </CardContent>
        </Card>
      );
    }
  };

  // New feature: Download data
  const handleDownloadData = () => {
    // In a real app, this would create and download a CSV/Excel file
    toast.success("Data export started", {
      description: "Your statistics data is being prepared for download."
    });
    
    // Simulate download completion
    setTimeout(() => {
      toast.success("Download complete", {
        description: "Statistics data has been downloaded to your device."
      });
    }, 1500);
  };
  
  // New feature: Share analysis
  const handleShareAnalysis = () => {
    // In a real app, this would generate a shareable link
    toast.success("Shareable link created", {
      description: "A link to this analysis has been copied to your clipboard."
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto p-6 pt-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold">Statistics</h1>
              <p className="text-muted-foreground">Analyze and compare performance data with AI-powered insights</p>
            </div>
            
            <div className="flex items-center space-x-2">
              {/* Quick actions */}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon" onClick={handleDownloadData}>
                      <Download className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Export data</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon" onClick={handleShareAnalysis}>
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Share analysis</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    Filters
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <DropdownMenuLabel>Filter Options</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem>
                      <Select value={seasonFilter} onValueChange={setSeasonFilter}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select season" />
                        </SelectTrigger>
                        <SelectContent>
                          {seasons.map(season => (
                            <SelectItem key={season.value} value={season.value}>
                              {season.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Select value={competitionFilter} onValueChange={setCompetitionFilter}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select competition" />
                        </SelectTrigger>
                        <SelectContent>
                          {competitions.map(competition => (
                            <SelectItem key={competition.value} value={competition.value}>
                              {competition.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}>
                      {showAdvancedFilters ? "Hide advanced filters" : "Show advanced filters"}
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
              
              <Select
                value={chartType}
                onValueChange={(value: "bar" | "line" | "pie" | "scatter") => setChartType(value)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select chart type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bar">
                    <div className="flex items-center gap-2">
                      <BarChart className="h-4 w-4" />
                      <span>Bar Chart</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="line">
                    <div className="flex items-center gap-2">
                      <LineChart className="h-4 w-4" />
                      <span>Line Chart</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="pie">
                    <div className="flex items-center gap-2">
                      <PieChart className="h-4 w-4" />
                      <span>Pie Chart</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="scatter">
                    <div className="flex items-center gap-2">
                      <PlusCircle className="h-4 w-4" />
                      <span>Scatter Plot</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              
              <Button variant="ghost" onClick={resetAllFilters}>
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset
              </Button>
            </div>
          </div>
          
          {showAdvancedFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-muted/50 p-4 rounded-lg"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label className="text-sm mb-2 block">Date Range</Label>
                  <div className="flex items-center gap-2">
                    <Input type="date" className="w-full" />
                    <span>to</span>
                    <Input type="date" className="w-full" />
                  </div>
                </div>
                <div>
                  <Label className="text-sm mb-2 block">Advanced Matching</Label>
                  <div className="flex items-center gap-2">
                    <Select defaultValue="all">
                      <SelectTrigger>
                        <SelectValue placeholder="Match type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Matches</SelectItem>
                        <SelectItem value="home">Home Only</SelectItem>
                        <SelectItem value="away">Away Only</SelectItem>
                        <SelectItem value="wins">Wins Only</SelectItem>
                        <SelectItem value="losses">Losses Only</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label className="text-sm mb-2 block">AI Assistance</Label>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="ai-suggestions" 
                      checked={useAiSuggestions}
                      onCheckedChange={(checked) => setUseAiSuggestions(!!checked)}
                    />
                    <Label htmlFor="ai-suggestions">Enable AI-suggested filters</Label>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 flex justify-end">
                <Button variant="outline" size="sm" onClick={() => setShowAdvancedFilters(false)}>
                  Close Advanced Filters
                </Button>
              </div>
            </motion.div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Sidebar with filters */}
            <div className="md:col-span-1 space-y-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Settings2 className="h-4 w-4" />
                    Data Selection
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>I want to analyze:</Label>
                    <div className="flex space-x-2">
                      <Button
                        variant={entityType === "teams" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setEntityType("teams")}
                        className="flex items-center gap-2"
                      >
                        <Building2 className="h-4 w-4" />
                        Teams
                      </Button>
                      <Button
                        variant={entityType === "players" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setEntityType("players")}
                        className="flex items-center gap-2"
                      >
                        <Users className="h-4 w-4" />
                        Players
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Metric to display:</Label>
                    {entityType === "teams" ? (
                      <Select value={metric} onValueChange={setMetric}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select metric" />
                        </SelectTrigger>
                        <SelectContent>
                          {teamMetrics.map(tm => (
                            <SelectItem key={tm.value} value={tm.value}>
                              {tm.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      chartType !== "scatter" ? (
                        <Select value={playerMetric} onValueChange={setPlayerMetric}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select metric" />
                          </SelectTrigger>
                          <SelectContent>
                            {playerMetrics.map(pm => (
                              <SelectItem key={pm.value} value={pm.value}>
                                {pm.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <div className="space-y-2">
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <Label className="text-xs">X-Axis Metric:</Label>
                              <Select value={scatterMetricX} onValueChange={setScatterMetricX}>
                                <SelectTrigger>
                                  <SelectValue placeholder="X-Axis" />
                                </SelectTrigger>
                                <SelectContent>
                                  {playerMetrics.map(pm => (
                                    <SelectItem key={pm.value} value={pm.value}>
                                      {pm.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label className="text-xs">Y-Axis Metric:</Label>
                              <Select value={scatterMetricY} onValueChange={setScatterMetricY}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Y-Axis" />
                                </SelectTrigger>
                                <SelectContent>
                                  {playerMetrics.map(pm => (
                                    <SelectItem key={pm.value} value={pm.value}>
                                      {pm.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground">Point size represents matches played</p>
                        </div>
                      )
                    )}
                  </div>
                  
                  {/* Search & Selector */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Select {entityType === "teams" ? "teams" : "players"}:</Label>
                      {(entityType === "teams" ? selectedTeams.length > 0 : selectedPlayers.length > 0) && (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => entityType === "teams" ? setSelectedTeams([]) : setSelectedPlayers([])}
                        >
                          Clear
                        </Button>
                      )}
                    </div>
                    
                    <div className="flex gap-2">
                      <Input 
                        placeholder={`Search ${entityType}...`} 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="mb-2"
                      />
                      <Button size="sm" onClick={handleSearch}>
                        <Search className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    {/* Recent searches */}
                    {recentSearches.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-2">
                        {recentSearches.slice(0, 3).map((search, i) => (
                          <Badge
                            key={i}
                            variant="outline"
                            className="cursor-pointer text-xs"
                            onClick={() => setSearchTerm(search)}
                          >
                            <History className="h-3 w-3 mr-1" />
                            {search}
                          </Badge>
                        ))}
                      </div>
                    )}
                    
                    <div className="max-h-[300px] overflow-y-auto border rounded-md p-2">
                      {entityType === "teams" ? (
                        filteredTeams.map(team => (
                          <div key={team.id} className="flex items-center space-x-2 py-1">
                            <Checkbox 
                              id={`team-${team.id}`} 
                              checked={selectedTeams.includes(team.name)}
                              onCheckedChange={() => handleTeamSelection(team.name)}
                            />
                            <Label htmlFor={`team-${team.id}`} className="flex-1 cursor-pointer flex items-center gap-2">
                              {team.badge && (
                                <img src={team.badge} alt={team.name} className="w-4 h-4 object-contain" />
                              )}
                              <div>
                                <span>{team.name}</span>
                                {team.leagueAlsoIn && (
                                  <span className="text-xs text-muted-foreground block">
                                    Also in {team.leagueAlsoIn}
                                  </span>
                                )}
                              </div>
                            </Label>
                          </div>
                        ))
                      ) : (
                        filteredPlayers.map(player => (
                          <div key={player.id} className="flex items-center space-x-2 py-1">
                            <Checkbox 
                              id={`player-${player.id}`} 
                              checked={selectedPlayers.includes(player.id)}
                              onCheckedChange={() => handlePlayerSelection(player.id)}
                            />
                            <Label htmlFor={`player-${player.id}`} className="flex-1 cursor-pointer">
                              <span>{player.name}</span>
                              <span className="text-xs text-muted-foreground block">{player.team} • {player.position}</span>
                            </Label>
                          </div>
                        ))
                      )}
                      
                      {(entityType === "teams" ? filteredTeams.length === 0 : filteredPlayers.length === 0) && (
                        <p className="text-sm text-muted-foreground text-center py-4">
                          No {entityType} found matching "{searchTerm}"
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Saved Views */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Save className="h-4 w-4" />
                    Saved Views
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {savedViews.length === 0 ? (
                    <div className="text-center py-4">
                      <p className="text-sm text-muted-foreground">Save your current view for quick access later</p>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="mt-2"
                        onClick={() => setCurrentViewName(`${entityType === "teams" ? "Team" : "Player"} Analysis ${new Date().toLocaleDateString()}`)}
                      >
                        <Save className="h-4 w-4 mr-2" />
                        Save Current View
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {savedViews.map(view => (
                        <div key={view.id} className="flex items-center justify-between p-2 hover:bg-muted rounded-md cursor-pointer" onClick={() => loadSavedView(view)}>
                          <div>
                            <p className="text-sm font-medium">{view.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {view.entityType === "teams" ? "Teams" : "Players"} • 
                              {new Date(view.dateCreated).toLocaleDateString()}
                            </p>
                          </div>
                          <Badge variant="outline">
                            {view.chartType}
                          </Badge>
                        </div>
                      ))}
                      
                      <Button variant="ghost" size="sm" className="w-full mt-2">
                        <Save className="h-4 w-4 mr-2" />
                        Save Current View
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              {currentViewName && (
                <AlertDialog>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Save Current View</AlertDialogTitle>
                      <AlertDialogDescription>
                        Enter a name to save your current configuration for future reference.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <Input 
                      placeholder="My Analysis View" 
                      value={currentViewName}
                      onChange={(e) => setCurrentViewName(e.target.value)}
                    />
                    <AlertDialogFooter>
                      <AlertDialogCancel onClick={() => setCurrentViewName("")}>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleSaveView}>Save View</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
              
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Active Filters</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline" className="flex items-center gap-1">
                        Season: {seasons.find(s => s.value === seasonFilter)?.label}
                      </Badge>
                      <Badge variant="outline" className="flex items-center gap-1">
                        Competition: {competitions.find(c => c.value === competitionFilter)?.label}
                      </Badge>
                      <Badge variant="outline" className="flex items-center gap-1">
                        Type: {entityType === "teams" ? "Teams" : "Players"}
                      </Badge>
                      <Badge variant="outline" className="flex items-center gap-1">
                        Chart: {chartType.charAt(0).toUpperCase() + chartType.slice(1)}
                      </Badge>
                      <Badge variant="outline" className="flex items-center gap-1">
                        Metric: {entityType === "teams" 
                          ? teamMetrics.find(m => m.value === metric)?.label 
                          : playerMetrics.find(m => m.value === playerMetric)?.label}
                      </Badge>
                      {entityType === "teams" && selectedTeams.length > 0 && (
                        <Badge variant="outline" className="flex items-center gap-1">
                          Teams: {selectedTeams.length} selected
                        </Badge>
                      )}
                      {entityType === "players" && selectedPlayers.length > 0 && (
                        <Badge variant="outline" className="flex items-center gap-1">
                          Players: {selectedPlayers.length} selected
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Main content */}
            <div className="md:col-span-3 space-y-6">
              <Card className="w-full">
                <CardHeader>
                  <CardTitle>
                    {entityType === "teams" 
                      ? `Team ${teamMetrics.find(m => m.value === metric)?.label} Comparison` 
                      : chartType === "scatter"
                        ? `Player Comparison: ${playerMetrics.find(m => m.value === scatterMetricX)?.label} vs ${playerMetrics.find(m => m.value === scatterMetricY)?.label}`
                        : `Player ${playerMetrics.find(m => m.value === playerMetric)?.label} Comparison`}
                  </CardTitle>
                  {chartType === "scatter" && entityType === "players" && (
                    <CardDescription>
                      Bubble size represents number of matches played
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  {renderChart()}
                </CardContent>
              </Card>
              
              {renderMLInsights()}
              
              {/* Additional context-aware stats */}
              {entityType === "teams" && selectedTeams.length === 1 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Season Performance Breakdown for {selectedTeams[0]}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-4 bg-secondary/20 rounded-lg text-center">
                        <h4 className="text-lg font-medium">Home Form</h4>
                        <div className="text-3xl font-bold mt-2">{Math.floor(Math.random() * 10) + 5}-{Math.floor(Math.random() * 5) + 2}-{Math.floor(Math.random() * 5)}</div>
                        <p className="text-sm text-muted-foreground">W-D-L</p>
                      </div>
                      <div className="p-4 bg-secondary/20 rounded-lg text-center">
                        <h4 className="text-lg font-medium">Away Form</h4>
                        <div className="text-3xl font-bold mt-2">{Math.floor(Math.random() * 8) + 3}-{Math.floor(Math.random() * 5) + 2}-{Math.floor(Math.random() * 7) + 2}</div>
                        <p className="text-sm text-muted-foreground">W-D-L</p>
                      </div>
                      <div className="p-4 bg-secondary/20 rounded-lg text-center">
                        <h4 className="text-lg font-medium">Goal Conversion</h4>
                        <div className="text-3xl font-bold mt-2">{(Math.random() * 10 + 10).toFixed(1)}%</div>
                        <p className="text-sm text-muted-foreground">Shots to Goals Ratio</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
              
              {entityType === "players" && selectedPlayers.length === 1 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Performance Breakdown for {playersData.find(p => p.id === selectedPlayers[0])?.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-4 bg-secondary/20 rounded-lg text-center">
                        <h4 className="text-lg font-medium">Form Rating</h4>
                        <div className="text-3xl font-bold mt-2">
                          {(playersData.find(p => p.id === selectedPlayers[0])?.detailedStats.formTrend.reduce((sum, match) => sum + match.rating, 0) || 0) / 
                          (playersData.find(p => p.id === selectedPlayers[0])?.detailedStats.formTrend.length || 1)}
                          /10
                        </div>
                        <p className="text-sm text-muted-foreground">ML-Generated Rating</p>
                      </div>
                      <div className="p-4 bg-secondary/20 rounded-lg text-center">
                        <h4 className="text-lg font-medium">Goal Probability</h4>
                        <div className="text-3xl font-bold mt-2">
                          {Math.min(30 + (playersData.find(p => p.id === selectedPlayers[0])?.stats.goals || 0) * 5, 90)}%
                        </div>
                        <p className="text-sm text-muted-foreground">Next Match Prediction</p>
                      </div>
                      <div className="p-4 bg-secondary/20 rounded-lg text-center">
                        <h4 className="text-lg font-medium">Playing Style</h4>
                        <div className="text-xl font-medium mt-2">
                          {playersData.find(p => p.id === selectedPlayers[0])?.position.includes("Forward") || 
                           playersData.find(p => p.id === selectedPlayers[0])?.position.includes("Striker") 
                            ? "Target Man" 
                            : playersData.find(p => p.id === selectedPlayers[0])?.position.includes("Midfielder")
                              ? "Playmaker"
                              : "Ball-Playing Defender"}
                        </div>
                        <p className="text-sm text-muted-foreground">AI Classification</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
              
              {/* Keyboard shortcuts help */}
              <div className="text-xs text-muted-foreground text-center mt-8">
                <p>Keyboard shortcuts: <span className="px-1.5 py-0.5 bg-muted rounded border">S</span> Save view, <span className="px-1.5 py-0.5 bg-muted rounded border">R</span> Reset filters, <span className="px-1.5 py-0.5 bg-muted rounded border">?</span> Show help</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Stats;
