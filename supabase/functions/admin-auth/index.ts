
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';
import * as bcrypt from "https://deno.land/x/bcrypt@v0.4.1/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AdminUser {
  id: string;
  username: string;
  email: string;
  role: string;
  is_active: boolean;
  last_login: string | null;
  created_at: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { action, ...payload } = await req.json();

    switch (action) {
      case 'login': {
        const { username, password } = payload;
        
        // Get admin user by username or email
        const { data: adminUser, error } = await supabase
          .from('admin_users')
          .select('*')
          .or(`username.eq.${username},email.eq.${username}`)
          .eq('is_active', true)
          .single();

        if (error || !adminUser) {
          return new Response(
            JSON.stringify({ error: 'Invalid credentials' }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
          );
        }

        // Verify password
        const passwordMatch = await bcrypt.compare(password, adminUser.password_hash);
        if (!passwordMatch) {
          return new Response(
            JSON.stringify({ error: 'Invalid credentials' }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
          );
        }

        // Update last login
        await supabase
          .from('admin_users')
          .update({ last_login: new Date().toISOString() })
          .eq('id', adminUser.id);

        // Return user data (without password hash)
        const { password_hash, ...userResponse } = adminUser;
        return new Response(
          JSON.stringify({ user: userResponse }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'create_admin': {
        const { username, email, password, role = 'admin' } = payload;
        
        // Hash password
        const passwordHash = await bcrypt.hash(password);
        
        const { data, error } = await supabase
          .from('admin_users')
          .insert({
            username,
            email,
            password_hash: passwordHash,
            role
          })
          .select('*')
          .single();

        if (error) {
          return new Response(
            JSON.stringify({ error: error.message }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
          );
        }

        const { password_hash, ...userResponse } = data;
        return new Response(
          JSON.stringify({ user: userResponse }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'update_admin': {
        const { id, username, email, password, role, is_active } = payload;
        
        const updateData: any = { username, email, role, is_active };
        
        if (password) {
          updateData.password_hash = await bcrypt.hash(password);
        }

        const { data, error } = await supabase
          .from('admin_users')
          .update(updateData)
          .eq('id', id)
          .select('*')
          .single();

        if (error) {
          return new Response(
            JSON.stringify({ error: error.message }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
          );
        }

        const { password_hash, ...userResponse } = data;
        return new Response(
          JSON.stringify({ user: userResponse }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'delete_admin': {
        const { id } = payload;
        
        const { error } = await supabase
          .from('admin_users')
          .delete()
          .eq('id', id);

        if (error) {
          return new Response(
            JSON.stringify({ error: error.message }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
          );
        }

        return new Response(
          JSON.stringify({ success: true }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'get_admins': {
        const { data, error } = await supabase
          .from('admin_users')
          .select('id, username, email, role, is_active, last_login, created_at')
          .order('created_at', { ascending: false });

        if (error) {
          return new Response(
            JSON.stringify({ error: error.message }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
          );
        }

        return new Response(
          JSON.stringify({ admins: data }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      default:
        return new Response(
          JSON.stringify({ error: 'Invalid action' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
        );
    }

  } catch (error) {
    console.error('Admin auth error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
