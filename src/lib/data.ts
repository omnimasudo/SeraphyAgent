import { Prompt, Skill, Category, Tag, Promptmaster, Summary } from '@/types';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || '';

export async function getPrompts(): Promise<Prompt[]> {
  const res = await fetch(`${BASE_URL}/data/prompts.json`);
  return res.json();
}

export async function getSkills(): Promise<Skill[]> {
  const res = await fetch(`${BASE_URL}/data/skills.json`);
  return res.json();
}

export async function getCategories(): Promise<Category[]> {
  const res = await fetch(`${BASE_URL}/data/categories.json`);
  return res.json();
}

export async function getTags(): Promise<Tag[]> {
  const res = await fetch(`${BASE_URL}/data/tags.json`);
  return res.json();
}

export async function getPromptmasters(): Promise<Promptmaster[]> {
  const res = await fetch(`${BASE_URL}/data/promptmasters.json`);
  return res.json();
}

export async function getSummary(): Promise<Summary> {
  const res = await fetch(`${BASE_URL}/data/summary.json`);
  return res.json();
}

// For server components - direct import
export function getPromptsSync(): Prompt[] {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  return require('../../public/data/prompts.json');
}

export function getSkillsSync(): Skill[] {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  return require('../../public/data/skills.json');
}

export function getCategoriesSync(): Category[] {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  return require('../../public/data/categories.json');
}

export function getTagsSync(): Tag[] {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  return require('../../public/data/tags.json');
}

export function getPromptmastersSync(): Promptmaster[] {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  return require('../../public/data/promptmasters.json');
}

export function getSummarySync(): Summary {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  return require('../../public/data/summary.json');
}
