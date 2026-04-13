export const POLICY_SEED_DATA = {
  "Star Health": {
    claimSettlementRatio: 82.3,
    networkHospitals: "14,000+",
    irdaiRating: "AAA",
    policies: {
      "Star Comprehensive": {
        sumInsured: "₹5L – ₹1Cr",
        premium: "₹8,500–₹28,000/yr",
        score: 84,
        strengths: ["No room rent sub-limits", "Modern treatments covered", "No co-pay for adults under 60", "Organ donor expenses covered", "Air ambulance covered"],
        weaknesses: ["2-year waiting period for pre-existing diseases", "Maternity after 3 years", "Obesity treatment excluded", "Mental illness limited coverage"],
        summary: "Star Comprehensive is one of Star Health's flagship products. It covers modern treatments, AYUSH therapies, and organ donor expenses with no room rent cap, making it a strong all-rounder for urban families.",
        maternity: "Covered after 3 years; up to ₹50,000 normal, ₹75,000 C-section",
        dental: "Not covered except accidental injuries",
        icu: "Covered up to sum insured; no sub-limit",
        renewability: "Lifelong renewal guaranteed",
        portability: true,
        recommendations: ["Ideal for families in metro cities", "Consider top-up plan if sum insured is below ₹10L", "Enroll before age 45 for lower premiums", "Check network hospitals in your city before buying"]
      },
      "Star Family Health Optima": {
        sumInsured: "₹3L – ₹25L",
        premium: "₹6,000–₹18,000/yr",
        score: 78,
        strengths: ["Floater plan for entire family", "Auto-recharge of sum insured", "Newborn covered from day 1", "Pre-hospitalisation 60 days", "Free health check-up"],
        weaknesses: ["Room rent capped at 1% of sum insured", "Co-pay 20% for age 61+", "Sub-limits on some surgeries", "Pre-existing disease waiting 3 years"],
        summary: "Star Family Health Optima is a family floater with an auto-recharge feature that reinstates sum insured if exhausted. Ideal for young families but has room rent sub-limits that can be costly in premium hospitals.",
        maternity: "Not covered",
        dental: "Not covered",
        icu: "Sub-limit applies — 2% of sum insured per day",
        renewability: "Lifelong renewal guaranteed",
        portability: true,
        recommendations: ["Best for families with children under 25", "Pick ₹10L+ sum insured to avoid room rent issues", "Avoid this plan if family members are over 60", "Port before policy anniversary to retain NCB"]
      },
      "Star Senior Citizen Red Carpet": {
        sumInsured: "₹1L – ₹25L",
        premium: "₹14,000–₹45,000/yr",
        score: 71,
        strengths: ["Designed for ages 60–75", "Pre-existing diseases covered from day 1", "No medical check-up for entry", "Domiciliary hospitalisation covered"],
        weaknesses: ["30% co-pay on all claims", "Room rent capped at ₹4,000/day", "Limited network hospitals for elderly specialists", "Premiums very high at age 70+"],
        summary: "The only senior-focused policy from Star that accepts applicants up to 75 years with pre-existing conditions from day 1. However, the mandatory 30% co-pay significantly reduces effective coverage.",
        maternity: "Not applicable",
        dental: "Not covered",
        icu: "Covered; room rent cap applies",
        renewability: "Lifelong guaranteed",
        portability: false,
        recommendations: ["Best for seniors who can't get other policies", "Budget for 30% co-pay out-of-pocket", "Supplement with a critical illness rider", "Compare Star Mediclassic before finalizing"]
      }
    }
  },
  "HDFC ERGO": {
    claimSettlementRatio: 98.6,
    networkHospitals: "13,000+",
    irdaiRating: "AAA",
    policies: {
      "Optima Secure": {
        sumInsured: "₹5L – ₹2Cr",
        premium: "₹9,000–₹32,000/yr",
        score: 91,
        strengths: ["Industry-leading 98.6% claim ratio", "No room rent sub-limits", "Unlimited restoration of sum insured", "No co-pay clause", "Covers home healthcare and e-consultation"],
        weaknesses: ["Premium is 15–20% higher than competitors", "Maternity only after 4 years", "Dental not covered except trauma", "Obesity treatment excluded"],
        summary: "Optima Secure by HDFC ERGO leads the market with a 98.6% claim settlement ratio — the highest in the industry. It offers unlimited restoration, zero co-pay, and no room rent cap, making it the premium choice for comprehensive coverage.",
        maternity: "Covered after 4 years; ₹50,000 normal, ₹75,000 C-section",
        dental: "Accidental dental only",
        icu: "Fully covered with no sub-limit",
        renewability: "Lifelong guaranteed",
        portability: true,
        recommendations: ["Best plan for those who want zero compromise on claims", "Highly recommended for salaried professionals above ₹15L CTC", "Choose ₹1Cr sum insured for metro cities", "Pair with super top-up for maximum protection"]
      },
      "Optima Restore": {
        sumInsured: "₹3L – ₹50L",
        premium: "₹7,000–₹22,000/yr",
        score: 86,
        strengths: ["Automatic 100% restore of sum insured", "Multiplier benefit — sum doubles in 2 claim-free years", "No medical exam up to ₹10L", "Good network in Tier-2 cities"],
        weaknesses: ["Room rent capped at 1% for non-premium variants", "Pre-existing disease waiting 3 years", "Some modern treatments need pre-authorisation", "Sub-limits on certain surgeries"],
        summary: "Optima Restore stands out with a multiplier benefit — your sum insured doubles automatically after two claim-free years. The restore feature ensures you're never left without coverage mid-policy year.",
        maternity: "Not covered in base; available as rider",
        dental: "Not covered",
        icu: "Covered; room rent limit applies",
        renewability: "Lifelong guaranteed",
        portability: true,
        recommendations: ["Excellent for young professionals who want growing coverage", "Buy the premium variant to avoid room rent cap", "Add maternity rider if planning a family", "Review multiplier benefit accumulation annually"]
      },
      "My Health Suraksha": {
        sumInsured: "₹3L – ₹10L",
        premium: "₹4,500–₹14,000/yr",
        score: 74,
        strengths: ["Affordable entry-level plan", "In-patient hospitalisation fully covered", "Pre-hospitalisation 60 days covered", "Ambulance charges included"],
        weaknesses: ["Room rent capped at ₹3,000/day", "No OPD coverage", "No modern treatments", "No restoration benefit", "Mental illness not covered"],
        summary: "My Health Suraksha is an affordable starter plan by HDFC ERGO. While it handles basic hospitalisation well, it lacks advanced features like OPD, restoration, or modern treatments — better suited as a secondary policy.",
        maternity: "Not covered",
        dental: "Not covered",
        icu: "Covered with sub-limit",
        renewability: "Lifelong guaranteed",
        portability: true,
        recommendations: ["Only suitable as a backup or for young single individuals", "Upgrade to Optima Restore when income allows", "Not recommended for families", "Useful for Tier-2/3 city residents with lower hospital costs"]
      }
    }
  },
  "ICICI Lombard": {
    claimSettlementRatio: 87.2,
    networkHospitals: "15,000+",
    irdaiRating: "AA+",
    policies: {
      "Complete Health Insurance": {
        sumInsured: "₹3L – ₹50L",
        premium: "₹7,500–₹24,000/yr",
        score: 82,
        strengths: ["Largest network of 15,000+ hospitals", "Covers 540+ day-care procedures", "Annual health check-up included", "AYUSH treatment covered", "No claim bonus up to 50%"],
        weaknesses: ["Room rent capped at 1% of sum insured", "Pre-existing disease waiting 4 years", "Maternity excluded in base plan", "Ambulance capped at ₹2,000"],
        summary: "ICICI Lombard's Complete Health Insurance offers the widest hospital network in India, covering over 15,000 hospitals. The no-claim bonus feature makes it cost-effective for claim-free policyholders over time.",
        maternity: "Available as add-on; 9-month waiting period",
        dental: "Not covered",
        icu: "Covered; room rent sub-limit applies",
        renewability: "Lifelong guaranteed",
        portability: true,
        recommendations: ["Best for those who travel frequently across India", "Add maternity cover if planning a family soon", "Upgrade room rent limit at higher sum insured", "Monitor NCB accumulation for premium discounts"]
      },
      "Health Advantage Plus": {
        sumInsured: "₹5L – ₹1Cr",
        premium: "₹10,000–₹35,000/yr",
        score: 88,
        strengths: ["OPD coverage included", "Mental health treatment covered", "Bariatric surgery covered", "Teleconsultation unlimited", "International emergency cover"],
        weaknesses: ["Higher premium than market average", "Pre-existing disease waiting 2 years", "Some exclusions on alternative medicine", "Dental only for accidents"],
        summary: "Health Advantage Plus is ICICI Lombard's premium product targeting urban professionals. The inclusion of OPD, mental health, bariatric surgery, and international emergency cover sets it apart from most competitors.",
        maternity: "Covered after 2 years; ₹60,000 normal, ₹90,000 C-section",
        dental: "Accidental only",
        icu: "Fully covered, no sub-limit",
        renewability: "Lifelong guaranteed",
        portability: true,
        recommendations: ["Top pick for self-employed professionals and consultants", "Leverage teleconsultation to avoid OPD bills", "Check international cover limits for frequent travellers", "Consider bundling with critical illness policy"]
      },
      "iHealth": {
        sumInsured: "₹2L – ₹10L",
        premium: "₹3,500–₹12,000/yr",
        score: 69,
        strengths: ["Affordable for first-time buyers", "Online purchase with instant issuance", "Pre-hospitalisation 30 days", "Day-care procedures covered"],
        weaknesses: ["Very limited sum insured ceiling", "Room rent ₹2,000/day cap", "No restoration or NCB", "No modern treatments", "Long 4-year PED waiting period"],
        summary: "iHealth is ICICI Lombard's budget health plan for price-sensitive buyers. With a maximum sum insured of ₹10L, it's inadequate for serious illnesses in metro cities but works as a first-time buyer entry point.",
        maternity: "Not covered",
        dental: "Not covered",
        icu: "Sub-limit applies — ₹4,000/day",
        renewability: "Annual renewal required",
        portability: true,
        recommendations: ["Only buy if budget is very tight", "Plan to upgrade within 2 years", "Not suitable for anyone above 35 years", "Supplement with employer group cover if available"]
      }
    }
  },
  "Bajaj Allianz": {
    claimSettlementRatio: 91.5,
    networkHospitals: "18,400+",
    irdaiRating: "AA+",
    policies: {
      "Health Guard": {
        sumInsured: "₹1.5L – ₹50L",
        premium: "₹5,500–₹20,000/yr",
        score: 79,
        strengths: ["Widest network of 18,400+ hospitals", "Convalescence benefit included", "In-hospital cash benefit", "Organ donor expenses covered", "E-opinion for critical illness"],
        weaknesses: ["Room rent at 1% of sum insured per day", "Pre-existing disease waiting 3 years", "No OPD coverage", "Maternity excluded from base"],
        summary: "Bajaj Allianz Health Guard covers one of the widest networks in India. Its convalescence and in-hospital daily cash benefits are rare features at this price point, though room rent sub-limits remain a concern.",
        maternity: "Available as rider; 9-month waiting",
        dental: "Not covered",
        icu: "Covered; room rent cap applies",
        renewability: "Lifelong guaranteed",
        portability: true,
        recommendations: ["Good for Tier-2 city residents due to wide network", "Add maternity rider before family planning", "Pick higher sum insured to increase room rent limit", "Use e-opinion feature for serious diagnoses"]
      },
      "Global Personal Guard": {
        sumInsured: "₹5L – ₹3Cr",
        premium: "₹12,000–₹55,000/yr",
        score: 90,
        strengths: ["Worldwide treatment coverage", "No room rent cap", "Modern treatments included", "Air ambulance fully covered", "No co-pay for treatments abroad"],
        weaknesses: ["Premium significantly higher", "Waiting period still applies for PED", "Complex claim process for overseas hospitals", "Pre-authorisation mandatory"],
        summary: "Bajaj Allianz Global Personal Guard is designed for NRIs and frequent international travellers. It offers worldwide hospitalisation coverage with no room rent cap, making it the most comprehensive product from Bajaj.",
        maternity: "Covered after 2 years worldwide",
        dental: "Emergency dental covered abroad",
        icu: "Fully covered, no sub-limit, worldwide",
        renewability: "Lifelong guaranteed",
        portability: true,
        recommendations: ["Ideal for professionals who work or travel internationally", "Maintain TPA contacts for smooth international claims", "Carry policy documents while travelling", "Compare with Niva Bupa Reassure for domestic-only use"]
      },
      "Bajaj Allianz Star Package": {
        sumInsured: "₹1L – ₹5L",
        premium: "₹2,800–₹9,000/yr",
        score: 64,
        strengths: ["Very low premium entry point", "Personal accident cover bundled", "Covers accidental hospitalisation 100%", "Simple issuance process"],
        weaknesses: ["Illness hospitalisation heavily sub-limited", "No restoration benefit", "Room rent ₹1,500/day cap", "Very low ceiling sum insured for modern medical costs", "No modern treatments"],
        summary: "Bajaj Allianz Star Package is a basic plan bundling health and personal accident cover at a low price. With maximum ₹5L sum insured, it falls short for any serious or chronic illness in today's medical cost environment.",
        maternity: "Not covered",
        dental: "Not covered",
        icu: "Limited to ₹2,000/day",
        renewability: "Annual renewal; lifelong not guaranteed",
        portability: false,
        recommendations: ["Only for very short-term or supplementary coverage", "Not sufficient as primary health insurance", "Consider upgrading to Health Guard within a year", "Good as group insurance supplement only"]
      }
    }
  },
  "Niva Bupa": {
    claimSettlementRatio: 91.0,
    networkHospitals: "10,000+",
    irdaiRating: "AA",
    policies: {
      "Reassure 2.0": {
        sumInsured: "₹3L – ₹1Cr",
        premium: "₹8,000–₹28,000/yr",
        score: 87,
        strengths: ["Lock-in benefit protects premiums from claims", "Recharge of sum insured unlimited times", "No room rent sub-limits", "Covers mental health treatment fully", "Annual health check-up every year"],
        weaknesses: ["PED waiting 3 years", "Maternity after 2 years (base plan)", "Dental emergency only", "Premium slightly higher than older plans"],
        summary: "Niva Bupa's Reassure 2.0 is a modern, feature-rich plan with unique lock-in pricing benefit — your premium remains unaffected by your claim history. The unlimited recharge ensures you're never underinsured mid-year.",
        maternity: "Covered after 2 years; ₹50,000 normal, ₹65,000 C-section",
        dental: "Emergency dental only",
        icu: "Fully covered with no sub-limit",
        renewability: "Lifelong guaranteed",
        portability: true,
        recommendations: ["Excellent for chronic-condition-prone families", "Utilise annual health check-ups proactively", "Lock-in benefit is extremely valuable for long-term holders", "Compare premium lock-in with HDFC Optima Secure"]
      },
      "Health Companion": {
        sumInsured: "₹3L – ₹1Cr",
        premium: "₹6,500–₹22,000/yr",
        score: 80,
        strengths: ["Restoration of 100% sum insured once per year", "No co-pay clause", "Ambulance charges covered", "Good claim settlement track record", "Teleconsultation included"],
        weaknesses: ["Room rent sub-limit in lower variants", "PED waiting 3 years", "Maternity excluded in base", "Limited dental coverage"],
        summary: "Health Companion offers solid middle-ground features from Niva Bupa — restoration, zero co-pay, and teleconsultation. It is slightly less premium than Reassure 2.0 but misses the lock-in pricing benefit.",
        maternity: "Not in base plan; add-on available",
        dental: "Not covered",
        icu: "Covered; room rent sub-limit in lower tiers",
        renewability: "Lifelong guaranteed",
        portability: true,
        recommendations: ["Good for salaried individuals below 40 years", "Opt for higher sum insured to avoid room rent caps", "Add maternity benefit while buying, not later", "Use teleconsultation to reduce OPD expenses"]
      },
      "Senior First": {
        sumInsured: "₹5L – ₹25L",
        premium: "₹22,000–₹70,000/yr",
        score: 73,
        strengths: ["Designed exclusively for 60–75 age group", "Pre-existing diseases covered after 1 year (shorter than industry)", "Mental healthcare fully covered", "Home care treatment included"],
        weaknesses: ["Premiums very high at older ages", "15–20% co-pay on all claims", "Limited OPD benefits", "Dental not covered"],
        summary: "Niva Bupa Senior First is one of the better senior-focused plans in the market with only a 1-year PED waiting period — much shorter than most. However, the mandatory co-pay and high premiums are significant trade-offs.",
        maternity: "Not applicable",
        dental: "Not covered",
        icu: "Covered after co-pay deduction",
        renewability: "Lifelong guaranteed",
        portability: true,
        recommendations: ["Best senior plan for those with stable pre-existing conditions", "Budget for 15–20% co-pay on every claim", "Compare with Star Senior Citizen Red Carpet on premiums", "Complement with critical illness cover for major diseases"]
      }
    }
  },
  "Care Health": {
    claimSettlementRatio: 95.2,
    networkHospitals: "19,000+",
    irdaiRating: "AA",
    policies: {
      "Care Supreme": {
        sumInsured: "₹5L – ₹6Cr",
        premium: "₹9,500–₹40,000/yr",
        score: 89,
        strengths: ["Highest sum insured ceiling of ₹6Cr in market", "Unlimited restoration of sum insured", "No room rent sub-limits", "Annual health check-up included", "International emergency evacuation"],
        weaknesses: ["Maternity benefit only after 4 years", "Dental not covered", "PED waiting 3 years", "Some alternative treatments need pre-auth"],
        summary: "Care Supreme offers the highest sum insured in the industry at ₹6 crore, with unlimited restoration and no room rent cap. At 95.2% claim settlement, Care Health is one of the most reliable insurers.",
        maternity: "Covered after 4 years; ₹75,000 normal, ₹1L C-section",
        dental: "Not covered",
        icu: "Fully covered, no sub-limit",
        renewability: "Lifelong guaranteed",
        portability: true,
        recommendations: ["Best choice for high-net-worth individuals needing maximum cover", "Utilise international emergency evacuation while abroad", "Start early to cover PED waiting period", "Compare with HDFC Optima Secure for head-to-head features"]
      },
      "Care Classic": {
        sumInsured: "₹4L – ₹10L",
        premium: "₹5,500–₹17,000/yr",
        score: 75,
        strengths: ["Good claim settlement ratio from Care Health", "Pre-hospitalisation 60 days covered", "Ambulance fully covered", "Day-care procedures 540+"],
        weaknesses: ["Room rent cap at 1% per day", "No OPD coverage", "No restoration benefit", "PED waiting 4 years", "No mental health coverage"],
        summary: "Care Classic is an entry-level plan from Care Health that benefits from the insurer's high 95.2% claim ratio. However it lacks features like OPD, restoration, and modern treatments that newer plans provide.",
        maternity: "Not covered",
        dental: "Not covered",
        icu: "Covered with room rent sub-limit",
        renewability: "Lifelong guaranteed",
        portability: true,
        recommendations: ["Suitable as backup or budget plan for young adults", "Consider upgrading to Care Supreme at first opportunity", "Leverage Care Health's strong claim process even for basic plans", "Not recommended for ages above 40"]
      }
    }
  },
  "Aditya Birla": {
    claimSettlementRatio: 96.7,
    networkHospitals: "11,000+",
    irdaiRating: "AA+",
    policies: {
      "Activ Health Platinum Enhanced": {
        sumInsured: "₹2L – ₹2Cr",
        premium: "₹7,000–₹35,000/yr",
        score: 88,
        strengths: ["Unique wellness rewards — earn and redeem health points", "Chronic illness management programs included", "No room rent cap", "OPD covered up to ₹500/visit", "Mental health and teleconsultation covered"],
        weaknesses: ["Complex wellness program to navigate", "PED waiting 3 years", "Maternity after 2 years", "Some OPD limits feel restrictive"],
        summary: "Activ Health Platinum Enhanced is unique with a wellness-first philosophy — policyholders earn 'HealthReturns' points for staying active, which can be redeemed against premiums. Chronic illness management is a standout differentiator.",
        maternity: "Covered after 2 years; ₹50,000 normal, ₹70,000 C-section",
        dental: "Covered under OPD benefit",
        icu: "Fully covered, no sub-limit",
        renewability: "Lifelong guaranteed",
        portability: true,
        recommendations: ["Best for health-conscious individuals who exercise regularly", "Track steps and health milestones to earn maximum rewards", "Leverage chronic illness management if you have diabetes/BP", "One of few plans with dental under OPD benefit"]
      },
      "Activ Assure Diamond": {
        sumInsured: "₹3L – ₹2Cr",
        premium: "₹6,000–₹25,000/yr",
        score: 81,
        strengths: ["Global coverage option available", "Restoration of sum insured once a year", "Air ambulance covered", "AYUSH treatment up to sum insured", "No sub-limits on surgeon fees"],
        weaknesses: ["Room rent cap at 1% in lower tiers", "PED waiting 3 years", "Dental excluded", "Maternity only after 3 years"],
        summary: "Activ Assure Diamond from Aditya Birla provides global coverage as an optional add-on, along with restoration and air ambulance. It's a well-rounded plan for those wanting both domestic and international flexibility.",
        maternity: "Covered after 3 years with rider",
        dental: "Not covered in base plan",
        icu: "Covered; room rent limit in lower tiers",
        renewability: "Lifelong guaranteed",
        portability: true,
        recommendations: ["Good for frequent travellers needing international cover option", "Choose global cover add-on if travelling to US/UK frequently", "Monitor room rent sub-limit at the tier you choose", "Pair with Activ Secure personal accident rider"]
      }
    }
  }
};

export function getPolicyContext(provider, policyName) {
  const providerData = POLICY_SEED_DATA[provider];
  if (!providerData) return null;
  const policyData = providerData.policies?.[policyName];
  if (!policyData) return null;

  return {
    providerClaim: providerData.claimSettlementRatio,
    providerNetwork: providerData.networkHospitals,
    providerRating: providerData.irdaiRating,
    ...policyData,
  };
}
