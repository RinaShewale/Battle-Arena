import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { AlertCircle, Terminal, Home } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-[#030303] flex items-center justify-center p-6 overflow-hidden">
      {/* Background Effect */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/10 via-[#030303] to-[#030303] -z-10" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center max-w-md w-full glass-panel p-12 rounded-[40px] border-white/5"
      >
        <div className="w-20 h-20 bg-red-500/10 border border-red-500/20 rounded-3xl flex items-center justify-center mx-auto mb-10 rotate-12">
          <AlertCircle className="w-10 h-10 text-red-500" />
        </div>
        
        <div className="font-mono text-xs text-blue-500 mb-4 uppercase tracking-[0.3em]">Error: 404_NULL_POINTER</div>
        <h1 className="text-6xl font-black text-white mb-6 italic tracking-tighter">LOST IN <br/> THE GRID.</h1>
        <p className="text-gray-500 mb-10 leading-relaxed">
          The requested coordinate does not exist in the Arena database. The Judge AI has terminated this session.
        </p>

        <div className="flex flex-col gap-4">
          <Link 
            to="/" 
            className="flex items-center justify-center gap-3 bg-white text-black py-4 rounded-full font-bold hover:scale-105 transition-all"
          >
            <Home className="w-4 h-4" /> REBOOT TO HOME
          </Link>
          <div className="flex items-center justify-center gap-2 text-[10px] font-mono text-gray-700">
             <Terminal className="w-3 h-3" /> TRACING ORIGIN... FAILED
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFoundPage;