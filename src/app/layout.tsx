import { AuthProvider, MenuProvider } from "@/context";
import "./globals.css";
import { Inter } from "next/font/google";
import type { Metadata } from "next";
import ReduxProvider from "@/redux-store/ReduxProvider";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Patty Kulcha",
  description:
    "PattyKulcha - Authentic Jamaican patties and deliciously stuffed kulchas delivered right to your doorstep. Experience a fusion of vibrant flavors, freshly made and served with love. Perfect for any occasion – breakfast, lunch, dinner, or a tasty snack!",
};

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
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
