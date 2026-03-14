import fs from 'fs';
import path from 'path';

const logos = [
  "/assets/logos/reliance.png",
  "/assets/logos/infosys.png",
  "/assets/logos/hdfc.png",
  "/assets/logos/icici.png",
  "/assets/logos/sbi.png",
  "/assets/logos/lic.png",
  "/assets/logos/Tata_Consultancy_Services_old_logo.svg",
  "/assets/logos/Wipro_Primary_Logo_Color_RGB.svg",
  "/assets/logos/ITC_Limited_Logo.svg",
  "/assets/logos/hindustan-unilever.svg",
  "/assets/logos/airtel.svg",
  "/assets/logos/Asian_Paints_Logo.svg",
  "/assets/logos/Paytm_Logo_(standalone).svg",
  "/assets/logos/Zomato_Logo.svg",
  "/assets/logos/DLF_logo.svg",
  "/assets/logos/Godrej_Logo.svg",
  "/assets/logos/amul.svg",
  "/assets/logos/mahindra.svg",
  "/assets/logos/bajaj-finserv.svg",
  "/assets/logos/Tata_Steel_Logo.svg",
  "/assets/logos/Tanishq_Logo.svg",
  "/assets/logos/Raymond_logo.svg",
  "/assets/logos/hero.svg",
  "/assets/logos/Ola_Cabs_logo.svg",
  "/assets/logos/dunzo.svg",
  "/assets/logos/Justdial_Logo.svg",
  "/assets/logos/T-series-logo.svg",
  "/assets/logos/TATA_1mg_Logo.svg",
  "/assets/logos/phonepe.svg",
  "/assets/logos/Adani_Green_Energy_logo.svg",
  "/assets/logos/BalajiWafersLogo.svg",
  "/assets/logos/Indiabulls_Home_Loans_Logo.svg",
  "/assets/logos/Snapdeal_branding_logo.svg",
  "/assets/logos/tata.svg",
  "/assets/logos/Videocon_logo.svg",
  "/assets/logos/ZOHO.svg"
];

const publicPath = path.join(process.cwd(), 'client', 'public');

logos.forEach(logo => {
  const fullPath = path.join(publicPath, logo);
  if (!fs.existsSync(fullPath)) {
    console.log(`MISSING: ${logo}`);
  } else {
    // console.log(`EXISTS: ${logo}`);
  }
});
