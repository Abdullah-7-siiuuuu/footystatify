import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { Navbar } from "@/components/Navbar";
import { MatchesTable } from "@/components/MatchesTable";
import { TeamRankings } from "@/components/TeamRankings";
import { motion } from "framer-motion";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <Features />
      <motion.section 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="py-24"
      >
        <div className="container mx-auto px-4">
          <MatchesTable />
        </div>
      </motion.section>
      <motion.section 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="py-24 bg-secondary/50"
      >
        <div className="container mx-auto px-4">
          <TeamRankings />
        </div>
      </motion.section>
    </div>
  );
};

export default Index;