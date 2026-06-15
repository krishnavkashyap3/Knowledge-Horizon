import React, { useState } from "react";
import { SkillTrackNode, SKILL_TRACKS_MAP } from "../data";
import { Compass, Check, Lock, Play, Award, Zap, ChevronRight, X, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface SkillTracksProps {
  onNavigateToQuiz: (category: string) => void;
  onAddXp: (amount: number) => void;
}

export default function SkillTracks({ onNavigateToQuiz, onAddXp }: SkillTracksProps) {
  const [selectedDomain, setSelectedDomain] = useState<string>("Science");
  const [activeLessonModal, setActiveLessonModal] = useState<{
    trackName: string;
    node: SkillTrackNode;
  } | null>(null);

  const trackerLists = Object.keys(SKILL_TRACKS_MAP);
  const activeNodes = SKILL_TRACKS_MAP[selectedDomain] || [];

  const handleNodeClick = (node: SkillTrackNode) => {
    setActiveLessonModal({ trackName: selectedDomain, node });
  };

  const handleStartArena = (category: string) => {
    setActiveLessonModal(null);
    onNavigateToQuiz(category);
  };

  const handleCompleteLessonDirect = (nodeId: string, nodeXp: number) => {
    // Quick local states of completion
    onAddXp(nodeXp);
    setActiveLessonModal(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
      id="skill-tracks-viewport"
    >
      {/* Track Map welcome card */}
      <div className="relative p-6 rounded-2xl bg-gradient-to-r from-[#201f1f] to-[#1c1b1b] border border-white/5 overflow-hidden shadow-xl">
        <div className="absolute right-0 top-0 w-80 h-full bg-secondary/5 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-2xl relative z-10 space-y-2">
          <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider">
            <Zap className="w-4 h-4 text-emerald-400" /> INTERACTIVE KNOWLEDGE MAPS
          </div>
          <h2 className="text-3xl md:text-4xl font-serif italic font-normal tracking-tight text-white mb-2">Skill Tracks</h2>
          <p className="text-on-surface-variant text-sm leading-relaxed">
            Follow structured paths divided into logical milestones. Earn massive XP rewards for mastering individual nodes and complete final checkpoints to receive verified credentials.
          </p>
        </div>
      </div>

      {/* Select active domain rail */}
      <div className="flex border-b border-white/5 gap-2 pb-px" id="domain-tabs-group">
        {trackerLists.map((domain) => (
          <button
            key={domain}
            onClick={() => setSelectedDomain(domain)}
            className={`px-6 py-3 font-semibold text-sm transition-all relative cursor-pointer ${
              selectedDomain === domain
                ? "text-primary border-b-2 border-primary"
                : "text-on-surface-variant hover:text-white"
            }`}
          >
            {domain}
          </button>
        ))}
      </div>

      {/* Dynamic interactive levels map representation */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-4" id="tracks-map-layout-container">
        {/* The interactive level diagram */}
        <div className="lg:col-span-2 glass-card rounded-2xl p-8 relative flex flex-col items-center select-none bg-surface-container/50 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff03_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
          
          <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest absolute top-4 left-4">
            Curriculum Map: {selectedDomain}
          </span>

          {/* Connected list of nodes */}
          <div className="space-y-12 w-full max-w-md relative py-6" id="nodes-vertical-timeline">
            {activeNodes.map((node, index) => {
              const isLast = index === activeNodes.length - 1;
              
              // Custom colors based on status
              const isCompleted = node.status === "completed";
              const isInProgress = node.status === "in-progress";
              const isLocked = node.status === "locked";

              return (
                <div key={node.id} className="relative flex items-center md:items-start gap-8" id={`timeline-node-${node.id}`}>
                  {/* Vertical connector line */}
                  {!isLast && (
                    <div
                      className={`absolute left-7 top-14 w-0.5 h-14 border-l-2 border-dashed transition-colors duration-500 -ml-px ${
                        isCompleted ? "border-secondary/60" : "border-white/10"
                      }`}
                    />
                  )}

                  {/* Icon Node circle */}
                  <motion.button
                    whileHover={!isLocked ? { scale: 1.05 } : {}}
                    whileTap={!isLocked ? { scale: 0.95 } : {}}
                    onClick={() => !isLocked && handleNodeClick(node)}
                    disabled={isLocked}
                    className={`w-14 h-14 rounded-full flex items-center justify-center relative shrink-0 transition-all duration-300 ${
                      isCompleted
                        ? "bg-secondary text-black shadow-[0_0_15px_rgba(245,158,11,0.45)]"
                        : isInProgress
                        ? "bg-primary text-black font-bold skill-node-pulse"
                        : "bg-surface-container-high border border-white/5 text-white/20"
                    } ${!isLocked ? "cursor-pointer" : "cursor-not-allowed"}`}
                  >
                    {isCompleted ? (
                      <Check className="w-7 h-7 stroke-[3.5]" />
                    ) : isInProgress ? (
                      <Play className="w-5 h-5 fill-current ml-0.5" />
                    ) : (
                      <Lock className="w-4 h-4 text-white/30" />
                    )}

                    {/* Level Tag floating badge */}
                    <span className="absolute -top-1.5 -right-1 bg-surface-container-highest border border-white/10 text-[9px] font-mono font-bold text-white/80 px-1.5 py-0.5 rounded">
                      N.{index + 1}
                    </span>
                  </motion.button>

                  {/* Descriptive labels */}
                  <div className="flex-grow pt-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <h4
                        className={`font-serif italic font-normal tracking-wide text-base ${
                          isLocked ? "text-white/30" : "text-white"
                        }`}
                      >
                        {node.label}
                      </h4>
                      <span className="text-[10px] font-mono font-bold bg-white/5 px-2 py-0.5 rounded border border-white/5 text-secondary">
                        +{node.xpAward} XP
                      </span>
                    </div>
                    <p
                      className={`text-xs leading-relaxed max-w-sm ${
                        isLocked ? "text-white/20" : "text-on-surface-variant"
                      }`}
                    >
                      {node.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Informative Side Card Panel */}
        <div className="glass-card rounded-2xl p-6 flex flex-col justify-between" id="track-analytics-card">
          <div className="space-y-6">
            <h3 className="text-lg font-serif italic font-normal text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-secondary" />
              Path Objectives
            </h3>

            <div className="space-y-3" id="objectives-list">
              <div className="p-3 rounded-xl bg-white/5 border border-white/5 space-y-1">
                <span className="text-[10px] font-bold text-[#ffd700] uppercase">REWARD LEVEL</span>
                <p className="text-sm font-semibold text-white">Full Path completion: Unlock custom certificates</p>
              </div>

              <div className="p-3 rounded-xl bg-white/5 border border-white/5 space-y-1">
                <span className="text-[10px] font-bold text-primary uppercase">VERIFIED STATUS</span>
                <p className="text-sm font-semibold text-white">Prerequisites: Earn 2,000 extra XP to unlock final checkmarks</p>
              </div>
            </div>

            <div className="border-t border-white/5 pt-4 space-y-3">
              <span className="text-xs font-semibold text-on-surface-variant block">CURRICULUM INSTRUCTOR</span>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full border border-primary/20 p-0.5">
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAjpH9q-SMRUi20wnsV58Mb8HKL6G4Fb6AX3vCqziRTaNyV00P2cPfp65Mc_s4mZbZlNzfzXUCxKHb5KHZgBMIzHpViG4jaZPdYbcsJ8VAtDXFqcrzBnnGJT2KtgREARo9xcoRQ1FUJ85JW6zvtr_bu80pbLlC2DujjJnQhOgOmqssaEBTGCBjqQKv02UBveKAv1SXHbebHKVieiip6ljIa1vRXF3lXorCJHWuUjwJgCaPuh-Fcp48_gaQfh21XUViJLh_zUCJ5R6kA"
                    alt="Instructor"
                    className="w-full h-full rounded-full"
                  />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-white">Elena_V PhD</h4>
                  <span className="text-[10px] text-on-surface-variant">Global ranking No. 1 specialist</span>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => handleStartArena(selectedDomain)}
            className="w-full mt-6 bg-primary text-black hover:bg-white hover:text-black font-semibold py-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer shadow-[0_4px_15px_rgba(245,158,11,0.20)]"
          >
            Launch Track Quiz Arena
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* QUICK IN-TIMELINE LESSON CARD STUDY POPUP */}
      <AnimatePresence>
        {activeLessonModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveLessonModal(null)}
              className="fixed inset-0 bg-[#000]/80 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-[#0a0a0a] border border-white/10 rounded-2xl w-full max-w-lg overflow-hidden relative z-10 flex flex-col shadow-2xl"
              id="node-study-modal"
            >
              {/* Cover layout colors */}
              <div className="p-6 bg-gradient-to-r from-primary-container/20 to-primary/10 border-b border-white/5 relative">
                <button
                  onClick={() => setActiveLessonModal(null)}
                  className="absolute top-4 right-4 text-on-surface-variant hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
                <span className="text-[9px] font-mono font-bold text-secondary uppercase tracking-widest block mb-1">
                  PATH MILESTONE: {activeLessonModal.trackName}
                </span>
                <h3 className="text-xl font-bold text-white">{activeLessonModal.node.label}</h3>
              </div>

              {/* Study review details inside popup */}
              <div className="p-6 space-y-4">
                <div className="space-y-2">
                  <span className="text-xs font-semibold text-on-surface-variant">NODE DESCRIPTION:</span>
                  <p className="text-sm leading-relaxed text-white/80">
                    {activeLessonModal.node.description}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-2 leading-relaxed">
                  <span className="text-[10px] font-bold text-secondary flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" /> STUDY COMPLETED?
                  </span>
                  <p className="text-xs text-on-surface-variant">
                    Master this node immediately to claim your milestone reward or launch the full Quiz Arena to adaptively test your comprehensive standing against the clock!
                  </p>
                </div>

                <div className="flex gap-3 pt-2" id="modal-buttons-group">
                  <button
                    onClick={() => handleStartArena(activeLessonModal.trackName)}
                    className="flex-grow bg-primary text-black font-bold py-2.5 rounded-xl text-xs hover:bg-white hover:text-black transition-all cursor-pointer"
                  >
                    Take Quiz Arena Test
                  </button>
                  <button
                    onClick={() =>
                      handleCompleteLessonDirect(activeLessonModal.node.id, activeLessonModal.node.xpAward)
                    }
                    className="flex-grow bg-white/5 hover:bg-white/10 text-white font-bold py-2.5 rounded-xl text-xs border border-white/15 transition-all cursor-pointer"
                  >
                    Quick Study Complete (+{activeLessonModal.node.xpAward} XP)
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
