import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    // Get all billable_users with LinkedIn CDN profile_picture URLs
    const { data: users, error: fetchError } = await supabase
      .from("billable_users")
      .select("id, profile_picture")
      .not("profile_picture", "is", null);

    if (fetchError) throw fetchError;

    const linkedinUsers = (users || []).filter(
      (u) =>
        u.profile_picture &&
        (u.profile_picture.includes("media.licdn.com") ||
          u.profile_picture.includes("linkedin.com"))
    );

    if (linkedinUsers.length === 0) {
      return new Response(
        JSON.stringify({ message: "No LinkedIn URLs to sync", synced: 0 }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const results: { id: string; success: boolean; error?: string }[] = [];

    for (const user of linkedinUsers) {
      try {
        // Download image from LinkedIn
        const imgResponse = await fetch(user.profile_picture!, {
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          },
        });

        if (!imgResponse.ok) {
          results.push({
            id: user.id,
            success: false,
            error: `HTTP ${imgResponse.status}`,
          });
          continue;
        }

        const imageBuffer = await imgResponse.arrayBuffer();
        const contentType =
          imgResponse.headers.get("content-type") || "image/jpeg";
        const ext = contentType.includes("png") ? "png" : "jpg";
        const filePath = `${user.id}.${ext}`;

        // Upload to Supabase Storage (upsert)
        const { error: uploadError } = await supabase.storage
          .from("profile-pictures")
          .upload(filePath, imageBuffer, {
            contentType,
            upsert: true,
          });

        if (uploadError) {
          results.push({
            id: user.id,
            success: false,
            error: uploadError.message,
          });
          continue;
        }

        // Get public URL
        const {
          data: { publicUrl },
        } = supabase.storage.from("profile-pictures").getPublicUrl(filePath);

        // Update billable_users with permanent URL
        const { error: updateError } = await supabase
          .from("billable_users")
          .update({ profile_picture: publicUrl })
          .eq("id", user.id);

        if (updateError) {
          results.push({
            id: user.id,
            success: false,
            error: updateError.message,
          });
          continue;
        }

        results.push({ id: user.id, success: true });
      } catch (e) {
        results.push({
          id: user.id,
          success: false,
          error: e instanceof Error ? e.message : String(e),
        });
      }
    }

    const synced = results.filter((r) => r.success).length;
    const failed = results.filter((r) => !r.success);

    return new Response(
      JSON.stringify({ synced, failed, total: linkedinUsers.length }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : String(error),
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
