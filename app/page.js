"use client";

import { useState } from "react";
import FileUploader from "@/components/FileUploader";
import AnalysisLoader from "@/components/AnalysisLoader";
import ResultDashboard from "@/components/ResultDashboard";
import { Gavel, Siren } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const [stage, setStage] = useState("upload"); // upload | analyze | result

  const handleUpload = (file) => {
    // Once file is chosen, go to analysis step
    setStage("analyze");
  };

  const handleAnalyzeComplete = () => {
    // Once simulated loading is done, show result
    setStage("result");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 font-sans selection:bg-emerald-500/30">
      
      {/* Background Ambience */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-emerald-600/10 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-cyan-600/10 blur-[120px]" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 flex flex-col min-h-screen">
        
        {/* Header */}
        <header className="flex items-center justify-between py-6 mb-8 border-b border-white/5">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setStage("upload")}>
             <div className="bg-emerald-500/20 p-2.5 rounded-xl border border-emerald-500/30">
               <Siren className="w-6 h-6 text-emerald-400" />
             </div>
             <div>
               <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
                 구문철 <span className="text-emerald-500">AI</span>
               </h1>
               <p className="text-xs text-slate-400 font-medium">블랙박스 과실비율 초고속 판독기</p>
             </div>
          </div>
          <button className="hidden sm:flex items-center gap-2 bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-lg text-sm font-semibold transition-colors border border-slate-700 shadow-sm">
            <Gavel className="w-4 h-4 text-emerald-400" /> 법률 자문 연결
          </button>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col items-center justify-center py-10">
          <AnimatePresence mode="wait">
            {stage === "upload" && (
              <motion.div 
                key="upload" 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{ duration: 0.4 }}
                className="w-full flex flex-col items-center"
              >
                <div className="text-center mb-12 space-y-4">
                  <h2 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
                    사고 영상의 진실을<br />AI가 밝혀드립니다
                  </h2>
                  <p className="text-lg text-slate-400 max-w-xl mx-auto">
                    딥러닝 비전 분석 모델을 통해 억울한 사고의 과실을 숫자로 명확히 증명하세요.
                  </p>
                </div>
                <FileUploader onUpload={handleUpload} />
              </motion.div>
            )}

            {stage === "analyze" && (
              <motion.div 
                key="analyze" 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="w-full"
              >
                <AnalysisLoader onComplete={handleAnalyzeComplete} />
              </motion.div>
            )}

            {stage === "result" && (
              <motion.div 
                key="result" 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="w-full"
              >
                <ResultDashboard />
                
                <div className="mt-12 text-center">
                  <button 
                    onClick={() => setStage("upload")}
                    className="px-8 py-3 rounded-full bg-slate-800 hover:bg-slate-700 text-white font-semibold transition-all border border-slate-600 shadow-xl"
                  >
                    새로운 영상 판독하기
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
        
        {/* Footer */}
        <footer className="mt-auto py-6 text-center text-sm text-slate-500 border-t border-white/5">
           &copy; 2026 구문철 AI Team. Powered by Next.js & TensorFlow.js.<br/>
           *본 AI의 판독 결과는 법적 효력을 갖는 확정적 자료가 아닙니다.
        </footer>
      </div>
    </div>
  );
}
