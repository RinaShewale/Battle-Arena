import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Paperclip, Image as ImageIcon, Globe, Mic, ArrowUp, X, Upload, Search, Loader2, FileCode } from "lucide-react";
import { webSearchAPI } from "../../services/battle.api";
import type { ToolPopup } from "../../types/battleMessage";

// ... (Rest of the component logic remains the same)
const getSpeechRecognition = (): any => {
  const win = window as any;
  return win.SpeechRecognition || win.webkitSpeechRecognition || null;
};

const colorMap = {
  purple: { bg: "bg-purple-500/10", border: "border-purple-500/20", text: "text-purple-400", icon: "text-purple-300" },
  blue: { bg: "bg-blue-500/10", border: "border-blue-500/20", text: "text-blue-400", icon: "text-blue-300" },
  green: { bg: "bg-green-500/10", border: "border-green-500/20", text: "text-green-400", icon: "text-green-300" },
};

export const BattleInputToolbar = ({
  input, setInput, isSubmitting, onSend,
  selectedFile, setSelectedFile, selectedImage, setSelectedImage,
  webSearchResult, setWebSearchResult
}: any) => {
  const [activePopup, setActivePopup] = useState<ToolPopup>(null);
  const [webQuery, setWebQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const toolbarRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const canSend = !isSubmitting && (input.trim() || selectedFile || selectedImage || webSearchResult);

  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (toolbarRef.current && !toolbarRef.current.contains(e.target as Node)) setActivePopup(null);
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  const handleVoice = () => {
    const SR = getSpeechRecognition();
    if (!SR) return alert("Browser not supported");
    const rec = new SR();
    rec.onstart = () => setIsListening(true);
    rec.onresult = (e: any) => setInput(e.results[0][0].transcript);
    rec.onend = () => setIsListening(false);
    rec.start();
  };

  async function handleWebSearch() {
    setIsSearching(true);
    const res = await webSearchAPI(webQuery, true);
    if (res?.success) setWebSearchResult(res.result);
    setIsSearching(false);
    setActivePopup(null);
  }

  async function handleUpload(e: any, type: 'file' | 'image') {
    const file = e.target.files?.[0];
    if (!file) return;
    if (type === 'file') {
      setSelectedFile({ name: file.name, content: await file.text() });
    } else {
      const rd = new FileReader();
      rd.onload = () => setSelectedImage({ name: file.name, dataUrl: rd.result as string });
      rd.readAsDataURL(file);
    }
    setActivePopup(null);
  }

  return (
    <div ref={toolbarRef} className="relative w-full max-w-4xl mx-auto px-2 sm:px-4 pb-4">
      <AnimatePresence>
        {activePopup && (
          <motion.div 
            initial={{ opacity: 0, y: 10, scale: 0.95 }} 
            animate={{ opacity: 1, y: 0, scale: 1 }} 
            exit={{ opacity: 0, y: 10, scale: 0.95 }} 
            className="absolute bottom-[calc(100%+0.5rem)] left-2 right-2 sm:left-0 sm:right-0 z-50"
          >
            <div className="bg-[#0f0f0f]/95 backdrop-blur-2xl border border-white/10 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-3xl">
              {activePopup === 'web' ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Search className="text-green-400" size={16} />
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-white">Neural Web Search</h4>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input 
                      autoFocus 
                      className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-green-500/50 transition-colors" 
                      placeholder="Deep search..." 
                      value={webQuery} 
                      onChange={e => setWebQuery(e.target.value)} 
                      onKeyDown={e => e.key === 'Enter' && !isSearching && handleWebSearch()} 
                    />
                    <button 
                      onClick={handleWebSearch} 
                      disabled={isSearching || !webQuery.trim()} 
                      className="bg-green-600 h-12 sm:h-auto px-6 rounded-xl text-xs font-bold text-white disabled:opacity-50 transition-colors flex items-center justify-center"
                    >
                      {isSearching ? <Loader2 className="animate-spin" size={18} /> : "Search"}
                    </button>
                  </div>
                </div>
              ) : (
                <div 
                  onClick={() => activePopup === 'file' ? fileInputRef.current?.click() : imageInputRef.current?.click()} 
                  className="border-2 border-dashed border-white/10 hover:border-purple-500/30 rounded-2xl p-6 sm:p-10 flex flex-col items-center justify-center cursor-pointer transition-all group"
                >
                  <Upload className="mb-3 sm:mb-4 text-gray-500 group-hover:text-purple-400 transition-colors" />
                  <p className="text-[10px] font-black uppercase text-white tracking-widest text-center">
                    Select {activePopup} Input
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-[#0a0a0a]/90 backdrop-blur-3xl border border-white/10 rounded-[1.5rem] sm:rounded-[2.5rem] p-1.5 sm:p-2 shadow-2xl transition-all focus-within:border-purple-500/30">
        {(selectedFile || selectedImage || webSearchResult) && (
          <div className="flex flex-wrap gap-2 px-3 pt-2 pb-1">
            {selectedFile && <Chip icon={FileCode} label={selectedFile.name} color="purple" onClear={() => setSelectedFile(null)} />}
            {selectedImage && <Chip icon={ImageIcon} label={selectedImage.name} color="blue" onClear={() => setSelectedImage(null)} />}
            {webSearchResult && <Chip icon={Globe} label="Web Context" color="green" onClear={() => setWebSearchResult(null)} />}
          </div>
        )}

        <div className="flex items-end gap-1">
          <div className="flex items-center">
            <ToolIcon icon={Paperclip} onClick={() => setActivePopup(activePopup === 'file' ? null : 'file')} active={activePopup === 'file'} />
            <ToolIcon icon={ImageIcon} onClick={() => setActivePopup(activePopup === 'image' ? null : 'image')} active={activePopup === 'image'} />
            <ToolIcon icon={Globe} onClick={() => setActivePopup(activePopup === 'web' ? null : 'web')} active={activePopup === 'web'} />
          </div>
          
          <textarea 
            rows={1} 
            value={input} 
            onChange={(e) => setInput(e.target.value)} 
            placeholder="Prompt..." 
            className="flex-1 bg-transparent border-none focus:ring-0 text-sm py-3 px-1 sm:px-3 resize-none max-h-40 min-h-[44px] scrollbar-hide text-gray-200 placeholder:text-gray-600 outline-none" 
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), onSend())} 
          />

          <div className="flex items-center gap-1 pr-1 sm:pr-2">
            <button 
              onClick={handleVoice} 
              className={`p-2.5 sm:p-3 rounded-xl sm:rounded-2xl hover:bg-white/5 transition-colors ${isListening ? "text-red-500 animate-pulse" : "text-gray-500"}`}
            >
              <Mic size={18} className="sm:w-5 sm:h-5" />
            </button>
            
            <button 
              onClick={onSend} 
              disabled={!canSend} 
              className={`p-3 sm:p-3.5 rounded-xl sm:rounded-2xl transition-all ${canSend ? "bg-purple-600 text-white shadow-lg shadow-purple-500/30" : "bg-white/5 text-white/20 cursor-not-allowed"}`}
            >
              <ArrowUp size={18} className="sm:w-5 sm:h-5" strokeWidth={3} />
            </button>
          </div>
        </div>
      </div>
      
      <input type="file" ref={fileInputRef} className="hidden" onChange={e => handleUpload(e, 'file')} />
      <input type="file" ref={imageInputRef} className="hidden" accept="image/*" onChange={e => handleUpload(e, 'image')} />
    </div>
  );
};

const ToolIcon = ({ icon: Icon, onClick, active }: any) => (
  <button 
    onClick={onClick} 
    className={`p-2.5 sm:p-3 rounded-xl transition-all ${active ? "bg-purple-500/20 text-purple-400" : "text-gray-500 hover:bg-white/5 hover:text-gray-300"}`}
  >
    <Icon size={18} className="sm:w-[19px] sm:h-[19px]" />
  </button>
);

const Chip = ({ icon: Icon, label, color, onClear }: { icon: any, label: string, color: 'purple' | 'blue' | 'green', onClear: () => void }) => {
  const styles = colorMap[color];
  return (
    <div className={`flex items-center gap-1.5 sm:gap-2 ${styles.bg} border ${styles.border} px-2 sm:px-3 py-1 sm:py-1.5 rounded-full`}>
      <Icon size={10} className={styles.icon} />
      <span className={`text-[9px] sm:text-[10px] font-mono ${styles.text} truncate max-w-[80px] sm:max-w-[120px]`}>{label}</span>
      <button onClick={onClear} className={`${styles.text} hover:text-white transition-colors`}>
        <X size={10} />
      </button>
    </div>
  );
};