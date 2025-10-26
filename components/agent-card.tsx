"use client";

import { Agent, AGENT_TYPES } from "@/lib/mock-data";
import { Copy, CheckCircle, XCircle, Clock } from "lucide-react";
import { truncateAddress, formatBNB } from "@/lib/utils";
import { toast } from "sonner";

interface AgentCardProps {
  agent: Agent;
}

const statusIcons = {
  active: CheckCircle,
  inactive: XCircle,
  pending: Clock,
};

const statusColors = {
  active: "text-green-500",
  inactive: "text-red-500",
  pending: "text-yellow-500",
};

export function AgentCard({ agent }: AgentCardProps) {
  const agentType = AGENT_TYPES[agent.type];
  const StatusIcon = statusIcons[agent.status];

  const copyDID = () => {
    navigator.clipboard.writeText(agent.did);
    toast.success("DID copied to clipboard!");
  };

  return (
    <div className="glass glass-hover rounded-lg p-4 animate-fadeIn">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2">
          <span className="text-2xl">{agentType.icon}</span>
          <div>
            <h3 className="font-semibold">{agent.name}</h3>
            <p className="text-xs text-slate-400">{agentType.label}</p>
          </div>
        </div>
        <StatusIcon className={`w-5 h-5 ${statusColors[agent.status]}`} />
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-slate-400">DID</span>
          <button
            onClick={copyDID}
            className="flex items-center space-x-1 text-purple-400 hover:text-purple-300 transition-colors"
          >
            <span className="font-mono text-xs">{truncateAddress(agent.did.split(":")[2], 6)}</span>
            <Copy className="w-3 h-3" />
          </button>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-slate-400">Max Daily Spend</span>
          <span className="font-semibold">{formatBNB(agent.maxDailySpend)}</span>
        </div>
      </div>
    </div>
  );
}
