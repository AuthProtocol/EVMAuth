import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  icon: LucideIcon;
  value: string | number;
  title: string;
  color?: "purple" | "blue" | "green" | "pink";
}

const colorClasses = {
  purple: "text-purple-500",
  blue: "text-blue-500",
  green: "text-green-500",
  pink: "text-pink-500",
};

export function StatsCard({ icon: Icon, value, title, color = "purple" }: StatsCardProps) {
  return (
    <div className="glass glass-hover rounded-xl p-6 animate-fadeIn">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-slate-400 text-sm mb-1">{title}</p>
          <p className="text-3xl font-bold">{value}</p>
        </div>
        <div className={`p-3 rounded-lg bg-slate-700/50 ${colorClasses[color]}`}>
          <Icon className="w-8 h-8" />
        </div>
      </div>
    </div>
  );
}
