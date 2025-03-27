
import { Player } from "@/components/PlayerCard";
import * as tf from "@tensorflow/tfjs";

// This is a utilities file for stats calculations and ML models
// In a real application, these would be more complex models

export const statsUtils = {
  // Calculate expected goals
  calculateXG: (player: Player, timeFilter: string, competitionFilter: string): { total: number; perGame: number; conversion: number } => {
    // Simulate xG calculation with TensorFlow.js
    const baseXG = player.detailedStats.xGPerMatch;
    
    // Apply filters for demo purposes
    let multiplier = 1.0;
    if (timeFilter === "2023-24") multiplier *= 1.1;
    if (timeFilter === "last-5") multiplier *= 0.9;
    if (competitionFilter === "champions-league") multiplier *= 1.2;
    
    const totalMatches = player.stats.matches;
    const totalXG = baseXG * totalMatches * multiplier;
    const conversionRate = (player.stats.goals / (totalXG || 1)) * 100;
    
    return {
      total: totalXG,
      perGame: totalXG / totalMatches,
      conversion: Math.min(conversionRate, 100)
    };
  },
  
  // Calculate player rating
  calculateRating: (player: Player, timeFilter: string, competitionFilter: string): number => {
    const baseRating = player.detailedStats.formTrend.reduce((acc, curr) => acc + curr.rating, 0) / 
                      player.detailedStats.formTrend.length;
    
    // Apply filters for demo purposes
    let adjustedRating = baseRating;
    if (timeFilter === "last-5") {
      const recentMatches = player.detailedStats.formTrend.slice(-5);
      adjustedRating = recentMatches.reduce((acc, curr) => acc + curr.rating, 0) / recentMatches.length;
    }
    
    if (competitionFilter === "champions-league") {
      adjustedRating *= 1.05; // Slight boost for champions league
    }
    
    return Math.min(adjustedRating, 10);
  },
  
  // Generate tactical patterns 
  identifyTacticalPatterns: (player: Player, timeFilter: string, competitionFilter: string): Array<{ name: string; description: string; confidence: number }> => {
    const position = player.position.toLowerCase();
    const patterns = [];
    
    if (position.includes("forward") || position.includes("striker")) {
      patterns.push({
        name: "Deep Runs Behind Defense",
        description: "Player frequently makes runs behind the defensive line to exploit space",
        confidence: 75 + (player.stats.goals * 2)
      });
      patterns.push({
        name: "False Nine Movement",
        description: "Drops deep to collect the ball and create space for teammates",
        confidence: 60 + (player.stats.assists * 3)
      });
    }
    
    if (position.includes("midfielder")) {
      patterns.push({
        name: "Progressive Passing",
        description: "Consistently advances the ball with forward passes breaking defensive lines",
        confidence: 80 + (player.detailedStats.passingAccuracy / 2)
      });
      patterns.push({
        name: "Defensive Cover",
        description: "Provides excellent positional awareness to cover defensive gaps",
        confidence: 70 + (player.detailedStats.tacklesWon * 2)
      });
    }
    
    if (position.includes("defender")) {
      patterns.push({
        name: "Ball-Playing Defender",
        description: "Comfortable in possession and initiates attacks from the back",
        confidence: 65 + (player.detailedStats.passingAccuracy / 2)
      });
      patterns.push({
        name: "Aerial Dominance",
        description: "Excels in winning aerial duels from set pieces and crosses",
        confidence: 75 + (player.id % 15) // Random variation for demo
      });
    }
    
    // Add some common patterns for all positions
    patterns.push({
      name: "Space Exploitation",
      description: "Identifies and moves into open spaces to receive passes",
      confidence: 60 + (player.stats.goals + player.stats.assists)
    });
    
    patterns.push({
      name: "Pressing Trigger",
      description: "Initiates team pressing when specific conditions are met",
      confidence: 55 + (player.detailedStats.distanceCovered / 2)
    });
    
    // Limit confidence to 100%
    return patterns.map(p => ({
      ...p,
      confidence: Math.min(p.confidence, 98)
    }));
  },
  
  // Generate performance scores for radar chart
  calculatePerformanceScores: (player: Player): Array<{ skill: string; value: number }> => {
    const position = player.position.toLowerCase();
    const scores = [];
    
    // Base scores
    let shooting = 40 + (player.stats.goals * 5);
    let passing = 50 + (player.detailedStats.passingAccuracy / 2);
    let dribbling = 45 + (player.id % 20) + (player.stats.goals * 2);
    let defending = 30 + (player.detailedStats.tacklesWon * 4);
    let physical = 50 + (player.detailedStats.distanceCovered * 2);
    let speed = 40 + (player.id % 30) + 10;
    
    // Adjust based on position
    if (position.includes("forward") || position.includes("striker")) {
      shooting += 20;
      dribbling += 15;
      speed += 10;
      defending -= 10;
    } else if (position.includes("midfielder")) {
      passing += 20;
      dribbling += 10;
      physical += 10;
    } else if (position.includes("defender")) {
      defending += 30;
      physical += 15;
      shooting -= 15;
    } else if (position.includes("goalkeeper")) {
      defending += 40;
      passing -= 10;
      shooting -= 20;
    }
    
    // Ensure values are within 0-100 range
    const clamp = (value: number) => Math.min(Math.max(value, 0), 100);
    
    scores.push({ skill: "Shooting", value: clamp(shooting) });
    scores.push({ skill: "Passing", value: clamp(passing) });
    scores.push({ skill: "Dribbling", value: clamp(dribbling) });
    scores.push({ skill: "Defending", value: clamp(defending) });
    scores.push({ skill: "Physical", value: clamp(physical) });
    scores.push({ skill: "Speed", value: clamp(speed) });
    
    return scores;
  },
  
  // Calculate ML-based ratings
  calculateMLRatings: (player: Player) => {
    const baseRating = player.detailedStats.formTrend.reduce((acc, curr) => acc + curr.rating, 0) / 
                      player.detailedStats.formTrend.length;
    
    // Calculate trend
    const recentMatches = player.detailedStats.formTrend.slice(-3);
    const recentAvg = recentMatches.reduce((acc, curr) => acc + curr.rating, 0) / recentMatches.length;
    const trend = recentAvg - baseRating;
    
    return {
      overall: baseRating,
      trend: trend,
      categories: {
        attacking: baseRating * (0.8 + (player.stats.goals * 0.05)),
        playmaking: baseRating * (0.7 + (player.stats.assists * 0.07)),
        defending: baseRating * (0.6 + (player.detailedStats.tacklesWon * 0.04)),
        physical: baseRating * (0.9 + (player.detailedStats.distanceCovered * 0.01)),
        technical: baseRating * (0.85 + (player.detailedStats.passingAccuracy * 0.002)),
        mental: baseRating * (0.75 + ((player.id % 10) * 0.02))
      },
      predictions: {
        goalProbability: Math.min(30 + (player.stats.goals * 7) + (player.id % 10), 95),
        assistProbability: Math.min(25 + (player.stats.assists * 8) + (player.id % 15), 90)
      }
    };
  },
  
  // Generate heatmap data
  generateHeatmapData: (player: Player, timeFilter: string, competitionFilter: string): Array<{ x: number; y: number; value: number }> => {
    const position = player.position.toLowerCase();
    const points = [];
    
    // Generate realistic heatmap data based on player position
    const numPoints = 300;
    
    // Determine areas of concentration based on position
    let xCenter = 50, yCenter = 50;
    let xSpread = 40, ySpread = 40;
    
    if (position.includes("forward") || position.includes("striker")) {
      xCenter = 75;
      yCenter = 50;
      xSpread = 25;
    } else if (position.includes("midfielder")) {
      xCenter = 50;
      yCenter = 50;
      xSpread = 40;
    } else if (position.includes("defender")) {
      xCenter = 25;
      yCenter = 50;
      xSpread = 25;
    } else if (position.includes("goalkeeper")) {
      xCenter = 10;
      yCenter = 50;
      xSpread = 10;
    }
    
    // Add position-specific hotspots
    if (position.includes("right")) {
      yCenter = 75;
    } else if (position.includes("left")) {
      yCenter = 25;
    }
    
    // Generate points with a normal distribution
    for (let i = 0; i < numPoints; i++) {
      // Use Box-Muller transform for normal distribution
      const u1 = Math.random();
      const u2 = Math.random();
      const z1 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
      const z2 = Math.sqrt(-2 * Math.log(u1)) * Math.sin(2 * Math.PI * u2);
      
      const x = xCenter + z1 * xSpread;
      const y = yCenter + z2 * ySpread;
      
      // Ensure points are within the pitch (0-100)
      if (x >= 0 && x <= 100 && y >= 0 && y <= 100) {
        // Value is higher the closer it is to the center of distribution
        const distance = Math.sqrt(Math.pow(x - xCenter, 2) + Math.pow(y - yCenter, 2));
        const value = Math.max(10 - (distance / 10), 1);
        
        points.push({ x, y, value });
      }
    }
    
    return points;
  },
  
  // Generate passing network data
  generatePassingNetworkData: (player: Player, timeFilter: string, competitionFilter: string): { nodes: Array<{ id: string; name: string; x: number; y: number }>; links: Array<{ source: string; target: string; value: number }> } => {
    // Create a realistic passing network
    const position = player.position.toLowerCase();
    
    // Create nodes (teammates + player)
    const nodes = [];
    const links = [];
    
    // Add the player
    nodes.push({
      id: `player-${player.id}`,
      name: player.name,
      x: getPositionX(position),
      y: getPositionY(position)
    });
    
    // Add teammates based on player position
    const teammates = generateTeammates(player);
    
    // Add nodes for teammates
    teammates.forEach(teammate => {
      nodes.push({
        id: `player-${teammate.id}`,
        name: teammate.name,
        x: getPositionX(teammate.position),
        y: getPositionY(teammate.position)
      });
    });
    
    // Create links (passing connections)
    // From player to teammates
    teammates.forEach(teammate => {
      // Determine pass frequency based on positions
      let passFrequency = calculatePassFrequency(position, teammate.position);
      
      // Add some randomness
      passFrequency += (Math.random() * 2) - 1;
      passFrequency = Math.max(1, Math.min(10, passFrequency));
      
      links.push({
        source: `player-${player.id}`,
        target: `player-${teammate.id}`,
        value: passFrequency
      });
      
      // Add reverse link (teammate to player)
      links.push({
        source: `player-${teammate.id}`,
        target: `player-${player.id}`,
        value: passFrequency * 0.8  // Slightly less frequent
      });
    });
    
    // Add some teammate-to-teammate links
    for (let i = 0; i < teammates.length; i++) {
      for (let j = i + 1; j < teammates.length; j++) {
        // Only create some connections, not all
        if (Math.random() > 0.3) {
          const frequency = calculatePassFrequency(
            teammates[i].position, 
            teammates[j].position
          ) * 0.6;  // Less frequent than with the main player
          
          links.push({
            source: `player-${teammates[i].id}`,
            target: `player-${teammates[j].id}`,
            value: frequency
          });
          
          // Add reverse link
          links.push({
            source: `player-${teammates[j].id}`,
            target: `player-${teammates[i].id}`,
            value: frequency * 0.9
          });
        }
      }
    }
    
    return { nodes, links };
  }
};

