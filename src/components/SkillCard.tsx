'use client';

import { Skill } from '@/types';
import { Zap, ExternalLink } from 'lucide-react';

export default function SkillCard({ skill }: { skill: Skill }) {
  return (
    <div className="group bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-xl border border-yellow-200 dark:border-yellow-800 p-5 hover:shadow-lg transition-all duration-200 hover:border-yellow-400 dark:hover:border-yellow-600">
      <div className="flex items-start justify-between gap-3 mb-3">
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
          <Zap className="w-3 h-3" />
          SKILL
        </span>
        <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-yellow-600 transition-colors" />
      </div>

      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        {skill.title}
      </h3>

      <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
        {skill.description}
      </p>

      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-3">
        <span className="bg-white/50 dark:bg-gray-800/50 px-2 py-1 rounded">
          {skill.category}
        </span>
        <span className="text-yellow-600 dark:text-yellow-400">@{skill.contributor}</span>
      </div>

      {skill.tags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {skill.tags.slice(0, 4).map(tag => (
            <span
              key={tag}
              className="px-2 py-0.5 text-xs rounded-full bg-yellow-100/50 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
