"use client";

import { motion } from "framer-motion";
import { Car, AlertTriangle, Cpu, Activity } from "lucide-react";
import { useState, useEffect } from "react";

export default function AnalysisLoader({ onComplete }) {
  const [step, setStep] = useState(0);
  
  const steps = [
    { icon: Car, text: "차량 및 객체 인식 중..." },
    { icon: Activity, text: "이동 경로 및 속도 분석 중..." },
    { icon: AlertTriangle, text: "충돌 시점 및 과실 비율 계산 중..." },
    { icon: Cpu, text: "최종 판독 보고서 생성 중..." }
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
    <div className="w-full max-w-lg mx-auto flex flex-col items-center justify-center p-8 bg-slate-900/50 backdrop-blur-xl rounded-3xl border border-slate-800 shadow-2xl">
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
        <div className="bg-slate-800 rounded-full p-6 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
          <Cpu className="w-10 h-10 text-emerald-400" />
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
              className={`flex items-center gap-4 p-4 rounded-xl transition-all duration-300 ${isActive ? 'bg-emerald-500/10 border border-emerald-500/30' : 'bg-transparent'}`}
            >
              <div className={`p-2 rounded-lg ${isActive ? 'bg-emerald-500 text-slate-900 shadow-[0_0_15px_rgba(16,185,129,0.5)]' : isPast ? 'bg-slate-800 text-emerald-500' : 'bg-slate-800 text-slate-500'}`}>
                <Icon className="w-5 h-5" />
              </div>
              <span className={`font-medium ${isActive ? 'text-emerald-400' : isPast ? 'text-slate-300' : 'text-slate-600'}`}>
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
