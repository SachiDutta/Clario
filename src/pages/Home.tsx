import React from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  ChevronDown, ArrowRight, Shield, TrendingUp, BadgeCheck,
  Zap, CheckCircle, Star, Users, Globe
} from "lucide-react";

const FEATURES = [
  {
    icon: Shield,
    color: "#08d9d6",
    title: "Policy Analyzer",
    desc: "Upload your insurance PDF or select your provider and instantly get a full breakdown of what's covered, excluded, and waiting periods.",
    href: "/analyze",
    cta: "Analyze My Policy",
  },
  {
    icon: TrendingUp,
    color: "#00c4bc",
    title: "Claim Simulator",
    desc: "Choose a real-life scenario or describe your own. Enter your bill details and instantly see your payout, out-of-pocket cost, and approval likelihood.",
    href: "/simulator",
    cta: "Open Simulator",
  },
  {
    icon: BadgeCheck,
    color: "#a855f7",
    title: "Policy Comparison",
    desc: "Pick any 2–3 policies from our database and compare 14 attributes side by side — premium, claim ratio, coverage, exclusions, and more.",
    href: "/compare",
    cta: "Compare Policies",
  },
];

const STATS = [
  { icon: Users, value: "10,000+", label: "Indians trust Clario" },
  { icon: Shield, value: "200+", label: "Policies in our database" },
  { icon: Star, value: "98%", label: "Customer satisfaction score" },
  { icon: Globe, value: "₹500Cr+", label: "Claims analysed" },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-[#090c14]">

      {/* ─── HERO ─── */}
      <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">

        {/* Deep dark base */}
        <div className="absolute inset-0 bg-[#07090f]" />

        {/* ── Large crossing X beams ── */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">

          {/* Beam 1 – bottom-left to top-right */}
          <motion.div
            animate={{ opacity: [0.55, 0.85, 0.55] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            style={{
              position: "absolute",
              width: "250vw",
              height: "1.5px",
              background:
                "linear-gradient(90deg, transparent 0%, rgba(8,217,214,0.0) 5%, rgba(8,217,214,0.7) 35%, rgba(8,217,214,1) 50%, rgba(8,217,214,0.7) 65%, rgba(8,217,214,0.0) 95%, transparent 100%)",
              top: "50%",
              left: "-75vw",
              transform: "rotate(-36deg)",
              filter: "blur(0.4px)",
              boxShadow:
                "0 0 10px 3px rgba(8,217,214,0.35), 0 0 40px 12px rgba(8,217,214,0.18), 0 0 100px 40px rgba(8,217,214,0.07)",
            }}
          />

          {/* Beam 2 – top-left to bottom-right */}
          <motion.div
            animate={{ opacity: [0.45, 0.75, 0.45] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            style={{
              position: "absolute",
              width: "250vw",
              height: "1.5px",
              background:
                "linear-gradient(90deg, transparent 0%, rgba(8,217,214,0.0) 5%, rgba(8,217,214,0.6) 35%, rgba(8,217,214,0.95) 50%, rgba(8,217,214,0.6) 65%, rgba(8,217,214,0.0) 95%, transparent 100%)",
              top: "50%",
              left: "-75vw",
              transform: "rotate(36deg)",
              filter: "blur(0.4px)",
              boxShadow:
                "0 0 10px 3px rgba(8,217,214,0.3), 0 0 40px 12px rgba(8,217,214,0.15), 0 0 100px 40px rgba(8,217,214,0.06)",
            }}
          />

          {/* Corner arc decorations – top-right */}
          <div
            style={{
              position: "absolute",
              width: "500px",
              height: "500px",
              top: "-180px",
              right: "-180px",
              border: "1px solid rgba(255,255,255,0.05)",
              borderRadius: "50%",
            }}
          />
          <div
            style={{
              position: "absolute",
              width: "380px",
              height: "380px",
              top: "-100px",
              right: "-100px",
              border: "1px solid rgba(255,255,255,0.03)",
              borderRadius: "50%",
            }}
          />

          {/* Soft glow at beam intersection */}
          <div
            style={{
              position: "absolute",
              width: "360px",
              height: "360px",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              background: "radial-gradient(circle, rgba(8,217,214,0.07) 0%, transparent 70%)",
              borderRadius: "50%",
            }}
          />
        </div>

        {/* Subtle dot grid overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1.5px 1.5px, rgba(255,255,255,0.012) 1px, transparent 0)",
            backgroundSize: "26px 26px",
          }}
        />

        {/* ── Hero content ── */}
        <div className="relative z-10 text-center px-6 max-w-2xl mx-auto">

         

          {/* Main headline */}
          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18, duration: 0.7, ease: [0.2, 0.65, 0.3, 0.9] }}
            className="text-4xl md:text-5xl lg:text-[60px] font-bold text-white leading-[1.12] tracking-tight mb-5"
          >
            Clarity That Helps You<br className="hidden sm:block" /> Choose Better
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.42, duration: 0.8 }}
            className="text-sm md:text-[15px] text-white/45 mb-10 max-w-sm mx-auto leading-relaxed"
          >
            Understand your coverage, compare options, and make confident decisions — all in one place
          </motion.p>

          {/* Single CTA button */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.62, duration: 0.5 }}
          >
            <Link href="/">
              <button
                data-testid="button-hero-analyze"
                className="inline-flex items-center gap-2 px-7 py-3 rounded-full text-sm font-semibold text-primary transition-all duration-300 cursor-pointer select-none"
                style={{
                  background: "rgba(8,217,214,0.10)",
                  border: "1px solid rgba(8,217,214,0.28)",
                  boxShadow: "0 0 24px rgba(8,217,214,0.18)",
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLButtonElement).style.background = "rgba(8,217,214,0.18)";
                  (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 0 36px rgba(8,217,214,0.28)";
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLButtonElement).style.background = "rgba(8,217,214,0.10)";
                  (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 0 24px rgba(8,217,214,0.18)";
                }}
              >
                Get Started
              </button>
            </Link>
          </motion.div>
        </div>

        
        {/* ── Cookie / info banner at bottom center ── */}
        
      </section>

      {/* ─── STATS ─── */}
      <section className="py-20 border-t border-white/5" style={{ background: "#060910" }}>
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {STATS.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="text-center"
                >
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="text-3xl font-black text-white mb-1">{stat.value}</div>
                  <div className="text-sm text-white/45 leading-snug">{stat.label}</div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── FEATURE CARDS ─── */}
      <section className="py-24 bg-[#090c14]">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Everything you need to decide smarter</h2>
            <p className="text-white/50 text-lg">Three powerful tools. One seamless experience.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {FEATURES.map((feat, i) => {
              const Icon = feat.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.12 }}
                  className="group relative rounded-3xl border border-white/8 p-8 overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-white/16"
                  style={{ background: "rgba(255,255,255,0.02)" }}
                >
                  <div
                    className="absolute -top-16 -right-16 w-40 h-40 rounded-full blur-3xl opacity-10 group-hover:opacity-25 transition-opacity duration-500"
                    style={{ background: feat.color }}
                  />
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6"
                    style={{ background: feat.color + "18", border: `1px solid ${feat.color}35` }}
                  >
                    <Icon className="w-7 h-7" style={{ color: feat.color }} />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{feat.title}</h3>
                  <p className="text-white/50 text-sm leading-relaxed mb-8">{feat.desc}</p>
                  <Link href={feat.href}>
                    <Button
                      className="w-full h-11 rounded-xl text-sm font-semibold text-white border border-white/10 bg-white/5 hover:bg-white/10 transition-colors"
                      data-testid={`button-feature-${i}`}
                    >
                      {feat.cta} <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── FINAL CTA ─── */}
      <section
        className="py-36 relative overflow-hidden"
        style={{ background: "linear-gradient(160deg, #090c14 0%, #07111a 50%, #060d16 100%)" }}
      >
        <div className="absolute inset-0 flex items-center justify-center opacity-40 pointer-events-none">
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 8, repeat: Infinity }}
            className="w-[600px] h-[600px] rounded-full blur-[120px]"
            style={{ background: "radial-gradient(circle, #08d9d6, transparent)" }}
          />
        </div>
        <div className="container mx-auto px-6 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight leading-tight">
              Insurance clarity<br className="hidden md:block" /> powered by intelligence.
            </h2>
            <p className="text-lg text-white/50 mb-10 max-w-xl mx-auto font-light">
              Join 10,000+ Indians making smarter insurance decisions with Clario.
            </p>
            <Link href="/">
              <Button
                size="lg"
                className="bg-primary text-[#090c14] hover:bg-primary/90 text-lg h-16 px-10 rounded-full font-bold transition-transform hover:scale-105"
                style={{ boxShadow: "0 0 50px rgba(8,217,214,0.35)" }}
              >
                Get Personalised Recommendation <ArrowRight className="ml-2 w-6 h-6" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
       
      <footer className="py-10 border-t border-white/8 text-center md:text-left" style={{ background: "#060910" }}>
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1 justify-center md:justify-start">
              <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                <div className="w-2.5 h-2.5 rounded-full bg-primary" />
              </div>
              <span className="text-lg font-bold text-white">Clario</span>
            </div>
            <div className="text-xs text-white/35">Brilliant insurance intelligence.</div>
          </div>
          <div className="flex gap-8 text-sm font-medium text-white/45">
            {["About", "Privacy", "Terms", "Contact"].map((l) => (
              <a key={l} href="#" className="hover:text-primary transition-colors">{l}</a>
            ))}
          </div>
          <div className="text-sm text-white/30">© 2026 Clario. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
}
