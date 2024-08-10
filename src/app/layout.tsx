import { AuthProvider, MenuProvider } from "@/context"
import "./globals.css";
import { Inter } from "next/font/google";

export const metadata = {
  title: 'PattyKulcha',
  description: '',
}

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  return (
    <html lang="en">
        <AuthProvider>
            <MenuProvider>
                <body>{children}</body>
            </MenuProvider>
        </AuthProvider>
    </html>
  )
}
