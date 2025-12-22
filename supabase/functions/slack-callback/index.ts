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

  // Default fallback URL
  let dashboardUrl = 'https://superpump.lovable.app/dashboard';

  try {
    const url = new URL(req.url);
    const code = url.searchParams.get('code');
    const state = url.searchParams.get('state');
    const error = url.searchParams.get('error');

    // Parse state to get userId and redirectUrl
    let userId: string | null = null;
    
    // Whitelist of allowed redirect domains
    const ALLOWED_REDIRECT_DOMAINS = [
      'superpump.lovable.app',
      'localhost',
      'lovableproject.com'
    ];

    if (state) {
      try {
        const stateData = JSON.parse(atob(state));
        userId = stateData.userId;
        
        // Validate redirect URL against whitelist
        if (stateData.redirectUrl) {
          try {
            const redirectUrl = new URL(stateData.redirectUrl);
            const isAllowed = ALLOWED_REDIRECT_DOMAINS.some(domain => 
              redirectUrl.hostname === domain || 
              redirectUrl.hostname.endsWith(`.${domain}`)
            );
            
            if (isAllowed) {
              dashboardUrl = stateData.redirectUrl;
            } else {
              console.warn(`Rejected redirect to untrusted domain: ${redirectUrl.hostname}`);
              // Keep default fallback
            }
          } catch (urlError) {
            console.error('Invalid redirect URL format:', urlError);
            // Keep default fallback
          }
        }
        console.log(`Parsed state: userId=${userId}, redirectUrl=${dashboardUrl}`);
      } catch (e) {
        // Fallback: state might be just the userId (old format)
        userId = state;
        console.log(`Using state as userId (old format): ${userId}`);
      }
    }

    if (error) {
      console.error('Slack OAuth error:', error);
      return new Response(null, {
        status: 302,
        headers: {
          'Location': `${dashboardUrl}?slack_error=${encodeURIComponent(error)}`,
        },
      });
    }

    if (!code || !userId) {
      console.error('Missing code or userId parameter');
      return new Response(null, {
        status: 302,
        headers: {
          'Location': `${dashboardUrl}?slack_error=missing_parameters`,
        },
      });
    }

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

    // Check if Slack auth already exists for this workspace
    const { data: existingAuth } = await supabase
      .from('slack_workspace_auth')
      .select('id')
      .eq('superpump_workspace_id', workspaceId)
      .maybeSingle();

    let slackAuthId: string;

    if (existingAuth) {
      // Update existing Slack auth
      console.log(`Updating existing Slack auth ${existingAuth.id} for workspace ${workspaceId}`);
      const { error: updateAuthError } = await supabase
        .from('slack_workspace_auth')
        .update({
          slack_id: teamId,
          token: accessToken,
          scopes: scopes,
          installed_at: new Date().toISOString(),
        })
        .eq('id', existingAuth.id);

      if (updateAuthError) {
        console.error('Error updating Slack auth:', updateAuthError);
      }
      slackAuthId = existingAuth.id;
    } else {
      // Create new Slack auth
      console.log(`Creating new Slack auth for workspace ${workspaceId}`);
      const { data: newAuth, error: insertAuthError } = await supabase
        .from('slack_workspace_auth')
        .insert({
          superpump_workspace_id: workspaceId,
          slack_id: teamId,
          token: accessToken,
          scopes: scopes,
          installed_at: new Date().toISOString(),
        })
        .select('id')
        .single();

      if (insertAuthError) {
        console.error('Error creating Slack auth:', insertAuthError);
        return new Response(null, {
          status: 302,
          headers: {
            'Location': `${dashboardUrl}?slack_error=auth_storage_error`,
          },
        });
      }
      slackAuthId = newAuth.id;
    }

    // Update workspace with slack_workspace_auth reference
    console.log(`Linking workspace ${workspaceId} to slack_workspace_auth ${slackAuthId}`);
    const { error: linkError } = await supabase
      .from('workspaces')
      .update({ slack_workspace_auth: slackAuthId })
      .eq('id', workspaceId);

    if (linkError) {
      console.error('Error linking workspace to Slack auth:', linkError);
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
        'Location': `${dashboardUrl}?slack_error=${encodeURIComponent(errorMessage)}`,
      },
    });
  }
});
