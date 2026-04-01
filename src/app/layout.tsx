import type { Metadata } from "next";

import { ConditionalFooter } from "@/components/conditional-footer";
import { SiteHeader } from "@/components/site-header";

import "./globals.css";

export const metadata: Metadata = {
  title: "PATİSİD — İyilik Haritası",
  description:
    "PATİSİD: Sokak hayvanlarına yardım, görev ve topluluk haritası.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body className="min-h-screen bg-zinc-50 text-zinc-900 antialiased">
        <div className="flex min-h-screen flex-col">
          <SiteHeader />
          <div className="flex min-h-0 flex-1 flex-col">{children}</div>
          <ConditionalFooter />
        </div>
      </body>
    </html>
  );
}
