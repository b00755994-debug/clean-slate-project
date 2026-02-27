import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header provided");

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) throw new Error(`Authentication error: ${userError.message}`);
    const user = userData.user;
    if (!user?.email) throw new Error("User not authenticated");

    const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    if (customers.data.length === 0) {
      throw new Error("No Stripe customer found for this user");
    }

    const customerId = customers.data[0].id;

    // 1. Get workspace
    const { data: membership } = await supabaseClient
      .from('workspace_members')
      .select('workspace_id')
      .eq('profile_id', user.id)
      .maybeSingle();

    // 2. Count tracked profiles
    let profileCount = 0;
    if (membership?.workspace_id) {
      const { count } = await supabaseClient
        .from('billable_users')
        .select('*', { count: 'exact', head: true })
        .eq('workspace_id', membership.workspace_id);
      profileCount = count ?? 0;
    }

    const minimumQty = Math.max(10, profileCount);

    // 3. Create portal config with minimum_quantity
    const portalConfig = await stripe.billingPortal.configurations.create({
      business_profile: { headline: 'Manage your SuperPump subscription' },
      features: {
        subscription_update: {
          enabled: true,
          default_allowed_updates: ['quantity'],
          products: [
            { product: 'prod_U2u5D1O58TUiGO', prices: ['price_1T4oGzEPoXPeqIKkP1JHmhVr'], minimum_quantity: minimumQty },
            { product: 'prod_U2u5R33sL7CeRe', prices: ['price_1T4oHOEPoXPeqIKkFdPcMylA'], minimum_quantity: minimumQty },
          ],
        },
        subscription_cancel: { enabled: true },
        payment_method_update: { enabled: true },
        invoice_history: { enabled: true },
      },
    });

    // 4. Use config when creating the session
    const origin = req.headers.get("origin") || "https://superpump.tech";
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: customerId,
      configuration: portalConfig.id,
      return_url: `${origin}/pricing`,
    });

    return new Response(JSON.stringify({ url: portalSession.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
