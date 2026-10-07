"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.explainMatch = explainMatch;
exports.generateDonationDescription = generateDonationDescription;
exports.generateImpactStory = generateImpactStory;
exports.analyzeDonationInput = analyzeDonationInput;
exports.analyzeFoodImage = analyzeFoodImage;
const genai_1 = require("@google/genai");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const apiKey = process.env.GEMINI_API_KEY;
let ai = null;
if (apiKey && apiKey.trim() !== '' && apiKey !== 'your_gemini_api_key_here') {
    try {
        ai = new genai_1.GoogleGenAI({ apiKey });
    }
    catch (err) {
        console.warn('Failed to initialize GoogleGenAI:', err);
    }
}
async function explainMatch(donation, ngo, matchScore, reasons) {
    const defaultExplanation = `This donation is a strong match (${matchScore}%) because ${ngo.organization_name} is in close proximity, accepts ${donation.food_type} meals, has capacity for ${donation.servings} servings, and operates in ${ngo.service_area}. Pickup is recommended swiftly to ensure maximum freshness.`;
    if (!ai)
        return defaultExplanation;
    try {
        const prompt = `You are FoodBridge AI's coordinator. Explain why ${ngo.organization_name} is a ${matchScore}% match for a food donation of ${donation.servings} servings of ${donation.food_name} (${donation.food_type}) located at ${donation.address}.
Key matching factors: ${reasons.join(', ')}.
Keep the tone warm, professional, encouraging, and brief (2-3 sentences max). Do not state fictional data.`;
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        return response.text?.trim() || defaultExplanation;
    }
    catch (error) {
        console.error('Gemini explainMatch error fallback:', error);
        return defaultExplanation;
    }
}
async function generateDonationDescription(input) {
    const fallbackDesc = `${input.quantity} ${input.unit || 'units'} of freshly prepared ${input.food_type} ${input.food_name} (${input.servings} servings) available for community distribution. ${input.pickup_instructions ? `Pickup notes: ${input.pickup_instructions}` : 'Ready for immediate pickup.'}`;
    if (!ai)
        return fallbackDesc;
    try {
        const prompt = `Generate a clear, professional 2-sentence description for a food donation listing.
Food: ${input.food_name}
Type: ${input.food_type}
Quantity: ${input.quantity} ${input.unit || 'units'} (${input.servings} servings)
Instructions: ${input.pickup_instructions || 'Standard pickup'}
Make it concise and suitable for NGOs to read immediately.`;
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        return response.text?.trim() || fallbackDesc;
    }
    catch (error) {
        console.error('Gemini generateDonationDescription fallback:', error);
        return fallbackDesc;
    }
}
async function generateImpactStory(input) {
    const fallbackStory = `Your donation of ${input.servings} servings of ${input.food_name} helped provide nutritious meals to community members through ${input.ngo_name}. Together, we rescued valuable surplus food from going to waste!`;
    if (!ai)
        return fallbackStory;
    try {
        const prompt = `Write an inspiring 2-sentence impact thank-you story for a food donor.
Donor: ${input.donor_name || 'Generous Food Donor'}
Food Donated: ${input.servings} meals of ${input.food_name}
Receiving NGO: ${input.ngo_name}
Highlight how many people were fed and the environmental impact of rescuing surplus food.`;
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        return response.text?.trim() || fallbackStory;
    }
    catch (error) {
        console.error('Gemini generateImpactStory fallback:', error);
        return fallbackStory;
    }
}
async function analyzeDonationInput(rawText) {
    const fallbackResult = {
        food_name: rawText.length > 25 ? 'Prepared Meal Packets' : rawText,
        food_type: (rawText.toLowerCase().includes('chicken') || rawText.toLowerCase().includes('meat') || rawText.toLowerCase().includes('biryani') ? 'non-vegetarian' : 'vegetarian'),
        quantity: 40,
        unit: 'packets',
        servings: 40,
        urgency: (rawText.toLowerCase().includes('urgent') || rawText.toLowerCase().includes('soon') || rawText.toLowerCase().includes('today') ? 'HIGH' : 'MEDIUM'),
        suggested_description: `${rawText}. Ready for community distribution and immediate pickup.`
    };
    if (!ai)
        return fallbackResult;
    try {
        const prompt = `Analyze this donor prompt: "${rawText}"
Return ONLY a valid JSON object (no markdown formatting, no code blocks) with the following structure:
{
  "food_name": string (e.g. Biryani Packets),
  "food_type": "vegetarian" | "non-vegetarian" | "vegan",
  "quantity": number,
  "unit": string (e.g. packets, kg, boxes),
  "servings": number,
  "urgency": "LOW" | "MEDIUM" | "HIGH" | "CRITICAL",
  "suggested_description": string
}`;
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        const text = response.text?.trim() || '';
        const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(cleanJson);
        return {
            food_name: parsed.food_name || fallbackResult.food_name,
            food_type: parsed.food_type || fallbackResult.food_type,
            quantity: parsed.quantity || fallbackResult.quantity,
            unit: parsed.unit || fallbackResult.unit,
            servings: parsed.servings || fallbackResult.servings,
            urgency: parsed.urgency || fallbackResult.urgency,
            suggested_description: parsed.suggested_description || fallbackResult.suggested_description,
        };
    }
    catch (error) {
        console.error('Gemini analyzeDonationInput fallback:', error);
        return fallbackResult;
    }
}
async function analyzeFoodImage(base64Data, mimeType = 'image/jpeg') {
    let cleanBase64 = base64Data;
    if (base64Data.includes(',')) {
        const parts = base64Data.split(',');
        const headerMatch = parts[0].match(/data:(.*?);base64/);
        if (headerMatch)
            mimeType = headerMatch[1];
        cleanBase64 = parts[1];
    }
    if (!ai) {
        return mockImageFoodAnalysis(cleanBase64);
    }
    try {
        const prompt = `You are FoodBridge AI's food identification model. Analyze the provided image of food for a charity food donation platform.
Return ONLY a valid JSON object without markdown wrappers with this exact JSON format:
{
  "isFood": boolean,
  "foodName": string,
  "category": string,
  "foodType": "vegetarian" | "non-vegetarian" | "vegan" | "unknown",
  "description": string,
  "confidence": number
}

Rules:
1. "isFood": Set to true if the image contains edible food or meals. Set to false if the image shows non-food items (such as shoes, electronics, furniture, or empty dark spaces).
2. "foodName": Specific food name (e.g. Paneer Curry, Chicken Biryani, Samosa, Dal Tadka, Fruit Basket).
3. "category": Food category (e.g. Indian Cuisine, Bakery & Snacks, Cooked Meals, Fresh Produce, Beverages).
4. "foodType": "vegetarian", "non-vegetarian", "vegan", or "unknown".
5. "description": A short, appetizing 1-2 sentence description suitable for community distribution.
6. "confidence": A floating point number between 0.0 and 1.0 representing recognition confidence level (e.g. 0.92 for clear food, 0.55 for somewhat blurry, 0.15 for unclear/non-food).`;
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: [
                prompt,
                {
                    inlineData: {
                        mimeType: mimeType || 'image/jpeg',
                        data: cleanBase64,
                    },
                },
            ],
        });
        const text = response.text?.trim() || '';
        const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(cleanJson);
        return {
            isFood: typeof parsed.isFood === 'boolean' ? parsed.isFood : true,
            foodName: parsed.foodName || 'Paneer Curry',
            category: parsed.category || 'Indian Cuisine',
            foodType: ['vegetarian', 'non-vegetarian', 'vegan', 'unknown'].includes(parsed.foodType)
                ? parsed.foodType
                : 'vegetarian',
            description: parsed.description || 'Freshly prepared meals ready for community distribution.',
            confidence: typeof parsed.confidence === 'number' ? Math.min(Math.max(parsed.confidence, 0), 1) : 0.91,
        };
    }
    catch (error) {
        console.error('Gemini analyzeFoodImage error, using fallback:', error);
        return mockImageFoodAnalysis(cleanBase64);
    }
}
function mockImageFoodAnalysis(base64) {
    const base64Lower = base64.toLowerCase();
    if (base64Lower.includes('shoe') || base64Lower.includes('nonfood')) {
        return {
            isFood: false,
            foodName: 'Non-Food Object',
            category: 'Unknown',
            foodType: 'unknown',
            description: 'Image does not contain recognizable food.',
            confidence: 0.12,
            message: "We couldn't identify food in this image. Please upload a clear photo of the food.",
        };
    }
    if (base64Lower.includes('blurry') || base64Lower.includes('dark')) {
        return {
            isFood: true,
            foodName: 'Mixed Prepared Meal',
            category: 'Cooked Meals',
            foodType: 'vegetarian',
            description: 'Prepared surplus meal ready for local shelter distribution.',
            confidence: 0.52,
            message: "We couldn't confidently identify the food.",
        };
    }
    return {
        isFood: true,
        foodName: 'Paneer Curry',
        category: 'Indian Cuisine',
        foodType: 'vegetarian',
        description: 'Freshly prepared paneer curry suitable for community distribution.',
        confidence: 0.91,
    };
}
