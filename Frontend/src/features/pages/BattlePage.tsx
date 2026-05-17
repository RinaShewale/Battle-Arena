import React, { useEffect, useState, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import {
  Plus, ArrowUp, RotateCcw, Brain, Scale, Trophy,
  Copy, Sparkles, User, Bot, Check, Terminal, ChevronDown
} from "lucide-react";

import { useBattleContext, type Battle } from "../BattleContext";
import { useAuth } from "../../auth/AuthContext";

const getAiWinner = (battle: Battle): "A" | "B" | null => {
  if (battle.solution_1_score > battle.solution_2_score) return "A";
  if (battle.solution_2_score > battle.solution_1_score) return "B";
  return null;
};

const buildJudgeVerdict = (battle: Battle) => {
  const aiWinner = getAiWinner(battle);
  const aiLabel = aiWinner === "A" ? "Mistral" : aiWinner === "B" ? "Cohere" : "Tie";

  return `### AI Scores
| Model | Score |
|-------|-------|
| **Mistral** (Alpha) | ${battle.solution_1_score}/10 |
| **Cohere** (Beta) | ${battle.solution_2_score}/10 |

**AI verdict:** ${aiLabel}

---

### Mistral — Analysis
${battle.solution_1_reasoning || "_No reasoning provided._"}

---

### Cohere — Analysis
${battle.solution_2_reasoning || "_No reasoning provided._"}`;
};

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
      <div className="relative my-6 rounded-xl overflow-hidden border border-white/10 bg-[#0d0d0d]">
        <div className="flex items-center justify-between px-4 py-2 bg-white/5 border-b border-white/5">
          <div className="flex items-center gap-2 text-[10px] text-gray-400 font-mono uppercase tracking-widest">
            <Terminal size={12} /> {match[1]}
          </div>
          <CopyButton content={codeContent} />
        </div>
        <SyntaxHighlighter
          style={vscDarkPlus}
          language={match[1]}
          PreTag="div"
          customStyle={{
            margin: 0,
            padding: "1.25rem",
            fontSize: "13px",
            background: "transparent",
            lineHeight: "1.6"
          }}
          {...props}
        >
          {codeContent}
        </SyntaxHighlighter>
      </div>
    ) : (
      <code className="bg-purple-500/20 text-purple-300 px-1.5 py-0.5 rounded font-mono text-sm" {...props}>
        {children}
      </code>
    );
  },
  p: ({ children }: any) => <p className="mb-4 leading-relaxed text-gray-300 last:mb-0">{children}</p>,
  ul: ({ children }: any) => <ul className="list-disc ml-6 mb-4 space-y-2 text-gray-300">{children}</ul>,
  table: ({ children }: any) => (
    <div className="overflow-x-auto my-4">
      <table className="w-full text-sm border border-white/10 rounded-lg overflow-hidden">{children}</table>
    </div>
  ),
  th: ({ children }: any) => (
    <th className="px-4 py-2 bg-white/5 text-left text-xs font-bold uppercase tracking-wider text-gray-400 border-b border-white/10">
      {children}
    </th>
  ),
  td: ({ children }: any) => (
    <td className="px-4 py-2 border-b border-white/5 text-gray-300">{children}</td>
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
  title,
  subtitle,
  score,
  content,
  isWinner,
  onSelect,
  showVoteButton,
  disabled,
}: SolutionCardProps) => (
  <motion.div
    layout
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className={`relative flex flex-col min-h-0 rounded-3xl border transition-all duration-500 bg-[#0d0d0d] overflow-hidden ${
      isWinner
        ? "border-purple-500 shadow-[0_0_40px_-15px_rgba(168,85,247,0.3)]"
        : "border-white/10"
    }`}
  >
    <div className="p-4 flex justify-between items-center border-b border-white/5 bg-white/[0.02] sticky top-0 z-10 backdrop-blur-md">
      <div className="flex items-center gap-3">
        <div className={`p-1.5 rounded-lg ${isWinner ? "bg-purple-500" : "bg-white/5"}`}>
          <Bot size={16} className={isWinner ? "text-white" : "text-gray-400"} />
        </div>
        <div>
          <span className={`text-xs font-bold tracking-tight block ${isWinner ? "text-white" : "text-gray-400"}`}>
            {title}
          </span>
          <span className="text-[10px] text-gray-600">{subtitle}</span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-[10px] font-mono text-gray-500">{score}/10</span>
        {isWinner && (
          <div className="flex items-center gap-1.5 bg-purple-500/20 px-2.5 py-1 rounded-full border border-purple-500/30">
            <Trophy size={12} className="text-purple-400" />
            <span className="text-[9px] font-black text-purple-300 uppercase">Winner</span>
          </div>
        )}
      </div>
    </div>

    <div
      data-lenis-prevent-wheel
      className="p-6 overflow-y-auto max-h-[500px] min-h-0 scrollbar-thin custom-scrollbar"
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={MarkdownConfig}>
        {content}
      </ReactMarkdown>
    </div>

    {showVoteButton && (
      <div className="p-4 border-t border-white/5 bg-white/[0.01]">
        <button
          onClick={onSelect}
          disabled={disabled}
          className="w-full py-3 bg-white hover:bg-gray-100 text-black text-xs font-black uppercase tracking-widest rounded-xl transition-all active:scale-[0.98] disabled:opacity-50"
        >
          Vote for {title}
        </button>
      </div>
    )}
  </motion.div>
);

