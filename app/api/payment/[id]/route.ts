import { NextRequest, NextResponse } from "next/server";
import { createPublicClient, http, formatEther } from "viem";
import { bsc, bscTestnet } from "viem/chains";
import { CONTRACT_ADDRESS, CONTRACT_ABI, PAYMENT_STATUS_MAP } from "@/lib/contract-config";

const publicClient = createPublicClient({
  chain: process.env.NEXT_PUBLIC_CHAIN_ID === "56" ? bsc : bscTestnet,
  transport: http(),
});

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const paymentId = BigInt(params.id);

    const paymentData = await publicClient.readContract({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      functionName: "getPayment",
      args: [paymentId],
    }) as any;

    const [agentId, recipient, amount, status, timestamp, memo] = paymentData;

    // Fetch agent name
    const agentData = await publicClient.readContract({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      functionName: "getAgent",
      args: [agentId],
    }) as any;

    const payment = {
      id: params.id,
      agentName: agentData[0], // name is first field
      recipient,
      amount: formatEther(amount),
      status: PAYMENT_STATUS_MAP[status as 0 | 1 | 2],
      timestamp: new Date(Number(timestamp) * 1000),
      memo: memo || undefined,
    };

    return NextResponse.json(payment);
  } catch (error) {
    console.error("Error fetching payment:", error);
    return NextResponse.json({ error: "Failed to fetch payment" }, { status: 500 });
  }
}
