
import { motion } from "framer-motion";
import { BarChart3, Trophy, Users, Calendar, Shield, BarChart } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { ModeToggle } from "@/components/ModeToggle";

export const Navbar = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path ? "font-medium text-foreground" : "text-muted-foreground hover:text-foreground";
  };
  
  return (
    <motion.nav 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b"
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <BarChart3 className="h-6 w-6" />
            <span className="font-bold text-xl">Estrella</span>
          </Link>
          <div className="hidden md:flex space-x-6">
            <Link to="/matches" className={`transition-colors flex items-center gap-1 ${isActive('/matches')}`}>
              <Calendar className="h-4 w-4" />
              <span>Matches</span>
            </Link>
            <Link to="/teams" className={`transition-colors flex items-center gap-1 ${isActive('/teams')}`}>
              <Shield className="h-4 w-4" />
              <span>Teams</span>
            </Link>
            <Link to="/standings" className={`transition-colors flex items-center gap-1 ${isActive('/standings')}`}>
              <Trophy className="h-4 w-4" />
              <span>Standings</span>
            </Link>
            <Link to="/players" className={`transition-colors flex items-center gap-1 ${isActive('/players')}`}>
              <Users className="h-4 w-4" />
              <span>Players</span>
            </Link>
            <Link to="/stats" className={`transition-colors flex items-center gap-1 ${isActive('/stats')}`}>
              <BarChart className="h-4 w-4" />
              <span>Statistics</span>
            </Link>
          </div>
          <div>
            <ModeToggle />
          </div>
        </div>
      </div>
    </motion.nav>
  );
};
