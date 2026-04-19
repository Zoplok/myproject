import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface HighlightSegment {
  start: number;
  end: number;
  type: "clutch" | "rage" | "hype" | "funny" | "skill";
  confidence: number;
  title: string;
}

function generateHighlights(streamDuration: number): HighlightSegment[] {
  const highlights: HighlightSegment[] = [];
  const types: Array<"clutch" | "rage" | "hype" | "funny" | "skill"> = ["clutch", "rage", "hype", "funny", "skill"];

  for (let i = 0; i < Math.floor(Math.random() * 5) + 2; i++) {
    const start = Math.floor(Math.random() * (streamDuration - 600));
    const end = Math.min(start + 300 + Math.floor(Math.random() * 300), streamDuration);
    const type = types[Math.floor(Math.random() * types.length)];
    const confidence = 0.7 + Math.random() * 0.3;

    const titles: Record<string, string[]> = {
      clutch: ["1v5 Ace", "Incredible Comeback", "Last Second Win", "Miraculous Save"],
      rage: ["Viewer Gets Destroyed", "Hilarious Outplay", "Classic Rage Moment", "Perfect Fail"],
      hype: ["INSANE PLAY", "Chat Explosion", "Peak Performance", "Absolute Banger"],
      funny: ["Unexpected Twist", "Chat Can't Stop Laughing", "Perfect Comedic Timing", "Blunder of the Century"],
      skill: ["Mechanical Mastery", "Perfect Execution", "Pro-Level Play", "Frame Perfect Movement"],
    };

    const typeTitle = titles[type][Math.floor(Math.random() * titles[type].length)];

    highlights.push({ start, end, type, confidence, title: typeTitle });
  }

  return highlights.sort((a, b) => a.start - b.start);
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const { streamDuration = 3600 } = await req.json();

    if (typeof streamDuration !== "number" || streamDuration < 60) {
      return new Response(
        JSON.stringify({ error: "Invalid stream duration" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const highlights = generateHighlights(streamDuration);

    return new Response(
      JSON.stringify({
        highlights,
        totalHighlights: highlights.length,
        generatedAt: new Date().toISOString(),
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
