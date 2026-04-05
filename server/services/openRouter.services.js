import axios from "axios";

const models = [
    "google/gemini-2.0-flash-001",
    "anthropic/claude-3.5-haiku",
    "openai/gpt-4o-mini",
    "google/gemini-2.0-flash-exp:free",
    "meta-llama/llama-3.1-8b-instruct:free",
    "mistralai/mistral-7b-instruct:free",
];

export const askAi = async ({ messages }) => {
    try {
        if (!messages || !Array.isArray(messages) || messages.length === 0) {
            throw new Error("Messages array is empty");
        }

        for (const model of models) {
            try {
                const response = await axios.post(
                    "https://openrouter.ai/api/v1/chat/completions",
                    { model, messages },
                    {
                        headers: {
                            Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
                            'Content-Type': 'application/json',
                        }
                    }
                );

                const content = response.data.choices?.[0]?.message?.content;

                if (!content || !content.trim()) {
                    console.warn(`Model ${model} returned empty response. Trying next...`);
                    continue;  // skip to next model
                }

                console.log(`Success with model: ${model}`);
                return content;

            } catch (modelError) {
                console.warn(`Model ${model} failed: ${modelError.message}. Trying next...`);
                continue;  // skip to next model
            }
        }

        throw new Error("All models failed");

    } catch (error) {
        console.error("OpenRouter Error:", error.message || error.response?.data);
        throw new Error("OpenRouter API Error");
    }
};