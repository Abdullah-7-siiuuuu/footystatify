import { toast } from "sonner";

// Types
export interface PlayerStats {
  goals: number;
  assists: number;
  matches: number;
}

export interface PlayerDetailedStats {
  passingAccuracy: number;
  shotsOnTarget: number;
  tacklesWon: number;
  possession: number;
  minutesPlayed: number;
  distanceCovered: number;
  yellowCards: number;
  redCards: number;
  formTrend: { match: string, rating: number }[];
  heatmap: { zone: string, value: number }[];
  xGPerMatch: number;
}

export interface Player {
  id: number;
  name: string;
  team: string;
  position: string;
  stats: PlayerStats;
  detailedStats: PlayerDetailedStats;
  image: string;
}

export interface Match {
  id: number;
  homeTeam: string;
  awayTeam: string;
  score: string;
  date: string;
  competition: string;
  stats: {
    possession: { home: number, away: number };
    shots: { home: number, away: number };
    shotsOnTarget: { home: number, away: number };
    corners: { home: number, away: number };
    fouls: { home: number, away: number };
    passes: { home: number, away: number };
    passingAccuracy: { home: number, away: number };
    yellowCards: { home: number, away: number };
    redCards: { home: number, away: number };
    tackles: { home: number, away: number };
    clearances: { home: number, away: number };
    offsides: { home: number, away: number };
    goalKicks: { home: number, away: number };
    throwIns: { home: number, away: number };
    attackingThird: { home: number, away: number };
  };
  timeline: {
    minute: number;
    event: string;
    team: string;
    player: string;
  }[];
  heatmap: {
    home: { defense: number, midfield: number, attack: number };
    away: { defense: number, midfield: number, attack: number };
  };
  playerRatings: {
    home: { player: string, rating: number }[];
    away: { player: string, rating: number }[];
  };
  xG: { home: number, away: number };
}

// API Configuration
const API_URL = import.meta.env.VITE_API_URL || 'https://api.example.com';

// Utility function for API requests
async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_API_KEY || ''}`,
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `API Error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    toast.error(error instanceof Error ? error.message : 'Failed to fetch data');
    throw error;
  }
}

// API Services
export const PlayerService = {
  async getPlayers(search?: string): Promise<Player[]> {
    let endpoint = '/players';
    if (search) {
      endpoint += `?search=${encodeURIComponent(search)}`;
    }
    return apiRequest<Player[]>(endpoint);
  },

  async getPlayerById(id: number): Promise<Player> {
    return apiRequest<Player>(`/players/${id}`);
  }
};

export const MatchService = {
  async getMatches(league?: string): Promise<Match[]> {
    let endpoint = '/matches';
    if (league && league !== 'All Leagues') {
      endpoint += `?league=${encodeURIComponent(league)}`;
    }
    return apiRequest<Match[]>(endpoint);
  },

  async getMatchById(id: number): Promise<Match> {
    return apiRequest<Match>(`/matches/${id}`);
  }
};

