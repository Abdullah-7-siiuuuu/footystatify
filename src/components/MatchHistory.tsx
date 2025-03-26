
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Calendar, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface HistoricalMatch {
  id: number;
  opponent: string;
  date: string;
  competition: string;
  venue: string;
  result: 'W' | 'D' | 'L';
  score: string;
  scorers: string[];
  teamStats: {
    possession: number;
    shots: number;
    shotsOnTarget: number;
    corners: number;
    fouls: number;
  };
  opponentStats: {
    possession: number;
    shots: number;
    shotsOnTarget: number;
    corners: number;
    fouls: number;
  };
}

// Mock match history data by team
const matchHistoryByTeam: Record<number, HistoricalMatch[]> = {
  1: [ // Manchester City
    { 
      id: 1001, 
      opponent: "Arsenal", 
      date: "2024-03-20", 
      competition: "Premier League", 
      venue: "Etihad Stadium", 
      result: "W", 
      score: "3-1", 
      scorers: ["Haaland (2)", "De Bruyne"],
      teamStats: { possession: 58, shots: 14, shotsOnTarget: 7, corners: 8, fouls: 9 },
      opponentStats: { possession: 42, shots: 8, shotsOnTarget: 3, corners: 5, fouls: 12 }
    },
    { 
      id: 1002, 
      opponent: "Liverpool", 
      date: "2024-03-10", 
      competition: "Premier League", 
      venue: "Anfield", 
      result: "D", 
      score: "1-1", 
      scorers: ["Foden"],
      teamStats: { possession: 49, shots: 10, shotsOnTarget: 5, corners: 6, fouls: 10 },
      opponentStats: { possession: 51, shots: 12, shotsOnTarget: 4, corners: 7, fouls: 8 }
    },
    { 
      id: 1003, 
      opponent: "Inter Milan", 
      date: "2024-03-05", 
      competition: "Champions League", 
      venue: "Etihad Stadium", 
      result: "W", 
      score: "2-0", 
      scorers: ["Foden", "Haaland"],
      teamStats: { possession: 64, shots: 16, shotsOnTarget: 8, corners: 9, fouls: 7 },
      opponentStats: { possession: 36, shots: 7, shotsOnTarget: 2, corners: 3, fouls: 14 }
    },
    { 
      id: 1004, 
      opponent: "Newcastle United", 
      date: "2024-02-25", 
      competition: "Premier League", 
      venue: "St. James' Park", 
      result: "L", 
      score: "1-2", 
      scorers: ["Rodri"],
      teamStats: { possession: 60, shots: 15, shotsOnTarget: 6, corners: 8, fouls: 9 },
      opponentStats: { possession: 40, shots: 9, shotsOnTarget: 4, corners: 4, fouls: 13 }
    },
    { 
      id: 1005, 
      opponent: "Burnley", 
      date: "2024-02-15", 
      competition: "Premier League", 
      venue: "Etihad Stadium", 
      result: "W", 
      score: "4-0", 
      scorers: ["Haaland (3)", "Gündogan"],
      teamStats: { possession: 75, shots: 22, shotsOnTarget: 12, corners: 11, fouls: 6 },
      opponentStats: { possession: 25, shots: 3, shotsOnTarget: 1, corners: 1, fouls: 11 }
    },
    { 
      id: 1006, 
      opponent: "Tottenham", 
      date: "2024-02-05", 
      competition: "FA Cup", 
      venue: "Tottenham Hotspur Stadium", 
      result: "W", 
      score: "2-1", 
      scorers: ["Foden", "Bernardo Silva"],
      teamStats: { possession: 62, shots: 13, shotsOnTarget: 8, corners: 7, fouls: 8 },
      opponentStats: { possession: 38, shots: 9, shotsOnTarget: 2, corners: 5, fouls: 10 }
    }
  ],
  2: [ // Liverpool
    { 
      id: 2001, 
      opponent: "Manchester City", 
      date: "2024-03-10", 
      competition: "Premier League", 
      venue: "Anfield", 
      result: "D", 
      score: "1-1", 
      scorers: ["Salah"],
      teamStats: { possession: 51, shots: 12, shotsOnTarget: 4, corners: 7, fouls: 8 },
      opponentStats: { possession: 49, shots: 10, shotsOnTarget: 5, corners: 6, fouls: 10 }
    },
    { 
      id: 2002, 
      opponent: "Chelsea", 
      date: "2024-02-25", 
      competition: "Premier League", 
      venue: "Stamford Bridge", 
      result: "W", 
      score: "2-1", 
      scorers: ["Salah", "Nunez"],
      teamStats: { possession: 55, shots: 14, shotsOnTarget: 6, corners: 8, fouls: 9 },
      opponentStats: { possession: 45, shots: 10, shotsOnTarget: 3, corners: 5, fouls: 11 }
    },
    { 
      id: 2003, 
      opponent: "Everton", 
      date: "2024-02-15", 
      competition: "Premier League", 
      venue: "Anfield", 
      result: "W", 
      score: "3-0", 
      scorers: ["Salah", "Diaz", "Gakpo"],
      teamStats: { possession: 68, shots: 18, shotsOnTarget: 10, corners: 9, fouls: 7 },
      opponentStats: { possession: 32, shots: 4, shotsOnTarget: 1, corners: 3, fouls: 13 }
    },
    { 
      id: 2004, 
      opponent: "Brentford", 
      date: "2024-02-05", 
      competition: "Premier League", 
      venue: "Gtech Community Stadium", 
      result: "D", 
      score: "1-1", 
      scorers: ["Mac Allister"],
      teamStats: { possession: 65, shots: 15, shotsOnTarget: 5, corners: 8, fouls: 6 },
      opponentStats: { possession: 35, shots: 7, shotsOnTarget: 3, corners: 3, fouls: 14 }
    }
  ],
  3: [ // Arsenal
    { 
      id: 3001, 
      opponent: "Manchester City", 
      date: "2024-03-20", 
      competition: "Premier League", 
      venue: "Etihad Stadium", 
      result: "L", 
      score: "1-3", 
      scorers: ["Saka"],
      teamStats: { possession: 42, shots: 8, shotsOnTarget: 3, corners: 5, fouls: 12 },
      opponentStats: { possession: 58, shots: 14, shotsOnTarget: 7, corners: 8, fouls: 9 }
    },
    { 
      id: 3002, 
      opponent: "West Ham", 
      date: "2024-03-05", 
      competition: "Premier League", 
      venue: "Emirates Stadium", 
      result: "W", 
      score: "4-1", 
      scorers: ["Saka (2)", "Havertz", "Rice"],
      teamStats: { possession: 70, shots: 20, shotsOnTarget: 9, corners: 10, fouls: 7 },
      opponentStats: { possession: 30, shots: 5, shotsOnTarget: 2, corners: 2, fouls: 12 }
    }
  ]
};

