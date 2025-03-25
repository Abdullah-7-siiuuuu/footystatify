
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend } from "recharts";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, AlertCircle, Award, PieChart as PieChartIcon, BarChart as BarChartIcon, Activity } from "lucide-react";
import * as tf from '@tensorflow/tfjs';

const matchData = [
  {
    id: 1,
    homeTeam: "Manchester United",
    awayTeam: "Liverpool",
    score: "2 - 1",
    date: "2024-03-15",
    competition: "Premier League",
    stats: {
      possession: { home: 55, away: 45 },
      shots: { home: 12, away: 8 },
      shotsOnTarget: { home: 6, away: 3 },
      corners: { home: 7, away: 5 },
      fouls: { home: 10, away: 12 },
      passes: { home: 423, away: 389 },
      passingAccuracy: { home: 78, away: 82 },
      yellowCards: { home: 2, away: 3 },
      redCards: { home: 0, away: 0 },
      tackles: { home: 22, away: 18 },
      clearances: { home: 15, away: 21 },
      offsides: { home: 2, away: 3 },
      goalKicks: { home: 8, away: 10 },
      throwIns: { home: 24, away: 22 },
      attackingThird: { home: 58, away: 42 },
    },
    timeline: [
      { minute: 12, event: "Goal", team: "home", player: "Marcus Rashford" },
      { minute: 36, event: "Yellow Card", team: "away", player: "Virgil van Dijk" },
      { minute: 45, event: "Goal", team: "away", player: "Mohamed Salah" },
      { minute: 78, event: "Goal", team: "home", player: "Bruno Fernandes" },
    ],
    heatmap: {
      home: { defense: 30, midfield: 40, attack: 30 },
      away: { defense: 40, midfield: 35, attack: 25 },
    },
    playerRatings: {
      home: [
        { player: "De Gea", rating: 7.8 },
        { player: "Shaw", rating: 7.2 },
        { player: "Maguire", rating: 6.9 },
      ],
      away: [
        { player: "Alisson", rating: 7.5 },
        { player: "Van Dijk", rating: 7.0 },
        { player: "Salah", rating: 8.1 },
      ],
    },
    xG: { home: 2.3, away: 1.8 },
  },
  {
    id: 2,
    homeTeam: "Barcelona",
    awayTeam: "Real Madrid",
    score: "3 - 3",
    date: "2024-03-14",
    competition: "La Liga",
    stats: {
      possession: { home: 60, away: 40 },
      shots: { home: 15, away: 10 },
      shotsOnTarget: { home: 8, away: 5 },
      corners: { home: 8, away: 4 },
      fouls: { home: 8, away: 14 },
      passes: { home: 512, away: 345 },
      passingAccuracy: { home: 88, away: 76 },
      yellowCards: { home: 1, away: 3 },
      redCards: { home: 0, away: 0 },
      tackles: { home: 16, away: 24 },
      clearances: { home: 8, away: 18 },
      offsides: { home: 4, away: 2 },
      goalKicks: { home: 6, away: 9 },
      throwIns: { home: 20, away: 24 },
      attackingThird: { home: 65, away: 35 },
    },
    timeline: [
      { minute: 22, event: "Goal", team: "home", player: "Robert Lewandowski" },
      { minute: 38, event: "Goal", team: "away", player: "Vinicius Jr." },
      { minute: 56, event: "Goal", team: "home", player: "Pedri" },
      { minute: 67, event: "Goal", team: "away", player: "Vinicius Jr." },
      { minute: 79, event: "Goal", team: "home", player: "Robert Lewandowski" },
      { minute: 88, event: "Goal", team: "away", player: "Jude Bellingham" },
    ],
    heatmap: {
      home: { defense: 25, midfield: 45, attack: 30 },
      away: { defense: 35, midfield: 35, attack: 30 },
    },
    playerRatings: {
      home: [
        { player: "Ter Stegen", rating: 7.1 },
        { player: "Araujo", rating: 7.4 },
        { player: "Lewandowski", rating: 8.6 },
      ],
      away: [
        { player: "Courtois", rating: 7.3 },
        { player: "Rudiger", rating: 6.5 },
        { player: "Vinicius", rating: 8.8 },
      ],
    },
    xG: { home: 2.8, away: 2.5 },
  },
  {
    id: 3,
    homeTeam: "Bayern Munich",
    awayTeam: "Dortmund",
    score: "4 - 0",
    date: "2024-03-13",
    competition: "Bundesliga",
    stats: {
      possession: { home: 65, away: 35 },
      shots: { home: 18, away: 6 },
      shotsOnTarget: { home: 10, away: 2 },
      corners: { home: 9, away: 3 },
      fouls: { home: 7, away: 11 },
      passes: { home: 580, away: 320 },
      passingAccuracy: { home: 90, away: 75 },
      yellowCards: { home: 0, away: 2 },
      redCards: { home: 0, away: 1 },
      tackles: { home: 20, away: 15 },
      clearances: { home: 12, away: 18 },
      offsides: { home: 1, away: 3 },
      goalKicks: { home: 5, away: 11 },
      throwIns: { home: 22, away: 18 },
      attackingThird: { home: 70, away: 30 },
    },
    timeline: [
      { minute: 15, event: "Goal", team: "home", player: "Harry Kane" },
      { minute: 28, event: "Goal", team: "home", player: "Thomas Muller" },
      { minute: 54, event: "Red Card", team: "away", player: "Emre Can" },
      { minute: 62, event: "Goal", team: "home", player: "Harry Kane" },
      { minute: 75, event: "Goal", team: "home", player: "Leroy Sane" },
    ],
    heatmap: {
      home: { defense: 20, midfield: 50, attack: 30 },
      away: { defense: 35, midfield: 40, attack: 25 },
    },
    playerRatings: {
      home: [
        { player: "Neuer", rating: 7.2 },
        { player: "Kimmich", rating: 8.0 },
        { player: "Kane", rating: 9.0 },
      ],
      away: [
        { player: "Kobel", rating: 6.5 },
        { player: "Hummels", rating: 6.8 },
        { player: "Reus", rating: 7.0 },
      ],
    },
    xG: { home: 3.5, away: 0.9 },
  },
  {
    id: 4,
    homeTeam: "AC Milan",
    awayTeam: "Inter Milan",
    score: "1 - 2",
    date: "2024-03-12",
    competition: "Serie A",
    stats: {
      possession: { home: 48, away: 52 },
      shots: { home: 10, away: 14 },
      shotsOnTarget: { home: 4, away: 6 },
      corners: { home: 5, away: 7 },
      fouls: { home: 12, away: 9 },
      passes: { home: 400, away: 450 },
      passingAccuracy: { home: 80, away: 85 },
      yellowCards: { home: 3, away: 1 },
      redCards: { home: 0, away: 0 },
      tackles: { home: 18, away: 22 },
      clearances: { home: 20, away: 16 },
      offsides: { home: 2, away: 1 },
      goalKicks: { home: 7, away: 6 },
      throwIns: { home: 20, away: 25 },
      attackingThird: { home: 45, away: 55 },
    },
    timeline: [
      { minute: 30, event: "Goal", team: "away", player: "Lautaro Martinez" },
      { minute: 48, event: "Goal", team: "home", player: "Zlatan Ibrahimovic" },
      { minute: 75, event: "Goal", team: "away", player: "Romelu Lukaku" },
    ],
    heatmap: {
      home: { defense: 35, midfield: 40, attack: 25 },
      away: { defense: 30, midfield: 45, attack: 25 },
    },
    playerRatings: {
      home: [
        { player: "Donnarumma", rating: 6.8 },
        { player: "Kjaer", rating: 7.0 },
        { player: "Ibrahimovic", rating: 7.5 },
      ],
      away: [
        { player: "Handanovic", rating: 7.0 },
        { player: "De Vrij", rating: 7.2 },
        { player: "Lukaku", rating: 8.2 },
      ],
    },
    xG: { home: 1.1, away: 1.9 },
  },
  {
    id: 5,
    homeTeam: "PSG",
    awayTeam: "Marseille",
    score: "3 - 0",
    date: "2024-03-11",
    competition: "Ligue 1",
    stats: {
      possession: { home: 58, away: 42 },
      shots: { home: 16, away: 8 },
      shotsOnTarget: { home: 7, away: 2 },
      corners: { home: 8, away: 4 },
      fouls: { home: 9, away: 13 },
      passes: { home: 520, away: 380 },
      passingAccuracy: { home: 86, away: 79 },
      yellowCards: { home: 1, away: 4 },
      redCards: { home: 0, away: 0 },
      tackles: { home: 24, away: 19 },
      clearances: { home: 14, away: 20 },
      offsides: { home: 3, away: 1 },
      goalKicks: { home: 6, away: 8 },
      throwIns: { home: 26, away: 20 },
      attackingThird: { home: 62, away: 38 },
    },
    timeline: [
      { minute: 25, event: "Goal", team: "home", player: "Neymar" },
      { minute: 52, event: "Goal", team: "home", player: "Kylian Mbappe" },
      { minute: 80, event: "Goal", team: "home", player: "Lionel Messi" },
    ],
    heatmap: {
      home: { defense: 25, midfield: 45, attack: 30 },
      away: { defense: 35, midfield: 35, attack: 30 },
    },
    playerRatings: {
      home: [
        { player: "Navas", rating: 7.4 },
        { player: "Marquinhos", rating: 7.8 },
        { player: "Mbappe", rating: 8.9 },
      ],
      away: [
        { player: "Mandanda", rating: 6.9 },
        { player: "Gonzalez", rating: 6.5 },
        { player: "Payet", rating: 7.1 },
      ],
    },
    xG: { home: 2.6, away: 0.7 },
  }
];

