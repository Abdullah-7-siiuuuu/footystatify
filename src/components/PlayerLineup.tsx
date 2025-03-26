
import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Football, Search, Flag } from "lucide-react";
import { motion } from "framer-motion";

// Types for players
interface Player {
  id: number;
  name: string;
  position: string;
  shirtNumber: number;
  nationality: string;
  age: number;
  height: string;
  injuryStatus: 'Fit' | 'Doubtful' | 'Injured' | 'Suspended';
  appearances: number;
  goals: number;
  assists: number;
}

// Mock player data by team id
const playersByTeam: Record<number, Player[]> = {
  1: [ // Manchester City
    { id: 101, name: "Erling Haaland", position: "ST", shirtNumber: 9, nationality: "Norway", age: 23, height: "194cm", injuryStatus: "Fit", appearances: 28, goals: 24, assists: 5 },
    { id: 102, name: "Kevin De Bruyne", position: "CM", shirtNumber: 17, nationality: "Belgium", age: 32, height: "181cm", injuryStatus: "Fit", appearances: 20, goals: 4, assists: 11 },
    { id: 103, name: "Rodri", position: "DM", shirtNumber: 16, nationality: "Spain", age: 27, height: "191cm", injuryStatus: "Fit", appearances: 29, goals: 7, assists: 6 },
    { id: 104, name: "Phil Foden", position: "AM", shirtNumber: 47, nationality: "England", age: 23, height: "171cm", injuryStatus: "Fit", appearances: 28, goals: 18, assists: 9 },
    { id: 105, name: "Ruben Dias", position: "CB", shirtNumber: 3, nationality: "Portugal", age: 26, height: "187cm", injuryStatus: "Fit", appearances: 27, goals: 2, assists: 1 },
    { id: 106, name: "John Stones", position: "CB", shirtNumber: 5, nationality: "England", age: 29, height: "188cm", injuryStatus: "Doubtful", appearances: 19, goals: 1, assists: 1 },
    { id: 107, name: "Kyle Walker", position: "RB", shirtNumber: 2, nationality: "England", age: 33, height: "183cm", injuryStatus: "Fit", appearances: 26, goals: 0, assists: 4 },
    { id: 108, name: "Nathan Ake", position: "LB", shirtNumber: 6, nationality: "Netherlands", age: 29, height: "180cm", injuryStatus: "Injured", appearances: 22, goals: 2, assists: 0 },
    { id: 109, name: "Josko Gvardiol", position: "LB", shirtNumber: 24, nationality: "Croatia", age: 22, height: "185cm", injuryStatus: "Fit", appearances: 27, goals: 3, assists: 2 },
    { id: 110, name: "Bernardo Silva", position: "RW", shirtNumber: 20, nationality: "Portugal", age: 29, height: "173cm", injuryStatus: "Fit", appearances: 28, goals: 8, assists: 7 },
    { id: 111, name: "Ederson", position: "GK", shirtNumber: 31, nationality: "Brazil", age: 30, height: "188cm", injuryStatus: "Fit", appearances: 28, goals: 0, assists: 0 },
  ],
  2: [ // Liverpool
    { id: 201, name: "Mohamed Salah", position: "RW", shirtNumber: 11, nationality: "Egypt", age: 31, height: "175cm", injuryStatus: "Fit", appearances: 26, goals: 18, assists: 9 },
    { id: 202, name: "Virgil van Dijk", position: "CB", shirtNumber: 4, nationality: "Netherlands", age: 32, height: "193cm", injuryStatus: "Fit", appearances: 28, goals: 3, assists: 0 },
    { id: 203, name: "Trent Alexander-Arnold", position: "RB", shirtNumber: 66, nationality: "England", age: 25, height: "175cm", injuryStatus: "Fit", appearances: 24, goals: 3, assists: 8 },
    { id: 204, name: "Alisson Becker", position: "GK", shirtNumber: 1, nationality: "Brazil", age: 31, height: "191cm", injuryStatus: "Fit", appearances: 25, goals: 0, assists: 0 },
    { id: 205, name: "Darwin Nunez", position: "ST", shirtNumber: 9, nationality: "Uruguay", age: 24, height: "187cm", injuryStatus: "Doubtful", appearances: 27, goals: 11, assists: 8 },
    { id: 206, name: "Luis Diaz", position: "LW", shirtNumber: 7, nationality: "Colombia", age: 27, height: "178cm", injuryStatus: "Fit", appearances: 28, goals: 10, assists: 4 },
    { id: 207, name: "Cody Gakpo", position: "LW", shirtNumber: 18, nationality: "Netherlands", age: 25, height: "189cm", injuryStatus: "Fit", appearances: 26, goals: 7, assists: 4 },
    { id: 208, name: "Andy Robertson", position: "LB", shirtNumber: 26, nationality: "Scotland", age: 30, height: "178cm", injuryStatus: "Fit", appearances: 25, goals: 0, assists: 6 },
    { id: 209, name: "Dominik Szoboszlai", position: "CM", shirtNumber: 8, nationality: "Hungary", age: 23, height: "186cm", injuryStatus: "Fit", appearances: 27, goals: 5, assists: 3 },
    { id: 210, name: "Ibrahima Konaté", position: "CB", shirtNumber: 5, nationality: "France", age: 24, height: "194cm", injuryStatus: "Injured", appearances: 22, goals: 1, assists: 0 },
    { id: 211, name: "Alexis Mac Allister", position: "CM", shirtNumber: 10, nationality: "Argentina", age: 25, height: "174cm", injuryStatus: "Fit", appearances: 26, goals: 4, assists: 7 },
  ],
  3: [ // Arsenal
    { id: 301, name: "Bukayo Saka", position: "RW", shirtNumber: 7, nationality: "England", age: 22, height: "178cm", injuryStatus: "Fit", appearances: 28, goals: 16, assists: 12 },
    { id: 302, name: "Martin Ødegaard", position: "AM", shirtNumber: 8, nationality: "Norway", age: 25, height: "178cm", injuryStatus: "Fit", appearances: 27, goals: 8, assists: 9 },
    { id: 303, name: "Declan Rice", position: "DM", shirtNumber: 41, nationality: "England", age: 25, height: "185cm", injuryStatus: "Fit", appearances: 29, goals: 6, assists: 7 },
    { id: 304, name: "Kai Havertz", position: "ST", shirtNumber: 29, nationality: "Germany", age: 24, height: "193cm", injuryStatus: "Fit", appearances: 29, goals: 12, assists: 6 },
    { id: 305, name: "Gabriel Jesus", position: "ST", shirtNumber: 9, nationality: "Brazil", age: 27, height: "175cm", injuryStatus: "Injured", appearances: 21, goals: 6, assists: 5 },
    { id: 306, name: "William Saliba", position: "CB", shirtNumber: 2, nationality: "France", age: 23, height: "192cm", injuryStatus: "Fit", appearances: 29, goals: 1, assists: 0 },
    { id: 307, name: "Gabriel Magalhães", position: "CB", shirtNumber: 6, nationality: "Brazil", age: 26, height: "190cm", injuryStatus: "Fit", appearances: 29, goals: 4, assists: 0 },
    { id: 308, name: "Leandro Trossard", position: "LW", shirtNumber: 19, nationality: "Belgium", age: 29, height: "172cm", injuryStatus: "Fit", appearances: 28, goals: 14, assists: 2 },
    { id: 309, name: "Ben White", position: "RB", shirtNumber: 4, nationality: "England", age: 26, height: "182cm", injuryStatus: "Fit", appearances: 29, goals: 0, assists: 5 },
    { id: 310, name: "David Raya", position: "GK", shirtNumber: 1, nationality: "Spain", age: 28, height: "183cm", injuryStatus: "Fit", appearances: 26, goals: 0, assists: 0 },
    { id: 311, name: "Jorginho", position: "CM", shirtNumber: 20, nationality: "Italy", age: 32, height: "180cm", injuryStatus: "Suspended", appearances: 22, goals: 1, assists: 2 },
  ],
};

