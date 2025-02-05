import { Navbar } from "@/components/Navbar";
import { motion } from "framer-motion";
import { MatchesTable } from "@/components/MatchesTable";

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
        <MatchesTable />
      </motion.div>
    </div>
  );
};

export default Matches;