import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Send, X, RotateCcw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ALL_POLICIES, SCENARIOS, COVERAGE_CATEGORIES } from "@/data/insurance";

const SYSTEM_PROMPT = `You are Clario AI, a helpful insurance assistant.
Data: ${JSON.stringify({ ALL_POLICIES, SCENARIOS, COVERAGE_CATEGORIES })}

RULES:
1. Keep responses between 60-100 words.
2. Always finish your sentence.
3. Use ₹ for currency.
4. Be direct, concise, and professional.
5. Only answer questions related to insurance coverage, claims, or policies.`;

type Message = { role: "user" | "bot"; text: string };

const INITIAL_MESSAGES: Message[] = [
  { role: "bot", text: "Hi! I'm Clario AI. Ask me about insurance coverage or claim estimates." },
];

const QUICK_QUESTIONS = [
  
  "Is maternity covered?",
  "How does the claim simulator work?",
  "Explain Dengue",
];

export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping, isOpen]);

  async function sendMessage(text: string) {
    if (!text.trim() || isTyping) return;

    const userMsg: Message = { role: "user", text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    try {
      const API_KEY = "AIzaSyDvKhZIW8iwkyxe-QP1AthllVpjW-l-3ZU";
      
      // ✅ Updated to current working model in 2026
      const MODEL = "gemini-2.5-flash";   // Fast & recommended
      // const MODEL = "gemini-2.5-pro";  // More powerful (use if needed)

      const url = `https://generativelanguage.googleapis.com/v1/models/${MODEL}:generateContent?key=${API_KEY}`;

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{
            role: "user",
            parts: [{
              text: `${SYSTEM_PROMPT}\n\nUser Question: ${text}`
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 400,
            topP: 0.95,
          },
          safetySettings: [
            { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
            { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
            { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
            { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
          ]
        })
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("API Error Details:", data);
        const errorMsg = data.error?.message || "Failed to connect to AI service";
        throw new Error(errorMsg);
      }

      const reply = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

      if (!reply) {
        throw new Error("AI returned an empty response.");
      }

      setMessages((prev) => [...prev, { role: "bot", text: reply }]);
    } catch (err: any) {
      console.error("Full Error Object:", err);

      let errorText = "Sorry, I couldn't get a response right now. Please try again.";

      if (err.message.includes("not found") || err.message.includes("model")) {
        errorText = "AI service is temporarily unavailable. Please try again later.";
      } else if (err.message.toLowerCase().includes("key")) {
        errorText = "Configuration error. Please check your API key.";
      }

      setMessages((prev) => [...prev, { role: "bot", text: errorText }]);
    } finally {
      setIsTyping(false);
    }
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-8 right-8 w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center z-50 hover:scale-110 active:scale-95 transition-all shadow-lg glow-primary"
      >
        {isOpen ? <X className="w-7 h-7" /> : <MessageSquare className="w-7 h-7" />}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-28 right-8 w-[90vw] max-w-[400px] h-[580px] z-50 flex flex-col glass-card rounded-3xl overflow-hidden border border-white/10 shadow-2xl"
          >
            <div className="p-4 border-b border-white/10 flex justify-between items-center bg-white/5 backdrop-blur-md">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse shadow-[0_0_10px_var(--primary)]" />
                <span className="font-bold text-sm text-foreground">Clario AI</span>
              </div>
              <button 
                onClick={() => setMessages(INITIAL_MESSAGES)} 
                className="text-muted-foreground hover:text-foreground"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-background/40">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[85%] px-4 py-2 rounded-2xl text-[13px] leading-relaxed break-words whitespace-pre-wrap ${
                      m.role === "user"
                        ? "bg-primary text-primary-foreground rounded-br-none"
                        : "bg-muted/50 text-foreground border border-white/5 rounded-bl-none shadow-sm"
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-muted/20 px-4 py-2 rounded-2xl text-[10px] text-muted-foreground animate-pulse italic">
                    Thinking...
                  </div>
                </div>
              )}

              {messages.length === 1 && (
                <div className="pt-2 space-y-2">
                  <p className="text-[10px] text-muted-foreground text-center uppercase tracking-widest">Suggestions</p>
                  {QUICK_QUESTIONS.map((q) => (
                    <button
                      key={q}
                      onClick={() => sendMessage(q)}
                      className="w-full text-left text-xs p-3 rounded-xl border border-white/5 bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-foreground transition-all"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              )}
              <div ref={endRef} />
            </div>

            <form 
              onSubmit={(e) => { e.preventDefault(); sendMessage(input); }} 
              className="p-4 bg-background border-t border-white/10 flex gap-2"
            >
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about Dengue..."
                className="bg-muted/50 border-none text-foreground text-xs h-11"
              />
              <button 
                type="submit" 
                disabled={!input.trim() || isTyping} 
                className="bg-primary text-primary-foreground p-3 rounded-xl disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
