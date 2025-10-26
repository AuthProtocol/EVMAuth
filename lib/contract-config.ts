export const CONTRACT_ADDRESS = (process.env.NEXT_PUBLIC_CONTRACT_ADDRESS ||
  "0x0000000000000000000000000000000000000000") as `0x${string}`;

export const CONTRACT_ABI = [
  {
    "inputs": [
      { "internalType": "string", "name": "_name", "type": "string" },
      { "internalType": "enum EVMAuth.AgentType", "name": "_agentType", "type": "uint8" },
      { "internalType": "string", "name": "_did", "type": "string" },
      { "internalType": "uint256", "name": "_maxDailySpend", "type": "uint256" }
    ],
    "name": "createAgent",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "_agentId", "type": "uint256" }],
    "name": "activateAgent",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "_agentId", "type": "uint256" }],
    "name": "deactivateAgent",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "_agentId", "type": "uint256" },
      { "internalType": "address", "name": "_recipient", "type": "address" },
      { "internalType": "string", "name": "_memo", "type": "string" }
    ],
    "name": "authorizePayment",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "_agentId", "type": "uint256" }],
    "name": "getAgent",
    "outputs": [
      {
        "components": [
          { "internalType": "string", "name": "name", "type": "string" },
          { "internalType": "enum EVMAuth.AgentType", "name": "agentType", "type": "uint8" },
          { "internalType": "string", "name": "did", "type": "string" },
          { "internalType": "uint256", "name": "maxDailySpend", "type": "uint256" },
          { "internalType": "enum EVMAuth.AgentStatus", "name": "status", "type": "uint8" },
          { "internalType": "address", "name": "owner", "type": "address" },
          { "internalType": "uint256", "name": "createdAt", "type": "uint256" },
          { "internalType": "uint256", "name": "dailySpent", "type": "uint256" },
          { "internalType": "uint256", "name": "lastResetTimestamp", "type": "uint256" }
        ],
        "internalType": "struct EVMAuth.Agent",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "address", "name": "_owner", "type": "address" }],
    "name": "getUserAgents",
    "outputs": [{ "internalType": "uint256[]", "name": "", "type": "uint256[]" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "_paymentId", "type": "uint256" }],
    "name": "getPayment",
    "outputs": [
      {
        "components": [
          { "internalType": "uint256", "name": "agentId", "type": "uint256" },
          { "internalType": "address", "name": "recipient", "type": "address" },
          { "internalType": "uint256", "name": "amount", "type": "uint256" },
          { "internalType": "enum EVMAuth.PaymentStatus", "name": "status", "type": "uint8" },
          { "internalType": "uint256", "name": "timestamp", "type": "uint256" },
          { "internalType": "string", "name": "memo", "type": "string" }
        ],
        "internalType": "struct EVMAuth.Payment",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "address", "name": "_user", "type": "address" }],
    "name": "getUserPayments",
    "outputs": [{ "internalType": "uint256[]", "name": "", "type": "uint256[]" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "_agentId", "type": "uint256" },
      { "internalType": "uint256", "name": "_newMaxDailySpend", "type": "uint256" }
    ],
    "name": "updateMaxDailySpend",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "_agentId", "type": "uint256" }],
    "name": "getRemainingDailyBudget",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "uint256", "name": "agentId", "type": "uint256" },
      { "indexed": true, "internalType": "address", "name": "owner", "type": "address" },
      { "indexed": false, "internalType": "string", "name": "name", "type": "string" },
      { "indexed": false, "internalType": "enum EVMAuth.AgentType", "name": "agentType", "type": "uint8" },
      { "indexed": false, "internalType": "uint256", "name": "maxDailySpend", "type": "uint256" }
    ],
    "name": "AgentCreated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "uint256", "name": "agentId", "type": "uint256" },
      { "indexed": false, "internalType": "enum EVMAuth.AgentStatus", "name": "newStatus", "type": "uint8" }
    ],
    "name": "AgentStatusUpdated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "uint256", "name": "paymentId", "type": "uint256" },
      { "indexed": true, "internalType": "uint256", "name": "agentId", "type": "uint256" },
      { "indexed": true, "internalType": "address", "name": "recipient", "type": "address" },
      { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }
    ],
    "name": "PaymentAuthorized",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "uint256", "name": "paymentId", "type": "uint256" },
      { "indexed": true, "internalType": "uint256", "name": "agentId", "type": "uint256" },
      { "indexed": true, "internalType": "address", "name": "recipient", "type": "address" },
      { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }
    ],
    "name": "PaymentSettled",
    "type": "event"
  }
] as const;

export const AGENT_TYPE_MAP = {
  0: "trading" as const,
  1: "analytics" as const,
  2: "content" as const,
  3: "defi" as const,
};

export const AGENT_STATUS_MAP = {
  0: "pending" as const,
  1: "active" as const,
  2: "inactive" as const,
};

export const PAYMENT_STATUS_MAP = {
  0: "pending" as const,
  1: "settled" as const,
  2: "failed" as const,
};
