"use client";

import Link from "next/link";
import { ArrowLeft, BrainCircuit, Info, Layers, Zap } from "lucide-react";
import { motion } from "framer-motion";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-emerald-500/30">
      {/* Background Ambience */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-emerald-500/10 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-cyan-500/10 blur-[120px]" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-4xl">
        <header className="flex items-center gap-4 mb-12">
          <Link href="/">
            <div className="p-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors shadow-sm cursor-pointer flex items-center justify-center">
              <ArrowLeft className="w-5 h-5 text-slate-600" />
            </div>
          </Link>
          <div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900 flex items-center gap-2">
              프로젝트 및 모델 소개
            </h1>
          </div>
        </header>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-12"
        >
          {/* Project Description Section */}
          <section className="bg-white p-8 rounded-3xl border border-slate-200/60 shadow-xl shadow-slate-200/50 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <Info className="w-48 h-48" />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-emerald-100 p-2.5 rounded-xl">
                  <Info className="w-6 h-6 text-emerald-600" />
                </div>
                <h2 className="text-2xl font-bold">프로젝트 소개: 구문철 AI</h2>
              </div>
              <p className="text-slate-600 leading-relaxed text-lg mb-4">
                <strong>구문철 AI</strong>는 카카오톡 대화 내용 캡처본을 분석하여, 누가 더 잘못했는지 과실 비율을 유쾌하게 판독해주는 AI 서비스입니다. 
                단순히 텍스트의 맥락만을 파악하는 것을 넘어, 한국인 특유의 <strong>기싸움 패턴('ㅋ'의 개수, 마침표 사용 여부, 답장 시간 등)</strong>을 수치화하여 딥러닝 모델에 학습시켰습니다.
              </p>
              <p className="text-slate-600 leading-relaxed text-lg">
                최신 LLM(Gemini 1.5 Pro)과 경량화된 Neural Network(TensorFlow.js)를 결합하여, 브라우저 상에서 즉각적이고 재미있는 결과를 제공합니다.
              </p>
            </div>
          </section>

          {/* Model Architecture Section */}
          <section className="bg-white p-8 rounded-3xl border border-slate-200/60 shadow-xl shadow-slate-200/50">
            <div className="flex items-center gap-3 mb-8">
              <div className="bg-cyan-100 p-2.5 rounded-xl">
                <BrainCircuit className="w-6 h-6 text-cyan-600" />
              </div>
              <h2 className="text-2xl font-bold">딥러닝 모델 구조 (4-Layer MLP)</h2>
            </div>
            
            <p className="text-slate-600 mb-8">
              입력된 대화의 텍스트 특징(Features)을 추출한 뒤, TensorFlow.js 기반의 <strong>4계층 다층 퍼셉트론(MLP)</strong>을 통과하여 최종 과실 비율(0~100%)을 예측합니다.
            </p>

            {/* Visual Diagram of the Model */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 md:p-10 overflow-x-auto">
              <div className="min-w-[600px] flex justify-between items-center gap-4">
                
                {/* Input Layer */}
                <div className="flex flex-col items-center gap-2">
                  <div className="bg-white border-2 border-slate-300 rounded-xl p-4 w-40 shadow-sm text-center">
                    <Layers className="w-6 h-6 text-slate-500 mx-auto mb-2" />
                    <h3 className="font-bold text-sm text-slate-800">Input Layer</h3>
                    <p className="text-xs text-slate-500 mt-1">Feature Vector<br/>(10차원)</p>
                  </div>
                  <div className="text-xs text-slate-400 space-y-1 text-center mt-2">
                    <p>'ㅋ' 빈도</p>
                    <p>마침표 빈도</p>
                    <p>평균 답장 시간</p>
                    <p>...</p>
                  </div>
                </div>

                <div className="flex-1 border-t-2 border-dashed border-slate-300 relative">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-50 px-2 text-xs text-slate-400 font-mono">ReLU</div>
                </div>

                {/* Hidden Layer 1 */}
                <div className="flex flex-col items-center gap-2">
                  <div className="bg-emerald-50 border-2 border-emerald-200 rounded-xl p-4 w-32 shadow-sm text-center">
                    <Zap className="w-6 h-6 text-emerald-500 mx-auto mb-2" />
                    <h3 className="font-bold text-sm text-emerald-800">Dense 1</h3>
                    <p className="text-xs text-emerald-600 mt-1">64 Units</p>
                  </div>
                </div>

                <div className="flex-1 border-t-2 border-dashed border-slate-300 relative">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-50 px-2 text-xs text-slate-400 font-mono">ReLU</div>
                </div>

                {/* Hidden Layer 2 */}
                <div className="flex flex-col items-center gap-2">
                  <div className="bg-emerald-50 border-2 border-emerald-200 rounded-xl p-4 w-32 shadow-sm text-center">
                    <Zap className="w-6 h-6 text-emerald-500 mx-auto mb-2" />
                    <h3 className="font-bold text-sm text-emerald-800">Dense 2</h3>
                    <p className="text-xs text-emerald-600 mt-1">32 Units</p>
                  </div>
                </div>

                <div className="flex-1 border-t-2 border-dashed border-slate-300 relative">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-50 px-2 text-xs text-slate-400 font-mono">Softmax</div>
                </div>

                {/* Output Layer */}
                <div className="flex flex-col items-center gap-2">
                  <div className="bg-cyan-50 border-2 border-cyan-200 rounded-xl p-4 w-40 shadow-sm text-center">
                    <BrainCircuit className="w-6 h-6 text-cyan-500 mx-auto mb-2" />
                    <h3 className="font-bold text-sm text-cyan-800">Output Layer</h3>
                    <p className="text-xs text-cyan-600 mt-1">2 Units</p>
                  </div>
                  <div className="text-xs font-bold text-cyan-700 space-y-1 text-center mt-2 flex gap-4">
                    <span className="bg-white px-2 py-1 rounded shadow-sm">본인 과실 (%)</span>
                    <span className="bg-white px-2 py-1 rounded shadow-sm">상대 과실 (%)</span>
                  </div>
                </div>

              </div>
            </div>
            
          </section>
        </motion.div>
      </div>
    </div>
  );
}
