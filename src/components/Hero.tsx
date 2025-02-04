import { motion } from "framer-motion";
import { BarChart3, Users, Trophy } from "lucide-react";

export const Hero = () => {
  return (
    <section className="min-h-[80vh] flex items-center justify-center relative overflow-hidden bg-gradient-to-b from-primary/5 to-background">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="container mx-auto px-4 text-center"
      >
        <span className="inline-block px-3 py-1 mb-6 text-sm font-medium bg-secondary rounded-full animate-fade-down">
          Football Analytics Platform
        </span>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-4xl md:text-6xl font-bold mb-6 tracking-tight text-balance"
        >
          Advanced Football Statistics & Analysis
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto text-balance"
        >
          Dive deep into match statistics, player comparisons, and team analytics with our comprehensive football data platform.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <button className="px-8 py-3 bg-primary text-primary-foreground rounded-lg hover-lift">
            Explore Statistics
          </button>
          <button className="px-8 py-3 bg-secondary text-secondary-foreground rounded-lg hover-lift">
            View Teams
          </button>
        </motion.div>
      </motion.div>
    </section>
  );
};