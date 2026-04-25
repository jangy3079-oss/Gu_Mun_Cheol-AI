"use client";

import { useState } from "react";
import { UploadCloud, CheckCircle, Image as ImageIcon, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function FileUploader({ onUpload }) {
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState([]);

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
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(Array.from(e.target.files));
    }
  };

  const handleFiles = (newFiles) => {
    setFiles((prev) => [...prev, ...newFiles]);
  };

  const removeFile = (indexToRemove) => {
    setFiles((prev) => prev.filter((_, i) => i !== indexToRemove));
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-2xl mx-auto space-y-4"
    >
      <div 
        className={`relative flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-2xl transition-all duration-300 ease-in-out overflow-hidden group
          ${dragActive ? "border-emerald-500 bg-emerald-50" : "border-slate-300 bg-white hover:bg-slate-50 hover:border-emerald-400"}
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
          accept="image/*"
          multiple
          onChange={handleChange} 
        />
        
        <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-full cursor-pointer z-10">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex flex-col items-center justify-center pt-5 pb-6"
          >
            <div className="p-4 mb-4 rounded-full bg-emerald-50 text-emerald-600 group-hover:bg-emerald-100 transition-colors">
              <UploadCloud className="w-10 h-10" />
            </div>
            <p className="mb-2 text-lg font-semibold text-slate-800">카톡 캡처본 업로드</p>
            <p className="text-sm text-slate-500 mb-4">여러 장을 추가할 수 있습니다</p>
            <span className="px-6 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-medium transition-colors shadow-lg shadow-emerald-500/20">
              이미지 추가하기
            </span>
          </motion.div>
        </label>
      </div>

      {/* Preview List */}
      {files.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm"
        >
          <div className="flex justify-between items-center mb-3 px-2">
            <h4 className="text-slate-700 font-semibold text-sm">첨부된 파일 ({files.length}장)</h4>
            <button 
              onClick={() => onUpload(files)}
              className="px-5 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-lg shadow-md transition-all"
            >
              분석 시작
            </button>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <AnimatePresence>
              {files.map((file, i) => (
                <motion.div 
                  key={i + file.name}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  className="flex items-center gap-2 bg-slate-50 px-3 py-2 rounded-xl group border border-slate-200"
                >
                  <ImageIcon className="w-4 h-4 text-emerald-500" />
                  <span className="text-xs text-slate-600 max-w-[100px] truncate">{file.name}</span>
                  <button onClick={() => removeFile(i)} className="text-slate-400 hover:text-red-500 ml-1">
                    <X className="w-4 h-4" />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
