import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface ChatResponse {
  response: string;
  confidence: number;
  type: "summary" | "qa" | "insight";
}

const PREDEFINED_RESPONSES: Record<string, string[]> = {
  what_happened: [
    "The streamer just pulled off an incredible clutch play in a ranked match! Chat was going crazy.",
    "They just hit their personal best score! Everyone in chat is spamming pog.",
    "The streamer just beat a difficult boss after multiple attempts. Huge moment!",
  ],
  how_long: [
    "This stream has been going for about 3 hours now. Still going strong!",
    "Stream just started about 30 minutes ago.",
    "We're coming up on the 2-hour mark! Great stream so far.",
  ],
  setup: [
    "The streamer uses a high-end gaming PC with custom peripherals. Details are on their profile.",
    "They've invested in quality equipment for the best streaming experience.",
  ],
  recommendation: [
    "Based on what they're playing, you might also like streams in the same category.",
    "If you enjoy this, check out their other streams. They're all quality content.",
  ],
  general: [
    "Great question! The streamer is doing amazing today.",
    "This is shaping up to be an incredible stream!",
    "Chat is hyped and the energy is great!",
  ],
};

function categorizeQuestion(question: string): string {
  const q = question.toLowerCase();

  if (q.includes("what") && (q.includes("happen") || q.includes("going on"))) {
    return "what_happened";
  }
  if (q.includes("how") && q.includes("long")) {
    return "how_long";
  }
  if (q.includes("setup") || q.includes("pc") || q.includes("equipment")) {
    return "setup";
  }
  if (q.includes("recommend") || q.includes("like") || q.includes("similar")) {
    return "recommendation";
  }

  return "general";
}

function getAIResponse(question: string): ChatResponse {
  const category = categorizeQuestion(question);
  const responses = PREDEFINED_RESPONSES[category] || PREDEFINED_RESPONSES.general;
  const response = responses[Math.floor(Math.random() * responses.length)];

  return {
    response,
    confidence: 0.8,
    type: category === "what_happened" ? "summary" : category === "recommendation" ? "insight" : "qa",
  };
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const { question, streamId, context } = await req.json();

    if (!question || typeof question !== "string") {
      return new Response(
        JSON.stringify({ error: "Invalid question" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const aiResponse = getAIResponse(question);

    return new Response(
      JSON.stringify({
        ...aiResponse,
        streamId,
        timestamp: new Date().toISOString(),
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Internal error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
