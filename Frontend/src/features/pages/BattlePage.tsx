import React, { useEffect, useState, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import {
  Plus, Brain, Scale, Trophy,
  Copy, Sparkles, User, Check, Terminal, ChevronDown,
  Zap, Cpu, Settings2, Globe, Menu,
  LogOut, Settings, Search
} from "lucide-react";

import {
  useBattleContext,
  getBattleTurns,
  getBattleTitle,
  type BattleTurn,
} from "../BattleContext";
import { BattleSidebarItem } from "../component/BattleSidebarItem";
import { BattleInputToolbar } from "../component/BattleInputToolbar";
import { useAuth } from "../../auth/AuthContext";
import type {
  BattleMessagePayload,
  SelectedFile,
  SelectedImage,
} from "../../types/battleMessage";
import { useNavigate } from "react-router-dom";

// --- Helper Functions ---
const getTurnAiWinner = (turn: BattleTurn): "A" | "B" | null => {
  if (turn.solution_1_score > turn.solution_2_score) return "A";
  if (turn.solution_2_score > turn.solution_1_score) return "B";
  return null;
};

const buildJudgeVerdict = (turn: BattleTurn) => {
  const aiWinner = getTurnAiWinner(turn);
  const aiLabel = aiWinner === "A" ? "Mistral" : aiWinner === "B" ? "Cohere" : "Tie";

  return `### AI Scores
| Model | Score |
|-------|-------|
| **Mistral** | ${turn.solution_1_score}/10 |
| **Cohere** | ${turn.solution_2_score}/10 |

**AI verdict:** ${aiLabel}

---

### Mistral — Analysis
${turn.solution_1_reasoning || "_No reasoning provided._"}

---

### Cohere — Analysis
${turn.solution_2_reasoning || "_No reasoning provided._"}`;
};

// --- Sub-Components ---
const CopyButton = ({ content }: { content: string }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={handleCopy}
      className="p-1.5 hover:bg-white/10 rounded-md transition-colors flex items-center gap-1.5"
    >
      {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} className="text-gray-400" />}
    </button>
  );
};

const MarkdownConfig = {
  code({ node, inline, className, children, ...props }: any) {
    const match = /language-(\w+)/.exec(className || "");
    const codeContent = String(children).replace(/\n$/, "");
    return !inline && match ? (
      <div className="relative my-4 rounded-xl overflow-hidden border border-white/10 bg-black/40 backdrop-blur-sm">
        <div className="flex items-center justify-between px-4 py-2 bg-white/5 border-b border-white/5">
          <div className="flex items-center gap-2 text-[10px] text-gray-400 font-mono uppercase tracking-widest">
            <Terminal size={12} /> {match[1]}
          </div>
          <CopyButton content={codeContent} />
        </div>
        <div className="overflow-x-auto">
          <SyntaxHighlighter
            style={vscDarkPlus}
            language={match[1]}
            PreTag="div"
            customStyle={{
              margin: 0,
              padding: "1rem",
              fontSize: "12px",
              background: "transparent",
              lineHeight: "1.5"
            }}
            {...props}
          >
            {codeContent}
          </SyntaxHighlighter>
        </div>
      </div>
    ) : (
      <code className="bg-purple-500/20 text-purple-300 px-1.5 py-0.5 rounded font-mono text-xs" {...props}>
        {children}
      </code>
    );
  },
  p: ({ children }: any) => <p className="mb-4 leading-relaxed text-gray-300/90 last:mb-0 text-sm md:text-base">{children}</p>,
  ul: ({ children }: any) => <ul className="list-disc ml-5 mb-4 space-y-1 text-gray-300/90 text-sm md:text-base">{children}</ul>,
  table: ({ children }: any) => (
    <div className="overflow-x-auto my-4 rounded-lg border border-white/10">
      <table className="w-full text-xs md:text-sm">{children}</table>
    </div>
  ),
  th: ({ children }: any) => (
    <th className="px-3 py-2 bg-white/5 text-left font-bold uppercase tracking-wider text-gray-400 border-b border-white/10">
      {children}
    </th>
  ),
  td: ({ children }: any) => (
    <td className="px-3 py-2 border-b border-white/5 text-gray-400">{children}</td>
  ),
};

type SolutionCardProps = {
  title: string;
  subtitle: string;
  score: number;
  content: string;
  isWinner: boolean;
  onSelect: () => void;
  showVoteButton: boolean;
  disabled: boolean;
};

