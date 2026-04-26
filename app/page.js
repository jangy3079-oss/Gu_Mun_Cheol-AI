"use client";

import { useState } from "react";
import FileUploader from "@/components/FileUploader";
import AnalysisLoader from "@/components/AnalysisLoader";
import ResultDashboard from "@/components/ResultDashboard";
import { Gavel, Siren, BrainCircuit } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

import { analyzeWithGemini } from "@/lib/gemini-api";
export default function Home() {
  const [stage, setStage] = useState("upload"); // upload | analyze | result
  const [analysisResult, setAnalysisResult] = useState(null); // combined result

  const handleUpload = async (file) => {
    setStage("analyze");
    
    // 최소 6초의 멋진 로딩 애니메이션 보장
    const minLoaderTime = new Promise(resolve => setTimeout(resolve, 6000));
    
    try {
      const apiPromise = (async () => {
        const data = await analyzeWithGemini(file);
        const features = data.summary;
        const timeline = data.timeline;
        const analysis_text = data.analysis_text;
        const analysis_bubbles = data.analysis_bubbles;
        const analysis_conclusion = data.analysis_conclusion;
        
        const { runDLModel } = await import("@/lib/dl-model");
        const ratios = await runDLModel(features);
        
        // Inject the DL model's numerical ratios into Gemini's text placeholders
        // We forcefully reconstruct the conclusion string to ensure 100% consistency with the DL model
        const safe_conclusion = `최종 결론! 상대방 차량 과실 ${ratios.other}%, 블박차(본인) 과실 ${ratios.me}%로 봅니다!`;
        
        return { features, timeline, ratios, analysis_text, analysis_bubbles, analysis_conclusion: safe_conclusion };
      })();

      const [result] = await Promise.all([apiPromise, minLoaderTime]);
      
      setAnalysisResult(result);
      setStage("result");
    } catch (err) {
      console.error(err);
      await minLoaderTime;
      // Fallback just in case
      setAnalysisResult({
        features: {},
        timeline: [],
        ratios: { me: 50, other: 50 },
        analysis_text: "에러가 발생했습니다."
      });
      setStage("result");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-emerald-500/30 overflow-x-hidden">
      
      {/* Background Ambience */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-emerald-500/10 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-cyan-500/10 blur-[120px]" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 flex flex-col min-h-screen">
        
        {/* Header */}
        <header className="flex items-center justify-between py-6 mb-8 border-b border-slate-200/60">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setStage("upload")}>
             <div className="bg-emerald-50 p-2.5 rounded-xl border border-emerald-100">
               <Siren className="w-6 h-6 text-emerald-500" />
             </div>
             <div>
               <h1 className="text-2xl font-black tracking-tight text-slate-900 flex items-center gap-2">
                 구문철 <span className="text-emerald-600">AI</span>
               </h1>
               <p className="text-xs text-slate-500 font-medium">카톡 싸움 과실비율 초고속 판독기</p>
             </div>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/about">
              <button className="flex items-center gap-2 bg-white hover:bg-slate-50 px-4 py-2 rounded-lg text-sm font-semibold transition-colors border border-slate-200 shadow-sm text-slate-700">
                <BrainCircuit className="w-4 h-4 text-cyan-500" /> 프로젝트 & 모델 소개
              </button>
            </Link>
            <button className="hidden sm:flex items-center gap-2 bg-white hover:bg-slate-50 px-4 py-2 rounded-lg text-sm font-semibold transition-colors border border-slate-200 shadow-sm text-slate-700">
              <Gavel className="w-4 h-4 text-emerald-500" /> 법률 자문 연결
            </button>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col items-center justify-center py-10 w-full">
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
                  <h2 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-cyan-600">
                    카톡 기싸움의 승패를<br />AI가 가려드립니다
                  </h2>
                  <p className="text-lg text-slate-500 max-w-xl mx-auto">
                    Gemini 1.5 Pro와 4-Layer MLP 딥러닝 모델이 <br className="hidden md:block"/>단답 'ㅋ' 개수, 마침표 비율 등을 분석하여 과실을 증명합니다.
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
                <AnalysisLoader isDone={!!analysisResult} />
              </motion.div>
            )}

            {stage === "result" && analysisResult && (
              <motion.div 
                key="result" 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="w-full"
              >
                <ResultDashboard data={analysisResult} />
                
                <div className="mt-12 text-center pb-12">
                  <button 
                    onClick={() => {
                      setAnalysisResult(null);
                      setStage("upload");
                    }}
                    className="px-8 py-3 rounded-full bg-white hover:bg-slate-50 text-slate-800 font-semibold transition-all border border-slate-200 shadow-md"
                  >
                    새로운 카톡 싸움 분석하기
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
        
        {/* Footer */}
        <footer className="mt-auto py-6 text-center text-sm text-slate-400 border-t border-slate-200/60">
           &copy; 2026 구문철 AI Team. Powered by Next.js, Gemini API & TensorFlow.js.<br/>
           *본 AI의 판독 결과는 법적 효력을 갖는 확정적 자료가 아닙니다.
        </footer>
      </div>
    </div>
  );
}
