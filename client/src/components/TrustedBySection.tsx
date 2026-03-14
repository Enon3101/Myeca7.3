import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Star } from "lucide-react";
import { companyTestimonials } from "@/data/testimonials";
import { LazyImage } from "@/components/performance/LazyImage";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Authentic company logos using uploaded SVG files
const companyLogos = [
  { name: "Reliance Industries", logoPath: "/assets/logos/reliance.png" },
  { name: "Infosys", logoPath: "/assets/logos/infosys.png" },
  { name: "HDFC Bank", logoPath: "/assets/logos/hdfc.png" },
  { name: "ICICI Bank", logoPath: "/assets/logos/icici.png" },
  { name: "SBI", logoPath: "/assets/logos/sbi.png" },
  { name: "LIC", logoPath: "/assets/logos/lic.png" },
  { name: "TCS", logoPath: "/assets/logos/Tata_Consultancy_Services_old_logo.svg" },
  { name: "Wipro", logoPath: "/assets/logos/Wipro_Primary_Logo_Color_RGB.svg" },
  { name: "ITC", logoPath: "/assets/logos/ITC_Limited_Logo.svg" },
  { name: "Hindustan Unilever", logoPath: "/assets/logos/hindustan-unilever.svg" },
  { name: "Airtel", logoPath: "/assets/logos/airtel.svg" },
  { name: "Asian Paints", logoPath: "/assets/logos/Asian_Paints_Logo.svg" },
  { name: "Paytm", logoPath: "/assets/logos/Paytm_Logo_(standalone).svg" },
  { name: "Zomato", logoPath: "/assets/logos/Zomato_Logo.svg" },
  { name: "DLF", logoPath: "/assets/logos/DLF_logo.svg" },
  { name: "Godrej", logoPath: "/assets/logos/Godrej_Logo.svg" },
  { name: "Amul", logoPath: "/assets/logos/amul.svg" },
  { name: "Mahindra", logoPath: "/assets/logos/mahindra.svg" },
  { name: "Bajaj Finserv", logoPath: "/assets/logos/bajaj-finserv.svg" },
  { name: "TATA Steel", logoPath: "/assets/logos/Tata_Steel_Logo.svg" },
  { name: "Tanishq", logoPath: "/assets/logos/Tanishq_Logo.svg" },
  { name: "Raymond", logoPath: "/assets/logos/Raymond_logo.svg" },
  { name: "Hero", logoPath: "/assets/logos/hero.svg" },
  { name: "Ola", logoPath: "/assets/logos/Ola_Cabs_logo.svg" },
  { name: "Dunzo", logoPath: "/assets/logos/dunzo.svg" },
  { name: "Justdial", logoPath: "/assets/logos/Justdial_Logo.svg" },
  { name: "T-Series", logoPath: "/assets/logos/T-series-logo.svg" },
  { name: "TATA 1mg", logoPath: "/assets/logos/TATA_1mg_Logo.svg" },
  { name: "PhonePe", logoPath: "/assets/logos/phonepe.svg" },
  { name: "Adani Green Energy", logoPath: "/assets/logos/Adani_Green_Energy_logo.svg" },
  { name: "Balaji Wafers", logoPath: "/assets/logos/BalajiWafersLogo.svg" },
  { name: "Indiabulls", logoPath: "/assets/logos/Indiabulls_Home_Loans_Logo.svg" },
  { name: "Snapdeal", logoPath: "/assets/logos/Snapdeal_branding_logo.svg" },
  { name: "TATA", logoPath: "/assets/logos/tata.svg" },
  { name: "Videocon", logoPath: "/assets/logos/Videocon_logo.svg" },
  { name: "ZOHO", logoPath: "/assets/logos/ZOHO.svg" }
];

export default function TrustedBySection() {
  return (
    <section id="trusted-by" className="py-20 bg-white border-y border-gray-100 scroll-mt-20 overflow-visible">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 overflow-visible">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6 tracking-tight">
            Trusted by Professionals from India's Largest Entities
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Building trust through 100% CA-reviewed filings. Accurate. Secure. Seamless.
          </p>
        </motion.div>

        {/* Statistics - Enhanced Aesthetics */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 mb-20"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {[
            { label: "Security", val: "ISO 27001", sub: "Certified Platform" },
            { label: "Identity", val: "ERI Regd.", sub: "Govt. Intermediary" },
            { label: "Accuracy", val: "100%", sub: "CA-Reviewed Returns" },
            { label: "Rating", val: "4.8/5", sub: "User Satisfaction" }
          ].map((stat, i) => (
            <div key={i} className="text-center p-6 rounded-2xl bg-gradient-to-b from-gray-50/50 to-white border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="text-2xl md:text-3xl font-black text-blue-600 mb-1">{stat.val}</div>
              <div className="text-gray-900 text-sm font-bold tracking-wide uppercase italic">{stat.label}</div>
              <div className="text-gray-400 text-[11px] font-medium mt-1">{stat.sub}</div>
            </div>
          ))}
        </motion.div>

        {/* Company Logos - Compact Infinite Carousel */}
        <div className="relative py-6 overflow-visible">
          {/* Gradient Masks */}
          <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-white to-transparent z-20 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-white to-transparent z-20 pointer-events-none" />
          
          <div className="overflow-hidden">
            <motion.div
              className="flex items-center"
              animate={{ x: [0, "-50%"] }}
              transition={{
                x: {
                  repeat: Infinity,
                  repeatType: "loop",
                  duration: 221,
                  ease: "linear",
                },
              }}
              style={{ width: "fit-content" }}
            >
              {[0, 1].map((setIndex) => (
                <div key={`set-${setIndex}`} className="flex items-center">
                  {companyLogos.map((company, index) => (
                    <motion.div
                      key={`${company.name}-${setIndex}-${index}`}
                      className="flex items-center justify-center w-72 h-28 flex-shrink-0 group relative mx-10"
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.3, type: "spring", stiffness: 200 }}
                    >
                      <div className="relative z-10 w-full h-full flex items-center justify-center px-4">
                        <LazyImage 
                          src={company.logoPath} 
                          alt={`${company.name} logo`}
                          priority={true}
                          className="w-full h-full flex items-center justify-center p-2"
                          imgClassName="max-w-full max-h-20 object-contain transition-all duration-500 opacity-70 group-hover:opacity-100 filter brightness-110 contrast-[1.05]"
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
