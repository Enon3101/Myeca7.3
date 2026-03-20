import React, { useState } from "react";
import { m, AnimatePresence } from "framer-motion";
import { 
  FileDown, 
  Mail, 
  Lock, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck,
  Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

interface LeadMagnetProps {
  title?: string;
  resourceName: string;
}

export const LeadMagnet: React.FC<LeadMagnetProps> = ({ 
  title = "Unlock the 2025 Compliance Checklist",
  resourceName 
}) => {
  const [step, setStep] = useState<"initial" | "form" | "success">("initial");
  const [email, setEmail] = useState("");
  const { toast } = useToast();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive"
      });
      return;
    }
    setStep("success");
    toast({
      title: "Success!",
      description: "Download link has been sent to your email.",
    });
  };

  return (
    <Card className="overflow-hidden border-2 border-dashed border-blue-200 bg-blue-50/30">
      <CardContent className="p-0">
        <AnimatePresence mode="wait">
          {step === "initial" && (
            <m.div
              key="initial"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-8 text-center"
            >
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <FileDown className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-2">{title}</h3>
              <p className="text-slate-600 mb-8 max-w-sm mx-auto font-medium">
                Get the exclusive 20-point checklist for {resourceName} curated by our Senior CAs. 
                Save ₹5,000 in potential penalties.
              </p>
              <Button 
                onClick={() => setStep("form")}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold h-12 px-8 rounded-xl shadow-lg flex items-center gap-2 mx-auto"
              >
                <Lock className="w-4 h-4" />
                Unlock Free PDF
              </Button>
              <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-500 font-bold uppercase tracking-widest">
                <ShieldCheck className="w-4 h-4" />
                No Spam Guaranteed
              </div>
            </m.div>
          )}

          {step === "form" && (
            <m.div
              key="form"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="p-8"
            >
              <div className="text-center mb-8">
                <h3 className="text-xl font-black text-slate-900 mb-2">Where should we send it?</h3>
                <p className="text-sm text-slate-500">Your personalized checklist is ready for download.</p>
              </div>
              
              <form onSubmit={handleSubscribe} className="space-y-4 max-w-sm mx-auto">
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <Input 
                    placeholder="Enter your email address" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-12 h-14 rounded-xl border-slate-200 focus:ring-blue-500"
                  />
                </div>
                <Button className="w-full bg-blue-600 text-white font-black h-14 rounded-xl shadow-xl shadow-blue-500/20 group">
                  Get My Checklist
                  <ArrowRight className="ml-2 w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
                </Button>
              </form>
              
              <Button 
                variant="link" 
                onClick={() => setStep("initial")}
                className="w-full mt-4 text-slate-400 text-xs font-bold"
              >
                Go Back
              </Button>
            </m.div>
          )}

          {step === "success" && (
            <m.div
              key="success"
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-8 text-center"
            >
              <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-10 h-10 text-emerald-600" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-2">Check your inbox!</h3>
              <p className="text-slate-600 mb-8 max-w-sm mx-auto">
                We've sent the **{resourceName} Guide** to **{email}**. 
                Check your spam folder just in case.
              </p>
              <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl inline-flex items-center gap-2 mb-6 text-emerald-700 font-bold">
                <Zap className="w-5 h-5 animate-pulse" />
                Bonus: 15% discount code inside!
              </div>
              <br />
              <Button 
                variant="outline" 
                onClick={() => setStep("initial")}
                className="border-slate-200 font-bold"
              >
                Download another resource
              </Button>
            </m.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
};

export default LeadMagnet;
