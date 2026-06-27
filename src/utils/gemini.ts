import { GoogleGenAI } from '@google/genai'

// Initialize the Google Gen AI SDK.
// It will automatically use the process.env.GEMINI_API_KEY.
export const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
})

// Configured model, defaulting to gemini-2.5-flash (or your specified flash model version)
export const GEMINI_MODEL = process.env.NEXT_PUBLIC_GEMINI_MODEL || 'gemini-2.5-flash'
