import React, { useEffect, useState } from "react";
import { Award, Flame, Clock, ArrowRight, Play, Trophy, Sparkles } from "lucide-react";
import { UserProfile, LibraryResource, LeaderboardEntry } from "../types";
import { INITIAL_RESOURCES, INITIAL_LEADERBOARD } from "../data";
import { motion } from "motion/react";

interface DashboardProps {
  user: UserProfile;
  onNavigate: (tab: string) => void;
  onSelectTrack: (trackId: string) => void;
  onStartFlashQuiz: () => void;
  onAddDailyProgress: () => void;
}

export default function Dashboard({
  user,
  onNavigate,
  onSelectTrack,
  onStartFlashQuiz,
  onAddDailyProgress
}: DashboardProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Filter recommended resources
  const recommendedTracks = INITIAL_RESOURCES.slice(0, 3);

  // Filter high rankings for quick display
  const top1 = INITIAL_LEADERBOARD.find((l) => l.rank === 1);
  const nextPeer = INITIAL_LEADERBOARD.find((l) => l.rank === 43);

  // SVG parameters for standard 120 size circle
  const size = 128;
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const goalOffset = mounted
    ? circumference - (user.dailyGoalDone / user.dailyGoalMax) * circumference
    : circumference;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="space-y-8 h-full"
      id="dashboard-root"
    >
      {/* Bento Grid layout containing Progress State and Daily Goal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="bento-container">
        {/* Progress Card (Level Standing) */}
        <div
          className="lg:col-span-2 glass-card rounded-2xl p-6 flex flex-col justify-between relative overflow-hidden transition-all duration-300 border-l-4 border-l-primary/60"
          id="standing-card"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] pointer-events-none" />
          <div className="relative z-10 w-full">
            <div className="flex justify-between items-start mb-6">
              <div>
                <span className="text-xs font-semibold text-primary uppercase tracking-widest block mb-1">
                  CURRENT STANDING
                </span>
                <h3 className="text-2xl font-serif italic font-normal tracking-tight text-white flex items-center gap-2">
                  Level {user.level} {user.name.split(" ")[1] || "Scholar"}
                  <Sparkles className="w-5 h-5 text-primary stroke-[1.5]" />
                </h3>
              </div>
              <div className="text-right">
                <span className="text-4xl font-extrabold text-primary font-mono tracking-tight">85%</span>
                <p className="text-xs text-on-surface-variant font-medium mt-1">To Level {user.level + 1}</p>
              </div>
            </div>

            {/* Dynamic Slider progress track */}
            <div className="w-full h-3 bg-surface-container-high rounded-full overflow-hidden mb-6 relative">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "85%" }}
                transition={{ duration: 1.2, ease: "easeInOut" }}
                className="h-full bg-gradient-to-r from-primary/80 to-primary relative rounded-full"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/20 animate-pulse" />
              </motion.div>
            </div>

            {/* Badge counts */}
            <div className="flex flex-wrap gap-6" id="user-badges">
              <div className="flex items-center gap-2 p-2 px-3 bg-surface-container/50 rounded-xl border border-white/5 shadow-sm">
                <Award className="w-5 h-5 text-secondary" />
                <span className="text-xs font-semibold text-white/90">
                  {user.masteredSkillsCount} Mastered Skills
                </span>
              </div>
              <div className="flex items-center gap-2 p-2 px-3 bg-surface-container/50 rounded-xl border border-white/5 shadow-sm">
                <Flame className="w-5 h-5 text-secondary" />
                <span className="text-xs font-semibold text-white/90">
                  {user.streakDays} Day Streak
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Daily Goal card */}
        <div
          className="glass-card rounded-2xl p-6 flex flex-col items-center justify-center text-center glow-hover transition-all duration-300"
          id="daily-goal-card"
        >
          <span className="text-xs font-semibold text-on-surface-variant uppercase tracking-widest mb-4">
            DAILY GOAL
          </span>

          <div className="relative w-32 h-32 mb-4 flex items-center justify-center" id="goal-svg-container">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                className="text-surface-container-high"
                cx="64"
                cy="64"
                fill="transparent"
                r={radius}
                stroke="currentColor"
                strokeWidth={strokeWidth}
              />
              <motion.circle
                className="text-secondary stroke-linecap-round"
                cx="64"
                cy="64"
                fill="transparent"
                r={radius}
                stroke="currentColor"
                strokeWidth={strokeWidth}
                strokeDasharray={circumference}
                animate={{ strokeDashoffset: goalOffset }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold text-white font-mono">
                {user.dailyGoalDone}/{user.dailyGoalMax}
              </span>
              <span className="text-[10px] uppercase font-bold text-on-surface-variant tracking-wider">
                UNITS
              </span>
            </div>
          </div>

          <p className="text-sm font-medium text-white mb-3">
            {user.dailyGoalDone >= user.dailyGoalMax
              ? "Magnificent! Daily goal conquered! 🎉"
              : `Almost there, ${user.name.split(" ")[0]}!`}
          </p>

          <button
            onClick={onAddDailyProgress}
            className="w-full bg-secondary-container/10 hover:bg-secondary/20 text-secondary border border-secondary/30 px-4 py-2 rounded-xl text-xs font-bold transition-all active:scale-[0.98] cursor-pointer"
            id="btn-daily-progress"
          >
            Complete Daily Unit
          </button>
        </div>
      </div>

      {/* Featured Tracks Section */}
      <div className="space-y-4" id="recommended-tracks-section">
        <div className="flex justify-between items-end">
          <h2 className="text-2xl md:text-3xl font-serif italic font-normal tracking-tight text-white flex items-center gap-2">
            Recommended Tracks
          </h2>
          <button
            onClick={() => onNavigate("Library")}
            className="text-xs font-bold text-primary hover:underline flex items-center gap-1 cursor-pointer"
          >
            View All Library <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="recommended-grid">
          {recommendedTracks.map((track) => (
            <div
              key={track.id}
              onClick={() => onSelectTrack(track.id)}
              className="group glass-card rounded-2xl overflow-hidden glow-hover transition-all duration-300 cursor-pointer flex flex-col h-full"
              id={`track-${track.id}`}
            >
              <div className="h-44 relative overflow-hidden bg-surface-container/50">
                <img
                  src={track.coverImageUrl}
                  alt={track.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transform group-hover:scale-[1.08] transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0c] via-transparent to-transparent opacity-80" />
                <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                  <span className="text-[10px] font-bold text-primary uppercase tracking-wider">
                    {track.badge}
                  </span>
                </div>
              </div>
              <div className="p-5 flex flex-col justify-between flex-grow">
                <div>
                  <h4 className="text-lg font-serif italic font-normal text-white mb-2 group-hover:text-primary transition-colors">
                    {track.title}
                  </h4>
                  <p className="text-on-surface-variant text-sm line-clamp-2 leading-relaxed mb-4">
                    {track.description}
                  </p>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-white/5">
                  <span className="text-xs font-medium text-secondary flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" /> {track.readTimeOrPages}
                  </span>
                  <span className="text-primary group-hover:translate-x-1.5 transition-transform">
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Launch & Leaderboard quick standings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" id="bottom-bento">
        {/* Flash Quiz Card */}
        <div
          className="glass-card rounded-2xl p-6 flex flex-col justify-between border-l-4 border-l-primary relative overflow-hidden"
          id="flash-quiz-card"
        >
          <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none translate-x-4 translate-y-4">
            <Trophy className="w-56 h-56 text-primary" />
          </div>

          <div className="relative z-10 space-y-4">
            <h3 className="text-xl md:text-2xl font-serif italic font-normal text-white">Flash Quiz Arena</h3>
            <p className="text-on-surface-variant text-sm max-w-sm leading-relaxed">
              Accelerate your learning curve with five rapid-fire questions custom aligned to your age bracket. Earn double XP booster points today!
            </p>
            <button
              onClick={onStartFlashQuiz}
              className="bg-primary text-black hover:bg-white hover:text-black font-semibold px-6 py-2.5 rounded-full flex items-center gap-2 transition-all duration-300 active:scale-95 shadow-[0_4px_15px_rgba(245,158,11,0.25)] glow-btn cursor-pointer inline-flex"
            >
              <Play className="w-4 h-4 fill-current" />
              Quick Start Quiz
            </button>
          </div>
        </div>

        {/* Global Leaderboard Standing Quick Card */}
        <div className="glass-card rounded-2xl p-6 flex flex-col justify-between" id="leaderboard-standing-card">
          <div>
            <div className="flex justify-between items-center mb-4">
              <span className="text-xs font-semibold text-on-surface-variant uppercase tracking-widest">
                GLOBAL RANKINGS
              </span>
              <button
                onClick={() => onNavigate("Leaderboard")}
                className="text-xs font-bold text-primary hover:underline flex items-center gap-1 cursor-pointer"
              >
                Full Table <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="space-y-3">
              {/* Rank 1 Highlight */}
              {top1 && (
                <div
                  key={top1.name}
                  className="flex items-center justify-between p-3 rounded-xl bg-primary/5 border border-primary/10 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-extrabold text-[#ffd700] text-sm italic w-5">1</span>
                    <div className="relative w-8 h-8">
                      <img
                        src={top1.avatarUrl}
                        alt={top1.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full rounded-full border border-primary/20 bg-surface-container-high"
                      />
                    </div>
                    <div>
                      <span className="font-medium text-white text-sm block leading-tight">{top1.name}</span>
                      <span className="text-[10px] text-on-surface-variant">{top1.specialty}</span>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-secondary">{top1.xp.toLocaleString()} XP</span>
                </div>
              )}

              {/* User Standing */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-[#2a2a2a]/30 border border-white/5 active:scale-[0.99] transition-all">
                <div className="flex items-center gap-3">
                  <span className="font-extrabold text-primary text-sm italic w-5">12</span>
                  <div className="relative w-8 h-8 rounded-full p-0.5 border border-primary">
                    <img
                      src={user.avatarUrl}
                      alt={user.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full rounded-full bg-primary/20 scale-100"
                    />
                  </div>
                  <div>
                    <span className="font-bold text-primary text-sm block leading-tight">{user.name} (You)</span>
                    <span className="text-[10px] text-secondary">Level {user.level} · {user.rankTitle}</span>
                  </div>
                </div>
                <span className="text-xs font-bold text-primary font-mono">{user.xp.toLocaleString()} XP</span>
              </div>

              {/* Nearest lower peer */}
              {nextPeer && (
                <div className="flex items-center justify-between p-3 rounded-xl bg-transparent border border-white/5 opacity-50">
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-white/50 text-sm italic w-5">{nextPeer.rank}</span>
                    <img
                      src={nextPeer.avatarUrl}
                      alt={nextPeer.name}
                      referrerPolicy="no-referrer"
                      className="w-8 h-8 rounded-full bg-surface-container-high"
                    />
                    <div>
                      <span className="font-medium text-white/80 text-sm block leading-tight">{nextPeer.name}</span>
                      <span className="text-[10px] text-white/40">{nextPeer.specialty}</span>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-white/50">{nextPeer.xp.toLocaleString()} XP</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