const SolutionCard = ({
  title, subtitle, score, content, isWinner, onSelect, showVoteButton, disabled,
}: SolutionCardProps) => (
  <motion.div
    layout
    className={`relative flex flex-col min-h-0 rounded-[2rem] border transition-all duration-500 bg-gradient-to-b from-[#111] to-[#090909] overflow-hidden ${isWinner
      ? "border-purple-500/50 shadow-[0_0_40px_-12px_rgba(168,85,247,0.3)]"
      : "border-white/5"
      }`}
  >
    <div className="p-4 md:p-5 flex justify-between items-center border-b border-white/5 bg-white/[0.02]">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-xl ${isWinner ? "bg-purple-600" : "bg-neutral-800"}`}>
          <Cpu size={16} className={isWinner ? "text-white" : "text-gray-500"} />
        </div>
        <div>
          <span className={`text-[10px] md:text-xs font-black tracking-widest uppercase block ${isWinner ? "text-white" : "text-gray-400"}`}>
            {title}
          </span>
          <span className="text-[9px] text-gray-500 font-mono">{subtitle}</span>
        </div>
      </div>
      <div className="text-right flex flex-col items-end">
        <span className="text-xs font-mono font-bold text-purple-400">{score}/10</span>
        {isWinner && <Trophy size={12} className="text-yellow-500 mt-1" />}
      </div>
    </div>

    <div className="p-5 md:p-6 overflow-y-auto max-h-[400px] md:max-h-[550px] scrollbar-thin custom-scrollbar">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={MarkdownConfig}>
        {content}
      </ReactMarkdown>
    </div>

    {showVoteButton && (
      <div className="p-4 bg-white/[0.02] border-t border-white/5">
        <button
          onClick={onSelect}
          disabled={disabled}
          className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-xl transition-all disabled:opacity-50"
        >
          Cast Vote
        </button>
      </div>
    )}
  </motion.div>
);

// --- Main Page ---
const BattlePage: React.FC = () => {
  const {
    battles, createBattle, appendBattleMessage,
    judgeBattle, renameBattle, deleteBattle
  } = useBattleContext();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Local UI State
  const [input, setInput] = useState("");
  const [searchQuery, setSearchQuery] = useState(""); // Sidebar Search
  const [userVote, setUserVote] = useState<"A" | "B" | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVoting, setIsVoting] = useState(false);
  const [activeBattleId, setActiveBattleId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [openMenuBattleId, setOpenMenuBattleId] = useState<string | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Attachments
  const [selectedFile, setSelectedFile] = useState<SelectedFile | null>(null);
  const [selectedImage, setSelectedImage] = useState<SelectedImage | null>(null);
  const [webSearchResult, setWebSearchResult] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Filter battles based on search
  const filteredBattles = useMemo(() => {
    return battles.filter(b =>
      getBattleTitle(b).toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [battles, searchQuery]);

  const activeBattle = useMemo(() => battles.find((b) => b._id === activeBattleId) ?? null, [battles, activeBattleId]);
  const activeTurns = useMemo(() => (activeBattle ? getBattleTurns(activeBattle) : []), [activeBattle]);

  const userInitial = useMemo(() => {
    const name = user?.name || user?.email || "U";
    return name.trim().charAt(0).toUpperCase();
  }, [user]);

  // Handle Click Outside for Profile Popup
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const scrollToBottom = (behavior: ScrollBehavior = "smooth") => {
    bottomRef.current?.scrollIntoView({ behavior });
  };

  useEffect(() => {
    if (activeBattle || isSubmitting) scrollToBottom();
  }, [activeBattle, isSubmitting, activeTurns.length]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const isAtBottom = target.scrollHeight - target.scrollTop <= target.clientHeight + 200;
    setShowScrollButton(!isAtBottom);
  };

  const startNewBattle = () => {
    setActiveBattleId(null);
    setUserVote(null);
    setError(null);
    setIsSidebarOpen(false);
    setSelectedFile(null);
    setSelectedImage(null);
    setWebSearchResult(null);
  };

  const handleVote = async (winner: "A" | "B") => {
    if (!activeBattle || isVoting) return;
    setIsVoting(true);
    setError(null);
    try {
      const res = await judgeBattle(activeBattle._id, winner);
      if (res?.success) setUserVote(winner);
    } catch {
      setError("Failed to register vote.");
    } finally {
      setIsVoting(false);
    }
  };

  const handleSend = async () => {
    const text = input.trim();
    if (!text && !selectedFile && !selectedImage && !webSearchResult) return;
    if (isSubmitting) return;

    setIsSubmitting(true);
    setError(null);

    const payload: BattleMessagePayload = {
      message: text || "Solve this step-by-step.",
      ...(selectedFile && { fileName: selectedFile.name, fileContent: selectedFile.content }),
      ...(selectedImage && { imageName: selectedImage.name, imageDataUrl: selectedImage.dataUrl }),
      ...(webSearchResult && { webSearchResult }),
    };

    try {
      if (activeBattleId) {
        const res = await appendBattleMessage(activeBattleId, payload);
        if (res?.success) {
          setInput("");
          setSelectedFile(null);
          setSelectedImage(null);
          setWebSearchResult(null);
          setUserVote(null);
        }
      } else {
        const res = await createBattle(payload);
        if (res?.success && res.battle) {
          setActiveBattleId(res.battle._id);
          setInput("");
          setSelectedFile(null);
          setSelectedImage(null);
          setWebSearchResult(null);
        }
      }
    } catch {
      setError("Engine failure. Please retry.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex h-screen w-full bg-[#050505] text-gray-200 overflow-hidden font-sans selection:bg-purple-500/30">
      {/* Background Decor */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(88,28,135,0.08)_0%,transparent_50%)] pointer-events-none" />

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-[70] w-72 md:w-80 bg-[#080808] border-r border-white/5 
        transform transition-transform duration-300 ease-in-out lg:translate-x-0
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
        flex flex-col
      `}>
        {/* Top: New Session and Search */}
        <div className="p-5 space-y-4">
          <button
            onClick={startNewBattle}
            className="w-full flex items-center justify-between px-4 py-3.5 bg-gradient-to-br from-white/10 to-transparent hover:from-white/15 border border-white/10 rounded-2xl transition-all"
          >
            <div className="flex items-center gap-3">
              <Plus size={18} className="text-purple-400" />
              <span className="font-bold text-xs uppercase tracking-widest text-white">New Session</span>
            </div>
            <div className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-[8px] font-mono text-gray-500">
              ⌘N
            </div>
          </button>

          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-purple-500 transition-colors" size={14} />
            <input
              type="text"
              placeholder="Search history..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/5 rounded-xl py-2.5 pl-10 pr-4 text-[11px] outline-none focus:border-purple-500/50 transition-all placeholder:text-gray-600 text-gray-300"
            />
          </div>
        </div>

        {/* Middle: History List */}
        <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-2 custom-scrollbar">
          <div className="flex items-center justify-between px-2 mb-4">
            <p className="text-[10px] uppercase tracking-[0.2em] text-white/30 font-black">History</p>
            <Settings2 size={12} className="text-white/20" />
          </div>
          {filteredBattles.length === 0 && (
            <div className="p-8 text-center border border-dashed border-white/5 rounded-2xl opacity-40">
              <p className="text-[10px] font-bold uppercase">{searchQuery ? "No results" : "Void"}</p>
            </div>
          )}
          {filteredBattles.map((b) => (
            <BattleSidebarItem
              key={b._id}
              battle={b}
              isActive={activeBattleId === b._id}
              isMenuOpen={openMenuBattleId === b._id}
              onSelect={() => {
                setActiveBattleId(b._id);
                setIsSidebarOpen(false);
              }}
              onMenuToggle={() => setOpenMenuBattleId(prev => prev === b._id ? null : b._id)}
              onMenuClose={() => setOpenMenuBattleId(null)}
              onRename={renameBattle}
              onDelete={deleteBattle}
            />
          ))}
        </div>

        {/* Bottom: Profile Dropdown in Sidebar */}
        <div className="p-4 border-t border-white/5 bg-black/40 relative" ref={profileRef}>
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="w-full flex items-center gap-3 p-2 rounded-2xl hover:bg-white/5 transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-blue-600 flex items-center justify-center text-xs font-black text-white shadow-lg shadow-purple-500/10">
              {userInitial}
            </div>
            <div className="flex-1 text-left min-w-0">
              <p className="text-[11px] font-bold text-white truncate uppercase tracking-tight">{user?.name || "User"}</p>
              <p className="text-[9px] text-gray-500 font-mono uppercase tracking-tighter">Verified Node</p>
            </div>
            <Settings size={14} className="text-gray-600 group-hover:text-purple-400 transition-colors" />
          </button>

          {/* Profile Popup (Opens Upwards) */}
          <AnimatePresence>
            {isProfileOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute bottom-full left-4 right-4 mb-3 bg-[#0d0d0d] border border-white/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden z-[999] backdrop-blur-2xl"
              >
                <div className="p-4 border-b border-white/5 bg-white/[0.02]">
                  <p className="text-[9px] text-purple-400 font-black uppercase tracking-[0.2em] mb-2">Active Session</p>
                  <div className="flex items-center gap-3">
                    <div className="min-w-0">
                      <p className="text-[10px] font-bold text-white truncate">{user?.email}</p>
                      <p className="text-[8px] text-gray-500 font-mono mt-0.5">LATENCY: 42MS</p>
                    </div>
                  </div>
                </div>

                <div className="p-2">
                  <button
                    onClick={() => {
                      setIsProfileOpen(false);
                      navigate("/profile");
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 text-xs text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-all group"
                  >
                    <Settings size={14} className="group-hover:rotate-45 transition-transform" />
                    <span className="font-medium">Account Settings</span>
                  </button>
                  <button
                    onClick={() => {
                      logout?.();
                      setIsProfileOpen(false);
                      navigate("/login");
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 text-xs text-red-400 hover:bg-red-500/10 rounded-xl transition-all group"
                  >
                    <LogOut size={14} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="font-bold uppercase tracking-wider">Logout</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 relative z-30">
        {/* Header (Simplified) */}
        <header className="h-16 md:h-20 flex shrink-0 items-center justify-between px-4 md:px-8 border-b border-white/5 backdrop-blur-2xl bg-black/20">
          <div className="flex items-center gap-3 md:gap-4">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 lg:hidden hover:bg-white/5 rounded-lg transition-colors"
            >
              <Menu size={20} />
            </button>
            <div className="relative">
              <div className="absolute inset-0 bg-purple-500 blur-lg opacity-20" />
              <div className="relative w-9 h-9 md:w-11 md:h-11 bg-neutral-900 border border-white/10 rounded-xl flex items-center justify-center">
                <Zap size={20} className="text-purple-500 fill-purple-500/10" />
              </div>
            </div>
            <div>
              <h1 className="font-black text-xs md:text-sm uppercase tracking-[0.3em] text-white">Battle Arena</h1>
              <div className="flex items-center gap-2">
                <div className="w-1 h-1 md:w-1.5 md:h-1.5 bg-green-500 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                <span className="text-[8px] md:text-[9px] text-gray-500 font-mono tracking-widest uppercase">Benchmark v2.4</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 md:gap-4">
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-white/5 rounded-xl border border-white/5">
              <Globe size={14} className="text-gray-500" />
              <span className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">System Status: Optimal</span>
            </div>
          </div>
        </header>

        {/* Scrollable Chat Area */}
        <div className="flex-1 overflow-hidden relative">
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="h-full overflow-y-auto pt-8 pb-48 px-4 md:px-8 custom-scrollbar scroll-smooth"
          >
            <div className="max-w-5xl mx-auto">
              {error && (
                <div className="mb-6 p-4 rounded-xl bg-red-500/5 border border-red-500/20 text-red-400 text-xs font-bold flex items-center gap-3">
                  <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-ping" />
                  {error}
                </div>
              )}

              <AnimatePresence mode="wait">
                {activeBattle ? (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-16 md:space-y-24">
                    {activeTurns.map((turn, index) => {
                      const isLatest = index === activeTurns.length - 1;
                      const turnWinner = getTurnAiWinner(turn);
                      const displayWinner = isLatest ? userVote ?? turnWinner : turnWinner;

                      return (
                        <div key={index} className="space-y-10 md:space-y-12">
                          {/* User Msg */}
                          <div className="flex justify-end items-start gap-4">
                            <motion.div initial={{ x: 10, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="bg-[#111] border border-white/10 px-5 py-3.5 md:px-7 md:py-4 rounded-[2rem] rounded-tr-md max-w-[90%] md:max-w-2xl">
                              <p className="text-gray-200 text-sm leading-relaxed">{turn.message}</p>
                            </motion.div>
                            <div className="hidden sm:flex w-10 h-10 rounded-xl bg-white/5 items-center justify-center border border-white/10">
                              <User size={20} className="text-gray-500" />
                            </div>
                          </div>

                          {/* Divider */}
                          <div className="flex justify-center">
                            <div className="px-6 py-1.5 border border-white/5 rounded-full flex items-center gap-2 bg-white/[0.01]">
                              <Scale size={12} className="text-purple-500" />
                              <span className="text-[8px] font-black tracking-[0.3em] text-gray-500 uppercase">Cycle {index + 1}</span>
                            </div>
                          </div>

                          {/* Grid */}
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
                            <SolutionCard
                              title="Alpha Node" subtitle="Mistral-Large" score={turn.solution_1_score}
                              content={turn.solution_1} isWinner={displayWinner === "A"}
                              onSelect={() => handleVote("A")} showVoteButton={isLatest && !userVote}
                              disabled={isVoting || isSubmitting}
                            />
                            <SolutionCard
                              title="Beta Node" subtitle="Cohere-Command" score={turn.solution_2_score}
                              content={turn.solution_2} isWinner={displayWinner === "B"}
                              onSelect={() => handleVote("B")} showVoteButton={isLatest && !userVote}
                              disabled={isVoting || isSubmitting}
                            />
                          </div>

                          {/* System Verdict */}
                          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-gradient-to-br from-[#0a0a0a] to-[#050505] border border-white/10 rounded-[2.5rem] p-6 md:p-12 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-8 opacity-[0.02] pointer-events-none">
                              <Brain size={120} />
                            </div>
                            <div className="flex items-center gap-4 mb-8">
                              <div className="p-2.5 bg-purple-500/10 border border-purple-500/20 rounded-xl">
                                <Sparkles size={20} className="text-purple-400" />
                              </div>
                              <h3 className="font-black uppercase tracking-widest text-xs md:text-sm text-white">System Verdict</h3>
                            </div>
                            <div className="prose prose-invert max-w-none prose-sm">
                              <ReactMarkdown remarkPlugins={[remarkGfm]} components={MarkdownConfig}>
                                {buildJudgeVerdict(turn)}
                              </ReactMarkdown>
                            </div>
                          </motion.div>
                        </div>
                      );
                    })}
                  </motion.div>
                ) : (
                  <div className="h-[60vh] flex flex-col items-center justify-center text-center">
                    <div className="relative mb-8">
                      <div className="absolute inset-0 bg-purple-600 blur-[60px] opacity-10" />
                      <Brain size={64} className="text-white/10 relative" />
                    </div>
                    <h2 className="text-3xl md:text-4xl font-black text-white mb-4 uppercase tracking-tighter">Enter The Arena</h2>
                    <p className="text-gray-500 max-w-sm text-sm font-medium leading-relaxed">
                      Deploy complex logic or code. Watch neural nodes compete in real-time benchmarking.
                    </p>
                  </div>
                )}
              </AnimatePresence>

              {isSubmitting && (
                <div className="flex justify-center py-12">
                  <div className="flex items-center gap-4 px-6 py-3 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-xl">
                    <div className="flex gap-1">
                      <div className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                      <div className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce" />
                    </div>
                    <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">Processing...</span>
                  </div>
                </div>
              )}
              <div ref={bottomRef} className="h-4" />
            </div>
          </div>

          {showScrollButton && (
            <button
              onClick={() => scrollToBottom()}
              className="absolute bottom-36 right-6 md:right-10 p-3 bg-white text-black rounded-full shadow-2xl hover:scale-110 active:scale-90 transition-all z-40"
            >
              <ChevronDown size={20} strokeWidth={3} />
            </button>
          )}
        </div>

        {/* Floating Input Toolbar */}
        <div className="absolute bottom-0 left-0 w-full p-4 md:p-10 z-50 pointer-events-none">
          <div className="max-w-4xl mx-auto pointer-events-auto">
            <BattleInputToolbar
              input={input} setInput={setInput} isSubmitting={isSubmitting} onSend={handleSend}
              selectedFile={selectedFile} setSelectedFile={setSelectedFile}
              selectedImage={selectedImage} setSelectedImage={setSelectedImage}
              webSearchResult={webSearchResult} setWebSearchResult={setWebSearchResult}
            />
            <p className="text-center text-[8px] text-gray-600 font-mono mt-4 uppercase tracking-[0.3em] hidden xs:block">
              Secured Neural Link — Benchmarking Protocol Active
            </p>
          </div>
        </div>
      </main>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.1); }
      `}</style>
    </div>
  );
};

export default BattlePage;