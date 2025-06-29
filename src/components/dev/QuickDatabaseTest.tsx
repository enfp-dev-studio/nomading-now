import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';
import { tipsApi } from '@/lib/database';
import { useAuthStore } from '@/store/useAuthStore';
import { toast } from 'sonner';
import { 
  Database, 
  Play, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  RefreshCw
} from 'lucide-react';

export function QuickDatabaseTest() {
  const { user } = useAuthStore();
  const [testing, setTesting] = useState(false);
  const [results, setResults] = useState<any>(null);

  const runQuickTest = async () => {
    setTesting(true);
    const testResults: any = {
      timestamp: new Date().toISOString(),
      tests: {}
    };

    try {
      // Test 1: Basic connection
      console.log('🔍 Test 1: Basic database connection...');
      try {
        const { data, error } = await supabase.from('tips').select('count').limit(1);
        testResults.tests.connection = {
          success: !error,
          error: error?.message,
          message: !error ? 'Database connection successful' : `Connection failed: ${error.message}`
        };
      } catch (error) {
        testResults.tests.connection = {
          success: false,
          error: error.message,
          message: `Connection error: ${error.message}`
        };
      }

      // Test 2: Count tips
      console.log('🔍 Test 2: Count total tips...');
      try {
        const { count, error } = await supabase
          .from('tips')
          .select('*', { count: 'exact', head: true });
        
        testResults.tests.count = {
          success: !error,
          error: error?.message,
          count: count || 0,
          message: !error ? `Found ${count || 0} tips in database` : `Count failed: ${error.message}`
        };
      } catch (error) {
        testResults.tests.count = {
          success: false,
          error: error.message,
          count: 0,
          message: `Count error: ${error.message}`
        };
      }

      // Test 3: Fetch sample tips
      console.log('🔍 Test 3: Fetch sample tips...');
      try {
        const { data, error } = await supabase
          .from('tips')
          .select(`
            id,
            content,
            category,
            city,
            country,
            user:users(nickname)
          `)
          .limit(3);
        
        testResults.tests.fetch = {
          success: !error,
          error: error?.message,
          count: data?.length || 0,
          sample: data?.[0] || null,
          message: !error ? `Successfully fetched ${data?.length || 0} sample tips` : `Fetch failed: ${error.message}`
        };
      } catch (error) {
        testResults.tests.fetch = {
          success: false,
          error: error.message,
          count: 0,
          message: `Fetch error: ${error.message}`
        };
      }

      // Test 4: API function test
      console.log('🔍 Test 4: Test tipsApi.getTips()...');
      try {
        const apiData = await tipsApi.getTips(user?.id);
        testResults.tests.api = {
          success: true,
          count: apiData?.length || 0,
          sample: apiData?.[0] || null,
          message: `API returned ${apiData?.length || 0} tips`
        };
      } catch (error) {
        testResults.tests.api = {
          success: false,
          error: error.message,
          count: 0,
          message: `API error: ${error.message}`
        };
      }

      // Test 5: RLS test
      console.log('🔍 Test 5: Test RLS policies...');
      try {
        const { data, error } = await supabase
          .from('tips')
          .select('id, content')
          .limit(1);
        
        testResults.tests.rls = {
          success: !error,
          error: error?.message,
          canRead: !error && data !== null,
          message: !error ? 'RLS policies allow reading tips' : `RLS error: ${error.message}`
        };
      } catch (error) {
        testResults.tests.rls = {
          success: false,
          error: error.message,
          canRead: false,
          message: `RLS test error: ${error.message}`
        };
      }

    } catch (error) {
      console.error('💥 Quick test error:', error);
    }

    setResults(testResults);
    setTesting(false);

    // Show summary toast
    const successCount = Object.values(testResults.tests).filter((test: any) => test.success).length;
    const totalTests = Object.keys(testResults.tests).length;
    
    if (successCount === totalTests) {
      toast.success(`✅ All ${totalTests} tests passed!`);
    } else {
      toast.error(`❌ ${totalTests - successCount}/${totalTests} tests failed`);
    }
  };

  const StatusIcon = ({ success }: { success: boolean }) => (
    success ? 
      <CheckCircle className="w-4 h-4 text-green-600" /> : 
      <XCircle className="w-4 h-4 text-red-600" />
  );

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="w-5 h-5" />
          Quick Database Test
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
          <div className="flex items-center gap-2 text-sm text-blue-800">
            <AlertTriangle className="w-4 h-4" />
            <span>
              <strong>Quick diagnosis:</strong> Run this test to check if the database is working properly
            </span>
          </div>
        </div>

        <Button 
          onClick={runQuickTest}
          disabled={testing}
          className="w-full"
        >
          {testing && <RefreshCw className="mr-2 h-4 w-4 animate-spin" />}
          <Play className="w-4 h-4 mr-2" />
          {testing ? 'Running Tests...' : 'Run Quick Test'}
        </Button>

        {results && (
          <div className="space-y-3">
            <h4 className="font-medium">Test Results:</h4>
            
            <div className="space-y-2">
              {Object.entries(results.tests).map(([testName, result]: [string, any]) => (
                <div key={testName} className="flex items-start gap-3 p-3 bg-muted rounded-md">
                  <StatusIcon success={result.success} />
                  <div className="flex-1">
                    <div className="font-medium text-sm capitalize">{testName} Test</div>
                    <div className="text-sm text-muted-foreground">{result.message}</div>
                    {result.count !== undefined && (
                      <div className="text-xs text-muted-foreground mt-1">
                        Count: {result.count}
                      </div>
                    )}
                    {result.error && (
                      <div className="text-xs text-red-600 mt-1">
                        Error: {result.error}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="text-xs text-muted-foreground">
              Test completed at: {new Date(results.timestamp).toLocaleString()}
            </div>
          </div>
        )}

        <div className="bg-amber-50 border border-amber-200 rounded-md p-3">
          <h4 className="font-medium text-amber-900 mb-2">What this test checks:</h4>
          <div className="text-sm text-amber-800 space-y-1">
            <div>• Database connection and authentication</div>
            <div>• Total number of tips in database</div>
            <div>• Ability to fetch sample data</div>
            <div>• API function functionality</div>
            <div>• Row Level Security (RLS) policies</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}