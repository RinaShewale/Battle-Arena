import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MoreVertical, Pencil, Trash2, MessageSquare } from "lucide-react";
import { getBattleTitle, type Battle } from "../BattleContext";

interface Props {
  battle: Battle;
  isActive: boolean;
  isMenuOpen: boolean;      // Added
  onMenuToggle: () => void; // Added
  onMenuClose: () => void;  // Added
  onSelect: () => void;
  onRename: (id: string, title: string) => Promise<any>;
  onDelete: (id: string) => Promise<any>;
}

export const BattleSidebarItem = ({
  battle,
  isActive,
  isMenuOpen,
  onMenuToggle,
  onMenuClose,
  onSelect,
  onRename,
  onDelete,
}: Props) => {
  const [renaming, setRenaming] = useState(false);
  const [value, setValue] = useState(getBattleTitle(battle));

  const menuRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync value with battle title
  useEffect(() => {
    setValue(getBattleTitle(battle));
  }, [battle]);

  // Focus input when renaming
  useEffect(() => {
    if (renaming) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [renaming]);

  const handleRenameSubmit = async () => {
    const trimmed = value.trim();
    if (trimmed && trimmed !== getBattleTitle(battle)) {
      await onRename(battle._id, trimmed);
    } else {
      setValue(getBattleTitle(battle));
    }
    setRenaming(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleRenameSubmit();
    if (e.key === "Escape") {
      setValue(getBattleTitle(battle));
      setRenaming(false);
    }
  };

  return (
    <div
      className={`group relative rounded-xl transition-all duration-200 ${isActive
          ? "bg-purple-500/10 border border-purple-500/20 text-white"
          : "text-gray-500 hover:bg-white/5 hover:text-gray-200 border border-transparent"
        }`}
    >
      {renaming ? (
        <div className="flex items-center px-3 py-2">
          <input
            ref={inputRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onBlur={handleRenameSubmit}
            onKeyDown={handleKeyDown}
            className="w-full bg-white/10 outline-none border border-purple-500/50 px-2 py-1 text-xs rounded-lg text-white"
          />
        </div>
      ) : (
        <div className="flex items-center justify-between">
          <button
            onClick={onSelect}
            className="flex-1 flex items-center gap-3 px-3 py-3 text-[11px] text-left truncate font-medium tracking-tight"
          >
            <MessageSquare size={14} className={isActive ? "text-purple-400" : "text-gray-600"} />
            <span className="truncate">{getBattleTitle(battle)}</span>
          </button>

          <div ref={menuRef} className="relative pr-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onMenuToggle();
              }}
              className={`p-1.5 rounded-lg transition-all ${isMenuOpen ? "opacity-100 bg-white/10" : "opacity-0 group-hover:opacity-100"
                }`}
            >
              <MoreVertical size={14} />
            </button>

            <AnimatePresence>
              {isMenuOpen && (
                <>
                  {/* Backdrop to close menu when clicking anywhere else */}
                  <div className="fixed inset-0 z-40" onClick={(e) => { e.stopPropagation(); onMenuClose(); }} />

                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, x: 5 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="absolute right-0 mt-1 w-32 bg-[#141414] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50 backdrop-blur-xl"
                  >
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setRenaming(true);
                        onMenuClose();
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-[10px] uppercase font-bold hover:bg-white/5 transition-colors text-gray-300"
                    >
                      <Edit3 size={12} /> Rename
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(battle._id);
                        onMenuClose();
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-[10px] uppercase font-bold text-red-400 hover:bg-red-500/10 transition-colors"
                    >
                      <Trash2 size={12} /> Delete
                    </button>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
};

// Internal icon import fix
const Edit3 = ({ size, className }: { size: number, className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" /></svg>
);