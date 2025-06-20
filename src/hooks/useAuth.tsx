import { useEffect, useState } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string>('agent');

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        const metadata = session.user.user_metadata || {};
        setUserRole(metadata.role || 'agent');
      }
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user) {
        const metadata = session.user.user_metadata || {};
        setUserRole(metadata.role || 'agent');
      } else {
        setUserRole('agent');
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  return { session, loading, userRole, isAdmin: userRole === 'admin' };
}