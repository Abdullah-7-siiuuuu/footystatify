import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { PlayerCard } from "@/components/PlayerCard";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";
import { Navbar } from "@/components/Navbar";

// Mock data for initial development
const PLAYERS = [
  {
    id: 1,
    name: "Marcus Rashford",
    team: "Manchester United",
    position: "Forward",
    stats: {
      goals: 15,
      assists: 7,
      matches: 28,
    },
    image: "/placeholder.svg"
  },
  {
    id: 2,
    name: "Kevin De Bruyne",
    team: "Manchester City",
    position: "Midfielder",
    stats: {
      goals: 8,
      assists: 16,
      matches: 25,
    },
    image: "/placeholder.svg"
  },
  {
    id: 3,
    name: "Virgil van Dijk",
    team: "Liverpool",
    position: "Defender",
    stats: {
      goals: 3,
      assists: 1,
      matches: 30,
    },
    image: "/placeholder.svg"
  }
];

const Players = () => {
  const [searchQuery, setSearchQuery] = useState("");
  
  const filteredPlayers = PLAYERS.filter(player => 
    player.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    player.team.toLowerCase().includes(searchQuery.toLowerCase()) ||
    player.position.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="container mx-auto space-y-6 p-6 pt-24"
      >
        <h1 className="text-4xl font-bold">Players</h1>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search players, teams, or positions..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <ScrollArea className="h-[calc(100vh-200px)]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPlayers.map((player) => (
              <PlayerCard key={player.id} player={player} />
            ))}
          </div>
        </ScrollArea>
      </motion.div>
    </div>
  );
};

export default Players;
