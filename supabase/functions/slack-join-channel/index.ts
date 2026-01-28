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

    // Parse request body
    const { channelId, isMember } = await req.json();
    if (!channelId) {
      return new Response(
        JSON.stringify({ error: 'Channel ID is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Fetch user's workspace via workspace_members junction table
    const { data: membership, error: membershipError } = await supabase
      .from('workspace_members')
      .select(`
        workspace_id,
        workspace:workspaces (
          id,
          is_connected,
          slack_workspace_auth
        )
      `)
      .eq('profile_id', user.id)
      .maybeSingle();

    if (membershipError) {
      console.error('Error fetching workspace membership:', membershipError);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch workspace' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const workspace = membership?.workspace as unknown as {
      id: string;
      is_connected: boolean | null;
      slack_workspace_auth: string | null;
    } | null;

    if (!workspace) {
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
      .select('id, token')
      .eq('id', workspace.slack_workspace_auth)
      .single();

    if (slackAuthError || !slackAuth?.token) {
      console.error('Failed to retrieve Slack token:', slackAuthError);
      return new Response(
        JSON.stringify({ error: 'Failed to retrieve Slack credentials' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Real-time check: verify if bot is actually in the channel
    console.log(`Checking real-time membership for channel ${channelId}`);
    const membershipCheck = await fetch(
      `https://slack.com/api/conversations.info?channel=${channelId}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${slackAuth.token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const membershipData = await membershipCheck.json();
    
    if (!membershipData.ok) {
      console.error('Failed to check channel membership:', membershipData.error);
      return new Response(
        JSON.stringify({ error: `Failed to check channel: ${membershipData.error}` }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const isActuallyMember = membershipData.channel?.is_member === true;
    console.log(`Bot is_member for channel ${channelId}: ${isActuallyMember}`);

    // Only try to join if bot is NOT already a member
    if (!isActuallyMember) {
      console.log(`Bot not in channel ${channelId}, attempting to join...`);
      const joinResponse = await fetch('https://slack.com/api/conversations.join', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${slackAuth.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ channel: channelId }),
      });

      const joinData = await joinResponse.json();

      if (!joinData.ok) {
        // Only 'already_in_channel' is acceptable - missing_scope is a real error
        if (joinData.error !== 'already_in_channel') {
          console.error('Slack join error:', joinData.error);
          const needsReconnect = joinData.error === 'missing_scope';
          return new Response(
            JSON.stringify({ 
              error: `Failed to join channel: ${joinData.error}`,
              needsReconnect 
            }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        console.log(`Channel join returned: ${joinData.error} (acceptable)`);
      } else {
        console.log(`Successfully joined channel ${channelId}`);
      }
    } else {
      console.log(`Bot already member of channel ${channelId}, skipping join`);
    }

    // Update the post_channel in slack_workspace_auth
    const { error: updateError } = await adminClient
      .from('slack_workspace_auth')
      .update({ post_channel: channelId })
      .eq('id', slackAuth.id);

    if (updateError) {
      console.error('Failed to update post_channel:', updateError);
      return new Response(
        JSON.stringify({ error: 'Failed to save channel preference' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get channel info for confirmation
    const channelInfoResponse = await fetch(`https://slack.com/api/conversations.info?channel=${channelId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${slackAuth.token}`,
        'Content-Type': 'application/json',
      },
    });

    const channelInfo = await channelInfoResponse.json();
    const channelName = channelInfo.ok ? channelInfo.channel?.name : null;

    console.log(`Channel ${channelId} (${channelName}) set as notification channel for user ${user.id}`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        channelId,
        channelName,
        isMember: true
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error in slack-join-channel:', error);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
