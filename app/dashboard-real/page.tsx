"use client";

import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { Navbar } from "@/components/navbar";
import { StatsCard } from "@/components/stats-card";
import { AgentCard } from "@/components/agent-card";
import { PaymentRow } from "@/components/payment-row";
import { CreateAgentFormReal } from "@/components/create-agent-form-real";
import { AuthorizePaymentFormReal } from "@/components/authorize-payment-form-real";
import { useEVMAuth, useAgent, usePayment } from "@/hooks/useEVMAuth";
import { Agent, Payment } from "@/lib/mock-data";
import { Bot, TrendingUp, Activity, Clock, Wallet } from "lucide-react";

export default function DashboardReal() {
  const { address, isConnected } = useAccount();
  const { userAgentIds, userPaymentIds, refetchAgentIds, refetchPaymentIds } = useEVMAuth();

  const [agents, setAgents] = useState<Agent[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);

  // Fetch all agents when IDs change
  useEffect(() => {
    if (!userAgentIds || userAgentIds.length === 0) {
      setAgents([]);
      return;
    }

    const fetchAgents = async () => {
      const agentPromises = userAgentIds.map(async (id) => {
        const response = await fetch(`/api/agent/${id}`);
        if (response.ok) {
          return response.json();
        }
        return null;
      });

      const fetchedAgents = (await Promise.all(agentPromises)).filter(Boolean);
      setAgents(fetchedAgents);
    };

    fetchAgents();
  }, [userAgentIds]);

  // Fetch all payments when IDs change
  useEffect(() => {
    if (!userPaymentIds || userPaymentIds.length === 0) {
      setPayments([]);
      return;
    }

    const fetchPayments = async () => {
      const paymentPromises = userPaymentIds.map(async (id) => {
        const response = await fetch(`/api/payment/${id}`);
        if (response.ok) {
          return response.json();
        }
        return null;
      });

      const fetchedPayments = (await Promise.all(paymentPromises)).filter(Boolean);
      setPayments(fetchedPayments.reverse()); // Most recent first
    };

    fetchPayments();
  }, [userPaymentIds]);

  const handleAgentCreated = () => {
    refetchAgentIds();
  };

  const handlePaymentAuthorized = () => {
    refetchPaymentIds();
  };

  // Calculate stats
  const totalVolume = payments
    .filter((p) => p.status === "settled")
    .reduce((sum, p) => sum + parseFloat(p.amount), 0)
    .toFixed(2);

  const totalPayments = payments.length;
  const pendingPayments = payments.filter((p) => p.status === "pending").length;
  const activeAgents = agents.filter((a) => a.status === "active").length;

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
            value={activeAgents}
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
            <CreateAgentFormReal onSuccess={handleAgentCreated} />

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
            <AuthorizePaymentFormReal
              agents={agents}
              onSuccess={handlePaymentAuthorized}
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
