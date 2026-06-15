export type AgeGroup = "Child" | "Teen" | "Adult";

export interface UserProfile {
  name: string;
  avatarUrl: string;
  rankTitle: string; // e.g. "Grandmaster"
  level: number;
  xp: number;
  xpToNextLevel: number; // e.g. 20000
  streakDays: number;
  masteredSkillsCount: number;
  dailyGoalDone: number; // e.g. 3
  dailyGoalMax: number; // e.g. 4
  ageGroup: AgeGroup;
}

export type ResourceType = "article" | "book" | "skill-track";

export interface LibraryResource {
  id: string;
  title: string;
  description: string;
  type: ResourceType;
  category: "Science" | "Technology" | "General Knowledge" | "AI" | "History" | "Philosophy";
  badge: "Foundational" | "Advanced" | "Expert";
  coverImageUrl: string;
  readTimeOrPages: string; // e.g. "12 Min Read" or "420 Pages"
  difficulty: "Beginner" | "Intermediate" | "Advanced" | "Expert";
  contentMarkdown: string; // Markdown article content
  downloadUrl?: string; // If it's an EPUB / PDF
  verified?: boolean;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  category: string;
  ageGroup: AgeGroup;
  difficulty: "Easy" | "Medium" | "Hard";
  explanationHint?: string;
}

export interface LeaderboardEntry {
  rank: number;
  name: string;
  avatarUrl: string;
  xp: number;
  level: number;
  isCurrentUser?: boolean;
  specialty?: string;
}

export interface CredentialProof {
  id: string;
  title: string;
  description: string;
  verificationId: string;
  category: string;
  dateEarned: string;
  verified: boolean;
  levelRequired: number;
  xpRequired: number;
  skillsNeeded: string[];
  illustrationGradient: string;
}
