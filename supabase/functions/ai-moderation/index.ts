import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface ModerationType {
  message: string;
  isFlagged: boolean;
  reason?: string;
  confidence?: number;
}

const TOXIC_KEYWORDS = [
  "hate", "stupid", "dumb", "idiot", "trash", "sucks", "noob",
  "kill", "die", "cancer", "aids", "racism", "sexism"
];

const SPAM_PATTERNS = [
  /(.)\1{4,}/gi,
  /([a-z])\1{3,}/gi,
  /^[\s!?]{3,}$/,
];

function checkForToxicity(message: string): { isFlagged: boolean; reason?: string } {
  const lowerMsg = message.toLowerCase();

  for (const keyword of TOXIC_KEYWORDS) {
    if (lowerMsg.includes(keyword)) {
      return { isFlagged: true, reason: "Toxic language detected" };
    }
  }

  return { isFlagged: false };
}

function checkForSpam(message: string): { isFlagged: boolean; reason?: string } {
  for (const pattern of SPAM_PATTERNS) {
    if (pattern.test(message)) {
      return { isFlagged: true, reason: "Spam detected" };
    }
  }

  if (message.length > 200 && message.split(" ").length < 5) {
    return { isFlagged: true, reason: "Possible spam" };
  }

  return { isFlagged: false };
}

function checkForURLs(message: string): { isFlagged: boolean; reason?: string } {
  const urlPattern = /https?:\/\/[^\s]+/gi;
  if (urlPattern.test(message)) {
    return { isFlagged: true, reason: "URL detected" };
  }
  return { isFlagged: false };
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const { message } = await req.json();

    if (!message || typeof message !== "string") {
      return new Response(
        JSON.stringify({ error: "Invalid message" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const toxicityCheck = checkForToxicity(message);
    const spamCheck = checkForSpam(message);
    const urlCheck = checkForURLs(message);

    const isFlagged = toxicityCheck.isFlagged || spamCheck.isFlagged || urlCheck.isFlagged;
    const reason = toxicityCheck.reason || spamCheck.reason || urlCheck.reason;

    const result: ModerationType = {
      message,
      isFlagged,
      reason,
      confidence: isFlagged ? 0.85 : 0.0,
    };

    return new Response(
      JSON.stringify(result),
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
