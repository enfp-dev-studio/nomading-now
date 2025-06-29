import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabase';
import { tipsApi } from '@/lib/database';
import { useAuthStore } from '@/store/useAuthStore';
import { useTipStore } from '@/store/useTipStore';
import { toast } from 'sonner';
import { 
  Database, 
  RefreshCw, 
  Eye,
  AlertCircle,
  CheckCircle,
  XCircle,
  MapPin,
  Play,
  Bug
} from 'lucide-react';

export function TipsDatabaseChecker() {
  const { user } = useAuthStore();
  const { tips, setTips, isLoading } = useTipStore();
  const [testing, setTesting] = useState(false);
  const [results, setResults] = useState<any>({});
  const [rawData, setRawData] = useState<any>(null);

  const runComprehensiveTest = async () => {
    setTesting(true);
    const testResults: any = {};

    console.log('🚀 Starting comprehensive database test...');

    try {
      // Test 1: Check database connection
      console.log('🔍 Test 1: Database connection...');
      try {
        const { data, error } = await supabase.from('tips').select('count').limit(1);
        testResults.connection = {
          success: !error,
          error: error?.message,
          connected: !error
        };
        console.log('✅ Connection test:', testResults.connection);
      } catch (error) {
        testResults.connection = {
          success: false,
          error: error.message,
          connected: false
        };
      }

      // Test 2: Count total tips
      console.log('🔍 Test 2: Count total tips...');
      try {
        const { count, error } = await supabase
          .from('tips')
          .select('*', { count: 'exact', head: true });
        
        testResults.totalCount = {
          success: !error,
          error: error?.message,
          count: count || 0
        };
        console.log('✅ Count test:', testResults.totalCount);
      } catch (error) {
        testResults.totalCount = {
          success: false,
          error: error.message,
          count: 0
        };
      }

      // Test 3: Direct query with joins
      console.log('🔍 Test 3: Direct query with user joins...');
      try {
        const { data, error } = await supabase
          .from('tips')
          .select(`
            *,
            user:users(*)
          `)
          .limit(5);
        
        testResults.directQuery = {
          success: !error,
          error: error?.message,
          count: data?.length || 0,
          hasUserData: data?.[0]?.user ? true : false,
          sample: data?.[0]
        };
        console.log('✅ Direct query test:', testResults.directQuery);
      } catch (error) {
        testResults.directQuery = {
          success: false,
          error: error.message,
          count: 0
        };
      }

      // Test 4: API function test
      console.log('🔍 Test 4: tipsApi.getTips() function...');
      try {
        const apiData = await tipsApi.getTips(user?.id);
        testResults.apiFunction = {
          success: true,
          count: apiData?.length || 0,
          hasData: apiData && apiData.length > 0,
          sample: apiData?.[0]
        };
        console.log('✅ API function test:', testResults.apiFunction);
      } catch (error) {
        testResults.apiFunction = {
          success: false,
          error: error.message,
          count: 0
        };
      }

      // Test 5: Store state check
      console.log('🔍 Test 5: Store state...');
      testResults.storeState = {
        tipsInStore: tips.length,
        isLoading: isLoading,
        hasUser: !!user,
        userId: user?.id
      };
      console.log('✅ Store state test:', testResults.storeState);

      // Test 6: RLS policies
      console.log('🔍 Test 6: RLS policies...');
      try {
        // Test public read access
        const { data: publicData, error: publicError } = await supabase
          .from('tips')
          .select('id, content, category')
          .limit(1);
        
        testResults.rlsPolicies = {
          success: !publicError,
          error: publicError?.message,
          publicReadWorks: !publicError,
          canReadTips: publicData !== null
        };
        console.log('✅ RLS policies test:', testResults.rlsPolicies);
      } catch (error) {
        testResults.rlsPolicies = {
          success: false,
          error: error.message,
          publicReadWorks: false
        };
      }

    } catch (error) {
      console.error('💥 Comprehensive test error:', error);
    }

    setResults(testResults);
    setTesting(false);
    console.log('🏁 Comprehensive test completed:', testResults);
  };

  const loadTipsDirectly = async () => {
    try {
      console.log('🔄 Loading tips directly into store...');
      const data = await tipsApi.getTips(user?.id);
      setTips(data || []);
      toast.success(`Loaded ${data?.length || 0} tips directly into store`);
      console.log('✅ Direct load completed:', data);
    } catch (error) {
      console.error('💥 Direct load error:', error);
      toast.error(`Failed to load tips: ${error.message}`);
    }
  };

  const showRawData = async () => {
    try {
      const { data, error } = await supabase
        .from('tips')
        .select(`
          *,
          user:users(*),
          is_liked:tip_likes!left(user_id),
          is_saved:tip_saves!left(user_id)
        `)
        .limit(10);
      
      if (error) {
        toast.error(`Database error: ${error.message}`);
        return;
      }

      setRawData(data);
      console.log('Raw database data:', data);
      toast.success(`Found ${data?.length || 0} tips in database`);
    } catch (error) {
      toast.error(`Error: ${error.message}`);
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
          <Bug className="w-5 h-5" />
          Tips 로딩 문제 진단
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        
        {/* Current State */}
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
          <h4 className="font-medium text-blue-900 mb-2">현재 상태</h4>
          <div className="text-sm text-blue-800 space-y-1">
            <div>• Store에 있는 tips: {tips.length}개</div>
            <div>• 로딩 상태: {isLoading ? '로딩 중' : '완료'}</div>
            <div>• 사용자: {user ? `${user.nickname} (${user.email})` : '로그인 안됨'}</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3">
          <Button onClick={runComprehensiveTest} disabled={testing}>
            {testing && <RefreshCw className="w-4 h-4 mr-2 animate-spin" />}
            <Play className="w-4 h-4 mr-2" />
            종합 진단 실행
          </Button>
          
          <Button onClick={loadTipsDirectly} variant="outline">
            <Database className="w-4 h-4 mr-2" />
            Tips 직접 로드
          </Button>

          <Button onClick={showRawData} variant="outline">
            <Eye className="w-4 h-4 mr-2" />
            Raw 데이터 조회
          </Button>
        </div>

        {/* Test Results */}
        {Object.keys(results).length > 0 && (
          <div className="space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              진단 결과
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Database Connection */}
              <div className="p-3 bg-muted rounded-md">
                <div className="flex items-center gap-2 mb-2">
                  <StatusIcon success={results.connection?.success} />
                  <span className="font-medium">데이터베이스 연결</span>
                </div>
                <div className="text-sm space-y-1">
                  <div>연결됨: {results.connection?.connected ? 'Yes' : 'No'}</div>
                  {results.connection?.error && (
                    <div className="text-red-600 text-xs">{results.connection.error}</div>
                  )}
                </div>
              </div>

              {/* Total Count */}
              <div className="p-3 bg-muted rounded-md">
                <div className="flex items-center gap-2 mb-2">
                  <StatusIcon success={results.totalCount?.success} />
                  <span className="font-medium">전체 Tips 개수</span>
                </div>
                <div className="text-sm space-y-1">
                  <div>총 개수: {results.totalCount?.count || 0}</div>
                  {results.totalCount?.error && (
                    <div className="text-red-600 text-xs">{results.totalCount.error}</div>
                  )}
                </div>
              </div>

              {/* Direct Query */}
              <div className="p-3 bg-muted rounded-md">
                <div className="flex items-center gap-2 mb-2">
                  <StatusIcon success={results.directQuery?.success} />
                  <span className="font-medium">직접 쿼리 (JOIN)</span>
                </div>
                <div className="text-sm space-y-1">
                  <div>조회된 개수: {results.directQuery?.count || 0}</div>
                  <div>사용자 데이터: {results.directQuery?.hasUserData ? 'Yes' : 'No'}</div>
                  {results.directQuery?.error && (
                    <div className="text-red-600 text-xs">{results.directQuery.error}</div>
                  )}
                </div>
              </div>

              {/* API Function */}
              <div className="p-3 bg-muted rounded-md">
                <div className="flex items-center gap-2 mb-2">
                  <StatusIcon success={results.apiFunction?.success} />
                  <span className="font-medium">tipsApi.getTips()</span>
                </div>
                <div className="text-sm space-y-1">
                  <div>반환된 개수: {results.apiFunction?.count || 0}</div>
                  <div>데이터 있음: {results.apiFunction?.hasData ? 'Yes' : 'No'}</div>
                  {results.apiFunction?.error && (
                    <div className="text-red-600 text-xs">{results.apiFunction.error}</div>
                  )}
                </div>
              </div>

              {/* RLS Policies */}
              <div className="p-3 bg-muted rounded-md">
                <div className="flex items-center gap-2 mb-2">
                  <StatusIcon success={results.rlsPolicies?.success} />
                  <span className="font-medium">RLS 정책</span>
                </div>
                <div className="text-sm space-y-1">
                  <div>Public 읽기: {results.rlsPolicies?.publicReadWorks ? 'Yes' : 'No'}</div>
                  <div>Tips 읽기 가능: {results.rlsPolicies?.canReadTips ? 'Yes' : 'No'}</div>
                  {results.rlsPolicies?.error && (
                    <div className="text-red-600 text-xs">{results.rlsPolicies.error}</div>
                  )}
                </div>
              </div>

              {/* Store State */}
              <div className="p-3 bg-muted rounded-md">
                <div className="flex items-center gap-2 mb-2">
                  <Database className="w-4 h-4 text-blue-600" />
                  <span className="font-medium">Store 상태</span>
                </div>
                <div className="text-sm space-y-1">
                  <div>Store Tips: {results.storeState?.tipsInStore || 0}</div>
                  <div>로딩 중: {results.storeState?.isLoading ? 'Yes' : 'No'}</div>
                  <div>사용자: {results.storeState?.hasUser ? 'Logged in' : 'Not logged in'}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Raw Data Display */}
        {rawData && (
          <div className="space-y-3">
            <h3 className="font-semibold flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Raw Database Data ({rawData.length} tips)
            </h3>
            <div className="bg-gray-50 p-4 rounded-md max-h-60 overflow-y-auto">
              <pre className="text-xs">
                {JSON.stringify(rawData, null, 2)}
              </pre>
            </div>
          </div>
        )}

        {/* Diagnostic Guide */}
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-md">
          <h4 className="font-medium text-amber-900 mb-2">문제 해결 가이드</h4>
          <div className="text-sm text-amber-800 space-y-2">
            <div><strong>총 개수가 0:</strong> 데이터베이스에 tips가 없음 → /dev 페이지에서 샘플 데이터 추가</div>
            <div><strong>직접 쿼리 실패:</strong> 데이터베이스 연결 또는 테이블 구조 문제</div>
            <div><strong>API 함수 실패:</strong> 데이터 변환 로직에 문제</div>
            <div><strong>RLS 실패:</strong> Row Level Security 정책 문제</div>
            <div><strong>Store에 데이터 없음:</strong> TipFeed 컴포넌트의 로딩 로직 문제</div>
          </div>
        </div>

        {/* Quick Fix Actions */}
        <div className="p-4 bg-green-50 border border-green-200 rounded-md">
          <h4 className="font-medium text-green-900 mb-2">빠른 해결책</h4>
          <div className="text-sm text-green-800 space-y-2">
            <div>1. 브라우저 개발자 도구 → Console 탭에서 로그 확인</div>
            <div>2. "Tips 직접 로드" 버튼으로 강제 로딩 시도</div>
            <div>3. /dev 페이지에서 샘플 tips 추가</div>
            <div>4. 페이지 새로고침 후 다시 확인</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}