export interface Prompt {
  id: number;
  title: string;
  slug: string;
  content: string;
  type: 'TEXT' | 'IMAGE' | 'VIDEO' | 'AUDIO' | 'STRUCTURED' | 'SKILL';
  for_devs: boolean;
  category: string;
  tags: string[];
  variables: { name: string; default: string | null }[];
  contributors: string[];
  word_count: number;
  char_count: number;
  image?: string;
}

export interface Skill {
  id: number;
  name: string;
  slug: string;
  description: string;
  category: string;
  tags?: string[];
  author: string;
  github_url: string;
  install_command: string;
  featured?: boolean;
  popular?: boolean;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  icon: string;
  prompt_count: number;
}

export interface Tag {
  id: number;
  name: string;
  slug: string;
  prompt_count: number;
}

export interface Promptmaster {
  rank: number;
  username: string;
  prompt_count: number;
  prompt_ids: number[];
}

export interface Summary {
  total_prompts: number;
  regular_prompts: number;
  skills: number;
  categories: number;
  tags: number;
  contributors: number;
  prompt_types: Record<string, number>;
}
