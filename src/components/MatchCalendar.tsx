
import { useState } from "react";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { format, isSameDay, addDays, subDays, parseISO } from "date-fns";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Enhanced match data with complete dates for May 2024
const calendarMatchData = [
  {
    id: 1,
    homeTeam: "Manchester United",
    awayTeam: "Liverpool",
    date: "2024-05-15T15:00:00",
    competition: "Premier League",
    status: "upcoming",
    venue: "Old Trafford",
    tickets: "Limited Availability"
  },
  {
    id: 2,
    homeTeam: "Barcelona",
    awayTeam: "Real Madrid",
    date: "2024-05-14T19:45:00",
    competition: "La Liga",
    score: "3 - 3",
    status: "completed",
    venue: "Camp Nou",
    attendance: "95,000"
  },
  {
    id: 3,
    homeTeam: "Bayern Munich",
    awayTeam: "Dortmund",
    date: "2024-05-13T17:30:00",
    competition: "Bundesliga",
    score: "4 - 0",
    status: "completed",
    venue: "Allianz Arena",
    attendance: "75,000"
  },
  {
    id: 4,
    homeTeam: "AC Milan",
    awayTeam: "Inter Milan",
    date: "2024-05-17T19:45:00",
    competition: "Serie A",
    status: "upcoming",
    venue: "San Siro",
    tickets: "Sold Out"
  },
  {
    id: 5,
    homeTeam: "PSG",
    awayTeam: "Marseille",
    date: "2024-05-18T20:00:00",
    competition: "Ligue 1",
    status: "upcoming",
    venue: "Parc des Princes",
    tickets: "Available"
  },
  {
    id: 6,
    homeTeam: "Arsenal",
    awayTeam: "Chelsea",
    date: "2024-05-20T19:45:00",
    competition: "Premier League",
    status: "upcoming",
    venue: "Emirates Stadium",
    tickets: "Limited Availability"
  },
  {
    id: 7,
    homeTeam: "Ajax",
    awayTeam: "PSV",
    date: "2024-05-12T14:30:00",
    competition: "Eredivisie",
    score: "2 - 1",
    status: "completed",
    venue: "Johan Cruyff Arena",
    attendance: "52,000"
  },
  {
    id: 8,
    homeTeam: "Juventus",
    awayTeam: "Roma",
    date: "2024-05-11T17:00:00",
    competition: "Serie A",
    score: "1 - 0",
    status: "completed",
    venue: "Allianz Stadium",
    attendance: "41,500"
  },
  {
    id: 9,
    homeTeam: "Liverpool",
    awayTeam: "Tottenham",
    date: "2024-05-01T15:00:00",
    competition: "Premier League",
    score: "2 - 1",
    status: "completed",
    venue: "Anfield",
    attendance: "53,000"
  },
  {
    id: 10,
    homeTeam: "Real Madrid",
    awayTeam: "Atletico Madrid",
    date: "2024-05-02T20:00:00",
    competition: "La Liga",
    score: "3 - 1",
    status: "completed",
    venue: "Santiago Bernabeu",
    attendance: "80,000"
  },
  {
    id: 11,
    homeTeam: "Manchester City",
    awayTeam: "Arsenal",
    date: "2024-05-04T17:30:00",
    competition: "Premier League",
    score: "2 - 2",
    status: "completed",
    venue: "Etihad Stadium",
    attendance: "55,000"
  },
  {
    id: 12,
    homeTeam: "Bayer Leverkusen",
    awayTeam: "RB Leipzig",
    date: "2024-05-05T14:30:00",
    competition: "Bundesliga",
    score: "3 - 2",
    status: "completed",
    venue: "BayArena",
    attendance: "30,000"
  },
  {
    id: 13,
    homeTeam: "Napoli",
    awayTeam: "AC Milan",
    date: "2024-05-08T19:45:00",
    competition: "Serie A",
    score: "0 - 1",
    status: "completed",
    venue: "Diego Armando Maradona Stadium",
    attendance: "47,000"
  },
  {
    id: 14,
    homeTeam: "Lyon",
    awayTeam: "Monaco",
    date: "2024-05-09T20:00:00",
    competition: "Ligue 1",
    score: "2 - 2",
    status: "completed",
    venue: "Groupama Stadium",
    attendance: "49,000"
  },
  {
    id: 15,
    homeTeam: "Barcelona",
    awayTeam: "Sevilla",
    date: "2024-05-21T20:00:00",
    competition: "La Liga",
    status: "upcoming",
    venue: "Camp Nou",
    tickets: "Available"
  },
  {
    id: 16,
    homeTeam: "Dortmund",
    awayTeam: "Eintracht Frankfurt",
    date: "2024-05-24T19:30:00",
    competition: "Bundesliga",
    status: "upcoming",
    venue: "Signal Iduna Park",
    tickets: "Available"
  },
  {
    id: 17,
    homeTeam: "Juventus",
    awayTeam: "Inter Milan",
    date: "2024-05-26T19:45:00",
    competition: "Serie A",
    status: "upcoming",
    venue: "Allianz Stadium",
    tickets: "Limited Availability"
  },
  {
    id: 18,
    homeTeam: "PSG",
    awayTeam: "Lyon",
    date: "2024-05-28T20:00:00",
    competition: "Ligue 1",
    status: "upcoming",
    venue: "Parc des Princes",
    tickets: "Available"
  }
];

