import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const matchData = [
  {
    id: 1,
    homeTeam: "Manchester United",
    awayTeam: "Liverpool",
    score: "2 - 1",
    date: "2024-03-15",
    competition: "Premier League",
  },
  {
    id: 2,
    homeTeam: "Barcelona",
    awayTeam: "Real Madrid",
    score: "3 - 3",
    date: "2024-03-14",
    competition: "La Liga",
  },
  {
    id: 3,
    homeTeam: "Bayern Munich",
    awayTeam: "Dortmund",
    score: "4 - 0",
    date: "2024-03-13",
    competition: "Bundesliga",
  },
];

export const MatchesTable = () => {
  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold mb-4">Recent Matches</h2>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Competition</TableHead>
              <TableHead>Home Team</TableHead>
              <TableHead>Score</TableHead>
              <TableHead>Away Team</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {matchData.map((match) => (
              <TableRow key={match.id}>
                <TableCell>{match.date}</TableCell>
                <TableCell>{match.competition}</TableCell>
                <TableCell>{match.homeTeam}</TableCell>
                <TableCell className="font-bold">{match.score}</TableCell>
                <TableCell>{match.awayTeam}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};