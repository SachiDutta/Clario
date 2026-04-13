import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle, XCircle, BadgeCheck, Plus, Minus,
  Sparkles, Loader2, Trophy, Star, TrendingUp, Shield
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { ALL_POLICIES, THEME_COLORS } from "@/data/insurance";

const POSITIVE_KEYWORDS = ["yes", "covered", "included", "available", "✓", "lifelong", "unlimited", "no co-pay", "no limit", "full"];
const NEGATIVE_KEYWORDS = ["no", "not covered", "excluded", "n/a", "nil", "none", "not available", "30%", "20%"];

function cellStyle(val: string): "positive" | "negative" | "neutral" {
  const lower = val.toLowerCase();
  if (POSITIVE_KEYWORDS.some((k) => lower.includes(k))) return "positive";
  if (NEGATIVE_KEYWORDS.some((k) => lower.includes(k))) return "negative";
  return "neutral";
}

interface AICompareResult {
  bestOverall: string;
  bestValue: string;
  bestForFamilies: string;
  aiSummary: string;
  winner: { name: string; reason: string };
  policyInsights: Array<{
    name: string;
    insurer: string;
    realClaimRatio: number;
    actualNetworkHospitals: string;
    realPremiumRange: string;
    iRDAIRating: string;
    pros: string[];
    cons: string[];
    bestFor: string;
    expertScore: number;
    expertVerdict: string;
  }>;
  headToHead: {
    premiumEfficiency: string;
    claimEase: string;
    networkStrength: string;
    coverageDepth: string;
  };
  recommendations: string[];
  tableRows: Array<{ feature: string; values: string[] }>;
}

