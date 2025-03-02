
import { useState, useEffect } from "react";
import * as tf from "@tensorflow/tfjs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

// Sample upcoming matches data
const upcomingMatches = [
  {
    id: 1,
    homeTeam: "Arsenal",
    awayTeam: "Chelsea",
    date: "2024-04-25",
    competition: "Premier League",
    homeTeamStrength: 0.85,
    awayTeamStrength: 0.82,
    homeTeamForm: 0.78,
    awayTeamForm: 0.75,
  },
  {
    id: 2,
    homeTeam: "Barcelona",
    awayTeam: "Atletico Madrid",
    date: "2024-04-26",
    competition: "La Liga",
    homeTeamStrength: 0.87,
    awayTeamStrength: 0.80,
    homeTeamForm: 0.82,
    awayTeamForm: 0.76,
  },
  {
    id: 3,
    homeTeam: "Bayern Munich",
    awayTeam: "RB Leipzig",
    date: "2024-04-27",
    competition: "Bundesliga",
    homeTeamStrength: 0.90,
    awayTeamStrength: 0.78,
    homeTeamForm: 0.88,
    awayTeamForm: 0.74,
  },
  {
    id: 4,
    homeTeam: "Juventus",
    awayTeam: "AS Roma",
    date: "2024-04-28",
    competition: "Serie A",
    homeTeamStrength: 0.84,
    awayTeamStrength: 0.79,
    homeTeamForm: 0.76,
    awayTeamForm: 0.72,
  },
  {
    id: 5,
    homeTeam: "PSG",
    awayTeam: "Lyon",
    date: "2024-04-29",
    competition: "Ligue 1",
    homeTeamStrength: 0.89,
    awayTeamStrength: 0.77,
    homeTeamForm: 0.84,
    awayTeamForm: 0.73,
  },
];

type Prediction = {
  homeWin: number;
  draw: number;
  awayWin: number;
};

type PredictedMatch = {
  id: number;
  homeTeam: string;
  awayTeam: string;
  date: string;
  competition: string;
  prediction: Prediction;
};

