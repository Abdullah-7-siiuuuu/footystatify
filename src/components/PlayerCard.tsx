import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion } from "framer-motion";

interface PlayerStats {
  goals: number;
  assists: number;
  matches: number;
}

interface Player {
  id: number;
  name: string;
  team: string;
  position: string;
  stats: PlayerStats;
  image: string;
}

interface PlayerCardProps {
  player: Player;
}

export const PlayerCard = ({ player }: PlayerCardProps) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="overflow-hidden">
        <CardHeader className="flex flex-row items-center gap-4 pb-2">
          <Avatar className="h-12 w-12">
            <AvatarImage src={player.image} alt={player.name} />
            <AvatarFallback>{player.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold text-lg">{player.name}</h3>
            <p className="text-sm text-muted-foreground">{player.position} • {player.team}</p>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="space-y-1">
              <p className="text-2xl font-bold">{player.stats.goals}</p>
              <p className="text-xs text-muted-foreground">Goals</p>
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold">{player.stats.assists}</p>
              <p className="text-xs text-muted-foreground">Assists</p>
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold">{player.stats.matches}</p>
              <p className="text-xs text-muted-foreground">Matches</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};