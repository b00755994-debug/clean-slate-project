import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SlackMember {
  id: string;
  name: string;
  real_name: string;
  profile: {
    email?: string;
    image_72?: string;
    display_name?: string;
  };
  is_bot: boolean;
  deleted: boolean;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      console.error('Missing authorization header');
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get user from auth token
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } }
    });

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      console.error('User authentication failed:', userError);
      return new Response(
        JSON.stringify({ error: 'Authentication failed' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Fetching Slack members for user ${user.id}`);

    // Get the user's workspace
    const { data: workspace, error: workspaceError } = await supabase
      .from('workspaces')
      .select('id, slack_workspace_auth, is_connected, workspace_name')
      .eq('user_id', user.id)
      .maybeSingle();

    if (workspaceError) {
      console.error('Error fetching workspace:', workspaceError);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch workspace' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Workspace found:`, workspace ? { 
      id: workspace.id, 
      name: workspace.workspace_name,
      is_connected: workspace.is_connected, 
      slack_workspace_auth: workspace.slack_workspace_auth 
    } : 'null');

    if (!workspace) {
      console.log('No workspace found for user');
      return new Response(
        JSON.stringify({ members: [], error: 'no_workspace' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!workspace.is_connected) {
      console.log('Workspace exists but is not connected');
      return new Response(
        JSON.stringify({ members: [], error: 'not_connected' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!workspace.slack_workspace_auth) {
      console.log('Workspace connected but slack_workspace_auth is null');
      return new Response(
        JSON.stringify({ members: [], error: 'no_slack_auth' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get the Slack token from slack_workspace_auth using service role
    const supabaseServiceRole = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRole);

    const { data: slackAuth, error: slackAuthError } = await supabaseAdmin
      .from('slack_workspace_auth')
      .select('token')
      .eq('id', workspace.slack_workspace_auth)
      .maybeSingle();

    if (slackAuthError || !slackAuth?.token) {
      console.error('Error fetching Slack token:', slackAuthError);
      return new Response(
        JSON.stringify({ error: 'Slack token not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Fetch members from Slack API
    console.log('Calling Slack users.list API');
    const slackResponse = await fetch('https://slack.com/api/users.list', {
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

    // Filter and format members (exclude bots and deleted users)
    const members = (slackData.members as SlackMember[])
      .filter(member => !member.is_bot && !member.deleted && member.id !== 'USLACKBOT')
      .map(member => ({
        id: member.id,
        name: member.profile.display_name || member.real_name || member.name,
        email: member.profile.email || null,
        avatar_url: member.profile.image_72 || null,
      }));

    console.log(`Found ${members.length} Slack members`);

    return new Response(
      JSON.stringify({ members }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in slack-members function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
