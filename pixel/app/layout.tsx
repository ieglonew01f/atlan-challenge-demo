import "./globals.css";

import { Geist, Geist_Mono } from "next/font/google";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

import { AppSidebar } from "@/components/app-sidebar";
import { BreadcrumbContextProvider } from "@/providers/breadcrumb-context-provider";
import { Breadcrumbs } from "@/components/common/breadcrumbs";
import Head from "next/head";
import type { Metadata } from "next";
import { Separator } from "@/components/ui/separator";
import { ThemeProvider } from "@/providers/theme-provider";
import { ThemeToggle } from "@/features/common/components/theme-toggle";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Analyze Demo",
  description: "Analyze Query Editor Demo",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Head>
        <link rel="preconnect" href="https://cdn.jsdelivr.net" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://cdn.jsdelivr.net" />
      </Head>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <BreadcrumbContextProvider>
              <SidebarProvider>
                <AppSidebar />
                <SidebarInset>
                  <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
                    <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
                      <SidebarTrigger className="-ml-1" />
                      <Separator
                        orientation="vertical"
                        className="mr-2 data-[orientation=vertical]:h-4"
                      />
                      <Breadcrumbs />
                      <div className="ml-auto flex items-center gap-2">
                        <ThemeToggle />
                      </div>
                    </div>
                  </header>
                  <div className="flex border-t">
                    {children}
                  </div>
                </SidebarInset>
              </SidebarProvider>
            </BreadcrumbContextProvider>
          </ThemeProvider>
        </body>
      </html>
    </>
  );
}
