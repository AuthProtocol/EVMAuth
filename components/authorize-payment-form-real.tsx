"use client";

import { useState } from "react";
import { Agent } from "@/lib/mock-data";
import { Loader2, Send } from "lucide-react";
import { useEVMAuth } from "@/hooks/useEVMAuth";
import { useWaitForTransactionReceipt } from "wagmi";
import { toast } from "sonner";

interface AuthorizePaymentFormRealProps {
  agents: Array<{ id: string; name: string; status: string }>;
  onSuccess: () => void;
}

export function AuthorizePaymentFormReal({ agents, onSuccess }: AuthorizePaymentFormRealProps) {
  const [agentId, setAgentId] = useState("");
  const [amount, setAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  const [memo, setMemo] = useState("");
  const [txHash, setTxHash] = useState<`0x${string}` | undefined>();

  const { authorizePayment } = useEVMAuth();

  const { isLoading: isConfirming } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  const activeAgents = agents.filter((a) => a.status === "active");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agentId || !amount || !recipient) return;

    try {
      toast.loading("Authorizing payment...");
      const hash = await authorizePayment(
        BigInt(agentId),
        recipient,
        amount,
        memo || undefined
      );
      setTxHash(hash);

      toast.dismiss();
      toast.success("Transaction submitted! Waiting for confirmation...");

      setTimeout(() => {
        toast.success("Payment authorized successfully!");
        setAmount("");
        setRecipient("");
        setMemo("");
        setTxHash(undefined);
        onSuccess();
      }, 3000);
    } catch (error: any) {
      toast.dismiss();
      toast.error(error.message || "Failed to authorize payment");
      console.error("Authorize payment error:", error);
    }
  };

  const isLoading = isConfirming || !!txHash;

  return (
    <div className="glass rounded-xl p-6">
      <h2 className="text-xl font-bold mb-4 flex items-center space-x-2">
        <Send className="w-5 h-5 text-blue-500" />
        <span>Authorize Payment (Blockchain)</span>
      </h2>

      {activeAgents.length === 0 ? (
        <div className="text-center py-8 text-slate-400">
          <p>No active agents available</p>
          <p className="text-sm mt-1">Create and activate an agent first</p>
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
              disabled={isLoading}
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
              disabled={isLoading}
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
              disabled={isLoading}
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
              disabled={isLoading}
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
                <span>{isConfirming ? "Confirming..." : "Authorizing..."}</span>
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                <span>Authorize Payment</span>
              </>
            )}
          </button>

          {txHash && (
            <p className="text-xs text-slate-400 text-center">
              Tx: {txHash.slice(0, 10)}...{txHash.slice(-8)}
            </p>
          )}
        </form>
      )}
    </div>
  );
}
