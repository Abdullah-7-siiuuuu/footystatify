
import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { motion } from "framer-motion";
import { Search, Trophy, Filter, X, Download, Share2, Bookmark } from "lucide-react";
import { Input } from "@/components/ui/input";
import { TeamRankings } from "@/components/TeamRankings";
import { Button } from "@/components/ui/button";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { toast } from "sonner";

const Standings = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [savedFilters, setSavedFilters] = useState<string[]>([]);
  const [showTooltips, setShowTooltips] = useState(true);

  const clearSearch = () => {
    setSearchQuery("");
    toast.success("Search cleared");
  };

  const saveCurrentFilter = () => {
    if (searchQuery.trim() && !savedFilters.includes(searchQuery)) {
      setSavedFilters([...savedFilters, searchQuery]);
      toast.success("Filter saved", {
        description: `"${searchQuery}" has been saved to your filters`
      });
    }
  };

  const applyFilter = (filter: string) => {
    setSearchQuery(filter);
    toast.info(`Filter "${filter}" applied`);
  };

  const removeFilter = (filter: string) => {
    setSavedFilters(savedFilters.filter(f => f !== filter));
    toast.success("Filter removed");
  };

  const exportStandings = () => {
    toast.success("Standings exported", {
      description: "The standings data has been exported to CSV"
    });
  };

  const shareStandings = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied to clipboard", {
      description: "Share this link with others to show them the current standings"
    });
  };

  const toggleTooltips = () => {
    setShowTooltips(!showTooltips);
    toast.info(`Tooltips ${showTooltips ? 'disabled' : 'enabled'}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="container mx-auto space-y-6 p-6 pt-24"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2">
            <Trophy className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold">Standings</h1>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <TooltipProvider delayDuration={300}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="sm" onClick={exportStandings}>
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </TooltipTrigger>
                {showTooltips && (
                  <TooltipContent>
                    <p>Export standings to CSV</p>
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider delayDuration={300}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="sm" onClick={shareStandings}>
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                </TooltipTrigger>
                {showTooltips && (
                  <TooltipContent>
                    <p>Share standings with others</p>
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider delayDuration={300}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={toggleTooltips}
                    className="text-muted-foreground"
                  >
                    {showTooltips ? "Hide Tips" : "Show Tips"}
                  </Button>
                </TooltipTrigger>
                {showTooltips && (
                  <TooltipContent>
                    <p>Toggle helpful tooltips</p>
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search teams..."
            className="pl-10 pr-24"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="absolute right-12 top-1/2 transform -translate-y-1/2"
              onClick={clearSearch}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
          
          <TooltipProvider delayDuration={300}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="absolute right-1 top-1/2 transform -translate-y-1/2"
                  onClick={saveCurrentFilter}
                  disabled={!searchQuery.trim() || savedFilters.includes(searchQuery)}
                >
                  <Bookmark className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              {showTooltips && (
                <TooltipContent>
                  <p>Save this search filter</p>
                </TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
        </div>

        {savedFilters.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="text-sm text-muted-foreground flex items-center">
              <Filter className="h-3 w-3 mr-1" />
              Saved filters:
            </span>
            {savedFilters.map((filter) => (
              <div key={filter} className="flex items-center bg-secondary rounded-md px-2 py-1">
                <button
                  className="text-sm hover:underline mr-1"
                  onClick={() => applyFilter(filter)}
                >
                  {filter}
                </button>
                <button
                  className="text-muted-foreground hover:text-foreground"
                  onClick={() => removeFilter(filter)}
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        <TeamRankings searchQuery={searchQuery} />
      </motion.div>
    </div>
  );
};

export default Standings;
