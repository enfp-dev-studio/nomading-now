import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Database, 
  Users, 
  MapPin, 
  Bug, 
  Settings,
  Code,
  TestTube,
  Shield
} from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { ProtectedDevRoute } from '@/components/auth/ProtectedDevRoute';

// Import dev components
import { CreateTestAccounts } from '@/components/dev/CreateTestAccounts';
import { AddSampleTips } from '@/components/dev/AddSampleTips';
import { DatabaseConnectionTest } from '@/components/dev/DatabaseConnectionTest';
import { QuickDatabaseTest } from '@/components/dev/QuickDatabaseTest';
import { TipsDatabaseChecker } from '@/components/dev/TipsDatabaseChecker';
import { DatabaseDebugger } from '@/components/dev/DatabaseDebugger';
import { AuthDebugger } from '@/components/dev/AuthDebugger';

export function DevPage() {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <ProtectedDevRoute>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="bg-card border-b border-border p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-foreground flex items-center gap-2">
                <Code className="w-6 h-6" />
                Development Tools
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Internal development and debugging tools for Nomading Now
              </p>
            </div>
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              <Shield className="w-3 h-3 mr-1" />
              Dev Environment
            </Badge>
          </div>
        </header>

        <div className="p-4 sm:p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="database">Database</TabsTrigger>
              <TabsTrigger value="auth">Auth</TabsTrigger>
              <TabsTrigger value="testing">Testing</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Database className="w-4 h-4" />
                      Database Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">
                      Quick database connection and data check
                    </p>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => setActiveTab('database')}
                      className="w-full"
                    >
                      Check Database
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      Test Accounts
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">
                      Create test accounts for development
                    </p>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => setActiveTab('testing')}
                      className="w-full"
                    >
                      Manage Tests
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      Sample Data
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">
                      Add sample tips for testing
                    </p>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => setActiveTab('testing')}
                      className="w-full"
                    >
                      Add Sample Tips
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Current User Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    Current Session
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <h4 className="font-medium mb-2">User Status</h4>
                      {user ? (
                        <div className="space-y-1 text-sm">
                          <div><strong>ID:</strong> {user.id}</div>
                          <div><strong>Email:</strong> {user.email}</div>
                          <div><strong>Nickname:</strong> {user.nickname}</div>
                          <div><strong>Points:</strong> {user.points}</div>
                          <div><strong>Trust Level:</strong> {user.trust_level}</div>
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">Not signed in</p>
                      )}
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Environment</h4>
                      <div className="space-y-1 text-sm">
                        <div><strong>Mode:</strong> {import.meta.env.DEV ? 'Development' : 'Production'}</div>
                        <div><strong>Supabase URL:</strong> {import.meta.env.VITE_SUPABASE_URL ? '✅ Set' : '❌ Missing'}</div>
                        <div><strong>Supabase Key:</strong> {import.meta.env.VITE_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing'}</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Database Tab */}
            <TabsContent value="database" className="space-y-6">
              <div className="grid gap-6">
                <QuickDatabaseTest />
                <DatabaseConnectionTest />
                <TipsDatabaseChecker />
                <DatabaseDebugger />
              </div>
            </TabsContent>

            {/* Auth Tab */}
            <TabsContent value="auth" className="space-y-6">
              <AuthDebugger />
            </TabsContent>

            {/* Testing Tab */}
            <TabsContent value="testing" className="space-y-6">
              <div className="grid gap-6">
                <CreateTestAccounts />
                <AddSampleTips userId={user?.id} userNickname={user?.nickname} />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </ProtectedDevRoute>
  );
}