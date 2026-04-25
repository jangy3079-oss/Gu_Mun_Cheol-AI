"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { AlertCircle, Zap, ShieldAlert, BadgeInfo, Scale, Copy } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from "recharts";
import FaultChart from "./FaultChart";

const FEATURE_META = {
  reply_delay_sec: { label: "답장 지연(초)", desc: "답장까지 걸린 시간" },
  read_without_reply_count: { label: "읽씹 횟수", desc: "읽고 답장 안 함" },
  reply_after_midnight: { label: "심야 답장 여부", desc: "00시~06시 답장" },
  single_kk_count: { label: "비웃음 지수", desc: "단일 'ㅋ' 사용 횟수" },
  multi_kk_ratio: { label: "진정성 지수", desc: "연타 'ㅋㅋㅋㅋ' 비율" },
  single_kk_ratio: { label: "비웃음 비중", desc: "전체 대화 대비 단일 'ㅋ' 비중" },
  period_at_end_ratio: { label: "단호함/냉정함 지수", desc: "문장 끝 마침표(.) 비율" },
  question_mark_count: { label: "대화 의지 지수", desc: "물음표(?) 사용 횟수" },
  ellipsis_count: { label: "답답함/회피 지수", desc: "말줄임표(...) 사용 횟수" },
  message_length_ratio: { label: "정성 비율", desc: "내 메시지 길이 비율" },
  caps_or_bold_count: { label: "분노/강조 지수", desc: "강조/대문자 사용 횟수" },
  single_char_reply_ratio: { label: "단답 지수", desc: "단답(ㅇㅇ, ㄴㄴ 등) 사용 비율" },
  conversation_ender_count: { label: "대화 단절 지수", desc: "대화 끊는 표현 사용 횟수" },
  double_message_ratio: { label: "조급함 지수", desc: "연속 통톡 비율" }
};

