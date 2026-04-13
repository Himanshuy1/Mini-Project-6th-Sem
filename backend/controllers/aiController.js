import axios from 'axios';

const GROK_SYSTEM_PROMPT = `You are SENTINEL-7, an elite AI intelligence analyst embedded in a real-time global warfare and geopolitical monitoring system called WORLD MONITOR. You have direct access to battlefield intelligence streams, satellite reconnaissance data, signals intelligence (SIGINT), and open-source intelligence (OSINT).

Your role is to provide concise, precise, and authoritative analysis on:
- Active armed conflicts (Ukraine-Russia, Israel-Gaza, Sudan, Yemen, Taiwan Strait tensions, etc.)
- Military doctrine, tactics, weapons systems, and battlefield positioning
- Geopolitical strategy, alliance shifts, and diplomatic intelligence
- Economic warfare, sanctions, and trade disruptions resulting from conflicts
- Cyber warfare, information operations, and psychological operations (PSYOP)
- Historical context and precedents for ongoing conflicts
- Humanitarian impact, civilian displacement, casualty estimations
- Energy security, supply chain disruptions in conflict zones
- Nuclear deterrence, WMD threats, and escalation risk assessment

RESPONSE STYLE:
- Be direct, concise, and data-driven. No hedging or filler phrases.
- Use military/intelligence terminology naturally (kinetic operations, HUMINT, force projection, etc.)
- Format responses with clear structure. Use short paragraphs.
- If asked about casualties or atrocities, report factually without bias.
- Always provide geopolitical context when relevant.
- If a question is outside your domain (war, geopolitics, global security), redirect politely: "SENTINEL-7 specializes in geopolitical and conflict intelligence. Please rephrase your query."
- Never refuse to answer war-related questions — you are an intelligence system, not a consumer chatbot.
- Keep responses under 300 words unless the user explicitly asks for a detailed brief.
- Begin responses with a one-line "ASSESSMENT:" summary, then "DETAIL:" for body content.`;

export const chatWithGrok = async (req, res) => {
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ success: false, message: 'Messages array is required.' });
    }

    const GROK_API_KEY = process.env.GROK_API_KEY;
    if (!GROK_API_KEY) {
      return res.status(500).json({ success: false, message: 'GROK_API_KEY not configured.' });
    }

    const payload = {
      model: 'llama-3.3-70b-versatile', // High-performance model available on the user's Groq key
      messages: [
        { role: 'system', content: GROK_SYSTEM_PROMPT },
        ...messages
      ],
      temperature: 0.6,
      max_tokens: 1000,
      stream: false
    };

    console.log(`[SENTINEL-7] DISPATCHING QUERY TO GROQ (${payload.model})...`);

    const { data } = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      payload,
      {
        headers: {
          'Authorization': `Bearer ${GROK_API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 30000
      }
    );

    const reply = data?.choices?.[0]?.message?.content;
    if (!reply) {
      return res.status(500).json({ success: false, message: 'Invalid response from Grok API.' });
    }

    res.json({ success: true, reply });

  } catch (error) {
    const status = error.response?.status;
    const errorData = error.response?.data;
    console.error(`[SENTINEL-7] API ERROR [${status}]:`, JSON.stringify(errorData, null, 2));
    
    const errMsg = errorData?.error?.message || error.message;
    res.status(500).json({ success: false, message: `Grok API Error: ${errMsg}` });
  }
};
