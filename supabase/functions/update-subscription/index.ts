import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[UPDATE-SUBSCRIPTION] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false } }
  );

  try {
    logStep("Function started");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header provided");

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) throw new Error(`Authentication error: ${userError.message}`);
    const user = userData.user;
    if (!user?.email) throw new Error("User not authenticated");
    logStep("User authenticated", { email: user.email });

    // Parse body
    const { newQuantity } = await req.json();
    logStep("Requested quantity", { newQuantity });

    // Validate quantity
    if (typeof newQuantity !== 'number' || newQuantity < 10 || newQuantity > 200 || newQuantity % 10 !== 0) {
      throw new Error("Quantity must be between 10 and 200, in increments of 10");
    }

    // Get user's workspace
    const { data: membership } = await supabaseClient
      .from('workspace_members')
      .select('workspace_id')
      .eq('profile_id', user.id)
      .maybeSingle();

    const workspaceId = membership?.workspace_id;
    if (!workspaceId) throw new Error("No workspace found for this user");
    logStep("Workspace found", { workspaceId });

    // Check current billable users count
    const { count: currentUsers } = await supabaseClient
      .from('billable_users')
      .select('id', { count: 'exact', head: true })
      .eq('workspace_id', workspaceId);

    logStep("Current billable users", { currentUsers });

    if (currentUsers !== null && newQuantity < currentUsers) {
      throw new Error(
        `Cannot reduce to ${newQuantity} seats. You currently have ${currentUsers} active LinkedIn profiles. Please remove some profiles first.`
      );
    }

    // Find Stripe customer
    const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    if (customers.data.length === 0) throw new Error("No Stripe customer found");

    const customerId = customers.data[0].id;
    logStep("Found customer", { customerId });

    // Get active subscription
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: "active",
      limit: 1,
    });

    if (subscriptions.data.length === 0) throw new Error("No active subscription found");

    const subscription = subscriptions.data[0];
    const subscriptionItemId = subscription.items.data[0].id;
    const currentQuantity = subscription.items.data[0].quantity;
    logStep("Current subscription", { subscriptionId: subscription.id, subscriptionItemId, currentQuantity });

    if (currentQuantity === newQuantity) {
      return new Response(JSON.stringify({ success: true, message: "Quantity unchanged" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    // Update Stripe subscription
    await stripe.subscriptions.update(subscription.id, {
      items: [{
        id: subscriptionItemId,
        quantity: newQuantity,
      }],
      proration_behavior: 'create_prorations',
    });
    logStep("Stripe subscription updated", { newQuantity });

    // Sync workspace
    await supabaseClient.from('workspaces').update({
      max_billable_users: newQuantity,
    }).eq('id', workspaceId);
    logStep("Workspace synced", { workspaceId, newQuantity });

    return new Response(JSON.stringify({ success: true, newQuantity }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
