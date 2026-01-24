import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SlackChannel {
  id: string;
  name: string;
  is_private: boolean;
  num_members: number;
  is_member: boolean;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get authenticated user from JWT
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
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
      return new Response(
        JSON.stringify({ error: 'Invalid authentication' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Fetch user's workspace
    const { data: workspace, error: workspaceError } = await supabase
      .from('workspaces')
      .select('id, is_connected, slack_workspace_auth')
      .eq('user_id', user.id)
      .maybeSingle();

    if (workspaceError || !workspace) {
      return new Response(
        JSON.stringify({ error: 'Workspace not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!workspace.is_connected || !workspace.slack_workspace_auth) {
      return new Response(
        JSON.stringify({ error: 'Slack not connected' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Fetch Slack token using service role
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const adminClient = createClient(supabaseUrl, supabaseServiceKey);

    const { data: slackAuth, error: slackAuthError } = await adminClient
      .from('slack_workspace_auth')
      .select('token, post_channel')
      .eq('id', workspace.slack_workspace_auth)
      .single();

    if (slackAuthError || !slackAuth?.token) {
      console.error('Failed to retrieve Slack token:', slackAuthError);
      return new Response(
        JSON.stringify({ error: 'Failed to retrieve Slack credentials' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Fetch channels from Slack API
    const slackResponse = await fetch('https://slack.com/api/conversations.list?types=public_channel&exclude_archived=true&limit=200', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${slackAuth.token}`,
        'Content-Type': 'application/json',
      },
    });

    const slackData = await slackResponse.json();

    if (!slackData.ok) {
      console.error('Slack API error:', slackData.error);
      return new Response(
        JSON.stringify({ error: `Slack API error: ${slackData.error}` }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Format and return channels
    const channels: SlackChannel[] = (slackData.channels || []).map((channel: any) => ({
      id: channel.id,
      name: channel.name,
      is_private: channel.is_private || false,
      num_members: channel.num_members || 0,
      is_member: channel.is_member || false,
    }));

    // Sort by member count (most popular first)
    channels.sort((a, b) => b.num_members - a.num_members);

    return new Response(
      JSON.stringify({ 
        channels, 
        currentChannel: slackAuth.post_channel || null 
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error in slack-channels:', error);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
