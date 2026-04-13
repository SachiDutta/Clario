#  Clario — AI-Powered Insurance Intelligence Platform

Clario is a premium InsurTech web platform designed to simplify complex insurance decisions using AI.

It helps users:

-  Analyze insurance policies from PDF uploads or custom input
-  Compare multiple policies using real AI-generated insights
-  Simulate real-life claim scenarios
-  Chat with an intelligent insurance assistant
-  Store previously analyzed policies in a dashboard

Built for hackathons and real-world usability, Clario transforms difficult insurance jargon into clear, actionable insights.

---

##  Problem Statement

Insurance documents are often lengthy, legalistic, and difficult for users to understand.

Most people struggle with:

- understanding what is covered
- exclusions and hidden clauses
- waiting periods
- claim probabilities
- comparing policies
- real-life payout expectations

This leads to poor policy decisions and claim surprises.

---

##  Our Solution

Clario provides an AI-powered insurance analysis and decision platform.

Users can:

###  Policy Analyzer
Upload a policy PDF or manually enter policy details to generate:

- coverage score
- hidden exclusions
- risk score
- waiting period summary
- claim approval probability
- recommended upgrades

---

###  Policy Comparison
Compare multiple insurance policies side-by-side with AI-generated factual insights:

- monthly premium
- claim ratio
- network hospitals
- room rent cap
- exclusions
- best fit recommendation

---

###  Scenario Simulator
Simulate real-world medical situations such as:

- dengue hospitalization
- ICU stay
- accident
- surgery
- custom incidents

The platform predicts:

- likely payout
- out-of-pocket expenses
- risk alerts
- rejection possibilities

---

###  AI Chatbot
Ask policy-related questions such as:

> “Will dengue treatment be covered?”

and receive contextual AI-based responses.

---

## Tech Stack

### Frontend
- React.js
- Tailwind CSS
- Framer Motion
- Vite

### Backend / AI
- Node.js
- Express.js
- Groq API
- Gemini API

### Storage
- Local Storage (policy history dashboard)

---

##  Installation & Local Setup

### 1. Clone repository

```bash
git clone https://github.com/your-username/clario.git
cd clario
```

---


### 3. Add environment variables

Create a `.env` file:

```env
GROQ_API_KEY=your_groq_api_key_here
```
How to get your api key ? 

1)Go to https://console.groq.com/keys

2)click on Create API key

---

### 4. Run development server and install dependencies

```bash
cd src
npm install
npm run dev
```

---

### 5. Run backend server (simultaneously)

```bash
cd server
npm install
node index.js
```

---


##  Deployment

This project is deployed at **Vercel**

```
link
```

---

## 📷 Screenshots

### Homepage
```markdown

```

### Analyzer
```markdown

```

###  Comparison
```markdown

```

###  Simulator
```markdown

```

---

##  Environment Variables Example

Create `env.example`

then paste your api key 

```env
GROQ_API_KEY=your_api_key_here
```

---

## Future Scope

- claim document OCR
- insurer integrations
- policy recommendation engine
- personalized alerts
- user authentication backend

---

##  Team Horizon
