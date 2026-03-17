import fs from "fs";
import path from "path";
import SkillsClient from "./SkillsClient";

export default function SkillsPage() {
  // Load data server-side
  let skills: any[] = [];
  let categories: any[] = [];

  try {
    const skillsPath = path.join(process.cwd(), "public/data/skills.json");
    if (fs.existsSync(skillsPath)) {
      const skillsData = fs.readFileSync(skillsPath, "utf-8");
      const parsed = JSON.parse(skillsData);
      skills = Array.isArray(parsed) ? parsed : (parsed.skills || []);
    }

    const categoriesPath = path.join(process.cwd(), "public/data/skills-categories.json");
    if (fs.existsSync(categoriesPath)) {
      const categoriesData = fs.readFileSync(categoriesPath, "utf-8");
      const parsed = JSON.parse(categoriesData);
      categories = Array.isArray(parsed) ? parsed : [];
    }
  } catch (error) {
    console.error("Error loading skills data:", error);
  }

  return <SkillsClient initialSkills={skills} initialCategories={categories} />;
}
