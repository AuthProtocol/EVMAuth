import { NextRequest, NextResponse } from "next/server";
import { createPublicClient, http, formatEther } from "viem";
import { bsc, bscTestnet } from "viem/chains";
import { CONTRACT_ADDRESS, CONTRACT_ABI, AGENT_TYPE_MAP, AGENT_STATUS_MAP } from "@/lib/contract-config";

const publicClient = createPublicClient({
  chain: process.env.NEXT_PUBLIC_CHAIN_ID === "56" ? bsc : bscTestnet,
  transport: http(),
});

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const agentId = BigInt(params.id);

    const agentData = await publicClient.readContract({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      functionName: "getAgent",
      args: [agentId],
    }) as any;

    const [name, agentType, did, maxDailySpend, status, owner, createdAt] = agentData;

    const agent = {
      id: params.id,
      name,
      type: AGENT_TYPE_MAP[agentType as 0 | 1 | 2 | 3],
      did,
      maxDailySpend: formatEther(maxDailySpend),
      status: AGENT_STATUS_MAP[status as 0 | 1 | 2],
      createdAt: new Date(Number(createdAt) * 1000),
    };

    return NextResponse.json(agent);
  } catch (error) {
    console.error("Error fetching agent:", error);
    return NextResponse.json({ error: "Failed to fetch agent" }, { status: 500 });
  }
}
