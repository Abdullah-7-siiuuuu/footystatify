
import { Trophy } from "lucide-react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";

// Updated to include more detailed stats
const leagueData = {
  "Premier League": [
    { id: 1, name: "Manchester City", points: 63, position: 1, played: 29, wins: 19, draws: 6, losses: 4, goalsFor: 63, goalsAgainst: 28, goalDifference: 35 },
    { id: 2, name: "Liverpool", points: 61, position: 2, played: 29, wins: 18, draws: 7, losses: 4, goalsFor: 65, goalsAgainst: 30, goalDifference: 35 },
    { id: 3, name: "Arsenal", points: 58, position: 3, played: 29, wins: 18, draws: 4, losses: 7, goalsFor: 59, goalsAgainst: 31, goalDifference: 28 },
    { id: 4, name: "Aston Villa", points: 55, position: 4, played: 30, wins: 16, draws: 7, losses: 7, goalsFor: 58, goalsAgainst: 42, goalDifference: 16 },
    { id: 5, name: "Tottenham", points: 53, position: 5, played: 30, wins: 16, draws: 5, losses: 9, goalsFor: 59, goalsAgainst: 45, goalDifference: 14 },
  ],
  "La Liga": [
    { id: 6, name: "Real Madrid", points: 65, position: 1, played: 29, wins: 20, draws: 5, losses: 4, goalsFor: 56, goalsAgainst: 18, goalDifference: 38 },
    { id: 7, name: "Barcelona", points: 61, position: 2, played: 29, wins: 18, draws: 7, losses: 4, goalsFor: 58, goalsAgainst: 34, goalDifference: 24 },
    { id: 8, name: "Atletico Madrid", points: 55, position: 3, played: 30, wins: 17, draws: 4, losses: 9, goalsFor: 53, goalsAgainst: 36, goalDifference: 17 },
    { id: 9, name: "Sevilla", points: 49, position: 4, played: 30, wins: 15, draws: 4, losses: 11, goalsFor: 44, goalsAgainst: 39, goalDifference: 5 },
    { id: 10, name: "Real Sociedad", points: 46, position: 5, played: 30, wins: 13, draws: 7, losses: 10, goalsFor: 42, goalsAgainst: 38, goalDifference: 4 },
  ],
  "Bundesliga": [
    { id: 11, name: "Bayern Munich", points: 64, position: 1, played: 28, wins: 20, draws: 4, losses: 4, goalsFor: 72, goalsAgainst: 32, goalDifference: 40 },
    { id: 12, name: "Borussia Dortmund", points: 58, position: 2, played: 28, wins: 18, draws: 4, losses: 6, goalsFor: 61, goalsAgainst: 34, goalDifference: 27 },
    { id: 13, name: "RB Leipzig", points: 56, position: 3, played: 28, wins: 17, draws: 5, losses: 6, goalsFor: 59, goalsAgainst: 30, goalDifference: 29 },
    { id: 14, name: "Bayer Leverkusen", points: 53, position: 4, played: 28, wins: 15, draws: 8, losses: 5, goalsFor: 57, goalsAgainst: 33, goalDifference: 24 },
    { id: 15, name: "Eintracht Frankfurt", points: 48, position: 5, played: 28, wins: 13, draws: 9, losses: 6, goalsFor: 49, goalsAgainst: 37, goalDifference: 12 },
  ],
  "Serie A": [
    { id: 16, name: "Inter Milan", points: 66, position: 1, played: 29, wins: 21, draws: 3, losses: 5, goalsFor: 65, goalsAgainst: 25, goalDifference: 40 },
    { id: 17, name: "AC Milan", points: 61, position: 2, played: 29, wins: 19, draws: 4, losses: 6, goalsFor: 56, goalsAgainst: 32, goalDifference: 24 },
    { id: 18, name: "Napoli", points: 59, position: 3, played: 29, wins: 18, draws: 5, losses: 6, goalsFor: 55, goalsAgainst: 27, goalDifference: 28 },
    { id: 19, name: "Juventus", points: 57, position: 4, played: 29, wins: 16, draws: 9, losses: 4, goalsFor: 46, goalsAgainst: 25, goalDifference: 21 },
    { id: 20, name: "Atalanta", points: 51, position: 5, played: 29, wins: 15, draws: 6, losses: 8, goalsFor: 55, goalsAgainst: 33, goalDifference: 22 },
  ],
  "Champions League": [
    { id: 21, name: "Bayern Munich", points: 15, position: 1, played: 6, wins: 5, draws: 0, losses: 1, goalsFor: 18, goalsAgainst: 5, goalDifference: 13 },
    { id: 22, name: "Manchester City", points: 13, position: 2, played: 6, wins: 4, draws: 1, losses: 1, goalsFor: 15, goalsAgainst: 7, goalDifference: 8 },
    { id: 23, name: "Real Madrid", points: 12, position: 3, played: 6, wins: 4, draws: 0, losses: 2, goalsFor: 12, goalsAgainst: 7, goalDifference: 5 },
    { id: 24, name: "Liverpool", points: 12, position: 4, played: 6, wins: 4, draws: 0, losses: 2, goalsFor: 13, goalsAgainst: 9, goalDifference: 4 },
    { id: 25, name: "PSG", points: 10, position: 5, played: 6, wins: 3, draws: 1, losses: 2, goalsFor: 9, goalsAgainst: 8, goalDifference: 1 },
  ],
};

