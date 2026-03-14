import React from "react";
import { Helmet } from "react-helmet-async";
import { useLocation } from "wouter";

type BreadcrumbItem = { name: string; url: string };
type FAQItem = { question: string; answer: string };

interface MetaSEOProps {
  title: string;
  description: string;
  keywords?: string | string[];
  canonicalUrl?: string;
  ogImage?: string;
  twitterImage?: string;
  type?: "website" | "article" | "service" | "calculator" | string;
  breadcrumbs?: BreadcrumbItem[];
  faqPageData?: FAQItem[];
  localBusinessData?: Record<string, any>;
  calculatorData?: {
    type: string;
    features: string[];
    accuracy: string;
    updates: string;
  };
  serviceData?: {
    price: string;
    rating: string;
    reviews: string;
    availability: string;
  };
  jsonLd?: Record<string, any> | Record<string, any>[];
}

export const MetaSEO: React.FC<MetaSEOProps> = ({
  title,
  description,
  keywords,
  canonicalUrl,
  ogImage = "https://myeca.in/og-image.jpg",
  twitterImage,
  type = "website",
  breadcrumbs,
  faqPageData,
  localBusinessData,
  calculatorData,
  serviceData,
  jsonLd: extraJsonLd,
}) => {
  const [location] = useLocation();
  const currentUrl = canonicalUrl || `https://myeca.in${location}`;
  const siteName = "MyeCA.in - Expert Tax Filing Services";

  const keywordStr = Array.isArray(keywords) ? keywords.join(", ") : keywords;

  // Build JSON-LD blocks
  const jsonLdBlocks: any[] = [];

  // 1. Breadcrumbs
  if (breadcrumbs && breadcrumbs.length) {
    jsonLdBlocks.push({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: breadcrumbs.map((b, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: b.name,
        item: b.url.startsWith("http") ? b.url : `https://myeca.in${b.url}`,
      })),
    });
  }

  // 2. FAQ
  if (faqPageData && faqPageData.length) {
    jsonLdBlocks.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqPageData.map((q) => ({
        "@type": "Question",
        name: q.question,
        acceptedAnswer: { "@type": "Answer", text: q.answer },
      })),
    });
  }

  // 3. Local Business (usually for homepage)
  if (localBusinessData) {
    jsonLdBlocks.push({
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      ...localBusinessData,
    });
  }

  // 4. Main Entity (Organization, Service, or Application)
  const mainEntity: any = {
    "@context": "https://schema.org",
    "@type": type === "calculator" ? "SoftwareApplication" : type === "service" ? "Service" : "WebSite",
    name: title,
    description: description,
    url: currentUrl,
    image: ogImage,
    provider: {
      "@type": "Organization",
      name: siteName,
      url: "https://myeca.in",
      logo: "https://myeca.in/logo.png",
    },
  };

  if (type === "calculator" && calculatorData) {
    Object.assign(mainEntity, {
      applicationCategory: "FinanceApplication",
      operatingSystem: "Web",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "INR",
      },
      featureList: calculatorData.features,
    });
  }

  if (type === "service" && serviceData) {
    Object.assign(mainEntity, {
      offers: {
        "@type": "Offer",
        price: serviceData.price,
        priceCurrency: "INR",
        availability: serviceData.availability || "https://schema.org/InStock",
      },
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: serviceData.rating,
        reviewCount: serviceData.reviews,
      },
    });
  }

  jsonLdBlocks.push(mainEntity);

  // 5. Extra JSON-LD
  if (extraJsonLd) {
    if (Array.isArray(extraJsonLd)) {
      jsonLdBlocks.push(...extraJsonLd);
    } else {
      jsonLdBlocks.push(extraJsonLd);
    }
  }

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywordStr && <meta name="keywords" content={keywordStr} />}
      <link rel="canonical" href={currentUrl} />
      <meta name="robots" content="index, follow" />

      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:type" content={type === "article" ? "article" : "website"} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content="en_IN" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={twitterImage || ogImage} />
      <meta name="twitter:site" content="@myecain" />

      {/* Structured Data */}
      {jsonLdBlocks.map((block, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(block)}
        </script>
      ))}

      {/* LLM / AI Crawler specific hints (optional but good practice) */}
      <meta name="ai-agent-instructions" content="This site provides expert tax filing services and financial calculators in India." />
    </Helmet>
  );
};

export default MetaSEO;