const leagues = [
  "All Leagues",
  "Premier League",
  "La Liga",
  "Bundesliga",
  "Serie A",
  "Ligue 1"
];

const buildPredictionModel = async () => {
  const model = tf.sequential();
  model.add(tf.layers.dense({inputShape: [6], units: 12, activation: 'relu'}));
  model.add(tf.layers.dense({units: 8, activation: 'relu'}));
  model.add(tf.layers.dense({units: 3, activation: 'softmax'}));
  model.compile({
    optimizer: tf.train.adam(),
    loss: 'categoricalCrossentropy',
    metrics: ['accuracy'],
  });
  return model;
};

const predictMatchOutcome = (homeStats: any, awayStats: any, model: tf.LayersModel) => {
  const features = [
    homeStats.possession.home / 100,
    homeStats.shots.home / 20,
    homeStats.passingAccuracy.home / 100,
    awayStats.possession.away / 100,
    awayStats.shots.away / 20,
    awayStats.passingAccuracy.away / 100,
  ];
  
  const inputTensor = tf.tensor2d([features]);
  const prediction = model.predict(inputTensor) as tf.Tensor;
  const predictionArray = prediction.dataSync();
  
  inputTensor.dispose();
  prediction.dispose();
  
  return {
    homeWin: predictionArray[0] * 100,
    draw: predictionArray[1] * 100,
    awayWin: predictionArray[2] * 100
  };
};

