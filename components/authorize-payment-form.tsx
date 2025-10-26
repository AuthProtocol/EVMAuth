"use client";

import { useState } from "react";
import { Agent } from "@/lib/mock-data";
import { Loader2, Send } from "lucide-react";

interface AuthorizePaymentFormProps {
  agents: Agent[];
  onSubmit: (agentId: string, amount: string, recipient: string, memo?: string) => void;
}

export function AuthorizePaymentForm({ agents, onSubmit }: AuthorizePaymentFormProps) {
  const [agentId, setAgentId] = useState("");
  const [amount, setAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  const [memo, setMemo] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const activeAgents = agents.filter((a) => a.status === "active");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agentId || !amount || !recipient) return;

    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    onSubmit(agentId, amount, recipient, memo || undefined);
    setAmount("");
    setRecipient("");
    setMemo("");
    setIsLoading(false);
  };

  return (
    <div className="glass rounded-xl p-6">
      <h2 className="text-xl font-bold mb-4 flex items-center space-x-2">
        <Send className="w-5 h-5 text-blue-500" />
        <span>Authorize Payment</span>
      </h2>

      {activeAgents.length === 0 ? (
        <div className="text-center py-8 text-slate-400">
          <p>No active agents available</p>
          <p className="text-sm mt-1">Create an agent first</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Select Agent
            </label>
            <select
              value={agentId}
              onChange={(e) => setAgentId(e.target.value)}
              className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
              required
            >
              <option value="">Choose an agent...</option>
              {activeAgents.map((agent) => (
                <option key={agent.id} value={agent.id}>
                  {agent.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Recipient Address
            </label>
            <input
              type="text"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="0x..."
              className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-slate-500 font-mono text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Amount (BNB)
            </label>
            <input
              type="number"
              step="0.001"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.05"
              className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-slate-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Memo (Optional)
            </label>
            <input
              type="text"
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              placeholder="Payment description..."
              className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-slate-500"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || !agentId || !amount || !recipient}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold hover:neon-glow transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Authorizing...</span>
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                <span>Authorize Payment</span>
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
}