export default function Compare() {
  const [slots, setSlots] = useState<string[]>(["healthguard-pro", "familycare-shield", "medelite-plus"]);
  const [aiResult, setAiResult] = useState<AICompareResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function changeSlot(idx: number, id: string) {
    setSlots((prev) => { const n = [...prev]; n[idx] = id; return n; });
    setAiResult(null);
  }

  function addSlot() {
    if (slots.length >= 4) return;
    const unused = ALL_POLICIES.find((p) => !slots.includes(p.id));
    if (unused) setSlots((prev) => [...prev, unused.id]);
    setAiResult(null);
  }

  function removeSlot(idx: number) {
    if (slots.length <= 2) return;
    setSlots((prev) => prev.filter((_, i) => i !== idx));
    setAiResult(null);
  }

  const policies = slots.map((id) => ALL_POLICIES.find((p) => p.id === id)!).filter(Boolean);

  async function handleAICompare() {
    setLoading(true);
    setError(null);
    setAiResult(null);
    window.scrollTo({ top: 0, behavior: "smooth" });

    try {
      const res = await fetch("/api/compare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          policies: policies.map((p) => ({ name: p.name, insurer: p.insurer })),
        }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Comparison failed");
      setAiResult(data.result);
    } catch (err: any) {
      setError(err.message || "Failed to generate AI comparison. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#090c14] pt-24 pb-20">
      <div className="container mx-auto px-4 md:px-6" style={{ maxWidth: "1400px" }}>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-sm font-semibold mb-5">
            <BadgeCheck className="w-4 h-4" /> Policy Comparison Engine
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">Compare Policies Side by Side</h1>
          <p className="text-white/50 text-lg">Select 2–4 policies, then click the button to get a full AI-generated comparison.</p>
        </motion.div>

        {/* Slot Selectors */}
        <div className="flex flex-wrap gap-4 mb-8 items-end">
          {slots.map((id, idx) => {
            const policy = ALL_POLICIES.find((p) => p.id === id);
            const color = policy ? THEME_COLORS[policy.theme] : "#08d9d6";
            return (
              <div key={idx} className="flex-1 min-w-[180px] max-w-[240px]">
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-white/40 text-[10px] font-bold uppercase tracking-widest">Policy {idx + 1}</Label>
                  {slots.length > 2 && (
                    <button
                      onClick={() => removeSlot(idx)}
                      data-testid={`button-remove-slot-${idx}`}
                      className="w-5 h-5 rounded-full bg-white/10 hover:bg-destructive/30 flex items-center justify-center transition-colors"
                    >
                      <Minus className="w-3 h-3 text-white/60" />
                    </button>
                  )}
                </div>
                <Select value={id} onValueChange={(v) => changeSlot(idx, v)}>
                  <SelectTrigger
                    className="border text-white h-11 rounded-xl text-sm"
                    data-testid={`select-slot-${idx}`}
                    style={{ background: color + "10", borderColor: color + "30" }}
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#0a0e14] border-white/10 text-white">
                    {ALL_POLICIES.map((p) => (
                      <SelectItem
                        key={p.id}
                        value={p.id}
                        disabled={slots.includes(p.id) && slots[idx] !== p.id}
                      >
                        {p.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            );
          })}

          {slots.length < 4 && (
            <button
              onClick={addSlot}
              data-testid="button-add-slot"
              className="h-11 px-5 rounded-xl border border-dashed border-white/15 text-white/40 hover:text-white hover:border-white/30 text-sm font-medium flex items-center gap-2 transition-all"
            >
              <Plus className="w-4 h-4" /> Add Policy
            </button>
          )}
        </div>

        {/* AI Compare Button */}
        <div className="flex justify-center mb-10">
          <button
            onClick={handleAICompare}
            disabled={loading}
            data-testid="button-ai-compare"
            className="flex items-center gap-3 px-8 py-3.5 rounded-full text-[#090c14] font-bold text-sm transition-all disabled:opacity-50"
            style={{ background: "linear-gradient(135deg, #08d9d6, #a855f7)", boxShadow: "0 0 30px rgba(8,217,214,0.3)" }}
          >
            {loading ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Generating AI Comparison...</>
            ) : (
              <><Sparkles className="w-4 h-4" /> Get AI-Powered Insights</>
            )}
          </button>
        </div>

        {/* Loading State */}
        <AnimatePresence>
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-24 gap-4"
            >
              <div className="w-16 h-16 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-purple-400 animate-pulse" />
              </div>
              <p className="text-white/50 text-sm">AI is analysing and comparing your selected policies...</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error */}
        {error && (
          <div className="mb-8 p-4 rounded-2xl border border-red-500/30 bg-red-500/5 text-sm text-red-400">
            {error}
          </div>
        )}

        {/* Empty state — before AI runs */}
        <AnimatePresence>
          {!aiResult && !loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-24 gap-4 border border-dashed border-white/8 rounded-3xl"
            >
              <div className="w-14 h-14 rounded-2xl bg-white/4 border border-white/8 flex items-center justify-center">
                <BadgeCheck className="w-7 h-7 text-white/20" />
              </div>
              <div className="text-center">
                <p className="text-white/30 text-sm">Your full AI-generated comparison will appear here</p>
                <p className="text-white/20 text-xs mt-1">Select your policies above and click the button</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* AI Results */}
        <AnimatePresence>
          {aiResult && !loading && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-8"
            >
              {/* Winner Banner */}
              {aiResult.winner && (
                <div className="flex items-center gap-3 p-5 rounded-2xl bg-amber-500/10 border border-amber-500/20">
                  <Trophy className="w-6 h-6 text-amber-400 shrink-0" />
                  <div className="flex-1">
                    <div className="text-sm font-bold text-amber-400 mb-0.5">Recommended: {aiResult.winner.name}</div>
                    <div className="text-xs text-white/50">{aiResult.winner.reason}</div>
                  </div>
                  <div className="flex gap-3 text-xs">
                    <div className="text-center px-3 py-2 rounded-xl bg-white/5 border border-white/8">
                      <div className="text-white/40">Best Overall</div>
                      <div className="text-white font-semibold mt-0.5">{aiResult.bestOverall}</div>
                    </div>
                    <div className="text-center px-3 py-2 rounded-xl bg-white/5 border border-white/8">
                      <div className="text-white/40">Best Value</div>
                      <div className="text-white font-semibold mt-0.5">{aiResult.bestValue}</div>
                    </div>
                    <div className="text-center px-3 py-2 rounded-xl bg-white/5 border border-white/8 hidden md:block">
                      <div className="text-white/40">Best for Families</div>
                      <div className="text-white font-semibold mt-0.5">{aiResult.bestForFamilies}</div>
                    </div>
                  </div>
                </div>
              )}

              {/* AI Summary */}
              <div className="rounded-2xl border border-purple-500/20 bg-purple-500/[0.03] p-6">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  <span className="text-xs font-bold text-purple-400 uppercase tracking-widest">AI Expert Analysis</span>
                </div>
                <p className="text-white/65 text-sm leading-relaxed">{aiResult.aiSummary}</p>
              </div>

              {/* Head to Head */}
              {aiResult.headToHead && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { key: "premiumEfficiency", label: "Premium Efficiency", icon: TrendingUp },
                    { key: "claimEase", label: "Claim Ease", icon: CheckCircle },
                    { key: "networkStrength", label: "Network Strength", icon: Shield },
                    { key: "coverageDepth", label: "Coverage Depth", icon: Star },
                  ].map(({ key, label, icon: Icon }) => (
                    <div key={key} className="p-4 rounded-2xl bg-white/5 border border-white/8">
                      <div className="flex items-center gap-1.5 mb-2">
                        <Icon className="w-3.5 h-3.5 text-purple-400" />
                        <div className="text-[10px] font-bold uppercase tracking-widest text-white/35">{label}</div>
                      </div>
                      <div className="text-xs text-white/70 font-medium">{(aiResult.headToHead as any)[key]}</div>
                    </div>
                  ))}
                </div>
              )}

              {/* AI-Generated Comparison Table */}
              {aiResult.tableRows && aiResult.tableRows.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Sparkles className="w-4 h-4 text-secondary" />
                    <span className="text-xs font-bold text-secondary uppercase tracking-widest">AI-Generated Comparison Table</span>
                  </div>
                  <div className="overflow-x-auto rounded-2xl border border-white/8">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b border-white/8" style={{ background: "#0a0d18" }}>
                          <th className="text-left p-4 text-white/35 text-xs font-bold uppercase tracking-widest w-44 sticky left-0 z-10" style={{ background: "#0a0d18" }}>
                            Feature
                          </th>
                          {policies.map((p, i) => {
                            const color = THEME_COLORS[p.theme];
                            return (
                              <th key={i} className="p-4 text-center min-w-[180px]" style={{ background: color + "08" }}>
                                {p.badge && (
                                  <div className="mb-1">
                                    <span className="text-[10px] font-bold uppercase py-0.5 px-2 rounded-full text-white" style={{ background: color }}>
                                      {p.badge}
                                    </span>
                                  </div>
                                )}
                                <div className="text-xs text-white/35">{p.insurer}</div>
                                <div className="text-sm font-bold text-white leading-tight">{p.name}</div>
                              </th>
                            );
                          })}
                        </tr>
                      </thead>
                      <tbody>
                        {aiResult.tableRows.map((row, ri) => (
                          <tr
                            key={ri}
                            className={`border-b border-white/5 transition-colors hover:bg-white/[0.015] ${ri % 2 === 0 ? "bg-white/[0.008]" : ""}`}
                          >
                            <td
                              className="p-4 text-sm font-medium text-white/55 sticky left-0 z-10"
                              style={{ background: ri % 2 === 0 ? "#0a0d18" : "#090c16" }}
                            >
                              {row.feature}
                            </td>
                            {(row.values || []).map((val, vi) => {
                              const style = cellStyle(val);
                              const color = THEME_COLORS[policies[vi]?.theme] || "#08d9d6";
                              return (
                                <td key={vi} className="p-4 text-center" style={{ background: color + "05" }}>
                                  <span
                                    className={`text-sm font-medium ${
                                      style === "positive"
                                        ? "text-emerald-400"
                                        : style === "negative"
                                        ? "text-red-400"
                                        : "text-white/80"
                                    }`}
                                  >
                                    {val}
                                  </span>
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Policy Insight Cards */}
              {aiResult.policyInsights && aiResult.policyInsights.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Star className="w-4 h-4 text-amber-400" />
                    <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">Per-Policy Expert Breakdown</span>
                  </div>
                  <div className="overflow-x-auto pb-2" style={{ WebkitOverflowScrolling: "touch" }}>
                  <div className="flex flex-row gap-4 px-1">
                    {aiResult.policyInsights.map((insight, i) => {
                      const policy = policies.find((p) => p.name === insight.name || p.insurer === insight.insurer);
                      const color = policy ? THEME_COLORS[policy.theme] : "#a855f7";
                      return (
                        <div
                          key={i}
                          className="rounded-2xl border p-5 flex-shrink-0 w-64"
                          style={{ borderColor: color + "30", background: color + "06" }}
                        >
                          <div className="flex items-center gap-2 mb-3">
                            <div className="w-2 h-8 rounded-full" style={{ background: color }} />
                            <div>
                              <div className="text-xs text-white/40">{insight.insurer}</div>
                              <div className="text-sm font-bold text-white">{insight.name}</div>
                            </div>
                            <div className="ml-auto text-xl font-black" style={{ color }}>{insight.expertScore}</div>
                          </div>
                          <p className="text-xs text-white/50 italic mb-3">{insight.expertVerdict}</p>
                          <div className="mb-2">
                            <div className="text-[10px] font-bold uppercase tracking-widest text-secondary mb-1">Pros</div>
                            {insight.pros?.map((pro, pi) => (
                              <div key={pi} className="flex items-start gap-1.5 text-xs text-white/65 py-0.5">
                                <CheckCircle className="w-3 h-3 text-secondary mt-0.5 shrink-0" />
                                {pro}
                              </div>
                            ))}
                          </div>
                          <div>
                            <div className="text-[10px] font-bold uppercase tracking-widest text-red-400 mb-1">Cons</div>
                            {insight.cons?.map((con, ci) => (
                              <div key={ci} className="flex items-start gap-1.5 text-xs text-white/65 py-0.5">
                                <XCircle className="w-3 h-3 text-red-400 mt-0.5 shrink-0" />
                                {con}
                              </div>
                            ))}
                          </div>
                          <div className="mt-3 pt-3 border-t border-white/8 space-y-1">
                            <div className="text-[10px] text-white/35">Claim Ratio: <span className="text-white/60">{insight.realClaimRatio}%</span></div>
                            <div className="text-[10px] text-white/35">Network: <span className="text-white/60">{insight.actualNetworkHospitals}</span></div>
                            <div className="text-[10px] text-white/35">Premium: <span className="text-white/60">{insight.realPremiumRange}</span></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  </div>
                </div>
              )}

              {/* Benefits & Exclusions Cards */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Shield className="w-4 h-4 text-secondary" />
                  <span className="text-xs font-bold text-secondary uppercase tracking-widest">Benefits & Exclusions</span>
                </div>
                <div className="overflow-x-auto pb-4" style={{ WebkitOverflowScrolling: "touch" }}>
                <div className="flex flex-row gap-5 px-1">
                  {policies.map((p, i) => {
                    const color = THEME_COLORS[p.theme];
                    return (
                      <motion.div
                        key={p.id}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.08 }}
                        className="rounded-2xl border p-6 flex-shrink-0"
                        style={{ borderColor: color + "30", background: color + "06", minWidth: "280px", width: "300px" }}
                      >
                        <div className="flex items-center gap-3 mb-5">
                          <div className="w-2.5 h-8 rounded-full" style={{ background: color }} />
                          <div>
                            <div className="text-xs text-white/40">{p.insurer}</div>
                            <div className="font-bold text-white">{p.name}</div>
                          </div>
                          {p.badge && (
                            <span className="ml-auto text-[10px] font-bold px-2 py-1 rounded-full text-white" style={{ background: color }}>
                              {p.badge}
                            </span>
                          )}
                        </div>
                        <div className="mb-4">
                          <div className="text-[10px] font-bold uppercase tracking-widest text-secondary mb-2">Benefits</div>
                          <div className="flex flex-wrap gap-1.5">
                            {p.benefits.map((b) => (
                              <span key={b} className="px-2 py-0.5 rounded-full text-xs bg-secondary/10 text-secondary border border-secondary/20">{b}</span>
                            ))}
                          </div>
                        </div>
                        <div className="mb-5">
                          <div className="text-[10px] font-bold uppercase tracking-widest text-destructive mb-2">Exclusions</div>
                          <div className="flex flex-wrap gap-1.5">
                            {p.exclusions.map((e) => (
                              <span key={e} className="px-2 py-0.5 rounded-full text-xs bg-destructive/10 text-destructive border border-destructive/20">{e}</span>
                            ))}
                          </div>
                        </div>
                        <Button
                          className="w-full h-11 rounded-xl font-semibold text-white transition-transform hover:scale-[1.02]"
                          data-testid={`button-choose-${p.id}`}
                          style={{ background: color, boxShadow: `0 0 20px ${color}25` }}
                        >
                          Choose {p.name.split(" ")[0]}
                        </Button>
                      </motion.div>
                    );
                  })}
                </div>
                </div>
              </div>

              {/* Expert Tips */}
              {aiResult.recommendations && aiResult.recommendations.length > 0 && (
                <div className="rounded-2xl border border-purple-500/15 bg-purple-500/[0.03] p-6">
                  <div className="text-[10px] font-bold uppercase tracking-widest text-purple-400 mb-3">Expert Tips</div>
                  <div className="flex flex-col gap-2">
                    {aiResult.recommendations.map((rec, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-white/60">
                        <Star className="w-3 h-3 text-amber-400 mt-0.5 shrink-0" />
                        {rec}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