// Add some players for other teams as well
[4, 5, 6, 7, 8, 9, 10].forEach(teamId => {
  playersByTeam[teamId] = [
    { id: teamId * 100 + 1, name: "Player 1", position: "ST", shirtNumber: 9, nationality: "England", age: 25, height: "180cm", injuryStatus: "Fit", appearances: 28, goals: 12, assists: 5 },
    { id: teamId * 100 + 2, name: "Player 2", position: "CM", shirtNumber: 8, nationality: "Spain", age: 28, height: "175cm", injuryStatus: "Fit", appearances: 29, goals: 5, assists: 10 },
    { id: teamId * 100 + 3, name: "Player 3", position: "CB", shirtNumber: 4, nationality: "France", age: 26, height: "190cm", injuryStatus: "Injured", appearances: 22, goals: 1, assists: 0 },
    { id: teamId * 100 + 4, name: "Player 4", position: "GK", shirtNumber: 1, nationality: "Germany", age: 29, height: "188cm", injuryStatus: "Fit", appearances: 29, goals: 0, assists: 0 },
    { id: teamId * 100 + 5, name: "Player 5", position: "LW", shirtNumber: 11, nationality: "Brazil", age: 24, height: "176cm", injuryStatus: "Fit", appearances: 27, goals: 8, assists: 7 },
    { id: teamId * 100 + 6, name: "Player 6", position: "RB", shirtNumber: 2, nationality: "Argentina", age: 27, height: "178cm", injuryStatus: "Doubtful", appearances: 25, goals: 0, assists: 3 },
    { id: teamId * 100 + 7, name: "Player 7", position: "LB", shirtNumber: 3, nationality: "Portugal", age: 28, height: "182cm", injuryStatus: "Fit", appearances: 28, goals: 2, assists: 4 },
    { id: teamId * 100 + 8, name: "Player 8", position: "DM", shirtNumber: 6, nationality: "Italy", age: 30, height: "185cm", injuryStatus: "Fit", appearances: 26, goals: 3, assists: 2 },
    { id: teamId * 100 + 9, name: "Player 9", position: "CM", shirtNumber: 10, nationality: "Belgium", age: 26, height: "179cm", injuryStatus: "Fit", appearances: 28, goals: 6, assists: 8 },
    { id: teamId * 100 + 10, name: "Player 10", position: "CB", shirtNumber: 5, nationality: "Netherlands", age: 29, height: "192cm", injuryStatus: "Suspended", appearances: 24, goals: 0, assists: 0 },
    { id: teamId * 100 + 11, name: "Player 11", position: "RW", shirtNumber: 7, nationality: "Croatia", age: 23, height: "176cm", injuryStatus: "Fit", appearances: 27, goals: 9, assists: 6 },
  ];
});

