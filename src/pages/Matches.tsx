
import { Navbar } from "@/components/Navbar";
import { motion } from "framer-motion";
import { MatchesTable } from "@/components/MatchesTable";
import { MatchPredictions } from "@/components/MatchPredictions";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
            <TabsTrigger value="recent">Recent Matches</TabsTrigger>
            <TabsTrigger value="predictions">Match Predictions</TabsTrigger>
          </TabsList>
          <TabsContent value="recent">
            <MatchesTable />
          </TabsContent>
          <TabsContent value="predictions">
            <MatchPredictions />
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
};

export default Matches;
