# AI BUTTON GUIDE — Institutional Signal Confirmation Tool

## Overview
The 🤖 AI button is a **secondary confirmation tool** that calls OpenAI GPT-4o-mini with institutional order flow analysis framework. It provides narrative reasoning for market setups but is **NOT recommended for live entry execution** due to API latency and non-deterministic outputs.

---

## What It Does

### 1. Data Collection
When you click the AI button, it gathers:
- **Volume Profile**: POC (Point of Control), VAH (Value Area High), VAL (Value Area Low)
- **Current Price Position**: Above/below POC, inside/outside value area
- **Footprint Delta**: Net buying vs selling pressure across last 12 bars
- **Order Book Walls**: Top 5 bid/ask walls with distance from current price

### 2. AI Analysis
Sends structured data to GPT-4o-mini with institutional prompt that includes:
- Volume Profile scoring (-2 to +2)
- DOM Wall analysis (-2 to +2)
- Footprint Delta scoring (-2 to +2)
- Delta Divergence detection (-2 to +2)
- Candle Structure analysis (-2 to +2)

**Total score range: -10 to +10**

### 3. Signal Rules
- **BUY**: Score ≥ +6, no critical conflicts, R:R ≥ 1:2
- **SELL**: Score ≤ -6, no critical conflicts, R:R ≥ 1:2
- **FLAT**: Score between -6 and +6, or conflicts exist, or R:R < 1:2

### 4. Output Format
```json
{
  "signal": "BUY | SELL | FLAT",
  "conviction": "HIGH | MEDIUM | LOW",
  "score": 0,
  "entry_zone": { "price": 0.0, "type": "market | limit" },
  "stop_loss": { "price": 0.0, "basis": "below_bid_wall" },
  "targets": { "tp1": 0.0, "tp2": 0.0, "tp3": 0.0 },
  "rr_ratio": 0.0,
  "primary_reason": "String",
  "confluence_stack": ["List", "of", "factors"],
  "conflicts": ["List", "of", "warnings"],
  "warnings": ["List", "of", "risks"],
  "institutional_narrative": "Full analysis in plain English",
  "invalidation": "What would invalidate this setup"
}
```

---

## When to Use It

### ✅ Good Use Cases
1. **Post-trade analysis** — "Why did that setup fail?"
2. **Learning institutional logic** — Understanding why certain conditions matter
3. **Second opinion** — When scanner gives borderline signal (3 stars), get AI perspective
4. **Trade journaling** — Document institutional reasoning for review

### ❌ Bad Use Cases
1. **Live entry execution** — 3-5 second API delay will cause missed entries
2. **Primary signal source** — Non-deterministic outputs mean inconsistency
3. **High-frequency trading** — Too slow, costs per API call
4. **During news events** — LLM doesn't have real-time news awareness

---

## How to Interpret Results

### FLAT Signal
**Meaning**: "No trade right now" — market conditions don't meet institutional thresholds

**Example Output**:
```
FLAT | LOW CONVICTION
Score: 0/10

No trade signal at this time.

Current price is below POC and near VAL, indicating potential weakness.
```

**What to do**: Wait. This is actually a **good signal** — the AI is telling you the setup isn't clear enough. Professional traders sit on their hands 80% of the time.

### BUY Signal
**Meaning**: "Long setup detected with institutional confluence"

**Example Output**:
```
BUY | HIGH CONVICTION
Score: 8/10

Entry: $76,213
Stop: $75,985
TP1: $76,450
TP2: $76,680
TP3: $76,920
R:R Ratio: 2.50

Reason: Price at support with bullish delta divergence and bid wall confirmation

Analysis: Institutional buyers are absorbing selling pressure at $76,213 support level...
```

**What to do**: Use as **confirmation only**. Check scanner first, then use AI to validate reasoning.

### SELL Signal
Same structure as BUY, but for short setups.

---

## Costs & Limitations

### API Costs
- Each click = 1 API call to OpenAI
- Uses GPT-4o-mini (~$0.15 per million tokens)
- Average cost: ~$0.001 per click
- **Unlimited clicks available** but don't abuse

### Latency
- **3-5 seconds** round trip (browser → Vercel → OpenAI → back)
- During this time, price can move significantly
- **Not suitable for scalping entries**

### Non-Determinism
- Same data might produce different outputs on different calls
- Temperature set to 0.3 for consistency but still not 100% deterministic
- **Don't use for systematic/repeatable strategies**

---

## Technical Implementation

### Frontend (orderflow.html)
```javascript
async function generateSignal() {
  // Gathers market data
  const marketData = {
    symbol: activeSym,
    currentPrice: s.last,
    volumeProfile: { poc, vah, val },
    footprint: { delta: totalDelta },
    orderBook: { bidWalls, askWalls }
  };
  
  // Calls API
  const response = await fetch('/api/generate-signal', {
    method: 'POST',
    body: JSON.stringify({ symbol: activeSym, marketData })
  });
}
```