export const MatchCalendar = () => {
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState(today);
  const [viewMode, setViewMode] = useState<'upcoming' | 'past'>('upcoming');

  const navigateDate = (direction: 'prev' | 'next') => {
    setSelectedDate(prev => 
      direction === 'prev' ? subDays(prev, 1) : addDays(prev, 1)
    );
  };

  // Filter matches by selected date and view mode
  const todayMatches = calendarMatchData.filter(match => {
    const matchDate = parseISO(match.date);
    return isSameDay(matchDate, selectedDate);
  });

  const upcomingMatches = calendarMatchData.filter(match => 
    match.status === 'upcoming' && new Date(match.date) >= new Date()
  ).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const pastMatches = calendarMatchData.filter(match => 
    match.status === 'completed'
  ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="bg-card rounded-lg border shadow-sm p-6 max-w-4xl w-full mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CalendarIcon className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold">Match Calendar</h2>
        </div>
        <div className="flex space-x-2">
          <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as 'upcoming' | 'past')}>
            <TabsList>
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="past">Past</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>
      
      <div className="border-b pb-4">
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="icon" onClick={() => navigateDate('prev')}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h3 className="text-lg font-medium">
            {format(selectedDate, 'EEEE, MMMM d, yyyy')}
          </h3>
          <Button variant="ghost" size="icon" onClick={() => navigateDate('next')}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="mt-4">
          {todayMatches.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">No matches scheduled for this day.</p>
          ) : (
            <div className="space-y-3">
              {todayMatches.map((match) => (
                <MatchCard key={match.id} match={match} />
              ))}
            </div>
          )}
        </div>
      </div>
      
      <Tabs value={viewMode}>
        <TabsContent value="upcoming" className="mt-0 pt-0">
          <ScrollArea className="h-[400px]">
            <div className="space-y-5">
              {upcomingMatches.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No upcoming matches scheduled.</p>
              ) : (
                upcomingMatches.map((match, index) => (
                  <motion.div 
                    key={match.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <div className="mb-2">
                      <p className="text-sm text-muted-foreground">
                        {format(parseISO(match.date), 'EEEE, MMMM d')}
                      </p>
                    </div>
                    <MatchCard match={match} />
                  </motion.div>
                ))
              )}
            </div>
          </ScrollArea>
        </TabsContent>
        
        <TabsContent value="past" className="mt-0 pt-0">
          <ScrollArea className="h-[400px]">
            <div className="space-y-5">
              {pastMatches.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No past matches to display.</p>
              ) : (
                pastMatches.map((match, index) => (
                  <motion.div 
                    key={match.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <div className="mb-2">
                      <p className="text-sm text-muted-foreground">
                        {format(parseISO(match.date), 'EEEE, MMMM d')}
                      </p>
                    </div>
                    <MatchCard match={match} />
                  </motion.div>
                ))
              )}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
};

type MatchCardProps = {
  match: {
    id: number;
    homeTeam: string;
    awayTeam: string;
    date: string;
    competition: string;
    score?: string;
    status: string;
    venue: string;
    tickets?: string;
    attendance?: string;
  };
};

const MatchCard = ({ match }: MatchCardProps) => {
  const matchTime = format(parseISO(match.date), 'HH:mm');
  
  return (
    <Card className="hover:bg-secondary/20 transition-colors">
      <CardContent className="p-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <Badge variant="outline" className="mb-2">{match.competition}</Badge>
            <div className="flex items-center gap-3">
              <div className="text-right w-[120px] font-medium">{match.homeTeam}</div>
              <div className="flex items-center w-[70px] justify-center">
                {match.status === 'completed' ? (
                  <span className="font-bold">{match.score}</span>
                ) : (
                  <span className="text-muted-foreground">{matchTime}</span>
                )}
              </div>
              <div className="w-[120px] font-medium">{match.awayTeam}</div>
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              <p>{match.venue} • {match.status === 'completed' ? `Attendance: ${match.attendance}` : `Tickets: ${match.tickets}`}</p>
            </div>
          </div>
          <div>
            <Badge variant={match.status === 'upcoming' ? 'secondary' : 'outline'}>
              {match.status === 'upcoming' ? 'Upcoming' : 'Completed'}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
