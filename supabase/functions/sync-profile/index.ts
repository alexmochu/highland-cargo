// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import { serve } from 'https://deno.land/std@0.131.0/http/server.ts';
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.50.0";

serve(async (req) => {
  const supabase = createClient(
    Deno.env.get('URL')!,
    Deno.env.get('SERVICE_ROLE_KEY')!
  );

  const { user } = await req.json();

  if (!user) {
    return new Response(JSON.stringify({ error: 'No user provided' }), { status: 400 });
  }

  const { data: profile, error: fetchError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116: No rows found
    return new Response(JSON.stringify({ error: fetchError.message }), { status: 500 });
  }

  if (!profile) {
    const { full_name, avatar_url } = user.user_metadata;

    const { error: insertError } = await supabase.from('profiles').insert([
      {
        id: user.id,
        email: user.email,
        full_name: full_name || 'New User',
        avatar_url: avatar_url || '',
      },
    ]);

    if (insertError) {
      return new Response(JSON.stringify({ error: insertError.message }), { status: 500 });
    }
  }

  return new Response(JSON.stringify({ success: true }), { status: 200 });
});


/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/sync-profile' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
