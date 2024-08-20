import { MenuProvider } from "@/context"
export const metadata = {
  title: 'Patty Kulcha',
  description: 'Generated by Next.js',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (<>{children}</>)
}
