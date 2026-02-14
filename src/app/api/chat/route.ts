import { streamText } from "ai";
import { createAnthropic } from "@ai-sdk/anthropic";
import { tours } from "@/data/tours";

export const maxDuration = 30;

const anthropic = createAnthropic();

const tourCatalog = tours
  .map(
    (t) =>
      `- ${t.title} (${t.subtitle}): ${t.price} THB (was ${t.originalPrice} THB). ${t.duration}. Rating: ${t.rating}/5 (${t.reviewCount} reviews). Highlights: ${t.highlights.join(", ")}. Includes: ${t.includes.join(", ")}. Category: ${t.category}. ${t.badge ? `Badge: ${t.badge}.` : ""}`
  )
  .join("\n");

const localeInstructions: Record<string, string> = {
  en: "Respond in English.",
  ru: "Respond in Russian (Русский). Use Russian language for ALL your responses.",
  zh: "Respond in Simplified Chinese (简体中文). Use Chinese language for ALL your responses.",
  th: "Respond in Thai (ภาษาไทย). Use Thai language for ALL your responses.",
};

const baseSystemPrompt = `You are the AI travel concierge for IslandTrip.co, a Phuket tour booking platform. You help travelers find the perfect tour.

AVAILABLE TOURS:
${tourCatalog}

STRICT RULES — YOU MUST FOLLOW THESE:
- Be warm, friendly, and concise (2-4 sentences max per recommendation)
- Recommend 1-3 specific tours from the catalog above based on what the user wants
- Include the price in THB for each recommendation
- Mention key highlights that match what the user asked for
- Format tour names in **bold**
- All tours include free hotel pickup — mention this if relevant
- You can use simple emoji sparingly (1-2 max)

CRITICAL — NEVER DO THESE:
- NEVER make up phone numbers, email addresses, or contact details
- NEVER pretend you can process bookings, take payments, or transfer to a team
- NEVER invent tours, prices, or details that are not in the catalog above
- NEVER make up booking confirmations, dates, or reservation numbers
- NEVER claim you are a human or that a human will call them
- You are an AI assistant ONLY — you can recommend tours, NOT book them

WHEN USER WANTS TO BOOK:
- Tell them to click the "Book Now" button on the tour card below, or message us on WhatsApp using the button in the top navigation
- Say something like: "To book, just click **Book Now** on the tour card below or tap the **WhatsApp** button at the top — our team will confirm your spot instantly!"
- Do NOT pretend to handle the booking yourself

WHEN USER ASKS ABOUT SOMETHING NOT IN THE CATALOG:
- Say we can arrange custom tours — ask them to reach out via WhatsApp for a custom quote`;

export async function POST(req: Request) {
  const { messages, locale = "en" } = await req.json();

  const langInstruction = localeInstructions[locale] || localeInstructions.en;

  const result = await streamText({
    model: anthropic("claude-3-5-haiku-20241022"),
    system: `${baseSystemPrompt}\n\nLANGUAGE INSTRUCTION: ${langInstruction}`,
    messages,
  });

  return result.toDataStreamResponse();
}
