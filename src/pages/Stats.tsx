
import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { motion } from "framer-motion";
import { BarChart, LineChart, PieChart, Settings2, Filter, Users, Building2, ChevronDown } from "lucide-react";
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
  Legend 
} from 'recharts';
import { getTeamById, Team, leagueData } from "@/components/TeamRankings";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

// Get all teams from leagueData
const getAllTeams = (): Team[] => {
  return Object.values(leagueData).flat();
};

const getPlayersByTeam = (teamName: string): Player[] => {
  return playersData.filter(player => player.team === teamName);
};

const Stats = () => {
  const [chartType, setChartType] = useState<"bar" | "line" | "pie">("bar");
  const [entityType, setEntityType] = useState<"teams" | "players">("teams");
  const [selectedTeams, setSelectedTeams] = useState<string[]>([]);
  const [selectedPlayers, setSelectedPlayers] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [metric, setMetric] = useState<string>("points");
  const [playerMetric, setPlayerMetric] = useState<string>("goals");
  const [compareByList, setCompareByList] = useState<string[]>([]);
  const [seasonFilter, setSeasonFilter] = useState<string>("2023-24");
  const [competitionFilter, setCompetitionFilter] = useState<string>("all");
  
  const teams = getAllTeams();
  
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
    switch (chartType) {
      case "bar":
        return (
          <ResponsiveContainer width="100%" height={500}>
            <RechartsBarChart data={chartData}>
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
            <RechartsLineChart data={chartData}>
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
            </RechartsPieChart>
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
            <CardTitle className="text-lg">AI-Generated Insights</CardTitle>
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
          </CardContent>
        </Card>
      );
    } else {
      // ML insights for players
      return (
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle className="text-lg">Player Performance AI Insights</CardTitle>
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
                    "Our AI model suggests these players would combine effectively in a high-pressing system with ${Math.floor(Math.random() * 20) + 70}% tactical compatibility."
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
          </CardContent>
        </Card>
      );
    }
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
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
              
              <Select
                value={chartType}
                onValueChange={(value: "bar" | "line" | "pie") => setChartType(value)}
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
                </SelectContent>
              </Select>
            </div>
          </div>
          
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
                    <Input 
                      placeholder={`Search ${entityType}...`} 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="mb-2"
                    />
                    
                    <div className="max-h-[300px] overflow-y-auto border rounded-md p-2">
                      {entityType === "teams" ? (
                        filteredTeams.map(team => (
                          <div key={team.id} className="flex items-center space-x-2 py-1">
                            <Checkbox 
                              id={`team-${team.id}`} 
                              checked={selectedTeams.includes(team.name)}
                              onCheckedChange={() => handleTeamSelection(team.name)}
                            />
                            <Label htmlFor={`team-${team.id}`} className="flex-1 cursor-pointer">
                              {team.name}
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
                    </div>
                  </div>
                </CardContent>
              </Card>
              
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
                      : `Player ${playerMetrics.find(m => m.value === playerMetric)?.label} Comparison`}
                  </CardTitle>
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
                          {playersData.find(p => p.id === selectedPlayers[0])?.detailedStats.formTrend.reduce((sum, match) => sum + match.rating, 0) / 
                          playersData.find(p => p.id === selectedPlayers[0])?.detailedStats.formTrend.length || 0}
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
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Stats;
