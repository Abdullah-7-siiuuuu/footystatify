
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
    detailedStats: {
      passingAccuracy: 78,
      shotsOnTarget: 42,
      tacklesWon: 24,
      possession: 65,
      minutesPlayed: 2340,
      distanceCovered: 245.6,
      yellowCards: 2,
      redCards: 0,
      formTrend: [
        { match: "vs ARS", rating: 7.2 },
        { match: "vs CHE", rating: 6.5 },
        { match: "vs LIV", rating: 8.1 },
        { match: "vs TOT", rating: 7.8 },
        { match: "vs MCI", rating: 6.9 },
      ],
      heatmap: [
        { zone: "Left Wing", value: 65 },
        { zone: "Center", value: 25 },
        { zone: "Right Wing", value: 10 },
      ],
      xGPerMatch: 0.68,
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
    detailedStats: {
      passingAccuracy: 89,
      shotsOnTarget: 28,
      tacklesWon: 32,
      possession: 72,
      minutesPlayed: 2160,
      distanceCovered: 268.3,
      yellowCards: 3,
      redCards: 0,
      formTrend: [
        { match: "vs ARS", rating: 8.5 },
        { match: "vs CHE", rating: 7.9 },
        { match: "vs LIV", rating: 8.7 },
        { match: "vs TOT", rating: 7.2 },
        { match: "vs MUN", rating: 9.1 },
      ],
      heatmap: [
        { zone: "Left Wing", value: 15 },
        { zone: "Center", value: 70 },
        { zone: "Right Wing", value: 15 },
      ],
      xGPerMatch: 0.42,
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
    detailedStats: {
      passingAccuracy: 92,
      shotsOnTarget: 10,
      tacklesWon: 65,
      possession: 58,
      minutesPlayed: 2700,
      distanceCovered: 224.7,
      yellowCards: 4,
      redCards: 0,
      formTrend: [
        { match: "vs ARS", rating: 7.8 },
        { match: "vs CHE", rating: 8.2 },
        { match: "vs MCI", rating: 7.5 },
        { match: "vs TOT", rating: 8.0 },
        { match: "vs MUN", rating: 8.4 },
      ],
      heatmap: [
        { zone: "Left CB", value: 45 },
        { zone: "Right CB", value: 55 },
        { zone: "CDM", value: 10 },
      ],
      xGPerMatch: 0.12,
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