// Helper functions for passing network
function getPositionX(position: string): number {
  position = position.toLowerCase();
  if (position.includes("goalkeeper")) return 0.1;
  if (position.includes("defender")) return 0.3;
  if (position.includes("midfielder")) return 0.6;
  if (position.includes("forward") || position.includes("striker")) return 0.8;
  return 0.5;
}

function getPositionY(position: string): number {
  position = position.toLowerCase();
  if (position.includes("right")) return 0.8;
  if (position.includes("left")) return 0.2;
  if (position.includes("center")) return 0.5;
  return 0.5;
}

function calculatePassFrequency(pos1: string, pos2: string): number {
  pos1 = pos1.toLowerCase();
  pos2 = pos2.toLowerCase();
  
  // Positions that typically have frequent passing
  if (
    (pos1.includes("midfielder") && pos2.includes("midfielder")) ||
    (pos1.includes("defender") && pos2.includes("midfielder")) ||
    (pos1.includes("midfielder") && pos2.includes("forward"))
  ) {
    return 7 + Math.random() * 3;
  }
  
  // Positions that have medium passing frequency
  if (
    (pos1.includes("defender") && pos2.includes("defender")) ||
    (pos1.includes("forward") && pos2.includes("forward"))
  ) {
    return 4 + Math.random() * 3;
  }
  
  // Less frequent passing combinations
  if (
    (pos1.includes("goalkeeper") && !pos2.includes("defender")) ||
    (pos2.includes("goalkeeper") && !pos1.includes("defender"))
  ) {
    return 1 + Math.random() * 2;
  }
  
  // Default
  return 3 + Math.random() * 4;
}

