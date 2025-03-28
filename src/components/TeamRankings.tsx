
import { Trophy } from "lucide-react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";

// Updated to include more detailed stats, badges and team colors
const leagueData = {
  "Premier League": [
    { id: 1, name: "Manchester City", points: 63, position: 1, played: 29, wins: 19, draws: 6, losses: 4, goalsFor: 63, goalsAgainst: 28, goalDifference: 35, badge: "https://resources.premierleague.com/premierleague/badges/t43.png", primaryColor: "#6CABDD" },
    { id: 2, name: "Liverpool", points: 61, position: 2, played: 29, wins: 18, draws: 7, losses: 4, goalsFor: 65, goalsAgainst: 30, goalDifference: 35, badge: "https://resources.premierleague.com/premierleague/badges/t14.png", primaryColor: "#C8102E" },
    { id: 3, name: "Arsenal", points: 58, position: 3, played: 29, wins: 18, draws: 4, losses: 7, goalsFor: 59, goalsAgainst: 31, goalDifference: 28, badge: "https://resources.premierleague.com/premierleague/badges/t3.png", primaryColor: "#EF0107" },
    { id: 4, name: "Aston Villa", points: 55, position: 4, played: 30, wins: 16, draws: 7, losses: 7, goalsFor: 58, goalsAgainst: 42, goalDifference: 16, badge: "https://resources.premierleague.com/premierleague/badges/t7.png", primaryColor: "#95BFE5" },
    { id: 5, name: "Tottenham", points: 53, position: 5, played: 30, wins: 16, draws: 5, losses: 9, goalsFor: 59, goalsAgainst: 45, goalDifference: 14, badge: "https://resources.premierleague.com/premierleague/badges/t6.png", primaryColor: "#132257" },
  ],
  "La Liga": [
    { id: 6, name: "Real Madrid", points: 65, position: 1, played: 29, wins: 20, draws: 5, losses: 4, goalsFor: 56, goalsAgainst: 18, goalDifference: 38, badge: "https://upload.wikimedia.org/wikipedia/en/5/56/Real_Madrid_CF.svg", primaryColor: "#FFFFFF" },
    { id: 7, name: "Barcelona", points: 61, position: 2, played: 29, wins: 18, draws: 7, losses: 4, goalsFor: 58, goalsAgainst: 34, goalDifference: 24, badge: "https://upload.wikimedia.org/wikipedia/en/4/47/FC_Barcelona_%28crest%29.svg", primaryColor: "#004D98" },
    { id: 8, name: "Atletico Madrid", points: 55, position: 3, played: 30, wins: 17, draws: 4, losses: 9, goalsFor: 53, goalsAgainst: 36, goalDifference: 17, badge: "https://upload.wikimedia.org/wikipedia/en/f/f4/Atletico_Madrid_2017_logo.svg", primaryColor: "#CB3524" },
    { id: 9, name: "Sevilla", points: 49, position: 4, played: 30, wins: 15, draws: 4, losses: 11, goalsFor: 44, goalsAgainst: 39, goalDifference: 5, badge: "https://upload.wikimedia.org/wikipedia/en/3/3b/Sevilla_FC_logo.svg", primaryColor: "#CB3524" },
    { id: 10, name: "Real Sociedad", points: 46, position: 5, played: 30, wins: 13, draws: 7, losses: 10, goalsFor: 42, goalsAgainst: 38, goalDifference: 4, badge: "https://upload.wikimedia.org/wikipedia/en/f/f1/Real_Sociedad_logo.svg", primaryColor: "#0B67B2" },
  ],
  "Bundesliga": [
    { id: 11, name: "Bayern Munich", points: 64, position: 1, played: 28, wins: 20, draws: 4, losses: 4, goalsFor: 72, goalsAgainst: 32, goalDifference: 40, badge: "https://upload.wikimedia.org/wikipedia/commons/1/1b/FC_Bayern_M%C3%BCnchen_logo_%282017%29.svg", primaryColor: "#DC052D" },
    { id: 12, name: "Borussia Dortmund", points: 58, position: 2, played: 28, wins: 18, draws: 4, losses: 6, goalsFor: 61, goalsAgainst: 34, goalDifference: 27, badge: "https://upload.wikimedia.org/wikipedia/commons/6/67/Borussia_Dortmund_logo.svg", primaryColor: "#FDE100" },
    { id: 13, name: "RB Leipzig", points: 56, position: 3, played: 28, wins: 17, draws: 5, losses: 6, goalsFor: 59, goalsAgainst: 30, goalDifference: 29, badge: "https://upload.wikimedia.org/wikipedia/en/0/04/RB_Leipzig_2014_logo.svg", primaryColor: "#DD0741" },
    { id: 14, name: "Bayer Leverkusen", points: 53, position: 4, played: 28, wins: 15, draws: 8, losses: 5, goalsFor: 57, goalsAgainst: 33, goalDifference: 24, badge: "https://upload.wikimedia.org/wikipedia/en/5/59/Bayer_04_Leverkusen_logo.svg", primaryColor: "#E32221" },
    { id: 15, name: "Eintracht Frankfurt", points: 48, position: 5, played: 28, wins: 13, draws: 9, losses: 6, goalsFor: 49, goalsAgainst: 37, goalDifference: 12, badge: "https://upload.wikimedia.org/wikipedia/commons/0/04/Eintracht_Frankfurt_Logo.svg", primaryColor: "#E1000F" },
  ],
  "Serie A": [
    { id: 16, name: "Inter Milan", points: 66, position: 1, played: 29, wins: 21, draws: 3, losses: 5, goalsFor: 65, goalsAgainst: 25, goalDifference: 40, badge: "https://upload.wikimedia.org/wikipedia/commons/0/05/FC_Internazionale_Milano_2021.svg", primaryColor: "#0B1560" },
    { id: 17, name: "AC Milan", points: 61, position: 2, played: 29, wins: 19, draws: 4, losses: 6, goalsFor: 56, goalsAgainst: 32, goalDifference: 24, badge: "https://upload.wikimedia.org/wikipedia/commons/d/d0/Logo_of_AC_Milan.svg", primaryColor: "#FB090B" },
    { id: 18, name: "Napoli", points: 59, position: 3, played: 29, wins: 18, draws: 5, losses: 6, goalsFor: 55, goalsAgainst: 27, goalDifference: 28, badge: "https://upload.wikimedia.org/wikipedia/commons/2/2d/SSC_Napoli_%282021%29.svg", primaryColor: "#12A0D7" },
    { id: 19, name: "Juventus", points: 57, position: 4, played: 29, wins: 16, draws: 9, losses: 4, goalsFor: 46, goalsAgainst: 25, goalDifference: 21, badge: "https://upload.wikimedia.org/wikipedia/commons/b/bc/Juventus_FC_2017_icon_%28black%29.svg", primaryColor: "#000000" },
    { id: 20, name: "Atalanta", points: 51, position: 5, played: 29, wins: 15, draws: 6, losses: 8, goalsFor: 55, goalsAgainst: 33, goalDifference: 22, badge: "https://upload.wikimedia.org/wikipedia/en/6/66/AtalantaBC.svg", primaryColor: "#1E71B8" },
  ],
  "Champions League": [
    { id: 21, name: "Paris Saint-Germain", points: 15, position: 1, played: 6, wins: 5, draws: 0, losses: 1, goalsFor: 18, goalsAgainst: 5, goalDifference: 13, badge: "https://upload.wikimedia.org/wikipedia/en/a/a7/Paris_Saint-Germain_F.C..svg", primaryColor: "#004170" },
    { id: 22, name: "Real Madrid", points: 14, position: 2, played: 6, wins: 4, draws: 2, losses: 0, goalsFor: 16, goalsAgainst: 6, goalDifference: 10, badge: "https://upload.wikimedia.org/wikipedia/en/5/56/Real_Madrid_CF.svg", primaryColor: "#FFFFFF", leagueAlsoIn: "La Liga" },
    { id: 23, name: "Porto", points: 12, position: 3, played: 6, wins: 4, draws: 0, losses: 2, goalsFor: 12, goalsAgainst: 7, goalDifference: 5, badge: "https://upload.wikimedia.org/wikipedia/en/f/f1/FC_Porto.svg", primaryColor: "#0046A8" },
    { id: 24, name: "Ajax", points: 12, position: 4, played: 6, wins: 4, draws: 0, losses: 2, goalsFor: 13, goalsAgainst: 9, goalDifference: 4, badge: "https://upload.wikimedia.org/wikipedia/en/7/79/Ajax_Amsterdam.svg", primaryColor: "#C4212A" },
    { id: 25, name: "Benfica", points: 10, position: 5, played: 6, wins: 3, draws: 1, losses: 2, goalsFor: 9, goalsAgainst: 8, goalDifference: 1, badge: "https://upload.wikimedia.org/wikipedia/en/a/a2/SL_Benfica_logo.svg", primaryColor: "#E52E38" },
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
  badge?: string;
  primaryColor?: string;
  leagueAlsoIn?: string;
};

export const getTeamById = (id: number): Team | undefined => {
  for (const league of Object.values(leagueData)) {
    const team = league.find(team => team.id === id);
    if (team) return team;
  }
  return undefined;
};

// Get unique teams for stats filtering
export const getUniqueTeams = (): Team[] => {
  const uniqueTeams = new Map<string, Team>();
  
  for (const [leagueName, teams] of Object.entries(leagueData)) {
    for (const team of teams) {
      if (!uniqueTeams.has(team.name)) {
        // Create a new team object with all properties including the optional ones
        uniqueTeams.set(team.name, {
          ...team,
          leagueAlsoIn: team.leagueAlsoIn || undefined
        });
      }
    }
  }
  
  return Array.from(uniqueTeams.values());
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
                        <td className="p-3 font-medium">
                          <div className="flex items-center gap-2">
                            {team.badge && (
                              <img src={team.badge} alt={team.name} className="w-5 h-5 object-contain" />
                            )}
                            {team.name}
                            {team.leagueAlsoIn && (
                              <span className="text-xs text-muted-foreground ml-1">
                                (Also in {team.leagueAlsoIn})
                              </span>
                            )}
                          </div>
                        </td>
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
