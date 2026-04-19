import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface AnalyticData {
  peakViewers: number;
  avgViewers: number;
  totalWatchTime: number;
  newFollowers: number;
  subs: number;
  revenue: number;
  trend: "up" | "down" | "stable";
}

function generateAnalytics(): AnalyticData {
  const peakViewers = Math.floor(Math.random() * 50000) + 5000;
  const avgViewers = Math.floor(peakViewers * (0.5 + Math.random() * 0.3));

  return {
    peakViewers,
    avgViewers,
    totalWatchTime: Math.floor(Math.random() * 500) + 100,
    newFollowers: Math.floor(Math.random() * 500) + 50,
    subs: Math.floor(Math.random() * 100) + 10,
    revenue: Math.floor(Math.random() * 5000) + 500,
    trend: ["up", "down", "stable"][Math.floor(Math.random() * 3)] as "up" | "down" | "stable",
  };
}

function calculateStats(
  currentData: AnalyticData,
  previousData: AnalyticData
): {
  peakViewersChange: number;
  avgViewersChange: number;
  followersChange: number;
  subsChange: number;
  revenueChange: number;
} {
  return {
    peakViewersChange: Math.round(
      ((currentData.peakViewers - previousData.peakViewers) / previousData.peakViewers) * 100
    ),
    avgViewersChange: Math.round(
      ((currentData.avgViewers - previousData.avgViewers) / previousData.avgViewers) * 100
    ),
    followersChange: Math.round(
      ((currentData.newFollowers - previousData.newFollowers) / previousData.newFollowers) * 100
    ),
    subsChange: Math.round(
      ((currentData.subs - previousData.subs) / (previousData.subs || 1)) * 100
    ),
    revenueChange: Math.round(
      ((currentData.revenue - previousData.revenue) / previousData.revenue) * 100
    ),
  };
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const { streamId, period = "current" } = await req.json();

    if (!streamId || typeof streamId !== "string") {
      return new Response(
        JSON.stringify({ error: "Invalid stream ID" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const currentData = generateAnalytics();
    const previousData = generateAnalytics();

    const stats = calculateStats(currentData, previousData);

    return new Response(
      JSON.stringify({
        streamId,
        period,
        current: currentData,
        previous: previousData,
        changes: stats,
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
