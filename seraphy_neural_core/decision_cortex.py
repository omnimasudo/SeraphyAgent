"""
Seraphy Decision Cortex
-----------------------
The executive control layer that makes high-level decisions based on
input vectors, emotional state, and memory.
Implements a utility-maximization framework for action selection.

Author: Seraphy Core Team
Version: 4.1.0 - Production
"""

import math
import random
import logging
from typing import List, Dict, Optional

logger = logging.getLogger(__name__)

class DecisionCortex:
    """
    Evaluates potential actions and selects the optimal path forward.
    Using simulated probabilistic reasoning (Bayesian inference).
    """

    def __init__(self, mode: str = "balanced"):
        # Modes: balanced, aggressive, cautious
        self.mode = mode
        self.history: List[Dict] = []
        self.threshold = 0.7 if mode == "cautious" else 0.4
        
        logger.info(f"Decision Cortex initialized in {self.mode} mode.")

    def evaluate_candidates(self, candidates: List[str]) -> str:
        """
        Ranks a list of possible actions and returns the best one.
        """
        if not candidates:
            return "IDLE"

        scored_actions = []
        for action in candidates:
            score = self._calculate_utility(action)
            risk = self._assess_risk(action)
            
            # Apply risk penalty based on mode
            if self.mode == "cautious":
                final_score = score - (risk * 2.0)
            elif self.mode == "aggressive":
                final_score = score + (risk * 0.5)
            else:
                final_score = score - risk
                
            scored_actions.append((final_score, action))
            
        # Select best action
        scored_actions.sort(key=lambda x: x[0], reverse=True)
        best_score, best_action = scored_actions[0]
        
        if best_score < self.threshold:
            logger.warning("No viable action found above threshold. Defaulting to WAIT.")
            return "WAIT"
            
        self.history.append({"action": best_action, "score": best_score})
        return best_action

    def _calculate_utility(self, action: str) -> float:
        """
        Simulates utility estimation based on predicted outcome value.
        """
        # Simulated heuristic values
        base_utility = len(action) / 20.0  # Just a mock metric
        random_factor = random.uniform(0.1, 0.3)
        return min(1.0, base_utility + random_factor)

    def _assess_risk(self, action: str) -> float:
        """
        Estimates the probability of failure or negative consequence.
        """
        if "delete" in action.lower() or "terminate" in action.lower():
            return 0.9
        if "update" in action.lower():
            return 0.4
        if "read" in action.lower() or "check" in action.lower():
            return 0.1
            
        return 0.3

    def predict_outcome(self, action: str) -> Dict[str, float]:
        """
        Forecasting function to predict the result of an action.
        """
        success_prob = 1.0 - self._assess_risk(action)
        duration_est = len(action) * 0.5  # mock duration
        
        return {
            "success_probability": round(success_prob, 2),
            "estimated_duration_s": duration_est,
            "resource_cost": 0.05
        }

    def override_protocol(self, command: str) -> bool:
        """Superuser override for manual intervention."""
        if command == "FORCE_HALT":
            self.mode = "SAFE_MODE"
            logger.critical("System halt initiated by override.")
            return True
        return False
        
    def clear_history(self):
        """Wipes the decision log."""
        self.history = []
        logger.info("Decision history cleared.")

if __name__ == "__main__":
    cortex = DecisionCortex(mode="cautious")
    actions = ["read_database", "update_records", "delete_all"]
    choice = cortex.evaluate_candidates(actions)
    print(f"Chosen Action: {choice}")