// Fallback Mock Data Provider (for development without API)
// This can be used when the API is not available or during development
export const UseMockData = {
  getPlayers(): Player[] {
    return [
      {
        id: 1,
        name: "Marcus Rashford",
        team: "Manchester United",
        position: "Forward",
        stats: {
          goals: 15,
          assists: 7,
          matches: 28,
        },
        detailedStats: {
          passingAccuracy: 78,
          shotsOnTarget: 42,
          tacklesWon: 24,
          possession: 65,
          minutesPlayed: 2340,
          distanceCovered: 245.6,
          yellowCards: 2,
          redCards: 0,
          formTrend: [
            { match: "vs ARS", rating: 7.2 },
            { match: "vs CHE", rating: 6.5 },
            { match: "vs LIV", rating: 8.1 },
            { match: "vs TOT", rating: 7.8 },
            { match: "vs MCI", rating: 6.9 },
          ],
          heatmap: [
            { zone: "Left Wing", value: 65 },
            { zone: "Center", value: 25 },
            { zone: "Right Wing", value: 10 },
          ],
          xGPerMatch: 0.68,
        },
        image: "/placeholder.svg"
      },
      {
        id: 2,
        name: "Kevin De Bruyne",
        team: "Manchester City",
        position: "Midfielder",
        stats: {
          goals: 8,
          assists: 16,
          matches: 25,
        },
        detailedStats: {
          passingAccuracy: 89,
          shotsOnTarget: 28,
          tacklesWon: 32,
          possession: 72,
          minutesPlayed: 2160,
          distanceCovered: 268.3,
          yellowCards: 3,
          redCards: 0,
          formTrend: [
            { match: "vs ARS", rating: 8.5 },
            { match: "vs CHE", rating: 7.9 },
            { match: "vs LIV", rating: 8.7 },
            { match: "vs TOT", rating: 7.2 },
            { match: "vs MUN", rating: 9.1 },
          ],
          heatmap: [
            { zone: "Left Wing", value: 15 },
            { zone: "Center", value: 70 },
            { zone: "Right Wing", value: 15 },
          ],
          xGPerMatch: 0.42,
        },
        image: "/placeholder.svg"
      },
      {
        id: 3,
        name: "Virgil van Dijk",
        team: "Liverpool",
        position: "Defender",
        stats: {
          goals: 3,
          assists: 1,
          matches: 30,
        },
        detailedStats: {
          passingAccuracy: 92,
          shotsOnTarget: 10,
          tacklesWon: 65,
          possession: 58,
          minutesPlayed: 2700,
          distanceCovered: 224.7,
          yellowCards: 4,
          redCards: 0,
          formTrend: [
            { match: "vs ARS", rating: 7.8 },
            { match: "vs CHE", rating: 8.2 },
            { match: "vs MCI", rating: 7.5 },
            { match: "vs TOT", rating: 8.0 },
            { match: "vs MUN", rating: 8.4 },
          ],
          heatmap: [
            { zone: "Left CB", value: 45 },
            { zone: "Right CB", value: 55 },
            { zone: "CDM", value: 10 },
          ],
          xGPerMatch: 0.12,
        },
        image: "/placeholder.svg"
      }
    ];
  },
  
  getMatches(): Match[] {
    return [
      {
        id: 1,
        homeTeam: "Manchester United",
        awayTeam: "Liverpool",
        score: "2 - 1",
        date: "2024-03-15",
        competition: "Premier League",
        stats: {
          possession: { home: 55, away: 45 },
          shots: { home: 12, away: 8 },
          shotsOnTarget: { home: 6, away: 3 },
          corners: { home: 7, away: 5 },
          fouls: { home: 10, away: 12 },
          passes: { home: 423, away: 389 },
          passingAccuracy: { home: 78, away: 82 },
          yellowCards: { home: 2, away: 3 },
          redCards: { home: 0, away: 0 },
          tackles: { home: 22, away: 18 },
          clearances: { home: 15, away: 21 },
          offsides: { home: 2, away: 3 },
          goalKicks: { home: 8, away: 10 },
          throwIns: { home: 24, away: 22 },
          attackingThird: { home: 58, away: 42 },
        },
        timeline: [
          { minute: 12, event: "Goal", team: "home", player: "Marcus Rashford" },
          { minute: 36, event: "Yellow Card", team: "away", player: "Virgil van Dijk" },
          { minute: 45, event: "Goal", team: "away", player: "Mohamed Salah" },
          { minute: 78, event: "Goal", team: "home", player: "Bruno Fernandes" },
        ],
        heatmap: {
          home: { defense: 30, midfield: 40, attack: 30 },
          away: { defense: 40, midfield: 35, attack: 25 },
        },
        playerRatings: {
          home: [
            { player: "De Gea", rating: 7.8 },
            { player: "Shaw", rating: 7.2 },
            { player: "Maguire", rating: 6.9 },
          ],
          away: [
            { player: "Alisson", rating: 7.5 },
            { player: "Van Dijk", rating: 7.0 },
            { player: "Salah", rating: 8.1 },
          ],
        },
        xG: { home: 2.3, away: 1.8 },
      }
    ];
  },
  
  // Utility to simulate API delay for development
  delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
};
