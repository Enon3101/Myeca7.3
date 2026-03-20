import React, { useState, useMemo } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Bookmark, 
  ChevronRight, 
  Search, 
  BookOpen, 
  ArrowUpRight, 
  MessageCircle,
  Hash,
  Filter
} from "lucide-react";
import { cn } from "@/lib/utils";

const glossaryTerms = [
  { term: "ITR-1 (Sahaj)", category: "Compliance", definition: "The simplest income tax return form for residents with total income up to ₹50 lakh from salary, one house property, and other sources.", href: "/itr/filing" },
  { term: "Section 80C", category: "Deductions", definition: "A popular tax deduction section allowing individuals to save up to ₹1.5 lakh by investing in PPF, ELSS, Insurance, etc.", href: "/calculators/income-tax" },
  { term: "TDS", category: "Direct Tax", definition: "Tax Deducted at Source is a means of collecting direct tax by the government at the very source of income.", href: "/calculators/tds" },
  { term: "SIP", category: "Investment", definition: "Systematic Investment Plan is a disciplined way of investing fixed amounts in mutual funds at regular intervals.", href: "/calculators/sip" },
  { term: "Form 16", category: "Documents", definition: "A certificate issued by an employer detailing the salary paid and the tax deducted (TDS) from the employee's income.", href: "/form16-parser" },
  { term: "GSTIN", category: "Business", definition: "Unique 15-digit identifier for every registered business under the Goods and Services Tax system in India.", href: "/services/gst-registration" },
  { term: "Form 26AS", category: "Reports", definition: "An annual consolidated tax statement showing tax deducted, collected, and paid against your PAN.", href: "/ais-viewer" },
  { term: "HRA Exemption", category: "Allowance", definition: "Exemption on House Rent Allowance under Section 10(13A) for employees living in rented accommodation.", href: "/calculators/hra" },
  { term: "AIS", category: "Reports", definition: "Annual Information Statement provides a comprehensive view of a taxpayer's financial transactions.", href: "/ais-viewer" },
  { term: "LTCG", category: "Capital Gains", definition: "Profit from the sale of a capital asset held for more than a specified period (usually 1-3 years).", href: "/calculators/capital-gains" },
  { term: "Advance Tax", category: "Direct Tax", definition: "Pre-payment of income tax in installments during the financial year.", href: "/calculators/advance-tax" },
  { term: "Standard Deduction", category: "Deductions", definition: "A flat deduction allowed from gross salary, providing tax relief without needing investment proofs.", href: "/calculators/income-tax" }
];

export default function FinancialGlossary() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = useMemo(() => {
    const uniqueCats = Array.from(new Set(glossaryTerms.map(t => t.category)));
    return ["All", ...uniqueCats];
  }, []);

  const filteredTerms = useMemo(() => {
    return glossaryTerms.filter(t => {
      const matchesSearch = t.term.toLowerCase().includes(search.toLowerCase()) || 
                           t.definition.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = activeCategory === "All" || t.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [search, activeCategory]);

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(37,99,235,0.03),transparent)] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between mb-16 gap-8">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold mb-4 uppercase tracking-wider">
              <BookOpen className="w-3 h-3" />
              Learning Center
            </div>
            <h2 className="text-4xl lg:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
              Smart Tax <span className="text-blue-600">Glossary</span>
            </h2>
            <p className="text-lg text-slate-500 font-medium leading-relaxed">
              Demystifying Indian taxation Jargon. Simplified definitions for smarter financial decisions.
            </p>
          </div>
          
          <div className="w-full lg:w-auto flex flex-col sm:flex-row gap-4">
             <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                <Input 
                  placeholder="Search tax terms..." 
                  className="pl-12 h-14 w-full sm:w-[320px] rounded-2xl bg-slate-50 border-slate-100 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all text-base"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
             </div>
          </div>
        </div>

        {/* Categories Bar */}
        <div className="flex items-center gap-2 mb-10 overflow-x-auto pb-4 scrollbar-hide no-scrollbar">
          <div className="flex items-center gap-2 px-4 border-r border-slate-200 mr-2 text-slate-400">
             <Filter className="w-4 h-4" />
             <span className="text-xs font-bold uppercase tracking-widest whitespace-nowrap">Filter</span>
          </div>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "px-6 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap",
                activeCategory === cat 
                  ? "bg-slate-900 text-white shadow-lg shadow-slate-200" 
                  : "bg-slate-50 text-slate-500 hover:bg-slate-100 border border-transparent hover:border-slate-200"
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Glossary Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTerms.length > 0 ? (
            filteredTerms.map((item, index) => (
              <Link key={index} href={item.href || "#"}>
                <div className="group relative bg-white border border-slate-200/60 rounded-[32px] p-8 h-full transition-all duration-500 hover:shadow-[0_22px_60px_-15px_rgba(0,0,0,0.08)] hover:-translate-y-2 cursor-pointer flex flex-col">
                  <div className="flex items-center justify-between mb-6">
                    <span className="px-3 py-1 rounded-lg bg-slate-50 text-slate-500 text-[10px] font-black uppercase tracking-widest">
                      {item.category}
                    </span>
                    <ArrowUpRight className="w-5 h-5 text-slate-300 group-hover:text-blue-600 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight group-hover:text-blue-600 transition-colors">
                    {item.term}
                  </h3>
                  
                  <p className="text-[15px] text-slate-500 leading-relaxed font-medium mb-8">
                    {item.definition}
                  </p>
                  
                  <div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between">
                     <span className="text-[11px] font-bold text-blue-600 uppercase tracking-widest">Explore Topic</span>
                     <div className="h-1.5 w-1.5 rounded-full bg-blue-100 group-hover:w-8 group-hover:bg-blue-600 transition-all duration-500"></div>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-full py-20 text-center bg-slate-50 rounded-[40px] border border-dashed border-slate-200">
               <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                  <Search className="w-6 h-6 text-slate-300" />
               </div>
               <h3 className="text-xl font-bold text-slate-900">No terms found</h3>
               <p className="text-slate-500 mt-2">Try searching for something else like "ITR" or "TDS"</p>
            </div>
          )}
        </div>

        {/* Feature Banner */}
        <div className="mt-24 relative rounded-[3rem] overflow-hidden bg-slate-900 p-12 lg:p-16 flex flex-col lg:flex-row items-center justify-between gap-12 group">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-blue-600/10 to-transparent pointer-events-none"></div>
          <div className="relative z-10 max-w-xl">
             <div className="inline-flex items-center gap-2 p-2 rounded-xl bg-slate-800 text-slate-300 text-[11px] font-bold uppercase tracking-widest mb-6 border border-slate-700">
                <Hash className="w-3 h-3 text-blue-400" />
                Expert Support
             </div>
             <h4 className="text-3xl lg:text-4xl font-extrabold text-white mb-4 tracking-tight leading-tight">
                Still confused about <span className="text-blue-400">Tax Jargon?</span>
             </h4>
             <p className="text-lg text-slate-400 font-medium">
                Our expert CAs handle the complexity so you don't have to. Real experts, real advice.
             </p>
          </div>
          <div className="relative z-10 flex flex-col sm:flex-row gap-4">
             <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-[1.5rem] px-10 h-16 text-lg font-bold shadow-2xl shadow-blue-500/30 transition-all hover:scale-105 group">
                Connect with a CA
                <MessageCircle className="w-5 h-5 ml-2 group-hover:rotate-12 transition-transform" />
             </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
