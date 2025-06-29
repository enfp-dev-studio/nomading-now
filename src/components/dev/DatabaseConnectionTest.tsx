import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { 
  Database, 
  Play, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  RefreshCw,
  Eye
} from 'lucide-react';

export function DatabaseConnectionTest() {
  const [testing, setTesting] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [showRawData, setShowRawData] = useState(false);

  const runConnectionTest = async () => {
    setTesting(true);
    const testResults: any = {
      timestamp: new Date().toISOString(),
      tests: {}
    };

    try {
      // Test 1: Environment variables
      console.log('🔍 Test 1: Environment variables...');
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      
      testResults.tests.env = {
        success: !!(supabaseUrl && supabaseKey),
        hasUrl: !!supabaseUrl,
        hasKey: !!supabaseKey,
        urlLength: supabaseUrl?.length || 0,
        keyLength: supabaseKey?.length || 0,
        message: (supabaseUrl && supabaseKey) ? 'Environment variables are set' : 'Missing environment variables'
      };

      // Test 2: Basic connection
      console.log('🔍 Test 2: Basic database connection...');
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

      // Test 3: Table structure check
      console.log('🔍 Test 3: Table structure check...');
      try {
        const { data, error } = await supabase
          .from('tips')
          .select('id, content, category, city, country, user_id, created_at')
          .limit(1);
        
        testResults.tests.structure = {
          success: !error,
          error: error?.message,
          hasData: data && data.length > 0,
          sample: data?.[0] || null,
          message: !error ? 'Table structure is correct' : `Structure error: ${error.message}`
        };
      } catch (error) {
        testResults.tests.structure = {
          success: false,
          error: error.message,
          message: `Structure test error: ${error.message}`
        };
      }

      // Test 4: Count all tips
      console.log('🔍 Test 4: Count all tips...');
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

      // Test 5: Fetch with user join
      console.log('🔍 Test 5: Fetch with user join...');
      try {
        const { data, error } = await supabase
          .from('tips')
          .select(`
            id,
            content,
            category,
            city,
            country,
            user:users(id, nickname, email)
          `)
          .limit(3);
        
        testResults.tests.join = {
          success: !error,
          error: error?.message,
          count: data?.length || 0,
          hasUserData: data?.[0]?.user ? true : false,
          sample: data?.[0] || null,
          rawData: data,
          message: !error ? `Successfully fetched ${data?.length || 0} tips with user data` : `Join failed: ${error.message}`
        };
      } catch (error) {
        testResults.tests.join = {
          success: false,
          error: error.message,
          count: 0,
          message: `Join error: ${error.message}`
        };
      }

    } catch (error) {
      console.error('💥 Connection test error:', error);
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
    <Card className="w-full max-w-3xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="w-5 h-5" />
          Database Connection Test
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-amber-50 border border-amber-200 rounded-md p-3">
          <div className="flex items-center gap-2 text-sm text-amber-800">
            <AlertTriangle className="w-4 h-4" />
            <span>
              <strong>Connection diagnosis:</strong> Check if the database is properly connected and accessible
            </span>
          </div>
        </div>

        <Button 
          onClick={runConnectionTest}
          disabled={testing}
          className="w-full"
        >
          {testing && <RefreshCw className="mr-2 h-4 w-4 animate-spin" />}
          <Play className="w-4 h-4 mr-2" />
          {testing ? 'Running Connection Test...' : 'Run Connection Test'}
        </Button>

        {results && (
          <div className="space-y-4">
            <h4 className="font-medium">Test Results:</h4>
            
            <div className="space-y-3">
              {Object.entries(results.tests).map(([testName, result]: [string, any]) => (
                <div key={testName} className="border rounded-md p-3">
                  <div className="flex items-start gap-3">
                    <StatusIcon success={result.success} />
                    <div className="flex-1">
                      <div className="font-medium text-sm capitalize">{testName} Test</div>
                      <div className="text-sm text-muted-foreground">{result.message}</div>
                      
                      {/* Environment variables details */}
                      {testName === 'env' && (
                        <div className="text-xs text-muted-foreground mt-1 space-y-1">
                          <div>URL: {result.hasUrl ? `✅ Set (${result.urlLength} chars)` : '❌ Missing'}</div>
                          <div>Key: {result.hasKey ? `✅ Set (${result.keyLength} chars)` : '❌ Missing'}</div>
                        </div>
                      )}
                      
                      {/* Count details */}
                      {testName === 'count' && (
                        <div className="text-xs text-muted-foreground mt-1">
                          Total tips in database: {result.count}
                        </div>
                      )}
                      
                      {/* Join test details */}
                      {testName === 'join' && result.success && (
                        <div className="text-xs text-muted-foreground mt-1 space-y-1">
                          <div>Tips fetched: {result.count}</div>
                          <div>Has user data: {result.hasUserData ? 'Yes' : 'No'}</div>
                          {result.sample && (
                            <div className="bg-gray-50 p-2 rounded mt-2">
                              <div className="font-medium">Sample tip:</div>
                              <div>ID: {result.sample.id}</div>
                              <div>Content: {result.sample.content?.slice(0, 50)}...</div>
                              <div>User: {result.sample.user?.nickname || 'No user data'}</div>
                              <div>Location: {result.sample.city}, {result.sample.country}</div>
                            </div>
                          )}
                          {result.rawData && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setShowRawData(!showRawData)}
                              className="text-xs mt-2"
                            >
                              <Eye className="w-3 h-3 mr-1" />
                              {showRawData ? 'Hide' : 'Show'} Raw Data
                            </Button>
                          )}
                        </div>
                      )}
                      
                      {result.error && (
                        <div className="text-xs text-red-600 mt-1 bg-red-50 p-2 rounded">
                          <strong>Error:</strong> {result.error}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Raw data display */}
            {showRawData && results.tests.join?.rawData && (
              <div className="bg-gray-50 p-4 rounded-md">
                <h5 className="font-medium mb-2">Raw Database Response:</h5>
                <pre className="text-xs overflow-x-auto">
                  {JSON.stringify(results.tests.join.rawData, null, 2)}
                </pre>
              </div>
            )}

            <div className="text-xs text-muted-foreground">
              Test completed at: {new Date(results.timestamp).toLocaleString()}
            </div>
          </div>
        )}

        <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
          <h4 className="font-medium text-blue-900 mb-2">What this test checks:</h4>
          <div className="text-sm text-blue-800 space-y-1">
            <div>• Environment variables (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY)</div>
            <div>• Basic database connection</div>
            <div>• Table structure and accessibility</div>
            <div>• Total number of tips in database</div>
            <div>• JOIN queries with user data</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}