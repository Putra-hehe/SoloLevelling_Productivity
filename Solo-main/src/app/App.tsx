import { SpeedInsights } from "@vercel/speed-insights/react";
import { createId } from "./utils/id";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Toaster, toast } from "sonner";
import {
  AppState,
  User,
  Quest,
  Habit,
  UserClass,
  Badge,
  FocusSession,
} from "./types";
import {
  saveToStorage,
  loadFromStorage,
  loadFromFirebase,
  saveToFirebase,
} from "./utils/storage";
import { auth } from "./firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import {
  calculateXPForLevel,
  calculateLevel,
  getXPForDifficulty,
} from "./utils/xp";
import { getRandomQuestTemplate } from "./utils/ai";
import { createMockUser, mockQuests, mockHabits, mockBadges } from "./utils/mockData";
import { toLocalDateKey, isoToLocalDateKey, makeDueDateISO } from "./utils/date";

// Pages
import { LandingPage } from "./pages/LandingPage";
import { AuthPage } from "./pages/AuthPage";
import { OnboardingPage } from "./pages/OnboardingPage";
import { Dashboard } from "./pages/Dashboard";
import { QuestsPage } from "./pages/QuestsPage";
import { HabitsPage } from "./pages/HabitsPage";
import { FocusSessionPage } from "./pages/FocusSessionPage";
import { RewardsPage } from "./pages/RewardsPage";
import { StatsPage } from "./pages/StatsPage";
import { SettingsPage } from "./pages/SettingsPage";
import { CalendarPage } from "./pages/CalendarPage";

// Components
import { AppSidebar } from "./components/AppSidebar";
import { MobileNav } from "./components/MobileNav";
import { QuestDetailDialog } from "./components/QuestDetailDialog";
import { QuestCreateDialog } from "./components/QuestCreateDialog";
import { CommandPalette } from "./components/CommandPalette";
import { BadgeDetailDialog } from "./components/BadgeDetailDialog";

