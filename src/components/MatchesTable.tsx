import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { useState } from "react";
import { motion } from "framer-motion";

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
      fouls: { home: 10, away: 12 }
    }
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
      fouls: { home: 8, away: 14 }
    }
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
      fouls: { home: 7, away: 11 }
    }
  },
];

export const MatchesTable = () => {
  const [selectedMatch, setSelectedMatch] = useState<number | null>(null);

  const getStatsChartData = (matchId: number) => {
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

  return (
    <div className="w-full space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl font-bold mb-4">Recent Matches</h2>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Competition</TableHead>
                <TableHead>Home Team</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Away Team</TableHead>
                <TableHead>Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {matchData.map((match) => (
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

      {selectedMatch && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="p-4 rounded-lg bg-secondary/30"
        >
          <h3 className="text-xl font-semibold mb-4">Match Statistics</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={getStatsChartData(selectedMatch)} layout="vertical">
                <XAxis type="number" domain={[0, 100]} />
                <YAxis dataKey="name" type="category" width={120} />
                <Tooltip />
                <Bar dataKey="home" fill="#4f46e5" name="Home Team" />
                <Bar dataKey="away" fill="#e11d48" name="Away Team" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      )}
    </div>
  );
};