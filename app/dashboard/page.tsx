"use client";

import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { Navbar } from "@/components/navbar";
import { StatsCard } from "@/components/stats-card";
import { AgentCard } from "@/components/agent-card";
import { PaymentRow } from "@/components/payment-row";
import { CreateAgentForm } from "@/components/create-agent-form";
import { AuthorizePaymentForm } from "@/components/authorize-payment-form";
import {
  MOCK_AGENTS,
  MOCK_PAYMENTS,
  generateMockAgent,
  generateMockPayment,
  Agent,
  Payment,
  AgentType,
} from "@/lib/mock-data";
import { Bot, TrendingUp, Activity, Clock, Wallet } from "lucide-react";
import { toast } from "sonner";

export default function Dashboard() {
  const { address, isConnected } = useAccount();
  const [agents, setAgents] = useState<Agent[]>(MOCK_AGENTS);
  const [payments, setPayments] = useState<Payment[]>(MOCK_PAYMENTS);

  // Auto-generate payments every 10 seconds
  useEffect(() => {
    if (!isConnected) return;

    const interval = setInterval(() => {
      const newPayment = generateMockPayment();
      setPayments((prev) => [newPayment, ...prev].slice(0, 20));
    }, 10000);

    return () => clearInterval(interval);
  }, [isConnected]);

  // Auto-settle pending payments after 5 seconds
  useEffect(() => {
    if (!isConnected) return;

    const interval = setInterval(() => {
      setPayments((prev) =>
        prev.map((payment) => {
          if (
            payment.status === "pending" &&
            Date.now() - payment.timestamp.getTime() > 5000
          ) {
            return { ...payment, status: "settled" as const };
          }
          return payment;
        })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [isConnected]);

  // Activate pending agents after 3 seconds
  useEffect(() => {
    if (!isConnected) return;

    const interval = setInterval(() => {
      setAgents((prev) =>
        prev.map((agent) => {
          if (
            agent.status === "pending" &&
            Date.now() - agent.createdAt.getTime() > 3000
          ) {
            toast.success(`${agent.name} is now active!`);
            return { ...agent, status: "active" as const };
          }
          return agent;
        })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [isConnected]);

  const handleCreateAgent = (name: string, type: AgentType, maxSpend: string) => {
    const newAgent = generateMockAgent(name, type, maxSpend);
    setAgents((prev) => [newAgent, ...prev]);
    toast.success(`Agent "${name}" created successfully!`);
  };

  const handleAuthorizePayment = (
    agentId: string,
    amount: string,
    recipient: string,
    memo?: string
  ) => {
    const agent = agents.find((a) => a.id === agentId);
    if (!agent) return;

    const newPayment: Payment = {
      id: Math.random().toString(36).substring(2, 15),
      agentName: agent.name,
      recipient,
      amount,
      status: "pending",
      timestamp: new Date(),
      memo,
    };

    setPayments((prev) => [newPayment, ...prev]);
    toast.success("Payment authorized successfully!");
  };

  // Calculate stats
  const totalVolume = payments
    .filter((p) => p.status === "settled")
    .reduce((sum, p) => sum + parseFloat(p.amount), 0)
    .toFixed(2);

  const totalPayments = payments.length;
  const pendingPayments = payments.filter((p) => p.status === "pending").length;

  if (!isConnected) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="text-center glass rounded-2xl p-12 max-w-md animate-fadeIn">
            <div className="w-20 h-20 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Wallet className="w-10 h-10 text-purple-400" />
            </div>
            <h2 className="text-2xl font-bold mb-4">Connect Your Wallet</h2>
            <p className="text-slate-400 mb-6">
              Please connect your wallet to access the dashboard and manage your AI agents.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            icon={Bot}
            value={agents.filter((a) => a.status === "active").length}
            title="Active Agents"
            color="purple"
          />
          <StatsCard
            icon={TrendingUp}
            value={`${totalVolume} BNB`}
            title="Total Volume"
            color="blue"
          />
          <StatsCard
            icon={Activity}
            value={totalPayments}
            title="Total Payments"
            color="green"
          />
          <StatsCard
            icon={Clock}
            value={pendingPayments}
            title="Pending"
            color="pink"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-8">
            {/* Create Agent Form */}
            <CreateAgentForm onSubmit={handleCreateAgent} />

            {/* Your Agents */}
            <div className="glass rounded-xl p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center justify-between">
                <span>Your Agents</span>
                <span className="text-sm font-normal text-slate-400">
                  {agents.length} total
                </span>
              </h2>

              {agents.length === 0 ? (
                <div className="text-center py-12 text-slate-400">
                  <Bot className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No agents yet</p>
                  <p className="text-sm mt-1">Create your first agent above</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                  {agents.map((agent) => (
                    <AgentCard key={agent.id} agent={agent} />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Authorize Payment Form */}
            <AuthorizePaymentForm
              agents={agents}
              onSubmit={handleAuthorizePayment}
            />

            {/* Activity Feed */}
            <div className="glass rounded-xl p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center justify-between">
                <span>Activity Feed</span>
                <span className="text-sm font-normal text-slate-400">
                  Last {payments.length} payments
                </span>
              </h2>

              {payments.length === 0 ? (
                <div className="text-center py-12 text-slate-400">
                  <Activity className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No payments yet</p>
                  <p className="text-sm mt-1">Authorize your first payment above</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                  {payments.map((payment) => (
                    <PaymentRow key={payment.id} payment={payment} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
