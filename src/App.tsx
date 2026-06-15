import React, { useState, useEffect } from "react";
import { UserProfile, AgeGroup } from "./types";
import {
  LayoutDashboard,
  BookOpen,
  Compass,
  Brain,
  Trophy,
  User,
  Bell,
  Search,
  Award,
  Sparkles,
  Zap,
  Menu,
  ChevronRight
} from "lucide-react";

// Sub Views
import Dashboard from "./components/Dashboard";
import Library from "./components/Library";
import SkillTracks from "./components/SkillTracks";
import QuizArena from "./components/QuizArena";
import Leaderboard from "./components/Leaderboard";
import Profile from "./components/Profile";

import { motion, AnimatePresence } from "motion/react";

export default function App() {
  const [activeTab, setActiveTab] = useState<string>("Dashboard");
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [topSearch, setTopSearch] = useState<string>("");

  // User standing profile global state
  const [user, setUser] = useState<UserProfile>({
    name: "Alex Scholar",
    avatarUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDP0OGtsl_-3D20upCBDHyO53lFZvvqy15KvYvJsQdiLIPphL0ijUsqnxQlRKQTYTPOTwvfyp8zlNkki4FUXk9LCKvZ7GjqomNc23vOJQ95c90nF79s2Zb-u3jfyE8LhTKtNsJDFAV1PlL6WxD0Jamm-gTFPoj7UTribLPq9lBLJIQB3OOBo1cQyHZye_9cxFIHAHX7rtjaQCruue9DmppWfwZMH3k4PUnbbMdv_52dU_TojRISDNK54CLKLC-4QDIFq-tTBxYGj82q",
    rankTitle: "Grandmaster",
    level: 42,
    xp: 18240,
    xpToNextLevel: 20000,
    streakDays: 15,
    masteredSkillsCount: 12,
    dailyGoalDone: 3,
    dailyGoalMax: 4,
    ageGroup: "Teen"
  });

  // Cross tab router parameters
  const [selectedTrackId, setSelectedTrackId] = useState<string | null>(null);
  const [quizCategoryQuery, setQuizCategoryQuery] = useState<string | null>(null);

  // Synchronize topbar lookalike search queries back to Library page automatically
  const handleTopSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (topSearch.trim()) {
      setActiveTab("Library");
    }
  };

  // Add global XP points state (updates levels too!)
  const handleAddXp = (amount: number) => {
    setUser((prev) => {
      const updatedXp = prev.xp + amount;
      let updatedLevel = prev.level;
      
      // Level up algorithm (simple formula where level rises as thresholds are met)
      const levelUpThreshold = updatedLevel * 450;
      if (updatedXp > prev.xpToNextLevel) {
        updatedLevel += 1;
        // Trigger congratulations noise or modal triggers later
      }

      return {
        ...prev,
        xp: updatedXp,
        level: updatedLevel,
        xpToNextLevel: Math.round(updatedLevel * 500)
      };
    });
  };

  const handleClaimDailyGoalUnit = () => {
    setUser((prev) => {
      const completed = Math.min(prev.dailyGoalDone + 1, prev.dailyGoalMax);
      
      // If completed full goal, grant bonus XP
      if (completed === prev.dailyGoalMax && prev.dailyGoalDone < prev.dailyGoalMax) {
        handleAddXp(250); // bonus 250 XP
      }

      return {
        ...prev,
        dailyGoalDone: completed
      };
    });
  };

  const handleUpdateUserProfile = (updates: Partial<UserProfile>) => {
    setUser((prev) => ({
      ...prev,
      ...updates
    }));
  };

  // Dashboard selects track routing
  const handlePlayTrackDirect = (trackId: string) => {
    setSelectedTrackId(trackId);
    setActiveTab("Library");
  };

  // Tracks Map selects active node routing
  const handleNodeStartQuiz = (category: string) => {
    setQuizCategoryQuery(category);
    setActiveTab("Quiz Arena");
  };

  const navbarTabs = [
    { name: "Dashboard", icon: LayoutDashboard },
    { name: "Library", icon: BookOpen },
    { name: "Skill Tracks", icon: Compass },
    { name: "Quiz Arena", icon: Brain },
    { name: "Leaderboard", icon: Trophy },
    { name: "Profile", icon: User }
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-[#e5e7eb] font-sans antialiased" id="app-viewport">
      {/* Top Header Navigation Overlay Bar */}
      <header className="fixed top-0 w-full z-50 bg-[#0a0a0a]/90 backdrop-blur-md border-b border-white/10 shadow-lg h-16 transition-all">
        <div className="flex justify-between items-center px-4 md:px-6 h-full max-w-7xl mx-auto">
          {/* Brand header */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[#f59e0b] rounded-sm flex items-center justify-center font-serif font-bold text-black">K</div>
              <span className="text-xl font-serif italic tracking-tight text-white font-normal" id="header-brand-title">Knowledge Horizon</span>
            </div>

            {/* Desktop Center tabs */}
            <div className="hidden md:flex items-center gap-4">
              {["Dashboard", "Explore", "Tracks"].map((item) => {
                const mapTab = item === "Explore" ? "Library" : item === "Tracks" ? "Skill Tracks" : "Dashboard";
                const isActive = activeTab === mapTab;
                return (
                  <button
                    key={item}
                    onClick={() => setActiveTab(mapTab)}
                    className={`font-semibold text-xs uppercase tracking-wider transition-colors pt-1 cursor-pointer ${
                      isActive
                        ? "text-primary border-b-2 border-primary pb-1"
                        : "text-[#c7c4d7] hover:text-white"
                    }`}
                  >
                    {item}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Search bar and Notification indicators */}
          <div className="flex items-center gap-4">
            <form onSubmit={handleTopSearchSubmit} className="hidden lg:flex items-center bg-[#0a0a0a] border border-white/10 px-3 py-1.5 rounded-full select-all">
              <Search className="w-3.5 h-3.5 text-[#c7c4d7] mr-2" />
              <input
                type="text"
                placeholder="Search resources..."
                value={topSearch}
                onChange={(e) => setTopSearch(e.target.value)}
                className="bg-transparent border-none focus:outline-none focus:ring-0 text-xs w-44 text-white placeholder-on-surface-variant font-medium"
              />
            </form>

            <div className="flex items-center gap-3">
              <button className="text-[#e5e2e1] hover:text-primary transition-colors cursor-pointer p-1.5 hover:bg-white/5 rounded-full relative" aria-label="Notifications">
                <Bell className="w-4 h-4" />
                <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-secondary rounded-full" />
              </button>
              <button
                onClick={() => setActiveTab("Leaderboard")}
                className="text-[#e5e2e1] hover:text-primary transition-colors cursor-pointer p-1.5 hover:bg-white/5 rounded-full"
                aria-label="Leaderboard"
              >
                <Trophy className="w-4 h-4" />
              </button>
              <button
                onClick={() => setActiveTab("Profile")}
                className="text-[#e5e2e1] hover:text-primary transition-colors cursor-pointer p-1.5 hover:bg-white/5 rounded-full"
                aria-label="Profile"
              >
                <User className="w-4 h-4" />
              </button>
              {/* Mobile hamburger */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden text-[#c7c4d7] hover:text-white transition-colors cursor-pointer p-1"
                aria-label="Mobile menu toggle"
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Sidebar Navigation Layout (Desktop ONLY) */}
      <aside className="hidden md:flex h-screen w-64 fixed left-0 top-0 z-40 bg-[#080808] border-r border-white/5 flex-col p-5 gap-6 pt-24 justify-between">
        <div className="space-y-6">
          {/* User quick profile metadata card */}
          <div
            onClick={() => setActiveTab("Profile")}
            className="flex flex-col items-center p-3 rounded-2xl hover:bg-white/[0.03] transition-colors cursor-pointer border border-transparent hover:border-white/5"
            id="sidebar-profile-card"
          >
            <div className="w-16 h-16 rounded-full p-1 border border-primary/30 mb-2 bg-gradient-to-tr from-primary/10 via-transparent to-primary/15 animate-pulse">
              <img
                src={user.avatarUrl}
                alt={user.name}
                referrerPolicy="no-referrer"
                className="w-full h-full rounded-full object-cover"
              />
            </div>
            <h2 className="font-bold text-base text-white truncate max-w-full text-center">
              {user.name}
            </h2>
            <p className="text-[10px] font-bold text-primary uppercase tracking-widest mt-0.5">
              Level {user.level} · {user.rankTitle}
            </p>
          </div>
 
          {/* Navigation Items */}
          <nav className="space-y-1.5" id="sidebar-nav">
            {navbarTabs.map((tab) => {
              const TabIcon = tab.icon;
              const isActive = activeTab === tab.name;
 
              return (
                <button
                  key={tab.name}
                  onClick={() => setActiveTab(tab.name)}
                  className={`w-full flex items-center gap-3 rounded-xl px-4 py-2.5 text-xs font-semibold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                    isActive
                      ? "bg-primary text-black font-bold shadow-[0_4px_15px_rgba(245,158,11,0.25)]"
                      : "text-[#c7c4d7] hover:bg-white/[0.03] hover:text-white"
                  }`}
                >
                  <TabIcon className={`w-4 h-4 shrink-0 ${isActive ? "stroke-[2.5]" : ""}`} />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </nav>
        </div>
 
        {/* Start Learning Floating Trigger Button */}
        <div>
          <button
            onClick={() => setActiveTab("Skill Tracks")}
            className="w-full bg-primary text-black hover:bg-white hover:text-black font-bold py-3 rounded-xl transition-all shadow-[0_4px_15px_rgba(245,158,11,0.25)] duration-300 flex items-center justify-center gap-1.5 cursor-pointer text-xs uppercase tracking-widest"
            id="sidebar-trigger-btn"
          >
            <Zap className="w-4 h-4 fill-current animate-bounce" />
            Start Learning
          </button>
        </div>
      </aside>

      {/* Main viewport Container (Pushes layout right to accommodate wide desktop sidebar) */}
      <main className="md:ml-64 pt-24 px-4 md:px-8 pb-24 md:pb-8 flex-grow">
        <div className="max-w-7xl mx-auto relative min-h-[75vh]" id="content-boundary">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="absolute inset-0"
            >
              {activeTab === "Dashboard" && (
                <Dashboard
                  user={user}
                  onNavigate={(tab) => setActiveTab(tab)}
                  onSelectTrack={handlePlayTrackDirect}
                  onStartFlashQuiz={() => setActiveTab("Quiz Arena")}
                  onAddDailyProgress={handleClaimDailyGoalUnit}
                />
              )}

              {activeTab === "Library" && (
                <Library
                  onAddXp={handleAddXp}
                  selectedTrackId={selectedTrackId}
                  onClearTrackSelection={() => setSelectedTrackId(null)}
                />
              )}

              {activeTab === "Skill Tracks" && (
                <SkillTracks
                  onNavigateToQuiz={handleNodeStartQuiz}
                  onAddXp={handleAddXp}
                />
              )}

              {activeTab === "Quiz Arena" && (
                <QuizArena
                  user={user}
                  initialCategory={quizCategoryQuery || "Science"}
                  onAddXp={handleAddXp}
                  onIncreaseDailyProgress={handleClaimDailyGoalUnit}
                />
              )}

              {activeTab === "Leaderboard" && <Leaderboard user={user} />}

              {activeTab === "Profile" && (
                <Profile user={user} onChangeUser={handleUpdateUserProfile} />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Mobile Nav Bar - Fixed Bottom (collapses from sidebar in active mobile responsiveness viewport) */}
      <nav
        className="md:hidden fixed bottom-0 left-0 w-full bg-[#131313]/90 backdrop-blur-xl border-t border-[#2d2d2d] z-40 flex justify-around items-center h-16 px-2"
        id="mobile-bottom-nav"
      >
        {navbarTabs.slice(0, 5).map((tab) => {
          const TabIcon = tab.icon;
          const isActive = activeTab === tab.name;

          return (
            <button
              key={tab.name}
              onClick={() => setActiveTab(tab.name)}
              className={`flex flex-col items-center justify-center gap-1 cursor-pointer transition-colors ${
                isActive ? "text-primary font-bold" : "text-[#c7c4d7] hover:text-white"
              }`}
            >
              <TabIcon className="w-5 h-5 focus:outline-none" />
              <span className="text-[9px] uppercase tracking-wider font-semibold">
                {tab.name.split(" ")[0]}
              </span>
            </button>
          );
        })}

        {/* Profile icon at bottom bar */}
        <button
          onClick={() => setActiveTab("Profile")}
          className={`flex flex-col items-center justify-center gap-1 cursor-pointer transition-colors ${
            activeTab === "Profile" ? "text-primary font-bold" : "text-[#c7c4d7] hover:text-white"
          }`}
        >
          <img src={user.avatarUrl} alt="User profile" className="w-5 h-5 rounded-full object-cover border border-white/10" />
          <span className="text-[9px] uppercase tracking-wider font-semibold">Profile</span>
        </button>
      </nav>

      {/* Mobile sidebar popover overlay drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 md:hidden flex justify-end">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="bg-black fixed inset-0"
            />
            
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="w-64 bg-[#111] border-l border-[#2d2d2d] h-full p-6 relative flex flex-col justify-between"
              id="mobile-drawer"
            >
              <div className="space-y-6">
                <div className="flex justify-between items-center pb-4 border-b border-white/5">
                  <h3 className="font-extrabold text-white text-sm uppercase tracking-widest">Navigator</h3>
                  <button onClick={() => setMobileMenuOpen(false)} className="text-white text-xs cursor-pointer">
                    Close
                  </button>
                </div>

                <nav className="space-y-2">
                  {navbarTabs.map((tab) => {
                    const TabIcon = tab.icon;
                    const isActive = activeTab === tab.name;

                    return (
                      <button
                        key={tab.name}
                        onClick={() => {
                          setActiveTab(tab.name);
                          setMobileMenuOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 rounded-xl px-4 py-2.5 text-xs font-semibold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                          isActive ? "bg-primary text-on-primary font-bold" : "text-[#c7c4d7] hover:text-white"
                        }`}
                      >
                        <TabIcon className="w-4 h-4 shrink-0" />
                        <span>{tab.name}</span>
                      </button>
                    );
                  })}
                </nav>
              </div>

              {/* Start button inside drawer */}
              <button
                onClick={() => {
                  setActiveTab("Skill Tracks");
                  setMobileMenuOpen(false);
                }}
                className="w-full bg-[#393939] hover:bg-[#c0c1ff] hover:text-black text-white text-xs font-bold py-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 tracking-wider uppercase"
              >
                Start Learning
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
