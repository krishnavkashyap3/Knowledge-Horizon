import React, { useState } from "react";
import { LibraryResource } from "../types";
import { INITIAL_RESOURCES } from "../data";
import { BookOpen, Search, Check, Sparkles, X, Compass, ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface LibraryProps {
  onAddXp: (amount: number) => void;
  selectedTrackId?: string | null;
  onClearTrackSelection?: () => void;
}

export default function Library({ onAddXp, selectedTrackId, onClearTrackSelection }: LibraryProps) {
  const [filter, setFilter] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeReadingItem, setActiveReadingItem] = useState<LibraryResource | null>(null);
  const [readCompletedIds, setReadCompletedIds] = useState<string[]>([]);
  const [readingRewardClaimed, setReadingRewardClaimed] = useState<boolean>(false);

  // Directly load initial resources
  const allResources = INITIAL_RESOURCES;

  // Handle selected pre-routed track automatically if passed from dashboard
  React.useEffect(() => {
    if (selectedTrackId) {
      const match = allResources.find((r) => r.id === selectedTrackId);
      if (match) {
        setActiveReadingItem(match);
        setReadingRewardClaimed(false);
      }
      if (onClearTrackSelection) onClearTrackSelection();
    }
  }, [selectedTrackId, allResources, onClearTrackSelection]);

  // Categories list
  const categories = ["All", "Science", "Technology", "AI", "History"];

  // Filter & search logic
  const filteredResources = allResources.filter((item) => {
    const matchesFilter = filter === "All" || item.category === filter || (filter === "Technology" && item.category === "AI" || filter === "AI" && item.category === "AI");
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleOpenReader = (item: LibraryResource) => {
    setActiveReadingItem(item);
    setReadingRewardClaimed(false);
  };

  const handleCloseReader = () => {
    setActiveReadingItem(null);
  };

  const handleFinishReading = (id: string) => {
    if (!readCompletedIds.includes(id)) {
      setReadCompletedIds((prev) => [...prev, id]);
      onAddXp(150); // Claim 150 learning bonus XP
      setReadingRewardClaimed(true);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
      id="library-viewport"
    >
      {/* Library intro banner */}
      <div className="relative p-6 rounded-2xl bg-gradient-to-r from-surface-container-low to-surface-container-high border border-white/5 overflow-hidden shadow-2xl">
        <div className="absolute right-0 top-0 w-80 h-full bg-primary/5 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-2xl relative z-10 space-y-2">
          <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider">
            <Compass className="w-4 h-4" /> KNOWLEDGE COMPENDIUM
          </div>
          <h2 className="text-3xl md:text-4xl font-serif italic font-normal tracking-tight text-white mb-2">Digital Library</h2>
          <p className="text-on-surface-variant text-sm leading-relaxed">
            Expand your horizon with fully researched articles, verified textbook references, and technical guides. Complete deep-dive reading logs to earn credentials and level rewards.
          </p>
        </div>
      </div>

      {/* Categories filter and Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-2" id="filter-bar">
        {/* Buttons */}
        <div className="flex flex-wrap gap-2" id="category-selector">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold cursor-pointer transition-all duration-200 ${
                filter === cat
                  ? "bg-primary text-black font-bold shadow-[0_0_15px_rgba(245,158,11,0.2)]"
                  : "bg-surface-container hover:bg-surface-container-high text-on-surface-variant border border-white/5"
              }`}
            >
              {cat === "All" ? "All Resources" : cat}
            </button>
          ))}
        </div>

        {/* Dynamic query field */}
        <div className="relative w-full md:w-72" id="search-input-wrapper">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-on-surface-variant">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            placeholder="Search knowledge compendium..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-surface-container border border-[#2d2d2d] focus:border-primary px-3 py-1.5 pl-10 rounded-full text-xs text-white focus:outline-none focus:ring-1 focus:ring-primary/40 placeholder-on-surface-variant"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-on-surface-variant hover:text-white"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Grid view of books & articles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="resources-grid-container">
        <AnimatePresence mode="popLayout">
          {filteredResources.map((item) => {
            const isCompleted = readCompletedIds.includes(item.id);
            return (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                key={item.id}
                className="group glass-card rounded-2xl overflow-hidden glow-hover transition-all duration-300 flex flex-col justify-between h-full border border-white/5"
              >
                <div>
                  {/* Absolute header visual wrapper */}
                  <div className="relative h-44 overflow-hidden bg-surface-container-lowest">
                    <img
                      src={item.coverImageUrl}
                      alt={item.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0c] via-transparent to-transparent opacity-85" />

                    <div className="absolute top-3 right-3 flex items-center gap-2">
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase border ${
                        item.type === "book"
                          ? "bg-secondary-container/20 text-secondary border-secondary/30"
                          : "bg-primary/25 text-primary border-primary/30"
                      }`}>
                        {item.type}
                      </span>
                    </div>

                    {isCompleted && (
                      <div className="absolute top-3 left-3 bg-secondary/85 backdrop-blur-md px-2.5 py-0.5 rounded-full flex items-center gap-1 border border-secondary">
                        <Check className="w-3.5 h-3.5 text-on-secondary" />
                        <span className="text-[9px] font-bold text-on-secondary uppercase">READ</span>
                      </div>
                    )}
                  </div>

                  <div className="p-5 space-y-3">
                    <div className="flex justify-between items-center text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
                      <span>{item.category}</span>
                      <span>•</span>
                      <span>{item.difficulty}</span>
                    </div>
                    <h3 className="text-lg font-serif italic text-white group-hover:text-primary transition-colors leading-snug font-normal">
                      {item.title}
                    </h3>
                    <p className="text-on-surface-variant text-sm leading-relaxed line-clamp-2">
                      {item.description}
                    </p>
                  </div>
                </div>

                <div className="p-5 pt-0 border-t border-white/5 mt-auto flex items-center justify-between">
                  <span className="text-xs font-medium text-secondary flex items-center gap-1">
                    <BookOpen className="w-3.5 h-3.5" />
                    {item.readTimeOrPages}
                  </span>
                  <button
                    onClick={() => handleOpenReader(item)}
                    className="text-xs font-bold text-primary hover:text-white flex items-center gap-1 cursor-pointer group"
                  >
                    Read Compendium
                    <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {filteredResources.length === 0 && (
        <div className="text-center py-16 bg-surface-container/30 rounded-2xl border border-white/5 space-y-2">
          <BookOpen className="w-12 h-12 text-on-surface-variant mx-auto opacity-40" />
          <h4 className="text-white font-bold text-lg">No resources found</h4>
          <p className="text-on-surface-variant text-sm">Try broadening or clarifying your search term queries.</p>
        </div>
      )}

      {/* IMERSIVE READER LIGHTBOX/MODAL (STYLING SPEC: SOURCE SERIF 4) */}
      <AnimatePresence>
        {activeReadingItem && (
          <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
            {/* Overlay backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCloseReader}
              className="fixed inset-0 bg-[#000]/80 backdrop-blur-md"
            />

            {/* Complete Card Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-[#121212] border border-[#2d2d2d] rounded-2xl w-full max-w-4xl max-h-[85vh] overflow-y-auto hide-scrollbar z-10 flex flex-col shadow-2xl"
              id="reader-modal"
            >
              {/* Image banner ceiling */}
              <div className="relative h-64 min-h-[256px] w-full" id="reader-cover">
                <img
                  src={activeReadingItem.coverImageUrl}
                  alt={activeReadingItem.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-black/40 to-black/80" />

                {/* Close Button */}
                <button
                  onClick={handleCloseReader}
                  className="absolute top-4 right-4 bg-black/60 hover:bg-black/90 p-2 rounded-full border border-white/10 text-white cursor-pointer transition-all"
                  aria-label="Close reader"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="absolute bottom-6 left-6 right-6 space-y-2">
                  <span className="text-xs font-semibold text-primary uppercase tracking-widest bg-primary-container/10 px-2.5 py-1 rounded border border-primary-container/30">
                    {activeReadingItem.category} • {activeReadingItem.badge}
                  </span>
                  <h2 className="text-3xl md:text-4xl font-extrabold text-white mt-2 leading-tight">
                    {activeReadingItem.title}
                  </h2>
                </div>
              </div>

              {/* Reader Body content container (styled using Serif Font Source-Serif-4 and optimized tracking/height) */}
              <div className="p-6 md:p-10 space-y-8 flex-grow" id="reader-content-body">
                <div
                  className="font-serif text-white/90 text-lg md:text-xl leading-relaxed max-w-3xl mx-auto space-y-6 select-text"
                  style={{ fontFamily: "'Source Serif 4', Georgia, serif" }}
                >
                  {/* Complete textual representation in elegant HTML, preserving hierarchy */}
                  <div className="prose prose-invert prose-emerald max-w-none">
                    {activeReadingItem.contentMarkdown.split("\n\n").map((para, i) => {
                      if (para.startsWith("# ")) {
                        return <h1 key={i} className="text-2xl md:text-3.5xl font-bold tracking-tight text-white mb-6 border-b border-white/5 pb-2">{para.replace("# ", "")}</h1>;
                      }
                      if (para.startsWith("## ")) {
                        return <h2 key={i} className="text-xl md:text-2.5xl font-bold tracking-tight text-primary mt-8 mb-4">{para.replace("## ", "")}</h2>;
                      }
                      if (para.startsWith("### ")) {
                        return <h3 key={i} className="text-lg md:text-1.5xl font-bold text-white mt-6 mb-3">{para.replace("### ", "")}</h3>;
                      }
                      if (para.startsWith("* ")) {
                        return (
                          <ul key={i} className="list-disc pl-6 space-y-2 mb-4">
                            {para.split("\n").map((line, j) => (
                              <li key={j} className="text-white/80 leading-relaxed font-sans text-sm md:text-base">{line.replace("* ", "")}</li>
                            ))}
                          </ul>
                        );
                      }
                      return <p key={i} className="leading-relaxed text-sm md:text-base mb-6 font-sans text-white/85 text-justify">{para}</p>;
                    })}
                  </div>
                </div>

                {/* Progress Complete Button state inside modal */}
                <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4 max-w-3xl mx-auto">
                  <div className="space-y-1">
                    <span className="text-xs text-on-surface-variant font-medium block">STUDY PROGRESS</span>
                    <p className="text-sm font-semibold text-white">
                      Complete this manuscript to unlock 150 points for Level standing.
                    </p>
                  </div>

                  {readCompletedIds.includes(activeReadingItem.id) ? (
                    <motion.div
                      initial={{ scale: 0.9 }}
                      animate={{ scale: 1 }}
                      className="flex items-center gap-2 bg-secondary/15 border border-secondary text-secondary p-3 rounded-xl px-5 text-sm font-bold shadow-lg"
                    >
                      <Check className="w-5 h-5 stroke-[3]" />
                      Claimed +150 study XP
                    </motion.div>
                  ) : (
                    <button
                      onClick={() => handleFinishReading(activeReadingItem.id)}
                      className="bg-secondary text-on-secondary hover:shadow-[0_0_20px_rgba(79,219,200,0.4)] px-6 py-3 rounded-xl text-sm font-bold cursor-pointer transition-all active:scale-95 flex items-center justify-center gap-2"
                    >
                      <Sparkles className="w-4 h-4 text-on-secondary animate-pulse" />
                      Mark As Read & Claim 150 XP
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
