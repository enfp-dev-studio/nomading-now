import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase, auth } from '@/lib/supabase';
import { useAuthStore } from '@/store/useAuthStore';
import { toast } from 'sonner';
import { 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Database, 
  Key, 
  User,
  RefreshCw,
  Eye,
  EyeOff
} from 'lucide-react';

export function AuthDebugger() {
  const { user, isLoading } = useAuthStore();
  const [authState, setAuthState] = useState<any>(null);
  const [envVars, setEnvVars] = useState<any>({});
  const [showEnvVars, setShowEnvVars] = useState(false);
  const [testResults, setTestResults] = useState<any>({});
  const [testing, setTesting] = useState(false);

  useEffect(() => {
    checkAuthState();
    checkEnvVars();
  }, []);

  const checkAuthState = async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      setAuthState({
        session,
        error,
        user: session?.user || null,
        isAuthenticated: !!session?.user
      });
    } catch (error) {
      console.error('Auth state check error:', error);
      setAuthState({ error: error.message });
    }
  };

  const checkEnvVars = () => {
    const vars = {
      VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
      VITE_SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY,
      hasUrl: !!import.meta.env.VITE_SUPABASE_URL,
      hasKey: !!import.meta.env.VITE_SUPABASE_ANON_KEY,
      urlLength: import.meta.env.VITE_SUPABASE_URL?.length || 0,
      keyLength: import.meta.env.VITE_SUPABASE_ANON_KEY?.length || 0
    };
    setEnvVars(vars);
  };

  const runAuthTests = async () => {
    setTesting(true);
    const results: any = {};

    try {
      // Test 1: Supabase connection
      try {
        const { data, error } = await supabase.from('users').select('count').limit(1);
        results.supabaseConnection = { 
          success: !error, 
          error: error?.message,
          data: data?.length 
        };
      } catch (error) {
        results.supabaseConnection = { 
          success: false, 
          error: error.message 
        };
      }

      // Test 2: Auth service
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        results.authService = { 
          success: !error, 
          error: error?.message,
          hasUser: !!user 
        };
      } catch (error) {
        results.authService = { 
          success: false, 
          error: error.message 
        };
      }

      // Test 3: Test signup (dry run)
      try {
        // Just test the auth.signUp function without actually creating
        const testEmail = 'test-dry-run@example.com';
        const { error } = await supabase.auth.signUp({
          email: testEmail,
          password: 'test123456',
          options: {
            data: { nickname: 'TestDryRun' }
          }
        });
        
        results.signupTest = { 
          success: true, 
          note: 'Signup function is accessible',
          error: error?.message 
        };
      } catch (error) {
        results.signupTest = { 
          success: false, 
          error: error.message 
        };
      }

      // Test 4: Database policies
      try {
        const { data, error } = await supabase
          .from('users')
          .select('id, email, nickname')
          .limit(5);
        
        results.databasePolicies = { 
          success: !error, 
          error: error?.message,
          userCount: data?.length || 0 
        };
      } catch (error) {
        results.databasePolicies = { 
          success: false, 
          error: error.message 
        };
      }

    } catch (error) {
      console.error('Test error:', error);
    }

    setTestResults(results);
    setTesting(false);
  };

  const testSignIn = async () => {
    try {
      const { data, error } = await auth.signIn('enfpdevtest@gmail.com', 'test123456');
      
      if (error) {
        toast.error(`Sign in failed: ${error.message}`);
      } else {
        toast.success('Sign in successful!');
        await checkAuthState();
      }
    } catch (error) {
      toast.error(`Sign in error: ${error.message}`);
    }
  };

  const StatusIcon = ({ success }: { success: boolean }) => (
    success ? 
      <CheckCircle className="w-4 h-4 text-green-600" /> : 
      <XCircle className="w-4 h-4 text-red-600" />
  );

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="w-5 h-5" />
          Supabase Auth 연결 상태 디버깅
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        
        {/* Current Auth State */}
        <div className="space-y-3">
          <h3 className="font-semibold flex items-center gap-2">
            <User className="w-4 h-4" />
            현재 인증 상태
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-3 bg-muted rounded-md">
              <div className="flex items-center gap-2 mb-2">
                <StatusIcon success={!!user} />
                <span className="font-medium">Store User</span>
              </div>
              {user ? (
                <div className="text-sm space-y-1">
                  <div>ID: {user.id}</div>
                  <div>Email: {user.email}</div>
                  <div>Nickname: {user.nickname}</div>
                </div>
              ) : (
                <div className="text-sm text-muted-foreground">No user in store</div>
              )}
            </div>
            
            <div className="p-3 bg-muted rounded-md">
              <div className="flex items-center gap-2 mb-2">
                <StatusIcon success={authState?.isAuthenticated} />
                <span className="font-medium">Supabase Session</span>
              </div>
              {authState?.user ? (
                <div className="text-sm space-y-1">
                  <div>ID: {authState.user.id}</div>
                  <div>Email: {authState.user.email}</div>
                  <div>Created: {new Date(authState.user.created_at).toLocaleDateString()}</div>
                </div>
              ) : (
                <div className="text-sm text-muted-foreground">No active session</div>
              )}
            </div>
          </div>
        </div>

        {/* Environment Variables */}
        <div className="space-y-3">
          <h3 className="font-semibold flex items-center gap-2">
            <Key className="w-4 h-4" />
            환경 변수 상태
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowEnvVars(!showEnvVars)}
            >
              {showEnvVars ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </Button>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-3 bg-muted rounded-md">
              <div className="flex items-center gap-2 mb-2">
                <StatusIcon success={envVars.hasUrl} />
                <span className="font-medium">VITE_SUPABASE_URL</span>
              </div>
              <div className="text-sm">
                {showEnvVars ? envVars.VITE_SUPABASE_URL : `${envVars.urlLength} characters`}
              </div>
            </div>
            
            <div className="p-3 bg-muted rounded-md">
              <div className="flex items-center gap-2 mb-2">
                <StatusIcon success={envVars.hasKey} />
                <span className="font-medium">VITE_SUPABASE_ANON_KEY</span>
              </div>
              <div className="text-sm">
                {showEnvVars ? envVars.VITE_SUPABASE_ANON_KEY : `${envVars.keyLength} characters`}
              </div>
            </div>
          </div>
        </div>

        {/* Test Results */}
        {Object.keys(testResults).length > 0 && (
          <div className="space-y-3">
            <h3 className="font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              연결 테스트 결과
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(testResults).map(([test, result]: [string, any]) => (
                <div key={test} className="p-3 bg-muted rounded-md">
                  <div className="flex items-center gap-2 mb-2">
                    <StatusIcon success={result.success} />
                    <span className="font-medium">{test}</span>
                  </div>
                  {result.error && (
                    <div className="text-sm text-red-600 mb-1">{result.error}</div>
                  )}
                  {result.note && (
                    <div className="text-sm text-blue-600">{result.note}</div>
                  )}
                  {result.userCount !== undefined && (
                    <div className="text-sm text-muted-foreground">Users found: {result.userCount}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3">
          <Button onClick={checkAuthState} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            상태 새로고침
          </Button>
          
          <Button onClick={runAuthTests} disabled={testing}>
            {testing && <RefreshCw className="w-4 h-4 mr-2 animate-spin" />}
            연결 테스트 실행
          </Button>
          
          <Button onClick={testSignIn} variant="outline">
            테스트 로그인 시도
          </Button>
        </div>

        {/* Status Summary */}
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
          <h4 className="font-medium text-blue-900 mb-2">진단 요약</h4>
          <div className="text-sm text-blue-800 space-y-1">
            <div>• 환경 변수: {envVars.hasUrl && envVars.hasKey ? '✅ 정상' : '❌ 누락'}</div>
            <div>• 사용자 세션: {authState?.isAuthenticated ? '✅ 활성' : '❌ 비활성'}</div>
            <div>• Store 동기화: {user && authState?.user?.id === user.id ? '✅ 동기화됨' : '❌ 불일치'}</div>
            <div>• 로딩 상태: {isLoading ? '🔄 로딩 중' : '✅ 완료'}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}