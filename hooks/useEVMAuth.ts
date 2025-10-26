"use client";

import { useReadContract, useWriteContract, useWaitForTransactionReceipt, useAccount } from "wagmi";
import { parseEther, formatEther } from "viem";
import { CONTRACT_ADDRESS, CONTRACT_ABI, AGENT_TYPE_MAP, AGENT_STATUS_MAP, PAYMENT_STATUS_MAP } from "@/lib/contract-config";
import { AgentType, Agent, Payment } from "@/lib/mock-data";
import { generateDID } from "@/lib/utils";

export function useEVMAuth() {
  const { address } = useAccount();
  const { writeContractAsync } = useWriteContract();

  // Create Agent
  const createAgent = async (name: string, type: AgentType, maxSpend: string) => {
    if (!address) throw new Error("Wallet not connected");

    const agentTypeMap: Record<AgentType, number> = {
      trading: 0,
      analytics: 1,
      content: 2,
      defi: 3,
    };

    const did = generateDID(address);
    const maxSpendWei = parseEther(maxSpend);

    const hash = await writeContractAsync({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      functionName: "createAgent",
      args: [name, agentTypeMap[type], did, maxSpendWei],
    });

    return hash;
  };

  // Activate Agent
  const activateAgent = async (agentId: bigint) => {
    if (!address) throw new Error("Wallet not connected");

    const hash = await writeContractAsync({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      functionName: "activateAgent",
      args: [agentId],
    });

    return hash;
  };

  // Authorize Payment
  const authorizePayment = async (
    agentId: bigint,
    recipient: string,
    amount: string,
    memo?: string
  ) => {
    if (!address) throw new Error("Wallet not connected");

    const amountWei = parseEther(amount);

    const hash = await writeContractAsync({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      functionName: "authorizePayment",
      args: [agentId, recipient as `0x${string}`, memo || ""],
      value: amountWei,
    });

    return hash;
  };

  // Get User Agents
  const { data: userAgentIds, refetch: refetchAgentIds } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "getUserAgents",
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });

  // Get User Payments
  const { data: userPaymentIds, refetch: refetchPaymentIds } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "getUserPayments",
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });

  return {
    createAgent,
    activateAgent,
    authorizePayment,
    userAgentIds: userAgentIds as bigint[] | undefined,
    userPaymentIds: userPaymentIds as bigint[] | undefined,
    refetchAgentIds,
    refetchPaymentIds,
  };
}

// Hook to get single agent details
export function useAgent(agentId: bigint | undefined) {
  const { data: agentData, refetch } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "getAgent",
    args: agentId !== undefined ? [agentId] : undefined,
    query: {
      enabled: agentId !== undefined,
    },
  });

  if (!agentData) return { agent: undefined, refetch };

  const [name, agentType, did, maxDailySpend, status, owner, createdAt] = agentData as any;

  const agent: Agent = {
    id: agentId!.toString(),
    name,
    type: AGENT_TYPE_MAP[agentType as 0 | 1 | 2 | 3],
    did,
    maxDailySpend: formatEther(maxDailySpend),
    status: AGENT_STATUS_MAP[status as 0 | 1 | 2],
    createdAt: new Date(Number(createdAt) * 1000),
  };

  return { agent, refetch };
}

// Hook to get single payment details
export function usePayment(paymentId: bigint | undefined) {
  const { data: paymentData, refetch } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "getPayment",
    args: paymentId !== undefined ? [paymentId] : undefined,
    query: {
      enabled: paymentId !== undefined,
    },
  });

  if (!paymentData) return { payment: undefined, refetch };

  const [agentId, recipient, amount, status, timestamp, memo] = paymentData as any;

  const payment: Payment = {
    id: paymentId!.toString(),
    agentName: `Agent #${agentId}`,
    recipient,
    amount: formatEther(amount),
    status: PAYMENT_STATUS_MAP[status as 0 | 1 | 2],
    timestamp: new Date(Number(timestamp) * 1000),
    memo: memo || undefined,
  };

  return { payment, refetch };
}
