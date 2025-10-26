"use client";

import { useState } from "react";
import { AGENT_TYPES, AgentType } from "@/lib/mock-data";
import { Loader2, Plus } from "lucide-react";
import { useEVMAuth } from "@/hooks/useEVMAuth";
import { useWaitForTransactionReceipt } from "wagmi";
import { toast } from "sonner";

interface CreateAgentFormRealProps {
  onSuccess: () => void;
}

export function CreateAgentFormReal({ onSuccess }: CreateAgentFormRealProps) {
  const [name, setName] = useState("");
  const [type, setType] = useState<AgentType>("trading");
  const [maxSpend, setMaxSpend] = useState("");
  const [txHash, setTxHash] = useState<`0x${string}` | undefined>();

  const { createAgent } = useEVMAuth();

  const { isLoading: isConfirming } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !maxSpend) return;

    try {
      toast.loading("Creating agent...");
      const hash = await createAgent(name, type, maxSpend);
      setTxHash(hash);

      toast.dismiss();
      toast.success("Transaction submitted! Waiting for confirmation...");

      // Wait a bit for confirmation
      setTimeout(() => {
        toast.success(`Agent "${name}" created successfully!`);
        setName("");
        setMaxSpend("");
        setTxHash(undefined);
        onSuccess();
      }, 3000);
    } catch (error: any) {
      toast.dismiss();
      toast.error(error.message || "Failed to create agent");
      console.error("Create agent error:", error);
    }
  };

  const isLoading = isConfirming || !!txHash;

  return (
    <div className="glass rounded-xl p-6">
      <h2 className="text-xl font-bold mb-4 flex items-center space-x-2">
        <Plus className="w-5 h-5 text-purple-500" />
        <span>Create Agent (Blockchain)</span>
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
            disabled={isLoading}
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
            disabled={isLoading}
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
            disabled={isLoading}
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
              <span>{isConfirming ? "Confirming..." : "Creating..."}</span>
            </>
          ) : (
            <>
              <Plus className="w-5 h-5" />
              <span>Create Agent</span>
            </>
          )}
        </button>

        {txHash && (
          <p className="text-xs text-slate-400 text-center">
            Tx: {txHash.slice(0, 10)}...{txHash.slice(-8)}
          </p>
        )}
      </form>
    </div>
  );
}
