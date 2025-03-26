
import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { motion } from "framer-motion";
import { Search, Users, Loader2, Shield } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import { leagueData, Team } from "@/components/TeamRankings";

const Teams = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  
  // Flatten all teams from league data
  const allTeams = Object.entries(leagueData).flatMap(([league, teams]) => 
    teams.map(team => ({ ...team, league }))
  );
  
  // Filter teams based on search query
  const filteredTeams = allTeams.filter(team => 
    team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    team.league.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="container mx-auto space-y-6 p-6 pt-24"
      >
        <h1 className="text-4xl font-bold">Teams</h1>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search teams or leagues..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {filteredTeams.length === 0 ? (
          <div className="text-center p-12 text-muted-foreground">
            <p className="text-lg">No teams found</p>
            <p className="text-sm mt-2">Try adjusting your search criteria</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTeams.map((team) => (
              <TeamCard key={team.id} team={team} onClick={() => navigate(`/teams/${team.id}`)} />
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

// Team card component to display team information
const TeamCard = ({ team, onClick }: { team: Team & { league: string }, onClick: () => void }) => {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Card className="overflow-hidden cursor-pointer hover:shadow-md transition-all" onClick={onClick}>
        <CardContent className="p-0">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              {team.badge ? (
                <Avatar className="h-12 w-12 rounded-none">
                  <AvatarImage src={team.badge} alt={team.name} />
                  <AvatarFallback className="rounded-none">
                    <Shield className="h-10 w-10 text-primary" />
                  </AvatarFallback>
                </Avatar>
              ) : (
                <Shield className="h-10 w-10 text-primary" />
              )}
              <div>
                <h3 className="font-bold text-xl">{team.name}</h3>
                <p className="text-muted-foreground text-sm">{team.league}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Position</p>
                <p className="font-medium">{team.position}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Points</p>
                <p className="font-medium">{team.points}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Record</p>
                <p className="font-medium">{team.wins}W - {team.draws}D - {team.losses}L</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Goal Diff</p>
                <p className="font-medium">{team.goalDifference > 0 ? '+' : ''}{team.goalDifference}</p>
              </div>
            </div>
            
            <Button className="w-full mt-4" onClick={onClick}>View Team</Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default Teams;