export const PlayerLineup = ({ teamId }: { teamId: number }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPosition, setSelectedPosition] = useState<string | null>(null);
  
  // Get players for this team
  const players = playersByTeam[teamId] || [];
  
  // Filter players based on search and position filter
  const filteredPlayers = players.filter(player => {
    const matchesSearch = player.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          player.nationality.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          player.position.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPosition = selectedPosition ? player.position === selectedPosition : true;
    return matchesSearch && matchesPosition;
  });
  
  // Get unique positions for filters
  const positions = Array.from(new Set(players.map(player => player.position)));
  
  // Get status badge
  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'Fit': 
        return <Badge variant="default" className="bg-green-500">Fit</Badge>;
      case 'Doubtful': 
        return <Badge variant="secondary" className="bg-yellow-500">Doubtful</Badge>;
      case 'Injured': 
        return <Badge variant="destructive">Injured</Badge>;
      case 'Suspended': 
        return <Badge variant="outline" className="border-red-500 text-red-500">Suspended</Badge>;
      default:
        return <Badge variant="default">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <Card className="w-full md:w-3/4">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl flex items-center gap-2">
              <Football className="h-5 w-5 text-primary" />
              Current Squad
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search players..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge 
                variant={selectedPosition === null ? "default" : "outline"} 
                className="cursor-pointer"
                onClick={() => setSelectedPosition(null)}
              >
                All Positions
              </Badge>
              {positions.map(position => (
                <Badge 
                  key={position} 
                  variant={selectedPosition === position ? "default" : "outline"} 
                  className="cursor-pointer"
                  onClick={() => setSelectedPosition(position === selectedPosition ? null : position)}
                >
                  {position}
                </Badge>
              ))}
            </div>
            
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[60px]">#</TableHead>
                    <TableHead>Player</TableHead>
                    <TableHead>Position</TableHead>
                    <TableHead>Nationality</TableHead>
                    <TableHead>Age</TableHead>
                    <TableHead>Height</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">G/A</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPlayers.map((player, index) => (
                    <TableRow key={player.id}>
                      <TableCell className="font-medium">{player.shirtNumber}</TableCell>
                      <TableCell>{player.name}</TableCell>
                      <TableCell>{player.position}</TableCell>
                      <TableCell className="flex items-center gap-1">
                        <Flag className="h-4 w-4" />
                        {player.nationality}
                      </TableCell>
                      <TableCell>{player.age}</TableCell>
                      <TableCell>{player.height}</TableCell>
                      <TableCell>{getStatusBadge(player.injuryStatus)}</TableCell>
                      <TableCell className="text-right">{player.goals}/{player.assists}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <Card className="w-full md:w-1/4">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Squad Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total Players</span>
                <span className="font-bold">{players.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Average Age</span>
                <span className="font-bold">
                  {(players.reduce((sum, p) => sum + p.age, 0) / players.length).toFixed(1)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total Goals</span>
                <span className="font-bold">{players.reduce((sum, p) => sum + p.goals, 0)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total Assists</span>
                <span className="font-bold">{players.reduce((sum, p) => sum + p.assists, 0)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Injured/Suspended</span>
                <span className="font-bold">{players.filter(p => p.injuryStatus === 'Injured' || p.injuryStatus === 'Suspended').length}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