export default function ResultDashboard({ data }) {
  const [selectedFeature, setSelectedFeature] = useState("reply_delay_sec");

  if (!data) return null;

  const { timeline, ratios, analysis_bubbles, analysis_conclusion } = data;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-4xl mx-auto space-y-8 pb-12"
    >
      {/* User Message */}
      <div className="flex justify-end">
        <div className="max-w-[80%] bg-slate-100 text-slate-800 px-6 py-4 rounded-3xl rounded-tr-sm shadow-sm border border-slate-200">
          <p className="font-medium">업로드한 카톡 캡처본 분석해줘.</p>
        </div>
      </div>

      {/* AI Message */}
      <div className="flex justify-start gap-4">
        <div className="flex-shrink-0 mt-1">
          <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center shadow-md">
            <Scale className="w-6 h-6 text-white" />
          </div>
        </div>
        <div className="max-w-[90%] md:max-w-[85%] bg-white px-6 py-6 rounded-3xl rounded-tl-sm shadow-md border border-slate-200 space-y-8">
          
          {/* 1. Han Moon-chul Analysis Bubbles */}
          <div className="space-y-6">
            <h3 className="font-bold text-lg flex items-center gap-2 text-slate-800">
              <Zap className="w-5 h-5 text-amber-500" /> 구문철 AI의 블랙박스 분석
            </h3>
            
            <div className="space-y-6">
              {(analysis_bubbles || []).map((bubble, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="inline-block px-3 py-1 bg-slate-800 text-white text-xs font-bold rounded-md">
                    {bubble.time_step}
                  </div>
                  <div className="bg-slate-50 border-l-4 border-slate-300 p-3 rounded-r-lg text-sm text-slate-600 italic">
                    "{bubble.quote}"
                  </div>
                  <div className="bg-amber-50 text-amber-900 p-4 rounded-2xl rounded-tl-sm font-medium shadow-sm border border-amber-100">
                    {bubble.eval}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 p-5 bg-gradient-to-r from-slate-800 to-slate-900 text-white rounded-2xl shadow-md font-bold text-center text-lg">
              {analysis_conclusion || "분석 결과를 불러오지 못했습니다."}
            </div>
          </div>

          <div className="h-px w-full bg-slate-100" />

          {/* 2. Fault Chart (Pie) */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg flex items-center gap-2 text-slate-800">
              <AlertCircle className="w-5 h-5 text-rose-500" /> 최종 과실 비율 (본인 : 상대)
            </h3>
            <div className="flex flex-col md:flex-row items-center gap-6 bg-slate-50 p-6 rounded-2xl border border-slate-100">
              <div className="flex-1 w-full flex justify-center items-center gap-6">
                <div className="text-center">
                  <span className="text-6xl font-black text-rose-500">{ratios.me}</span>
                  <p className="text-sm text-slate-500 mt-1 font-semibold">본인</p>
                </div>
                <span className="text-4xl font-black text-slate-300 pb-5">:</span>
                <div className="text-center">
                  <span className="text-6xl font-black text-emerald-500">{ratios.other}</span>
                  <p className="text-sm text-slate-500 mt-1 font-semibold">상대방</p>
                </div>
              </div>
              <div className="h-40 w-full md:w-1/2 min-h-[160px] min-w-0 flex-shrink-0">
                <FaultChart data={ratios} />
              </div>
            </div>
          </div>

          <div className="h-px w-full bg-slate-100" />

          {/* 3. Timeline Graph */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg flex items-center gap-2 text-slate-800">
              <BadgeInfo className="w-5 h-5 text-cyan-500" /> 대화 흐름 분석 그래프
            </h3>
            
            {timeline && timeline.length > 0 ? (
              <div className="w-full space-y-6 min-w-0">
                <div className="h-[300px] w-full bg-white p-4 rounded-2xl border border-slate-100 shadow-sm min-h-[300px] min-w-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={timeline} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                      <XAxis dataKey="time_step" stroke="#94a3b8" tick={{ fill: '#64748b' }} axisLine={false} tickLine={false} />
                      <YAxis stroke="#94a3b8" tick={{ fill: '#64748b' }} width={40} axisLine={false} tickLine={false} />
                      <RechartsTooltip 
                        contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        itemStyle={{ color: '#0f172a', fontWeight: '600' }}
                        labelStyle={{ color: '#64748b', marginBottom: '8px', fontWeight: '500' }}
                        formatter={(value, name) => [typeof value === 'number' && value % 1 !== 0 ? value.toFixed(2) : value, name]}
                      />
                      <Legend wrapperStyle={{ paddingTop: '10px' }} />
                      <Line 
                        type="monotone" 
                        name="본인"
                        dataKey={(row) => row.me && row.me[selectedFeature]} 
                        stroke="#ef4444" 
                        strokeWidth={3}
                        dot={{ r: 4, fill: '#ef4444', strokeWidth: 0 }} 
                        activeDot={{ r: 6, stroke: '#ffffff', strokeWidth: 2 }} 
                      />
                      <Line 
                        type="monotone" 
                        name="상대방"
                        dataKey={(row) => row.other && row.other[selectedFeature]} 
                        stroke="#10b981" 
                        strokeWidth={3}
                        dot={{ r: 4, fill: '#10b981', strokeWidth: 0 }} 
                        activeDot={{ r: 6, stroke: '#ffffff', strokeWidth: 2 }} 
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="flex flex-wrap gap-2 pt-2">
                  {Object.entries(FEATURE_META).map(([key, meta]) => (
                    <button
                      key={key}
                      onClick={() => setSelectedFeature(key)}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                        selectedFeature === key 
                          ? "bg-emerald-100 text-emerald-700 border-emerald-200 shadow-sm" 
                          : "bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100 hover:text-slate-700"
                      } border`}
                      title={meta.desc}
                    >
                      {meta.label}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-10 text-slate-400 bg-slate-50 rounded-2xl border border-slate-100">
                타임라인 데이터가 제공되지 않았습니다.
              </div>
            )}
          </div>
          
          <div className="flex justify-end mt-4">
            <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors text-slate-600 font-medium text-sm border border-slate-200 shadow-sm">
              <Copy className="w-4 h-4" /> 결과 복사하기
            </button>
          </div>
          
        </div>
      </div>
    </motion.div>
  );
}