export const MatchPredictions = () => {
  const [model, setModel] = useState<tf.LayersModel | null>(null);
  const [loading, setLoading] = useState(true);
  const [predictions, setPredictions] = useState<PredictedMatch[]>([]);

  // Create and train the model
  useEffect(() => {
    const createAndTrainModel = async () => {
      try {
        // Create a simple sequential model
        const model = tf.sequential();
        
        // Add layers to the model
        model.add(tf.layers.dense({
          units: 16,
          inputShape: [4], // homeTeamStrength, awayTeamStrength, homeTeamForm, awayTeamForm
          activation: 'relu'
        }));
        
        model.add(tf.layers.dense({
          units: 8,
          activation: 'relu'
        }));
        
        model.add(tf.layers.dense({
          units: 3, // Three possible outcomes: home win, draw, away win
          activation: 'softmax'
        }));
        
        // Compile the model
        model.compile({
          optimizer: tf.train.adam(),
          loss: 'categoricalCrossentropy',
          metrics: ['accuracy']
        });
        
        // Sample training data (in a real app, this would come from historical match data)
        const trainingFeatures = tf.tensor2d([
          [0.85, 0.75, 0.80, 0.70], // Home team is stronger and in better form
          [0.70, 0.85, 0.65, 0.80], // Away team is stronger and in better form
          [0.80, 0.80, 0.75, 0.75], // Teams are evenly matched
          [0.90, 0.70, 0.85, 0.65], // Home team is much stronger
          [0.70, 0.90, 0.65, 0.85], // Away team is much stronger
          [0.85, 0.80, 0.70, 0.75], // Mixed strengths and forms
          [0.75, 0.85, 0.80, 0.70], // Another mixed case
          [0.82, 0.82, 0.78, 0.78], // Very even match
        ]);
        
        const trainingLabels = tf.tensor2d([
          [0.7, 0.2, 0.1], // Home win likely
          [0.1, 0.2, 0.7], // Away win likely
          [0.3, 0.4, 0.3], // Draw likely
          [0.8, 0.15, 0.05], // Strong home win likely
          [0.05, 0.15, 0.8], // Strong away win likely
          [0.6, 0.3, 0.1], // Home win somewhat likely
          [0.2, 0.3, 0.5], // Away win somewhat likely
          [0.33, 0.34, 0.33], // Very even odds
        ]);
        
        // Train the model
        await model.fit(trainingFeatures, trainingLabels, {
          epochs: 200,
          batchSize: 4,
          callbacks: {
            onEpochEnd: (epoch, logs) => {
              console.log(`Epoch ${epoch}: loss = ${logs?.loss}, accuracy = ${logs?.acc}`);
            }
          }
        });
        
        setModel(model);
        
        // Make predictions for upcoming matches
        const predictMatches = async () => {
          if (!model) return;
          
          const predictedMatches = await Promise.all(
            upcomingMatches.map(async (match) => {
              const input = tf.tensor2d([
                [
                  match.homeTeamStrength,
                  match.awayTeamStrength,
                  match.homeTeamForm,
                  match.awayTeamForm
                ]
              ]);
              
              const prediction = await model.predict(input) as tf.Tensor;
              const predictionData = await prediction.data();
              
              return {
                ...match,
                prediction: {
                  homeWin: Number(predictionData[0].toFixed(2)),
                  draw: Number(predictionData[1].toFixed(2)),
                  awayWin: Number(predictionData[2].toFixed(2))
                }
              };
            })
          );
          
          setPredictions(predictedMatches);
          setLoading(false);
        };
        
        predictMatches();
      } catch (error) {
        console.error("Error training model:", error);
        setLoading(false);
      }
    };
    
    createAndTrainModel();
    
    // Cleanup function
    return () => {
      if (model) {
        model.dispose();
      }
    };
  }, []);

  // Format the probability as a percentage
  const formatProbability = (prob: number) => {
    return `${(prob * 100).toFixed(1)}%`;
  };

  // Determine the most likely outcome
  const getMostLikelyOutcome = (prediction: Prediction) => {
    const { homeWin, draw, awayWin } = prediction;
    if (homeWin > draw && homeWin > awayWin) {
      return "Home Win";
    } else if (awayWin > draw && awayWin > homeWin) {
      return "Away Win";
    } else {
      return "Draw";
    }
  };

  // Get the color for the prediction badge
  const getPredictionColor = (prediction: Prediction) => {
    const outcome = getMostLikelyOutcome(prediction);
    if (outcome === "Home Win") {
      return "bg-blue-100 text-blue-800";
    } else if (outcome === "Away Win") {
      return "bg-red-100 text-red-800";
    } else {
      return "bg-yellow-100 text-yellow-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Match Predictions</h2>
        {loading && (
          <div className="flex items-center text-muted-foreground">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Training model...
          </div>
        )}
      </div>
      
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((n) => (
            <Card key={n} className="opacity-70 animate-pulse">
              <CardHeader className="pb-2">
                <CardTitle className="h-6 bg-muted rounded-md"></CardTitle>
                <CardDescription className="h-4 bg-muted rounded-md w-3/4 mt-2"></CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-20 bg-muted rounded-md"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {predictions.map((match, index) => (
            <motion.div
              key={match.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">
                    {match.homeTeam} vs {match.awayTeam}
                  </CardTitle>
                  <CardDescription>
                    {match.competition} • {match.date}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{match.homeTeam} Win</span>
                      <div className="w-1/2 bg-secondary rounded-full h-2.5">
                        <div
                          className="bg-blue-600 h-2.5 rounded-full"
                          style={{ width: `${match.prediction.homeWin * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium ml-2">
                        {formatProbability(match.prediction.homeWin)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Draw</span>
                      <div className="w-1/2 bg-secondary rounded-full h-2.5">
                        <div
                          className="bg-yellow-500 h-2.5 rounded-full"
                          style={{ width: `${match.prediction.draw * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium ml-2">
                        {formatProbability(match.prediction.draw)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{match.awayTeam} Win</span>
                      <div className="w-1/2 bg-secondary rounded-full h-2.5">
                        <div
                          className="bg-red-600 h-2.5 rounded-full"
                          style={{ width: `${match.prediction.awayWin * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium ml-2">
                        {formatProbability(match.prediction.awayWin)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex justify-between items-center">
                    <div className="text-sm font-medium">
                      Prediction: <span className={`px-2 py-1 rounded-full text-xs ${getPredictionColor(match.prediction)}`}>
                        {getMostLikelyOutcome(match.prediction)}
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Confidence: {formatProbability(Math.max(match.prediction.homeWin, match.prediction.draw, match.prediction.awayWin))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};
