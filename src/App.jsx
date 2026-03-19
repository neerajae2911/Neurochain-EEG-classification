import React, { useState } from "react";
import Dashboard from "./components/Dashboard";
import BlockchainExplorer from "./components/BlockchainExplorer";
import Settings from "./components/Settings";
import { Activity } from "lucide-react";

function App() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [activeTab, setActiveTab] = useState("diagnostics");

  return (
    <div className="min-h-screen p-6 md:p-12 relative text-slate-800 bg-slate-50">
      <header className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between mb-12 gap-6 md:gap-0">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-clinical-blue to-clinical-teal flex items-center justify-center shadow-md">
            <Activity className="text-white" size={28} />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900">
              NeuroChain
            </h1>
            <p className="text-xs text-clinical-blue uppercase tracking-widest font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Clinical XAI Platform
            </p>
          </div>
        </div>

        <div className="flex gap-2 bg-white p-1.5 rounded-xl shadow-sm border border-slate-100">
          <button
            onClick={() => setActiveTab("diagnostics")}
            className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
              activeTab === "diagnostics"
                ? "bg-slate-100 text-clinical-blue shadow-sm"
                : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
            }`}
          >
            Diagnostics
          </button>
          <button
            onClick={() => setActiveTab("ledger")}
            className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
              activeTab === "ledger"
                ? "bg-slate-100 text-clinical-teal shadow-sm"
                : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
            }`}
          >
            Patient Ledger
          </button>
          <button
            onClick={() => setActiveTab("settings")}
            className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
              activeTab === "settings"
                ? "bg-slate-100 text-slate-800 shadow-sm"
                : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
            }`}
          >
            Settings
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto">
        {activeTab === "diagnostics" && (
          <Dashboard onNewBlock={() => setRefreshTrigger((prev) => prev + 1)} />
        )}
        {activeTab === "ledger" && (
          <div className="animate-in fade-in zoom-in-95 duration-200">
            <BlockchainExplorer refreshTrigger={refreshTrigger} />
          </div>
        )}
        {activeTab === "settings" && (
          <div className="animate-in fade-in zoom-in-95 duration-200">
            <Settings />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
