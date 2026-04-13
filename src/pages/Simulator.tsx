import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Droplets, Ambulance, Bone, HeartPulse, Activity, Baby, Brain,
  Stethoscope, ChevronRight, CheckCircle, TrendingUp, RotateCcw,
  Building2, Bed, MapPin, Clock, Edit3, Shield, AlertTriangle,
  Lightbulb, ThumbsUp, X, Info, Wifi, WifiOff, Loader2,
  FileText, CreditCard, Users, Hospital
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SCENARIOS } from "@/data/insurance";

const SCENARIO_ICONS: Record<string, React.ElementType> = {
  dengue: Droplets,
  accident: Ambulance,
  fracture: Bone,
  surgery: HeartPulse,
  icu: Activity,
  maternity: Baby,
  cancer: Brain,
};

const CITIES = ["Mumbai", "Delhi", "Bangalore", "Chennai", "Kolkata", "Hyderabad", "Pune", "Ahmedabad", "Jaipur", "Lucknow", "Surat", "Kochi"];
const HOSPITAL_TYPES = ["Government Hospital", "Private Hospital", "Super-Specialty Hospital", "Corporate Hospital", "Nursing Home / Clinic"];
const ROOM_TYPES = ["General Ward", "Semi-Private Room", "Private Room", "Single AC Room", "ICU / ICCU"];
const POLICY_TYPES = ["Individual", "Family Floater", "Group / Corporate", "Senior Citizen"];
const PRE_EXISTING = ["Diabetes", "Hypertension", "Heart Disease", "Asthma / COPD", "Kidney Disease", "Thyroid Disorder", "Cancer History", "Obesity", "Arthritis"];
const PROVIDERS = [
  "Star Health", "HDFC ERGO", "Bajaj Allianz", "ICICI Lombard",
  "Niva Bupa", "Care Health", "Aditya Birla Health", "New India Assurance",
  "United India", "Oriental Insurance", "SBI Health", "Reliance Health", "Other"
];
const WAITING_PERIODS = ["Completed (> 4 years)", "Completed (2–4 years)", "Partial (1–2 years)", "New Policy (< 1 year)"];

type Step = "pick" | "insurance" | "details" | "results";
const STEP_LABELS: Step[] = ["pick", "insurance", "details", "results"];
const STEP_TITLES = ["Scenario", "Your Policy", "Claim Details", "AI Results"];

type InsuranceDetails = {
  provider: string;
  policyName: string;
  policyType: string;
  sumInsured: string;
  deductible: string;
  copay: string;
  waitingPeriod: string;
  networkHospital: boolean;
  preExisting: string[];
  roomRentLimit: string;
  dayCare: boolean;
};

type AIResult = {
  coverageAmount: number;
  oopAmount: number;
  approvalChance: number;
  coveragePct: number;
  deductibleApplied: number;
  copayAmount: number;
  roomRentDeduction: number;
  preExistingImpact: string;
  settlementType: "cashless" | "reimbursement";
  estimatedSettlementDays: number;
  approvalReasoning: string[];
  coveredItems: string[];
  exclusions: string[];
  tips: string[];
  warnings: string[];
  aiSummary: string;
};