### Backend (pages/api/generate-signal.ts)
- Receives market data
- Sends to OpenAI with institutional system prompt
- Parses JSON response
- Stores in Redis for 1 hour (for tracking)
- Returns structured signal

### System Prompt
Full institutional trading framework loaded into GPT-4o-mini:
- Volume Profile scoring rules
- DOM Wall analysis
- Footprint Delta interpretation
- Delta Divergence detection
- Candle Structure patterns
- Signal rules (minimum score, R:R requirements)
- Output format enforcement (JSON)

---

## Scanner vs AI: Which Should You Use?

### SCANNER (Primary Tool) ✅

**Strengths:**
- ✅ **Real-time** — Runs every render cycle (~16ms), catches setups instantly
- ✅ **Rule-based consistency** — Same criteria every time, zero hallucination
- ✅ **Quantifiable thresholds** — See exactly which conditions triggered
- ✅ **Speed** — No API delays, instant signals
- ✅ **Backtestable** — Rules can be verified historically
- ✅ **No API costs** — Runs infinitely free
- ✅ **Institutional methodology** — Matches how prop desks actually trade

**Weaknesses:**
- ❌ No narrative explanation
- ❌ Can't weigh conflicting signals holistically
- ❌ Requires manual interpretation of condition pills

**Best For:**
- Live trading execution
- Scalping and day trading
- Systematic strategy development
- High-frequency signal detection

---

### AI BUTTON (Secondary Confirmation) ⚠️

**Strengths:**
- ✅ **Narrative reasoning** — Explains the "why" in plain English
- ✅ **Synthesis** — Weighs conflicting signals holistically
- ✅ **Educational** — Helps understand institutional logic
- ✅ **Second opinion** — Validation for borderline setups

**Weaknesses:**
- ❌ **Slow** — 3-5 second API delay (you'll miss entries)
- ❌ **Non-deterministic** — Same data might give different answers
- ❌ **Hallucination risk** — Can invent reasoning that sounds good but is wrong
- ❌ **Costly** — Every click costs API credits (though minimal)
- ❌ **Manual trigger** — You have to remember to click it

**Best For:**
- Post-trade analysis
- Learning institutional reasoning
- Second opinion on borderline setups
- Trade journaling documentation

---

## Institutional Trader Recommendation

### Primary Workflow (What I Actually Use):

1. **SCANNER runs 24/7** detecting setups based on quantifiable criteria
2. **When scanner fires (4+ stars)**, I review the condition pills
3. **If borderline (3 stars)**, I click AI button for second opinion
4. **I make the final decision** based on:
   - Scanner conditions met
   - AI narrative (if consulted)
   - My own market context awareness
   - Risk management rules

### Key Principles:

1. **Never wait for AI to click** — Scanner is your trigger
2. **Use AI as a study tool** — Learn why setups work/fail
3. **Trust the scanner over AI** — Rule-based systems beat LLMs for execution
4. **The scanner IS institutional** — Real prop desks use quant systems, not chatbots

### Red Flags:

🚨 If AI says BUY but scanner shows weak conditions → **Trust scanner, skip trade**
🚨 If scanner fires but AI says FLAT → **Investigate why, but scanner has the edge**
🚨 If both disagree strongly → **Skip trade, wait for clearer setup**

---

## Recent Institutional Enhancements (Deployed)

### 1. Signal Persistence
Signals must hold for **2 consecutive checks** (3-second intervals) before firing. This filters out false positives from momentary spikes.

### 2. Absorption Detection
Detects when price holds despite aggressive delta, indicating institutional absorption:
- Sellers absorbed at support = bullish boost
- Buyers absorbed at resistance = bearish boost

### 3. Delta Divergence Filter
Compares recent vs older bars:
- Price lower low + delta higher low = hidden bullish strength
- Price higher high + delta lower high = bearish exhaustion

### 4. Volume Confirmation
Signals with **expanding volume** (20%+ increase) get score boost. High-volume signals have higher win rates.

### 5. Time Filter
Avoids trading during low liquidity hours (22:00-03:00 UTC). During these hours, threshold increases by +2 optional conditions.

---

## Summary

| Feature | Scanner | AI Button |
|---------|---------|-----------|
| Speed | Instant (~16ms) | Slow (3-5s) |
| Consistency | 100% | ~80% (non-deterministic) |
| Cost | Free | ~$0.001/click |
| Best Use | Live execution | Analysis/learning |
| Institutional Match | ✅ High | ⚠️ Low |
| Recommendation | **PRIMARY** | **SECONDARY** |

**Bottom Line**: The scanner is your trading edge. The AI button is your study buddy. Use them accordingly.

---

*Document generated by institutional trading system | Last updated: $(date)*
