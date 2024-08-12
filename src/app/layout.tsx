import { AuthProvider, MenuProvider } from "@/context"
import "./globals.css";
import { Inter } from "next/font/google";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PattyKulcha",
  description: "Food website",
};


const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {

  return (
    <html lang="en">
        <body>
          <AuthProvider>
              <MenuProvider>
                {children}
              </MenuProvider>
          </AuthProvider>
        </body>
    </html>
  )
}
