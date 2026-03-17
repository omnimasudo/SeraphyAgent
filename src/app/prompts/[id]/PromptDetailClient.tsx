"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft, Copy, Check, User, Tag, Loader2,
  Code, Activity, Hash, ChevronDown, Bot, Sparkles, BrainCircuit, Type, ShieldAlert,
  AlertCircle, X
} from "lucide-react";

interface PromptDetailClientProps {
  prompt: any;
}

export default function PromptDetailClient({ prompt }: PromptDetailClientProps) {
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showGeminiWarning, setShowGeminiWarning] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const getCopyOptions = () => [
    { label: "Copy Prompt Only", value: prompt.content },
    { label: "Copy with Title", value: `${prompt.title}\n\n${prompt.content}` },
    { label: "Copy Full Details", value: `Title: ${prompt.title}\nContent: ${prompt.content}\nTags: ${prompt.tags?.join(", ") || "N/A"}\nContributors: ${prompt.contributors?.join(", ") || "N/A"}` }
  ];

  const isGeminiPrompt = prompt.content?.toLowerCase().includes("gemini") ||
                        prompt.title?.toLowerCase().includes("gemini") ||
                        prompt.tags?.some((tag: string) => tag.toLowerCase().includes("gemini"));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-slate-200/60 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => router.back()}
            className="flex items-center space-x-2 text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Prompts</span>
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Gemini Warning */}
        {isGeminiPrompt && (
          <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="text-sm font-semibold text-amber-800">Gemini Compatibility Notice</h3>
                <p className="text-sm text-amber-700 mt-1">
                  This prompt may contain Gemini-specific syntax. Some features might not work with other AI models.
                </p>
                <button
                  onClick={() => setShowGeminiWarning(true)}
                  className="text-xs text-amber-600 hover:text-amber-800 mt-2 underline"
                >
                  Learn more about compatibility
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">
          {/* Title Section */}
          <div className="p-6 border-b border-slate-100">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-slate-900 mb-2">{prompt.title}</h1>
                {prompt.description && (
                  <p className="text-slate-600">{prompt.description}</p>
                )}
              </div>

              {/* Copy Button */}
              <div className="relative ml-4" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? "Copied!" : "Copy"}</span>
                  <ChevronDown className="w-4 h-4" />
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white border border-slate-200 rounded-lg shadow-lg z-10">
                    {getCopyOptions().map((option, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          copyToClipboard(option.value);
                          setIsDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-3 hover:bg-slate-50 transition-colors first:rounded-t-lg last:rounded-b-lg"
                      >
                        <div className="font-medium text-slate-900">{option.label}</div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="p-6">
            <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
              <pre className="whitespace-pre-wrap text-slate-800 font-mono text-sm leading-relaxed">
                {prompt.content}
              </pre>
            </div>
          </div>

          {/* Metadata Section */}
          <div className="px-6 pb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Tags */}
              {prompt.tags && prompt.tags.length > 0 && (
                <div>
                  <div className="flex items-center space-x-2 mb-3">
                    <Tag className="w-4 h-4 text-slate-500" />
                    <span className="font-semibold text-slate-900">Tags</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {prompt.tags.map((tag: string, index: number) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Contributors */}
              {prompt.contributors && prompt.contributors.length > 0 && (
                <div>
                  <div className="flex items-center space-x-2 mb-3">
                    <User className="w-4 h-4 text-slate-500" />
                    <span className="font-semibold text-slate-900">Contributors</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {prompt.contributors.map((contributor: string, index: number) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                      >
                        {contributor}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Additional Info */}
            <div className="mt-6 pt-6 border-t border-slate-100">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                {prompt.word_count && (
                  <div>
                    <div className="text-2xl font-bold text-slate-900">{prompt.word_count}</div>
                    <div className="text-sm text-slate-500">Words</div>
                  </div>
                )}
                {prompt.char_count && (
                  <div>
                    <div className="text-2xl font-bold text-slate-900">{prompt.char_count}</div>
                    <div className="text-sm text-slate-500">Characters</div>
                  </div>
                )}
                {prompt.type && (
                  <div>
                    <div className="text-2xl font-bold text-slate-900 capitalize">{prompt.type}</div>
                    <div className="text-sm text-slate-500">Type</div>
                  </div>
                )}
                {prompt.for_devs !== undefined && (
                  <div>
                    <div className="text-2xl font-bold text-slate-900">
                      {prompt.for_devs ? "Yes" : "No"}
                    </div>
                    <div className="text-sm text-slate-500">For Developers</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Gemini Warning Modal */}
      {showGeminiWarning && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900">Gemini Compatibility</h3>
              <button
                onClick={() => setShowGeminiWarning(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3 text-sm text-slate-600">
              <p>This prompt contains Gemini-specific syntax or references.</p>
              <p><strong>What this means:</strong></p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>May use Gemini-only features</li>
                <li>Could have different behavior in other models</li>
                <li>Might require adjustments for compatibility</li>
              </ul>
              <p className="mt-4"><strong>Recommendation:</strong> Test with your target AI model and adjust as needed.</p>
            </div>
            <button
              onClick={() => setShowGeminiWarning(false)}
              className="w-full mt-6 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </div>
  );
}