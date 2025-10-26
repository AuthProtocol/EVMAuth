import { Payment } from "@/lib/mock-data";
import { truncateAddress, formatBNB, getRelativeTime } from "@/lib/utils";
import { ArrowRight, CheckCircle, Clock, XCircle } from "lucide-react";

interface PaymentRowProps {
  payment: Payment;
}

const statusConfig = {
  pending: { icon: Clock, color: "text-yellow-500", bg: "bg-yellow-500/10" },
  settled: { icon: CheckCircle, color: "text-green-500", bg: "bg-green-500/10" },
  failed: { icon: XCircle, color: "text-red-500", bg: "bg-red-500/10" },
};

export function PaymentRow({ payment }: PaymentRowProps) {
  const config = statusConfig[payment.status];
  const StatusIcon = config.icon;

  return (
    <div className="glass rounded-lg p-4 animate-fadeIn">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2 flex-1">
          <span className="text-sm font-medium text-slate-300">{payment.agentName}</span>
          <ArrowRight className="w-4 h-4 text-slate-500" />
          <span className="text-xs font-mono text-slate-400">
            {truncateAddress(payment.recipient)}
          </span>
        </div>
        <div className={`flex items-center space-x-1 px-2 py-1 rounded ${config.bg}`}>
          <StatusIcon className={`w-3 h-3 ${config.color}`} />
          <span className={`text-xs font-medium ${config.color} capitalize`}>
            {payment.status}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center space-x-3">
          <span className="font-semibold text-purple-400">{formatBNB(payment.amount)}</span>
          {payment.memo && (
            <span className="text-xs text-slate-500 italic">{payment.memo}</span>
          )}
        </div>
        <span className="text-xs text-slate-500">{getRelativeTime(payment.timestamp)}</span>
      </div>
    </div>
  );
}
