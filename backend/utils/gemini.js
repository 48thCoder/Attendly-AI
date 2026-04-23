const { GoogleGenerativeAI } = require('@google/generative-ai');

let genAI = null;
let model = null;

const initGemini = () => {
  if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your-gemini-api-key') {
    console.warn('GEMINI_API_KEY not configured. AI features will use fallback responses.');
    return false;
  }

  try {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    return true;
  } catch (error) {
    console.error('Failed to initialize Gemini:', error.message);
    return false;
  }
};

const analyzeAttendance = async (prompt) => {
  if (!model && !initGemini()) {
    throw new Error('Gemini API not configured');
  }

  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    try {
      const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/) ||
                         text.match(/\{[\s\S]*\}/);

      if (jsonMatch) {
        const jsonStr = jsonMatch[1] || jsonMatch[0];
        return JSON.parse(jsonStr);
      }

      return { rawResponse: text };
    } catch (parseError) {
      return { rawResponse: text };
    }
  } catch (error) {
    console.error('Gemini API call failed:', error.message);
    throw error;
  }
};

module.exports = { analyzeAttendance, initGemini };
