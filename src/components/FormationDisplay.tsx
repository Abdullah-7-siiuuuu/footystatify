
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Football } from "lucide-react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface FormationPlayer {
  id: number;
  name: string;
  position: string;
  shirtNumber: number;
  rating: number;
  isStarter: boolean;
}

interface Formation {
  name: string;
  players: FormationPlayer[];
  coordinates: Record<number, { x: number, y: number }>;
}

// Mock formation data by team
const formationsByTeam: Record<number, Formation[]> = {
  1: [ // Manchester City
    {
      name: "4-3-3",
      players: [
        { id: 111, name: "Ederson", position: "GK", shirtNumber: 31, rating: 7.8, isStarter: true },
        { id: 107, name: "Walker", position: "RB", shirtNumber: 2, rating: 7.7, isStarter: true },
        { id: 105, name: "Dias", position: "CB", shirtNumber: 3, rating: 8.1, isStarter: true },
        { id: 106, name: "Stones", position: "CB", shirtNumber: 5, rating: 7.9, isStarter: true },
        { id: 109, name: "Gvardiol", position: "LB", shirtNumber: 24, rating: 7.6, isStarter: true },
        { id: 103, name: "Rodri", position: "DM", shirtNumber: 16, rating: 8.4, isStarter: true },
        { id: 102, name: "De Bruyne", position: "CM", shirtNumber: 17, rating: 8.3, isStarter: true },
        { id: 110, name: "Silva", position: "CM", shirtNumber: 20, rating: 7.9, isStarter: true },
        { id: 104, name: "Foden", position: "LW", shirtNumber: 47, rating: 8.5, isStarter: true },
        { id: 101, name: "Haaland", position: "ST", shirtNumber: 9, rating: 8.7, isStarter: true },
        { id: 112, name: "Doku", position: "RW", shirtNumber: 11, rating: 7.6, isStarter: true },
        { id: 113, name: "Grealish", position: "LW", shirtNumber: 10, rating: 7.4, isStarter: false },
        { id: 114, name: "Kovacic", position: "CM", shirtNumber: 8, rating: 7.3, isStarter: false },
        { id: 115, name: "Akanji", position: "CB", shirtNumber: 25, rating: 7.4, isStarter: false },
        { id: 116, name: "Ortega", position: "GK", shirtNumber: 18, rating: 7.0, isStarter: false },
        { id: 117, name: "Lewis", position: "RB", shirtNumber: 82, rating: 7.1, isStarter: false },
        { id: 118, name: "Alvarez", position: "ST", shirtNumber: 19, rating: 7.5, isStarter: false },
      ],
      coordinates: {
        111: { x: 50, y: 90 }, // GK
        107: { x: 15, y: 70 }, // RB
        105: { x: 35, y: 70 }, // CB
        106: { x: 65, y: 70 }, // CB
        109: { x: 85, y: 70 }, // LB
        103: { x: 50, y: 55 }, // DM
        102: { x: 30, y: 40 }, // CM
        110: { x: 70, y: 40 }, // CM
        104: { x: 15, y: 25 }, // LW
        101: { x: 50, y: 15 }, // ST
        112: { x: 85, y: 25 }, // RW
      }
    },
    {
      name: "4-2-3-1",
      players: [
        { id: 111, name: "Ederson", position: "GK", shirtNumber: 31, rating: 7.8, isStarter: true },
        { id: 107, name: "Walker", position: "RB", shirtNumber: 2, rating: 7.7, isStarter: true },
        { id: 105, name: "Dias", position: "CB", shirtNumber: 3, rating: 8.1, isStarter: true },
        { id: 106, name: "Stones", position: "CB", shirtNumber: 5, rating: 7.9, isStarter: true },
        { id: 109, name: "Gvardiol", position: "LB", shirtNumber: 24, rating: 7.6, isStarter: true },
        { id: 103, name: "Rodri", position: "DM", shirtNumber: 16, rating: 8.4, isStarter: true },
        { id: 114, name: "Kovacic", position: "DM", shirtNumber: 8, rating: 7.3, isStarter: true },
        { id: 104, name: "Foden", position: "LW", shirtNumber: 47, rating: 8.5, isStarter: true },
        { id: 102, name: "De Bruyne", position: "CAM", shirtNumber: 17, rating: 8.3, isStarter: true },
        { id: 110, name: "Silva", position: "RW", shirtNumber: 20, rating: 7.9, isStarter: true },
        { id: 101, name: "Haaland", position: "ST", shirtNumber: 9, rating: 8.7, isStarter: true },
        { id: 113, name: "Grealish", position: "LW", shirtNumber: 10, rating: 7.4, isStarter: false },
        { id: 112, name: "Doku", position: "RW", shirtNumber: 11, rating: 7.6, isStarter: false },
        { id: 115, name: "Akanji", position: "CB", shirtNumber: 25, rating: 7.4, isStarter: false },
        { id: 116, name: "Ortega", position: "GK", shirtNumber: 18, rating: 7.0, isStarter: false },
        { id: 117, name: "Lewis", position: "RB", shirtNumber: 82, rating: 7.1, isStarter: false },
        { id: 118, name: "Alvarez", position: "ST", shirtNumber: 19, rating: 7.5, isStarter: false },
      ],
      coordinates: {
        111: { x: 50, y: 90 }, // GK
        107: { x: 15, y: 70 }, // RB
        105: { x: 35, y: 70 }, // CB
        106: { x: 65, y: 70 }, // CB
        109: { x: 85, y: 70 }, // LB
        103: { x: 35, y: 50 }, // DM
        114: { x: 65, y: 50 }, // DM
        104: { x: 15, y: 30 }, // LW
        102: { x: 50, y: 30 }, // CAM
        110: { x: 85, y: 30 }, // RW
        101: { x: 50, y: 15 }, // ST
      }
    }
  ],
  2: [ // Liverpool
    {
      name: "4-3-3",
      players: [
        { id: 204, name: "Alisson", position: "GK", shirtNumber: 1, rating: 8.0, isStarter: true },
        { id: 203, name: "Alexander-Arnold", position: "RB", shirtNumber: 66, rating: 8.2, isStarter: true },
        { id: 202, name: "Van Dijk", position: "CB", shirtNumber: 4, rating: 8.5, isStarter: true },
        { id: 210, name: "Konaté", position: "CB", shirtNumber: 5, rating: 7.8, isStarter: true },
        { id: 208, name: "Robertson", position: "LB", shirtNumber: 26, rating: 8.1, isStarter: true },
        { id: 211, name: "Mac Allister", position: "CM", shirtNumber: 10, rating: 7.9, isStarter: true },
        { id: 209, name: "Szoboszlai", position: "CM", shirtNumber: 8, rating: 7.6, isStarter: true },
        { id: 212, name: "Jones", position: "CM", shirtNumber: 17, rating: 7.5, isStarter: true },
        { id: 206, name: "Diaz", position: "LW", shirtNumber: 7, rating: 8.0, isStarter: true },
        { id: 205, name: "Nunez", position: "ST", shirtNumber: 9, rating: 7.7, isStarter: true },
        { id: 201, name: "Salah", position: "RW", shirtNumber: 11, rating: 8.7, isStarter: true },
        { id: 213, name: "Gakpo", position: "LW", shirtNumber: 18, rating: 7.4, isStarter: false },
        { id: 214, name: "Elliott", position: "CM", shirtNumber: 19, rating: 7.3, isStarter: false },
        { id: 215, name: "Gomez", position: "CB", shirtNumber: 2, rating: 7.2, isStarter: false },
        { id: 216, name: "Kelleher", position: "GK", shirtNumber: 62, rating: 7.0, isStarter: false },
        { id: 217, name: "Jota", position: "ST", shirtNumber: 20, rating: 7.8, isStarter: false },
      ],
      coordinates: {
        204: { x: 50, y: 90 }, // GK
        203: { x: 15, y: 70 }, // RB
        202: { x: 35, y: 70 }, // CB
        210: { x: 65, y: 70 }, // CB
        208: { x: 85, y: 70 }, // LB
        211: { x: 50, y: 50 }, // CM
        209: { x: 30, y: 50 }, // CM
        212: { x: 70, y: 50 }, // CM
        206: { x: 15, y: 25 }, // LW
        205: { x: 50, y: 15 }, // ST
        201: { x: 85, y: 25 }, // RW
      }
    }
  ],
  3: [ // Arsenal
    {
      name: "4-3-3",
      players: [
        { id: 310, name: "Raya", position: "GK", shirtNumber: 1, rating: 7.8, isStarter: true },
        { id: 309, name: "White", position: "RB", shirtNumber: 4, rating: 7.9, isStarter: true },
        { id: 306, name: "Saliba", position: "CB", shirtNumber: 2, rating: 8.4, isStarter: true },
        { id: 307, name: "Gabriel", position: "CB", shirtNumber: 6, rating: 8.2, isStarter: true },
        { id: 312, name: "Timber", position: "LB", shirtNumber: 12, rating: 7.7, isStarter: true },
        { id: 303, name: "Rice", position: "DM", shirtNumber: 41, rating: 8.5, isStarter: true },
        { id: 311, name: "Jorginho", position: "CM", shirtNumber: 20, rating: 7.5, isStarter: true },
        { id: 302, name: "Ødegaard", position: "CM", shirtNumber: 8, rating: 8.6, isStarter: true },
        { id: 308, name: "Trossard", position: "LW", shirtNumber: 19, rating: 7.8, isStarter: true },
        { id: 304, name: "Havertz", position: "ST", shirtNumber: 29, rating: 7.9, isStarter: true },
        { id: 301, name: "Saka", position: "RW", shirtNumber: 7, rating: 8.7, isStarter: true },
        { id: 305, name: "Jesus", position: "ST", shirtNumber: 9, rating: 7.6, isStarter: false },
        { id: 313, name: "Martinelli", position: "LW", shirtNumber: 11, rating: 7.9, isStarter: false },
        { id: 314, name: "Partey", position: "DM", shirtNumber: 5, rating: 7.8, isStarter: false },
        { id: 315, name: "Ramsdale", position: "GK", shirtNumber: 32, rating: 7.4, isStarter: false },
      ],
      coordinates: {
        310: { x: 50, y: 90 }, // GK
        309: { x: 15, y: 70 }, // RB
        306: { x: 35, y: 70 }, // CB
        307: { x: 65, y: 70 }, // CB
        312: { x: 85, y: 70 }, // LB
        303: { x: 50, y: 55 }, // DM
        311: { x: 30, y: 40 }, // CM
        302: { x: 70, y: 40 }, // CM
        308: { x: 15, y: 25 }, // LW
        304: { x: 50, y: 15 }, // ST
        301: { x: 85, y: 25 }, // RW
      }
    }
  ]
};

