import React from "react";
import { motion } from "framer-motion";
import {
  Settings as SettingsIcon,
  Shield,
  Server,
  Bell,
  Database,
} from "lucide-react";

const Settings = () => {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
        <SettingsIcon className="text-slate-400" />
        <h2 className="text-2xl font-bold text-slate-800">
          System Preferences
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-panel p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <Server className="text-clinical-blue" size={20} />
            <h3 className="font-semibold text-slate-800">
              ML Model Configuration
            </h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Active Model Engine
              </label>
              <select className="mt-1 w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 outline-none focus:border-clinical-blue">
                <option>Hybrid 1D-CNN (v2.1 - 99.4% Acc)</option>
                <option>BiLSTM Tabular (v1.0)</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                XAI Verbosity
              </label>
              <select className="mt-1 w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 outline-none focus:border-clinical-blue">
                <option>Clinical Summary (Standard)</option>
                <option>Detailed Feature Analysis</option>
                <option>Patient-Friendly</option>
              </select>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-panel p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <Database className="text-clinical-teal" size={20} />
            <h3 className="font-semibold text-slate-800">Blockchain Ledger</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Database Type
              </label>
              <input
                type="text"
                readOnly
                value="SQLite3 Persistent Storage"
                className="mt-1 w-full bg-slate-100 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-500 cursor-not-allowed"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Storage Path
              </label>
              <input
                type="text"
                readOnly
                value="/backend/neurochain_ledger.db"
                className="mt-1 w-full bg-slate-100 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-500 cursor-not-allowed font-mono"
              />
            </div>
            <div className="flex items-center justify-between pt-2">
              <span className="text-sm text-slate-700 font-medium">
                Auto-sync Network Nodes
              </span>
              <div className="w-10 h-5 bg-clinical-teal rounded-full relative cursor-pointer">
                <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full"></div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-panel p-6 md:col-span-2"
        >
          <div className="flex items-center gap-2 mb-4">
            <Shield className="text-rose-500" size={20} />
            <h3 className="font-semibold text-slate-800">
              Security & Compliance (HIPAA)
            </h3>
          </div>
          <p className="text-sm text-slate-500 leading-relaxed max-w-2xl mb-4">
            All EEG tabular features transiting the network are stripped of
            Personally Identifiable Information (PII). Blockchain records
            contain only decentralized cryptographic hashes and XAI inferences.
          </p>
          <div className="flex gap-4">
            <button className="px-4 py-2 bg-slate-800 text-white rounded-lg text-sm font-medium hover:bg-slate-900 transition-colors">
              Export Audit Trail
            </button>
            <button className="px-4 py-2 bg-rose-50 text-rose-600 border border-rose-200 rounded-lg text-sm font-medium hover:bg-rose-100 transition-colors">
              Wipe Local Node Data
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Settings;
