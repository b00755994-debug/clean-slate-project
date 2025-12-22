import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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
    const url = new URL(req.url);
    const userId = url.searchParams.get('user_id');

    if (!userId) {
      console.error('Missing user_id parameter');
      return new Response(
        JSON.stringify({ error: 'Missing user_id parameter' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

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
    
    // Use userId as state to identify the user in the callback
    const state = userId;

    const slackAuthUrl = new URL('https://slack.com/oauth/v2/authorize');
    slackAuthUrl.searchParams.set('client_id', clientId);
    slackAuthUrl.searchParams.set('scope', scopes.join(','));
    slackAuthUrl.searchParams.set('redirect_uri', redirectUri);
    slackAuthUrl.searchParams.set('state', state);

    console.log(`Redirecting user ${userId} to Slack OAuth`);

    // Redirect to Slack authorization page
    return new Response(null, {
      status: 302,
      headers: {
        ...corsHeaders,
        'Location': slackAuthUrl.toString(),
      },
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error in slack-auth:', error);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
