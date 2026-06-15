import React, { useState } from "react";
import { UserProfile, CredentialProof, AgeGroup } from "../types";
import { CREDENTIALS } from "../data";
import { Shield, Award, Calendar, Check, Play, User, X, Sparkles, Sliders } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface ProfileProps {
  user: UserProfile;
  onChangeUser: (updates: Partial<UserProfile>) => void;
}

export default function Profile({ user, onChangeUser }: ProfileProps) {
  const [nameInput, setNameInput] = useState<string>(user.name);
  const [ageGroupInput, setAgeGroupInput] = useState<AgeGroup>(user.ageGroup);
  const [selectedCredential, setSelectedCredential] = useState<CredentialProof | null>(null);
  const [showSettingsSaved, setShowSettingsSaved] = useState<boolean>(false);

  // Profile image avatars pool
  const avatars = [
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDP0OGtsl_-3D20upCBDHyO53lFZvvqy15KvYvJsQdiLIPphL0ijUsqnxQlRKQTYTPOTwvfyp8zlNkki4FUXk9LCKvZ7GjqomNc23vOJQ95c90nF79s2Zb-u3jfyE8LhTKtNsJDFAV1PlL6WxD0Jamm-gTFPoj7UTribLPq9lBLJIQB3OOBo1cQyHZye_9cxFIHAHX7rtjaQCruue9DmppWfwZMH3k4PUnbbMdv_52dU_TojRISDNK54CLKLC-4QDIFq-tTBxYGj82q",
    "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150",
    "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150"
  ];

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    onChangeUser({
      name: nameInput,
      ageGroup: ageGroupInput
    });
    setShowSettingsSaved(true);
    setTimeout(() => {
      setShowSettingsSaved(false);
    }, 3000);
  };

  const handleSelectAvatar = (url: string) => {
    onChangeUser({ avatarUrl: url });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-8"
      id="profile-viewport"
    >
      {/* Intro profile stats */}
      <div className="relative p-6 rounded-2xl bg-gradient-to-r from-surface-container-high to-surface-container-low border border-white/5 overflow-hidden shadow-xl">
        <div className="absolute right-0 top-0 w-80 h-full bg-primary/5 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row items-center gap-6 relative z-10" id="profile-meta-row">
          <div className="relative w-24 h-24 rounded-full p-1 border-2 border-primary shrink-0 bg-[#0a0a0c]">
            <img
              src={user.avatarUrl}
              alt={user.name}
              referrerPolicy="no-referrer"
              className="w-full h-full rounded-full object-cover"
            />
          </div>

          <div className="text-center md:text-left space-y-1.5 flex-grow">
            <h2 className="text-3xl font-bold tracking-tight text-white mb-0.5">{user.name}</h2>
            <p className="text-sm font-semibold text-secondary uppercase tracking-widest block">
              Level {user.level} · {user.rankTitle}
            </p>
            <div className="flex flex-wrap gap-4 pt-1 justify-center md:justify-start" id="stats-summary-pill-group">
              <span className="text-[11px] font-medium bg-white/5 py-1 px-3 border border-white/5 rounded-full text-on-surface-variant">
                🔥 {user.streakDays}-Day Streak
              </span>
              <span className="text-[11px] font-medium bg-white/5 py-1 px-3 border border-white/5 rounded-full text-on-surface-variant">
                🎓 {user.masteredSkillsCount} Skills Mastered
              </span>
              <span className="text-[11px] font-medium bg-white/5 py-1 px-3 border border-white/5 rounded-full text-on-surface-variant">
                🎯 {user.ageGroup} Adaptation State
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8" id="profile-settings-credentials-grid">
        {/* Settings Module column (occupies 1 col) */}
        <div className="lg:col-span-1 glass-card rounded-2xl p-6 space-y-6" id="settings-card-module">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Sliders className="w-5 h-5 text-primary" /> Edit Scholar Preferences
          </h3>

          <form onSubmit={handleSaveSettings} className="space-y-4" id="settings-form">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-on-surface-variant block uppercase tracking-wider">
                Display Scholar Name:
              </label>
              <input
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                className="w-full bg-surface-container border border-[#353534] focus:border-primary text-sm p-3 rounded-xl text-white outline-none ring-0 placeholder-on-surface-variant transition-colors"
                maxLength={24}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-on-surface-variant block uppercase tracking-wider">
                Default Quiz Age Group:
              </label>
              <select
                value={ageGroupInput}
                onChange={(e) => setAgeGroupInput(e.target.value as AgeGroup)}
                className="w-full bg-surface-container border border-[#353534] focus:border-primary text-sm p-3 rounded-xl text-white outline-none transition-colors"
              >
                <option value="Child">Child (6 - 12 years)</option>
                <option value="Teen">Teen (13 - 18 years)</option>
                <option value="Adult">Adult (19+ years)</option>
              </select>
              <span className="text-[10px] text-on-surface-variant block leading-relaxed mt-1">
                Changing this preference immediately optimizes mock questions, structures, and difficulty tiers.
              </span>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-on-surface-variant block uppercase tracking-wider mb-2">
                Update Visual Avatar:
              </label>
              <div className="flex gap-3 pt-1" id="avatar-grid-list">
                {avatars.map((url, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleSelectAvatar(url)}
                    className={`relative w-11 h-11 rounded-full border-2 overflow-hidden cursor-pointer transition-all ${
                      url === user.avatarUrl ? "border-primary scale-105" : "border-white/10 hover:border-white/30"
                    }`}
                  >
                    <img src={url} alt={`Avatar option ${i + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-white/5 flex items-center justify-between gap-4">
              <button
                type="submit"
                className="bg-primary text-on-primary hover:bg-white hover:text-black font-semibold py-2.5 px-6 rounded-xl text-xs transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
              >
                Save Changes
              </button>

              <AnimatePresence>
                {showSettingsSaved && (
                  <motion.span
                    initial={{ opacity: 0, x: 5 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-xs font-bold text-secondary flex items-center gap-1"
                  >
                    <Check className="w-3.5 h-3.5" /> Saved!
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
          </form>
        </div>

        {/* Credentials Column (occupies 2 cols) */}
        <div className="lg:col-span-2 space-y-6" id="credentials-shelf-wrapper">
          <div className="flex justify-between items-end">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Shield className="w-5 h-5 text-secondary" /> Credential Proofs
            </h3>
            <span className="text-[10px] font-mono font-bold text-on-surface-variant uppercase">
              Verifiably Secured Statuses
            </span>
          </div>

          {/* Grid display matching exact style from screenshots with Verified tag and details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="credentials-cards-grid">
            {CREDENTIALS.map((cred) => {
              // Lock styling evaluations
              const isLocked = user.level < cred.levelRequired;
              const isCompleted = cred.verified && !isLocked;

              return (
                <div
                  key={cred.id}
                  onClick={() => !isLocked && setSelectedCredential(cred)}
                  className={`group glass-card rounded-2xl overflow-hidden transition-all duration-300 border border-white/5 flex flex-col justify-between h-full ${
                    !isLocked ? "glow-hover cursor-pointer" : "opacity-50 cursor-not-allowed"
                  }`}
                  id={`cred-${cred.id}`}
                >
                  <div>
                    {/* Nice color gradient card top bar illustration */}
                    <div className={`h-28 w-full bg-gradient-to-br ${cred.illustrationGradient} p-5 flex flex-col justify-between relative overflow-hidden`}>
                      <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:8px_8px] pointer-events-none" />
                      
                      <div className="flex justify-between items-start">
                        <Award className="w-8 h-8 text-white/95" />
                        
                        {isCompleted ? (
                          <span className="text-[10px] font-sans font-black bg-emerald-500/80 backdrop-blur-md text-white px-2.5 py-0.5 rounded-full border border-emerald-400 uppercase">
                            Verified
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold bg-black/60 backdrop-blur-lg text-white/60 px-2.5 py-0.5 rounded-full border border-white/10 uppercase">
                            Locked
                          </span>
                        )}
                      </div>

                      <span className="text-[10px] font-mono font-bold text-white/70 block">
                        ID: {isCompleted ? cred.verificationId : "Locked Milestone"}
                      </span>
                    </div>

                    {/* Meta info of certificate */}
                    <div className="p-5 space-y-2">
                      <span className="text-[10px] font-bold text-[#4fdbc8] uppercase tracking-wider block">
                        {cred.category}
                      </span>
                      <h4 className="text-base font-bold text-white group-hover:text-primary transition-colors leading-snug">
                        {cred.title}
                      </h4>
                      <p className="text-on-surface-variant text-xs leading-relaxed line-clamp-2">
                        {cred.description}
                      </p>
                    </div>
                  </div>

                  {/* Requirements needed status bar underneath */}
                  <div className="p-5 pt-0 border-t border-white/5 mt-auto flex items-center justify-between text-[11px]">
                    {isLocked ? (
                      <span className="text-on-surface-variant flex items-center gap-1">
                        🔒 Unlocks at Level {cred.levelRequired}
                      </span>
                    ) : (
                      <span className="text-secondary font-bold flex items-center gap-1">
                        <Check className="w-3.5 h-3.5 stroke-[3]" /> Earned {cred.dateEarned}
                      </span>
                    )}

                    {!isLocked && (
                      <button className="text-xs font-bold text-primary hover:underline group-hover:translate-x-0.5 transition-transform cursor-pointer">
                        View Details →
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* POPUP LIGHTBOX CREDENTIAL EXAMINER FOR VERIFICATION CODES */}
      <AnimatePresence>
        {selectedCredential && (
          <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedCredential(null)}
              className="fixed inset-0 bg-[#000]/80 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-[#121212] border-2 border-[#2d2d2d] rounded-2xl w-full max-w-2xl overflow-hidden relative z-10 flex flex-col shadow-2xl"
              id="certificate-viewer-modal"
            >
              {/* Main premium border framing */}
              <div className="p-8 md:p-12 text-center space-y-6 relative border-b border-white/5 overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(#ffffff03_1px,transparent_1px)] [background-size:12px_12px] pointer-events-none" />
                
                <button
                  onClick={() => setSelectedCredential(null)}
                  className="absolute top-4 right-4 text-on-surface-variant hover:text-white cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className={`w-20 h-20 rounded-full mx-auto bg-gradient-to-br ${selectedCredential.illustrationGradient} flex items-center justify-center p-0.5 shadow-xl shadow-primary/10 animate-pulse`}>
                  <Shield className="w-10 h-10 text-white" />
                </div>

                <div className="space-y-2">
                  <span className="text-[10px] font-mono font-bold text-secondary uppercase tracking-widest block">
                    Secured Educational Hash Code Certificate
                  </span>
                  <h3 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
                    {selectedCredential.title}
                  </h3>
                  <p className="text-on-surface-variant text-sm max-w-md mx-auto leading-relaxed">
                    {selectedCredential.description}
                  </p>
                </div>

                <div className="py-4 border-y border-white/5 grid grid-cols-2 gap-4 max-w-md mx-auto" id="cred-meta">
                  <div className="text-left space-y-0.5">
                    <span className="text-[10px] font-bold text-on-surface-variant block uppercase">SCHOLAR RECIPIENT</span>
                    <span className="text-sm font-bold text-white">{user.name}</span>
                  </div>
                  <div className="text-right space-y-0.5">
                    <span className="text-[10px] font-bold text-on-surface-variant block uppercase">DATE GRANTED</span>
                    <span className="text-sm font-bold text-[#4fdbc8]">{selectedCredential.dateEarned}</span>
                  </div>
                </div>

                {/* Sub-skills master check list required */}
                <div className="space-y-2 max-w-md mx-auto text-left">
                  <span className="text-[10px] font-bold text-on-surface-variant uppercase block">VERIFIED CURRICULUM SYLLABUS:</span>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2" id="syllabus-checklist">
                    {selectedCredential.skillsNeeded.map((skill, k) => (
                      <div key={k} className="flex items-center gap-2 p-2 rounded-lg bg-white/5 border border-white/5 text-xs">
                        <Check className="w-4 h-4 text-[#4fdbc8] shrink-0 stroke-[3]" />
                        <span className="text-white/80 font-medium">{skill}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Digital Verification signature */}
                <div className="pt-4 flex flex-col items-center justify-center gap-2" id="verified-footer">
                  <div className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 py-1.5 px-4 rounded-full text-emerald-400 font-bold text-[10px] uppercase">
                    <Sparkles className="w-3.5 h-3.5 animate-bounce" /> Verified on Knowledge Horizon Network
                  </div>
                  <span className="text-[10px] font-mono text-on-surface-variant">
                    HASH VERIFICATION CODE: {selectedCredential.verificationId}-SECURED
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
