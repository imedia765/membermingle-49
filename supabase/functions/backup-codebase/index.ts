import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { JSZip } from 'https://deno.land/x/jszip@0.11.0/mod.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Get the user's JWT from the request headers
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('No authorization header')
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Verify the user is an admin
    const jwt = authHeader.replace('Bearer ', '')
    const { data: { user }, error: userError } = await supabase.auth.getUser(jwt)
    if (userError || !user) {
      throw new Error('Unauthorized')
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profileError || profile?.role !== 'admin') {
      throw new Error('Unauthorized - Admin access required')
    }

    // Create a new ZIP file
    const zip = new JSZip()

    // Add some basic project information
    zip.file('README.md', 'Project Backup\n\nThis backup was created on ' + new Date().toISOString())

    // Add package.json content
    const { data: packageJson, error: packageError } = await supabase
      .from('project_files')
      .select('content')
      .eq('name', 'package.json')
      .single()

    if (!packageError && packageJson) {
      zip.file('package.json', packageJson.content)
    }

    // Generate the ZIP file
    const zipBlob = await zip.generateAsync({ type: 'blob' })
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    const filename = `codebase-backup-${timestamp}.zip`

    // Log the backup in the database
    const { error: insertError } = await supabase
      .from('codebase_backups')
      .insert({
        filename,
        size: zipBlob.size,
        created_by: user.id
      })

    if (insertError) {
      console.error('Error logging backup:', insertError)
    }

    return new Response(zipBlob, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename=${filename}`
      }
    })
  } catch (error) {
    console.error('Backup error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: error.message.includes('Unauthorized') ? 401 : 500
      }
    )
  }
})