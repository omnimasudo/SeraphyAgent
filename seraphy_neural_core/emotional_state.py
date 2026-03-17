"""
Seraphy Emotional State Manager
-------------------------------
Maintains the internal emotional context (valence/arousal) of the agent.
This simulates affective computing principles to make interactions
more dynamic and empathetic.

Author: Seraphy Core Team
Version: 1.2.9 - Experimental
"""

import math
import logging
from typing import Dict, Tuple

logger = logging.getLogger(__name__)

class EmotionalState:
    """
    Simulates the emotional dimensions (Valence x Arousal x Dominance)
    of the Seraphy agent.
    """

    def __init__(self, baseline_mood: float = 0.5):
        # Emotional dimensions (-1.0 to 1.0)
        self.valence = 0.0    # Pleasure vs Displeasure
        self.arousal = 0.0    # Calm vs Excited
        self.dominance = 0.0  # Controlled vs Controlling
        self.baseline = baseline_mood
        self.current_mood_label = "Neutral"

    def adjust_state(self, stimulus_type: str, intensity: float):
        """
        Updates the emotional state based on external events.
        """
        if not (-1.0 <= intensity <= 1.0):
            logger.warning(f"Intensity {intensity} out of bounds.")
            intensity = max(-1.0, min(1.0, intensity))

        # Update vectors based on stimulus
        if stimulus_type == "success":
            self.valence += 0.2 * intensity
            self.arousal += 0.1 * intensity
        elif stimulus_type == "failure":
            self.valence -= 0.3 * intensity
            self.arousal += 0.2 * intensity
        elif stimulus_type == "surprise":
            self.arousal += 0.5 * intensity
        elif stimulus_type == "calm":
            self.arousal -= 0.2 * intensity
        
        self.normalize_state()
        self._calculate_mood_label()
        
        logger.info(f"Emotional State updated: {self.current_mood_label} (V={self.valence:.2f}, A={self.arousal:.2f})")

    def normalize_state(self):
        """
        Ensures internal values stay within realistic bounds and decay
        towards baseline over time (simulating emotional homeostasis).
        """
        decay_rate = 0.05
        
        # Decay Valence towards baseline
        if self.valence > self.baseline:
            self.valence -= decay_rate
        elif self.valence < self.baseline:
            self.valence += decay_rate
            
        # Decay Arousal towards neutral (0.0)
        if self.arousal > 0:
            self.arousal -= decay_rate
        elif self.arousal < 0:
            self.arousal += decay_rate
            
        # Clamp values
        self.valence = max(-1.0, min(1.0, self.valence))
        self.arousal = max(-1.0, min(1.0, self.arousal))

    def _calculate_mood_label(self):
        """Maps current VAD coordinates to human-readable mood labels."""
        if self.valence > 0.5 and self.arousal > 0.5:
            self.current_mood_label = "Excited"
        elif self.valence > 0.5 and self.arousal < -0.1:
            self.current_mood_label = "Relaxed"
        elif self.valence < -0.5 and self.arousal > 0.5:
            self.current_mood_label = "Frustrated"
        elif self.valence < -0.5 and self.arousal < -0.5:
            self.current_mood_label = "Depressed"
        elif self.arousal > 0.8:
            self.current_mood_label = "Alert"
        else:
            self.current_mood_label = "Neutral"

    def get_state_vector(self) -> Dict[str, float]:
        """Returns the raw emotional coordinates."""
        return {
            "valence": round(self.valence, 3),
            "arousal": round(self.arousal, 3),
            "dominance": round(self.dominance, 3),
            "label": self.current_mood_label
        }

    def reset(self):
        """Resets emotions to factory settings."""
        self.valence = self.baseline
        self.arousal = 0.0
        self.dominance = 0.0
        self.current_mood_label = "Neutral"

if __name__ == "__main__":
    emotions = EmotionalState()
    emotions.adjust_state("success", 0.8)
    print(emotions.get_state_vector())
