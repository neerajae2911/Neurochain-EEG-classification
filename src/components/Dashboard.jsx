import React, { useState } from "react";
import { motion } from "framer-motion";
import { uploadEegFile } from "../services/api";
import {
  BrainCircuit,
  Loader2,
  Activity,
  Database,
  Cpu,
  Zap,
  Network,
  ShieldCheck,
} from "lucide-react";

const Dashboard = ({ onNewBlock }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handlePredict = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    try {
      const res = await uploadEegFile(file);
      if (res.error) throw new Error(res.error);
      setResult(res);
      onNewBlock(); // Refresh blockchain explorer
    } catch (err) {
      setError(err?.response?.data?.detail || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full space-y-6 pb-20">
      {/* Top Overview Cards (Model Specs) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass-panel p-5 flex items-start gap-4 border-l-4 border-l-clinical-blue">
          <div className="bg-blue-50 p-2 rounded-lg text-clinical-blue">
            <Cpu size={24} />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">
              Engine
            </p>
            <p className="text-sm font-semibold text-slate-800 mt-0.5">
              Hybrid 1D-CNN
            </p>
          </div>
        </div>
        <div className="glass-panel p-5 flex items-start gap-4 border-l-4 border-l-emerald-400">
          <div className="bg-emerald-50 p-2 rounded-lg text-emerald-500">
            <ShieldCheck size={24} />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">
              Clinical Accuracy
            </p>
            <p className="text-sm font-semibold text-slate-800 mt-0.5">
              99.4% (Validated)
            </p>
          </div>
        </div>
        <div className="glass-panel p-5 flex items-start gap-4 border-l-4 border-l-clinical-teal">
          <div className="bg-teal-50 p-2 rounded-lg text-clinical-teal">
            <Network size={24} />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">
              XAI Model
            </p>
            <p className="text-sm font-semibold text-slate-800 mt-0.5">
              GPT-3.5-Turbo
            </p>
          </div>
        </div>
        <div className="glass-panel p-5 flex items-start gap-4 border-l-4 border-l-indigo-400">
          <div className="bg-indigo-50 p-2 rounded-lg text-indigo-500">
            <Database size={24} />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">
              Ledger State
            </p>
            <p className="text-sm font-semibold text-slate-800 mt-0.5">
              Zero-Knowledge
            </p>
          </div>
        </div>
      </div>

      {/* Main Analysis Section */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left Col: Upload */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel p-8 text-center space-y-6 lg:col-span-2 flex flex-col justify-center"
        >
          <div className="flex justify-center text-clinical-blue mb-2">
            <BrainCircuit size={56} strokeWidth={1.5} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-800">
              EEG Diagnostics
            </h2>
            <p className="text-slate-500 text-sm mt-2 leading-relaxed px-4">
              Upload standardized tabular EEG modalities for decentralized,
              explainable inference.
            </p>
          </div>

          <div className="flex flex-col items-center gap-6 pt-4 w-full">
            <div className="w-full border-2 border-dashed border-slate-200 rounded-xl p-4 bg-slate-50/50 hover:bg-slate-50 transition-colors">
              <input
                type="file"
                accept=".csv"
                onChange={(e) => setFile(e.target.files[0])}
                className="text-sm text-slate-500 w-full"
              />
            </div>

            <button
              onClick={handlePredict}
              disabled={!file || loading}
              className={`w-full flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-bold transition-all shadow-sm ${
                !file
                  ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-clinical-blue to-clinical-teal text-white hover:shadow-md hover:-translate-y-0.5"
              }`}
            >
              {loading ? <Loader2 className="animate-spin" /> : <Activity />}
              {loading ? "Running Neural Network..." : "Initialize Scan"}
            </button>
          </div>
          {error && (
            <p className="text-rose-500 text-sm font-medium bg-rose-50 py-2 px-4 rounded-md inline-block border border-rose-100">
              {error}
            </p>
          )}
        </motion.div>

        {/* Right Col: Results */}
        <div className="lg:col-span-3">
          {result ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-panel p-6 sm:p-8 h-full flex flex-col relative overflow-hidden"
            >
              {/* Decorative background element */}
              <div className="absolute -right-20 -top-20 w-64 h-64 bg-clinical-blue/5 rounded-full blur-3xl pointer-events-none"></div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 flex-grow z-10">
                {/* Diagnostics Panel */}
                <div className="space-y-6">
                  <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-2">
                    <Activity size={20} className="text-clinical-blue" />
                    Clinical Diagnosis
                  </h3>

                  <div>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-1.5">
                      Model Output Label
                    </p>
                    <p
                      className={`text-2xl font-extrabold ${result.prediction.includes("Normal") ? "text-emerald-500" : "text-rose-600"}`}
                    >
                      {result.prediction}
                    </p>
                  </div>

                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 shadow-sm">
                    <div className="flex justify-between items-end mb-2">
                      <p className="text-xs font-bold text-slate-500 uppercase">
                        AI Confidence Target
                      </p>
                      <p className="text-sm font-bold text-slate-800">
                        {(result.confidence * 100).toFixed(1)}%
                      </p>
                    </div>

                    <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden flex">
                      <div
                        className={`h-full ${
                          result.prediction.includes("Normal")
                            ? "bg-emerald-400"
                            : result.confidence > 0.85
                              ? "bg-rose-500"
                              : result.confidence > 0.6
                                ? "bg-amber-400"
                                : "bg-clinical-blue"
                        } transition-all duration-1000 ease-out`}
                        style={{ width: `${result.confidence * 100}%` }}
                      ></div>
                    </div>

                    <p className="text-xs text-slate-500 mt-3 font-medium leading-relaxed">
                      {result.prediction.includes("Normal")
                        ? "Pattern strongly correlates with healthy baseline EEG rhythm variations."
                        : result.confidence > 0.85
                          ? "Critical risk indicators detected. Immediate clinical review advised."
                          : "Subtle anomalous features detected. Clinical correlation is highly recommended."}
                    </p>
                  </div>

                  {/* Feature Extraction Metrics */}
                  {result.extracted_features && (
                    <div className="pt-2">
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-3 flex items-center gap-1.5">
                        <Zap size={14} className="text-amber-500" /> Analyzed
                        Vector Snippet
                      </p>
                      <div className="grid grid-cols-2 gap-2">
                        {Object.entries(result.extracted_features).map(
                          ([key, val]) => (
                            <div
                              key={key}
                              className="bg-slate-50 rounded p-2 border border-slate-100 flex flex-col justify-between"
                            >
                              <span className="text-[10px] text-slate-500 truncate font-semibold uppercase">
                                {key.replace(/_/g, " ")}
                              </span>
                              <span className="text-sm font-mono font-bold text-slate-700">
                                {Number(val).toFixed(4)}
                              </span>
                            </div>
                          ),
                        )}
                      </div>
                      <p className="text-[10px] text-slate-400 mt-2 text-right font-medium">
                        Data Window: {result.total_rows_analyzed} temporal
                        slices parsed.
                      </p>
                    </div>
                  )}
                </div>

                {/* XAI Panel */}
                <div className="space-y-6 flex flex-col">
                  <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-2">
                    <BrainCircuit size={20} className="text-clinical-teal" />
                    Explainable AI (XAI)
                  </h3>
                  <div className="bg-gradient-to-br from-slate-50 to-white border border-slate-200 rounded-xl p-5 pb-10 flex-grow shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] relative overflow-auto">
                    <div className="space-y-4 text-sm text-slate-700 leading-relaxed z-10">
                      {result.explanation
                        .split(/\n(?=\*\*)/)
                        .filter(Boolean)
                        .map((section, idx) => {
                          const boldMatch = section.match(/^\*\*(.+?)\*\*/);
                          if (boldMatch) {
                            const heading = boldMatch[1];
                            const body = section.replace(/^\*\*.+?\*\*\s*/, "").trim();
                            const colors = [
                              "border-clinical-blue text-clinical-blue",
                              "border-clinical-teal text-clinical-teal",
                              "border-indigo-400 text-indigo-500",
                              "border-amber-400 text-amber-600",
                            ];
                            const c = colors[idx % colors.length];
                            return (
                              <div key={idx} className={`pl-3 border-l-2 ${c.split(" ")[0]}`}>
                                <p className={`text-xs font-extrabold uppercase tracking-widest mb-1 ${c.split(" ")[1]}`}>
                                  {heading}
                                </p>
                                <p className="text-slate-700 leading-relaxed">{body}</p>
                              </div>
                            );
                          }
                          return <p key={idx} className="text-slate-600">{section.trim()}</p>;
                        })}
                    </div>

                    {/* Blockchain Receipt Badge */}
                    <div className="absolute bottom-4 right-4 flex items-center gap-1.5 bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-md border border-emerald-100 shadow-sm">
                      <Database size={12} />
                      <span className="text-[10px] font-bold uppercase tracking-wider">
                        Hashed to Ledger
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="glass-panel p-8 h-full flex flex-col items-center justify-center text-slate-400 border-dashed border-2 border-slate-200 bg-slate-50/30">
              <Activity size={48} className="mb-4 opacity-50" />
              <p className="font-medium">Awaiting Data Telemetry</p>
              <p className="text-sm mt-1">
                Upload a patient CSV to begin diagnostic analysis.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
