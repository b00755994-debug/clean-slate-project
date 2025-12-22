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
    const url = new URL(req.url);
    const code = url.searchParams.get('code');
    const state = url.searchParams.get('state'); // This is the user_id
    const error = url.searchParams.get('error');

    // Base redirect URL for the dashboard
    const dashboardUrl = 'https://superpump.lovable.app/dashboard';

    if (error) {
      console.error('Slack OAuth error:', error);
      return new Response(null, {
        status: 302,
        headers: {
          'Location': `${dashboardUrl}?slack_error=${encodeURIComponent(error)}`,
        },
      });
    }

    if (!code || !state) {
      console.error('Missing code or state parameter');
      return new Response(null, {
        status: 302,
        headers: {
          'Location': `${dashboardUrl}?slack_error=missing_parameters`,
        },
      });
    }

    const userId = state;
    console.log(`Processing Slack callback for user ${userId}`);

    const clientId = Deno.env.get('SLACK_CLIENT_ID');
    const clientSecret = Deno.env.get('SLACK_CLIENT_SECRET');
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!clientId || !clientSecret || !supabaseUrl || !supabaseServiceKey) {
      console.error('Missing required environment variables');
      return new Response(null, {
        status: 302,
        headers: {
          'Location': `${dashboardUrl}?slack_error=configuration_error`,
        },
      });
    }

    // Exchange code for access token
    const tokenResponse = await fetch('https://slack.com/api/oauth.v2.access', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        code: code,
        redirect_uri: 'https://hvmrjymweajxxkoiupzf.supabase.co/functions/v1/slack-callback',
      }),
    });

    const tokenData = await tokenResponse.json();
    console.log('Slack token response:', JSON.stringify(tokenData, null, 2));

    if (!tokenData.ok) {
      console.error('Slack token exchange failed:', tokenData.error);
      return new Response(null, {
        status: 302,
        headers: {
          'Location': `${dashboardUrl}?slack_error=${encodeURIComponent(tokenData.error)}`,
        },
      });
    }

    const accessToken = tokenData.access_token;
    const teamId = tokenData.team?.id;
    const teamName = tokenData.team?.name;
    const scopes = tokenData.scope;

    console.log(`Successfully obtained token for team ${teamName} (${teamId})`);

    // Initialize Supabase client with service role
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Check if user already has a workspace
    const { data: existingWorkspace } = await supabase
      .from('workspaces')
      .select('id')
      .eq('user_id', userId)
      .maybeSingle();

    let workspaceId: string;

    if (existingWorkspace) {
      // Update existing workspace
      workspaceId = existingWorkspace.id;
      
      const { error: updateError } = await supabase
        .from('workspaces')
        .update({
          workspace_name: teamName,
          is_connected: true,
          connected_at: new Date().toISOString(),
        })
        .eq('id', workspaceId);

      if (updateError) {
        console.error('Error updating workspace:', updateError);
      }
    } else {
      // Create new workspace
      const { data: newWorkspace, error: insertError } = await supabase
        .from('workspaces')
        .insert({
          user_id: userId,
          workspace_name: teamName,
          is_connected: true,
          connected_at: new Date().toISOString(),
        })
        .select('id')
        .single();

      if (insertError) {
        console.error('Error creating workspace:', insertError);
        return new Response(null, {
          status: 302,
          headers: {
            'Location': `${dashboardUrl}?slack_error=database_error`,
          },
        });
      }
      workspaceId = newWorkspace.id;
    }

    // Store Slack auth data
    const { error: authError } = await supabase
      .from('slack_workspace_auth')
      .upsert({
        superpump_workspace_id: workspaceId,
        slack_id: teamId,
        token: accessToken,
        scopes: scopes,
        installed_at: new Date().toISOString(),
      }, {
        onConflict: 'superpump_workspace_id',
      });

    if (authError) {
      console.error('Error storing Slack auth:', authError);
    }

    // Update workspace with slack_workspace_auth reference
    const { data: slackAuth } = await supabase
      .from('slack_workspace_auth')
      .select('id')
      .eq('superpump_workspace_id', workspaceId)
      .single();

    if (slackAuth) {
      await supabase
        .from('workspaces')
        .update({ slack_workspace_auth: slackAuth.id })
        .eq('id', workspaceId);
    }

    console.log(`Successfully connected Slack workspace ${teamName} for user ${userId}`);

    // Redirect to dashboard with success message
    return new Response(null, {
      status: 302,
      headers: {
        'Location': `${dashboardUrl}?slack_success=true`,
      },
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error in slack-callback:', error);
    return new Response(null, {
      status: 302,
      headers: {
        'Location': `https://superpump.lovable.app/dashboard?slack_error=${encodeURIComponent(errorMessage)}`,
      },
    });
  }
});
