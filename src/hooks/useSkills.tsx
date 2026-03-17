"use client";

import { useState, useEffect } from "react";
import { Skill } from "@/types";

export function useSkills() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSkills() {
      try {
        // Fetch from existing API or load local JSON
        // Since we are client-side, we can fetch the public json file directly if served statically
        // Or call an API route. Here we assume fetching the public JSON.
        const res = await fetch("/data/skills.json");
        const data = await res.json();
        setSkills(data.skills || []); // Adjust based on JSON structure
      } catch (error) {
        console.error("Failed to fetch skills:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchSkills();
  }, []);

  const getSkillBySlug = (slug: string | string[] | undefined) => {
    if (!slug) return undefined;
    const slugStr = Array.isArray(slug) ? slug[0] : slug;
    return skills.find((skill) => skill.slug === slugStr);
  };

  return { skills, loading, getSkillBySlug };
}