// app/api/chat/route.js
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

// Create an instance of the Gemini API client using your API key.
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(request) {
  try {
    // Parse the JSON body to extract the message and context.
    const { message, context } = await request.json();
    // Get the Gemini model (here "gemini-pro" is used).
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // Build a prompt that incorporates the provided context and message.
    const prompt = `
      Context: ${context}
      Question: ${message}
      Please provide a relevant answer based on the context provided.
    `;

    // Call the model to generate content based on the prompt.
    const result = await model.generateContent(prompt);
    
    // Await the response from the model. (result.response is a promise.)
    const response = await result.response;
    
    // IMPORTANT: Await the text() method since it returns a promise.
    const text = await response.text();

    // Return the generated text as a JSON response.
    return NextResponse.json({ message: text }, { status: 200 });
  } catch (error) {
    console.error('Error:', error);
    // Return a JSON error response with a 500 status code.
    return NextResponse.json({ message: "Error processing your request" }, { status: 500 });
  }
}