// Add some generic matches for other teams
[4, 5, 6, 7, 8, 9, 10].forEach(teamId => {
  matchHistoryByTeam[teamId] = [
    { 
      id: teamId * 1000 + 1, 
      opponent: "Opponent 1", 
      date: "2024-03-18", 
      competition: "League", 
      venue: "Home", 
      result: "W", 
      score: "2-0", 
      scorers: ["Player 1", "Player 5"],
      teamStats: { possession: 60, shots: 15, shotsOnTarget: 7, corners: 8, fouls: 9 },
      opponentStats: { possession: 40, shots: 8, shotsOnTarget: 3, corners: 5, fouls: 12 }
    },
    { 
      id: teamId * 1000 + 2, 
      opponent: "Opponent 2", 
      date: "2024-03-05", 
      competition: "League", 
      venue: "Away", 
      result: "L", 
      score: "1-3", 
      scorers: ["Player 9"],
      teamStats: { possession: 45, shots: 10, shotsOnTarget: 4, corners: 6, fouls: 10 },
      opponentStats: { possession: 55, shots: 14, shotsOnTarget: 8, corners: 7, fouls: 8 }
    },
    { 
      id: teamId * 1000 + 3, 
      opponent: "Opponent 3", 
      date: "2024-02-22", 
      competition: "Cup", 
      venue: "Home", 
      result: "D", 
      score: "2-2", 
      scorers: ["Player 5", "Player 11"],
      teamStats: { possession: 52, shots: 12, shotsOnTarget: 6, corners: 7, fouls: 8 },
      opponentStats: { possession: 48, shots: 11, shotsOnTarget: 5, corners: 6, fouls: 10 }
    }
  ];
});

