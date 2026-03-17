import fs from "fs";
import path from "path";
import PromptsClient from "./PromptsClient";

interface Prompt {
  id: string | number;
  title: string;
  slug: string;
  content: string;
  type?: string;
  for_devs?: boolean;
  category?: string;
  tags?: string[];
  contributors?: string[];
  word_count?: number;
  char_count?: number;
  description?: string;
}

interface Category {
  id: string;
  slug: string;
  name: string;
}

export default function PromptsPage() {
  // Load data server-side
  let prompts: Prompt[] = [];
  let categories: Category[] = [];

  try {
    const promptsPath = path.join(process.cwd(), "public/data/prompts.json");
    if (fs.existsSync(promptsPath)) {
      const promptsData = fs.readFileSync(promptsPath, "utf-8");
      const parsed = JSON.parse(promptsData);
      prompts = Array.isArray(parsed) ? parsed : [];
    }

    const categoriesPath = path.join(process.cwd(), "public/data/categories.json");
    if (fs.existsSync(categoriesPath)) {
      const categoriesData = fs.readFileSync(categoriesPath, "utf-8");
      const parsed = JSON.parse(categoriesData);
      categories = Array.isArray(parsed) ? parsed : [];
    }

    // Fallback categories if none loaded
    if (categories.length === 0) {
      categories = [
        { id: "1", slug: "coding", name: "Coding" },
        { id: "2", slug: "writing", name: "Writing" },
        { id: "3", slug: "marketing", name: "Marketing" },
        { id: "4", slug: "business", name: "Business" },
        { id: "5", slug: "development", name: "Development" },
      ];
    }
  } catch (error) {
    console.error("Error loading data:", error);
  }

  return <PromptsClient initialPrompts={prompts} initialCategories={categories} />;
}