// Add default formations for other teams
[4, 5, 6, 7, 8, 9, 10].forEach(teamId => {
  formationsByTeam[teamId] = [
    {
      name: "4-4-2",
      players: [
        { id: teamId * 100 + 1, name: "GK Player", position: "GK", shirtNumber: 1, rating: 7.5, isStarter: true },
        { id: teamId * 100 + 2, name: "RB Player", position: "RB", shirtNumber: 2, rating: 7.3, isStarter: true },
        { id: teamId * 100 + 3, name: "CB Player 1", position: "CB", shirtNumber: 3, rating: 7.4, isStarter: true },
        { id: teamId * 100 + 4, name: "CB Player 2", position: "CB", shirtNumber: 4, rating: 7.4, isStarter: true },
        { id: teamId * 100 + 5, name: "LB Player", position: "LB", shirtNumber: 5, rating: 7.3, isStarter: true },
        { id: teamId * 100 + 6, name: "RM Player", position: "RM", shirtNumber: 7, rating: 7.6, isStarter: true },
        { id: teamId * 100 + 7, name: "CM Player 1", position: "CM", shirtNumber: 8, rating: 7.8, isStarter: true },
        { id: teamId * 100 + 8, name: "CM Player 2", position: "CM", shirtNumber: 6, rating: 7.7, isStarter: true },
        { id: teamId * 100 + 9, name: "LM Player", position: "LM", shirtNumber: 11, rating: 7.6, isStarter: true },
        { id: teamId * 100 + 10, name: "ST Player 1", position: "ST", shirtNumber: 9, rating: 7.9, isStarter: true },
        { id: teamId * 100 + 11, name: "ST Player 2", position: "ST", shirtNumber: 10, rating: 7.8, isStarter: true },
        { id: teamId * 100 + 12, name: "Sub GK", position: "GK", shirtNumber: 13, rating: 7.0, isStarter: false },
        { id: teamId * 100 + 13, name: "Sub DEF", position: "CB", shirtNumber: 14, rating: 7.1, isStarter: false },
        { id: teamId * 100 + 14, name: "Sub MID", position: "CM", shirtNumber: 15, rating: 7.2, isStarter: false },
        { id: teamId * 100 + 15, name: "Sub FWD", position: "ST", shirtNumber: 16, rating: 7.3, isStarter: false },
      ],
      coordinates: {
        [teamId * 100 + 1]: { x: 50, y: 90 }, // GK
        [teamId * 100 + 2]: { x: 15, y: 70 }, // RB
        [teamId * 100 + 3]: { x: 35, y: 70 }, // CB
        [teamId * 100 + 4]: { x: 65, y: 70 }, // CB
        [teamId * 100 + 5]: { x: 85, y: 70 }, // LB
        [teamId * 100 + 6]: { x: 15, y: 45 }, // RM
        [teamId * 100 + 7]: { x: 35, y: 45 }, // CM
        [teamId * 100 + 8]: { x: 65, y: 45 }, // CM
        [teamId * 100 + 9]: { x: 85, y: 45 }, // LM
        [teamId * 100 + 10]: { x: 35, y: 20 }, // ST
        [teamId * 100 + 11]: { x: 65, y: 20 }, // ST
      }
    }
  ];
});

