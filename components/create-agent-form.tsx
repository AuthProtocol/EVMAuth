"use client";

import { useState } from "react";
import { AGENT_TYPES, AgentType } from "@/lib/mock-data";
import { Loader2, Plus } from "lucide-react";

interface CreateAgentFormProps {
  onSubmit: (name: string, type: AgentType, maxSpend: string) => void;
}

export function CreateAgentForm({ onSubmit }: CreateAgentFormProps) {
  const [name, setName] = useState("");
  const [type, setType] = useState<AgentType>("trading");
  const [maxSpend, setMaxSpend] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !maxSpend) return;

    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    onSubmit(name, type, maxSpend);
    setName("");
    setMaxSpend("");
    setIsLoading(false);
  };

  return (
    <div className="glass rounded-xl p-6">
      <h2 className="text-xl font-bold mb-4 flex items-center space-x-2">
        <Plus className="w-5 h-5 text-purple-500" />
        <span>Create Agent</span>
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Agent Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Alpha Trader"
            className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-slate-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Agent Type
          </label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as AgentType)}
            className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
          >
            {Object.entries(AGENT_TYPES).map(([key, value]) => (
              <option key={key} value={key}>
                {value.icon} {value.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Max Daily Spend (BNB)
          </label>
          <input
            type="number"
            step="0.01"
            value={maxSpend}
            onChange={(e) => setMaxSpend(e.target.value)}
            placeholder="0.5"
            className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-slate-500"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isLoading || !name || !maxSpend}
          className="w-full py-3 bg-gradient-purple rounded-lg font-semibold hover:neon-glow transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Creating...</span>
            </>
          ) : (
            <>
              <Plus className="w-5 h-5" />
              <span>Create Agent</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
