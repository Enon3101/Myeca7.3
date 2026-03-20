import { useState, useEffect } from "react";
import { multiFactor, PhoneAuthProvider, PhoneMultiFactorGenerator, RecaptchaVerifier } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Smartphone, CheckCircle, XCircle, ShieldCheck } from "lucide-react";
import { logMfaAction } from "@/lib/audit";

export function MfaEnrollment() {
  const { toast } = useToast();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [verificationId, setVerificationId] = useState<string | null>(null);
  const [step, setStep] = useState<"initial" | "requesting" | "verifying" | "enrolled">("initial");
  const [isLoading, setIsLoading] = useState(false);
  const [enrolledFactors, setEnrolledFactors] = useState<any[]>([]);

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      const factors = multiFactor(user).enrolledFactors;
      setEnrolledFactors(factors);
      if (factors.length > 0) {
        setStep("enrolled");
      }
    }
  }, []);

  const setupRecaptcha = () => {
    if ((window as any).recaptchaVerifier) {
      return (window as any).recaptchaVerifier;
    }
    const verifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
      size: 'invisible'
    });
    (window as any).recaptchaVerifier = verifier;
    return verifier;
  };

  const startEnrollment = async () => {
    if (!phoneNumber) {
      toast({ title: "Error", description: "Please enter a phone number", variant: "destructive" });
      return;
    }

    setIsLoading(true);
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("No user logged in");

      const verifier = setupRecaptcha();
      const mfaSession = await multiFactor(user).getSession();
      
      const phoneInfoOptions = {
        phoneNumber: phoneNumber,
        session: mfaSession
      };
      
      const phoneAuthProvider = new PhoneAuthProvider(auth);
      const vId = await phoneAuthProvider.verifyPhoneNumber(phoneInfoOptions, verifier);
      
      setVerificationId(vId);
      setStep("verifying");
      toast({ title: "OTP Sent", description: "Verification code sent to your phone" });
    } catch (error: any) {
      console.error("MFA Enrollment Error:", error);
      toast({ title: "Error", description: error.message || "Failed to start enrollment", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const finalizeEnrollment = async () => {
    if (!verificationCode || !verificationId) return;

    setIsLoading(true);
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("No user logged in");

      const cred = PhoneAuthProvider.credential(verificationId, verificationCode);
      const multiFactorAssertion = PhoneMultiFactorGenerator.assertion(cred);
      
      await multiFactor(user).enroll(multiFactorAssertion, "Primary Phone");
      
      setStep("enrolled");
      const factors = multiFactor(user).enrolledFactors;
      setEnrolledFactors(factors);
      await logMfaAction('enroll');
      toast({ title: "Success", description: "MFA enabled successfully!" });
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Failed to finalize enrollment", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const disableMfa = async (factorUid: string) => {
    setIsLoading(true);
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("No user logged in");
      
      const mfaUser = multiFactor(user);
      await mfaUser.unenroll(factorUid);
      
      setStep("initial");
      setEnrolledFactors([]);
      await logMfaAction('unenroll');
      toast({ title: "MFA Disabled", description: "Multi-factor authentication has been disabled" });
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Failed to disable MFA", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div id="recaptcha-container"></div>
      
      <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100 dark:bg-slate-800 dark:border-slate-700">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${enrolledFactors.length > 0 ? "bg-green-100 text-green-600" : "bg-amber-100 text-amber-600"}`}>
          <ShieldCheck className="w-6 h-6" />
        </div>
        <div>
          <h4 className="font-bold text-slate-900 dark:text-white">
            {enrolledFactors.length > 0 ? "Two-Factor Authentication is ON" : "Two-Factor Authentication is OFF"}
          </h4>
          <p className="text-sm text-slate-500">
            {enrolledFactors.length > 0 
              ? "Your account is protected with an extra layer of security." 
              : "Add extra security to your account by requiring a code from your phone."}
          </p>
        </div>
      </div>

      {step === "initial" && (
        <div className="space-y-4 max-w-sm">
          <div className="space-y-2">
            <Label htmlFor="mfa-phone">Phone Number (with country code)</Label>
            <div className="flex gap-2">
              <Input 
                id="mfa-phone"
                placeholder="+91 9876543210" 
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
              <Button onClick={() => setStep("requesting")} variant="outline">Setup</Button>
            </div>
          </div>
        </div>
      )}

      {step === "requesting" && (
        <div className="space-y-4 max-w-sm p-4 border rounded-xl border-dashed border-slate-200">
          <div className="space-y-2">
            <Label>Verify Phone Number</Label>
            <p className="text-xs text-slate-500 mb-2">We will send an SMS to {phoneNumber}</p>
            <div className="flex gap-2">
              <Button onClick={startEnrollment} disabled={isLoading} className="w-full">
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Smartphone className="w-4 h-4 mr-2" />}
                Send Code
              </Button>
              <Button onClick={() => setStep("initial")} variant="ghost">Cancel</Button>
            </div>
          </div>
        </div>
      )}

      {step === "verifying" && (
        <div className="space-y-4 max-w-sm">
          <div className="space-y-2">
            <Label htmlFor="mfa-code">Enter 6-digit Code</Label>
            <div className="flex gap-2">
              <Input 
                id="mfa-code"
                placeholder="123456" 
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                maxLength={6}
              />
              <Button onClick={finalizeEnrollment} disabled={isLoading || verificationCode.length < 6}>
                {isLoading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                Verify
              </Button>
            </div>
          </div>
          <p className="text-xs text-slate-500">Didn't receive code? <Button variant="link" size="sm" onClick={startEnrollment} className="p-0 h-auto">Resend</Button></p>
        </div>
      )}

      {step === "enrolled" && enrolledFactors.map((factor) => (
        <div key={factor.uid} className="flex items-center justify-between p-4 border rounded-xl bg-white shadow-sm dark:bg-slate-900">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900 dark:text-white">{factor.displayName || "Phone Number"}</p>
              <p className="text-xs text-slate-500">{factor.phoneNumber}</p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => disableMfa(factor.uid)}
            className="text-red-500 hover:text-red-600 hover:bg-red-50"
            disabled={isLoading}
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4 mr-2" />}
            Disable
          </Button>
        </div>
      ))}
    </div>
  );
}