export const FormationDisplay = ({ teamId }: { teamId: number }) => {
  const [activeFormation, setActiveFormation] = useState<string>("4-3-3");
  
  // Get formations for this team
  const formations = formationsByTeam[teamId] || [];
  const formation = formations.find(f => f.name === activeFormation) || formations[0];
  
  // Get starters and substitutes
  const starters = formation.players.filter(p => p.isStarter);
  const substitutes = formation.players.filter(p => !p.isStarter);
  
  // Get player rating color
  const getRatingColor = (rating: number): string => {
    if (rating >= 8.5) return "text-emerald-500";
    if (rating >= 8.0) return "text-green-500";
    if (rating >= 7.5) return "text-lime-500";
    if (rating >= 7.0) return "text-yellow-500";
    if (rating >= 6.5) return "text-amber-500";
    if (rating >= 6.0) return "text-orange-500";
    return "text-red-500";
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-xl flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Team Formation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeFormation} onValueChange={setActiveFormation} className="mb-4">
            <TabsList>
              {formations.map(formation => (
                <TabsTrigger key={formation.name} value={formation.name}>
                  {formation.name}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8">
              <div className="relative h-[500px] bg-emerald-900 rounded-lg p-4 overflow-hidden">
                {/* Field markings */}
                <div className="absolute inset-0 flex flex-col">
                  {/* Center circle */}
                  <div className="absolute left-1/2 top-1/2 w-[100px] h-[100px] border-2 border-white/40 rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
                  {/* Center line */}
                  <div className="absolute left-0 top-1/2 w-full h-0.5 bg-white/40 transform -translate-y-1/2"></div>
                  {/* Penalty areas */}
                  <div className="absolute left-1/2 top-[5%] w-[200px] h-[80px] border-2 border-white/40 transform -translate-x-1/2"></div>
                  <div className="absolute left-1/2 bottom-[5%] w-[200px] h-[80px] border-2 border-white/40 transform -translate-x-1/2"></div>
                  {/* Goal lines */}
                  <div className="absolute left-1/2 top-0 w-[100px] h-2 bg-white transform -translate-x-1/2"></div>
                  <div className="absolute left-1/2 bottom-0 w-[100px] h-2 bg-white transform -translate-x-1/2"></div>
                </div>
                
                {/* Players */}
                {starters.map(player => {
                  const coords = formation.coordinates[player.id];
                  if (!coords) return null;
                  
                  return (
                    <motion.div
                      key={player.id}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5 }}
                      className="absolute transform -translate-x-1/2 -translate-y-1/2"
                      style={{ left: `${coords.x}%`, top: `${coords.y}%` }}
                    >
                      <div className="flex flex-col items-center">
                        <div className="relative mb-1">
                          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white text-black font-bold">
                            {player.shirtNumber}
                          </div>
                          <div className={`absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs ${getRatingColor(player.rating)} bg-white font-bold`}>
                            {player.rating.toFixed(1)}
                          </div>
                        </div>
                        <span className="text-xs bg-black/70 text-white px-2 py-0.5 rounded whitespace-nowrap">
                          {player.name}
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
            
            <div className="lg:col-span-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Football className="h-4 w-4 text-primary" />
                    Squad List
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-semibold mb-2">Starting XI</h4>
                      <div className="space-y-2">
                        {starters.map(player => (
                          <div key={player.id} className="flex items-center justify-between text-sm p-1 hover:bg-secondary/50 rounded">
                            <div className="flex items-center gap-2">
                              <span className="w-5 text-center font-semibold">{player.shirtNumber}</span>
                              <span>{player.name}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline">{player.position}</Badge>
                              <span className={`font-bold ${getRatingColor(player.rating)}`}>{player.rating.toFixed(1)}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-semibold mb-2">Substitutes</h4>
                      <div className="space-y-2">
                        {substitutes.map(player => (
                          <div key={player.id} className="flex items-center justify-between text-sm p-1 hover:bg-secondary/50 rounded text-muted-foreground">
                            <div className="flex items-center gap-2">
                              <span className="w-5 text-center font-semibold">{player.shirtNumber}</span>
                              <span>{player.name}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline">{player.position}</Badge>
                              <span className={`font-bold ${getRatingColor(player.rating)}`}>{player.rating.toFixed(1)}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="mt-4">
                <CardContent className="pt-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Average Rating</span>
                      <span className="font-bold">
                        {(starters.reduce((sum, p) => sum + p.rating, 0) / starters.length).toFixed(1)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Formation Strength</span>
                      <div className="w-32 bg-gray-200 rounded-full h-2.5">
                        <div 
                          className="bg-primary h-2.5 rounded-full" 
                          style={{ width: `${Math.min(starters.reduce((sum, p) => sum + p.rating, 0) / starters.length / 10 * 100, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Tactical Style</span>
                      <Badge>
                        {teamId === 1 ? "Possession" : teamId === 2 ? "Counter-Press" : "Balanced"}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
