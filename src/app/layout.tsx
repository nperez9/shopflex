'use client'
import Footer from "@/components/Footer/index";
import Header from "@/components/Header/index";
import Loader from "@/components/shared/Loader/index";
import { Inter } from "next/font/google";
import { useEffect, useState } from "react";
import "./globals.css";
import { usePathname } from 'next/navigation';

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [pageLoaded, setPageLoaded] = useState(false)
  const pathname = usePathname();

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com"/>
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&family=Zain:wght@200;300;400;700;800;900&display=swap" rel="stylesheet"/>
      </head>
      <body className={inter.className}>
        <Loader isAnimationFinish={setPageLoaded}/>
        <Header pageLoaded={pageLoaded}/>  
          {children}
        <Footer />
      </body>
    </html>
  );
}
