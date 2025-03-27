
import { motion } from "framer-motion";
import { Search, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { PlayerCard } from "@/components/PlayerCard";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { PlayerService, UseMockData } from "@/services/api";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

const Players = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  
  // Set up debounced search to avoid too many API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch players data using React Query
  const { data: players, isLoading, error } = useQuery({
    queryKey: ['players', debouncedSearch],
    queryFn: () => {
      // Check if we want to use mock data (no API available)
      const useMockData = !import.meta.env.VITE_API_URL;
      
      if (useMockData) {
        // Simulate API delay with mock data
        return UseMockData.delay(800).then(() => {
          const mockPlayers = UseMockData.getPlayers();
          // Apply filtering in-memory for mock data
          if (debouncedSearch) {
            return mockPlayers.filter(player => 
              player.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
              player.team.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
              player.position.toLowerCase().includes(debouncedSearch.toLowerCase())
            );
          }
          return mockPlayers;
        });
      }
      
      // Use real API
      return PlayerService.getPlayers(debouncedSearch);
    },
    staleTime: 60000, // 1 minute
  });

  // Show error toast if API request fails
  useEffect(() => {
    if (error) {
      toast.error("Failed to load players data. Using cached data if available.");
    }
  }, [error]);

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
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2 text-muted-foreground">Loading players...</span>
            </div>
          ) : !players || players.length === 0 ? (
            <div className="text-center p-12 text-muted-foreground">
              <p className="text-lg">No players found</p>
              <p className="text-sm mt-2">Try adjusting your search criteria</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {players.map((player) => (
                <PlayerCard key={player.id} player={player} />
              ))}
            </div>
          )}
        </ScrollArea>
      </motion.div>
    </div>
  );
};

export default Players;
