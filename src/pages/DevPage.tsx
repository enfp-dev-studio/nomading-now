import { CreateTestAccounts } from '@/components/dev/CreateTestAccounts';
import { AddSampleTips } from '@/components/dev/AddSampleTips';
import { AuthDebugger } from '@/components/dev/AuthDebugger';
import { useAuthStore } from '@/store/useAuthStore';

export function DevPage() {
  const { user } = useAuthStore();

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border p-4 sm:p-6">
        <h1 className="text-xl sm:text-2xl font-bold text-foreground">Development Tools</h1>
        <p className="text-sm text-muted-foreground mt-1">Tools for testing and development</p>
        {user && (
          <p className="text-sm text-primary mt-2">
            Signed in as: <strong>{user.nickname}</strong> ({user.email})
          </p>
        )}
      </header>

      <div className="p-4 sm:p-6">
        <div className="max-w-4xl mx-auto space-y-8">
          <AuthDebugger />
          <CreateTestAccounts />
          <AddSampleTips userId={user?.id} userNickname={user?.nickname} />
        </div>
      </div>
    </div>
  );
}