import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import Navbar from "@/views/navbar";
import Footer from "@/views/footer";
import { MenuProvider } from "@/context";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <MenuProvider>
        <body className="flex flex-col overflow-y-auto">
          <Navbar />

          <div>{children}</div>

          <Footer />
        </body>
      </MenuProvider>
    </html>
  );
}
