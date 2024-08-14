import { AuthProvider, MenuProvider } from "@/context";
import "./globals.css";
import type { Metadata } from "next";
import ReduxProvider from "@/redux-store/ReduxProvider";

export const metadata: Metadata = {
  title: "PattyKulcha",
  description: "Food website",
};


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
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