// Export league data for use in team details page
export type Team = {
  id: number;
  name: string;
  points: number;
  position: number;
  played: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
};

export const getTeamById = (id: number): Team | undefined => {
  for (const league of Object.values(leagueData)) {
    const team = league.find(team => team.id === id);
    if (team) return team;
  }
  return undefined;
};

export { leagueData };

type TeamRankingProps = {
  searchQuery?: string;
};

export const TeamRankings = ({ searchQuery = "" }: TeamRankingProps) => {
  const navigate = useNavigate();
  
  const filteredLeagueData = Object.entries(leagueData).reduce(
    (acc, [league, teams]) => {
      const filteredTeams = teams.filter((team) =>
        team.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      if (filteredTeams.length > 0) {
        acc[league] = filteredTeams;
      }
      return acc;
    },
    {} as Record<string, typeof leagueData[keyof typeof leagueData]>
  );

  const leagues = Object.keys(filteredLeagueData);
  
  const handleTeamClick = (teamId: number) => {
    navigate(`/teams/${teamId}`);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="flex items-center gap-2 mb-6">
        <Trophy className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-bold">League Standings</h2>
      </div>

      {leagues.length === 0 ? (
        <p className="text-center text-muted-foreground py-8">No teams found matching your search.</p>
      ) : (
        <Tabs defaultValue={leagues[0]}>
          <TabsList className="mb-6 w-full justify-start overflow-x-auto">
            {leagues.map((league) => (
              <TabsTrigger key={league} value={league}>
                {league}
              </TabsTrigger>
            ))}
          </TabsList>

          {leagues.map((league) => (
            <TabsContent key={league} value={league}>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b text-xs text-muted-foreground">
                      <th className="p-2 text-left">Pos</th>
                      <th className="p-2 text-left">Team</th>
                      <th className="p-2 text-center">P</th>
                      <th className="p-2 text-center">W</th>
                      <th className="p-2 text-center">D</th>
                      <th className="p-2 text-center">L</th>
                      <th className="p-2 text-center">GF</th>
                      <th className="p-2 text-center">GA</th>
                      <th className="p-2 text-center">GD</th>
                      <th className="p-2 text-center">Pts</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLeagueData[league].map((team, index) => (
                      <motion.tr
                        key={team.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="border-b hover:bg-secondary/50 cursor-pointer transition-colors"
                        onClick={() => handleTeamClick(team.id)}
                      >
                        <td className="p-3 font-medium">{team.position}</td>
                        <td className="p-3 font-medium">{team.name}</td>
                        <td className="p-3 text-center">{team.played}</td>
                        <td className="p-3 text-center">{team.wins}</td>
                        <td className="p-3 text-center">{team.draws}</td>
                        <td className="p-3 text-center">{team.losses}</td>
                        <td className="p-3 text-center">{team.goalsFor}</td>
                        <td className="p-3 text-center">{team.goalsAgainst}</td>
                        <td className="p-3 text-center font-medium">{team.goalDifference}</td>
                        <td className="p-3 text-center font-bold">{team.points}</td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-2 text-xs text-muted-foreground">
                <p>P = Played, W = Won, D = Drawn, L = Lost, GF = Goals For, GA = Goals Against, GD = Goal Difference, Pts = Points</p>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      )}
    </div>
  );
};
