"use client";

import { useState } from "react";
import { UploadCloud, FileVideo, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function FileUploader({ onUpload }) {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSet(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFileSet(e.target.files[0]);
    }
  };

  const handleFileSet = (newFile) => {
    setFile(newFile);
    // Simulate upload delay
    setTimeout(() => {
      onUpload(newFile);
    }, 1500);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-2xl mx-auto"
    >
      <div 
        className={`relative flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-2xl transition-all duration-300 ease-in-out overflow-hidden
          ${dragActive ? "border-emerald-500 bg-emerald-500/10" : "border-slate-700 bg-slate-800/50 hover:bg-slate-800/80 hover:border-slate-500"}
          ${file ? "border-emerald-500/50 bg-slate-900/80" : ""}
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input 
          id="dropzone-file" 
          type="file" 
          className="hidden" 
          accept="video/*,image/*"
          onChange={handleChange} 
        />
        
        {file ? (
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex flex-col items-center gap-4"
          >
            <div className="p-4 rounded-full bg-emerald-500/20 text-emerald-400">
              <CheckCircle className="w-10 h-10" />
            </div>
            <div className="text-center">
              <p className="text-lg font-semibold text-slate-200">{file.name}</p>
              <p className="text-sm text-slate-400">업로드 준비 완료...</p>
            </div>
          </motion.div>
        ) : (
          <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-full cursor-pointer z-10">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex flex-col items-center justify-center pt-5 pb-6"
            >
              <div className="p-4 mb-4 rounded-full bg-slate-700/50 text-slate-400 group-hover:text-emerald-400 group-hover:bg-emerald-500/10 transition-colors">
                <UploadCloud className="w-10 h-10" />
              </div>
              <p className="mb-2 text-lg font-semibold text-slate-200">블랙박스 영상 업로드</p>
              <p className="text-sm text-slate-400 mb-4">또는 파일 드래그 앤 드롭</p>
              <span className="px-6 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-medium transition-colors shadow-lg shadow-emerald-900/20">
                파일 선택하기
              </span>
            </motion.div>
          </label>
        )}
      </div>
    </motion.div>
  );
}
