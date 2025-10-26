import { Navbar } from "@/components/navbar";
import { Bot, Shield, Zap, ArrowRight, TrendingUp, Users, Activity } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="relative px-4 py-20 sm:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-blue-900/20" />

        <div className="max-w-7xl mx-auto relative">
          <div className="text-center max-w-4xl mx-auto animate-fadeIn">
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-full mb-8">
              <Zap className="w-4 h-4 text-purple-400" />
              <span className="text-sm text-purple-300">Powered by BSC</span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6">
              <span className="gradient-text">Secure Payments</span>
              <br />
              for AI Agents
            </h1>

            <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto">
              Authorize and manage autonomous AI agent payments on Binance Smart Chain
              with enterprise-grade security and real-time monitoring.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/dashboard"
                className="group px-8 py-4 bg-gradient-purple rounded-lg font-semibold hover:neon-glow transition-all flex items-center space-x-2"
              >
                <span>Launch Dashboard</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>

              <a
                href="https://github.com"
                className="px-8 py-4 glass glass-hover rounded-lg font-semibold transition-all"
              >
                View on GitHub
              </a>
            </div>
          </div>

          {/* Stats Preview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 max-w-4xl mx-auto">
            <div className="glass rounded-xl p-6 text-center animate-fadeIn">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-500/20 rounded-lg mb-3">
                <Users className="w-6 h-6 text-purple-400" />
              </div>
              <div className="text-3xl font-bold mb-1">1,200+</div>
              <div className="text-slate-400">Active Agents</div>
            </div>

            <div className="glass rounded-xl p-6 text-center animate-fadeIn" style={{ animationDelay: "0.1s" }}>
              <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-500/20 rounded-lg mb-3">
                <TrendingUp className="w-6 h-6 text-blue-400" />
              </div>
              <div className="text-3xl font-bold mb-1">45.2K BNB</div>
              <div className="text-slate-400">Total Volume</div>
            </div>

            <div className="glass rounded-xl p-6 text-center animate-fadeIn" style={{ animationDelay: "0.2s" }}>
              <div className="inline-flex items-center justify-center w-12 h-12 bg-green-500/20 rounded-lg mb-3">
                <Activity className="w-6 h-6 text-green-400" />
              </div>
              <div className="text-3xl font-bold mb-1">99.9%</div>
              <div className="text-slate-400">Uptime</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Why Choose EVMAuth?</h2>
            <p className="text-xl text-slate-400">
              Production-ready, secure, and scalable
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="glass glass-hover rounded-xl p-8 animate-fadeIn">
              <div className="w-14 h-14 bg-gradient-purple rounded-xl flex items-center justify-center mb-6">
                <Bot className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">AI-Native Architecture</h3>
              <p className="text-slate-400 leading-relaxed">
                Purpose-built for autonomous AI agents with decentralized identity (DID)
                support and programmable spending limits. Deploy your agents in minutes.
              </p>
              <ul className="mt-6 space-y-2 text-sm text-slate-300">
                <li className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-purple-500 rounded-full" />
                  <span>DID-based authentication</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-purple-500 rounded-full" />
                  <span>Configurable spending limits</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-purple-500 rounded-full" />
                  <span>Multi-agent management</span>
                </li>
              </ul>
            </div>

            {/* Feature 2 */}
            <div className="glass glass-hover rounded-xl p-8 animate-fadeIn" style={{ animationDelay: "0.1s" }}>
              <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-xl flex items-center justify-center mb-6">
                <Shield className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Enterprise Security</h3>
              <p className="text-slate-400 leading-relaxed">
                Military-grade encryption with multi-signature support and real-time fraud
                detection. Your agents operate safely with complete audit trails.
              </p>
              <ul className="mt-6 space-y-2 text-sm text-slate-300">
                <li className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                  <span>Multi-sig wallet support</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                  <span>Real-time monitoring</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                  <span>Complete audit logs</span>
                </li>
              </ul>
            </div>

            {/* Feature 3 */}
            <div className="glass glass-hover rounded-xl p-8 animate-fadeIn" style={{ animationDelay: "0.2s" }}>
              <div className="w-14 h-14 bg-gradient-to-br from-green-600 to-emerald-500 rounded-xl flex items-center justify-center mb-6">
                <Zap className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Lightning Fast</h3>
              <p className="text-slate-400 leading-relaxed">
                Built on BSC for sub-second confirmation times and minimal fees.
                Scale from prototype to production without infrastructure headaches.
              </p>
              <ul className="mt-6 space-y-2 text-sm text-slate-300">
                <li className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                  <span>3-second finality</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                  <span>$0.01 avg transaction fee</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                  <span>Infinite scalability</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <div className="glass rounded-2xl p-12 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 to-blue-900/30" />
            <div className="relative">
              <h2 className="text-4xl font-bold mb-4">Ready to Get Started?</h2>
              <p className="text-xl text-slate-300 mb-8">
                Connect your wallet and start managing AI agent payments in minutes
              </p>
              <Link
                href="/dashboard"
                className="inline-flex items-center space-x-2 px-8 py-4 bg-gradient-purple rounded-lg font-semibold hover:neon-glow transition-all"
              >
                <span>Launch Dashboard</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 px-4 py-8">
        <div className="max-w-7xl mx-auto text-center text-slate-500">
          <p>&copy; 2025 EVMAuth. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
