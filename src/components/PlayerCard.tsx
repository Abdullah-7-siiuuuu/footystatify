
import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface PlayerCardProps {
  id: number;
  name: string;
  team: string;
  position: string;
  stats: {
    goals: number;
    assists: number;
    matches: number;
  };
  image: string;
}

export const PlayerCard = ({ id, name, team, position, stats, image }: PlayerCardProps) => {
  const navigate = useNavigate();
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="h-full"
    >
      <Card className="h-full flex flex-col">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <Avatar className="h-10 w-10">
              <AvatarImage src={image} alt={name} />
              <AvatarFallback>{name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
            </Avatar>
            <Badge variant="outline" className="ml-auto">
              {position}
            </Badge>
          </div>
          <CardTitle className="text-xl mt-2">{name}</CardTitle>
          <CardDescription>{team}</CardDescription>
        </CardHeader>
        <CardContent className="pb-2">
          <div className="grid grid-cols-3 gap-2 text-center">
            <div>
              <p className="text-xs text-muted-foreground">Goals</p>
              <p className="text-lg font-bold">{stats.goals}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Assists</p>
              <p className="text-lg font-bold">{stats.assists}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Matches</p>
              <p className="text-lg font-bold">{stats.matches}</p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="mt-auto pt-2">
          <Button 
            variant="default" 
            size="sm" 
            className="w-full"
            onClick={() => navigate(`/players/${id}`)}
          >
            View Stats <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};
