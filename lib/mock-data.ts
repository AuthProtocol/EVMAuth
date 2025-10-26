import { generateDID, generateRandomAddress, generateId } from "./utils";

export type AgentType = "trading" | "analytics" | "content" | "defi";
export type AgentStatus = "active" | "inactive" | "pending";
export type PaymentStatus = "pending" | "settled" | "failed";

export interface Agent {
  id: string;
  name: string;
  type: AgentType;
  did: string;
  maxDailySpend: string;
  status: AgentStatus;
  createdAt: Date;
}

export interface Payment {
  id: string;
  agentName: string;
  recipient: string;
  amount: string;
  status: PaymentStatus;
  timestamp: Date;
  memo?: string;
}

export const AGENT_TYPES: Record<
  AgentType,
  { label: string; icon: string; color: string }
> = {
  trading: { label: "Trading Bot", icon: "🤖", color: "blue" },
  analytics: { label: "Analytics", icon: "📊", color: "purple" },
  content: { label: "Content Creator", icon: "✍️", color: "pink" },
  defi: { label: "DeFi Automation", icon: "💎", color: "green" },
};

export const MOCK_AGENTS: Agent[] = [
  {
    id: "1",
    name: "Alpha Trader",
    type: "trading",
    did: generateDID("0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb"),
    maxDailySpend: "0.5",
    status: "active",
    createdAt: new Date(Date.now() - 86400000 * 5),
  },
  {
    id: "2",
    name: "Market Analyzer",
    type: "analytics",
    did: generateDID("0x8e7c3a9f1b5d2e4c8f3a6b9d5e2c7f4a8b1d3e6"),
    maxDailySpend: "0.2",
    status: "active",
    createdAt: new Date(Date.now() - 86400000 * 3),
  },
  {
    id: "3",
    name: "Content Bot",
    type: "content",
    did: generateDID("0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0"),
    maxDailySpend: "0.1",
    status: "active",
    createdAt: new Date(Date.now() - 86400000 * 1),
  },
];

export const MOCK_PAYMENTS: Payment[] = [
  {
    id: "1",
    agentName: "Alpha Trader",
    recipient: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
    amount: "0.05",
    status: "settled",
    timestamp: new Date(Date.now() - 3600000),
    memo: "Trade execution fee",
  },
  {
    id: "2",
    agentName: "Market Analyzer",
    recipient: "0x8e7c3a9f1b5d2e4c8f3a6b9d5e2c7f4a8b1d3e6",
    amount: "0.02",
    status: "settled",
    timestamp: new Date(Date.now() - 7200000),
    memo: "Data analysis service",
  },
  {
    id: "3",
    agentName: "Alpha Trader",
    recipient: "0x9f3e5d7c2a4b8e1f6c9d3a5b7e2c4f8a1b6d9e3",
    amount: "0.08",
    status: "settled",
    timestamp: new Date(Date.now() - 10800000),
  },
];

export function generateMockPayment(): Payment {
  const agents = ["Alpha Trader", "Market Analyzer", "Content Bot", "DeFi Master"];
  const memos = [
    "Trade execution fee",
    "Data analysis service",
    "Content generation",
    "Yield optimization",
    "Liquidity provision",
    "Gas fee reimbursement",
  ];

  return {
    id: generateId(),
    agentName: agents[Math.floor(Math.random() * agents.length)],
    recipient: generateRandomAddress(),
    amount: (Math.random() * 0.1 + 0.01).toFixed(4),
    status: "pending",
    timestamp: new Date(),
    memo: Math.random() > 0.5 ? memos[Math.floor(Math.random() * memos.length)] : undefined,
  };
}

export function generateMockAgent(name: string, type: AgentType, maxSpend: string): Agent {
  return {
    id: generateId(),
    name,
    type,
    did: generateDID(generateRandomAddress()),
    maxDailySpend: maxSpend,
    status: "pending",
    createdAt: new Date(),
  };
}
