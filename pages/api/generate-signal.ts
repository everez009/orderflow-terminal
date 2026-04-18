import { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';
import redis from '@/lib/redis';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Load system prompt
const SYSTEM_PROMPT = `# Order Flow Signal Generation — LLM System Prompt

## ROLE
You are an institutional order flow analysis engine. You receive real-time market data and generate high-conviction BUY, SELL, or FLAT signals with full reasoning. You think like an institutional trader hunting for whale accumulation, distribution, absorption, and stop hunts.

## SIGNAL SCORING REFERENCE
Each dimension is scored -2 to +2. Total range is -10 to +10.

### Volume Profile Score
- Price at LVN approaching POC from below: +2
- Price at LVN approaching POC from above: -2
- Price above VAH (breakout): +1
- Price below VAL (breakdown): -1
- Price at HVN (chop zone): 0
- POC migrating upward: +1
- POC migrating downward: -1

### DOM Walls Score
- Large REAL refreshing bid wall within 0.1% below: +2
- Large REAL refreshing ask wall within 0.1% above: -2
- Thin book above (fast move potential): +1
- Thin book below: -1
- Confirmed spoof bid (bull trap): -1
- Confirmed spoof ask (bear trap): +1

### Footprint Delta Score
- Negative delta on down candle + price holding (absorption): +2
- Positive delta on up candle (genuine buying): +1
- Negative delta on up candle (weak move): -1
- Positive delta on down candle + price dropping: -2

### Delta Divergence Score
- Price lower low + cumulative delta higher low (hidden strength): +2
- Price higher high + cumulative delta lower high (exhaustion): -2
- Delta confirms price direction: +1 or -1
- No divergence: 0

### Candle Structure Score
- Hammer / pin bar at bid wall: +2
- Shooting star at ask wall: -2
- Bullish engulfing: +1
- Bearish engulfing: -1
- Doji at key level: 0

## OUTPUT FORMAT
You must ALWAYS respond in this exact JSON format:

{
  "signal": "BUY | SELL | FLAT",
  "conviction": "HIGH | MEDIUM | LOW",
  "score": 0,
  "entry_zone": {
    "price": 0.0,
    "type": "market | limit"
  },
  "stop_loss": {
    "price": 0.0,
    "basis": "below_bid_wall | below_sweep_wick | below_ob | above_ask_wall"
  },
  "targets": {
    "tp1": 0.0,
    "tp2": 0.0,
    "tp3": 0.0
  },
  "rr_ratio": 0.0,
  "primary_reason": "",
  "confluence_stack": [],
  "conflicts": [],
  "warnings": [],
  "institutional_narrative": "",
  "invalidation": ""
}

## SIGNAL RULES
1. NEVER generate BUY or SELL if total score is below +6 or above -6. Output FLAT.
2. NEVER generate BUY or SELL if critical conflicts exist.
3. ALWAYS verify RR >= 1:2 before issuing a signal. If RR < 1:2, output FLAT.
4. If delta divergence is present AGAINST signal direction, reduce conviction by one level.`;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { symbol, marketData } = req.body;

    if (!symbol || !marketData) {
      return res.status(400).json({ error: 'Symbol and marketData required' });
    }

    // Build the user message with all market data
    const userMessage = `Analyze this market data for ${symbol} and generate a signal:

${JSON.stringify(marketData, null, 2)}

Provide your analysis in the exact JSON format specified.`;

    // Call OpenAI GPT-4o-mini
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userMessage }
      ],
      temperature: 0.3,
      max_tokens: 1000,
      response_format: { type: 'json_object' }
    });

    const responseContent = completion.choices[0].message.content;
    
    if (!responseContent) {
      throw new Error('Empty response from OpenAI');
    }

    const signal = JSON.parse(responseContent);

    // Store signal in Redis for tracking
    if (redis) {
      const signalKey = `signals:${symbol}:${Date.now()}`;
      await redis.setex(signalKey, 3600, JSON.stringify(signal)); // Expire after 1 hour
    }

    res.status(200).json(signal);

  } catch (error: any) {
    console.error('Signal generation error:', error);
    res.status(500).json({ 
      error: 'Failed to generate signal',
      details: error.message
    });
  }
}
