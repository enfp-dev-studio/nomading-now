import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuthStore } from '@/store/useAuthStore';
import { auth } from '@/lib/supabase';
import { toast } from 'sonner';

const signInSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const signUpSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
  nickname: z.string().min(2, 'Nickname must be at least 2 characters'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type SignInForm = z.infer<typeof signInSchema>;
type SignUpForm = z.infer<typeof signUpSchema>;

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AuthModal({ open, onOpenChange }: AuthModalProps) {
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const { setLoading } = useAuthStore();

  const signInForm = useForm<SignInForm>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: 'enfpdevtest@gmail.com', // 기본값으로 설정
      password: 'test123456', // 기본값으로 설정
    },
  });

  const signUpForm = useForm<SignUpForm>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      nickname: '',
    },
  });

  const clearSessionAndRetry = async () => {
    auth.clearSession();
    setAuthError(null);
    toast.info('Session cleared. Please try signing in again.');
  };

  const handleSignIn = async (data: SignInForm) => {
    setIsLoading(true);
    setLoading(true);
    setAuthError(null);

    try {
      const { error } = await auth.signIn(data.email, data.password);
      
      if (error) {
        console.error('Sign in error:', error);
        
        if (error.message.includes('Invalid login credentials')) {
          setAuthError('Invalid email or password. Please check your credentials and try again.');
          toast.error('Invalid email or password');
        } else if (error.message.includes('Email not confirmed')) {
          setAuthError('Please check your email and click the confirmation link before signing in.');
          toast.error('Email not confirmed');
        } else {
          setAuthError(error.message);
          toast.error(error.message);
        }
        return;
      }

      toast.success('Welcome back!');
      onOpenChange(false);
      signInForm.reset();
      setAuthError(null);
    } catch (error) {
      console.error('Unexpected sign in error:', error);
      setAuthError('An unexpected error occurred. Please try again.');
      toast.error('An unexpected error occurred');
    } finally {
      setIsLoading(false);
      setLoading(false);
    }
  };

  const handleSignUp = async (data: SignUpForm) => {
    setIsLoading(true);
    setLoading(true);
    setAuthError(null);

    try {
      const { error } = await auth.signUp(data.email, data.password, data.nickname);
      
      if (error) {
        console.error('Sign up error:', error);
        
        if (error.message.includes('already registered')) {
          setAuthError('This email is already registered. Please sign in instead.');
          toast.error('Email already registered');
        } else {
          setAuthError(error.message);
          toast.error(error.message);
        }
        return;
      }

      toast.success('Account created! Please check your email to verify your account.');
      onOpenChange(false);
      signUpForm.reset();
      setAuthError(null);
    } catch (error) {
      console.error('Unexpected sign up error:', error);
      setAuthError('An unexpected error occurred. Please try again.');
      toast.error('An unexpected error occurred');
    } finally {
      setIsLoading(false);
      setLoading(false);
    }
  };

  // Clear error when switching tabs
  const handleTabChange = (value: string) => {
    setActiveTab(value as 'signin' | 'signup');
    setAuthError(null);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Welcome to Nomading Now</DialogTitle>
          <DialogDescription>
            Sign in to your account or create a new one to start sharing tips.
          </DialogDescription>
        </DialogHeader>

        {authError && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-md p-3">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-destructive mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm text-destructive">{authError}</p>
                {authError.includes('Invalid login credentials') && (
                  <Button
                    variant="link"
                    size="sm"
                    onClick={clearSessionAndRetry}
                    className="h-auto p-0 mt-1 text-destructive underline"
                  >
                    Clear session and try again
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}

        <Tabs value={activeTab} onValueChange={handleTabChange}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>

          <TabsContent value="signin" className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-md p-3">
              <p className="text-sm text-green-800">
                <strong>자동 로그인:</strong> 앱 시작시 자동으로 enfpdevtest@gmail.com 계정으로 로그인됩니다
              </p>
            </div>
            
            <form onSubmit={signInForm.handleSubmit(handleSignIn)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signin-email">Email</Label>
                <Input
                  id="signin-email"
                  type="email"
                  placeholder="Enter your email"
                  {...signInForm.register('email')}
                />
                {signInForm.formState.errors.email && (
                  <p className="text-sm text-destructive">
                    {signInForm.formState.errors.email.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="signin-password">Password</Label>
                <div className="relative">
                  <Input
                    id="signin-password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    {...signInForm.register('password')}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                {signInForm.formState.errors.password && (
                  <p className="text-sm text-destructive">
                    {signInForm.formState.errors.password.message}
                  </p>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Sign In
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="signup" className="space-y-4">
            <form onSubmit={signUpForm.handleSubmit(handleSignUp)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signup-nickname">Nickname</Label>
                <Input
                  id="signup-nickname"
                  type="text"
                  placeholder="Choose a nickname"
                  {...signUpForm.register('nickname')}
                />
                {signUpForm.formState.errors.nickname && (
                  <p className="text-sm text-destructive">
                    {signUpForm.formState.errors.nickname.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-email">Email</Label>
                <Input
                  id="signup-email"
                  type="email"
                  placeholder="Enter your email"
                  {...signUpForm.register('email')}
                />
                {signUpForm.formState.errors.email && (
                  <p className="text-sm text-destructive">
                    {signUpForm.formState.errors.email.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-password">Password</Label>
                <div className="relative">
                  <Input
                    id="signup-password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Create a password"
                    {...signUpForm.register('password')}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                {signUpForm.formState.errors.password && (
                  <p className="text-sm text-destructive">
                    {signUpForm.formState.errors.password.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-confirm-password">Confirm Password</Label>
                <Input
                  id="signup-confirm-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Confirm your password"
                  {...signUpForm.register('confirmPassword')}
                />
                {signUpForm.formState.errors.confirmPassword && (
                  <p className="text-sm text-destructive">
                    {signUpForm.formState.errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Account
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}