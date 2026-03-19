import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { fetchBlockchain } from "../services/api";
import { Link, Hash, Clock, FileText, CheckCircle2 } from "lucide-react";

const BlockchainExplorer = ({ refreshTrigger }) => {
  const [blocks, setBlocks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBlocks = async () => {
      try {
        const data = await fetchBlockchain();
        // reverse to show newest first
        setBlocks(data.reverse());
      } catch (err) {
        console.error("Failed to load blockchain", err);
      } finally {
        setLoading(false);
      }
    };
    loadBlocks();
  }, [refreshTrigger]);

  if (loading)
    return (
      <div className="text-clinical-blue flex justify-center py-12">
        <div className="animate-pulse flex items-center gap-2 font-medium">
          <Link className="animate-spin" size={20} />
          Syncing Secure Ledger...
        </div>
      </div>
    );

  return (
    <div className="w-full max-w-4xl mx-auto mt-12 space-y-6 pb-20">
      <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
        <Link className="text-clinical-blue" />
        <h2 className="text-2xl font-bold text-slate-800">Immutable Ledger</h2>
        <span className="ml-auto bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
          <CheckCircle2 size={12} />
          Network Synced
        </span>
      </div>

      <div className="space-y-4">
        {blocks.map((block, i) => (
          <motion.div
            key={block.hash}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-panel p-6 hover:border-clinical-blue/30 hover:shadow-lg transition-all"
          >
            <div className="flex justify-between items-start mb-5">
              <div className="flex items-center gap-4">
                <div className="bg-indigo-50 border border-indigo-100 text-indigo-600 w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg shadow-sm">
                  #{block.index}
                </div>
                <div>
                  <p className="text-sm text-slate-500 flex items-center gap-1.5 font-medium mb-1">
                    <Clock size={14} className="text-slate-400" />
                    {new Date(block.timestamp * 1000).toLocaleString()}
                  </p>
                  <p className="text-slate-800 font-bold text-lg">
                    {block.prediction_result}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-100 rounded-lg p-4 space-y-3 font-mono text-xs overflow-hidden">
              <div className="flex items-start gap-3">
                <Hash
                  size={14}
                  className="text-clinical-teal mt-0.5 shrink-0"
                />
                <div>
                  <span className="text-slate-400 font-bold tracking-wider">
                    HASH:
                  </span>
                  <p className="text-clinical-blue truncate w-full font-medium">
                    {block.hash}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Link size={14} className="text-slate-400 mt-0.5 shrink-0" />
                <div>
                  <span className="text-slate-400 font-bold tracking-wider">
                    PREVIOUS:
                  </span>
                  <p className="text-slate-500 truncate w-full">
                    {block.previous_hash}
                  </p>
                </div>
              </div>
              {block.explanation !== "Genesis Block" && (
                <div className="flex items-start gap-3 mt-4 pt-4 border-t border-slate-200">
                  <FileText
                    size={14}
                    className="text-clinical-blue mt-0.5 shrink-0"
                  />
                  <div>
                    <span className="text-slate-400 font-bold tracking-wider">
                      XAI PAYLOAD:
                    </span>
                    <p className="text-slate-700 whitespace-pre-wrap font-sans mt-1.5 leading-relaxed bg-white p-3 rounded border border-slate-100">
                      {block.explanation}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default BlockchainExplorer;
