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
        image: "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=400&h=400&fit=crop&q=80"
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
        image: "https://images.unsplash.com/photo-1632150403063-b067959aed6d?w=400&h=400&fit=crop&q=80"
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
        image: "https://images.unsplash.com/photo-1605235186583-a8272b61f9fe?w=400&h=400&fit=crop&q=80"
      },
      {
        id: 4,
        name: "Erling Haaland",
        team: "Manchester City",
        position: "Forward",
        stats: {
          goals: 27,
          assists: 5,
          matches: 26,
        },
        detailedStats: {
          passingAccuracy: 76,
          shotsOnTarget: 58,
          tacklesWon: 12,
          possession: 42,
          minutesPlayed: 2230,
          distanceCovered: 236.8,
          yellowCards: 3,
          redCards: 0,
          formTrend: [
            { match: "vs ARS", rating: 8.9 },
            { match: "vs CHE", rating: 7.6 },
            { match: "vs LIV", rating: 9.2 },
            { match: "vs TOT", rating: 8.5 },
            { match: "vs MUN", rating: 8.7 },
          ],
          heatmap: [
            { zone: "Center", value: 80 },
            { zone: "Left Wing", value: 10 },
            { zone: "Right Wing", value: 10 },
          ],
          xGPerMatch: 0.98,
        },
        image: "https://images.unsplash.com/photo-1560012057-4372e14c5085?w=400&h=400&fit=crop&q=80"
      },
      {
        id: 5,
        name: "Mohammed Salah",
        team: "Liverpool",
        position: "Forward",
        stats: {
          goals: 19,
          assists: 9,
          matches: 29,
        },
        detailedStats: {
          passingAccuracy: 82,
          shotsOnTarget: 46,
          tacklesWon: 18,
          possession: 54,
          minutesPlayed: 2520,
          distanceCovered: 258.4,
          yellowCards: 1,
          redCards: 0,
          formTrend: [
            { match: "vs ARS", rating: 8.4 },
            { match: "vs CHE", rating: 7.8 },
            { match: "vs MCI", rating: 8.6 },
            { match: "vs TOT", rating: 7.9 },
            { match: "vs MUN", rating: 8.8 },
          ],
          heatmap: [
            { zone: "Right Wing", value: 75 },
            { zone: "Center", value: 20 },
            { zone: "Left Wing", value: 5 },
          ],
          xGPerMatch: 0.76,
        },
        image: "https://images.unsplash.com/photo-1564415900645-99cdb8dcba34?w=400&h=400&fit=crop&q=80"
      },
      {
        id: 6,
        name: "Trent Alexander-Arnold",
        team: "Liverpool",
        position: "Defender",
        stats: {
          goals: 2,
          assists: 12,
          matches: 27,
        },
        detailedStats: {
          passingAccuracy: 86,
          shotsOnTarget: 18,
          tacklesWon: 42,
          possession: 64,
          minutesPlayed: 2380,
          distanceCovered: 267.2,
          yellowCards: 3,
          redCards: 0,
          formTrend: [
            { match: "vs ARS", rating: 8.1 },
            { match: "vs CHE", rating: 7.5 },
            { match: "vs MCI", rating: 7.9 },
            { match: "vs TOT", rating: 8.3 },
            { match: "vs MUN", rating: 7.6 },
          ],
          heatmap: [
            { zone: "Right Back", value: 70 },
            { zone: "Right Wing", value: 25 },
            { zone: "Center", value: 5 },
          ],
          xGPerMatch: 0.22,
        },
        image: "https://images.unsplash.com/photo-1552699498-ec96cf4164d5?w=400&h=400&fit=crop&q=80"
      },
      {
        id: 7,
        name: "Phil Foden",
        team: "Manchester City",
        position: "Midfielder",
        stats: {
          goals: 11,
          assists: 8,
          matches: 25,
        },
        detailedStats: {
          passingAccuracy: 85,
          shotsOnTarget: 34,
          tacklesWon: 28,
          possession: 67,
          minutesPlayed: 2100,
          distanceCovered: 238.5,
          yellowCards: 2,
          redCards: 0,
          formTrend: [
            { match: "vs ARS", rating: 8.7 },
            { match: "vs CHE", rating: 7.9 },
            { match: "vs LIV", rating: 8.2 },
            { match: "vs TOT", rating: 8.5 },
            { match: "vs MCI", rating: 8.9 },
          ],
          heatmap: [
            { zone: "Left Wing", value: 25 },
            { zone: "Center", value: 60 },
            { zone: "Right Wing", value: 15 },
          ],
          xGPerMatch: 0.52,
        },
        image: "https://images.unsplash.com/photo-1589725391918-9da066fade29?w=400&h=400&fit=crop&q=80"
      },
      {
        id: 8,
        name: "Martin Ødegaard",
        team: "Arsenal",
        position: "Midfielder",
        stats: {
          goals: 9,
          assists: 11,
          matches: 28,
        },
        detailedStats: {
          passingAccuracy: 87,
          shotsOnTarget: 26,
          tacklesWon: 32,
          possession: 70,
          minutesPlayed: 2480,
          distanceCovered: 272.6,
          yellowCards: 2,
          redCards: 0,
          formTrend: [
            { match: "vs LIV", rating: 8.3 },
            { match: "vs CHE", rating: 8.6 },
            { match: "vs MCI", rating: 7.8 },
            { match: "vs TOT", rating: 9.0 },
            { match: "vs MUN", rating: 8.2 },
          ],
          heatmap: [
            { zone: "Center", value: 75 },
            { zone: "Right Wing", value: 15 },
            { zone: "Left Wing", value: 10 },
          ],
          xGPerMatch: 0.38,
        },
        image: "https://images.unsplash.com/photo-1624280157150-4d1ed8632989?w=400&h=400&fit=crop&q=80"
      },
      {
        id: 9,
        name: "Bruno Fernandes",
        team: "Manchester United",
        position: "Midfielder",
        stats: {
          goals: 7,
          assists: 12,
          matches: 29,
        },
        detailedStats: {
          passingAccuracy: 83,
          shotsOnTarget: 36,
          tacklesWon: 29,
          possession: 62,
          minutesPlayed: 2610,
          distanceCovered: 283.2,
          yellowCards: 5,
          redCards: 0,
          formTrend: [
            { match: "vs ARS", rating: 7.6 },
            { match: "vs CHE", rating: 8.1 },
            { match: "vs LIV", rating: 6.8 },
            { match: "vs TOT", rating: 8.4 },
            { match: "vs MCI", rating: 7.2 },
          ],
          heatmap: [
            { zone: "Center", value: 80 },
            { zone: "Right Wing", value: 10 },
            { zone: "Left Wing", value: 10 },
          ],
          xGPerMatch: 0.36,
        },
        image: "https://images.unsplash.com/photo-1589487391730-58f20eb2c308?w=400&h=400&fit=crop&q=80"
      },
      {
        id: 10,
        name: "Son Heung-min",
        team: "Tottenham Hotspur",
        position: "Forward",
        stats: {
          goals: 14,
          assists: 6,
          matches: 27,
        },
        detailedStats: {
          passingAccuracy: 80,
          shotsOnTarget: 38,
          tacklesWon: 21,
          possession: 52,
          minutesPlayed: 2390,
          distanceCovered: 256.8,
          yellowCards: 2,
          redCards: 0,
          formTrend: [
            { match: "vs ARS", rating: 7.9 },
            { match: "vs CHE", rating: 8.3 },
            { match: "vs LIV", rating: 7.5 },
            { match: "vs MCI", rating: 8.6 },
            { match: "vs MUN", rating: 8.0 },
          ],
          heatmap: [
            { zone: "Left Wing", value: 60 },
            { zone: "Center", value: 35 },
            { zone: "Right Wing", value: 5 },
          ],
          xGPerMatch: 0.58,
        },
        image: "https://images.unsplash.com/photo-1583312696073-a483cbcb3705?w=400&h=400&fit=crop&q=80"
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
  
  delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
};
