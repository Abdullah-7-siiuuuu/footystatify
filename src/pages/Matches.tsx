
import { Navbar } from "@/components/Navbar";
import { motion } from "framer-motion";
import { MatchesTable } from "@/components/MatchesTable";
import { MatchPredictions } from "@/components/MatchPredictions";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Calendar, Trophy } from "lucide-react";

const Matches = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="container mx-auto p-6 pt-24"
      >
        <h1 className="text-4xl font-bold mb-6">Matches</h1>
        
        <Tabs defaultValue="recent">
          <TabsList className="mb-6">
            <TabsTrigger value="recent" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Recent Matches
            </TabsTrigger>
            <TabsTrigger value="predictions" className="flex items-center gap-2">
              <Trophy className="h-4 w-4" />
              Match Predictions
            </TabsTrigger>
            <TabsTrigger value="stats" className="flex items-center gap-2">
              <BarChart className="h-4 w-4" />
              League Stats
            </TabsTrigger>
          </TabsList>
          <TabsContent value="recent">
            <MatchesTable />
          </TabsContent>
          <TabsContent value="predictions">
            <MatchPredictions />
          </TabsContent>
          <TabsContent value="stats">
            <div className="p-6 border rounded-lg bg-card shadow-sm">
              <h2 className="text-2xl font-bold mb-4">League Performance Stats</h2>
              <p className="text-muted-foreground">Advanced league-wide statistics and team comparisons coming soon.</p>
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
};

export default Matches;
