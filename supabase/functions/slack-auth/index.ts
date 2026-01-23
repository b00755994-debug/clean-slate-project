import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get authenticated user from JWT
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      console.error('Missing Authorization header');
      return new Response(
        JSON.stringify({ error: 'Authentication required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } }
    });

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      console.error('Invalid authentication:', userError?.message);
      return new Response(
        JSON.stringify({ error: 'Invalid authentication' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Use the authenticated user's ID, not from query params
    const userId = user.id;
    
    // Support both GET (query params) and POST (JSON body) for redirect URL
    const url = new URL(req.url);
    let redirectUrl = url.searchParams.get('redirect_url');
    
    if (!redirectUrl && req.method === 'POST') {
      try {
        const body = await req.json();
        redirectUrl = body.redirectUrl;
      } catch {
        // Ignore JSON parse errors
      }
    }
    
    redirectUrl = redirectUrl || 'https://superpump.lovable.app/dashboard';

    const clientId = Deno.env.get('SLACK_CLIENT_ID');
    if (!clientId) {
      console.error('SLACK_CLIENT_ID not configured');
      return new Response(
        JSON.stringify({ error: 'Slack not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const redirectUri = 'https://hvmrjymweajxxkoiupzf.supabase.co/functions/v1/slack-callback';
    const scopes = ['users:read', 'users:read.email', 'team:read', 'chat:write'];
    
    // Encode userId and redirectUrl in state (base64 JSON)
    const stateData = JSON.stringify({ userId, redirectUrl });
    const state = btoa(stateData);

    const slackAuthUrl = new URL('https://slack.com/oauth/v2/authorize');
    slackAuthUrl.searchParams.set('client_id', clientId);
    slackAuthUrl.searchParams.set('scope', scopes.join(','));
    slackAuthUrl.searchParams.set('redirect_uri', redirectUri);
    slackAuthUrl.searchParams.set('state', state);

    console.log(`Redirecting verified user ${userId} to Slack OAuth, will redirect back to ${redirectUrl}`);

    // Return the Slack auth URL for the client to redirect to
    return new Response(
      JSON.stringify({ authUrl: slackAuthUrl.toString() }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error in slack-auth:', error);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
