import { notFound } from "next/navigation";
import fs from "fs";
import path from "path";
import PromptDetailClient from "./PromptDetailClient";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function PromptDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  const id = resolvedParams.id;

  // Load data server-side
  let allPrompts: any[] = [];

  try {
    const promptsPath = path.join(process.cwd(), "public/data/prompts.json");
    const allPromptsPath = path.join(process.cwd(), "public/data/all_prompts.json");

    if (fs.existsSync(promptsPath)) {
      const promptsData = fs.readFileSync(promptsPath, "utf-8");
      const prompts = JSON.parse(promptsData);
      allPrompts = Array.isArray(prompts) ? prompts : [];
    }

    if (fs.existsSync(allPromptsPath)) {
      const allPromptsData = fs.readFileSync(allPromptsPath, "utf-8");
      const additionalPrompts = JSON.parse(allPromptsData);
      const additionalArray = Array.isArray(additionalPrompts) ? additionalPrompts : [];
      allPrompts = [...allPrompts, ...additionalArray];
    }
  } catch (error) {
    console.error("Error loading prompt data:", error);
  }

  const prompt = allPrompts.find((p: any) => p.id.toString() === id || p.slug === id);

  if (!prompt) {
    notFound();
  }

  return <PromptDetailClient prompt={prompt} />;
}