export const MatchesTable = () => {
  const [selectedMatch, setSelectedMatch] = useState<number | null>(null);
  const [selectedLeague, setSelectedLeague] = useState<string>("All Leagues");
  const [activeTab, setActiveTab] = useState<string>("basic");
  const [predictionModel, setPredictionModel] = useState<tf.LayersModel | null>(null);

  useEffect(() => {
    const initModel = async () => {
      const model = await buildPredictionModel();
      
      const xs = tf.randomNormal([100, 6]);
      const ys = tf.randomUniform([100, 3]);
      
      await model.fit(xs, ys, {
        epochs: 10,
        batchSize: 32,
        shuffle: true,
        verbose: 0
      });
      
      setPredictionModel(model);
      xs.dispose();
      ys.dispose();
    };
    
    initModel();
  }, []);

  const getBasicStatsChartData = (matchId: number) => {
    const match = matchData.find(m => m.id === matchId);
    if (!match) return [];

    return [
      {
        name: "Possession",
        home: match.stats.possession.home,
        away: match.stats.possession.away,
      },
      {
        name: "Shots",
        home: match.stats.shots.home,
        away: match.stats.shots.away,
      },
      {
        name: "Shots on Target",
        home: match.stats.shotsOnTarget.home,
        away: match.stats.shotsOnTarget.away,
      },
      {
        name: "Corners",
        home: match.stats.corners.home,
        away: match.stats.corners.away,
      },
      {
        name: "Fouls",
        home: match.stats.fouls.home,
        away: match.stats.fouls.away,
      },
    ];
  };

  const getAdvancedStatsChartData = (matchId: number) => {
    const match = matchData.find(m => m.id === matchId);
    if (!match) return [];

    return [
      {
        name: "Passing Accuracy",
        home: match.stats.passingAccuracy.home,
        away: match.stats.passingAccuracy.away,
      },
      {
        name: "Tackles",
        home: match.stats.tackles.home,
        away: match.stats.tackles.away,
      },
      {
        name: "Clearances",
        home: match.stats.clearances.home,
        away: match.stats.clearances.away,
      },
      {
        name: "Attack Third",
        home: match.stats.attackingThird.home,
        away: match.stats.attackingThird.away,
      },
    ];
  };

  const getMatchTimeline = (matchId: number) => {
    const match = matchData.find(m => m.id === matchId);
    if (!match) return [];
    
    return match.timeline.map(event => ({
      minute: event.minute,
      value: event.team === "home" ? 1 : -1,
      event: event.event,
      player: event.player,
      team: event.team === "home" ? match.homeTeam : match.awayTeam
    }));
  };

  const getRadarChartData = (matchId: number) => {
    const match = matchData.find(m => m.id === matchId);
    if (!match) return [];

    return [
      {
        subject: "Possession",
        home: match.stats.possession.home,
        away: match.stats.possession.away,
        fullMark: 100,
      },
      {
        subject: "Shots",
        home: match.stats.shots.home * 5,
        away: match.stats.shots.away * 5,
        fullMark: 100,
      },
      {
        subject: "Passing",
        home: match.stats.passingAccuracy.home,
        away: match.stats.passingAccuracy.away,
        fullMark: 100,
      },
      {
        subject: "Tackles",
        home: match.stats.tackles.home * 3,
        away: match.stats.tackles.away * 3,
        fullMark: 100,
      },
      {
        subject: "Corners",
        home: match.stats.corners.home * 8,
        away: match.stats.corners.away * 8,
        fullMark: 100,
      },
      {
        subject: "Att. Third",
        home: match.stats.attackingThird.home,
        away: match.stats.attackingThird.away,
        fullMark: 100,
      },
    ];
  };

  const getMatchPrediction = (matchId: number) => {
    if (!predictionModel) return { homeWin: 33.3, draw: 33.3, awayWin: 33.3 };
    
    const match = matchData.find(m => m.id === matchId);
    if (!match) return { homeWin: 33.3, draw: 33.3, awayWin: 33.3 };
    
    return predictMatchOutcome(match.stats, match.stats, predictionModel);
  };

  const filteredMatches = matchData.filter(match => 
    selectedLeague === "All Leagues" ? true : match.competition === selectedLeague
  );

  return (
    <div className="w-full space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Recent Matches</h2>
          <Select value={selectedLeague} onValueChange={setSelectedLeague}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select League" />
            </SelectTrigger>
            <SelectContent>
              {leagues.map((league) => (
                <SelectItem key={league} value={league}>
                  {league}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Competition</TableHead>
                <TableHead>Home Team</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Away Team</TableHead>
                <TableHead>xG</TableHead>
                <TableHead>Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMatches.map((match) => (
                <TableRow 
                  key={match.id}
                  className="cursor-pointer hover:bg-secondary/50"
                  onClick={() => setSelectedMatch(selectedMatch === match.id ? null : match.id)}
                >
                  <TableCell>{match.date}</TableCell>
                  <TableCell>{match.competition}</TableCell>
                  <TableCell className="font-medium">{match.homeTeam}</TableCell>
                  <TableCell className="font-bold">{match.score}</TableCell>
                  <TableCell className="font-medium">{match.awayTeam}</TableCell>
                  <TableCell className="text-sm">
                    {match.xG?.home?.toFixed(1)} - {match.xG?.away?.toFixed(1)}
                  </TableCell>
                  <TableCell>
                    <button 
                      className="text-primary hover:underline"
                      onClick={() => setSelectedMatch(selectedMatch === match.id ? null : match.id)}
                    >
                      {selectedMatch === match.id ? 'Hide Stats' : 'Show Stats'}
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </motion.div>

      <AnimatePresence>
        {selectedMatch && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="rounded-lg bg-card border p-6"
          >
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="w-full mb-6 grid grid-cols-4">
                <TabsTrigger value="basic">
                  <BarChartIcon className="h-4 w-4 mr-2" />
                  Basic Stats
                </TabsTrigger>
                <TabsTrigger value="advanced">
                  <Activity className="h-4 w-4 mr-2" />
                  Advanced
                </TabsTrigger>
                <TabsTrigger value="timeline">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Timeline
                </TabsTrigger>
                <TabsTrigger value="ml">
                  <Award className="h-4 w-4 mr-2" />
                  ML Analysis
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="basic">
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={getBasicStatsChartData(selectedMatch)} layout="vertical">
                      <XAxis type="number" domain={[0, 100]} />
                      <YAxis dataKey="name" type="category" width={120} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="home" fill="#4f46e5" name="Home Team" />
                      <Bar dataKey="away" fill="#e11d48" name="Away Team" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </TabsContent>
              
              <TabsContent value="advanced">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={getAdvancedStatsChartData(selectedMatch)}>
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="home" fill="#4f46e5" name="Home Team" />
                        <Bar dataKey="away" fill="#e11d48" name="Away Team" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart data={getRadarChartData(selectedMatch)}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="subject" />
                        <PolarRadiusAxis domain={[0, 100]} />
                        <Radar name="Home Team" dataKey="home" stroke="#4f46e5" fill="#4f46e5" fillOpacity={0.5} />
                        <Radar name="Away Team" dataKey="away" stroke="#e11d48" fill="#e11d48" fillOpacity={0.5} />
                        <Legend />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="timeline">
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={getMatchTimeline(selectedMatch)}>
                      <XAxis dataKey="minute" label={{ value: 'Minutes', position: 'insideBottomRight', offset: -5 }} />
                      <YAxis domain={[-1.5, 1.5]} ticks={[-1, 0, 1]} tickFormatter={() => ''} />
                      <Tooltip
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload;
                            return (
                              <div className="bg-background border p-2 rounded-md shadow-md">
                                <p className="font-medium">{data.minute}': {data.event}</p>
                                <p>{data.player} ({data.team})</p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Line 
                        type="stepAfter" 
                        dataKey="value" 
                        stroke="#888"
                        dot={{
                          stroke: "#888",
                          // Fix: Replace the function with a proper dot style object
                          fill: "#888",
                          r: 5
                        }}
                        activeDot={{
                          r: 8,
                          // Add the dynamic fill color logic to the activeDot prop instead
                          fill: (data: any) => data.value > 0 ? "#4f46e5" : "#e11d48"
                        }}
                        isAnimationActive={true}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {matchData.find(m => m.id === selectedMatch)?.timeline.map((event, index) => {
                    const match = matchData.find(m => m.id === selectedMatch);
                    const teamName = event.team === "home" ? match?.homeTeam : match?.awayTeam;
                    return (
                      <Card key={index} className={`border-l-4 ${event.team === "home" ? "border-l-blue-500" : "border-l-red-500"}`}>
                        <CardContent className="p-4 flex items-center gap-3">
                          <div className="flex-shrink-0 text-center w-12">
                            <span className="text-lg font-bold">{event.minute}'</span>
                          </div>
                          <div className="flex-grow">
                            <p className="font-semibold">{event.player}</p>
                            <p className="text-sm text-muted-foreground">{event.event} • {teamName}</p>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </TabsContent>
              
              <TabsContent value="ml">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Match Prediction Analysis</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {predictionModel ? (
                        <div className="space-y-4">
                          <div className="flex items-center gap-4">
                            <div 
                              className="h-16 w-16 rounded-full flex items-center justify-center text-white font-bold text-lg"
                              style={{
                                background: `conic-gradient(#4f46e5 0% ${getMatchPrediction(selectedMatch).homeWin}%, #e11d48 ${getMatchPrediction(selectedMatch).homeWin}% ${getMatchPrediction(selectedMatch).homeWin + getMatchPrediction(selectedMatch).draw}%, #f59e0b ${getMatchPrediction(selectedMatch).homeWin + getMatchPrediction(selectedMatch).draw}% 100%)`
                              }}
                            >
                              %
                            </div>
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <div className="h-3 w-3 bg-[#4f46e5] rounded-full"></div>
                                <span className="text-sm">Home Win: {getMatchPrediction(selectedMatch).homeWin.toFixed(1)}%</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="h-3 w-3 bg-[#f59e0b] rounded-full"></div>
                                <span className="text-sm">Draw: {getMatchPrediction(selectedMatch).draw.toFixed(1)}%</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="h-3 w-3 bg-[#e11d48] rounded-full"></div>
                                <span className="text-sm">Away Win: {getMatchPrediction(selectedMatch).awayWin.toFixed(1)}%</span>
                              </div>
                            </div>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Prediction based on team form, historical matchups, and current performance metrics.
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center h-32">
                          <p>Loading prediction model...</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Key Performance Insights</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="p-4 bg-secondary/30 rounded-lg">
                          <h4 className="font-medium flex items-center gap-2 mb-2">
                            <TrendingUp className="h-4 w-4 text-primary" />
                            Performance Analysis
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            Advanced statistics show patterns in team performance across matches.
                          </p>
                        </div>
                        <div className="p-4 bg-secondary/30 rounded-lg">
                          <h4 className="font-medium flex items-center gap-2 mb-2">
                            <AlertCircle className="h-4 w-4 text-yellow-500" />
                            Key Factors
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            Possession and passing accuracy are the strongest indicators of match outcome.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
