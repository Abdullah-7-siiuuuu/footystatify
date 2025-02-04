import { motion } from "framer-motion";
import { BarChart3 } from "lucide-react";
import { Link } from "react-router-dom";

export const Navbar = () => {
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
            <span className="font-bold text-xl">FootyStatify</span>
          </Link>
          <div className="hidden md:flex space-x-6">
            <Link to="/matches" className="text-muted-foreground hover:text-foreground transition-colors">
              Matches
            </Link>
            <Link to="/teams" className="text-muted-foreground hover:text-foreground transition-colors">
              Teams
            </Link>
            <Link to="/players" className="text-muted-foreground hover:text-foreground transition-colors">
              Players
            </Link>
            <Link to="/stats" className="text-muted-foreground hover:text-foreground transition-colors">
              Statistics
            </Link>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};