function useCountUp(target: number, duration = 1200) {
  const [value, setValue] = useState(0);
  const prev = useRef(0);
  useEffect(() => {
    const start = prev.current;
    prev.current = target;
    let t0: number | null = null;
    function step(ts: number) {
      if (!t0) t0 = ts;
      const prog = Math.min((ts - t0) / duration, 1);
      const ease = 1 - Math.pow(1 - prog, 4);
      setValue(Math.floor(start + (target - start) * ease));
      if (prog < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }, [target, duration]);
  return value;
}

function ToggleChip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200 ${
        active
          ? "bg-primary/15 border-primary/40 text-primary"
          : "bg-white/4 border-white/10 text-white/45 hover:border-white/25 hover:text-white/70"
      }`}
    >
      {label}
    </button>
  );
}

export default function Simulator() {
  const [step, setStep] = useState<Step>("pick");
  const [selected, setSelected] = useState<typeof SCENARIOS[0] | null>(null);
  const [customText, setCustomText] = useState("");
  const [useCustom, setUseCustom] = useState(false);

  const [insurance, setInsurance] = useState<InsuranceDetails>({
    provider: "",
    policyName: "",
    policyType: "Individual",
    sumInsured: "500000",
    deductible: "0",
    copay: "0",
    waitingPeriod: "Completed (> 4 years)",
    networkHospital: true,
    preExisting: [],
    roomRentLimit: "",
    dayCare: true,
  });

  const [bill, setBill] = useState("");
  const [city, setCity] = useState("Mumbai");
  const [hospitalType, setHospitalType] = useState("Private Hospital");
  const [duration, setDuration] = useState("3");
  const [roomType, setRoomType] = useState("Private Room");

  const [loading, setLoading] = useState(false);
  const [aiResult, setAiResult] = useState<AIResult | null>(null);
  const [aiError, setAiError] = useState("");

  const scenario = selected || SCENARIOS[0];
  const billNum = parseInt(bill) || scenario.defaultBill;

  const animCoverage = useCountUp(aiResult?.coverageAmount ?? 0);
  const animOop = useCountUp(aiResult?.oopAmount ?? 0);
  const animApproval = useCountUp(aiResult?.approvalChance ?? 0);

  function togglePreExisting(condition: string) {
    setInsurance((prev) => ({
      ...prev,
      preExisting: prev.preExisting.includes(condition)
        ? prev.preExisting.filter((c) => c !== condition)
        : [...prev.preExisting, condition],
    }));
  }

  function updateIns<K extends keyof InsuranceDetails>(key: K, val: InsuranceDetails[K]) {
    setInsurance((prev) => ({ ...prev, [key]: val }));
  }

  async function runSimulation() {
  setLoading(true);
  setAiError("");
  setAiResult(null);
  setStep("results");

  try {
    const resp = await fetch("http://localhost:3001/api/simulate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        scenario: useCustom ? "custom" : scenario.name,
        customScenario: useCustom ? customText : null,
        bill: billNum,
        city,
        hospitalType,
        duration: parseInt(duration) || 3,
        roomType,
        insurance,
      }),
    });

    if (!resp.ok) {
      throw new Error(`Server error: ${resp.status} ${resp.statusText}`);
    }

    const data = await resp.json();

    if (!data.success) {
      throw new Error(data.error || "Simulation failed");
    }

    setAiResult(data.result);
  } catch (err: any) {
    console.error("Simulation error:", err);
    setAiError(err.message || "Failed to connect to AI server");
  } finally {
    setLoading(false);
  }
}
  function reset() {
    setStep("pick");
    setSelected(null);
    setCustomText("");
    setUseCustom(false);
    setBill("");
    setDuration("3");
    setAiResult(null);
    setAiError("");
  }

  const canPickProceed = useCustom ? customText.trim().length > 6 : !!selected;
  const stepIdx = STEP_LABELS.indexOf(step);

  return (
    <div className="min-h-screen bg-[#090c14] pt-24 pb-20">
      <div className="container mx-auto px-6 max-w-5xl">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-semibold mb-5">
            <TrendingUp className="w-4 h-4" /> AI Scenario Simulator
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">What happens if...?</h1>
          <p className="text-white/50 text-lg">
            Enter your real policy details — our AI will simulate exactly what you'd get paid.
          </p>
        </motion.div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-2 mb-12 flex-wrap">
          {STEP_LABELS.map((s, i) => {
            const done = i < stepIdx;
            const active = i === stepIdx;
            return (
              <React.Fragment key={s}>
                <div className={`flex items-center gap-2 transition-all duration-300 ${active ? "opacity-100" : done ? "opacity-60" : "opacity-25"}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${active ? "bg-primary text-[#090c14]" : done ? "bg-primary/40 text-primary" : "bg-white/8 text-white/40"}`}>
                    {done ? <CheckCircle className="w-4 h-4" /> : i + 1}
                  </div>
                  <span className={`text-sm font-medium hidden sm:block ${active ? "text-white" : "text-white/40"}`}>{STEP_TITLES[i]}</span>
                </div>
                {i < STEP_LABELS.length - 1 && <div className={`w-8 h-px transition-colors ${i < stepIdx ? "bg-primary/40" : "bg-white/10"}`} />}
              </React.Fragment>
            );
          })}
        </div>

        <AnimatePresence mode="wait">

          {/* ── STEP 1: PICK SCENARIO ── */}
          {step === "pick" && (
            <motion.div key="pick" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.28 }}>
              <div className="rounded-3xl border border-white/8 p-8 md:p-10 mb-8" style={{ background: "rgba(255,255,255,0.02)" }}>
                <h2 className="text-xl font-bold text-white mb-6">Select a medical scenario</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-8">
                  {SCENARIOS.map((s) => {
                    const Icon = SCENARIO_ICONS[s.id] || Stethoscope;
                    const isActive = selected?.id === s.id && !useCustom;
                    return (
                      <button
                        key={s.id}
                        onClick={() => { setSelected(s); setUseCustom(false); }}
                        data-testid={`button-scenario-${s.id}`}
                        className={`flex flex-col items-center gap-3 p-5 rounded-2xl border text-sm font-semibold transition-all duration-200 ${
                          isActive ? "scale-[1.03]" : "bg-white/[0.025] text-white/55 border-white/8 hover:border-white/15 hover:text-white"
                        }`}
                        style={isActive ? { background: s.color + "18", borderColor: s.color + "50", color: "white", boxShadow: `0 0 20px ${s.color}18` } : {}}
                      >
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center transition-colors" style={isActive ? { background: s.color + "22" } : { background: "rgba(255,255,255,0.04)" }}>
                          <Icon className="w-6 h-6" style={{ color: isActive ? s.color : undefined }} />
                        </div>
                        <span className="text-center leading-tight">{s.name}</span>
                        {isActive && <CheckCircle className="w-4 h-4" style={{ color: s.color }} />}
                      </button>
                    );
                  })}
                </div>

                {/* Custom */}
                <div className="border-t border-white/8 pt-8">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center">
                      <Edit3 className="w-4 h-4 text-white/50" />
                    </div>
                    <h3 className="text-base font-semibold text-white">Or describe your own scenario</h3>
                    <button
                      onClick={() => { setUseCustom((v) => !v); if (!useCustom) setSelected(null); }}
                      data-testid="button-toggle-custom"
                      className={`ml-auto px-4 py-1.5 rounded-full text-xs font-semibold border transition-all ${useCustom ? "bg-primary/15 text-primary border-primary/40" : "border-white/15 text-white/45 hover:text-white"}`}
                    >
                      {useCustom ? "✓ Custom Active" : "Use Custom"}
                    </button>
                  </div>
                  {useCustom && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}>
                      <textarea
                        value={customText}
                        onChange={(e) => setCustomText(e.target.value)}
                        placeholder="E.g. 'I had a severe asthma attack requiring 3 days of hospitalisation with oxygen therapy, nebulisation, and IV medication in a private hospital in Pune...'"
                        data-testid="textarea-custom-scenario"
                        rows={4}
                        className="w-full bg-white/4 border border-white/10 text-white rounded-2xl p-4 text-sm placeholder:text-white/25 focus:outline-none focus:border-primary/50 resize-none"
                      />
                      <div className="text-xs text-primary/60 mt-2 flex items-center gap-1.5">
                        <Info className="w-3 h-3" /> The more detail you provide, the more accurate the AI simulation will be.
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={() => setStep("insurance")}
                  disabled={!canPickProceed}
                  className="bg-primary hover:bg-primary/90 text-[#090c14] font-bold rounded-full px-10 h-12 disabled:opacity-40"
                  style={{ boxShadow: canPickProceed ? "0 0 24px rgba(8,217,214,0.35)" : "none" }}
                >
                  Next: Your Policy <ChevronRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* ── STEP 2: INSURANCE DETAILS ── */}
          {step === "insurance" && (
            <motion.div key="insurance" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.28 }}>
              <div className="rounded-3xl border border-white/8 p-8 md:p-10 mb-8" style={{ background: "rgba(255,255,255,0.02)" }}>
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Your Insurance Policy Details</h2>
                    <p className="text-white/40 text-sm">The more accurate your details, the better the AI simulation</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                  {/* Provider */}
                  <div>
                    <Label className="text-white/45 text-[10px] font-bold uppercase tracking-widest block mb-2.5">
                      <Building2 className="w-3 h-3 inline mr-1" /> Insurance Provider
                    </Label>
                    <Select value={insurance.provider} onValueChange={(v) => updateIns("provider", v)}>
                      <SelectTrigger className="bg-white/4 border-white/10 text-white h-12 rounded-xl">
                        <SelectValue placeholder="Select provider" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#0a0e14] border-white/10 text-white">
                        {PROVIDERS.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Policy Name */}
                  <div>
                    <Label className="text-white/45 text-[10px] font-bold uppercase tracking-widest block mb-2.5">
                      <FileText className="w-3 h-3 inline mr-1" /> Policy Name (optional)
                    </Label>
                    <Input
                      value={insurance.policyName}
                      onChange={(e) => updateIns("policyName", e.target.value)}
                      placeholder="e.g. Star Comprehensive, HDFC Optima"
                      className="bg-white/4 border-white/10 text-white h-12 rounded-xl placeholder:text-white/20 focus-visible:ring-primary"
                    />
                  </div>

                  {/* Policy Type */}
                  <div>
                    <Label className="text-white/45 text-[10px] font-bold uppercase tracking-widest block mb-2.5">
                      <Users className="w-3 h-3 inline mr-1" /> Policy Type
                    </Label>
                    <Select value={insurance.policyType} onValueChange={(v) => updateIns("policyType", v)}>
                      <SelectTrigger className="bg-white/4 border-white/10 text-white h-12 rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-[#0a0e14] border-white/10 text-white">
                        {POLICY_TYPES.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Sum Insured */}
                  <div>
                    <Label className="text-white/45 text-[10px] font-bold uppercase tracking-widest block mb-2.5">
                      <Shield className="w-3 h-3 inline mr-1" /> Sum Insured (₹)
                    </Label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/35 font-bold">₹</span>
                      <Input
                        value={insurance.sumInsured}
                        onChange={(e) => updateIns("sumInsured", e.target.value.replace(/[^0-9]/g, ""))}
                        placeholder="500000"
                        className="pl-8 bg-white/4 border-white/10 text-white h-12 rounded-xl placeholder:text-white/20 focus-visible:ring-primary font-bold"
                      />
                    </div>
                  </div>

                  {/* Deductible */}
                  <div>
                    <Label className="text-white/45 text-[10px] font-bold uppercase tracking-widest block mb-2.5">
                      <CreditCard className="w-3 h-3 inline mr-1" /> Deductible / Threshold (₹)
                    </Label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/35 font-bold">₹</span>
                      <Input
                        value={insurance.deductible}
                        onChange={(e) => updateIns("deductible", e.target.value.replace(/[^0-9]/g, ""))}
                        placeholder="0"
                        className="pl-8 bg-white/4 border-white/10 text-white h-12 rounded-xl placeholder:text-white/20 focus-visible:ring-primary font-bold"
                      />
                    </div>
                    <div className="text-[10px] text-white/25 mt-1.5">Amount you pay before insurance kicks in</div>
                  </div>

                  {/* Copay */}
                  <div>
                    <Label className="text-white/45 text-[10px] font-bold uppercase tracking-widest block mb-2.5">
                      Copay %
                    </Label>
                    <Select value={insurance.copay} onValueChange={(v) => updateIns("copay", v)}>
                      <SelectTrigger className="bg-white/4 border-white/10 text-white h-12 rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-[#0a0e14] border-white/10 text-white">
                        {["0", "10", "20", "30"].map((v) => <SelectItem key={v} value={v}>{v === "0" ? "No Copay" : `${v}% Copay`}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <div className="text-[10px] text-white/25 mt-1.5">% of claim you always pay regardless</div>
                  </div>

                  {/* Waiting Period */}
                  <div>
                    <Label className="text-white/45 text-[10px] font-bold uppercase tracking-widest block mb-2.5">
                      <Clock className="w-3 h-3 inline mr-1" /> Waiting Period Status
                    </Label>
                    <Select value={insurance.waitingPeriod} onValueChange={(v) => updateIns("waitingPeriod", v)}>
                      <SelectTrigger className="bg-white/4 border-white/10 text-white h-12 rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-[#0a0e14] border-white/10 text-white">
                        {WAITING_PERIODS.map((w) => <SelectItem key={w} value={w}>{w}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Room Rent Limit */}
                  <div>
                    <Label className="text-white/45 text-[10px] font-bold uppercase tracking-widest block mb-2.5">
                      <Bed className="w-3 h-3 inline mr-1" /> Room Rent Sub-limit per day (₹) — leave blank if none
                    </Label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/35 font-bold">₹</span>
                      <Input
                        value={insurance.roomRentLimit}
                        onChange={(e) => updateIns("roomRentLimit", e.target.value.replace(/[^0-9]/g, ""))}
                        placeholder="e.g. 3000 or blank"
                        className="pl-8 bg-white/4 border-white/10 text-white h-12 rounded-xl placeholder:text-white/20 focus-visible:ring-primary"
                      />
                    </div>
                  </div>

                  {/* Toggles */}
                  <div className="md:col-span-2 grid grid-cols-2 gap-4">
                    <button
                      onClick={() => updateIns("networkHospital", !insurance.networkHospital)}
                      className={`flex items-center gap-3 p-4 rounded-2xl border transition-all ${insurance.networkHospital ? "border-primary/35 bg-primary/8" : "border-white/8 bg-white/[0.02]"}`}
                    >
                      <Hospital className={`w-5 h-5 ${insurance.networkHospital ? "text-primary" : "text-white/35"}`} />
                      <div className="text-left">
                        <div className={`text-sm font-semibold ${insurance.networkHospital ? "text-primary" : "text-white/60"}`}>Network / Cashless Hospital</div>
                        <div className="text-[10px] text-white/30">{insurance.networkHospital ? "Eligible for cashless treatment" : "Will file for reimbursement"}</div>
                      </div>
                      <div className={`ml-auto w-9 h-5 rounded-full transition-all ${insurance.networkHospital ? "bg-primary" : "bg-white/10"}`}>
                        <div className={`w-4 h-4 bg-white rounded-full mt-0.5 transition-all ${insurance.networkHospital ? "ml-4.5" : "ml-0.5"}`} />
                      </div>
                    </button>

                    <button
                      onClick={() => updateIns("dayCare", !insurance.dayCare)}
                      className={`flex items-center gap-3 p-4 rounded-2xl border transition-all ${insurance.dayCare ? "border-primary/35 bg-primary/8" : "border-white/8 bg-white/[0.02]"}`}
                    >
                      <CheckCircle className={`w-5 h-5 ${insurance.dayCare ? "text-primary" : "text-white/35"}`} />
                      <div className="text-left">
                        <div className={`text-sm font-semibold ${insurance.dayCare ? "text-primary" : "text-white/60"}`}>Day Care Covered</div>
                        <div className="text-[10px] text-white/30">{insurance.dayCare ? "Less than 24 hrs covered" : "Only 24+ hr admissions"}</div>
                      </div>
                      <div className={`ml-auto w-9 h-5 rounded-full transition-all ${insurance.dayCare ? "bg-primary" : "bg-white/10"}`}>
                        <div className={`w-4 h-4 bg-white rounded-full mt-0.5 transition-all ${insurance.dayCare ? "ml-4.5" : "ml-0.5"}`} />
                      </div>
                    </button>
                  </div>

                  {/* Pre-existing conditions */}
                  <div className="md:col-span-2">
                    <Label className="text-white/45 text-[10px] font-bold uppercase tracking-widest block mb-3">
                      Pre-existing Conditions (select all that apply)
                    </Label>
                    <div className="flex flex-wrap gap-2">
                      {PRE_EXISTING.map((cond) => (
                        <ToggleChip
                          key={cond}
                          label={cond}
                          active={insurance.preExisting.includes(cond)}
                          onClick={() => togglePreExisting(cond)}
                        />
                      ))}
                    </div>
                    {insurance.preExisting.length > 0 && (
                      <div className="mt-3 text-[11px] text-amber-400/70 flex items-center gap-1.5">
                        <AlertTriangle className="w-3 h-3" />
                        Pre-existing conditions may affect claim eligibility based on waiting period status
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-between">
                <Button onClick={() => setStep("pick")} variant="ghost" className="text-white/45 hover:text-white rounded-full px-6 h-12">Back</Button>
                <Button
                  onClick={() => setStep("details")}
                  className="bg-primary hover:bg-primary/90 text-[#090c14] font-bold rounded-full px-10 h-12"
                  style={{ boxShadow: "0 0 24px rgba(8,217,214,0.3)" }}
                >
                  Next: Claim Details <ChevronRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* ── STEP 3: CLAIM / HOSPITAL DETAILS ── */}
          {step === "details" && (
            <motion.div key="details" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.28 }}>
              <div className="rounded-3xl border border-white/8 p-8 md:p-10 mb-8" style={{ background: "rgba(255,255,255,0.02)" }}>

                {/* Summary banner */}
                <div className="flex flex-wrap gap-4 p-4 rounded-2xl border border-white/8 bg-white/[0.015] mb-8">
                  <div className="text-xs text-white/50 flex items-center gap-1.5">
                    <Stethoscope className="w-3.5 h-3.5 text-primary" />
                    <span className="font-semibold text-white/70">{useCustom ? "Custom Scenario" : scenario.name}</span>
                  </div>
                  {insurance.provider && (
                    <div className="text-xs text-white/50 flex items-center gap-1.5">
                      <Shield className="w-3.5 h-3.5 text-primary" />
                      <span className="font-semibold text-white/70">{insurance.provider}</span>
                    </div>
                  )}
                  <div className="text-xs text-white/50 flex items-center gap-1.5">
                    <span className="font-semibold text-primary">₹{Number(insurance.sumInsured).toLocaleString("en-IN")}</span>
                    <span>Sum Insured</span>
                  </div>
                  <button onClick={() => setStep("pick")} className="ml-auto text-white/30 hover:text-primary text-xs transition-colors">Edit</button>
                </div>

                <h2 className="text-xl font-bold text-white mb-6">Hospitalisation Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                  {/* Bill */}
                  <div className="md:col-span-2">
                    <Label className="text-white/45 text-[10px] font-bold uppercase tracking-widest block mb-2.5">
                      Estimated Hospital Bill (₹)
                    </Label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/35 font-bold text-lg">₹</span>
                      <Input
                        value={bill}
                        onChange={(e) => setBill(e.target.value.replace(/[^0-9]/g, ""))}
                        placeholder={`${scenario.defaultBill.toLocaleString()} (default for ${scenario.name})`}
                        data-testid="input-bill"
                        className="pl-9 bg-white/4 border-white/10 text-white h-14 rounded-xl text-xl font-bold placeholder:text-white/20 focus-visible:ring-primary"
                      />
                    </div>
                  </div>

                  {/* City */}
                  <div>
                    <Label className="text-white/45 text-[10px] font-bold uppercase tracking-widest block mb-2.5">
                      <MapPin className="w-3 h-3 inline mr-1" /> City
                    </Label>
                    <Select value={city} onValueChange={setCity}>
                      <SelectTrigger className="bg-white/4 border-white/10 text-white h-12 rounded-xl" data-testid="select-sim-city">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-[#0a0e14] border-white/10 text-white">
                        {CITIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Hospital Type */}
                  <div>
                    <Label className="text-white/45 text-[10px] font-bold uppercase tracking-widest block mb-2.5">
                      <Building2 className="w-3 h-3 inline mr-1" /> Hospital Type
                    </Label>
                    <Select value={hospitalType} onValueChange={setHospitalType}>
                      <SelectTrigger className="bg-white/4 border-white/10 text-white h-12 rounded-xl" data-testid="select-hospital-type">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-[#0a0e14] border-white/10 text-white">
                        {HOSPITAL_TYPES.map((h) => <SelectItem key={h} value={h}>{h}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Duration */}
                  <div>
                    <Label className="text-white/45 text-[10px] font-bold uppercase tracking-widest block mb-2.5">
                      <Clock className="w-3 h-3 inline mr-1" /> Duration of Stay (days)
                    </Label>
                    <Input
                      value={duration}
                      onChange={(e) => setDuration(e.target.value.replace(/[^0-9]/g, ""))}
                      placeholder="3"
                      data-testid="input-duration"
                      className="bg-white/4 border-white/10 text-white h-12 rounded-xl font-bold focus-visible:ring-primary"
                    />
                  </div>

                  {/* Room Type */}
                  <div>
                    <Label className="text-white/45 text-[10px] font-bold uppercase tracking-widest block mb-2.5">
                      <Bed className="w-3 h-3 inline mr-1" /> Room Type
                    </Label>
                    <Select value={roomType} onValueChange={setRoomType}>
                      <SelectTrigger className="bg-white/4 border-white/10 text-white h-12 rounded-xl" data-testid="select-room-type">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-[#0a0e14] border-white/10 text-white">
                        {ROOM_TYPES.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="flex justify-between">
                <Button onClick={() => setStep("insurance")} variant="ghost" className="text-white/45 hover:text-white rounded-full px-6 h-12">Back</Button>
                <Button
                  onClick={runSimulation}
                  className="bg-primary hover:bg-primary/90 text-[#090c14] font-bold rounded-full px-10 h-12"
                  style={{ boxShadow: "0 0 28px rgba(8,217,214,0.4)" }}
                  data-testid="button-simulate"
                >
                  Run AI Simulation <ChevronRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* ── STEP 4: AI RESULTS ── */}
          {step === "results" && (
            <motion.div key="results" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.3 }}>

              {/* Loading */}
              {loading && (
                <div className="flex flex-col items-center justify-center py-28">
                  <div className="relative mb-8">
                    <div className="w-20 h-20 rounded-full border-2 border-primary/20 flex items-center justify-center">
                      <Loader2 className="w-9 h-9 text-primary animate-spin" />
                    </div>
                    <motion.div
                      animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0, 0.3] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute inset-0 rounded-full border border-primary/30"
                    />
                  </div>
                  <div className="text-white font-bold text-xl mb-2">AI is analysing your claim...</div>
                  <div className="text-white/40 text-sm">Applying IRDAI guidelines, policy terms &amp; real settlement data</div>
                </div>
              )}

              {/* Error */}
              {!loading && aiError && (
                <div className="text-center py-20">
                  <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-6">
                    <WifiOff className="w-7 h-7 text-red-400" />
                  </div>
                  <div className="text-white font-bold text-xl mb-3">Could not connect to AI server</div>
                  <div className="text-white/40 text-sm mb-2 max-w-md mx-auto">{aiError}</div>
                  <div className="text-white/30 text-xs mb-8 max-w-sm mx-auto">
                    Make sure the backend server is running: <code className="text-primary bg-white/5 px-2 py-0.5 rounded">npm run dev</code>
                  </div>
                  <div className="flex gap-4 justify-center">
                    <Button onClick={runSimulation} className="bg-primary text-[#090c14] font-bold rounded-full px-8 h-11">
                      Retry
                    </Button>
                    <Button onClick={() => setStep("details")} variant="outline" className="border-white/15 text-white rounded-full px-8 h-11">
                      Edit Details
                    </Button>
                  </div>
                </div>
              )}

              {/* Results */}
              {!loading && !aiError && aiResult && (
                <>
                  {/* Context bar */}
                  <div className="flex flex-wrap gap-4 mb-6 p-4 rounded-2xl border border-white/8 bg-white/[0.015]">
                    <div className="flex items-center gap-1.5 text-xs text-white/50">
                      <Stethoscope className="w-3.5 h-3.5 text-primary" />
                      {useCustom ? "Custom Scenario" : scenario.name}
                    </div>
                    {insurance.provider && (
                      <div className="flex items-center gap-1.5 text-xs text-white/50">
                        <Shield className="w-3.5 h-3.5 text-primary" />
                        {insurance.provider} {insurance.policyName && `· ${insurance.policyName}`}
                      </div>
                    )}
                    <div className="flex items-center gap-1.5 text-xs text-white/50">
                      <MapPin className="w-3.5 h-3.5 text-primary" /> {city} · {hospitalType} · {duration}d · {roomType}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs ml-auto">
                      {aiResult.settlementType === "cashless"
                        ? <><Wifi className="w-3.5 h-3.5 text-emerald-400" /><span className="text-emerald-400 font-semibold">Cashless</span></>
                        : <><WifiOff className="w-3.5 h-3.5 text-amber-400" /><span className="text-amber-400 font-semibold">Reimbursement</span></>
                      }
                    </div>
                    <button onClick={reset} className="flex items-center gap-1.5 text-xs text-white/35 hover:text-primary transition-colors">
                      <RotateCcw className="w-3.5 h-3.5" /> Reset
                    </button>
                  </div>

                  {/* AI Summary */}
                  <div className="p-5 rounded-2xl border border-primary/20 bg-primary/5 mb-6 flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl bg-primary/15 flex items-center justify-center shrink-0 mt-0.5">
                      <Brain className="w-4 h-4 text-primary" />
                    </div>
                    <p className="text-white/80 text-sm leading-relaxed">{aiResult.aiSummary}</p>
                  </div>

                  {/* Main figures */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    {[
                      { label: "Hospital Bill", value: `₹${billNum.toLocaleString("en-IN")}`, sub: "Total estimate", color: "#ef4444", bg: "rgba(239,68,68,0.06)" },
                      { label: "Insurance Pays", value: `₹${animCoverage.toLocaleString("en-IN")}`, sub: `${aiResult.coveragePct}% of bill`, color: "#08d9d6", bg: "rgba(8,217,214,0.06)" },
                      { label: "You Pay", value: `₹${animOop.toLocaleString("en-IN")}`, sub: "Out of pocket", color: "#f59e0b", bg: "rgba(245,158,11,0.06)" },
                      { label: "Approval Chance", value: `${animApproval}%`, sub: "AI estimate", color: animApproval >= 80 ? "#08d9d6" : animApproval >= 60 ? "#f59e0b" : "#ef4444", bg: animApproval >= 80 ? "rgba(8,217,214,0.06)" : "rgba(245,158,11,0.06)" },
                    ].map((stat, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.07 }}
                        className="text-center p-5 rounded-2xl border"
                        style={{ background: stat.bg, borderColor: stat.color + "22" }}
                      >
                        <div className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: stat.color + "99" }}>{stat.label}</div>
                        <div className="text-2xl font-black mb-1" style={{ color: stat.color }}>{stat.value}</div>
                        <div className="text-[10px] text-white/30">{stat.sub}</div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Breakdown grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">

                    {/* Approval Bar + breakdown */}
                    <div className="p-6 rounded-2xl border border-white/8 bg-white/[0.02]">
                      <div className="flex justify-between items-end mb-4">
                        <div>
                          <div className="font-bold text-white mb-0.5">Claim Approval Likelihood</div>
                          <div className="text-[11px] text-white/35">Based on AI analysis of policy &amp; scenario</div>
                        </div>
                        <span className="text-3xl font-black" style={{ color: aiResult.approvalChance >= 80 ? "#08d9d6" : aiResult.approvalChance >= 60 ? "#f59e0b" : "#ef4444" }}>
                          {aiResult.approvalChance}%
                        </span>
                      </div>
                      <div className="h-3 bg-white/5 rounded-full overflow-hidden mb-5">
                        <motion.div
                          className="h-full rounded-full"
                          style={{ background: aiResult.approvalChance >= 80 ? "#08d9d6" : aiResult.approvalChance >= 60 ? "#f59e0b" : "#ef4444" }}
                          initial={{ width: 0 }}
                          animate={{ width: `${aiResult.approvalChance}%` }}
                          transition={{ duration: 1.5, ease: [0.2, 0.65, 0.3, 0.9] }}
                        />
                      </div>
                      <div className="space-y-2.5">
                        {[
                          { l: "Deductible Applied", v: aiResult.deductibleApplied === 0 ? "None" : `₹${aiResult.deductibleApplied.toLocaleString("en-IN")}` },
                          { l: "Copay Deduction", v: aiResult.copayAmount === 0 ? "None" : `₹${aiResult.copayAmount.toLocaleString("en-IN")}` },
                          { l: "Room Rent Deduction", v: aiResult.roomRentDeduction === 0 ? "None" : `₹${aiResult.roomRentDeduction.toLocaleString("en-IN")}` },
                          { l: "Settlement Type", v: aiResult.settlementType === "cashless" ? "Cashless" : "Reimbursement" },
                          { l: "Est. Settlement Time", v: `${aiResult.estimatedSettlementDays} days` },
                        ].map((r, i) => (
                          <div key={i} className="flex justify-between text-xs border-b border-white/5 pb-2 last:border-0 last:pb-0">
                            <span className="text-white/40">{r.l}</span>
                            <span className="font-bold text-white">{r.v}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Approval Reasoning */}
                    <div className="p-6 rounded-2xl border border-white/8 bg-white/[0.02]">
                      <div className="font-bold text-white mb-4 flex items-center gap-2">
                        <Brain className="w-4 h-4 text-primary" /> AI Reasoning Factors
                      </div>
                      <div className="space-y-3">
                        {aiResult.approvalReasoning.map((r, i) => (
                          <div key={i} className="flex items-start gap-2.5 text-sm text-white/65">
                            <div className="w-5 h-5 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                              <span className="text-[10px] font-bold text-primary">{i + 1}</span>
                            </div>
                            {r}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* What's covered */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
                    <div className="p-5 rounded-2xl border border-emerald-500/15 bg-emerald-500/[0.03]">
                      <div className="flex items-center gap-2 mb-4 font-bold text-emerald-400 text-sm">
                        <CheckCircle className="w-4 h-4" /> What's Covered
                      </div>
                      <ul className="space-y-2">
                        {aiResult.coveredItems.map((item, i) => (
                          <li key={i} className="text-xs text-white/60 flex items-start gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400/50 mt-1.5 shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-5 rounded-2xl border border-red-500/15 bg-red-500/[0.03]">
                      <div className="flex items-center gap-2 mb-4 font-bold text-red-400 text-sm">
                        <X className="w-4 h-4" /> Likely Exclusions
                      </div>
                      <ul className="space-y-2">
                        {aiResult.exclusions.map((item, i) => (
                          <li key={i} className="text-xs text-white/60 flex items-start gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-red-400/50 mt-1.5 shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-5 rounded-2xl border border-amber-500/15 bg-amber-500/[0.03]">
                      <div className="flex items-center gap-2 mb-4 font-bold text-amber-400 text-sm">
                        <Lightbulb className="w-4 h-4" /> Tips to Maximise
                      </div>
                      <ul className="space-y-2">
                        {aiResult.tips.map((tip, i) => (
                          <li key={i} className="text-xs text-white/60 flex items-start gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-amber-400/50 mt-1.5 shrink-0" />
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Pre-existing impact */}
                  {aiResult.preExistingImpact && aiResult.preExistingImpact !== "None" && (
                    <div className="p-5 rounded-2xl border border-orange-500/20 bg-orange-500/[0.04] mb-5 flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-orange-400 shrink-0 mt-0.5" />
                      <div>
                        <div className="font-bold text-orange-400 text-sm mb-1">Pre-existing Condition Impact</div>
                        <div className="text-white/60 text-sm">{aiResult.preExistingImpact}</div>
                      </div>
                    </div>
                  )}

                  {/* Warnings */}
                  {aiResult.warnings.length > 0 && (
                    <div className="p-5 rounded-2xl border border-red-500/20 bg-red-500/[0.04] mb-6">
                      <div className="font-bold text-red-400 text-sm mb-3 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4" /> Important Warnings
                      </div>
                      <ul className="space-y-2">
                        {aiResult.warnings.map((w, i) => (
                          <li key={i} className="text-sm text-white/65 flex items-start gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-red-400/60 mt-2 shrink-0" />
                            {w}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="text-center">
                    <div className="text-xs text-white/25 mb-6">
                      This simulation is AI-generated for educational purposes. Actual claim outcomes depend on your specific policy wording and insurer assessment.
                    </div>
                    <Button onClick={reset} variant="outline" className="border-white/15 text-white hover:bg-white/6 rounded-full px-10 h-12">
                      <RotateCcw className="mr-2 w-4 h-4" /> Try Another Scenario
                    </Button>
                  </div>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
