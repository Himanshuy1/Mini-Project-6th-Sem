import OpenAI from "openai";

export const detectFakeNews = async (article) => {
  try {
    const API_KEY = process.env.GROK_API_KEY;
    if (!API_KEY) {
      console.warn("GROK_API_KEY is not set. Returning 'Pending'.");
      return { prediction: "Pending", confidenceScore: 0 };
    }

    const openai = new OpenAI({
      apiKey: API_KEY,
      baseURL: "https://api.x.ai/v1",
    });

    const prompt = `You are a professional fake news detection system.

Analyze the following news article carefully and classify it strictly into one of 3 categories:

REAL → verified or likely true news from credible sources
FAKE → misleading, false, clickbait or suspicious claim
MISLEADING → partially true but exaggerated or unclear

Instructions:
1. Assume news from reputed media sources (e.g., AP News, Reuters, BBC, The New York Times, The Guardian, NPR, Al Jazeera, AFP, Bloomberg) is likely real.
2. Only mark FAKE if the claim is clearly unrealistic or misleading.
3. Avoid marking everything as uncertain.
4. Provide confidence percentage.
5. Give short reason.

Return output in JSON format only:
{
 "label": "REAL or FAKE or MISLEADING",
 "confidence": 95,
 "reason": "short explanation"
}

Article Title: ${article.title}
Article Description: ${article.description || article.content}
Article Source: ${article.source}`;

    const response = await openai.chat.completions.create({
      model: "grok-beta",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.1,
    });

    const responseText = response.choices[0].message.content.trim();
    
    // strip markdown if the model accidentally wraps it in markdown code blocks
    const cleanedText = responseText.replace(/```json/gi, "").replace(/```/g, "").trim();
    const result = JSON.parse(cleanedText);

    let predictionVal = "Uncertain";
    if (result.label) {
      const lbl = result.label.toUpperCase();
      if (lbl.includes('REAL')) predictionVal = 'Real';
      else if (lbl.includes('FAKE')) predictionVal = 'Fake';
      else if (lbl.includes('MISLEADING') || lbl.includes('UNCERTAIN')) predictionVal = 'Misleading';
    }

    let conf = 50;
    if (typeof result.confidence === 'string') {
      conf = parseInt(result.confidence.replace('%', ''), 10);
    } else if (typeof result.confidence === 'number') {
      conf = result.confidence;
    }

    return {
      prediction: predictionVal,
      confidenceScore: isNaN(conf) ? 50 : conf,
      reason: result.reason || ""
    };
  } catch (error) {
    console.error("Error calling Grok API:", error.message);
    return { prediction: "Uncertain", confidenceScore: 0 };
  }
};

export const verifyManualContent = async ({ textContent, base64Image }) => {
  try {
    const API_KEY = process.env.GROK_API_KEY;
    if (!API_KEY) return { prediction: "Uncertain", confidenceScore: 0, reason: "No API Key configuration found." };
    
    const openai = new OpenAI({ apiKey: API_KEY, baseURL: "https://api.x.ai/v1" });
    
    let messages = [];
    const systemPrompt = `You are a professional fake news detection system.
Analyze the provided content carefully and classify it strictly into one of 3 categories:
REAL → verified or likely true news from credible sources
FAKE → misleading, false, clickbait or suspicious claim
MISLEADING → partially true but exaggerated or unclear

If you are provided an image, extract the visible text or context and evaluate if it appears to be a legitimate news source or a manipulated/fake screenshot. If you are provided text, evaluate the text logic and claims directly.

Return output in JSON format only:
{
 "label": "REAL or FAKE or MISLEADING",
 "confidence": 95,
 "reason": "short explanation of your analysis"
}`;

    if (base64Image) {
      messages = [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: [
            { type: "text", text: "Please analyze the authenticity of the news presented in this image." },
            { type: "image_url", image_url: { url: `data:image/jpeg;base64,${base64Image}` } }
          ]
        }
      ];
    } else {
      messages = [
        { role: "user", content: `${systemPrompt}\n\nContent to analyze:\n${textContent}` }
      ];
    }

    const response = await openai.chat.completions.create({
      model: base64Image ? "grok-vision-beta" : "grok-beta",
      messages: messages,
      temperature: 0.1,
    });

    const responseText = response.choices[0].message.content.trim();
    const cleanedText = responseText.replace(/```json/gi, "").replace(/```/g, "").trim();
    const result = JSON.parse(cleanedText);

    let predictionVal = "Uncertain";
    if (result.label) {
      const lbl = result.label.toUpperCase();
      if (lbl.includes('REAL')) predictionVal = 'Real';
      else if (lbl.includes('FAKE')) predictionVal = 'Fake';
      else if (lbl.includes('MISLEADING') || lbl.includes('UNCERTAIN')) predictionVal = 'Misleading';
    }

    let conf = 50;
    if (typeof result.confidence === 'string') {
      conf = parseInt(result.confidence.replace('%', ''), 10);
    } else if (typeof result.confidence === 'number') {
      conf = result.confidence;
    }

    return {
      prediction: predictionVal,
      confidenceScore: isNaN(conf) ? 50 : conf,
      reason: result.reason || ""
    };
  } catch (error) {
    console.error("Manual Verify API error:", error.message);
    return { prediction: "Uncertain", confidenceScore: 0, reason: "Grok API encountered an error processing this request." };
  }
};