const BattlePage: React.FC = () => {
  const { battles, loading, createBattle, judgeBattle } = useBattleContext();
  const { user } = useAuth();

  const [input, setInput] = useState("");
  const [userVote, setUserVote] = useState<"A" | "B" | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVoting, setIsVoting] = useState(false);
  const [activeBattleId, setActiveBattleId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const activeBattle = useMemo(
    () => battles.find((b) => b._id === activeBattleId) ?? null,
    [battles, activeBattleId]
  );

  const aiWinner = activeBattle ? getAiWinner(activeBattle) : null;
  const displayWinner = userVote ?? aiWinner;

  const userInitial = useMemo(() => {
    if (!user) return "U";
    const name = user.name || user.email || "U";
    return name.trim().charAt(0).toUpperCase();
  }, [user]);

  const scrollToBottom = (behavior: ScrollBehavior = "smooth") => {
    bottomRef.current?.scrollIntoView({ behavior });
  };

  useEffect(() => {
    if (activeBattle || isSubmitting || userVote) {
      scrollToBottom();
    }
  }, [activeBattle, isSubmitting, userVote]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const isAtBottom = target.scrollHeight - target.scrollTop <= target.clientHeight + 150;
    setShowScrollButton(!isAtBottom);
  };

  const selectBattle = (battle: Battle) => {
    setActiveBattleId(battle._id);
    setUserVote(null);
    setError(null);
  };

  const startNewBattle = () => {
    setActiveBattleId(null);
    setUserVote(null);
    setError(null);
  };

  const handleSend = async () => {
    if (!input.trim() || isSubmitting) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const res = await createBattle(input.trim());
      if (res?.success && res.battle) {
        setActiveBattleId(res.battle._id);
        setUserVote(null);
        setInput("");
      } else {
        setError("Failed to create battle. Please try again.");
      }
    } catch {
      setError("Something went wrong while creating the battle.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVote = async (winner: "A" | "B") => {
    if (!activeBattle || isVoting) return;

    setIsVoting(true);
    setError(null);

    try {
      const res = await judgeBattle(activeBattle._id, winner);
      if (res?.success) {
        setUserVote(winner);
      } else {
        setError("Failed to record your vote.");
      }
    } catch {
      setError("Something went wrong while submitting your vote.");
    } finally {
      setIsVoting(false);
    }
  };

  return (
    <div className="flex h-screen w-full bg-[#070707] text-gray-200 overflow-hidden font-sans">
      <aside className="w-80 bg-[#0a0a0a] border-r border-white/5 flex flex-col min-h-0 hidden lg:flex shrink-0">
        <div className="p-6 border-b border-white/5">
          <button
            onClick={startNewBattle}
            className="w-full flex items-center justify-center gap-2 p-3.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl transition-all group shadow-sm"
          >
            <Plus size={18} className="group-hover:rotate-90 transition-transform duration-300" />
            <span className="font-semibold text-sm">Start New Battle</span>
          </button>
        </div>

        <div
          data-lenis-prevent-wheel
          className="flex-1 min-h-0 overflow-y-auto p-4 space-y-2 scrollbar-hide"
        >
          <p className="text-[10px] uppercase tracking-[0.2em] text-white/30 font-bold mb-4 px-3">Recent Battles</p>
          {battles.length === 0 && !loading && (
            <p className="text-xs text-gray-600 px-3">No battles yet. Start one below.</p>
          )}
          {battles.map((b) => (
            <button
              key={b._id}
              onClick={() => selectBattle(b)}
              className={`w-full text-left p-4 rounded-2xl text-[13px] transition-all truncate border ${
                activeBattleId === b._id
                  ? "bg-white/5 border-white/10 text-white shadow-inner"
                  : "border-transparent text-gray-500 hover:bg-white/[0.02]"
              }`}
            >
              {b.problem}
            </button>
          ))}
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 min-h-0 relative">
        <header className="h-20 flex shrink-0 items-center justify-between px-8 border-b border-white/5 backdrop-blur-xl bg-[#070707]/80 z-30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-tr from-purple-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/20">
              <Sparkles size={20} className="text-white fill-white/20" />
            </div>
            <div>
              <h1 className="font-bold tracking-tight text-white leading-none">AI Arena</h1>
              <span className="text-[10px] text-gray-500 font-mono tracking-widest uppercase">Benchmarking Engine</span>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-full border border-white/5">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">System Online</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-neutral-800 flex items-center justify-center text-xs font-bold border border-white/10 text-white">
              {userInitial}
            </div>
          </div>
        </header>

        <div className="relative flex-1 min-h-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-12 bg-gradient-to-b from-[#070707] to-transparent z-20 pointer-events-none" />

          <div
            ref={scrollRef}
            data-lenis-prevent-wheel
            onScroll={handleScroll}
            className="h-full min-h-0 overflow-y-auto overscroll-y-contain scroll-smooth pt-12 pb-56 px-6 custom-scrollbar"
          >
            <div className="max-w-5xl mx-auto">
              {error && (
                <div className="mb-6 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-sm">
                  {error}
                </div>
              )}

              <AnimatePresence mode="wait">
                {activeBattle ? (
                  <motion.div
                    key={activeBattle._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-12"
                  >
                    <div className="flex justify-end items-start gap-4">
                      <div className="bg-neutral-900 border border-white/10 px-6 py-4 rounded-[2rem] rounded-tr-sm max-w-2xl shadow-2xl">
                        <p className="text-gray-200 text-sm leading-relaxed">{activeBattle.problem}</p>
                      </div>
                      <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center shrink-0 border border-white/10">
                        <User size={20} className="text-gray-400" />
                      </div>
                    </div>

                    <div className="relative py-4">
                      <div className="absolute inset-0 flex items-center">
                        <motion.div className="w-full border-t border-white/5" />
                      </div>
                      <div className="relative flex justify-center">
                        <div className="bg-[#070707] px-6 py-2 flex flex-col items-center">
                          <span className="text-[10px] font-black italic tracking-[0.3em] text-white/20">COMPARISON MODE</span>
                          <Scale size={16} className="text-white/10 mt-1" />
                        </div>
                      </div>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-8 items-start">
                      <SolutionCard
                        title="Model Alpha"
                        subtitle="Mistral"
                        score={activeBattle.solution_1_score}
                        content={activeBattle.solution_1}
                        isWinner={displayWinner === "A"}
                        onSelect={() => handleVote("A")}
                        showVoteButton={!userVote}
                        disabled={isVoting || isSubmitting}
                      />
                      <SolutionCard
                        title="Model Beta"
                        subtitle="Cohere"
                        score={activeBattle.solution_2_score}
                        content={activeBattle.solution_2}
                        isWinner={displayWinner === "B"}
                        onSelect={() => handleVote("B")}
                        showVoteButton={!userVote}
                        disabled={isVoting || isSubmitting}
                      />
                    </div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-[#0f0f0f] border border-white/5 rounded-[2.5rem] p-10 relative overflow-hidden group shadow-2xl"
                    >
                      <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
                        <Scale size={120} />
                      </div>
                      <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-purple-500/20 rounded-lg">
                          <Brain size={20} className="text-purple-400" />
                        </div>
                        <div>
                          <h3 className="font-bold uppercase tracking-widest text-xs text-purple-400">Judge Verdict</h3>
                          {userVote && (
                            <p className="text-[10px] text-gray-500 mt-0.5">
                              Your vote: {userVote === "A" ? "Mistral" : "Cohere"}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="prose prose-invert max-w-none">
                        <ReactMarkdown remarkPlugins={[remarkGfm]} components={MarkdownConfig}>
                          {buildJudgeVerdict(activeBattle)}
                        </ReactMarkdown>
                      </div>
                    </motion.div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="h-[50vh] flex flex-col items-center justify-center text-center"
                  >
                    <div className="w-20 h-20 bg-white/[0.02] border border-white/5 rounded-3xl flex items-center justify-center mb-8 rotate-3 transition-transform hover:rotate-0">
                      <Brain size={40} className="text-white/20" />
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-3 tracking-tight">The Arena is Ready</h2>
                    <p className="text-gray-500 max-w-sm leading-relaxed">
                      Submit a coding challenge or logical puzzle to see Mistral and Cohere battle for supremacy.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {isSubmitting && (
                <div className="flex justify-center py-12">
                  <div className="flex items-center gap-4 px-6 py-3 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-md">
                    <div className="flex gap-1">
                      <span className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                      <span className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                      <span className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce" />
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-widest text-gray-400">Models are Thinking</span>
                  </div>
                </div>
              )}
              <div ref={bottomRef} className="h-1" />
            </div>
          </div>

          {showScrollButton && (
            <button
              onClick={() => scrollToBottom()}
              className="absolute bottom-36 right-10 p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 rounded-full text-white transition-all z-40"
            >
              <ChevronDown size={20} />
            </button>
          )}

          <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#070707] to-transparent z-20 pointer-events-none" />
        </div>

        <div className="absolute bottom-0 left-0 w-full p-8 z-50 pointer-events-none">
          <div className="max-w-4xl mx-auto pointer-events-auto">
            <div className="relative group bg-[#141414]/90 backdrop-blur-2xl rounded-[2.5rem] border border-white/10 p-2 shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-all focus-within:border-purple-500/50">
              <div className="flex items-end gap-2">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask the models something..."
                  rows={1}
                  disabled={isSubmitting}
                  className="flex-1 bg-transparent outline-none px-6 py-4 resize-none max-h-[200px] text-sm text-white placeholder:text-gray-600 leading-relaxed disabled:opacity-50"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                />
                <button
                  onClick={handleSend}
                  disabled={isSubmitting || !input.trim()}
                  className="mb-1.5 mr-1.5 p-4 bg-white disabled:bg-white/10 text-black disabled:text-white/20 rounded-2xl transition-all hover:scale-[1.03] active:scale-[0.95] shadow-xl flex items-center justify-center"
                >
                  {isSubmitting ? <RotateCcw size={20} className="animate-spin" /> : <ArrowUp size={20} strokeWidth={3} />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        .scrollbar-thin::-webkit-scrollbar { width: 4px; }
        .scrollbar-thin::-webkit-scrollbar-track { background: transparent; }
        .scrollbar-thin::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default BattlePage;
