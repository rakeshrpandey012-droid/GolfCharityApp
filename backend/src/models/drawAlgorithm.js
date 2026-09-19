/**
 * Draw Algorithm Utility
 * Implements weighted selection algorithm for fair charity draw execution
 */

class DrawAlgorithm {
  /**
   * Calculate weighted score for a participant
   * Factors:
   * - Golf performance (swing accuracy, consistency)
   * - Participation history
   * - Charitable contribution amount
   * - Platform engagement
   */
  static calculateWeightedScore(participant, draw) {
    const weights = {
      performance: 0.25,
      participation: 0.2,
      charity: 0.35,
      engagement: 0.2,
    };

    try {
      // Performance score (0-100)
      const performanceScore = participant.stats?.averageAccuracy || 0;

      // Participation score - based on past draws entered
      const participationScore = Math.min(
        (participant.drawsEntered || 0) * 10,
        100
      );

      // Charity contribution score - based on funds donated
      const charityScore = Math.min(
        ((participant.totalCharity || 0) / 1000) * 100,
        100
      );

      // Engagement score - based on platform activity
      const engagementScore = calculateEngagementScore(participant);

      // Calculate weighted score
      const weightedScore =
        performanceScore * weights.performance +
        participationScore * weights.participation +
        charityScore * weights.charity +
        engagementScore * weights.engagement;

      return {
        score: weightedScore,
        components: {
          performance: performanceScore,
          participation: participationScore,
          charity: charityScore,
          engagement: engagementScore,
        },
      };
    } catch (error) {
      console.error('Error calculating weighted score:', error);
      return { score: 50, components: {} };
    }
  }

  /**
   * Execute draw with weighted random selection
   */
  static async executeDraw(draw, participants, onProgress, onWinner, onAlgorithmOutput) {
    try {
      const winners = [];
      const selectedIndices = new Set();
      const totalPrizePool = draw.prizePool || 0;
      const numberOfWinners = Math.min(
        Math.ceil(participants.length * 0.1),
        10
      );

      // Calculate weighted scores for all participants
      const scoredParticipants = participants.map((participant, index) => {
        const scoreData = this.calculateWeightedScore(participant, draw);
        return {
          index,
          participant,
          ...scoreData,
        };
      });

      // Log algorithm startup
      onAlgorithmOutput({
        timestamp: new Date(),
        data: `Initializing draw algorithm for ${participants.length} participants`,
      });

      await this.sleep(500);

      onAlgorithmOutput({
        timestamp: new Date(),
        data: `Total prize pool: £${totalPrizePool.toFixed(2)}`,
      });

      await this.sleep(500);

      // Select winners using weighted random selection
      for (let i = 0; i < numberOfWinners; i++) {
        onAlgorithmOutput({
          timestamp: new Date(),
          data: `[${i + 1}/${numberOfWinners}] Running weighted selection algorithm...`,
        });

        // Filter out already selected participants
        const availableParticipants = scoredParticipants.filter(
          p => !selectedIndices.has(p.index)
        );

        if (availableParticipants.length === 0) break;

        // Select winner based on weighted scores
        const selectedParticipant = this.selectByWeightedScore(
          availableParticipants
        );
        selectedIndices.add(selectedParticipant.index);

        // Calculate prize allocation
        const prizeMultiplier = 1 - i * 0.15; // First winner gets more
        const prizeAmount = (totalPrizePool / numberOfWinners) * prizeMultiplier;

        const winner = {
          participantId: selectedParticipant.participant._id,
          participantName: selectedParticipant.participant.name,
          email: selectedParticipant.participant.email,
          score: selectedParticipant.score,
          prizeAmount,
          rank: i + 1,
          selectedAt: new Date(),
        };

        winners.push(winner);

        onAlgorithmOutput({
          timestamp: new Date(),
          data: `Winner #${i + 1}: ${winner.participantName} (Score: ${winner.score.toFixed(2)}) - Prize: £${prizeAmount.toFixed(2)}`,
        });

        onWinner(winner);

        // Progress update
        const progress = Math.round(((i + 1) / numberOfWinners) * 100);
        const processedPool = winners.reduce((sum, w) => sum + w.prizeAmount, 0);

        onProgress({
          progress,
          metrics: {
            processedParticipants: i + 1,
            weighedScore: selectedParticipant.score.toFixed(2),
            poolDistribution: processedPool.toFixed(2),
          },
          processedPool,
        });

        await this.sleep(800);
      }

      onAlgorithmOutput({
        timestamp: new Date(),
        data: `Draw execution completed. ${winners.length} winners selected.`,
      });

      return winners;
    } catch (error) {
      console.error('Error executing draw:', error);
      throw error;
    }
  }

  /**
   * Select participant using weighted random selection
   * Higher scores have higher probability of selection
   */
  static selectByWeightedScore(participants) {
    // Normalize scores to probabilities
    const totalScore = participants.reduce((sum, p) => sum + p.score, 0);
    const probabilities = participants.map(p => p.score / totalScore);

    // Calculate cumulative probabilities
    const cumulativeProbabilities = [];
    let cumulative = 0;
    probabilities.forEach(prob => {
      cumulative += prob;
      cumulativeProbabilities.push(cumulative);
    });

    // Random selection based on probabilities
    const random = Math.random();
    const selectedIndex = cumulativeProbabilities.findIndex(
      cumProb => random <= cumProb
    );

    return participants[selectedIndex] || participants[participants.length - 1];
  }

  /**
   * Utility sleep function for simulating processing
   */
  static sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

/**
 * Calculate engagement score based on user activity
 */
function calculateEngagementScore(participant) {
  let score = 0;

  // Profile completeness
  if (participant.profileComplete) score += 20;

  // Activity metrics
  score += Math.min((participant.loginCount || 0) / 10, 20);

  // Donation frequency
  score += Math.min((participant.donationCount || 0) * 5, 20);

  // Referrals
  score += Math.min((participant.referralCount || 0) * 2, 20);

  // Social sharing
  score += Math.min((participant.shareCount || 0) / 5, 20);

  return Math.min(score, 100);
}

/**
 * Validate draw configuration
 */
function validateDrawConfig(draw) {
  const errors = [];

  if (!draw.name) errors.push('Draw name is required');
  if (!draw.prizePool || draw.prizePool <= 0) errors.push('Prize pool must be greater than 0');
  if (!draw.participants || draw.participants.length === 0) {
    errors.push('Draw must have at least one participant');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Generate draw report
 */
function generateDrawReport(draw, winners) {
  const report = {
    drawId: draw._id,
    drawName: draw.name,
    executedAt: new Date(),
    totalParticipants: draw.participants.length,
    winnersSelected: winners.length,
    totalPrizePool: draw.prizePool,
    totalDistributed: winners.reduce((sum, w) => sum + w.prizeAmount, 0),
    winners: winners.map(w => ({
      rank: w.rank,
      name: w.participantName,
      email: w.email,
      score: w.score,
      prizeAmount: w.prizeAmount,
    })),
    statistics: {
      averageScore: (
        winners.reduce((sum, w) => sum + w.score, 0) / winners.length
      ).toFixed(2),
      highestScore: Math.max(...winners.map(w => w.score)).toFixed(2),
      lowestScore: Math.min(...winners.map(w => w.score)).toFixed(2),
    },
  };

  return report;
}

module.exports = {
  DrawAlgorithm,
  validateDrawConfig,
  generateDrawReport,
  executeDrawAlgorithm: DrawAlgorithm.executeDraw.bind(DrawAlgorithm),
};