export const MatchHistory = ({ teamId }: { teamId: number }) => {
  const [activeTab, setActiveTab] = useState<string>("all");
  const [selectedMatch, setSelectedMatch] = useState<number | null>(null);
  
  // Get match history for this team
  const matches = matchHistoryByTeam[teamId] || [];
  
  // Filter matches based on selected tab
  const filteredMatches = matches.filter(match => {
    if (activeTab === "all") return true;
    if (activeTab === "wins") return match.result === "W";
    if (activeTab === "draws") return match.result === "D";
    if (activeTab === "losses") return match.result === "L";
    return true;
  });
  
  // Get result badge
  const getResultBadge = (result: string) => {
    switch(result) {
      case 'W': 
        return <Badge variant="default" className="bg-green-500">WIN</Badge>;
      case 'D': 
        return <Badge variant="secondary" className="bg-yellow-500">DRAW</Badge>;
      case 'L': 
        return <Badge variant="destructive">LOSS</Badge>;
      default:
        return <Badge variant="default">{result}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-xl flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Match History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-4">
            <TabsList>
              <TabsTrigger value="all">All Matches</TabsTrigger>
              <TabsTrigger value="wins">Wins</TabsTrigger>
              <TabsTrigger value="draws">Draws</TabsTrigger>
              <TabsTrigger value="losses">Losses</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Competition</TableHead>
                  <TableHead>Opponent</TableHead>
                  <TableHead>Venue</TableHead>
                  <TableHead>Result</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Scorers</TableHead>
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
                    <TableCell className="font-medium">{match.opponent}</TableCell>
                    <TableCell>{match.venue}</TableCell>
                    <TableCell>{getResultBadge(match.result)}</TableCell>
                    <TableCell className="font-bold">{match.score}</TableCell>
                    <TableCell>{match.scorers.join(", ")}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          {selectedMatch && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-6 p-4 bg-card border rounded-lg"
            >
              {(() => {
                const match = matches.find(m => m.id === selectedMatch);
                if (!match) return null;
                
                return (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center justify-between">
                      Match Details
                      <Badge>{match.competition}</Badge>
                    </h3>
                    
                    <div className="flex justify-between items-center">
                      <div className="text-center">
                        <p className="text-lg font-medium">Home Team</p>
                        <p className="text-3xl font-bold">{match.venue === "Home" ? "Your Team" : match.opponent}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-medium">Score</p>
                        <p className="text-3xl font-bold">{match.score}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-medium">Away Team</p>
                        <p className="text-3xl font-bold">{match.venue === "Away" ? "Your Team" : match.opponent}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-5 gap-4 bg-background/50 p-4 rounded-lg">
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">Possession</p>
                        <div className="flex items-center justify-center space-x-2">
                          <span className="font-semibold">{match.teamStats.possession}%</span>
                          <ArrowRight className="h-4 w-4 text-muted-foreground" />
                          <span className="font-semibold">{match.opponentStats.possession}%</span>
                        </div>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">Shots</p>
                        <div className="flex items-center justify-center space-x-2">
                          <span className="font-semibold">{match.teamStats.shots}</span>
                          <ArrowRight className="h-4 w-4 text-muted-foreground" />
                          <span className="font-semibold">{match.opponentStats.shots}</span>
                        </div>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">On Target</p>
                        <div className="flex items-center justify-center space-x-2">
                          <span className="font-semibold">{match.teamStats.shotsOnTarget}</span>
                          <ArrowRight className="h-4 w-4 text-muted-foreground" />
                          <span className="font-semibold">{match.opponentStats.shotsOnTarget}</span>
                        </div>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">Corners</p>
                        <div className="flex items-center justify-center space-x-2">
                          <span className="font-semibold">{match.teamStats.corners}</span>
                          <ArrowRight className="h-4 w-4 text-muted-foreground" />
                          <span className="font-semibold">{match.opponentStats.corners}</span>
                        </div>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">Fouls</p>
                        <div className="flex items-center justify-center space-x-2">
                          <span className="font-semibold">{match.teamStats.fouls}</span>
                          <ArrowRight className="h-4 w-4 text-muted-foreground" />
                          <span className="font-semibold">{match.opponentStats.fouls}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </motion.div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
