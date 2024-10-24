import { AuthProvider, MenuProvider } from "@/context";
import "./globals.css";
import { Inter } from "next/font/google";
import type { Metadata } from "next";
import ReduxProvider from "@/redux-store/ReduxProvider";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Pattykulcha",
  description:
    "Special Amritsari Kulcha, Paneer Kulcha, Aloo Kulcha, Gobi Kulcha, Onion Kulcha—at PattyKulcha, we deliver the authentic flavors of Punjab. Each dish is made fresh to order, bringing tradition to your table. Explore our menu and order online today!",
  keywords: [
    "Special Amritsari Kulcha",
    "Paneer Kulcha",
    "Aloo Kulcha",
    "Gobi Kulcha",
    "flavors of Punjab",
    "Amritsari Special Kulcha",
    "Amritsari Kulcha",
    "Onion Kulcha",
    "GTA",
    "Mississauga",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <title>{metadata?.title as string}</title>
        <meta name="description" content={metadata?.description as string} />
        <meta
          name="keywords"
          content={(metadata?.keywords as string[]).join(", ")}
        />
        <link
          rel="icon"
          href="/images/favicon-32x32.png"
          type="image/png"
          sizes="132x132"
        />
        <Script id="structured-data" type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            url: "https://www.pattykulcha.com/",
            logo: "/images/logo.png",
            // name: "Patty Kulcha",
          })}
        </Script>

        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-TZBK3DHJXT"
        />
        <Script id="google-analytics">
          {`window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-TZBK3DHJXT');
          `}
        </Script>
        <Script
          async
          defer
          src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_API_KEY}&libraries=places`}
        ></Script>
      </head>
      <body>
        <AuthProvider>
          <MenuProvider>
            <ReduxProvider>{children}</ReduxProvider>
          </MenuProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
