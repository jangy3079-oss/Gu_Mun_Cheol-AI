"use client";

import { motion } from "framer-motion";
import { MessageSquare, AlertTriangle, Cpu, Search, Siren } from "lucide-react";
import { useState, useEffect } from "react";

export default function AnalysisLoader({ onComplete }) {
  const [step, setStep] = useState(0);
  
  const steps = [
    { icon: Search, text: "카톡 블랙박스 영상(대화) 돌려보는 중..." },
    { icon: AlertTriangle, text: "후방 추돌(읽씹) 및 급발진(폭언) 감지 중..." },
    { icon: MessageSquare, text: "수동 공격성 및 단답 지수 정밀 판독 중..." },
    { icon: Cpu, text: "종합 과실 판독 보고서 최종 인쇄 중..." }
  ];

  const funMessages = [
    "아니, 여기서 이렇게 답장을 안 한다고?",
    "자, 대화 내용 리플레이 들어갑니다!",
    "이건 명백한 고의성이 보이는데요?",
    "상대방 차주(본인)님, 마음이 너무 급해요!",
    "아이고, 말투가 아주 위험한 운전입니다.",
    "이 부분은 100대 0 나올 수도 있겠는데요?",
    "블박차(제보자)님도 잘한 건 없어요!",
    "과실 비율을 현미경으로 들여다보고 있습니다."
  ];

  const [currentMessage, setCurrentMessage] = useState(funMessages[0]);

  useEffect(() => {
    const msgInterval = setInterval(() => {
      setCurrentMessage(funMessages[Math.floor(Math.random() * funMessages.length)]);
    }, 2000);
    return () => clearInterval(msgInterval);
  }, []);

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
        <div className="bg-slate-900 rounded-full p-6 shadow-2xl border-4 border-slate-800">
          <motion.div
            animate={{ opacity: [1, 0.4, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <Siren className="w-10 h-10 text-rose-500" />
          </motion.div>
        </div>
        <div className="absolute -top-4 -right-4 bg-rose-500 text-white text-[10px] font-bold px-2 py-1 rounded-full animate-pulse">
          LIVE REPLAY
        </div>
      </div>

      <div className="text-center mb-8 h-8">
        <motion.p 
          key={currentMessage}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-slate-600 font-bold italic"
        >
          "{currentMessage}"
        </motion.p>
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
