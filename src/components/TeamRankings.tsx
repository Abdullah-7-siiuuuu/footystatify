
import { Trophy } from "lucide-react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Updated to include multiple leagues
const leagueData = {
  "Premier League": [
    { id: 1, name: "Manchester City", points: 63, position: 1 },
    { id: 2, name: "Liverpool", points: 61, position: 2 },
    { id: 3, name: "Arsenal", points: 58, position: 3 },
    { id: 4, name: "Aston Villa", points: 55, position: 4 },
    { id: 5, name: "Tottenham", points: 53, position: 5 },
  ],
  "La Liga": [
    { id: 6, name: "Real Madrid", points: 65, position: 1 },
    { id: 7, name: "Barcelona", points: 61, position: 2 },
    { id: 8, name: "Atletico Madrid", points: 55, position: 3 },
    { id: 9, name: "Sevilla", points: 49, position: 4 },
    { id: 10, name: "Real Sociedad", points: 46, position: 5 },
  ],
  "Bundesliga": [
    { id: 11, name: "Bayern Munich", points: 64, position: 1 },
    { id: 12, name: "Borussia Dortmund", points: 58, position: 2 },
    { id: 13, name: "RB Leipzig", points: 56, position: 3 },
    { id: 14, name: "Bayer Leverkusen", points: 53, position: 4 },
    { id: 15, name: "Eintracht Frankfurt", points: 48, position: 5 },
  ],
  "Serie A": [
    { id: 16, name: "Inter Milan", points: 66, position: 1 },
    { id: 17, name: "AC Milan", points: 61, position: 2 },
    { id: 18, name: "Napoli", points: 59, position: 3 },
    { id: 19, name: "Juventus", points: 57, position: 4 },
    { id: 20, name: "Atalanta", points: 51, position: 5 },
  ],
  "Champions League": [
    { id: 21, name: "Bayern Munich", points: 15, position: 1 },
    { id: 22, name: "Manchester City", points: 13, position: 2 },
    { id: 23, name: "Real Madrid", points: 12, position: 3 },
    { id: 24, name: "Liverpool", points: 12, position: 4 },
    { id: 25, name: "PSG", points: 10, position: 5 },
  ],
};

type TeamRankingProps = {
  searchQuery?: string;
};

export const TeamRankings = ({ searchQuery = "" }: TeamRankingProps) => {
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
              <div className="space-y-3">
                {filteredLeagueData[league].map((team, index) => (
                  <motion.div
                    key={team.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 rounded-lg bg-secondary/50 hover:bg-secondary/80 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-lg font-bold w-8">{team.position}</span>
                      <span>{team.name}</span>
                    </div>
                    <span className="font-bold">{team.points} pts</span>
                  </motion.div>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      )}
    </div>
  );
};
