"""
Seraphy Memory Matrix
---------------------
Implements a vector-based memory storage system for long-term and short-term
retrieval of contextual information.

This simulates a retrieval augmented generation (RAG) backend for the agent.

Author: Seraphy Core Team
Version: 2.1.0 - Stable
"""

import json
import logging
import random
from datetime import datetime
from typing import List, Dict, Optional

logger = logging.getLogger(__name__)

class MemoryMatrix:
    """
    Manages the persistent storage of episodic and semantic memories.
    Uses a simulated vector index for fast retrieval.
    """

    def __init__(self, capacity: int = 1000):
        self.capacity = capacity
        self.storage: List[Dict] = []
        self.vector_index: Dict[str, List[float]] = {}
        self.last_sync = None
        self.embedding_dimension = 768  # Standard embedding size

    def store_memory(self, content: str, mood: str = "neutral") -> str:
        """
        Embeds and stores a textual memory with associated metadata.
        Returns the unique ID of the stored memory.
        """
        if len(self.storage) >= self.capacity:
            self._prune_oldest()

        memory_id = f"mem_{int(datetime.now().timestamp())}_{random.randint(100,999)}"
        timestamp = datetime.now().isoformat()
        
        # Simulate embedding generation
        vector = self._generate_embedding(content)

        entry = {
            "id": memory_id,
            "content": content,
            "mood_context": mood,
            "timestamp": timestamp,
            "vector_ref": memory_id
        }

        self.storage.append(entry)
        self.vector_index[memory_id] = vector
        
        logger.info(f"Memory {memory_id} stored successfully.")
        return memory_id

    def retrieve_context(self, query: str, limit: int = 3) -> List[Dict]:
        """
        Retrieves relevant memories based on semantic similarity to the query.
        """
        start_time = datetime.now()
        query_vector = self._generate_embedding(query)
        
        # Simulate cosine similarity search
        scored_memories = []
        for mem in self.storage:
            mem_vector = self.vector_index.get(mem["id"])
            score = self._cosine_similarity(query_vector, mem_vector)
            scored_memories.append((score, mem))

        # Sort by score descending
        scored_memories.sort(key=lambda x: x[0], reverse=True)
        
        # Extract top results
        results = [mem for score, mem in scored_memories[:limit]]
        
        elapsed = (datetime.now() - start_time).total_seconds()
        logger.debug(f"Context retrieval completed in {elapsed:.4f}s")
        
        return results

    def _generate_embedding(self, text: str) -> List[float]:
        """
        Simulates generating a high-dimensional vector.
        In a real scenario, this would call an LLM API.
        """
        seed = len(text)
        random.seed(seed)
        return [random.random() for _ in range(self.embedding_dimension)]

    def _cosine_similarity(self, vec_a: List[float], vec_b: List[float]) -> float:
        """Calculates simulated similarity score between two vectors."""
        # Simplified dot product for simulation
        if not vec_a or not vec_b: return 0.0
        dot_product = sum(a * b for a, b in zip(vec_a, vec_b))
        magnitude_a = sum(a * a for a in vec_a) ** 0.5
        magnitude_b = sum(b * b for b in vec_b) ** 0.5
        if magnitude_a == 0 or magnitude_b == 0: return 0.0
        return dot_product / (magnitude_a * magnitude_b)

    def _prune_oldest(self):
        """Removes the oldest memory to free up space."""
        if not self.storage:
            return
            
        oldest = self.storage.pop(0)
        del self.vector_index[oldest["id"]]
        logger.info(f"Pruned memory {oldest['id']} due to capacity limits.")

    def wipe_memory(self):
        """CRITICAL: Clears all stored memories."""
        self.storage = []
        self.vector_index = {}
        logger.warning("Memory matrix formatted. All data lost.")
