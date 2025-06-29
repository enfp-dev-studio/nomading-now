import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { auth } from '@/lib/supabase';
import { toast } from 'sonner';
import { Loader2, Users, Check, AlertCircle } from 'lucide-react';

const TEST_ACCOUNTS = [
  {
    email: 'enfpdevtest@gmail.com',
    password: 'test123456',
    nickname: 'TestNomad1',
    bio: 'Full-stack developer 💻 | Testing the nomad tips app | Coffee lover ☕'
  },
  {
    email: 'enfpdevtest2@gmail.com', 
    password: 'test123456',
    nickname: 'TestNomad2',
    bio: 'UX Designer 🎨 | Digital nomad tester | Bangkok explorer 🍜'
  }
];

export function CreateTestAccounts() {
  const [isCreating, setIsCreating] = useState(false);
  const [createdAccounts, setCreatedAccounts] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState<string>('');

  const createTestAccounts = async () => {
    setIsCreating(true);
    setCreatedAccounts([]);
    const created: string[] = [];

    try {
      for (let i = 0; i < TEST_ACCOUNTS.length; i++) {
        const account = TEST_ACCOUNTS[i];
        setCurrentStep(`Creating ${account.nickname} (${i + 1}/${TEST_ACCOUNTS.length})`);
        
        try {
          const { error } = await auth.signUp(account.email, account.password, account.nickname);
          
          if (error) {
            if (error.message.includes('already registered') || error.message.includes('already been registered')) {
              toast.info(`${account.nickname} already exists`);
              created.push(account.email);
            } else {
              toast.error(`Failed to create ${account.nickname}: ${error.message}`);
              console.error('Signup error:', error);
            }
          } else {
            toast.success(`✅ Created ${account.nickname}!`);
            created.push(account.email);
          }
          
          // Small delay between requests to avoid rate limiting
          await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (error) {
          console.error(`Error creating ${account.email}:`, error);
          toast.error(`Error creating ${account.nickname}`);
        }
        
        setCreatedAccounts([...created]);
      }

      setCurrentStep('');
      
      if (created.length === TEST_ACCOUNTS.length) {
        toast.success('🎉 All test accounts created successfully!');
      } else {
        toast.info(`Created ${created.length}/${TEST_ACCOUNTS.length} accounts`);
      }
    } catch (error) {
      console.error('Error creating test accounts:', error);
      toast.error('Failed to create test accounts');
    } finally {
      setIsCreating(false);
      setCurrentStep('');
    }
  };

  const createSingleAccount = async (account: typeof TEST_ACCOUNTS[0]) => {
    try {
      const { error } = await auth.signUp(account.email, account.password, account.nickname);
      
      if (error) {
        if (error.message.includes('already registered') || error.message.includes('already been registered')) {
          toast.info(`${account.nickname} already exists`);
          setCreatedAccounts(prev => [...prev, account.email]);
        } else {
          toast.error(`Failed to create ${account.nickname}: ${error.message}`);
          console.error('Signup error:', error);
        }
      } else {
        toast.success(`✅ Created ${account.nickname}!`);
        setCreatedAccounts(prev => [...prev, account.email]);
      }
    } catch (error) {
      console.error(`Error creating ${account.email}:`, error);
      toast.error(`Error creating ${account.nickname}`);
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5" />
          Create Test Accounts
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">Real Gmail accounts for testing:</p>
              <p>These accounts will be created through Supabase Auth and can receive actual verification emails.</p>
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <h4 className="font-medium">Test Accounts:</h4>
          <div className="grid gap-2">
            {TEST_ACCOUNTS.map((account) => (
              <div 
                key={account.email}
                className="flex items-center justify-between p-3 bg-muted rounded-md"
              >
                <div className="flex-1">
                  <div className="font-mono text-sm font-medium">{account.email}</div>
                  <div className="text-xs text-muted-foreground">
                    {account.nickname} • {account.bio.slice(0, 50)}...
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {createdAccounts.includes(account.email) && (
                    <Check className="w-4 h-4 text-green-600" />
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => createSingleAccount(account)}
                    disabled={isCreating || createdAccounts.includes(account.email)}
                  >
                    {createdAccounts.includes(account.email) ? 'Created' : 'Create'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-md p-3">
          <p className="text-sm text-amber-800">
            <strong>Password for all accounts:</strong> test123456
          </p>
        </div>

        {currentStep && (
          <div className="text-sm text-blue-600 font-medium">
            {currentStep}
          </div>
        )}

        <div className="flex gap-2">
          <Button 
            onClick={createTestAccounts}
            disabled={isCreating}
            className="flex-1"
          >
            {isCreating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isCreating ? 'Creating Accounts...' : 'Create All Accounts'}
          </Button>
        </div>

        {createdAccounts.length > 0 && (
          <div className="text-sm text-green-600">
            ✅ Created {createdAccounts.length}/{TEST_ACCOUNTS.length} accounts
          </div>
        )}

        <div className="bg-gray-50 border border-gray-200 rounded-md p-3">
          <p className="text-sm text-gray-700">
            <strong>Next steps:</strong> After creating accounts, check the Gmail inboxes for verification emails (if email confirmation is enabled). Then you can sign in with these accounts to test the app.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}