import { Prompt, Skill, Category, Tag, Promptmaster, Summary } from '@/types';

export async function getPrompts(): Promise<Prompt[]> {
  return getPromptsSync();
}

export async function getSkills(): Promise<Skill[]> {
  return getSkillsSync();
}

export async function getCategories(): Promise<Category[]> {
  return getCategoriesSync();
}

export async function getTags(): Promise<Tag[]> {
  return getTagsSync();
}

export async function getPromptmasters(): Promise<Promptmaster[]> {
  return getPromptmastersSync();
}

export async function getSummary(): Promise<Summary> {
  return getSummarySync();
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
