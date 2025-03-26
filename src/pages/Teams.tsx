
import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { motion } from "framer-motion";
import { Search, Calendar as CalendarIcon, Trophy, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { TeamRankings } from "@/components/TeamRankings";
import { MatchCalendar } from "@/components/MatchCalendar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Teams = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<string>("standings");
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="container mx-auto space-y-6 p-6 pt-24"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
          <h1 className="text-4xl font-bold">Teams</h1>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full sm:w-auto">
            <TabsList>
              <TabsTrigger value="standings" className="flex items-center gap-2">
                <Trophy className="h-4 w-4" />
                Standings
              </TabsTrigger>
              <TabsTrigger value="calendar" className="flex items-center gap-2">
                <CalendarIcon className="h-4 w-4" />
                Calendar
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={activeTab === "standings" ? "Search teams..." : "Search matches..."}
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsContent value="standings" className="mt-6 space-y-6">
            <TeamRankings searchQuery={searchQuery} />
            <div className="flex justify-center mt-8">
              <Button onClick={() => navigate('/standings')} className="flex items-center gap-2">
                View Full Standings <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="calendar" className="mt-6">
            <MatchCalendar />
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
};

export default Teams;
