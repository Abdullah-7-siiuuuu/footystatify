
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Calendar, Calendar as CalendarIcon, Trophy, PieChart } from "lucide-react";
import { motion } from "framer-motion";
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, Cell } from "recharts";

interface UpcomingMatch {
  id: number;
  opponent: string;
  date: string;
  competition: string;
  venue: string;
  ticketStatus: "Available" | "Limited" | "Sold Out";
  tvChannel: string;
  prediction: {
    win: number;
    draw: number;
    loss: number;
    score: string;
  };
  headToHead: {
    wins: number;
    draws: number;
    losses: number;
    lastFive: ("W" | "D" | "L")[];
  };
}

// Mock upcoming matches data by team
const upcomingMatchesByTeam: Record<number, UpcomingMatch[]> = {
  1: [ // Manchester City
    { 
      id: 101, 
      opponent: "Chelsea", 
      date: "2024-04-02", 
      competition: "Premier League", 
      venue: "Stamford Bridge", 
      ticketStatus: "Limited", 
      tvChannel: "Sky Sports",
      prediction: {
        win: 65,
        draw: 25,
        loss: 10,
        score: "2-1"
      },
      headToHead: {
        wins: 8,
        draws: 2,
        losses: 4,
        lastFive: ["W", "W", "D", "L", "W"]
      }
    },
    { 
      id: 102, 
      opponent: "Real Madrid", 
      date: "2024-04-09", 
      competition: "Champions League", 
      venue: "Santiago Bernabéu", 
      ticketStatus: "Limited", 
      tvChannel: "BT Sport",
      prediction: {
        win: 45,
        draw: 30,
        loss: 25,
        score: "1-1"
      },
      headToHead: {
        wins: 3,
        draws: 1,
        losses: 4,
        lastFive: ["L", "W", "L", "D", "L"]
      }
    },
    { 
      id: 103, 
      opponent: "Wolves", 
      date: "2024-04-13", 
      competition: "Premier League", 
      venue: "Etihad Stadium", 
      ticketStatus: "Available", 
      tvChannel: "Sky Sports",
      prediction: {
        win: 82,
        draw: 12,
        loss: 6,
        score: "3-0"
      },
      headToHead: {
        wins: 9,
        draws: 2,
        losses: 1,
        lastFive: ["W", "W", "W", "D", "W"]
      }
    },
    { 
      id: 104, 
      opponent: "Real Madrid", 
      date: "2024-04-17", 
      competition: "Champions League", 
      venue: "Etihad Stadium", 
      ticketStatus: "Sold Out", 
      tvChannel: "BT Sport",
      prediction: {
        win: 55,
        draw: 25,
        loss: 20,
        score: "2-1"
      },
      headToHead: {
        wins: 3,
        draws: 1,
        losses: 4,
        lastFive: ["L", "W", "L", "D", "L"]
      }
    },
    { 
      id: 105, 
      opponent: "Fulham", 
      date: "2024-04-20", 
      competition: "Premier League", 
      venue: "Craven Cottage", 
      ticketStatus: "Available", 
      tvChannel: "Amazon Prime",
      prediction: {
        win: 70,
        draw: 20,
        loss: 10,
        score: "2-0"
      },
      headToHead: {
        wins: 11,
        draws: 3,
        losses: 2,
        lastFive: ["W", "W", "W", "D", "W"]
      }
    }
  ],
  2: [ // Liverpool
    { 
      id: 201, 
      opponent: "Aston Villa", 
      date: "2024-04-01", 
      competition: "Premier League", 
      venue: "Villa Park", 
      ticketStatus: "Limited", 
      tvChannel: "Sky Sports",
      prediction: {
        win: 60,
        draw: 25,
        loss: 15,
        score: "2-1"
      },
      headToHead: {
        wins: 12,
        draws: 4,
        losses: 5,
        lastFive: ["W", "W", "L", "W", "D"]
      }
    },
    { 
      id: 202, 
      opponent: "Brighton", 
      date: "2024-04-14", 
      competition: "Premier League", 
      venue: "Anfield", 
      ticketStatus: "Available", 
      tvChannel: "BT Sport",
      prediction: {
        win: 75,
        draw: 15,
        loss: 10,
        score: "3-1"
      },
      headToHead: {
        wins: 8,
        draws: 3,
        losses: 2,
        lastFive: ["W", "W", "D", "W", "W"]
      }
    }
  ],
  3: [ // Arsenal
    { 
      id: 301, 
      opponent: "Bournemouth", 
      date: "2024-04-04", 
      competition: "Premier League", 
      venue: "Emirates Stadium", 
      ticketStatus: "Available", 
      tvChannel: "Sky Sports",
      prediction: {
        win: 80,
        draw: 15,
        loss: 5,
        score: "3-0"
      },
      headToHead: {
        wins: 9,
        draws: 1,
        losses: 1,
        lastFive: ["W", "W", "D", "W", "W"]
      }
    }
  ]
};

// Add some generic upcoming matches for other teams
[4, 5, 6, 7, 8, 9, 10].forEach(teamId => {
  upcomingMatchesByTeam[teamId] = [
    { 
      id: teamId * 100 + 1, 
      opponent: "Opponent 1", 
      date: "2024-04-05", 
      competition: "League", 
      venue: "Home", 
      ticketStatus: "Available", 
      tvChannel: "Sports Channel",
      prediction: {
        win: 55,
        draw: 25,
        loss: 20,
        score: "2-1"
      },
      headToHead: {
        wins: 5,
        draws: 3,
        losses: 4,
        lastFive: ["W", "L", "D", "W", "L"]
      }
    },
    { 
      id: teamId * 100 + 2, 
      opponent: "Opponent 2", 
      date: "2024-04-18", 
      competition: "League", 
      venue: "Away", 
      ticketStatus: "Limited", 
      tvChannel: "Sports Channel",
      prediction: {
        win: 40,
        draw: 30,
        loss: 30,
        score: "1-1"
      },
      headToHead: {
        wins: 4,
        draws: 4,
        losses: 4,
        lastFive: ["D", "W", "L", "D", "L"]
      }
    }
  ];
});

