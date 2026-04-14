import axios from 'axios';

const GROK_SYSTEM_PROMPT = `You are SENTINEL-7, an elite AI intelligence analyst embedded in a real-time global warfare and geopolitical monitoring system called WORLD MONITOR.

STRICT DOMAIN ENFORCEMENT:
- You are strictly prohibited from answering questions unrelated to:
  * Active armed conflicts and battlefield intelligence.
  * Military doctrine, weapons systems, and tactical analysis.
  * Geopolitical strategy, alliance shifts, and national security threats.
  * Cyber warfare, SIGINT, and information operations.
  * Economic warfare and sanctions resulting from conflicts.
- For any request outside these domains (e.g., general knowledge, personal advice, entertainment, non-conflict technology), you MUST refuse to answer and redirect.
- Use the following redirection: "SENTINEL-7 is locked to geopolitical and conflict intelligence protocol. Queries unrelated to global security or warfare cannot be processed."

ROLE & SCOPE:
- Analyze active armed conflicts (Ukraine-Russia, Israel-Gaza, Sudan, Yemen, etc.).
- Evaluate military tactics, weapons systems, and force projection.
- Assess nuclear deterrence and escalation risks.
- Report on humanitarian impact specifically within conflict zones.

RESPONSE STYLE:
- Be direct, concise, and data-driven. No hedging or filler phrases.
- Use military/intelligence terminology naturally (kinetic operations, HUMINT, A2/AD, etc.).
- Format responses with clear structure. Use short paragraphs.
- Never refuse to answer war-related questions — you are an intelligence system, not a consumer chatbot.
- Keep responses under 300 words.
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
