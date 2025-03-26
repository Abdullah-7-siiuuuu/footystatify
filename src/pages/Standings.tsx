
import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { motion } from "framer-motion";
import { Search, Trophy } from "lucide-react";
import { Input } from "@/components/ui/input";
import { TeamRankings } from "@/components/TeamRankings";

const Standings = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="container mx-auto space-y-6 p-6 pt-24"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2">
            <Trophy className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold">Standings</h1>
          </div>
        </div>
        
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search teams..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <TeamRankings searchQuery={searchQuery} />
      </motion.div>
    </div>
  );
};

export default Standings;
