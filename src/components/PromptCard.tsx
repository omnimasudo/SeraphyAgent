'use client';

import { Prompt } from '@/types';
import { Copy, Check, Code, Image, Video, Mic, FileJson, Zap } from 'lucide-react';
import { useState } from 'react';

const typeIcons = {
  TEXT: Code,
  IMAGE: Image,
  VIDEO: Video,
  AUDIO: Mic,
  STRUCTURED: FileJson,
  SKILL: Zap,
};

const typeColors = {
  TEXT: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  IMAGE: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  VIDEO: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  AUDIO: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  STRUCTURED: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
  SKILL: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
};

export default function PromptCard({ prompt }: { prompt: Prompt }) {
  const [copied, setCopied] = useState(false);
  const Icon = typeIcons[prompt.type] || Code;

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(prompt.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="group bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 hover:shadow-lg transition-all duration-200 hover:border-blue-300 dark:hover:border-blue-600">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${typeColors[prompt.type]}`}>
            <Icon className="w-3 h-3" />
            {prompt.type}
          </span>
          {prompt.for_devs && (
            <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300">
              For Devs
            </span>
          )}
        </div>
        <button
          onClick={copyToClipboard}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          title="Copy prompt"
        >
          {copied ? (
            <Check className="w-4 h-4 text-green-500" />
          ) : (
            <Copy className="w-4 h-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300" />
          )}
        </button>
      </div>

      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        {prompt.title}
      </h3>

      <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">
        {prompt.content.slice(0, 200)}...
      </p>

      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
        <span className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
          {prompt.category}
        </span>
        <span>{prompt.word_count} words</span>
      </div>

      {prompt.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-3">
          {prompt.tags.slice(0, 3).map(tag => (
            <span
              key={tag}
              className="px-2 py-0.5 text-xs rounded-full bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