export default function App() {
  const [appState, setAppState] = useState<AppState>({
    user: null,
    quests: [],
    habits: [],
    focusSessions: [],
    badges: mockBadges,
    currentPage: "landing",
    isOnboarded: false,
  });

  const [selectedQuest, setSelectedQuest] = useState<Quest | null>(null);
  const [questDialogOpen, setQuestDialogOpen] = useState(false);

  // Stores the authenticated identity between Auth and Onboarding steps.
  const [pendingAuth, setPendingAuth] = useState<{
    uid: string;
    name: string;
    email: string;
  } | null>(null);

  // Controls visibility of the new quest creation dialog
  const [newQuestDialogOpen, setNewQuestDialogOpen] = useState(false);

  // Optional default due date when opening the quest creation dialog from calendar, etc.
  const [newQuestDefaultDueDate, setNewQuestDefaultDueDate] = useState<string | undefined>(
    undefined
  );

  // Command palette state (Ctrl/Cmd + K)
  const [commandOpen, setCommandOpen] = useState(false);

  // Badge dialog state
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);
  const [badgeDialogOpen, setBadgeDialogOpen] = useState(false);

  // Mobile drawer menu (hamburger)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Load from storage on mount
  useEffect(() => {
    const savedState = loadFromStorage();
    if (savedState) {
      setAppState(savedState);
    }
  }, []);

  // Global shortcut: Ctrl/Cmd + K to open command palette
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setCommandOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  // Load persisted state from Firebase when a user logs in.
  useEffect(() => {
    async function fetchRemoteState() {
      if (appState.user) {
        const remoteState = await loadFromFirebase(appState.user.id);
        if (remoteState) {
          setAppState(remoteState);
        }
      }
    }
    fetchRemoteState();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appState.user]);

  // Daily rollover: reset daily quests when the local date changes.
  useEffect(() => {
    if (!appState.user) return;

    const todayKey = toLocalDateKey(new Date());
    setAppState((prev) => {
      if (!prev.user) return prev;
      if (prev.lastDailyReset === todayKey) return prev;

      const now = new Date();
      const updatedQuests = prev.quests.map((q) => {
        if (!q.isDaily) return q;

        return {
          ...q,
          status: "pending" as const,
          completedAt: undefined,
          dueDate: makeDueDateISO(now),
          subtasks: q.subtasks.map((st) => ({ ...st, completed: false })),
        };
      });

      return {
        ...prev,
        quests: updatedQuests,
        lastDailyReset: todayKey,
      };
    });
  }, [appState.user]);

  // Save to storage whenever state changes
  useEffect(() => {
    if (appState.user) {
      saveToStorage(appState);
    }
  }, [appState]);

  // Persist to Firebase whenever state changes and user is present
  useEffect(() => {
    if (appState.user) {
      saveToFirebase(appState.user.id, appState);
    }
  }, [appState]);

  // Auth & Onboarding Handlers
  const handleAuth = async (
    name: string,
    email: string,
    password: string,
    isSignup: boolean
  ) => {
    try {
      const cred = isSignup
        ? await createUserWithEmailAndPassword(auth, email, password)
        : await signInWithEmailAndPassword(auth, email, password);

      if (isSignup && name) {
        await updateProfile(cred.user, { displayName: name });
      }

      const uid = cred.user.uid;
      const resolvedName = name || cred.user.displayName || email.split("@")[0];

      const remoteState = await loadFromFirebase(uid);
      if (remoteState && remoteState.user) {
        setPendingAuth(null);
        setAppState({
          ...remoteState,
          currentPage: "dashboard",
          isOnboarded: true,
        });

        toast.success(`Welcome back, ${remoteState.user.name}!`, {
          description: "Your data has been loaded from Firebase.",
        });
        return;
      }

      setPendingAuth({ uid, name: resolvedName, email });
      setAppState((prev) => ({
        ...prev,
        currentPage: "onboarding",
      }));
    } catch (err: any) {
      const code = err?.code as string | undefined;
      const message =
        code === "auth/invalid-login-credentials"
          ? "Email atau password salah."
          : code === "auth/email-already-in-use"
          ? "Email ini sudah terdaftar. Coba Sign In."
          : code === "auth/weak-password"
          ? "Password terlalu lemah (minimal 6 karakter)."
          : code === "auth/operation-not-allowed"
          ? "Provider Auth belum diaktifkan di Firebase Console (Enable Email/Password di Authentication)."
          : err?.message || "Gagal login.";

      toast.error("Login gagal", { description: message });
      console.error("Firebase Auth error:", err);
    }
  };

  const handleOnboardingComplete = (userClass: UserClass, goal: string, schedule: string[]) => {
    const newUser = createMockUser(
      pendingAuth?.name || "Hero",
      pendingAuth?.email || "hero@levelday.com",
      userClass
    );
    if (pendingAuth?.uid) {
      newUser.id = pendingAuth.uid;
    }
    newUser.dailyGoal = goal;
    newUser.weeklySchedule = schedule;

    setAppState((prev) => ({
      ...prev,
      user: newUser,
      quests: mockQuests,
      habits: mockHabits,
      isOnboarded: true,
      currentPage: "dashboard",
    }));

    setPendingAuth(null);

    toast.success(`Welcome, ${userClass.charAt(0).toUpperCase() + userClass.slice(1)}!`, {
      description: "Your journey begins now",
    });
  };

  // Navigation
  const handleNavigate = (page: string) => {
    setAppState((prev) => ({ ...prev, currentPage: page }));
  };

  const handleBadgeClick = (badge: Badge) => {
    setSelectedBadge(badge);
    setBadgeDialogOpen(true);
  };

  const checkAndUnlockBadges = (state: AppState): Badge[] => {
    return state.badges.map((badge) => {
      if (!badge.isLocked) return badge;
      if (!state.user) return badge;

      const completedQuestsCount = state.quests.filter((q) => q.status === "completed").length;
      const completedFocusSessions = state.focusSessions.filter((fs) => fs.completed).length;

      let unlock = false;
      const requirement = badge.requirement?.toLowerCase() || "";

      if (requirement.includes("complete 1 quest") && completedQuestsCount >= 1) unlock = true;
      else if (requirement.includes("7-day streak") && state.habits.some((h) => h.longestStreak >= 7))
        unlock = true;
      else if (requirement.includes("50 quests") && completedQuestsCount >= 50) unlock = true;
      else if (requirement.includes("100 focus sessions") && completedFocusSessions >= 100)
        unlock = true;
      else if (requirement.includes("level 50") && state.user.level >= 50) unlock = true;

      if (unlock) {
        return {
          ...badge,
          isLocked: false,
          unlockedAt: new Date().toISOString(),
        };
      }
      return badge;
    });
  };

  // Quest Handlers
  const handleAddQuestAI = () => {
    const template = getRandomQuestTemplate();
    const newQuest: Quest = {
      id: createId("quest"),
      title: template.title,
      description: template.description,
      difficulty: template.difficulty,
      status: "pending",
      xpReward: getXPForDifficulty(template.difficulty),
      tags: template.tags || [],
      subtasks: [],
      createdAt: new Date().toISOString(),
    };
    setAppState((prev) => ({
      ...prev,
      quests: [...prev.quests, newQuest],
    }));
    toast.success("AI quest created!", { description: "A new challenge has been selected for you" });
  };

  const handleCreateQuest = (quest: Quest) => {
    setAppState((prev) => ({
      ...prev,
      quests: [...prev.quests, quest],
    }));
    toast.success("Quest created!", { description: "Time to start your adventure" });
  };

  const handleOpenNewQuestDialog = (dueDateISO?: string) => {
    setNewQuestDefaultDueDate(dueDateISO);
    setNewQuestDialogOpen(true);
  };

  const handleCompleteQuest = (questId: string) => {
    const quest = appState.quests.find((q) => q.id === questId);
    if (!quest || !appState.user) return;

    const updatedQuests = appState.quests.map((q) =>
      q.id === questId ? { ...q, status: "completed" as const, completedAt: new Date().toISOString() } : q
    );

    const newTotalXP = appState.user.totalXP + quest.xpReward;
    const newLevel = calculateLevel(newTotalXP);
    const leveledUp = newLevel > appState.user.level;

    let xpForCurrentLevel = 0;
    for (let i = 1; i < newLevel; i++) xpForCurrentLevel += calculateXPForLevel(i);
    const currentXP = newTotalXP - xpForCurrentLevel;
    const xpToNextLevel = calculateXPForLevel(newLevel);

    const updatedUser: User = {
      ...appState.user,
      xp: currentXP,
      xpToNextLevel,
      level: newLevel,
      totalXP: newTotalXP,
    };

    const newState: AppState = { ...appState, user: updatedUser, quests: updatedQuests };
    const updatedBadges = checkAndUnlockBadges(newState);
    setAppState({ ...newState, badges: updatedBadges });

    if (leveledUp) {
      toast.success(`🎉 Level Up! You're now Level ${newLevel}!`, { description: `You earned ${quest.xpReward} XP` });
    } else {
      toast.success(`Quest Complete! +${quest.xpReward} XP`, {
        description: `${xpToNextLevel - currentXP} XP until Level ${newLevel + 1}`,
      });
    }
  };

  const handleOpenQuestDetail = (quest: Quest) => {
    setSelectedQuest(quest);
    setQuestDialogOpen(true);
  };

  const handleCloseQuestDetail = () => setQuestDialogOpen(false);

  // Habit Handlers
  const handleAddHabit = () => {
    const newHabit: Habit = {
      id: createId("habit"),
      title: "New Habit",
      frequency: "daily",
      currentStreak: 0,
      longestStreak: 0,
      xpPerCompletion: 10,
      completedDates: [],
      createdAt: new Date().toISOString(),
      color: "#8b5cf6",
    };
    setAppState((prev) => ({ ...prev, habits: [...prev.habits, newHabit] }));
    toast.success("Habit created!");
  };

  const handleToggleHabit = (habitId: string) => {
    const todayStr = new Date().toISOString().split("T")[0];
    const habit = appState.habits.find((h) => h.id === habitId);
    if (!habit || !appState.user) return;

    const isCompletedToday = habit.completedDates.some((date) => date.startsWith(todayStr));

    if (isCompletedToday) {
      const updatedHabits = appState.habits.map((h) =>
        h.id === habitId
          ? {
              ...h,
              completedDates: h.completedDates.filter((d) => !d.startsWith(todayStr)),
              currentStreak: Math.max(0, h.currentStreak - 1),
            }
          : h
      );
      const newState: AppState = { ...appState, habits: updatedHabits };
      const updatedBadges = checkAndUnlockBadges(newState);
      setAppState({ ...newState, badges: updatedBadges });
      toast.info("Habit unmarked");
    } else {
      const newStreak = habit.currentStreak + 1;
      const longestStreak = Math.max(habit.longestStreak, newStreak);

      const updatedHabits = appState.habits.map((h) =>
        h.id === habitId
          ? {
              ...h,
              completedDates: [...h.completedDates, new Date().toISOString()],
              currentStreak: newStreak,
              longestStreak,
            }
          : h
      );

      const newTotalXP = appState.user.totalXP + habit.xpPerCompletion;
      const newLevel = calculateLevel(newTotalXP);

      let xpForCurrentLevel = 0;
      for (let i = 1; i < newLevel; i++) xpForCurrentLevel += calculateXPForLevel(i);
      const currentXP = newTotalXP - xpForCurrentLevel;
      const xpToNextLevel = calculateXPForLevel(newLevel);

      const updatedUser: User = {
        ...appState.user,
        xp: currentXP,
        xpToNextLevel,
        level: newLevel,
        totalXP: newTotalXP,
      };

      const newState: AppState = { ...appState, user: updatedUser, habits: updatedHabits };
      const updatedBadges = checkAndUnlockBadges(newState);
      setAppState({ ...newState, badges: updatedBadges });

      toast.success(`Habit complete! +${habit.xpPerCompletion} XP`, {
        description: newStreak > 1 ? `${newStreak} day streak! 🔥` : undefined,
      });
    }
  };

  // Focus Session Handler
  const handleFocusComplete = (duration: number, xpEarned: number) => {
    if (!appState.user) return;

    const newTotalXP = appState.user.totalXP + xpEarned;
    const newLevel = calculateLevel(newTotalXP);

    let xpForCurrentLevel = 0;
    for (let i = 1; i < newLevel; i++) xpForCurrentLevel += calculateXPForLevel(i);
    const currentXP = newTotalXP - xpForCurrentLevel;
    const xpToNextLevel = calculateXPForLevel(newLevel);

    const updatedUser: User = {
      ...appState.user,
      xp: currentXP,
      xpToNextLevel,
      level: newLevel,
      totalXP: newTotalXP,
    };

    const newFocusSession: FocusSession = {
      id: createId("focus"),
      duration,
      startTime: new Date(Date.now() - duration * 60 * 1000).toISOString(),
      endTime: new Date().toISOString(),
      xpEarned,
      completed: true,
    };

    const newState: AppState = {
      ...appState,
      user: updatedUser,
      focusSessions: [...appState.focusSessions, newFocusSession],
    };
    const updatedBadges = checkAndUnlockBadges(newState);
    setAppState({ ...newState, badges: updatedBadges });

    toast.success(`Focus session complete! +${xpEarned} XP`, {
      description: `You focused for ${duration} minutes`,
    });
  };

  // Settings Handlers
  const handleLogout = () => {
    setAppState({
      user: null,
      quests: [],
      habits: [],
      focusSessions: [],
      badges: mockBadges,
      currentPage: "landing",
      isOnboarded: false,
    });
    toast.info("Logged out successfully");
  };

  const handleUpdateProfile = (name: string, email: string) => {
    if (!appState.user) return;
    setAppState((prev) => ({ ...prev, user: { ...prev.user!, name, email } }));
    toast.success("Profile updated!");
  };

  // Render current page
  const renderPage = () => {
    switch (appState.currentPage) {
      case "landing":
        return <LandingPage onGetStarted={() => handleNavigate("auth")} />;

      case "auth":
        return <AuthPage onAuth={handleAuth} />;

      case "onboarding":
        return <OnboardingPage onComplete={handleOnboardingComplete} />;

      case "dashboard": {
        if (!appState.user) return null;
        const todayKey = toLocalDateKey(new Date());
        const todayQuestsAll = appState.quests.filter((q) => {
          if (!q.dueDate) return true;
          const dueKey = isoToLocalDateKey(q.dueDate);
          return dueKey ? dueKey === todayKey : true;
        });
        const todayQuests = todayQuestsAll.filter((q) => q.status !== "completed");

        return (
          <Dashboard
            user={appState.user}
            todayQuestsAll={todayQuestsAll}
            todayQuests={todayQuests}
            habits={appState.habits}
            onAddQuest={() => handleOpenNewQuestDialog()}
            onAddQuestAI={handleAddQuestAI}
            onQuestClick={(quest) => handleOpenQuestDetail(quest)}
            onQuestComplete={(questId) => handleCompleteQuest(questId)}
            onViewAllQuests={() => handleNavigate("quests")}
            onViewAllHabits={() => handleNavigate("habits")}
            moodToday={appState.moodByDate?.[todayKey]}
            onMoodChange={(mood) => {
              setAppState((prev) => ({
                ...prev,
                moodByDate: {
                  ...(prev.moodByDate || {}),
                  [todayKey]: mood,
                },
              }));
              toast.success("Mood saved", { description: `Mood hari ini: ${mood}` });
            }}
            onHabitClick={(habit) => handleToggleHabit(habit.id)}
            onStartFocus={() => handleNavigate("focus")}
          />
        );
      }

      case "quests":
        return (
          <QuestsPage
            quests={appState.quests}
            onAddQuest={() => handleOpenNewQuestDialog()}
            onAddQuestAI={handleAddQuestAI}
            onQuestClick={(quest) => handleOpenQuestDetail(quest)}
            onCompleteQuest={handleCompleteQuest}
          />
        );

      case "calendar":
        return (
          <CalendarPage
            quests={appState.quests}
            onQuestClick={handleOpenQuestDetail}
            onCompleteQuest={handleCompleteQuest}
            onAddQuestForDate={(date) => handleOpenNewQuestDialog(makeDueDateISO(date))}
          />
        );

      case "habits":
        return (
          <HabitsPage
            habits={appState.habits}
            onAddHabit={handleAddHabit}
            onHabitClick={() => {}}
            onToggleHabit={handleToggleHabit}
          />
        );

      case "focus":
        return <FocusSessionPage onComplete={handleFocusComplete} />;

      case "rewards":
        return <RewardsPage badges={appState.badges} onBadgeClick={handleBadgeClick} />;

      case "stats":
        return (
          <StatsPage
            quests={appState.quests}
            habits={appState.habits}
            focusSessions={appState.focusSessions}
            moodByDate={appState.moodByDate}
          />
        );

      case "settings":
        if (!appState.user) return null;
        return <SettingsPage user={appState.user} onLogout={handleLogout} onUpdateProfile={handleUpdateProfile} />;

      default:
        return null;
    }
  };

  const isAppPage = appState.user && appState.isOnboarded;

  return (
    <div className="dark min-h-screen bg-background text-foreground">
      {isAppPage ? (
        <div className="flex overflow-x-hidden">
          {/* Mobile Topbar */}
          <div className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between border-b bg-background/80 backdrop-blur px-4 py-3 md:hidden">
            <button className="rounded border px-3 py-2" onClick={() => setMobileMenuOpen(true)}>
              ☰ Menu
            </button>
            <div className="font-semibold">Solo</div>
            <div className="w-16" />
          </div>

          {/* Mobile Drawer */}
          {mobileMenuOpen && (
            <div className="fixed inset-0 z-50 md:hidden">
              <div className="absolute inset-0 bg-black/50" onClick={() => setMobileMenuOpen(false)} />
              <div className="absolute left-0 top-0 h-full w-72 bg-background p-4 overflow-y-auto">
                <button className="mb-4 rounded border px-3 py-2" onClick={() => setMobileMenuOpen(false)}>
                  Close
                </button>

                <AppSidebar
                  user={appState.user!}
                  currentPage={appState.currentPage}
                  onNavigate={(p) => {
                    handleNavigate(p);
                    setMobileMenuOpen(false);
                  }}
                  onAddQuest={() => {
                    handleOpenNewQuestDialog();
                    setMobileMenuOpen(false);
                  }}
                />
              </div>
            </div>
          )}

          {/* Desktop Sidebar */}
          <div className="hidden md:block">
            <AppSidebar
              user={appState.user!}
              currentPage={appState.currentPage}
              onNavigate={handleNavigate}
              onAddQuest={() => handleOpenNewQuestDialog()}
            />
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0 min-h-screen pb-20 md:pb-0">
            <div className="container mx-auto max-w-7xl px-4 py-4 pt-16 sm:px-6 sm:py-6 md:pt-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={appState.currentPage}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  {renderPage()}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Mobile Bottom Nav */}
          <MobileNav currentPage={appState.currentPage} onNavigate={handleNavigate} />
        </div>
      ) : (
        <div>{renderPage()}</div>
      )}

      <Toaster
        position="top-right"
        theme="dark"
        toastOptions={{
          style: {
            background: "rgba(18, 19, 31, 0.9)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(139, 92, 246, 0.2)",
            color: "#e8e9f3",
          },
        }}
      />

      {isAppPage && (
        <CommandPalette
          open={commandOpen}
          onOpenChange={setCommandOpen}
          quests={appState.quests}
          onNavigate={handleNavigate}
          onNewQuest={() => handleOpenNewQuestDialog()}
          onNewAIQuest={handleAddQuestAI}
          onStartFocus={() => handleNavigate("focus")}
        />
      )}

      <QuestDetailDialog
        quest={selectedQuest}
        open={questDialogOpen}
        onClose={handleCloseQuestDetail}
        onSave={(updatedQuest) => {
          setAppState((prev) => ({
            ...prev,
            quests: prev.quests.map((q) => (q.id === updatedQuest.id ? updatedQuest : q)),
          }));
          toast.success("Quest updated!");
        }}
        onComplete={handleCompleteQuest}
        onDelete={(questId) => {
          setAppState((prev) => ({
            ...prev,
            quests: prev.quests.filter((q) => q.id !== questId),
          }));
          toast.success("Quest deleted");
        }}
      />

      <BadgeDetailDialog badge={selectedBadge} open={badgeDialogOpen} onClose={() => setBadgeDialogOpen(false)} />

      <QuestCreateDialog
        open={newQuestDialogOpen}
        defaultDueDate={newQuestDefaultDueDate}
        onClose={() => {
          setNewQuestDialogOpen(false);
          setNewQuestDefaultDueDate(undefined);
        }}
        onCreate={handleCreateQuest}
      />

      {/* Vercel Speed Insights */}
      <SpeedInsights />
    </div>
  );
}
