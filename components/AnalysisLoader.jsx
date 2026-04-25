"use client";

import { motion } from "framer-motion";
import { MessageSquare, AlertTriangle, Cpu, Search } from "lucide-react";
import { useState, useEffect } from "react";

export default function AnalysisLoader({ onComplete }) {
  const [step, setStep] = useState(0);
  
  const steps = [
    { icon: MessageSquare, text: "카톡 텍스트 추출 중..." },
    { icon: Search, text: "읽씹 및 단답 비율 분석 중..." },
    { icon: AlertTriangle, text: "말투 및 수동 공격성 검사 중..." },
    { icon: Cpu, text: "최종 과실 판독 보고서 생성 중..." }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setStep((prev) => {
        if (prev === steps.length - 1) {
          clearInterval(timer);
          setTimeout(onComplete, 1000);
          return prev;
        }
        return prev + 1;
      });
    }, 1500);
    
    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div className="w-full max-w-lg mx-auto flex flex-col items-center justify-center p-8 bg-white rounded-3xl border border-slate-200 shadow-xl">
      <div className="relative w-32 h-32 mb-8 flex items-center justify-center">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 rounded-full border-t-2 border-r-2 border-emerald-500 opacity-70"
        />
        <motion.div 
          animate={{ rotate: -360 }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          className="absolute inset-2 rounded-full border-b-2 border-l-2 border-cyan-500 opacity-50"
        />
        <div className="bg-slate-50 rounded-full p-6 shadow-md border border-slate-100">
          <Cpu className="w-10 h-10 text-emerald-500" />
        </div>
      </div>

      <div className="space-y-4 w-full">
        {steps.map((s, idx) => {
          const Icon = s.icon;
          const isActive = idx === step;
          const isPast = idx < step;
          
          return (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: isPast || isActive ? 1 : 0.3, x: 0 }}
              className={`flex items-center gap-4 p-4 rounded-xl transition-all duration-300 ${isActive ? 'bg-emerald-50 border border-emerald-200' : 'bg-transparent'}`}
            >
              <div className={`p-2 rounded-lg ${isActive ? 'bg-emerald-500 text-white shadow-md' : isPast ? 'bg-slate-100 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                <Icon className="w-5 h-5" />
              </div>
              <span className={`font-medium ${isActive ? 'text-emerald-700 font-bold' : isPast ? 'text-slate-600' : 'text-slate-400'}`}>
                {s.text}
              </span>
              {isActive && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className="ml-auto w-2 h-2 rounded-full bg-emerald-500"
                />
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