// Generate random teammates based on the player's team
function generateTeammates(player: Player): Array<{ id: number; name: string; position: string }> {
  const positions = [
    "Goalkeeper",
    "Right Back",
    "Center Back",
    "Left Back",
    "Defensive Midfielder",
    "Center Midfielder",
    "Attacking Midfielder",
    "Right Winger",
    "Left Winger",
    "Striker"
  ];
  
  // First names
  const firstNames = [
    "James", "David", "Robert", "Michael", "William", 
    "Thomas", "John", "Richard", "Carlos", "Juan",
    "Marco", "Luis", "Sergio", "Kevin", "Paul"
  ];
  
  // Last names
  const lastNames = [
    "Smith", "Johnson", "Williams", "Brown", "Jones",
    "Garcia", "Miller", "Davis", "Rodriguez", "Martinez",
    "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson"
  ];
  
  const teammates = [];
  
  // Create 8-10 teammates
  const numTeammates = 8 + Math.floor(Math.random() * 3);
  
  for (let i = 0; i < numTeammates; i++) {
    // Don't use the player's position
    let position = positions[Math.floor(Math.random() * positions.length)];
    while (position.toLowerCase() === player.position.toLowerCase()) {
      position = positions[Math.floor(Math.random() * positions.length)];
    }
    
    // Generate a random name
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const name = `${firstName} ${lastName}`;
    
    // Generate a unique ID
    const id = 1000 + i + (player.id * 10);
    
    teammates.push({
      id,
      name,
      position
    });
  }
  
  return teammates;
}
