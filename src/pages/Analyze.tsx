import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload, FileText, CheckCircle, XCircle, Clock, AlertTriangle,
  ChevronRight, Building2, Activity, Scissors, Baby, Stethoscope, Pill, X,
  Sparkles, Star, TrendingUp, Shield, Loader2, Save, BookOpen
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PROVIDERS, PROVIDER_POLICIES } from "@/data/insurance";

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  hospitalization: Building2,
  icu: Activity,
  surgery: Scissors,
  maternity: Baby,
  opd: Stethoscope,
  dental: AlertTriangle,
};

interface AIReport {
  policyTitle: string;
  insurer: string;
  overallScore: number;
  claimSettlementRatio: number;
  networkHospitals: string;
  sumInsured: string;
  annualPremium: string;
  keyStrengths: string[];
  keyWeaknesses: string[];
  aiSummary: string;
  categories: Record<string, {
    score: number;
    covered: Array<{ item: string; limit: string }>;
    partial: Array<{ item: string; limit: string; note: string }>;
    excluded: string[];
    waitingPeriods: Array<{ item: string; period: string }>;
  }>;
  recommendations: string[];
  irdaiCompliance: string;
  renewability: string;
  portability: boolean;
}

function UploadZone({ onFile }: { onFile: (name: string, file: File) => void }) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) onFile(file.name, file);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) onFile(file.name, file);
  }

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      data-testid="dropzone-upload"
      className={`relative flex flex-col items-center justify-center gap-4 p-12 rounded-2xl border-2 border-dashed cursor-pointer transition-all duration-200 ${
        isDragging
          ? "border-primary bg-primary/8 scale-[1.01]"
          : "border-white/15 hover:border-white/30 hover:bg-white/[0.02]"
      }`}
    >
      <input ref={inputRef} type="file" accept=".pdf,.jpg,.png" className="hidden" onChange={handleChange} />
      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-colors ${isDragging ? "bg-primary/20" : "bg-white/5"}`}>
        <Upload className={`w-8 h-8 ${isDragging ? "text-primary" : "text-white/40"}`} />
      </div>
      <div className="text-center">
        <div className="text-white font-semibold mb-1">
          {isDragging ? "Drop your file here" : "Drag & drop your policy document"}
        </div>
        <div className="text-white/40 text-sm">PDF, JPG or PNG — up to 20 MB</div>
      </div>
      <div className="px-5 py-2 rounded-full border border-white/15 text-white/60 text-sm hover:text-white hover:border-white/30 transition-colors">
        Browse Files
      </div>
    </div>
  );
}

function ScoreRing({ score }: { score: number }) {
  const r = 36;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  const color = score >= 80 ? "#10b981" : score >= 60 ? "#f59e0b" : "#ef4444";

  return (
    <div className="relative w-24 h-24 flex items-center justify-center">
      <svg width="96" height="96" className="-rotate-90">
        <circle cx="48" cy="48" r={r} strokeWidth="7" fill="none" stroke="rgba(255,255,255,0.06)" />
        <circle
          cx="48" cy="48" r={r} strokeWidth="7" fill="none"
          stroke={color}
          strokeDasharray={`${dash} ${circ}`}
          strokeLinecap="round"
          style={{ filter: `drop-shadow(0 0 6px ${color}60)`, transition: "stroke-dasharray 1s ease" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-black text-white">{score}</span>
        <span className="text-[9px] text-white/40 uppercase tracking-wider">Score</span>
      </div>
    </div>
  );
}

function AIAnalysisReport({ report, policyLabel, onSave }: { report: AIReport; policyLabel: string; onSave: () => void }) {
  const [activeCategory, setActiveCategory] = useState<string>(Object.keys(report.categories)[0] || "hospitalization");
  const catKeys = Object.keys(report.categories);
  const cat = report.categories[activeCategory];
  const Icon = CATEGORY_ICONS[activeCategory] || FileText;

  return (
    <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      {/* Header Card */}
      <div className="rounded-3xl border border-white/8 p-6 md:p-8 mb-6 relative overflow-hidden" style={{ background: "rgba(255,255,255,0.02)" }}>
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-secondary/50 to-transparent" />
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          <ScoreRing score={report.overallScore} />
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-4 h-4 text-secondary" />
              <span className="text-xs font-bold text-secondary uppercase tracking-widest">AI Analysis Complete</span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-white mb-1">{report.policyTitle}</h2>
            <p className="text-white/40 text-sm mb-3">{report.insurer}</p>
            <p className="text-white/65 text-sm leading-relaxed">{report.aiSummary}</p>
          </div>
          <div className="grid grid-cols-2 gap-3 md:min-w-[200px]">
            {[
              { label: "Claim Ratio", value: `${report.claimSettlementRatio}%`, color: "#10b981" },
              { label: "Network", value: report.networkHospitals, color: "#08d9d6" },
              { label: "Sum Insured", value: report.sumInsured, color: "#a855f7" },
              { label: "Premium", value: report.annualPremium, color: "#f59e0b" },
            ].map((s) => (
              <div key={s.label} className="text-center p-3 rounded-xl bg-white/5 border border-white/8">
                <div className="text-sm font-bold" style={{ color: s.color }}>{s.value}</div>
                <div className="text-[10px] text-white/40 mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-secondary mb-2">Key Strengths</div>
            <div className="flex flex-col gap-1.5">
              {report.keyStrengths.map((s, i) => (
                <div key={i} className="flex items-start gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-secondary mt-0.5 shrink-0" />
                  <span className="text-xs text-white/70">{s}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-red-400 mb-2">Key Weaknesses</div>
            <div className="flex flex-col gap-1.5">
              {report.keyWeaknesses.map((w, i) => (
                <div key={i} className="flex items-start gap-2">
                  <XCircle className="w-3.5 h-3.5 text-red-400 mt-0.5 shrink-0" />
                  <span className="text-xs text-white/70">{w}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/8 text-xs text-white/50">
            <Shield className="w-3 h-3 text-secondary" />
            IRDAI: {report.irdaiCompliance}
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/8 text-xs text-white/50">
            <TrendingUp className="w-3 h-3 text-purple-400" />
            {report.renewability}
          </div>
          {report.portability && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/10 border border-secondary/20 text-xs text-secondary">
              <Star className="w-3 h-3" />
              Portable Policy
            </div>
          )}
        </div>

        <div className="mt-5 flex justify-end">
          <button
            onClick={onSave}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-secondary/10 border border-secondary/25 text-secondary text-sm font-semibold hover:bg-secondary/20 transition-colors"
          >
            <Save className="w-4 h-4" /> Save to My Policies
          </button>
        </div>
      </div>

      {/* Category Deep Dive */}
      <div className="mb-5">
        <Label className="text-white/40 text-xs font-bold uppercase tracking-widest block mb-4">Coverage Categories</Label>
        <div className="flex flex-wrap gap-2">
          {catKeys.map((key) => {
            const CatIcon = CATEGORY_ICONS[key] || FileText;
            const isActive = activeCategory === key;
            const score = report.categories[key]?.score || 0;
            return (
              <button
                key={key}
                onClick={() => setActiveCategory(key)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold border transition-all duration-200 ${
                  isActive
                    ? "bg-primary text-[#090c14] border-primary shadow-[0_0_20px_rgba(8,217,214,0.3)]"
                    : "bg-white/5 text-white/60 border-white/10 hover:border-white/20 hover:text-white"
                }`}
              >
                <CatIcon className="w-4 h-4" />
                {key.charAt(0).toUpperCase() + key.slice(1)}
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${isActive ? "bg-[#090c14]/30" : "bg-white/10"}`}>{score}</span>
              </button>
            );
          })}
        </div>
      </div>

      {cat && (
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-5"
          >
            <div className="rounded-2xl border border-secondary/20 bg-secondary/[0.03] p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-xl bg-secondary/15 flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-secondary" />
                </div>
                <h3 className="text-base font-bold text-secondary">Fully Covered</h3>
                <span className="ml-auto text-xs font-bold px-2 py-0.5 rounded-full bg-secondary/15 text-secondary">{cat.covered.length}</span>
              </div>
              <div className="space-y-2">
                {cat.covered.map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5 border-l-4 border-l-secondary">
                    <span className="text-sm text-white/80 flex-1 pr-2">{item.item}</span>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-secondary/15 text-secondary whitespace-nowrap">{item.limit}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-amber-500/20 bg-amber-500/[0.03] p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-xl bg-amber-500/15 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-amber-400" />
                </div>
                <h3 className="text-base font-bold text-amber-400">Partially Covered</h3>
                <span className="ml-auto text-xs font-bold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400">{cat.partial.length}</span>
              </div>
              <div className="space-y-2">
                {cat.partial.map((item, i) => (
                  <div key={i} className="flex flex-col p-3 rounded-xl bg-white/[0.02] border border-white/5 border-l-4 border-l-amber-500">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-white/80 flex-1 pr-2">{item.item}</span>
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400 whitespace-nowrap">{item.limit}</span>
                    </div>
                    {item.note && <span className="text-xs text-white/35 mt-1">{item.note}</span>}
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-red-500/20 bg-red-500/[0.03] p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-xl bg-red-500/15 flex items-center justify-center">
                  <XCircle className="w-5 h-5 text-red-400" />
                </div>
                <h3 className="text-base font-bold text-red-400">Excluded</h3>
                <span className="ml-auto text-xs font-bold px-2 py-0.5 rounded-full bg-red-500/15 text-red-400">{cat.excluded.length}</span>
              </div>
              <div className="space-y-2">
                {cat.excluded.map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5 border-l-4 border-l-red-500">
                    <span className="text-sm text-white/80 flex-1">{item}</span>
                    <X className="w-4 h-4 text-red-400 shrink-0" />
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-purple-500/20 bg-purple-500/[0.03] p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-xl bg-purple-500/15 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-purple-400" />
                </div>
                <h3 className="text-base font-bold text-purple-400">Waiting Periods</h3>
                <span className="ml-auto text-xs font-bold px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-400">{cat.waitingPeriods.length}</span>
              </div>
              <div className="space-y-2">
                {cat.waitingPeriods.map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5 border-l-4 border-l-purple-500">
                    <span className="text-sm text-white/80 flex-1 pr-2">{item.item}</span>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-400 whitespace-nowrap">{item.period}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      )}

      {report.recommendations && report.recommendations.length > 0 && (
        <div className="mt-6 rounded-2xl border border-secondary/15 bg-secondary/[0.03] p-6">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="w-4 h-4 text-secondary" />
            <h3 className="text-sm font-bold text-secondary uppercase tracking-wider">Expert Recommendations</h3>
          </div>
          <div className="flex flex-col gap-2">
            {report.recommendations.map((rec, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-white/5">
                <span className="w-5 h-5 rounded-full bg-secondary/20 text-secondary text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
                <span className="text-sm text-white/70">{rec}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}

export default function Analyze() {
  const [mode, setMode] = useState<"upload" | "select">("select");
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const [provider, setProvider] = useState("");
  const [policyName, setPolicyName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [aiReport, setAiReport] = useState<AIReport | null>(null);

  async function handleAnalyze() {
    setLoading(true);
    setError(null);
    setAiReport(null);
    window.scrollTo({ top: 0, behavior: "smooth" });

    try {
      const body = mode === "upload"
        ? { mode: "upload", fileName: uploadedFile }
        : { mode: "select", provider, policyName };

      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Analysis failed");
      setAiReport(data.result);
    } catch (err: any) {
      setError(err.message || "Failed to generate AI report. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleFile(name: string) {
    setUploadedFile(name);
  }

  function handleSavePolicy() {
    if (!aiReport) return;
    const saved = JSON.parse(localStorage.getItem("clario_saved_policies") || "[]");
    const newPolicy = {
      id: Date.now().toString(),
      title: aiReport.policyTitle || policyName || uploadedFile || "Unknown Policy",
      date: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
      score: aiReport.overallScore,
      data: aiReport,
    };
    saved.unshift(newPolicy);
    localStorage.setItem("clario_saved_policies", JSON.stringify(saved.slice(0, 20)));
    alert("Policy saved to My Policies Dashboard!");
  }

  const canAnalyze =
    !loading &&
    ((mode === "upload" && !!uploadedFile) || (mode === "select" && !!provider && !!policyName));

  const policyLabel = mode === "upload" ? uploadedFile || "Uploaded Document" : `${provider} — ${policyName}`;

  return (
    <div className="min-h-screen bg-[#090c14] pt-24 pb-20">
      <div className="container mx-auto px-6 max-w-6xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-sm font-semibold mb-5">
            <Sparkles className="w-4 h-4" /> AI Coverage Analyser
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">Analyse Your Policy</h1>
          <p className="text-white/50 text-lg max-w-2xl mx-auto">
            Upload your insurance document or select your provider — our AI generates a real, fact-based coverage report instantly.
          </p>
        </motion.div>

        <div className="flex justify-center mb-8">
          <div className="flex gap-1 p-1 rounded-full border border-white/10 bg-white/[0.03]">
            {(["select", "upload"] as const).map((m) => (
              <button
                key={m}
                onClick={() => { setMode(m); setAiReport(null); setError(null); setUploadedFile(null); }}
                data-testid={`button-mode-${m}`}
                className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 ${
                  mode === m ? "bg-primary text-white shadow-lg" : "text-white/50 hover:text-white"
                }`}
              >
                {m === "select" ? "Choose Provider" : "Upload PDF"}
              </button>
            ))}
          </div>
        </div>

        <motion.div
          layout
          className="rounded-3xl border border-white/8 p-6 md:p-10 mb-10 relative overflow-hidden"
          style={{ background: "rgba(255,255,255,0.02)" }}
        >
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-secondary/50 to-transparent" />

          <AnimatePresence mode="wait">
            {mode === "upload" ? (
              <motion.div key="upload" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                {uploadedFile ? (
                  <div className="flex items-center gap-4 p-6 rounded-2xl border border-secondary/30 bg-secondary/5">
                    <div className="w-12 h-12 rounded-xl bg-secondary/15 flex items-center justify-center">
                      <FileText className="w-6 h-6 text-secondary" />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-white">{uploadedFile}</div>
                      <div className="text-sm text-secondary">Ready to analyse with AI</div>
                    </div>
                    <button onClick={() => setUploadedFile(null)} className="text-white/40 hover:text-white transition-colors">
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                ) : (
                  <UploadZone onFile={handleFile} />
                )}
              </motion.div>
            ) : (
              <motion.div key="select" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label className="text-white/50 text-xs font-bold uppercase tracking-widest block mb-3">Insurance Provider</Label>
                  <Select value={provider} onValueChange={(v) => { setProvider(v); setPolicyName(""); }}>
                    <SelectTrigger className="bg-white/5 border-white/12 text-white h-12 rounded-xl" data-testid="select-provider">
                      <SelectValue placeholder="Select provider..." />
                    </SelectTrigger>
                    <SelectContent className="bg-[#0a0e14] border-white/10 text-white">
                      {PROVIDERS.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-white/50 text-xs font-bold uppercase tracking-widest block mb-3">Policy Name</Label>
                  <Select value={policyName} onValueChange={setPolicyName} disabled={!provider}>
                    <SelectTrigger className="bg-white/5 border-white/12 text-white h-12 rounded-xl" data-testid="select-policy-name">
                      <SelectValue placeholder={provider ? "Select policy..." : "Choose provider first"} />
                    </SelectTrigger>
                    <SelectContent className="bg-[#0a0e14] border-white/10 text-white">
                      {(PROVIDER_POLICIES[provider] || []).map((pol) => (
                        <SelectItem key={pol} value={pol}>{pol}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-8 flex flex-col items-center gap-3">
            <Button
              onClick={handleAnalyze}
              disabled={!canAnalyze}
              data-testid="button-analyze"
              className="bg-secondary hover:bg-secondary/90 text-white rounded-full px-12 h-13 text-base font-bold disabled:opacity-40 transition-all"
              style={{ boxShadow: canAnalyze ? "0 0 30px rgba(8,217,214,0.35)" : "none" }}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" /> Generating AI Report...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-2" /> Generate AI Coverage Report
                </>
              )}
            </Button>
            {loading && (
              <p className="text-white/35 text-xs animate-pulse">Analysing with Gemini AI — this takes 5–10 seconds</p>
            )}
          </div>
        </motion.div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-5 rounded-2xl border border-red-500/30 bg-red-500/5 flex items-center gap-3"
          >
            <XCircle className="w-5 h-5 text-red-400 shrink-0" />
            <div>
              <div className="text-sm font-semibold text-red-400">Analysis failed</div>
              <div className="text-xs text-white/50 mt-0.5">{error}</div>
            </div>
          </motion.div>
        )}

        <AnimatePresence>
          {aiReport && (
            <AIAnalysisReport report={aiReport} policyLabel={policyLabel} onSave={handleSavePolicy} />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
