import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabase';
import { tipsApi } from '@/lib/database';
import { useAuthStore } from '@/store/useAuthStore';
import { toast } from 'sonner';
import { 
  Database, 
  RefreshCw, 
  Eye,
  AlertCircle,
  CheckCircle,
  XCircle,
  MapPin
} from 'lucide-react';

export function DatabaseDebugger() {
  const { user } = useAuthStore();
  const [testing, setTesting] = useState(false);
  const [results, setResults] = useState<any>({});
  const [rawData, setRawData] = useState<any>(null);

  const runDatabaseTests = async () => {
    setTesting(true);
    const testResults: any = {};

    try {
      // Test 1: Direct Supabase query
      console.log('🔍 Testing direct Supabase query...');
      try {
        const { data: directData, error: directError } = await supabase
          .from('tips')
          .select('*')
          .limit(5);
        
        testResults.directQuery = {
          success: !directError,
          error: directError?.message,
          count: directData?.length || 0,
          data: directData
        };
        
        console.log('Direct query result:', { directData, directError });
      } catch (error) {
        testResults.directQuery = {
          success: false,
          error: error.message,
          count: 0
        };
      }

      // Test 2: Tips API query
      console.log('🔍 Testing tipsApi.getTips()...');
      try {
        const apiData = await tipsApi.getTips(user?.id);
        testResults.apiQuery = {
          success: true,
          count: apiData?.length || 0,
          data: apiData
        };
        
        console.log('API query result:', apiData);
      } catch (error) {
        testResults.apiQuery = {
          success: false,
          error: error.message,
          count: 0
        };
      }

      // Test 3: Check table structure
      console.log('🔍 Testing table structure...');
      try {
        const { data: tableInfo, error: tableError } = await supabase
          .from('tips')
          .select('id, user_id, content, category, latitude, longitude, city, country, created_at')
          .limit(1);
        
        testResults.tableStructure = {
          success: !tableError,
          error: tableError?.message,
          hasData: tableInfo && tableInfo.length > 0,
          sample: tableInfo?.[0]
        };
      } catch (error) {
        testResults.tableStructure = {
          success: false,
          error: error.message
        };
      }

      // Test 4: Check RLS policies
      console.log('🔍 Testing RLS policies...');
      try {
        // Test as authenticated user
        const { data: authData, error: authError } = await supabase
          .from('tips')
          .select('id, content')
          .limit(1);
        
        testResults.rlsPolicies = {
          success: !authError,
          error: authError?.message,
          canRead: !authError && authData !== null
        };
      } catch (error) {
        testResults.rlsPolicies = {
          success: false,
          error: error.message
        };
      }

      // Test 5: Count total tips
      console.log('🔍 Counting total tips...');
      try {
        const { count, error: countError } = await supabase
          .from('tips')
          .select('*', { count: 'exact', head: true });
        
        testResults.totalCount = {
          success: !countError,
          error: countError?.message,
          count: count || 0
        };
      } catch (error) {
        testResults.totalCount = {
          success: false,
          error: error.message
        };
      }

    } catch (error) {
      console.error('Test error:', error);
    }

    setResults(testResults);
    setTesting(false);
  };

  const showRawData = async () => {
    try {
      const { data, error } = await supabase
        .from('tips')
        .select(`
          *,
          user:users(*)
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
          <Database className="w-5 h-5" />
          Database Tips 디버깅
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        
        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3">
          <Button onClick={runDatabaseTests} disabled={testing}>
            {testing && <RefreshCw className="w-4 h-4 mr-2 animate-spin" />}
            데이터베이스 테스트 실행
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
              테스트 결과
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Direct Query Test */}
              <div className="p-3 bg-muted rounded-md">
                <div className="flex items-center gap-2 mb-2">
                  <StatusIcon success={results.directQuery?.success} />
                  <span className="font-medium">Direct Supabase Query</span>
                </div>
                <div className="text-sm space-y-1">
                  <div>Count: {results.directQuery?.count || 0}</div>
                  {results.directQuery?.error && (
                    <div className="text-red-600">{results.directQuery.error}</div>
                  )}
                </div>
              </div>

              {/* API Query Test */}
              <div className="p-3 bg-muted rounded-md">
                <div className="flex items-center gap-2 mb-2">
                  <StatusIcon success={results.apiQuery?.success} />
                  <span className="font-medium">Tips API Query</span>
                </div>
                <div className="text-sm space-y-1">
                  <div>Count: {results.apiQuery?.count || 0}</div>
                  {results.apiQuery?.error && (
                    <div className="text-red-600">{results.apiQuery.error}</div>
                  )}
                </div>
              </div>

              {/* Table Structure Test */}
              <div className="p-3 bg-muted rounded-md">
                <div className="flex items-center gap-2 mb-2">
                  <StatusIcon success={results.tableStructure?.success} />
                  <span className="font-medium">Table Structure</span>
                </div>
                <div className="text-sm space-y-1">
                  <div>Has Data: {results.tableStructure?.hasData ? 'Yes' : 'No'}</div>
                  {results.tableStructure?.error && (
                    <div className="text-red-600">{results.tableStructure.error}</div>
                  )}
                </div>
              </div>

              {/* RLS Policies Test */}
              <div className="p-3 bg-muted rounded-md">
                <div className="flex items-center gap-2 mb-2">
                  <StatusIcon success={results.rlsPolicies?.success} />
                  <span className="font-medium">RLS Policies</span>
                </div>
                <div className="text-sm space-y-1">
                  <div>Can Read: {results.rlsPolicies?.canRead ? 'Yes' : 'No'}</div>
                  {results.rlsPolicies?.error && (
                    <div className="text-red-600">{results.rlsPolicies.error}</div>
                  )}
                </div>
              </div>

              {/* Total Count Test */}
              <div className="p-3 bg-muted rounded-md col-span-full">
                <div className="flex items-center gap-2 mb-2">
                  <StatusIcon success={results.totalCount?.success} />
                  <span className="font-medium">Total Tips Count</span>
                </div>
                <div className="text-sm space-y-1">
                  <div>Total Tips in Database: {results.totalCount?.count || 0}</div>
                  {results.totalCount?.error && (
                    <div className="text-red-600">{results.totalCount.error}</div>
                  )}
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

        {/* Diagnostic Summary */}
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
          <h4 className="font-medium text-blue-900 mb-2">진단 가이드</h4>
          <div className="text-sm text-blue-800 space-y-1">
            <div>• <strong>Direct Query 실패:</strong> 데이터베이스 연결 문제</div>
            <div>• <strong>API Query 실패:</strong> 데이터 변환 로직 문제</div>
            <div>• <strong>RLS 실패:</strong> Row Level Security 정책 문제</div>
            <div>• <strong>Count가 0:</strong> 데이터베이스에 팁이 없음</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-md">
          <h4 className="font-medium text-amber-900 mb-2">빠른 해결책</h4>
          <div className="text-sm text-amber-800 space-y-2">
            <div>1. 브라우저 개발자 도구 → Console 탭에서 로그 확인</div>
            <div>2. /dev 페이지에서 샘플 팁 추가</div>
            <div>3. Supabase 대시보드에서 tips 테이블 직접 확인</div>
            <div>4. RLS 정책이 올바르게 설정되어 있는지 확인</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}