import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/components/AuthProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Chrome, Mail, Lock, ArrowRight, Loader2, AlertCircle, Smartphone } from "lucide-react";
import { m, AnimatePresence } from "framer-motion";
import Logo from "@/components/ui/logo";
import { getMultiFactorResolver, PhoneAuthProvider, PhoneMultiFactorGenerator, RecaptchaVerifier } from "firebase/auth";
import { auth } from "@/lib/firebase";

import { logMfaAction } from "@/lib/audit";

export default function LoginPage() {
  const [, setLocation] = useLocation();
  const { login, loginWithGoogle } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mfaResolver, setMfaResolver] = useState<any>(null);
  const [mfaCode, setMfaCode] = useState("");
  const [mfaVerificationId, setMfaVerificationId] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await login(email, password);
      setLocation("/dashboard");
    } catch (err: any) {
      if (err.code === 'auth/multi-factor-auth-required') {
        const resolver = getMultiFactorResolver(auth, err);
        setMfaResolver(resolver);
        
        // Setup reCAPTCHA and send code
        const verifier = new RecaptchaVerifier(auth, 'recaptcha-login-container', {
          size: 'invisible'
        });
        
        const phoneInfoOptions = {
          multiFactorHint: resolver.hints[0],
          session: resolver.session
        };
        
        const phoneAuthProvider = new PhoneAuthProvider(auth);
        const vId = await phoneAuthProvider.verifyPhoneNumber(phoneInfoOptions, verifier);
        setMfaVerificationId(vId);
      } else {
        setError(err.message || "Failed to sign in. Please check your credentials.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleMfaSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mfaResolver || !mfaVerificationId) return;

    setLoading(true);
    setError(null);
    try {
      const cred = PhoneAuthProvider.credential(mfaVerificationId, mfaCode);
      const assertion = PhoneMultiFactorGenerator.assertion(cred);
      await mfaResolver.resolveWithAssertion(assertion);
      await logMfaAction('verify_success');
      setLocation("/dashboard");
    } catch (err: any) {
      setError(err.message || "Invalid verification code.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      await loginWithGoogle();
      setLocation("/dashboard");
    } catch (err: any) {
      setError(err.message || "Failed to sign in with Google.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <m.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="sm:mx-auto sm:w-full sm:max-w-md"
      >
        <div className="flex justify-center mb-6">
          <Link href="/" className="flex items-center gap-2 group">
            <Logo size="lg" />
            <span className="font-black text-2xl bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              MyeCA.in
            </span>
          </Link>
        </div>
        <h2 className="text-center text-3xl font-black text-slate-900 tracking-tight">
          Welcome back
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600 font-medium">
          Don't have an account?{" "}
          <Link href="/register" className="font-black text-blue-600 hover:text-blue-500 transition-colors">
            Sign up for free
          </Link>
        </p>
      </m.div>

      <m.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mt-8 sm:mx-auto sm:w-full sm:max-w-md"
      >
        <Card className="border-slate-200/60 shadow-xl shadow-slate-200/50 rounded-2xl overflow-hidden">
          <CardHeader className="space-y-1 pt-8 px-8">
            <CardTitle className="text-xl font-bold">Sign In</CardTitle>
            <CardDescription className="text-slate-500">
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <CardContent className="px-8 pb-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-100 rounded-xl p-4 flex items-start gap-3 text-red-600 text-sm animate-in fade-in slide-in-from-top-1">
                  <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                  <p className="font-medium">{error}</p>
                </div>
              )}
              
              <div id="recaptcha-login-container"></div>

              <AnimatePresence mode="wait">
                {!mfaResolver ? (
                  <m.div 
                    key="login-fields"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="space-y-4"
                  >
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-xs font-black uppercase tracking-widest text-slate-400">Email Address</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <Input 
                          id="email" 
                          type="email" 
                          placeholder="name@company.com" 
                          className="pl-10 h-12 rounded-xl border-slate-200 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          disabled={loading}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="password" className="text-xs font-black uppercase tracking-widest text-slate-400">Password</Label>
                        <Link href="/forgot-password" className="text-xs font-bold text-blue-600 hover:text-blue-500 transition-colors">
                          Forgot password?
                        </Link>
                      </div>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <Input 
                          id="password" 
                          type="password" 
                          placeholder="••••••••" 
                          className="pl-10 h-12 rounded-xl border-slate-200 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          disabled={loading}
                        />
                      </div>
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-xl shadow-lg shadow-blue-200 transition-all disabled:opacity-70"
                      disabled={loading}
                    >
                      {loading ? (
                        <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                      ) : (
                        <span className="flex items-center justify-center gap-2">
                          Sign In <ArrowRight className="w-4 h-4" />
                        </span>
                      )}
                    </Button>
                  </m.div>
                ) : (
                  <m.div 
                    key="mfa-fields"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                  >
                    <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-start gap-3 text-blue-600 text-sm">
                      <Smartphone className="w-4 h-4 mt-0.5 shrink-0" />
                      <div>
                        <p className="font-bold">Two-Factor Authentication</p>
                        <p className="font-medium opacity-80 text-xs">Enter the 6-digit code sent to your primary device.</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="mfaCode" className="text-xs font-black uppercase tracking-widest text-slate-400">Verification Code</Label>
                      <Input 
                        id="mfaCode" 
                        type="text" 
                        placeholder="123456" 
                        className="h-12 rounded-xl border-slate-200 focus:ring-blue-500 focus:border-blue-500 transition-all font-black text-center text-2xl tracking-[0.5em]"
                        value={mfaCode}
                        onChange={(e) => setMfaCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        required
                        disabled={loading}
                        autoFocus
                      />
                    </div>

                    <Button 
                      type="button"
                      onClick={handleMfaSubmit}
                      className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-xl shadow-lg shadow-blue-200 transition-all disabled:opacity-70"
                      disabled={loading || mfaCode.length < 6}
                    >
                      {loading ? (
                        <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                      ) : (
                        "Verify & Sign In"
                      )}
                    </Button>
                    
                    <Button 
                      variant="ghost" 
                      onClick={() => setMfaResolver(null)} 
                      className="w-full text-slate-500"
                      disabled={loading}
                    >
                      Back to Login
                    </Button>
                  </m.div>
                )}
              </AnimatePresence>
            </form>

            <div className="relative mt-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <div className="relative flex justify-center text-xs font-bold uppercase tracking-widest">
                <span className="bg-white px-4 text-slate-400">Or continue with</span>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-4">
              <Button 
                variant="outline" 
                className="h-12 border-slate-200 rounded-xl hover:bg-slate-50 font-bold transition-all transition-colors"
                onClick={handleGoogleLogin}
                disabled={loading}
              >
                <Chrome className="w-5 h-5 mr-3 text-red-500" />
                Google Account
              </Button>
            </div>
          </CardContent>
          <CardFooter className="bg-slate-50/50 border-t border-slate-100 py-4 px-8 justify-center">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest text-center">
              Secured by Google Firebase Authentication
            </p>
          </CardFooter>
        </Card>
      </m.div>

      <div className="mt-8 text-center px-4">
        <p className="text-xs text-slate-500 font-medium">
          By continuing, you agree to our{" "}
          <Link href="/legal/terms-of-service" className="underline hover:text-slate-700">Terms of Service</Link>
          {" "}and{" "}
          <Link href="/legal/privacy-policy" className="underline hover:text-slate-700">Privacy Policy</Link>.
        </p>
      </div>
    </div>
  );
}