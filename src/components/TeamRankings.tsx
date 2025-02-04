import { Trophy } from "lucide-react";
import { motion } from "framer-motion";

const teamRankings = [
  { id: 1, name: "Manchester City", points: 63, position: 1 },
  { id: 2, name: "Liverpool", points: 61, position: 2 },
  { id: 3, name: "Arsenal", points: 58, position: 3 },
  { id: 4, name: "Aston Villa", points: 55, position: 4 },
  { id: 5, name: "Tottenham", points: 53, position: 5 },
];

export const TeamRankings = () => {
  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="flex items-center gap-2 mb-6">
        <Trophy className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-bold">League Standings</h2>
      </div>
      <div className="space-y-3">
        {teamRankings.map((team, index) => (
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
    </div>
  );
};