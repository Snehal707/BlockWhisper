
const NOUS_API_KEY = process.env.NOUS_API_KEY;
const NOUS_API_URL = process.env.NOUS_API_URL || 'https://api.nousresearch.com/v1/chat/completions';
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

interface FortuneResponse {
    fortune: string;
    keywords: string[]; // For background objects
}

export async function generateFortune(summary: string): Promise<FortuneResponse> {
    // Try Nous first, then OpenAI, then mock
    if (NOUS_API_KEY) {
        try {
            console.log('🤖 Generating fortune using Nous Research (Hermes 3)...');
            return await callLLMAPI(NOUS_API_URL, NOUS_API_KEY, "Hermes-3-Llama-3.1-405B", summary);
        } catch (error) {
            console.error('Nous API failed:', error);
            // Fall through to OpenAI
        }
    }

    if (OPENAI_API_KEY) {
        try {
            return await callLLMAPI('https://api.openai.com/v1/chat/completions', OPENAI_API_KEY, "gpt-3.5-turbo", summary);
        } catch (error) {
            console.error('OpenAI API failed:', error);
            // Fall through to mock
        }
    }

    // Fallback to mock fortune
    console.warn('No valid LLM API configured, using mock fortune.');
    return {
        fortune: generateMockFortune(summary),
        keywords: ["stars", "moon", "crystals"]
    };
}

async function callLLMAPI(apiUrl: string, apiKey: string, model: string, summary: string): Promise<FortuneResponse> {
    const prompt = `You are a mystical fortune teller on the Base blockchain. 
    Analyze the following summary of a user's ONCHAIN activity from the last 24 hours:
    "${summary}"
    
    Based on this, tell them their fortune for the coming day. Be cryptic but relevant to crypto/Base culture (e.g., gas fees, mints, hodling, wagmi).
    Also provide a list of 3-5 keywords for visual objects that represent this fortune (e.g., "bull", "rocket", "broken_key", "golden_coin").
    
    Return ONLY a JSON object with keys: "fortune" (string) and "keywords" (array of strings).`;

    const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            model,
            messages: [
                { role: "system", content: "You are a mystical blockchain fortune teller. Output only valid JSON." },
                { role: "user", content: prompt }
            ],
            temperature: 0.8,
            max_tokens: 200
        })
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error(`LLM API Error (${response.status}):`, errorText);
        throw new Error(`API returned ${response.status}: ${errorText.substring(0, 100)}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;

    try {
        const parsed = JSON.parse(content);
        return parsed;
    } catch (e) {
        console.error("Failed to parse LLM JSON, using text as fortune:", content);
        return {
            fortune: content || "The spirits speak in riddles today.",
            keywords: ["mystery", "unknown"]
        };
    }
}

function generateMockFortune(summary: string): string {
    const txCount = (summary.match(/Total Transactions: (\d+)/) || [])[1];

    if (!txCount || txCount === '0') {
        return "Your wallet rests in stillness, like a calm sea before the storm. The Base gods smile upon patience. ⛩️";
    }

    const count = parseInt(txCount);
    if (count > 10) {
        return "The chains dance to your command! Many transactions flow through your hands. Fortune favors the bold trader. 🚀";
    } else if (count > 5) {
        return "Your onchain footsteps echo through the Base. Moderate activity brings balanced karma. ⚖️";
    } else {
        return "A few whispers on the blockchain. Your journey is just beginning. WAGMI. 🌟";
    }
}
