import React from "react";
import { Check, X, Shield, Clock, Calculator, UserCheck, Smartphone } from "lucide-react";
import { cn } from "@/lib/utils";

const comparisonData = [
  {
    feature: "CA Review",
    myeCA: "Every return manually reviewed by a named CA",
    diy: "None - You're on your own",
    other: "AI/Bot review or optional batch review",
    icon: UserCheck
  },
  {
    feature: "Refund Optimization",
    myeCA: "Maximum refund guaranteed (Section 80C, 80D, etc.)",
    diy: "Likely to miss common deductions",
    other: "Basic automated deduction matching",
    icon: Calculator
  },
  {
    feature: "Accuracy Guarantee",
    myeCA: "Professional liability assumed for every filing",
    diy: "High risk of notices due to errors",
    other: "Standard disclaimer - no liability",
    icon: Shield
  },
  {
    feature: "Filing Speed",
    myeCA: "Done in 15 mins; CA review within 24 hours",
    diy: "Hours of manual data entry",
    other: "3-5 business days for batch processing",
    icon: Clock
  },
  {
    feature: "Post-Filing Support",
    myeCA: "Year-round expert assistance for tax notices",
    diy: "None",
    other: "Paid add-ons or bot support only",
    icon: Smartphone
  }
];

export function ComparisonTable() {
  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full border-collapse bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-200">
        <thead>
          <tr className="bg-slate-50/50">
            <th className="p-6 text-left text-sm font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Feature</th>
            <th className="p-6 text-left border-b border-slate-100 bg-blue-50/30">
              <div className="flex items-center gap-2">
                <span className="text-lg font-black text-blue-600">MyeCA.in</span>
                <span className="px-2 py-0.5 bg-blue-600 text-[10px] text-white font-bold rounded-full uppercase tracking-tighter">Recommended</span>
              </div>
            </th>
            <th className="p-6 text-left text-sm font-bold text-slate-600 border-b border-slate-100">DIY / Govt Portal</th>
            <th className="p-6 text-left text-sm font-bold text-slate-600 border-b border-slate-100">Other Platforms</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {comparisonData.map((item, idx) => {
            const Icon = item.icon;
            return (
              <tr key={idx} className="hover:bg-slate-50/50 transition-colors group">
                <td className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-blue-600 group-hover:bg-blue-50 transition-all">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="block font-bold text-slate-900">{item.feature}</span>
                    </div>
                  </div>
                </td>
                <td className="p-6 bg-blue-50/10">
                  <div className="flex items-start gap-2">
                    <div className="mt-0.5 p-0.5 bg-emerald-100 text-emerald-600 rounded-full shrink-0">
                      <Check className="w-3.5 h-3.5" strokeWidth={3} />
                    </div>
                    <span className="text-sm font-semibold text-slate-800">{item.myeCA}</span>
                  </div>
                </td>
                <td className="p-6">
                  <div className="flex items-start gap-2">
                    <div className="mt-0.5 p-0.5 bg-rose-100 text-rose-600 rounded-full shrink-0">
                      <X className="w-3.5 h-3.5" strokeWidth={3} />
                    </div>
                    <span className="text-sm text-slate-500 font-medium">{item.diy}</span>
                  </div>
                </td>
                <td className="p-6">
                  <div className="flex items-start gap-2 opacity-70">
                    <div className="mt-0.5 p-0.5 bg-amber-100 text-amber-600 rounded-full shrink-0">
                      <X className="w-3.5 h-3.5" strokeWidth={3} />
                    </div>
                    <span className="text-sm text-slate-500 font-medium">{item.other}</span>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
