
import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Trophy, Activity, Calendar, Users } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell
} from "recharts";
import { getTeamById, Team, leagueData } from "@/components/TeamRankings";

const TeamDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  
  const teamId = id ? parseInt(id) : 0;
  const team = getTeamById(teamId);
  
  if (!team) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto p-6 pt-24 text-center">
          <h1 className="text-2xl font-bold mb-4">Team not found</h1>
          <Button 
            onClick={() => navigate('/teams')}
            variant="outline"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Teams
          </Button>
        </div>
      </div>
    );
  }

  // Find the league this team belongs to
  const teamLeague = Object.entries(leagueData).find(([_, teams]) => 
    teams.some(t => t.id === teamId)
  )?.[0] || "";

  // Create form data (last 5 matches)
  const formData = [
    { match: "vs Liverpool", result: "W", score: "2-1" },
    { match: "vs Arsenal", result: "D", score: "1-1" },
    { match: "vs Chelsea", result: "W", score: "3-0" },
    { match: "vs Man City", result: "L", score: "0-2" },
    { match: "vs Tottenham", result: "W", score: "2-0" }
  ];

  // Create goal distribution data
  const goalDistributionData = [
    { name: "Home", value: team.goalsFor * 0.6 },
    { name: "Away", value: team.goalsFor * 0.4 }
  ];

  // Create season progress data
  const seasonProgressData = [
    { gameweek: 1, points: 3 },
    { gameweek: 2, points: 6 },
    { gameweek: 3, points: 7 },
    { gameweek: 4, points: 10 },
    { gameweek: 5, points: 13 },
    { gameweek: 6, points: 14 },
    { gameweek: 7, points: 17 },
    { gameweek: 8, points: 20 },
    { gameweek: 9, points: 21 },
    { gameweek: 10, points: 24 },
    { gameweek: 11, points: 27 },
    { gameweek: 12, points: 30 },
    { gameweek: 13, points: 31 },
    { gameweek: 14, points: 34 },
    { gameweek: 15, points: 37 },
    { gameweek: 16, points: 38 },
    { gameweek: 17, points: 39 },
    { gameweek: 18, points: 42 },
    { gameweek: 19, points: 45 },
    { gameweek: 20, points: 48 },
    { gameweek: 21, points: 51 },
    { gameweek: 22, points: 52 },
    { gameweek: 23, points: 55 },
    { gameweek: 24, points: 56 },
    { gameweek: 25, points: 57 },
    { gameweek: 26, points: 60 },
    { gameweek: 27, points: 61 },
    { gameweek: 28, points: 61 },
    { gameweek: 29, points: team.points }
  ];

  // Create comparison data for team vs league average
  const comparisonData = [
    { name: "Goals Scored", team: team.goalsFor, average: 48 },
    { name: "Goals Conceded", team: team.goalsAgainst, average: 40 },
    { name: "Wins", team: team.wins, average: 15 },
    { name: "Draws", team: team.draws, average: 8 },
    { name: "Losses", team: team.losses, average: 6 }
  ];

  // Colors for the PieChart
  const COLORS = ['#4f46e5', '#e11d48'];

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
              onClick={() => navigate('/teams')}
              variant="ghost"
              className="mb-2"
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Teams
            </Button>
            <h1 className="text-4xl font-bold">{team.name}</h1>
            <p className="text-muted-foreground">{teamLeague} • Position: {team.position}</p>
          </div>
          
          <div className="flex items-center bg-primary/10 rounded-lg p-3">
            <Trophy className="h-8 w-8 text-primary mr-3" />
            <div>
              <p className="text-sm text-muted-foreground">Points</p>
              <p className="text-3xl font-bold">{team.points}</p>
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full grid grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="stats">Statistics</TabsTrigger>
            <TabsTrigger value="form">Form</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Played</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{team.played}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Win-Draw-Loss</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{team.wins}-{team.draws}-{team.losses}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Goals</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{team.goalsFor}-{team.goalsAgainst}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Goal Difference</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{team.goalDifference > 0 ? `+${team.goalDifference}` : team.goalDifference}</div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Season Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={seasonProgressData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="gameweek" label={{ value: 'Gameweek', position: 'insideBottomRight', offset: -5 }} />
                      <YAxis label={{ value: 'Points', angle: -90, position: 'insideLeft' }} />
                      <Tooltip />
                      <Line type="monotone" dataKey="points" stroke="#4f46e5" activeDot={{ r: 8 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Form</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {formData.map((match, idx) => (
                      <div key={idx} className="flex items-center justify-between border-b pb-2">
                        <div className="text-sm">{match.match}</div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">{match.score}</span>
                          <div className={`h-6 w-6 rounded-full flex items-center justify-center text-white font-medium ${
                            match.result === 'W' ? 'bg-green-500' : 
                            match.result === 'D' ? 'bg-yellow-500' : 
                            'bg-red-500'
                          }`}>
                            {match.result}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Goal Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={goalDistributionData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {goalDistributionData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="stats" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Team vs League Average</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={comparisonData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar name={team.name} dataKey="team" fill="#4f46e5" />
                      <Bar name="League Average" dataKey="average" fill="#e11d48" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center">
                    <Trophy className="h-4 w-4 mr-2" />
                    Win Rate
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{((team.wins / team.played) * 100).toFixed(1)}%</div>
                  <p className="text-xs text-muted-foreground">{team.wins} wins from {team.played} games</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center">
                    <Activity className="h-4 w-4 mr-2" />
                    Goals Per Game
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{(team.goalsFor / team.played).toFixed(2)}</div>
                  <p className="text-xs text-muted-foreground">{team.goalsFor} goals in {team.played} games</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center">
                    <Users className="h-4 w-4 mr-2" />
                    Clean Sheets
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{Math.round(team.wins * 0.4)}</div>
                  <p className="text-xs text-muted-foreground">
                    {(Math.round(team.wins * 0.4) / team.played * 100).toFixed(1)}% of matches
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="form" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Results</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {[...Array(5)].map((_, idx) => (
                    <div key={idx} className="border rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-muted-foreground">
                          {format(subDays(new Date(), (idx + 1) * 7), 'MMM dd, yyyy')}
                        </span>
                        <Badge variant={idx % 3 === 0 ? "default" : idx % 3 === 1 ? "secondary" : "destructive"}>
                          {idx % 3 === 0 ? "Win" : idx % 3 === 1 ? "Draw" : "Loss"}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center font-medium">
                        <span>{team.name}</span>
                        <span className="text-xl font-bold px-3">
                          {idx % 3 === 0 ? "2 - 0" : idx % 3 === 1 ? "1 - 1" : "0 - 2"}
                        </span>
                        <span>{["Chelsea", "Arsenal", "Tottenham", "Newcastle", "Brighton"][idx]}</span>
                      </div>
                      <div className="mt-2 text-sm text-muted-foreground">
                        <p className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2" />
                          {["Old Trafford", "Emirates Stadium", "Tottenham Hotspur Stadium", "St. James Park", "Amex Stadium"][idx]}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
};

export default TeamDetails;

// Helper function to generate formatted date strings
function format(date: Date, formatString: string): string {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const day = date.getDate().toString().padStart(2, '0');
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  
  return `${month} ${day}, ${year}`;
}

// Helper function to subtract days from a date
function subDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(date.getDate() - days);
  return result;
}
