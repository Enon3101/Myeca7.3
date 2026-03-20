import { m } from "framer-motion";
import { useState } from "react";
import MetaSEO from "@/components/seo/MetaSEO";
import Breadcrumb from "@/components/Breadcrumb";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Shield, Clock, Award, Users, Star, ArrowRight, Phone, Calculator, FileText, HeadphonesIcon, Zap } from "lucide-react";
import { Link } from "wouter";
import PricingSection from "@/components/PricingSection";
import CTASection from "@/components/CTASection";

// FAQ Component for pricing page
const PricingFAQ = () => {
  const [openFAQ, setOpenFAQ] = useState<number | null>(0);

  const faqs = [
    {
      question: "What's included in the FREE plan?",
      answer: "The FREE plan includes ITR-1 filing, Form 16 auto-import, basic tax calculations, e-verification, and email support. Perfect for simple salary returns with no additional income sources."
    },
    {
      question: "Can I upgrade from FREE to CA Expert plan later?",
      answer: "Yes! You can upgrade anytime. If you start with FREE filing and need expert help, you can easily upgrade to CA Expert plan and get full CA consultation and review."
    },
    {
      question: "What makes the CA Expert plan worth ₹1,499?",
      answer: "You get 90-minute dedicated CA consultation, support for all ITR forms (1-4), real-time tax optimization, priority support, post-filing assistance, and maximum refund guarantee. The average tax savings is ₹15,000+."
    },
    {
      question: "Is there any hidden cost or annual subscription?",
      answer: "No hidden costs! All pricing is transparent and one-time for the current assessment year. No annual subscriptions or recurring charges. What you see is what you pay."
    },
    {
      question: "How secure is my financial data?",
      answer: "We use ISO 27001 certified security with bank-grade 256-bit SSL encryption. Your data is stored securely and never shared with third parties. We're compliant with all Indian data protection regulations."
    },
    {
      question: "What if I'm not satisfied with the service?",
      answer: "We offer 100% money-back guarantee within 30 days. If you're not completely satisfied with our service, we'll refund your full payment, no questions asked."
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <m.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Everything you need to know about our pricing plans
          </p>
        </m.div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <m.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="p-6 cursor-pointer hover:shadow-lg transition-all duration-300">
                <div 
                  className="flex justify-between items-center"
                  onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
                >
                  <h3 className="text-lg font-semibold text-gray-900 pr-4">
                    {faq.question}
                  </h3>
                  <div className={`transform transition-transform duration-300 ${openFAQ === index ? 'rotate-45' : ''}`}>
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-bold text-xl">+</span>
                    </div>
                  </div>
                </div>
                {openFAQ === index && (
                  <m.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-4 pt-4 border-t border-gray-200"
                  >
                    <p className="text-gray-600 leading-relaxed">
                      {faq.answer}
                    </p>
                  </m.div>
                )}
              </Card>
            </m.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Testimonials Component
const PricingTestimonials = () => {
  const testimonials = [
    {
      name: "Priya Sharma",
      role: "Software Engineer",
      content: "MyeCA.in saved me ₹18,000 in taxes with their CA Expert plan. The consultation was thorough and the filing process was seamless.",
      rating: 5,
      savings: "₹18,000"
    },
    {
      name: "Rajesh Kumar",
      role: "Business Owner",
      content: "Used the LIVE Premium CA plan for my business returns. The dedicated support and notice handling service is exceptional.",
      rating: 5,
      savings: "₹45,000"
    },
    {
      name: "Anita Patel",
      role: "Marketing Manager",
      content: "Started with FREE plan and upgraded to CA Expert. The transition was smooth and I got maximum refund as promised.",
      rating: 5,
      savings: "₹12,500"
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <m.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            What Our Customers Say
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Join thousands who've maximized their tax savings with us
          </p>
        </m.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <m.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="p-6 h-full hover:shadow-lg transition-all duration-300">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4 italic">
                  "{testimonial.content}"
                </p>
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                  <Badge className="bg-green-100 text-green-800 font-semibold">
                    Saved {testimonial.savings}
                  </Badge>
                </div>
              </Card>
            </m.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default function PricingPage() {
  return (
    <>
      <MetaSEO 
        title={"ITR Filing Pricing - ₹499 DIY to ₹1,499 CA Expert | MyeCA.in"}
        description={"Transparent ITR filing pricing. Choose FREE DIY plan or CA Expert Assisted plan starting at ₹1,499. Maximum refund guarantee with 15L+ happy customers."}
        keywords={[
          "ITR filing price", "income tax return cost", "CA charges", "tax filing fees", 
          "ITR-1 price", "ITR-2 charges", "tax consultant fees", "maximum tax refund"
        ]}
        type="service"
        serviceData={{
          price: "1499",
          rating: "4.8",
          reviews: "15000",
          availability: "https://schema.org/InStock"
        }}
        breadcrumbs={[
          { name: "Home", url: "/" },
          { name: "Pricing", url: "/pricing" }
        ]}
      />
      <div className="mobile-safe-bottom bg-white min-h-screen">
        <Breadcrumb items={[{ name: 'Pricing' }]} />
        
        {/* Simple Hero */}
        <section className="pt-12 pb-6 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <m.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-3xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">
                Simple <span className="text-blue-600">Transparent</span> Pricing
              </h1>
              <p className="text-lg text-slate-500 max-w-2xl mx-auto">
                No surprises. No hidden costs. Choose the plan that best suits your tax situation.
              </p>
            </m.div>
          </div>
        </section>

        <PricingSection />
        <PricingTestimonials />
        <PricingFAQ />
        
        {/* Simplified Final CTA */}
        <section className="py-20 bg-blue-50 text-slate-900 overflow-hidden relative border-t border-blue-100">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/5 rounded-full blur-[120px] -mr-48 -mt-48 transition-all"></div>
          <div className="container mx-auto px-4 text-center relative z-10">
            <h2 className="text-3xl md:text-5xl font-black mb-6 tracking-tight text-slate-900">
              Ready to <span className="text-blue-600">Maximize</span> Your Refund?
            </h2>
            <p className="text-xl text-slate-500 mb-10 max-w-2xl mx-auto font-medium">
              Join 1.5 million+ taxpayers who trust MyeCA.in for accuracy and speed.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/itr/compact-filing">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-7 rounded-2xl text-lg font-bold shadow-xl shadow-blue-500/20 w-full sm:w-auto border-none">
                  Get Started for Free
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline" className="border-slate-200 text-slate-700 hover:bg-white hover:text-blue-600 px-10 py-7 rounded-2xl text-lg font-bold w-full sm:w-auto bg-white transition-colors">
                  Contact Support
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
