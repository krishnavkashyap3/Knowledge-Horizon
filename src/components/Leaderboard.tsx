import React, { useState } from "react";
import { UserProfile, LeaderboardEntry } from "../types";
import { INITIAL_LEADERBOARD } from "../data";
import { Trophy, Award, TrendingUp, Calendar, Zap, Sparkles, CheckCircle } from "lucide-react";
import { motion } from "motion/react";

interface LeaderboardProps {
  user: UserProfile;
}

export default function Leaderboard({ user }: LeaderboardProps) {
  const [activeTab, setActiveTab] = useState<"all" | "weekly" | "daily">("all");

  // Dynamic ranking list mapping live user XP
  const rankingList: LeaderboardEntry[] = INITIAL_LEADERBOARD.map((item) => {
    if (item.isCurrentUser) {
      return {
        ...item,
        xp: user.xp,
        level: user.level
      };
    }
    return item;
  }).sort((a, b) => b.xp - a.xp); // Rank dynamically!

  // Re-calculate ranks after sorting
  rankingList.forEach((item, idx) => {
    item.rank = idx + 1;
  });

  // Calculate percentage tier
  const userRankIndex = rankingList.findIndex((item) => item.isCurrentUser);
  const userRank = userRankIndex !== -1 ? userRankIndex + 1 : 12;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
      id="leaderboard-viewport"
    >
      {/* High-value standings stats (exact matchup of screenshot) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="standing-metrics-container">
        {/* User Card Standing */}
        <div className="glass-card rounded-2xl p-6 relative flex items-center gap-5 border-l-4 border-l-primary overflow-hidden">
          <div className="absolute right-0 top-0 w-32 h-full bg-primary/5 rounded-full blur-2xl pointer-events-none" />
          
          <img
            src={user.avatarUrl}
            alt={user.name}
            referrerPolicy="no-referrer"
            className="w-16 h-16 rounded-full border-2 border-primary p-0.5 bg-primary/10 shrink-0"
          />

          <div className="space-y-1">
            <h3 className="text-xl font-bold text-white leading-tight">{user.name}</h3>
            <span className="text-xs font-semibold text-secondary uppercase tracking-wider block">
              Level {user.level} · {user.rankTitle}
            </span>
            <div className="flex items-center gap-1 bg-white/5 border border-white/5 px-2.5 py-0.5 rounded-md mt-1 w-max">
              <Trophy className="w-3.5 h-3.5 text-[#ffd700]" />
              <span className="text-[10px] font-bold text-white/90">Global Scholar</span>
            </div>
          </div>
        </div>

        {/* Global Standings Level Track Card */}
        <div className="glass-card rounded-2xl p-6 flex flex-col justify-between border-l-4 border-l-emerald-500 overflow-hidden relative">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
              CURRENT STANDING
            </span>
            <div className="flex items-baseline gap-2">
              <h3 className="text-3xl font-extrabold text-white">#{userRank}</h3>
              <span className="text-[11px] font-semibold text-secondary bg-secondary/10 px-2 py-0.5 rounded-full border border-secondary/20">
                Top 2% of Global Scholars
              </span>
            </div>
          </div>

          <div className="space-y-1 mt-4">
            <div className="flex justify-between text-[10px] font-semibold text-on-surface-variant">
              <span>Next Rank: Master</span>
              <span>85% Completed</span>
            </div>
            <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-secondary rounded-full" style={{ width: "85%" }} />
            </div>
          </div>
        </div>

        {/* Total Points statistics */}
        <div className="glass-card rounded-2xl p-6 flex flex-col justify-between border-l-4 border-l-secondary overflow-hidden relative">
          <div className="absolute right-0 bottom-0 opacity-[0.03] translate-x-4 translate-y-4">
            <Sparkles className="w-40 h-40 text-white" />
          </div>

          <div className="space-y-1">
            <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
              TOTAL KNOWLEDGE POINTS
            </span>
            <div className="flex items-baseline gap-2">
              <p className="text-3xl font-mono font-black text-primary">
                {user.xp.toLocaleString()}
              </p>
              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/15 px-2 py-0.5 rounded border border-emerald-400/25 shrink-0 flex items-center gap-0.5">
                <TrendingUp className="w-3.5 h-3.5" /> +1,240 this week
              </span>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2" id="unlocked-cred-badges">
            <span className="text-[9px] font-semibold bg-white/5 px-2 py-1 rounded border border-white/5 text-white/70">
              🎓 AI Explorer
            </span>
            <span className="text-[9px] font-semibold bg-white/5 px-2 py-1 rounded border border-white/5 text-white/70">
              ⚔️ Logic Master
            </span>
          </div>
        </div>
      </div>

      {/* Main rankings layout */}
      <div className="glass-card rounded-2xl p-6 md:p-8 space-y-6" id="leaderboard-table-card">
        {/* Title, controls alignment */}
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4" id="leaderboard-header-options">
          <h2 className="text-2xl font-serif italic text-white flex items-center gap-2 font-normal animate-fadeIn">
            Global Rankings
          </h2>

          <div className="flex bg-surface-container-high rounded-xl p-1 border border-white/5 w-max" id="standing-tab-group">
            <button
              onClick={() => setActiveTab("all")}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                activeTab === "all"
                  ? "bg-primary text-black font-bold shadow-md"
                  : "text-on-surface-variant hover:text-white"
              }`}
            >
              All-Time
            </button>
            <button
              onClick={() => setActiveTab("weekly")}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                activeTab === "weekly"
                  ? "bg-primary text-black font-bold shadow-md"
                  : "text-on-surface-variant hover:text-white"
              }`}
            >
              Weekly
            </button>
            <button
              onClick={() => setActiveTab("daily")}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                activeTab === "daily"
                  ? "bg-primary text-black font-bold shadow-md"
                  : "text-on-surface-variant hover:text-white"
              }`}
            >
              Daily
            </button>
          </div>
        </div>

        {/* Table Content, matches requirements: no vertical columns divide, styled as polished rows with gray 1px borders */}
        <div className="overflow-x-auto" id="leaderboard-table-scroller">
          <table className="w-full text-left border-collapse" id="rankings-table">
            <thead>
              <tr className="border-b border-white/10 text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                <th className="py-4 px-4 w-20">Rank</th>
                <th className="py-4 px-4">Scholar</th>
                <th className="py-4 px-4">Level</th>
                <th className="py-4 px-4 text-right">Knowledge Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2d2d2d]">
              {rankingList.map((entry) => {
                const isTop3 = entry.rank <= 3;
                
                // Colors for podium
                let rankStyle = "text-on-surface-variant font-medium font-mono";
                if (entry.rank === 1) rankStyle = "text-[#ffd700] font-extrabold text-lg animate-pulse";
                if (entry.rank === 2) rankStyle = "text-[#c0c0c0] font-extrabold text-base";
                if (entry.rank === 3) rankStyle = "text-[#cd7f32] font-extrabold text-base";

                return (
                  <tr
                    key={entry.name}
                    className={`transition-colors duration-150 ${
                      entry.isCurrentUser
                        ? "bg-primary/5 hover:bg-primary/10 border-y border-primary/20"
                        : "hover:bg-white/[0.02]"
                    }`}
                  >
                    {/* Rank */}
                    <td className="py-4 px-4">
                      <span className={rankStyle}>
                        {entry.rank === 1 ? "🥇 1" : entry.rank === 2 ? "🥈 2" : entry.rank === 3 ? "🥉 3" : entry.rank}
                      </span>
                    </td>

                    {/* Scholar profile */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className={`relative w-9 h-9 rounded-full ${
                          entry.rank === 1
                            ? "ring-2 ring-[#ffd700] ring-offset-2 ring-offset-[#121212]"
                            : entry.isCurrentUser
                            ? "ring-1 ring-primary ring-offset-1 ring-offset-[#121212]"
                            : ""
                        }`}>
                          <img
                            src={entry.avatarUrl}
                            alt={entry.name}
                            referrerPolicy="no-referrer"
                            className="w-full h-full rounded-full object-cover bg-surface-container-high"
                          />
                        </div>

                        <div>
                          <span className={`text-sm block font-bold leading-tight ${
                            entry.isCurrentUser ? "text-primary" : "text-white"
                          }`}>
                            {entry.name} {entry.isCurrentUser && "(You)"}
                          </span>
                          <span className="text-[10px] text-on-surface-variant leading-none">{entry.specialty || "Scholar"}</span>
                        </div>
                      </div>
                    </td>

                    {/* Level */}
                    <td className="py-4 px-4">
                      <span className="text-sm font-bold text-white/90">
                        {entry.level}
                      </span>
                    </td>

                    {/* Knowledge Score / XP */}
                    <td className="py-4 px-4 text-right">
                      <span className={`text-sm font-extrabold font-mono ${
                        entry.isCurrentUser ? "text-primary text-base" : "text-[#4fdbc8]"
                      }`}>
                        {entry.xp.toLocaleString()} XP
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}
