import fs from "fs";
import path from "path";
import PromptmastersClient from "./PromptmastersClient";

export default function PromptmastersPage() {
  // Load data server-side
  let masters: any[] = [];

  try {
    const mastersPath = path.join(process.cwd(), "public/data/promptmasters.json");
    if (fs.existsSync(mastersPath)) {
      const mastersData = fs.readFileSync(mastersPath, "utf-8");
      const parsed = JSON.parse(mastersData);
      masters = Array.isArray(parsed) ? parsed : [];
    }
  } catch (error) {
    console.error("Error loading promptmasters data:", error);
  }

  return <PromptmastersClient initialMasters={masters} />;
}