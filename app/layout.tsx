import type { Metadata } from "next";
import { Bricolage_Grotesque } from "next/font/google";
import "./globals.css";
import ConvexClientProvider from "@/components/convex-client-provider";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/sonner";

const bricolageGrotesque = Bricolage_Grotesque({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Accountabillibuddy",
  description: "Your accountability buddy",
  icons: {
    icon: "/convex.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${bricolageGrotesque.className} antialiased`}>
        <ClerkProvider dynamic>
          <ConvexClientProvider>
            {children}
            <Toaster />
          </ConvexClientProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
