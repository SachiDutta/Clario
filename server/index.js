import express from "express";
import cors from "cors";
import Groq from "groq-sdk";
import dotenv from "dotenv";
import { getPolicyContext } from "./policyData.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.SERVER_PORT || 3001;

if (!process.env.GROQ_API_KEY) {
  console.warn("⚠️  GROQ_API_KEY missing in .env — AI endpoints will fail.");
}

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function callGroq(prompt) {
  const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
    max_tokens: 4096,
  });
  return response.choices[0]?.message?.content || "";
}

app.post("/api/simulate", async (req, res) => {
  try {
    const { scenario, customScenario, bill, city, hospitalType, duration, roomType, insurance } = req.body || {};
    const prompt = `You are an expert Indian health insurance claims analyst with deep knowledge of IRDAI guidelines.

Simulate this realistic claim:

SCENARIO: ${customScenario || scenario || "Medical claim"}
City: ${city || "Delhi"}
Hospital Type: ${hospitalType || "Private Hospital"}
Room Type: ${roomType || "Private Room"}
Duration: ${duration || 3} days
Estimated Bill: ₹${Number(bill || 500000).toLocaleString("en-IN")}

Policy Details:
- Provider: ${insurance?.provider || "Not specified"}
- Sum Insured: ₹${Number(insurance?.sumInsured || 500000).toLocaleString("en-IN")}
- Deductible: ₹${Number(insurance?.deductible || 0).toLocaleString("en-IN")}
- Copay: ${insurance?.copay || 0}%
- Network Hospital: ${insurance?.networkHospital ? "Yes" : "No"}
- Pre-existing Conditions: ${insurance?.preExisting?.join(", ") || "None"}
- Waiting Period: ${insurance?.waitingPeriod || "Unknown"}

Return ONLY valid JSON (no extra text, no markdown):
{
  "coverageAmount": number,
  "oopAmount": number,
  "approvalChance": number,
  "coveragePct": number,
  "deductibleApplied": number,
  "copayAmount": number,
  "roomRentDeduction": number,
  "preExistingImpact": string,
  "settlementType": "cashless",
  "estimatedSettlementDays": number,
  "approvalReasoning": [string],
  "coveredItems": [string],
  "exclusions": [string],
  "tips": [string],
  "warnings": [string],
  "aiSummary": string
}`;
    const responseText = await callGroq(prompt);
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    const parsedResult = jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(responseText);
    res.json({ success: true, result: parsedResult });
  } catch (err) {
    console.error("Simulate Error:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post("/api/analyze", async (req, res) => {
  try {
    const { provider, policyName, mode, fileName } = req.body || {};

    const seed = (mode === "select" && provider && policyName)
      ? getPolicyContext(provider, policyName)
      : null;

    let policyContext;
    let seedSection = "";

    if (mode === "upload") {
      policyContext = `Uploaded document: "${fileName}". Analyze as a typical Indian health insurance policy from a mid-tier provider.`;
    } else {
      policyContext = `Policy: "${policyName}" by "${provider}" — a real Indian health insurance product.`;

      if (seed) {
        seedSection = `
REAL VERIFIED DATA FOR THIS POLICY (use these exact figures):
- Claim Settlement Ratio: ${seed.providerClaim}%
- Hospital Network: ${seed.providerNetwork} hospitals
- IRDAI Rating: ${seed.providerRating}
- Sum Insured Range: ${seed.sumInsured}
- Annual Premium Range: ${seed.premium}
- Overall Score: ${seed.score}/100
- Maternity: ${seed.maternity}
- Dental: ${seed.dental}
- ICU Coverage: ${seed.icu}
- Renewability: ${seed.renewability}
- Portability: ${seed.portability}
- Key Strengths (use these exactly): ${JSON.stringify(seed.strengths)}
- Key Weaknesses (use these exactly): ${JSON.stringify(seed.weaknesses)}
- AI Summary (adapt this): ${seed.summary}
- Recommendations (use these exactly): ${JSON.stringify(seed.recommendations)}
`;
      }
    }

    const prompt = `You are a certified Indian health insurance expert with 15+ years of experience, deep knowledge of IRDAI regulations, real policy wordings, and claim settlement trends.

${policyContext}
${seedSection}

Generate a comprehensive, ACCURATE, and POLICY-SPECIFIC coverage analysis. Every field must reflect THIS specific policy — not a generic policy.
Vary the scores, limits, waiting periods, and category details realistically based on what "${policyName || fileName}" actually covers.
If seed data is provided above, you MUST use those exact figures for scores, claim ratio, network, premium, strengths, weaknesses, and recommendations.
For category details (covered/partial/excluded/waitingPeriods), generate realistic, specific items that match how this policy actually works.

Return ONLY valid JSON (no markdown, no extra text):
{
  "policyTitle": string,
  "insurer": string,
  "overallScore": number,
  "claimSettlementRatio": number,
  "networkHospitals": string,
  "sumInsured": string,
  "annualPremium": string,
  "keyStrengths": [string, string, string, string, string],
  "keyWeaknesses": [string, string, string, string],
  "aiSummary": string,
  "categories": {
    "hospitalization": {
      "score": number,
      "covered": [{"item": string, "limit": string}],
      "partial": [{"item": string, "limit": string, "note": string}],
      "excluded": [string],
      "waitingPeriods": [{"item": string, "period": string}]
    },
    "icu": {
      "score": number,
      "covered": [{"item": string, "limit": string}],
      "partial": [{"item": string, "limit": string, "note": string}],
      "excluded": [string],
      "waitingPeriods": [{"item": string, "period": string}]
    },
    "surgery": {
      "score": number,
      "covered": [{"item": string, "limit": string}],
      "partial": [{"item": string, "limit": string, "note": string}],
      "excluded": [string],
      "waitingPeriods": [{"item": string, "period": string}]
    },
    "maternity": {
      "score": number,
      "covered": [{"item": string, "limit": string}],
      "partial": [{"item": string, "limit": string, "note": string}],
      "excluded": [string],
      "waitingPeriods": [{"item": string, "period": string}]
    },
    "opd": {
      "score": number,
      "covered": [{"item": string, "limit": string}],
      "partial": [{"item": string, "limit": string, "note": string}],
      "excluded": [string],
      "waitingPeriods": [{"item": string, "period": string}]
    },
    "dental": {
      "score": number,
      "covered": [{"item": string, "limit": string}],
      "partial": [{"item": string, "limit": string, "note": string}],
      "excluded": [string],
      "waitingPeriods": [{"item": string, "period": string}]
    }
  },
  "recommendations": [string, string, string, string],
  "irdaiCompliance": string,
  "renewability": string,
  "portability": boolean
}`;

    const responseText = await callGroq(prompt);
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    const parsedResult = jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(responseText);
    res.json({ success: true, result: parsedResult });
  } catch (err) {
    console.error("Analyze Error:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post("/api/compare", async (req, res) => {
  try {
    const { policies } = req.body || {};
    if (!policies || !Array.isArray(policies) || policies.length < 2) {
      return res.status(400).json({ success: false, error: "At least 2 policies required" });
    }

    const policyList = policies.map((p, i) => `Policy ${i + 1}: ${p.name} by ${p.insurer}`).join("\n");

    const prompt = `You are a certified Indian health insurance expert with deep knowledge of IRDAI data, real claim ratios, premiums, and policy terms.

Compare these Indian health insurance policies using REAL, ACCURATE data:
${policyList}

Return ONLY valid JSON (no markdown, no extra text). Every value must be specific and real — no placeholders:
{
  "bestOverall": string,
  "bestValue": string,
  "bestForFamilies": string,
  "aiSummary": string,
  "winner": {
    "name": string,
    "reason": string
  },
  "policyInsights": [
    {
      "name": string,
      "insurer": string,
      "realClaimRatio": number,
      "actualNetworkHospitals": string,
      "realPremiumRange": string,
      "iRDAIRating": string,
      "pros": [string, string, string],
      "cons": [string, string, string],
      "bestFor": string,
      "expertScore": number,
      "expertVerdict": string
    }
  ],
  "headToHead": {
    "premiumEfficiency": string,
    "claimEase": string,
    "networkStrength": string,
    "coverageDepth": string
  },
  "recommendations": [string, string, string],
  "tableRows": [
    {
      "feature": "Monthly Premium",
      "values": [string]
    },
    {
      "feature": "Sum Insured",
      "values": [string]
    },
    {
      "feature": "Claim Settlement Ratio",
      "values": [string]
    },
    {
      "feature": "Network Hospitals",
      "values": [string]
    },
    {
      "feature": "ICU Cover",
      "values": [string]
    },
    {
      "feature": "OPD Cover",
      "values": [string]
    },
    {
      "feature": "Maternity Cover",
      "values": [string]
    },
    {
      "feature": "Dental Cover",
      "values": [string]
    },
    {
      "feature": "Room Rent Limit",
      "values": [string]
    },
    {
      "feature": "Waiting Period (PED)",
      "values": [string]
    },
    {
      "feature": "Restoration Benefit",
      "values": [string]
    },
    {
      "feature": "Co-pay",
      "values": [string]
    },
    {
      "feature": "Best For",
      "values": [string]
    }
  ]
}

IMPORTANT: "tableRows[].values" must have exactly ${policies.length} entries (one per policy, in the same order as the policies listed above). Use real data — actual premiums, actual claim ratios, actual waiting periods for each specific policy.`;

    const responseText = await callGroq(prompt);
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    const parsedResult = jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(responseText);
    res.json({ success: true, result: parsedResult });
  } catch (err) {
    console.error("Compare Error:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Clario server running on port ${PORT}`);
});
