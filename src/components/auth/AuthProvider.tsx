import { useEffect } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { auth, supabase } from '@/lib/supabase';

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { setUser, setLoading } = useAuthStore();

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      setLoading(true);
      try {
        const { data: { user } } = await auth.getCurrentUser();
        
        if (user) {
          // Fetch user profile from database
          const { data: profile } = await supabase
            .from('users')
            .select('*')
            .eq('id', user.id)
            .single();

          if (profile) {
            setUser({
              id: profile.id,
              email: profile.email,
              nickname: profile.nickname,
              bio: profile.bio,
              avatar_url: profile.avatar_url,
              points: profile.points || 0,
              trust_level: profile.trust_level || 0,
              created_at: profile.created_at,
            });
          } else {
            // Create user profile if it doesn't exist
            const newProfile = {
              id: user.id,
              email: user.email!,
              nickname: user.user_metadata?.nickname || 'Anonymous',
              points: 0,
              trust_level: 0,
            };

            const { data: createdProfile } = await supabase
              .from('users')
              .insert(newProfile)
              .select()
              .single();

            if (createdProfile) {
              setUser({
                id: createdProfile.id,
                email: createdProfile.email,
                nickname: createdProfile.nickname,
                bio: createdProfile.bio,
                avatar_url: createdProfile.avatar_url,
                points: createdProfile.points || 0,
                trust_level: createdProfile.trust_level || 0,
                created_at: createdProfile.created_at,
              });
            }
          }
        }
      } catch (error) {
        console.error('Error getting initial session:', error);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        // Fetch user profile
        const { data: profile } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (profile) {
          setUser({
            id: profile.id,
            email: profile.email,
            nickname: profile.nickname,
            bio: profile.bio,
            avatar_url: profile.avatar_url,
            points: profile.points || 0,
            trust_level: profile.trust_level || 0,
            created_at: profile.created_at,
          });
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [setUser, setLoading]);

  return <>{children}</>;
}