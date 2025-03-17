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
import { Building2, Shield, Mail, Lock, ArrowRight, Eye, EyeOff, Send, Check } from "lucide-react";
import { Separator } from "@/components/ui/separator";

// Schema for admin login
const adminFormSchema = z.object({
  email: z.string().email({
    message: 'Please enter a valid email address'
  }),
  password: z.string().min(1, {
    message: 'Password is required'
  })
});

// Schema for vendor login with OTP verification step
const vendorEmailSchema = z.object({
  email: z.string().email({
    message: 'Please enter a valid email address'
  })
});
const vendorOtpSchema = z.object({
  otp: z.string().length(6, {
    message: 'OTP must be 6 digits'
  })
});
const Login = () => {
  const {
    login
  } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'admin' | 'vendor'>('admin');
  const [showPassword, setShowPassword] = useState(false);
  const [vendorStep, setVendorStep] = useState<'email' | 'otp'>('email');
  const [vendorEmail, setVendorEmail] = useState('');

  // Admin login form
  const adminForm = useForm<z.infer<typeof adminFormSchema>>({
    resolver: zodResolver(adminFormSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  });

  // Vendor email form
  const vendorEmailForm = useForm<z.infer<typeof vendorEmailSchema>>({
    resolver: zodResolver(vendorEmailSchema),
    defaultValues: {
      email: ''
    }
  });

  // Vendor OTP verification form
  const vendorOtpForm = useForm<z.infer<typeof vendorOtpSchema>>({
    resolver: zodResolver(vendorOtpSchema),
    defaultValues: {
      otp: ''
    }
  });
  const onSubmitAdmin = async (values: z.infer<typeof adminFormSchema>) => {
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
  const onSubmitVendorEmail = async (values: z.infer<typeof vendorEmailSchema>) => {
    setIsLoading(true);
    try {
      // Simulate sending OTP email
      await new Promise(resolve => setTimeout(resolve, 1500));
      setVendorEmail(values.email);
      setVendorStep('otp');
      toast.success(`OTP sent to ${values.email}`);
    } catch (error) {
      toast.error('Failed to send OTP');
    } finally {
      setIsLoading(false);
    }
  };
  const onSubmitVendorOtp = async (values: z.infer<typeof vendorOtpSchema>) => {
    setIsLoading(true);
    try {
      // Simulate verifying OTP
      await new Promise(resolve => setTimeout(resolve, 1500));

      // For demo purposes we'll consider "123456" as valid OTP
      if (values.otp === "123456") {
        // Simulate login
        await login(vendorEmail, "vendor-authenticated-via-otp");
        toast.success("OTP verified successfully");
        navigate('/dashboard');
      } else {
        toast.error("Invalid OTP, please try again");
      }
    } catch (error) {
      toast.error('Verification failed');
    } finally {
      setIsLoading(false);
    }
  };
  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    try {
      // For demo purposes only
      setTimeout(() => {
        vendorEmailForm.setValue('email', 'vendor@example.com');
        vendorEmailForm.handleSubmit(onSubmitVendorEmail)();
      }, 1500);
    } catch (error) {
      toast.error('Google login failed');
    } finally {
      setIsGoogleLoading(false);
    }
  };

  // Set demo credentials based on active tab
  const setDemoCredentials = () => {
    if (activeTab === 'admin') {
      adminForm.setValue('email', 'admin@example.com');
      adminForm.setValue('password', 'password');
    } else if (activeTab === 'vendor' && vendorStep === 'email') {
      vendorEmailForm.setValue('email', 'vendor@example.com');
    } else if (activeTab === 'vendor' && vendorStep === 'otp') {
      vendorOtpForm.setValue('otp', '123456');
    }
  };

  // Reset vendor step when switching tabs
  const handleTabChange = (value: string) => {
    setActiveTab(value as 'admin' | 'vendor');
    if (value === 'vendor') {
      setVendorStep('email');
    }
  };

  // Resend OTP handler
  const handleResendOtp = async () => {
    setIsLoading(true);
    try {
      // Simulate resending OTP
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success(`OTP resent to ${vendorEmail}`);
    } catch (error) {
      toast.error('Failed to resend OTP');
    } finally {
      setIsLoading(false);
    }
  };
  return <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-4">
      <div className="w-full max-w-md animate-scale-in">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-400">ATS by outamation</h1>
          <p className="text-muted-foreground mt-2">
            Streamline vendor contract management
          </p>
        </div>
        
        <Card className="border-border/50 shadow-xl overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-primary to-blue-400"></div>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">
              {activeTab === 'admin' ? 'Admin Login' : 'Vendor Login'}
            </CardTitle>
            <CardDescription className="text-sm">
              {activeTab === 'admin' ? 'Sign in to manage vendors and contracts' : vendorStep === 'email' ? 'Enter your email to receive a verification code' : 'Enter the verification code sent to your email'}
            </CardDescription>
            
            <Tabs defaultValue="admin" className="w-full mt-4" onValueChange={handleTabChange} value={activeTab}>
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
            {activeTab === 'admin' ? <Form {...adminForm}>
                <form onSubmit={adminForm.handleSubmit(onSubmitAdmin)} className="space-y-4">
                  <FormField control={adminForm.control} name="email" render={({
                field
              }) => <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                            <Input className="pl-10" placeholder="admin@example.com" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>} />
                  <FormField control={adminForm.control} name="password" render={({
                field
              }) => <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                            <Input type={showPassword ? "text" : "password"} className="pl-10 pr-10" placeholder="••••••••" {...field} />
                            <button type="button" className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" onClick={() => setShowPassword(!showPassword)}>
                              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>} />
                  <Button type="submit" className="w-full group relative overflow-hidden" disabled={isLoading}>
                    {isLoading ? <span className="flex items-center gap-2">
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent"></span>
                        Signing in...
                      </span> : <>
                        <span>Sign in as Admin</span>
                        <ArrowRight className="w-4 h-4 ml-2 opacity-0 group-hover:opacity-100 transition-opacity absolute right-4" />
                      </>}
                  </Button>
                </form>
              </Form> : vendorStep === 'email' ? <>
                <Button variant="outline" type="button" className="w-full flex gap-2 mb-6 relative overflow-hidden group" disabled={isGoogleLoading} onClick={handleGoogleLogin}>
                  <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
                    <path d="M12.0003 4.75C13.7703 4.75 15.3553 5.36002 16.6053 6.54998L20.0303 3.125C17.9502 1.19 15.2353 0 12.0003 0C7.31028 0 3.25527 2.69 1.28027 6.60998L5.27028 9.70498C6.21525 6.86002 8.87028 4.75 12.0003 4.75Z" fill="#EA4335" />
                    <path d="M23.49 12.275C23.49 11.49 23.415 10.73 23.3 10H12V14.51H18.47C18.18 15.99 17.34 17.25 16.08 18.1L19.945 21.1C22.2 19.01 23.49 15.92 23.49 12.275Z" fill="#4285F4" />
                    <path d="M5.26498 14.2949C5.02498 13.5699 4.88501 12.7999 4.88501 11.9999C4.88501 11.1999 5.01998 10.4299 5.26498 9.7049L1.275 6.60986C0.46 8.22986 0 10.0599 0 11.9999C0 13.9399 0.46 15.7699 1.28 17.3899L5.26498 14.2949Z" fill="#FBBC05" />
                    <path d="M12.0004 24.0001C15.2404 24.0001 17.9654 22.935 19.9454 21.095L16.0804 18.095C15.0054 18.82 13.6204 19.245 12.0004 19.245C8.8704 19.245 6.2154 17.135 5.2654 14.29L1.27539 17.385C3.25539 21.31 7.3104 24.0001 12.0004 24.0001Z" fill="#34A853" />
                  </svg>
                  <span className="flex-1">
                    {isGoogleLoading ? "Signing in with Google..." : "Sign in with Google as Vendor"}
                  </span>
                  <ArrowRight className="w-4 h-4 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Button>

                <div className="relative mb-6">
                  <div className="absolute inset-0 flex items-center">
                    <Separator className="w-full" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">Or continue with email</span>
                  </div>
                </div>

                <Form {...vendorEmailForm}>
                  <form onSubmit={vendorEmailForm.handleSubmit(onSubmitVendorEmail)} className="space-y-4">
                    <FormField control={vendorEmailForm.control} name="email" render={({
                  field
                }) => <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                              <Input className="pl-10" placeholder="vendor@example.com" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>} />
                    <Button type="submit" className="w-full group relative overflow-hidden" disabled={isLoading}>
                      {isLoading ? <span className="flex items-center gap-2">
                          <span className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent"></span>
                          Sending OTP...
                        </span> : <>
                          <Send className="w-4 h-4 mr-2" />
                          <span>Send Verification Code</span>
                        </>}
                    </Button>
                  </form>
                </Form>
              </> : <Form {...vendorOtpForm}>
                <form onSubmit={vendorOtpForm.handleSubmit(onSubmitVendorOtp)} className="space-y-4">
                  <div className="mb-4 text-center">
                    <div className="text-sm font-medium text-primary mb-2">Verification Code Sent</div>
                    <div className="text-sm text-muted-foreground">
                      We've sent a 6-digit code to <span className="font-medium">{vendorEmail}</span>
                    </div>
                  </div>
                  
                  <FormField control={vendorOtpForm.control} name="otp" render={({
                field
              }) => <FormItem>
                        <FormLabel>Enter 6-Digit Code</FormLabel>
                        <FormControl>
                          <Input className="text-center tracking-[0.5em] font-mono text-lg" maxLength={6} inputMode="numeric" autoComplete="one-time-code" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>} />
                  
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? <span className="flex items-center gap-2">
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent"></span>
                        Verifying...
                      </span> : <>
                        <Check className="w-4 h-4 mr-2" />
                        <span>Verify and Sign In</span>
                      </>}
                  </Button>
                  
                  <div className="text-center mt-4">
                    <Button variant="link" type="button" className="text-sm" onClick={() => setVendorStep('email')}>
                      Use a different email
                    </Button>
                    <span className="text-muted-foreground mx-2">•</span>
                    <Button variant="link" type="button" className="text-sm" onClick={handleResendOtp} disabled={isLoading}>
                      Resend code
                    </Button>
                  </div>
                </form>
              </Form>}
          </CardContent>
          <CardFooter className="flex flex-col gap-2 bg-muted/30">
            <div className="text-sm text-muted-foreground text-center w-full mb-1">
              For demo purposes, click to auto-fill:
            </div>
            <Button variant="ghost" size="sm" className="w-full text-primary hover:text-primary/90" onClick={setDemoCredentials}>
              Use {activeTab === 'admin' ? 'Admin' : vendorStep === 'email' ? 'Vendor Email' : 'OTP'} Demo Credentials
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>;
};
export default Login;