export const UpcomingGames = ({ teamId }: { teamId: number }) => {
  const [selectedMatch, setSelectedMatch] = useState<number | null>(null);
  
  // Get upcoming matches for this team
  const matches = upcomingMatchesByTeam[teamId] || [];
  
  // Get ticket status badge
  const getTicketStatusBadge = (status: string) => {
    switch(status) {
      case 'Available': 
        return <Badge variant="default" className="bg-green-500">Available</Badge>;
      case 'Limited': 
        return <Badge variant="secondary" className="bg-yellow-500">Limited</Badge>;
      case 'Sold Out': 
        return <Badge variant="destructive">Sold Out</Badge>;
      default:
        return <Badge variant="default">{status}</Badge>;
    }
  };
  
  // Get result badge for head-to-head
  const getResultBadge = (result: "W" | "D" | "L") => {
    switch(result) {
      case 'W': 
        return <Badge variant="default" className="bg-green-500 w-8 h-8 flex items-center justify-center rounded-full">W</Badge>;
      case 'D': 
        return <Badge variant="secondary" className="bg-yellow-500 w-8 h-8 flex items-center justify-center rounded-full">D</Badge>;
      case 'L': 
        return <Badge variant="destructive" className="w-8 h-8 flex items-center justify-center rounded-full">L</Badge>;
      default:
        return <Badge variant="default" className="w-8 h-8 flex items-center justify-center rounded-full">{result}</Badge>;
    }
  };

  // Create prediction chart data
  const getPredictionData = (match: UpcomingMatch) => {
    return [
      { name: 'Win', value: match.prediction.win, fill: '#22c55e' },
      { name: 'Draw', value: match.prediction.draw, fill: '#eab308' },
      { name: 'Loss', value: match.prediction.loss, fill: '#ef4444' }
    ];
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-xl flex items-center gap-2">
            <CalendarIcon className="h-5 w-5 text-primary" />
            Upcoming Fixtures
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Competition</TableHead>
                  <TableHead>Opponent</TableHead>
                  <TableHead>Venue</TableHead>
                  <TableHead>Tickets</TableHead>
                  <TableHead>TV</TableHead>
                  <TableHead>Prediction</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {matches.map((match) => (
                  <TableRow 
                    key={match.id} 
                    className="cursor-pointer hover:bg-secondary/50"
                    onClick={() => setSelectedMatch(selectedMatch === match.id ? null : match.id)}
                  >
                    <TableCell>{match.date}</TableCell>
                    <TableCell>{match.competition}</TableCell>
                    <TableCell className="font-medium">{match.opponent}</TableCell>
                    <TableCell>{match.venue}</TableCell>
                    <TableCell>{getTicketStatusBadge(match.ticketStatus)}</TableCell>
                    <TableCell>{match.tvChannel}</TableCell>
                    <TableCell className="font-bold">{match.prediction.win}% Win</TableCell>
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
                  <div className="space-y-6">
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="w-full md:w-1/2">
                        <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
                          <PieChart className="h-5 w-5 text-primary" />
                          Match Prediction
                        </h3>
                        
                        <div className="bg-background/50 p-4 rounded-lg space-y-4">
                          <div className="flex justify-center">
                            <div className="h-[200px] w-[300px]">
                              <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={getPredictionData(match)} layout="vertical">
                                  <XAxis type="number" domain={[0, 100]} />
                                  <YAxis dataKey="name" type="category" width={50} />
                                  <Tooltip 
                                    formatter={(value: number) => [`${value}%`, 'Probability']}
                                  />
                                  <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                                    {getPredictionData(match).map((entry, index) => (
                                      <Cell key={`cell-${index}`} fill={entry.fill} />
                                    ))}
                                  </Bar>
                                </BarChart>
                              </ResponsiveContainer>
                            </div>
                          </div>
                          
                          <div className="text-center">
                            <p className="text-sm text-muted-foreground mb-1">Most Likely Score</p>
                            <p className="text-2xl font-bold">{match.prediction.score}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="w-full md:w-1/2">
                        <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
                          <Trophy className="h-5 w-5 text-primary" />
                          Head-to-Head Record
                        </h3>
                        
                        <div className="bg-background/50 p-4 rounded-lg space-y-4">
                          <div className="grid grid-cols-3 gap-4 text-center">
                            <div>
                              <p className="text-sm text-muted-foreground">Wins</p>
                              <p className="text-2xl font-bold text-green-600">{match.headToHead.wins}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Draws</p>
                              <p className="text-2xl font-bold text-yellow-500">{match.headToHead.draws}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Losses</p>
                              <p className="text-2xl font-bold text-red-500">{match.headToHead.losses}</p>
                            </div>
                          </div>
                          
                          <div className="mt-4">
                            <p className="text-sm text-muted-foreground mb-2">Last 5 Meetings</p>
                            <div className="flex gap-2 justify-center">
                              {match.headToHead.lastFive.map((result, idx) => (
                                <div key={idx}>
                                  {getResultBadge(result)}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-center mt-2 p-3 bg-primary/10 rounded-lg">
                      <p className="text-sm">
                        <span className="font-semibold">Key Players to Watch:</span> Our model predicts high impact from both teams' star performers in this fixture.
                      </p>
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
