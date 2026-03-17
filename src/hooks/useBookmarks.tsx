"use client";

import { useState, useEffect } from "react";

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<number[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("seraphy_bookmarks");
    if (stored) {
      setBookmarks(JSON.parse(stored));
    }
  }, []);

  const isBookmarked = (id: number) => bookmarks.includes(id);

  const toggleBookmark = (id: number) => {
    const newBookmarks = isBookmarked(id)
      ? bookmarks.filter((b) => b !== id)
      : [...bookmarks, id];
    
    setBookmarks(newBookmarks);
    localStorage.setItem("seraphy_bookmarks", JSON.stringify(newBookmarks));
  };

  return { isBookmarked, toggleBookmark };
}