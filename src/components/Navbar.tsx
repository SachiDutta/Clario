import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, User, LogIn, UserPlus, LayoutDashboard, Trash2, Eye, ChevronDown, Shield, LogOut } from "lucide-react";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/analyze", label: "Analyse" },
  { href: "/simulator", label: "Simulate" },
  { href: "/compare", label: "Compare" },
];

interface SavedPolicy {
  id: string;
  title: string;
  date: string;
  score?: number;
  data: any;
}

interface ProfileDropdownProps {
  onClose: () => void;
}

function AuthModal({ mode, onClose }: { mode: "login" | "signup"; onClose: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const user = { email, name: mode === "signup" ? name : email.split("@")[0] };
    localStorage.setItem("clario_user", JSON.stringify(user));
    setLoggedIn(true);
    setTimeout(onClose, 1000);
  }

  if (loggedIn) {
    return (
      <div className="flex flex-col items-center gap-3 py-6">
        <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center">
          <Shield className="w-6 h-6 text-secondary" />
        </div>
        <p className="text-white font-semibold">Welcome!</p>
        <p className="text-white/50 text-sm">You're now logged in.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-1">
      <h3 className="text-lg font-bold text-white">
        {mode === "login" ? "Sign In to Clario" : "Create Account"}
      </h3>
      {mode === "signup" && (
        <input
          type="text"
          placeholder="Full name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-secondary/50 transition-colors"
        />
      )}
      <input
        type="email"
        placeholder="Email address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-secondary/50 transition-colors"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-secondary/50 transition-colors"
      />
      <button
        type="submit"
        className="w-full py-3 rounded-xl bg-secondary text-[#090c14] font-bold hover:bg-secondary/90 transition-colors"
        style={{ boxShadow: "0 0 20px rgba(8,217,214,0.3)" }}
      >
        {mode === "login" ? "Sign In" : "Create Account"}
      </button>
    </form>
  );
}

function PoliciesDashboard() {
  const [policies, setPolicies] = useState<SavedPolicy[]>([]);
  const [viewing, setViewing] = useState<SavedPolicy | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("clario_saved_policies");
    if (saved) setPolicies(JSON.parse(saved));
  }, []);

  function deletePolicy(id: string) {
    const updated = policies.filter((p) => p.id !== id);
    setPolicies(updated);
    localStorage.setItem("clario_saved_policies", JSON.stringify(updated));
  }

  if (viewing) {
    return (
      <div className="flex flex-col gap-4">
        <button
          onClick={() => setViewing(null)}
          className="flex items-center gap-2 text-white/50 hover:text-white text-sm transition-colors"
        >
          ← Back to Dashboard
        </button>
        <h3 className="text-base font-bold text-white">{viewing.title}</h3>
        <p className="text-white/40 text-xs">{viewing.date}</p>
        <div className="rounded-xl bg-white/5 border border-white/10 p-4 max-h-80 overflow-y-auto">
          {viewing.score !== undefined && (
            <div className="flex items-center gap-2 mb-3">
              <span className="text-white/50 text-xs">Overall Score:</span>
              <span className="text-secondary font-bold">{viewing.score}/100</span>
            </div>
          )}
          {viewing.data?.aiSummary && (
            <p className="text-white/70 text-sm leading-relaxed mb-3">{viewing.data.aiSummary}</p>
          )}
          {viewing.data?.keyStrengths && (
            <div className="mb-3">
              <div className="text-[10px] font-bold uppercase tracking-widest text-secondary mb-1">Strengths</div>
              {viewing.data.keyStrengths.map((s: string, i: number) => (
                <div key={i} className="text-white/60 text-xs py-0.5">• {s}</div>
              ))}
            </div>
          )}
          {viewing.data?.keyWeaknesses && (
            <div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-red-400 mb-1">Weaknesses</div>
              {viewing.data.keyWeaknesses.map((w: string, i: number) => (
                <div key={i} className="text-white/60 text-xs py-0.5">• {w}</div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  if (policies.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 py-6 text-center">
        <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
          <LayoutDashboard className="w-5 h-5 text-white/30" />
        </div>
        <p className="text-white/50 text-sm">No saved policies yet.</p>
        <p className="text-white/30 text-xs">Analyze a policy and save the report here.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-sm font-bold text-white/70 uppercase tracking-widest">My Saved Policies</h3>
      <div className="flex flex-col gap-2 max-h-72 overflow-y-auto pr-1">
        {policies.map((policy) => (
          <div
            key={policy.id}
            className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/8 hover:border-white/15 transition-colors"
          >
            <div className="w-9 h-9 rounded-lg bg-secondary/10 flex items-center justify-center shrink-0">
              <Shield className="w-4 h-4 text-secondary" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-white truncate">{policy.title}</div>
              <div className="text-xs text-white/40">{policy.date}</div>
              {policy.score !== undefined && (
                <div className="text-xs text-secondary font-medium">Score: {policy.score}/100</div>
              )}
            </div>
            <div className="flex gap-1 shrink-0">
              <button
                onClick={() => setViewing(policy)}
                className="w-7 h-7 rounded-lg bg-white/5 hover:bg-secondary/20 flex items-center justify-center transition-colors"
                title="View report"
              >
                <Eye className="w-3.5 h-3.5 text-white/50 hover:text-secondary" />
              </button>
              <button
                onClick={() => deletePolicy(policy.id)}
                className="w-7 h-7 rounded-lg bg-white/5 hover:bg-red-500/20 flex items-center justify-center transition-colors"
                title="Delete"
              >
                <Trash2 className="w-3.5 h-3.5 text-white/50 hover:text-red-400" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProfileDropdown({ onClose }: ProfileDropdownProps) {
  const [tab, setTab] = useState<"menu" | "login" | "signup" | "dashboard">("menu");
  const user = (() => {
    try { return JSON.parse(localStorage.getItem("clario_user") || "null"); } catch { return null; }
  })();

  function handleLogout() {
    localStorage.removeItem("clario_user");
    onClose();
    window.location.reload();
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -8, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.97 }}
      transition={{ duration: 0.18 }}
      className="absolute right-0 top-full mt-3 w-72 rounded-2xl border border-white/10 bg-[#0a0d18]/98 backdrop-blur-2xl shadow-2xl z-50 overflow-hidden"
      style={{ boxShadow: "0 25px 50px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.05)" }}
    >
      <div className="p-4">
        {tab === "menu" && (
          <div className="flex flex-col gap-1">
            {user ? (
              <div className="flex items-center gap-3 mb-3 p-3 rounded-xl bg-secondary/5 border border-secondary/15">
                <div className="w-9 h-9 rounded-full bg-secondary/20 flex items-center justify-center">
                  <User className="w-4 h-4 text-secondary" />
                </div>
                <div>
                  <div className="text-sm font-bold text-white">{user.name}</div>
                  <div className="text-xs text-white/40">{user.email}</div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3 mb-3 p-3 rounded-xl bg-white/3 border border-white/8">
                <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center">
                  <User className="w-4 h-4 text-white/50" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">Not signed in</div>
                  <div className="text-xs text-white/40">Sign in to save policies</div>
                </div>
              </div>
            )}

            {!user && (
              <>
                <button
                  onClick={() => setTab("login")}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-colors text-left w-full"
                >
                  <LogIn className="w-4 h-4 text-secondary" />
                  <span className="text-sm text-white font-medium">Sign In</span>
                </button>
                <button
                  onClick={() => setTab("signup")}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-colors text-left w-full"
                >
                  <UserPlus className="w-4 h-4 text-purple-400" />
                  <span className="text-sm text-white font-medium">Create Account</span>
                </button>
              </>
            )}

            <button
              onClick={() => setTab("dashboard")}
              className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-colors text-left w-full"
            >
              <LayoutDashboard className="w-4 h-4 text-amber-400" />
              <span className="text-sm text-white font-medium">My Policies Dashboard</span>
            </button>

            {user && (
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-500/10 transition-colors text-left w-full mt-1 border-t border-white/5 pt-3"
              >
                <LogOut className="w-4 h-4 text-red-400" />
                <span className="text-sm text-red-400 font-medium">Sign Out</span>
              </button>
            )}
          </div>
        )}

        {(tab === "login" || tab === "signup") && (
          <div>
            <button
              onClick={() => setTab("menu")}
              className="flex items-center gap-2 text-white/50 hover:text-white text-xs mb-4 transition-colors"
            >
              ← Back
            </button>
            <AuthModal mode={tab} onClose={() => { setTab("menu"); onClose(); }} />
            <div className="mt-3 text-center">
              {tab === "login" ? (
                <button onClick={() => setTab("signup")} className="text-xs text-white/40 hover:text-secondary transition-colors">
                  Don't have an account? Sign up
                </button>
              ) : (
                <button onClick={() => setTab("login")} className="text-xs text-white/40 hover:text-secondary transition-colors">
                  Already have an account? Sign in
                </button>
              )}
            </div>
          </div>
        )}

        {tab === "dashboard" && (
          <div>
            <button
              onClick={() => setTab("menu")}
              className="flex items-center gap-2 text-white/50 hover:text-white text-xs mb-4 transition-colors"
            >
              ← Back
            </button>
            <PoliciesDashboard />
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [location] = useLocation();
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => { setMobileOpen(false); setProfileOpen(false); }, [location]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    }
    if (profileOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [profileOpen]);

  const user = (() => {
    try { return JSON.parse(localStorage.getItem("clario_user") || "null"); } catch { return null; }
  })();

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 py-4 ${
        scrolled ? "bg-[#090c14]/92 backdrop-blur-xl border-b border-white/5" : ""
      }`}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        <Link href="/">
          <div className="flex items-center gap-2 cursor-pointer">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center relative">
              <div className="absolute inset-0 rounded-full border-2 border-primary animate-ping opacity-20" />
              <div className="w-4 h-4 rounded-full bg-primary" style={{ boxShadow: "0 0 12px rgba(8,217,214,0.8)" }} />
            </div>
            <span className="text-xl font-bold text-white tracking-tight">Clario</span>
          </div>
        </Link>

        <div className="hidden md:flex items-center gap-2">
          {NAV_LINKS.map((link) => {
            const active = location === link.href;
            return (
              <Link key={link.href} href={link.href}>
                <span
                  className={`relative px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 cursor-pointer ${
                    active ? "text-white" : "text-white/60 hover:text-white"
                  }`}
                >
                  {active && (
                    <motion.span layoutId="nav-pill" className="absolute inset-0 rounded-full bg-white/8" />
                  )}
                  <span className="relative">{link.label}</span>
                </span>
              </Link>
            );
          })}

          <div ref={profileRef} className="relative ml-2">
            <button
              onClick={() => setProfileOpen((v) => !v)}
              className={`flex items-center gap-2 px-3 py-2 rounded-full border transition-all duration-200 ${
                profileOpen
                  ? "bg-white/10 border-white/20 text-white"
                  : "border-white/10 text-white/60 hover:text-white hover:border-white/20 hover:bg-white/5"
              }`}
              data-testid="button-profile"
            >
              {user ? (
                <div className="w-6 h-6 rounded-full bg-secondary/30 flex items-center justify-center">
                  <span className="text-secondary text-xs font-bold">{user.name?.[0]?.toUpperCase() || "U"}</span>
                </div>
              ) : (
                <User className="w-4 h-4" />
              )}
              <ChevronDown className={`w-3 h-3 transition-transform ${profileOpen ? "rotate-180" : ""}`} />
            </button>
            <AnimatePresence>
              {profileOpen && <ProfileDropdown onClose={() => setProfileOpen(false)} />}
            </AnimatePresence>
          </div>
        </div>

        <button
          className="md:hidden text-white/70 hover:text-white transition-colors"
          onClick={() => setMobileOpen((v) => !v)}
          data-testid="button-mobile-menu"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="md:hidden border-t border-white/8 bg-[#090c14]/98 backdrop-blur-xl px-6 py-4 space-y-1"
        >
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href}>
              <div
                className={`px-4 py-3 rounded-xl text-sm font-medium cursor-pointer transition-colors ${
                  location === link.href
                    ? "bg-primary/15 text-primary"
                    : "text-white/65 hover:text-white hover:bg-white/5"
                }`}
              >
                {link.label}
              </div>
            </Link>
          ))}
          <button
            onClick={() => { setMobileOpen(false); setProfileOpen(true); }}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium w-full text-white/65 hover:text-white hover:bg-white/5 transition-colors"
          >
            <User className="w-4 h-4" />
            {user ? user.name : "Profile"}
          </button>
        </motion.div>
      )}
    </nav>
  );
}
