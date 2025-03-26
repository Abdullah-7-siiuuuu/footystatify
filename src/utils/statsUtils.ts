
import * as tf from '@tensorflow/tfjs';

// This file provides utilities for advanced statistical analysis and ML features

/**
 * Calculate Expected Goals (xG) for a given set of shot parameters
 * Note: This is a simplified model for demonstration
 */
export const calculateExpectedGoals = async (
  shotData: {
    distance: number;  // Distance from goal in meters
    angle: number;     // Angle from goal center in degrees
    pressure: number;  // Defensive pressure (0-1)
    bodyPart: 'head' | 'foot' | 'other';
  }
): Promise<number> => {
  try {
    // In a real app, this would use a trained model
    // For demo purposes, using a simple formula
    
    // Convert factors to values between 0-1 where 1 is more likely to score
    const distanceFactor = Math.max(0, 1 - (shotData.distance / 40));
    const angleFactor = Math.cos((90 - Math.min(90, Math.abs(shotData.angle))) * (Math.PI / 180));
    const pressureFactor = 1 - shotData.pressure;
    const bodyPartFactor = shotData.bodyPart === 'foot' ? 1 : shotData.bodyPart === 'head' ? 0.7 : 0.5;
    
    // Combine factors with appropriate weighting
    const xG = (
      distanceFactor * 0.4 + 
      angleFactor * 0.3 + 
      pressureFactor * 0.2 + 
      bodyPartFactor * 0.1
    );
    
    return Math.min(0.98, Math.max(0.01, xG));
  } catch (error) {
    console.error("Error calculating xG:", error);
    return 0.05; // Default fallback value
  }
};

/**
 * Generate a simplified player rating based on performance metrics
 */
export const generatePlayerRating = (metrics: {
  goals: number;
  assists: number;
  shotsOnTarget: number;
  passAccuracy: number;
  tackles: number;
  interceptions: number;
  minutesPlayed: number;
}): number => {
  // Normalize to per-90 minutes where appropriate
  const minutesFactor = 90 / Math.max(90, metrics.minutesPlayed);
  
  // Calculate normalized metrics
  const goalsNorm = metrics.goals * minutesFactor * 3;
  const assistsNorm = metrics.assists * minutesFactor * 2;
  const shotsNorm = metrics.shotsOnTarget * minutesFactor * 0.5;
  const passNorm = (metrics.passAccuracy / 100) * 2;
  const defenseNorm = (metrics.tackles + metrics.interceptions) * minutesFactor * 0.3;
  
  // Combine for overall rating
  const baseRating = 6.0;
  const performanceAddition = goalsNorm + assistsNorm + shotsNorm + passNorm + defenseNorm;
  
  // Return rating capped between 1-10
  return Math.min(10, Math.max(1, baseRating + performanceAddition));
};

/**
 * Identify tactical patterns in play data
 * This would normally use clustering algorithms on real data
 */
export const identifyTacticalPatterns = (
  positionData: Array<{
    playerId: number;
    x: number;
    y: number;
    frame: number;
  }>
): string[] => {
  // This is a simplified mockup without actual ML
  // In a real app, this would use clustering or pattern detection
  
  // Count how many players are in each zone
  const zones = {
    'defensive third': 0,
    'middle third': 0,
    'final third': 0,
    'left flank': 0,
    'center': 0,
    'right flank': 0
  };
  
  // Process each position data point
  positionData.forEach(pos => {
    // Y position determines third (0-100 range)
    if (pos.y < 33) zones['defensive third']++;
    else if (pos.y < 66) zones['middle third']++;
    else zones['final third']++;
    
    // X position determines flank (0-100 range)
    if (pos.x < 33) zones['left flank']++;
    else if (pos.x < 66) zones['center']++;
    else zones['right flank']++;
  });
  
  // Identify dominant patterns
  const patterns: string[] = [];
  
  if (zones['defensive third'] > zones['final third'] * 1.5) {
    patterns.push('Defensive-minded approach');
  }
  
  if (zones['final third'] > zones['defensive third'] * 1.3) {
    patterns.push('Attacking-focused strategy');
  }
  
  if (zones['left flank'] > zones['right flank'] * 1.3) {
    patterns.push('Left-focused attacks');
  } else if (zones['right flank'] > zones['left flank'] * 1.3) {
    patterns.push('Right-focused attacks');
  }
  
  if (zones['center'] > (zones['left flank'] + zones['right flank'])) {
    patterns.push('Centrally-compact formation');
  }
  
  return patterns.length > 0 ? patterns : ['Balanced approach'];
};

/**
 * Helper to generate player comparison data
 */
export const comparePlayerStats = (
  player1Stats: Record<string, number>,
  player2Stats: Record<string, number>,
  statCategories: string[]
): {
  category: string;
  player1: number;
  player2: number;
  difference: number;
}[] => {
  return statCategories.map(category => {
    const player1Value = player1Stats[category] || 0;
    const player2Value = player2Stats[category] || 0;
    
    return {
      category,
      player1: player1Value,
      player2: player2Value,
      difference: player1Value - player2Value
    };
  });
};
