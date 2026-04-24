"use client";

import { motion } from "framer-motion";
import { AlertCircle, Zap, ShieldAlert, BadgeInfo, Scale, Copy } from "lucide-react";
import FaultChart from "./FaultChart";

export default function ResultDashboard() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6"
    >
      {/* Overview Card */}
      <div className="md:col-span-2 bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <Scale className="text-emerald-400 w-7 h-7" />
            AI 과실 판독 결과
          </h2>
          <span className="px-4 py-1.5 rounded-full bg-emerald-500/20 text-emerald-400 font-semibold text-sm border border-emerald-500/30">
            신뢰도 94.2%
          </span>
        </div>

        <div className="flex flex-col md:flex-row gap-6 items-center">
          <div className="flex-1 w-full relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-slate-900 to-transparent rounded-2xl z-10 pointers-events-none" />
            <img 
              src="https://images.unsplash.com/photo-1542282088-fe8426682b8f?q=80&w=640&auto=format&fit=crop" 
              alt="Accident Analysis Frame" 
              className="w-full h-48 object-cover rounded-2xl border border-slate-700"
            />
            <div className="absolute bottom-3 left-3 bg-red-500/90 backdrop-blur text-white text-xs font-bold px-3 py-1 rounded-full z-20">
              충돌 지점 감지
            </div>
          </div>
          
          <div className="flex-1 w-full space-y-4">
            <h3 className="text-xl font-bold flex items-center gap-2 text-slate-200">
              <Zap className="text-amber-400 w-5 h-5" /> 핵심 요약
            </h3>
            <p className="text-slate-400 leading-relaxed text-sm">
              상대 차량(B)이 신호 위반 후 교차로에 진입한 것이 주 원인으로 분석됩니다. 다만, 본인 차량(A)도 교차로 진입 시 서행 의무를 일부 소홀히 한 정황이 감지되었습니다.
            </p>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/80 border border-slate-700">
              <ShieldAlert className="w-5 h-5 text-red-400 flex-shrink-0" />
              <p className="text-sm text-slate-300 font-medium">유사 판례: 2019다23145 (과실 20:80)</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Card */}
      <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col items-center justify-center space-y-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <AlertCircle className="w-32 h-32 text-slate-300" />
        </div>
        <h3 className="text-lg font-bold text-slate-300 w-full text-center z-10">예상 과실 비율</h3>
        <div className="flex items-end justify-center gap-3 z-10">
          <div className="text-center">
            <span className="text-5xl font-black text-rose-500">20</span>
            <p className="text-xs text-rose-400 mt-1 font-semibold">본인 (A)</p>
          </div>
          <span className="text-3xl font-black text-slate-600 mb-5">:</span>
          <div className="text-center">
            <span className="text-5xl font-black text-emerald-500">80</span>
            <p className="text-xs text-emerald-400 mt-1 font-semibold">상대방 (B)</p>
          </div>
        </div>
        
        <div className="w-full z-10 mt-4">
          <FaultChart />
        </div>

        <button className="flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 hover:text-white transition-colors text-slate-300 font-medium w-full justify-center mt-2 z-10 border border-slate-700">
          <Copy className="w-4 h-4" /> 결과 리포트 복사
        </button>
      </div>

      {/* Detail Breakdown */}
      <div className="md:col-span-3 bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 shadow-xl">
        <h3 className="text-xl font-bold flex items-center gap-2 text-slate-200 mb-6">
          <BadgeInfo className="text-cyan-400 w-6 h-6" /> AI 상세 분석 로그
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           {[
             { time: "00:03.2", desc: "본인(A) 교차로 진입, 속도 약 42km/h (제한 50km/h 준수)" },
             { time: "00:03.8", desc: "우측 측면에서 상대방(B) 차량 시야에 포착됨" },
             { time: "00:04.1", desc: "상대방(B) 신호 위반 후 고속 진입 확인 (추정속도 70km/h+)" },
             { time: "00:04.5", desc: "충돌 발생. A차량 전면 범퍼와 B차량 좌측 측면 타격" }
           ].map((log, i) => (
             <div key={i} className="flex gap-4 p-4 rounded-2xl bg-slate-800/40 border border-slate-700/50">
               <span className="font-mono text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-1 rounded-lg h-fit">
                 {log.time}
               </span>
               <p className="text-slate-300 text-sm leading-relaxed">{log.desc}</p>
             </div>
           ))}
        </div>
      </div>
    </motion.div>
  );
}
