
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building2, Shield, Mail, Lock, ArrowRight } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const formSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(1, { message: 'Password is required' }),
});

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'admin' | 'vendor'>('admin');

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      await login(values.email, values.password);
      navigate('/dashboard');
    } catch (error) {
      toast.error('Failed to login');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    try {
      // For demo purposes, we'll just use the demo credentials
      setTimeout(() => {
        setDemoCredentials();
        form.handleSubmit(onSubmit)();
      }, 1500);
    } catch (error) {
      toast.error('Google login failed');
    } finally {
      setIsGoogleLoading(false);
    }
  };

  // Set demo credentials based on active tab
  const setDemoCredentials = () => {
    switch (activeTab) {
      case 'admin':
        form.setValue('email', 'admin@example.com');
        form.setValue('password', 'password');
        break;
      case 'vendor':
        form.setValue('email', 'vendor@example.com');
        form.setValue('password', 'password');
        break;
    }
  };

  // Get the appropriate page title based on active tab
  const getPageTitle = () => {
    return activeTab === 'admin' ? 'Admin Login' : 'Vendor Login';
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-4">
      <div className="w-full max-w-md animate-scale-in">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-400">
            Vendor Connect
          </h1>
          <p className="text-muted-foreground mt-2">
            Streamline vendor contract management
          </p>
        </div>
        
        <Card className="border-border/50 shadow-xl overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-primary to-blue-400"></div>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">{getPageTitle()}</CardTitle>
            <CardDescription className="text-sm">
              {activeTab === 'admin' 
                ? 'Sign in to manage vendors and contracts' 
                : 'Sign in to view and manage your contracts'}
            </CardDescription>
            
            <Tabs 
              defaultValue="admin" 
              className="w-full mt-4"
              onValueChange={(value) => setActiveTab(value as 'admin' | 'vendor')}
              value={activeTab}
            >
              <TabsList className="grid grid-cols-2 w-full">
                <TabsTrigger value="admin" className="flex items-center gap-2">
                  <Shield className="h-4 w-4" /> Admin
                </TabsTrigger>
                <TabsTrigger value="vendor" className="flex items-center gap-2">
                  <Building2 className="h-4 w-4" /> Vendor
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent className="pt-4">
            <Button 
              variant="outline" 
              type="button" 
              className="w-full flex gap-2 mb-6 relative overflow-hidden group"
              disabled={isGoogleLoading}
              onClick={handleGoogleLogin}
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
                <path
                  d="M12.0003 4.75C13.7703 4.75 15.3553 5.36002 16.6053 6.54998L20.0303 3.125C17.9502 1.19 15.2353 0 12.0003 0C7.31028 0 3.25527 2.69 1.28027 6.60998L5.27028 9.70498C6.21525 6.86002 8.87028 4.75 12.0003 4.75Z"
                  fill="#EA4335"
                />
                <path
                  d="M23.49 12.275C23.49 11.49 23.415 10.73 23.3 10H12V14.51H18.47C18.18 15.99 17.34 17.25 16.08 18.1L19.945 21.1C22.2 19.01 23.49 15.92 23.49 12.275Z"
                  fill="#4285F4"
                />
                <path
                  d="M5.26498 14.2949C5.02498 13.5699 4.88501 12.7999 4.88501 11.9999C4.88501 11.1999 5.01998 10.4299 5.26498 9.7049L1.275 6.60986C0.46 8.22986 0 10.0599 0 11.9999C0 13.9399 0.46 15.7699 1.28 17.3899L5.26498 14.2949Z"
                  fill="#FBBC05"
                />
                <path
                  d="M12.0004 24.0001C15.2404 24.0001 17.9654 22.935 19.9454 21.095L16.0804 18.095C15.0054 18.82 13.6204 19.245 12.0004 19.245C8.8704 19.245 6.2154 17.135 5.2654 14.29L1.27539 17.385C3.25539 21.31 7.3104 24.0001 12.0004 24.0001Z"
                  fill="#34A853"
                />
              </svg>
              <span className="flex-1">
                {isGoogleLoading ? "Signing in with Google..." : `Sign in with Google as ${activeTab === 'admin' ? 'Admin' : 'Vendor'}`}
              </span>
              <ArrowRight className="w-4 h-4 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Button>

            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                          <Input
                            className="pl-10"
                            placeholder={activeTab === 'admin' ? 'admin@example.com' : 'vendor@example.com'} 
                            {...field} 
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                          <Input type="password" className="pl-10" placeholder="••••••••" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button 
                  type="submit" 
                  className="w-full group relative overflow-hidden" 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent"></span>
                      Signing in...
                    </span>
                  ) : (
                    <>
                      <span>
                        {`Sign in as ${activeTab === 'admin' ? 'Admin' : 'Vendor'}`}
                      </span>
                      <ArrowRight className="w-4 h-4 ml-2 opacity-0 group-hover:opacity-100 transition-opacity absolute right-4" />
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex flex-col gap-2 bg-muted/30">
            <div className="text-sm text-muted-foreground text-center w-full mb-1">
              For demo purposes, click to auto-fill:
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-full text-primary hover:text-primary/90" 
              onClick={setDemoCredentials}
            >
              Use {activeTab === 'admin' ? 'Admin' : 'Vendor'} Demo Credentials
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Login;
