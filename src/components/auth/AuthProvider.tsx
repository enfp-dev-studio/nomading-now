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
        const { data: { user }, error } = await auth.getCurrentUser();

        if (error) {
          console.error('Error getting current user:', error);
          setUser(null);
          return;
        }

        if (user) {
          await loadUserProfile(user);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Error getting initial session:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    // 사용자 프로필 로드
    const loadUserProfile = async (user: any) => {
      try {
        // Fetch user profile from database
        const { data: profile, error: profileError } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profileError) {
          console.error('Error fetching user profile:', profileError);
          // 프로필이 없으면 생성 시도
          await createUserProfile(user);
          return;
        }

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
          await createUserProfile(user);
        }
      } catch (dbError) {
        console.error('Database error during profile load:', dbError);
        await createUserProfile(user);
      }
    };

    // 사용자 프로필 생성
    const createUserProfile = async (user: any) => {
      try {
        const newProfile = {
          id: user.id,
          email: user.email!,
          nickname: user.user_metadata?.nickname || 'TestNomad1',
          points: 0,
          trust_level: 0,
        };

        const { data: createdProfile, error: createError } = await supabase
          .from('users')
          .insert(newProfile)
          .select()
          .single();

        if (createError) {
          console.error('Error creating user profile:', createError);
          setUser(null);
          return;
        }

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
          console.log('✅ 사용자 프로필 생성 완료');
        }
      } catch (error) {
        console.error('프로필 생성 중 오류:', error);
        setUser(null);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.id);
      
      if (event === 'SIGNED_IN' && session?.user) {
        await loadUserProfile(session.user);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      } else if (event === 'TOKEN_REFRESHED') {
        console.log('Token refreshed successfully');
      } else if (event === 'USER_UPDATED') {
        console.log('User updated');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [setUser, setLoading]);

  return <>{children}</>;
}